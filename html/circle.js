// code from kira924age/CodeforcesProblems

// MIT License
//
// Copyright (c) 2022 kira924age
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var style="CF";

function getColorCF(difficulty) {
    let color;

    if (difficulty === undefined ||  difficulty === '?' ) {
        color = "black";
    } else if (difficulty < 1200) {
        color = "grey";
    } else if (difficulty < 1400) {
        color = "green";
    } else if (difficulty < 1600) {
        color = "cyan";
    } else if (difficulty < 1900) {
        color = "blue";
    } else if (difficulty < 2100) {
        color = "violet";
    } else if (difficulty < 2400) {
        color = "orange";
    } else if (difficulty < 3000) {
        color = "red";
    } else if (difficulty < 3200) {
        color = "bronze";
    } else if (difficulty < 3400) {
        color = "silver";
    } else {
        color = "gold";
    }

    return color;
}

function getColorAT(difficulty) {
    let color;

    if (difficulty === undefined ||  difficulty === '?' ) {
        color = "black";
    } else if (difficulty < 400) {
        color = "grey";
    } else if (difficulty < 800) {
        color = "brown";
    } else if (difficulty < 1200) {
        color = "green";
    } else if (difficulty < 1600) {
        color = "cyan";
    } else if (difficulty < 2000) {
        color = "blue";
    } else if (difficulty < 2400) {
        color = "yellow";
    } else if (difficulty < 2800) {
        color = "orange";
    } else if (difficulty < 3000) {
        color = "red";
    } else if (difficulty < 3300) {
        color = "bronze";
    } else if (difficulty < 3550) {
        color = "silver";
    } else {
        color = "gold";
    }

    return color;
}

function getColorCode(difficulty){
    return style=="CF"?getColorCodeCF(difficulty):getColorCodeAT(difficulty);
}

function getColorCodeAT(difficulty) {
    let color;
    
    if (difficulty === undefined ||  difficulty === '?' ) {
        color = "rgb(0, 0, 0)";
    } else if (difficulty < 400) {
        color = "rgb(128, 128, 128)";
    } else if (difficulty < 800) {
        color = "rgb(128, 64, 0)";
    } else if (difficulty < 1200) {
        color = "rgb(0, 128, 0)";
    } else if (difficulty < 1600) {
        color = "rgb(0, 192, 192)";
    } else if (difficulty < 2000) {
        color = "rgb(0, 0, 255)";
    } else if (difficulty < 2400) {
        color = "rgb(192, 192, 0)";
    } else if (difficulty < 2800) {
        color = "rgb(255, 128, 0)";
    } else if (difficulty < 3000) {
        color = "rgb(255, 0, 0)";
    } else if (difficulty < 3300) {
        color = "#965C2C";
    } else if (difficulty < 3550) {
        color = "#808080";
    } else {
        color = "#FFD700";
    }

    return color;
}

function getColorCodeCF(difficulty) {
    let color;

    if (difficulty === undefined ||  difficulty === '?' ) {
        color =  "#000000";
    } else if (difficulty < 1200) {
        color =  "#808080";
    } else if (difficulty < 1400) {
        color =  "#008000";
    } else if (difficulty < 1600) {
        color =  "#03A89E";
    } else if (difficulty < 1900) {
        color =  "#0000FF";
    } else if (difficulty < 2100) {
        color =  "#AA00AA";
    } else if (difficulty < 2400) {
        color = "#FF8C00";
    } else if (difficulty < 3000) {
        color = "#FF0000";
    } else if (difficulty < 3200) {
        color = "#965C2C";
    } else if (difficulty < 3400) {
        color = "#808080";
    } else {
        color = "#FFD700";
    }

    return color;
}
function getColorCode2CF(difficulty) {
    let color;

    if (difficulty === undefined ||  difficulty === '?' ) {
        color =  "#000000";
    } else if (difficulty < 1200) {
        color =  "#808080";
    } else if (difficulty < 1400) {
        color =  "#008000";
    } else if (difficulty < 1600) {
        color =  "#03A89E";
    } else if (difficulty < 1900) {
        color =  "#0000FF";
    } else if (difficulty < 2100) {
        color =  "#AA00AA";
    } else if (difficulty < 2400) {
        color = "#FF8C00";
    } else {
        color = "#FF0000";
    }

    return color;
}

function calcFillRatioCF(difficulty) {
    let fillRatio = 0;

    if (difficulty === undefined ||  difficulty === '?' ) {
        fillRatio = 0;
    } else if (difficulty < 1200) {
        fillRatio = (difficulty - 800) / 400;
    } else if (difficulty < 1400) {
        fillRatio = 1 - (1400 - difficulty) / 200;
    } else if (difficulty < 1600) {
        fillRatio = 1 - (1600 - difficulty) / 200;
    } else if (difficulty < 1900) {
        fillRatio = 1 - (1900 - difficulty) / 300;
    } else if (difficulty < 2100) {
        fillRatio = 1 - (2100 - difficulty) / 200;
    } else if (difficulty < 2400) {
        fillRatio = 1 - (2400 - difficulty) / 300;
    } else if (difficulty < 3000) {
        fillRatio = 1 - (3000 - difficulty) / 600;
    } else {3000
        fillRatio = 1.0;
    }
    return fillRatio;
}

function calcFillRatioAT(difficulty) {
    let fillRatio = 0;

    if (difficulty === undefined ||  difficulty === '?' ) {
        fillRatio = 0;
    } else if (difficulty < 400) {
        fillRatio = (difficulty - 0) / 400;
    } else if (difficulty < 800) {
        fillRatio = 1 - (800 - difficulty) / 400;
    } else if (difficulty < 1200) {
        fillRatio = 1 - (1200 - difficulty) / 400;
    } else if (difficulty < 1600) {
        fillRatio = 1 - (1600 - difficulty) / 400;
    } else if (difficulty < 2000) {
        fillRatio = 1 - (2000 - difficulty) / 400;
    } else if (difficulty < 2400) {
        fillRatio = 1 - (2400 - difficulty) / 400;
    } else if (difficulty < 2800) {
        fillRatio = 1 - (2800 - difficulty) / 200;
    } else {
        fillRatio = 1.0;
    }
    return fillRatio;
}

function get_circleCF(rating) {
    const color = getColorCF(rating);
    const colorCode2 = getColorCode2CF(rating);
    const colorCode = getColorCodeCF(rating);
    const fillRatio = calcFillRatioCF(rating);

    const isMetal = color === "bronze" || color === "silver" || color === "gold";
    // console.log(isMetal,color);
    let metalOption = {
        base: "", highlight: "",
    };
    if (color === "bronze") {
        metalOption = {base: "#965C2C", highlight: "#FFDABD"};
    }
    if (color === "silver") {
        metalOption = {base: "#808080", highlight: "white"};
    }
    if (color === "gold") {
        metalOption = {base: "#FFD700", highlight: "white"};
    }

    const styles = isMetal ? {
        'border-color': colorCode, background: `linear-gradient(to right, \
        ${metalOption.base}, ${metalOption.highlight}, ${metalOption.base})`, color: colorCode,
    } : {
        'border-color': colorCode, 'border-style': "solid", background: `linear-gradient(to top, \
        ${colorCode} 0%, \
        ${colorCode} ${fillRatio * 100}%, \
        rgba(0,0,0,0) ${fillRatio * 100}%, \
        rgba(0,0,0,0) 100%)`, color: colorCode,
    };
    return `<span
        class="difficulty-circle"
        style="${Object.entries(styles).map(([k, v]) => `${k}: ${v};`).join('')}"
    ></span>`;
}


function get_circleAT(rating) {
    const color = getColorAT(rating);
    const colorCode = getColorCodeAT(rating);
    const fillRatio = calcFillRatioAT(rating);

    const isMetal = color === "bronze" || color === "silver" || color === "gold";
    // console.log(isMetal,color);
    let metalOption = {
        base: "", highlight: "",
    };
    if (color === "bronze") {
        metalOption = {base: "#965C2C", highlight: "#FFDABD"};
    }
    if (color === "silver") {
        metalOption = {base: "#808080", highlight: "white"};
    }
    if (color === "gold") {
        metalOption = {base: "#FFD700", highlight: "white"};
    }

    const styles = isMetal ? {
        'border-color': colorCode, background: `linear-gradient(to right, \
        ${metalOption.base}, ${metalOption.highlight}, ${metalOption.base})`, color: colorCode,
    } : {
        'border-color': colorCode, 'border-style': "solid", background: `linear-gradient(to top, \
        ${colorCode} 0%, \
        ${colorCode} ${fillRatio * 100}%, \
        rgba(0,0,0,0) ${fillRatio * 100}%, \
        rgba(0,0,0,0) 100%)`, color: colorCode,
    };
    return `<span
        class="difficulty-circle"
        style="${Object.entries(styles).map(([k, v]) => `${k}: ${v};`).join('')}"
    ></span>`;
}

function getQualityColor(quality){
    let color;

    if (quality === undefined ||  quality === '?' ) {
        color =  "#000000";
    } else if (quality < 1.00) {
        color =  "rgb(157, 108, 73)";
    } else if (quality < 1.50) {
        color =  "rgb(128, 128, 128)";
    } else if (quality < 2.50) {
        color =  "rgb(144, 238, 144)";
    } else if (quality < 3.50) {
        color =  "rgb(80, 200, 120)";
    } else if (quality < 4.50) {
        color =  "rgb(34, 139, 34)";
    } else {
        color =  "rgb(0, 128, 0)";
    }

    return color;
}
