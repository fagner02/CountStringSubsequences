"use strict";
let lookup = [];
let mainStringCountDynamic = "";
let subStringCountDynamic = "";
let i1Dynamic = 1;
let i2Dynamic = 1;
let startCountDynamicView = true;
let dynamicTable = document.querySelector(".dynamic-table-values");
function resetCountDynamic(main, sub) {
    var _a;
    let table = document.querySelector(".dynamic-table");
    table === null || table === void 0 ? void 0 : table.remove();
    table = document.createElement("div");
    table.className = "dynamic-table";
    table.style.gridTemplateColumns = `repeat(${sub.length + 3}, 1fr)`;
    table.style.gridTemplateRows = `repeat(${main.length + 3}, 1fr)`;
    dynamicTable = document.createElement("div");
    dynamicTable.className = "dynamic-table-values";
    dynamicTable.style.gridColumn = `2 / ${sub.length + 4}`;
    dynamicTable.style.gridRow = `2 / ${main.length + 4}`;
    dynamicTable.style.gridTemplateColumns = `repeat(${sub.length + 2}, 1fr)`;
    dynamicTable.style.gridTemplateRows = `repeat(${main.length + 2}, 1fr)`;
    table.appendChild(dynamicTable);
    (_a = document.querySelector(".dynamic-view>div:last-child")) === null || _a === void 0 ? void 0 : _a.append(table);
    mainStringCountDynamic = main;
    subStringCountDynamic = sub;
    let firstCell = document.createElement("div");
    firstCell.className = "cell";
    firstCell.style.gridColumn = "1";
    firstCell.style.gridRow = "1";
    firstCell.style.backgroundColor = "transparent";
    dynamicTable.append(firstCell);
    firstCell = document.createElement("div");
    firstCell.className = "cell";
    firstCell.style.gridColumn = "1";
    firstCell.style.gridRow = "1";
    firstCell.style.backgroundColor = "transparent";
    table.append(firstCell);
    for (let i = 0; i < main.length + 1; i++) {
        let letter = document.createElement("div");
        letter.className = "cell letter-cell";
        letter.innerText = i == 0 ? " " : main[i - 1];
        letter.style.gridColumn = `1`;
        letter.style.gridRow = `${i + 3}`;
        table.appendChild(letter);
        let cell = document.createElement("div");
        cell.className = `cell label-cell`;
        cell.innerText = `${i}`;
        cell.id = `cell-1-${i + 2}`;
        cell.style.gridColumn = `1`;
        cell.style.gridRow = `${i + 2}`;
        dynamicTable.append(cell);
    }
    for (let i = 0; i < sub.length + 1; i++) {
        let letter = document.createElement("div");
        letter.className = "cell letter-cell";
        letter.innerText = i == 0 ? " " : sub[i - 1];
        letter.style.gridColumn = `${i + 3}`;
        letter.style.gridRow = `1`;
        table.appendChild(letter);
        let cell = document.createElement("div");
        cell.className = `cell label-cell`;
        cell.innerText = `${i}`;
        cell.id = `cell-${i + 2}-1`;
        cell.style.gridColumn = `${i + 2}`;
        cell.style.gridRow = `1`;
        dynamicTable.append(cell);
    }
    lookup = Array(mainStringCountDynamic.length + 1);
    for (var i = 0; i < mainStringCountDynamic.length + 1; i++) {
        lookup[i] = Array(subStringCountDynamic.length + 1).fill(0);
        for (let j = 0; j < subStringCountDynamic.length + 1; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${j + 2}-${i + 2}`;
            cell.innerText = lookup[i][j].toString();
            cell.style.gridColumn = `${j + 2}`;
            cell.style.gridRow = `${i + 2}`;
            dynamicTable.append(cell);
        }
    }
    for (let i = 0; i <= subStringCountDynamic.length; ++i) {
        lookup[0][i] = 0;
        let cell = document.querySelector(`#cell-${i + 2}-2`);
        cell.innerText = "0";
        cell.className = "cell first-cell";
    }
    for (let i = 0; i <= mainStringCountDynamic.length; ++i) {
        lookup[i][0] = 1;
        let cell = document.querySelector(`#cell-2-${i + 2}`);
        cell.innerText = "1";
        cell.className = "cell first-cell";
    }
    i1Dynamic = 1;
    i2Dynamic = 1;
    highlightColumn = null;
    highlightRow = null;
    startCountDynamicView = false;
}
let highlightColumn = null;
let highlightRow = null;
let highlightedResultCell = null;
let highlightedCells = [];
function setDynamicGridHighlight() {
    let column = document.querySelector(`#cell-1-${i1Dynamic + 2}`);
    if (highlightColumn != null) {
        highlightColumn.style.backgroundColor = "hsl(0, 0%, 60%)";
    }
    highlightColumn = column;
    highlightColumn.style.backgroundColor = "hsl(200, 50%, 50%)";
    let row = document.querySelector(`#cell-${i2Dynamic + 2}-1`);
    if (highlightRow != null) {
        highlightRow.style.backgroundColor = "hsl(0, 0%, 60%)";
    }
    highlightRow = row;
    highlightRow.style.backgroundColor = "hsl(200, 50%, 50%)";
}
function setDynamicCellHighlight(active = true) {
    for (let i = 0; i < highlightedCells.length; i++) {
        let id = highlightedCells[i].id.split("-");
        let first = parseInt(id[1]) == 2 || parseInt(id[2]) == 2;
        highlightedCells[i].style.backgroundColor = active
            ? "hsl(250, 55%, 45%)"
            : first
                ? "hsl(0, 0%, 30%)"
                : "hsl(0, 0%, 20%)";
    }
    if (!active) {
        highlightedCells = [];
    }
}
function countDynamic() {
    if (i1Dynamic > mainStringCountDynamic.length) {
        return;
    }
    if (i2Dynamic > subStringCountDynamic.length) {
        i2Dynamic = 1;
        i1Dynamic++;
        return countDynamic();
    }
    setDynamicGridHighlight();
    setDynamicCellHighlight(false);
    if (mainStringCountDynamic.charAt(i1Dynamic - 1) ==
        subStringCountDynamic.charAt(i2Dynamic - 1)) {
        lookup[i1Dynamic][i2Dynamic] =
            lookup[i1Dynamic - 1][i2Dynamic - 1] + lookup[i1Dynamic - 1][i2Dynamic];
        highlightedCells.push(document.querySelector(`#cell-${i2Dynamic + 1}-${i1Dynamic + 1}`));
        highlightedCells.push(document.querySelector(`#cell-${i2Dynamic + 2}-${i1Dynamic + 1}`));
    }
    else {
        lookup[i1Dynamic][i2Dynamic] = lookup[i1Dynamic - 1][i2Dynamic];
        highlightedCells.push(document.querySelector(`#cell-${i2Dynamic + 2}-${i1Dynamic + 1}`));
    }
    if (highlightedResultCell != null) {
        highlightedResultCell.style.backgroundColor = "hsl(0, 0%, 20%)";
    }
    let cell = document.querySelector(`#cell-${i2Dynamic + 2}-${i1Dynamic + 2}`);
    cell.innerText = lookup[i1Dynamic][i2Dynamic].toString();
    cell.style.backgroundColor = "hsl(130, 55%, 45%)";
    highlightedResultCell = cell;
    setDynamicCellHighlight();
    i2Dynamic++;
}
//# sourceMappingURL=countDynamic.js.map