const { Pool } = require('pg');
const process = require('process');

// 从环境变量获取数据库连接信息
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 初始化数据库（只在冷启动时运行一次）
let dbInitialized = false;

async function initDatabase() {
  if (dbInitialized) return;
  dbInitialized = true;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS problems (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      class VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      problem_name VARCHAR(255) REFERENCES problems(name) ON DELETE CASCADE,
      username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
      difficult FLOAT NOT NULL,
      quality FLOAT NOT NULL,
      ip VARCHAR(255) NOT NULL,
      UNIQUE(problem_name, username)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_key VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      expires TIMESTAMP NOT NULL
    )
  `);
}

// 会话管理
const session = {
  create: async (username) => {
    const sessionKey = 'session_' + Array(24).fill().map(() => Math.floor(Math.random() * 10)).join('');
    const expires = new Date(Date.now() + 1200000); // 20分钟
    
    await pool.query(
      'INSERT INTO sessions (session_key, username, expires) VALUES ($1, $2, $3)',
      [sessionKey, username, expires]
    );
    
    return sessionKey;
  },
  
  validate: async (sessionKey) => {
    const result = await pool.query(
      'SELECT username FROM sessions WHERE session_key = $1 AND expires > CURRENT_TIMESTAMP',
      [sessionKey]
    );
    
    return result.rows[0]?.username || false;
  },
  
  invalidate: async (sessionKey) => {
    await pool.query(
      'DELETE FROM sessions WHERE session_key = $1',
      [sessionKey]
    );
  }
};

// 登录管理
const login = {
  login: async (username, password) => {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0 || userResult.rows[0].password !== password) {
      return false;
    }
    
    return await session.create(username);
  },
  
  check: async (sessionKey) => {
    return await session.validate(sessionKey);
  }
};

// 问题管理
const problem = {
  change: async (req, res) => {
    const { problem, difficult, quality } = req.json;
    const ip = req.headers['x-nf-client-connection-ip'] || '';
    const username = req.json.username;
    
    // 验证输入
    if (!problem) return res.end("鸡你太美！");
    if (typeof difficult !== 'number' || difficult < 711 || difficult > 3510) 
      return res.end("难度需在 800 ~ 3500 之间！");
    if (typeof quality !== 'number' || quality <= 0 || quality > 5) 
      return res.end("质量需在 0 ~ 5 之间！");
    
    try {
      
      // 插入/更新评分
      await pool.query(
        `INSERT INTO ratings (problem_name, username, difficult, quality, ip) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (problem_name, username) 
         DO UPDATE SET difficult = $3, quality = $4, ip = $5`,
        [problem, username, difficult, quality, ip]
      );
      
      res.end("您的评价已提交");
    } catch (err) {
      console.error(err);
      res.end("服务器错误，请稍后再试");
    }
  },
  
  get: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.name, p.id, p.class, p.date,
               COALESCE(ROUND(AVG(r.difficult)::numeric, 2), 0) as difficult,
               COALESCE(ROUND(AVG(r.quality)::numeric, 2), 0) as quality
        FROM problems p
        LEFT JOIN ratings r ON r.problem_name = p.name
        GROUP BY p.name, p.id, p.class, p.date
        ORDER BY p.id
      `);
      
      const problems = result.rows.map((p, idx) => ({
        name: p.name,
        ord: idx + 1,
        id: p.id,
        date: p.date,
        difficult: parseFloat(p.difficult) || '?',
        quality: parseFloat(p.quality) || '?',
        class: p.class || ''
      }));
      
      res.end(JSON.stringify(problems));
    } catch (err) {
      console.error(err);
      res.end("[]");
    }
  }
};

// 工具函数
function parseCookies(cookieStr) {
  if (!cookieStr) return {};
  return cookieStr.split(';').reduce((cookies, item) => {
    const [key, val] = item.trim().split('=');
    cookies[key] = decodeURIComponent(val);
    return cookies;
  }, {});
}

// Netlify Functions 主入口
exports.handler = async (event, context) => {
  await initDatabase();
  
  const req = {
    method: event.httpMethod,
    headers: event.headers,
    json: event.httpMethod === 'POST' ? JSON.parse(event.body) : null
  };
  
  const res = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json'
    },
    setHeader: function(key, value) {
      this.headers[key] = value;
    },
    writeHead: function(status) {
      this.statusCode = status;
    },
    end: function(data) {
      this.body = data;
    }
  };
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: res.headers,
      body: ''
    };
  }
  
  // 处理登录
  if (req.json?.method === 'login') {
    const { username, password } = req.json;
    if (!username || !password) {
      res.writeHead(200);
      res.end("请提供用户名和密码");
      return response(res);
    }
    
    const sessionKey = await login.login(username, password);
    if (!sessionKey) {
      res.setHeader('Set-Cookie', [
        'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        'user_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      ]);
      res.end("用户名或密码错误");
      return response(res);
    }
    
    res.setHeader('Set-Cookie', [
      `username=${username}; Path=/`,
      `user_session=${sessionKey}; Path=/; Max-Age=1200`
    ]);
    res.end("登录成功");
    return response(res);
  }
  
  // 检查会话
  const cookies = parseCookies(req.headers.cookie);
  
  // 处理更改评分
  if (req.json?.method === "change") {
    const username = cookies.username;
    const sessionKey = cookies.user_session;
    
    if (!username || !sessionKey || !(await login.check(sessionKey))) {
      res.setHeader('Set-Cookie', [
        'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        'user_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      ]);
      res.end("账号异常，请重新登录!");
      return response(res);
    }
    
    req.json.username = username;
    await problem.change(req, res);
    return response(res);
  }
  
  // 获取问题列表
  if (req.json?.method === 'get') {
    await problem.get(req, res);
    return response(res);
  }
  
  // 其他情况
  res.writeHead(404);
  res.end("我是奶龙！我是奶龙！我才是奶龙！");
  return response(res);
};

// 构建响应对象
function response(resObj) {
  return {
    statusCode: resObj.statusCode || 200,
    headers: resObj.headers,
    body: resObj.body || ''
  };
}