var canvas = {
    width: 32,
    height: 16,
    cells: [],
    selectedColor: 0,
    leftClicked: false
}

const cell = "cell";
const canvasStorage = "canvas";

function addRow(y) {
    let div = document.createElement("div");
    div.id = "y" + y;
    div.className = "canvas-row";
    //div.innerHTML = "&nbsp;"

    document.getElementById("canvas").appendChild(div);
}

function addCell(x, y, color) {
    let div = document.createElement("div");
    div.id = cell + x + "_" + y;
    div.className = "canvas-cell";
    div.setAttribute("style", "background-color: " + color);

    document.getElementById("y" + y).appendChild(div);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "" + hex : hex;
}

function addcolorPatternDivider() {
    let div = document.createElement("div");
    document.getElementById("colorPattern").appendChild(div);
}

function addcolorPatternDiv(color) {
    let div = document.createElement("div");
    div.id = "color" + color;
    div.className = "color-pick";
    div.setAttribute("style", "background-color: " + color);
    document.getElementById("colorPattern").appendChild(div);
}

function addColorPattern() {
    for (let r = 0; r < 16; r = r + 5) {
        addcolorPatternDivider();
        for (let g = 0; g < 16; g = g + 5) {
            for (let b = 0; b < 16; b = b + 5) {
                addcolorPatternDiv("#" + componentToHex(r) + componentToHex(r) + componentToHex(g) + componentToHex(g)+ componentToHex(b)+ componentToHex(b));
            }

        }
    }
    document.getElementById("selectedColor").value = canvas.selectedColor;
}

function pickColor() {
    canvas.selectedColor = "#fff";
}

function readyDefaultCanvas() {
    canvas = {};
    canvas.cells = [];
    canvas.width = 32;
    canvas.height = 16;
    canvas.selectedColor = "#000000";
    canvas.leftClicked = false;
    for (let y = 0; y < canvas.height; y++) {
        addRow(y);
        canvas.cells[y] = [];
        for (let x = 0; x < canvas.width; x++) {
            canvas.cells[y][x] = "#fff";
            addCell(x, y, canvas.cells[y][x]);
        }
    }
    addColorPattern();
}

function readyCanvas() {
    for (let y = 0; y < canvas.height; y++) {
        addRow(y);
        for (let x = 0; x < canvas.width; x++) {
            addCell(x, y, canvas.cells[y][x]);
        }
    }
    addColorPattern();
}

function onColorPick(e) {
    let id = e.target.id;

    if (id == "colorPattern") return;
    let color = id.substring(5);
    canvas.selectedColor = color;
    let colorPattern = document.getElementById("selectedColor");
    colorPattern.value = color;
}

function getXY(e) {
    let res = {};
    res.x = e.substring(4, e.indexOf("_"));
    res.y = e.substring(e.indexOf("_") + 1);

    return res;
}

function onCanvasClick(e) {
    let id = e.target.id;
    if (id.substring(0, cell.length) != cell) return;

    let pos = getXY(id);

    colorCell(pos.x, pos.y, canvas.selectedColor);

    canvas.leftClicked = false;
}

function colorCell(x,y,color,save=true) {
    document.getElementById(cell + x + "_" + y).setAttribute("style", "background-color: " + color);
    canvas.cells[y][x] = color;
    if (save) {saveAll();}
}

function onCanvasMove(e) {
    if (!canvas.leftClicked) return;
    
    let id = e.target.id;
    if (id.substring(0, cell.length) != cell) return;
    let pos = getXY(id);
    colorCell(pos.x, pos.y, canvas.selectedColor);
    e.preventDefault();

    return false;
}

function onCanvasDown(e) {
    if (e.which == 1 && e.target.className == "canvas-cell") {
        canvas.leftClicked = true;
    }
    else {
        canvas.leftClicked = false;
    }
    e.preventDefault();
    return false;
}

function onCanvasUp(e) {
    canvas.leftClicked = false;
    e.preventDefault();

    return false;
}

function clearCanvas() {
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x <canvas.width; x++) {
            colorCell(x,y,"#fff",false);
        }
    }
    saveAll();
}

function onColorChange() {
    canvas.selectedColor = document.getElementById("selectedColor").value;
}

function loadAll() {
    canvas = JSON.parse(localStorage.getItem(canvasStorage));

    if (canvas == null) {readyDefaultCanvas()} else {readyCanvas();}
    canvas.leftClicked = false;
}

function saveAll() {
    localStorage.setItem(canvasStorage, JSON.stringify(canvas));
}

document.onload = loadAll();
document.getElementById("colorPattern").addEventListener("click", onColorPick, true);
document.getElementById("canvas").addEventListener("click", onCanvasClick, true);
document.getElementById("canvas").addEventListener("mousemove", onCanvasMove, true);
document.getElementById("mainContainer").addEventListener("mousedown", onCanvasDown, true);
document.getElementById("mainContainer").addEventListener("mouseup", onCanvasUp, true);
document.getElementById("selectedColor").addEventListener("change", onColorChange, true);
document.getElementById("clearCanvas").addEventListener("click", clearCanvas, true);
