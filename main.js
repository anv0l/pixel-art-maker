var canvas = {
    width: 32,
    height: 16,
    cells: [],
    selectedColor: 0,
    leftClicked: false
}

const cell = "cell";

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

function addColorPickerDivider() {
    let div = document.createElement("div");
    document.getElementById("colorPicker").appendChild(div);
}

function addColorPickerDiv(color) {
    let div = document.createElement("div");
    div.id = "color" + color;
    div.className = "color-pick";
    div.setAttribute("style", "background-color: " + color);
    document.getElementById("colorPicker").appendChild(div);
}

function addColorPicker() {
    for (let r = 0; r < 16; r = r + 5) {
        addColorPickerDivider();
        for (let g = 0; g < 16; g = g + 5) {
            for (let b = 0; b < 16; b = b + 5) {
                addColorPickerDiv("#" + componentToHex(r) + "" + componentToHex(g) + "" + componentToHex(b))
            }

        }
    }
}

function pickColor() {
    canvas.selectedColor = "#fff";
}

function readyCanvas() {
    for (let y = 0; y < canvas.height; y++) {
        addRow(y);
        canvas.cells[y] = [];
        for (let x = 0; x < canvas.width; x++) {
            canvas.cells[y][x] = "#fff"; // TODO: change to correct color if loaded from storage
            addCell(x, y, canvas.cells[y][x]);
        }
    }
    addColorPicker();
}

function onColorPick(e) {
    let id = e.target.id;

    if (id == "colorPicker") return;
    let color = id.substring(5);
    canvas.selectedColor = color;
    document.getElementById("selectedColor").setAttribute("style", "background-color: " + color);

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

    //console.log(pos.x, pos.y);
    document.getElementById(cell + pos.x + "_" + pos.y).setAttribute("style", "background-color: " + canvas.selectedColor);

    canvas.leftClicked = false;
}

function onCanvasMove(e) {
    if (!canvas.leftClicked) return;
    

    let id = e.target.id;
    if (id.substring(0, cell.length) != cell) return;
    let pos = getXY(id);
    document.getElementById(cell + pos.x + "_" + pos.y).setAttribute("style", "background-color: " + canvas.selectedColor);
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

document.onload = readyCanvas();
document.getElementById("colorPicker").addEventListener("click", onColorPick, true);
document.getElementById("canvas").addEventListener("click", onCanvasClick, true);
document.getElementById("canvas").addEventListener("mousemove", onCanvasMove, true);
document.getElementById("main").addEventListener("mousedown", onCanvasDown, true);
document.getElementById("main").addEventListener("mouseup", onCanvasUp, true);
