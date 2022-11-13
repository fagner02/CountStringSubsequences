"use strict";
let resultText2 = (document.querySelector(".count-view>.colored-box"));
let recursiveTree = document.querySelector(".recursive-tree");
function addCountStep() {
    var parent = document.querySelector(".recursive-tree");
    var content = document.createElement("div");
    var stringsText = document.createElement("div");
    var idText = document.createElement("p");
    var mainStringText = document.createElement("p");
    var subStringText = document.createElement("p");
    var resultText = document.createElement("p");
    content.className = "border-box content";
    idText.className = "colored-box";
    stringsText.style.display = "flex";
    stringsText.appendChild(mainStringText);
    stringsText.appendChild(subStringText);
    content.appendChild(idText);
    content.appendChild(stringsText);
    content.appendChild(resultText);
    if (parent.lastChild == null)
        content.id = "step: 1";
    else
        content.id =
            "step: " +
                (parseInt(parent.lastChild.id.slice(6)) + 1).toString();
    idText.innerText = content.id;
    parent.append(content);
    return content;
}
function resetCountRecursiveView(main, sub) {
    var _a, _b;
    (_a = document.querySelector(".recursive-tree")) === null || _a === void 0 ? void 0 : _a.remove();
    var parent = document.createElement("div");
    parent.className = "recursive-tree";
    (_b = document.querySelector(".count-view")) === null || _b === void 0 ? void 0 : _b.append(parent);
    recursiveTree = parent;
    resultText2.innerText = "result: ?";
    resultText2.style.backgroundColor = "hsl(0, 0%, 10%)";
    stack = [];
    idCount = 1;
    mainStringRecursiveView = main;
    subStringRecursiveView = sub;
    startCountRecursiveView = true;
    countRecursiveView();
}
let mainStringRecursiveView;
let subStringRecursiveView;
class countStepResponse {
    constructor(value, id = null) {
        this.value = value;
        this.id = id;
    }
}
class stackCall {
    constructor(id, m, n, parent = null) {
        this.result = [];
        this.children = [];
        this.id = id;
        this.m = m;
        this.n = n;
        this.parent = parent;
    }
}
let idCount = 1;
let stack = [];
let highlightedStep = null;
function setResultText(resultText, current) {
    if (current.result.length == 1) {
        resultText.innerText = `result: recur(${mainStringRecursiveView.slice(0, current.m - 1)},${subStringRecursiveView.slice(0, current.n)}, ${current.m - 1}, ${current.n})`;
        return;
    }
    resultText.innerText = `result: recur(${mainStringRecursiveView.slice(0, current.m - 1)},${subStringRecursiveView.slice(0, current.n - 1)}, ${current.m - 1}, ${current.n - 1}) + recur(${mainStringRecursiveView.slice(0, current.m - 1)},${subStringRecursiveView.slice(0, current.n)}, ${current.m - 1}, ${current.n})`;
}
function scrollToStep(content) {
    let pos = content.offsetTop - recursiveTree.offsetTop;
    let max = recursiveTree.scrollHeight - recursiveTree.offsetHeight;
    recursiveTree.scrollTo({
        behavior: "smooth",
        top: pos > max ? max : pos,
    });
}
function countRecursiveView() {
    if (startCountRecursiveView) {
        stack.push(new stackCall(idCount, mainStringRecursiveView.length, subStringRecursiveView.length));
    }
    let current = stack[stack.length - 1];
    if (current.result.length > 0 && current.result.every((x) => x > -1)) {
        if (current.parent == null) {
            resultText2.innerText = `result: ${current.result.reduce((a, b) => a + b, 0)}`;
            resultText2.style.backgroundColor = "hsl(120, 75%, 45%, 50%)";
            highlightedStep.style.backgroundColor = "hsl(0, 0%, 100%, 20%)";
            return;
        }
        var parentCall = stack[current.parent];
        var parent = document.getElementById(`step: ${parentCall.id}`);
        var oldResult = parent === null || parent === void 0 ? void 0 : parent.querySelectorAll("p")[3];
        var first = `(step: ${parentCall.children[0]})`;
        var second = parentCall.result[0] > -1
            ? `(step: ${parentCall.children[1]})`
            : `recur(${mainStringRecursiveView.slice(0, parentCall.m - 1)},${subStringRecursiveView.slice(0, parentCall.n)}, ${parentCall.m - 1}, ${parentCall.n})`;
        highlightedStep.style.backgroundColor = "hsl(0, 0%, 100%, 20%)";
        parent.style.backgroundColor = "hsl(250, 75%, 55%, 50%)";
        highlightedStep = parent;
        if (parentCall.result[0] == -1) {
            parentCall.result[0] = current.result.reduce((a, b) => a + b, 0);
            if (parentCall.result.length == 1) {
                (parent === null || parent === void 0 ? void 0 : parent.querySelector(".colored-box")).style.backgroundColor = "hsl(250, 55%, 45%, 100%)";
            }
        }
        else {
            parentCall.result[1] = current.result.reduce((a, b) => a + b, 0);
            (parent === null || parent === void 0 ? void 0 : parent.querySelector(".colored-box")).style.backgroundColor = "hsl(250, 55%, 45%, 100%)";
        }
        var result = parentCall.result
            .filter((x) => x > -1)
            .reduce((a, b) => a + b, 0);
        if (parentCall.children.length == 1) {
            oldResult.innerText = `result: ${first} = ${result}`;
        }
        else {
            oldResult.innerText = `result: ${first} + ${second} = ${result}`;
        }
        scrollToStep(parent);
        stack.pop();
        return;
    }
    if (current.result.length > 0) {
        idCount++;
        stack.push(new stackCall(idCount, current.m - 1, current.n, stack.indexOf(current)));
        current.children = [current.children[0], idCount];
        return countRecursiveView();
    }
    var content = addCountStep();
    var idText = content.querySelector(".colored-box");
    var mainStringText = content.querySelectorAll("p")[1];
    var subStringText = content.querySelectorAll("p")[2];
    var resultText = content.querySelectorAll("p")[3];
    if (startCountRecursiveView) {
        highlightedStep = content;
        startCountRecursiveView = false;
    }
    // Set the main string
    mainStringText.innerText = `main string: '${mainStringRecursiveView.slice(0, current.m).length < 1
        ? " "
        : mainStringRecursiveView.slice(0, current.m - 1)}`;
    let mainLast = mainStringRecursiveView.slice(current.m - 1, current.m);
    let mainLastText = document.createElement("b");
    mainLastText.innerText = mainLast;
    mainStringText.appendChild(mainLastText);
    mainStringText.insertAdjacentText("beforeend", "'");
    // Set the sub string
    subStringText.innerText = `sub string: '${subStringRecursiveView.slice(0, current.n).length < 1
        ? " "
        : subStringRecursiveView.slice(0, current.n - 1)}`;
    let subLast = subStringRecursiveView.slice(current.n - 1, current.n);
    let subLastText = document.createElement("b");
    subLastText.innerText = subLast;
    subStringText.appendChild(subLastText);
    subStringText.insertAdjacentText("beforeend", "'");
    if (current.n == 0) {
        current.result.push(1);
        resultText.innerText = "result: 1";
        idText.style.backgroundColor = "hsl(120, 55%, 45%, 100%)";
        highlightedStep.style.backgroundColor = "hsl(0, 0%, 100%, 20%)";
        content.style.backgroundColor = "hsl(120, 75%, 55%, 50%)";
        highlightedStep = content;
        scrollToStep(content);
        return;
    }
    if (current.m == 0) {
        current.result.push(0);
        resultText.innerText = "result: 0";
        idText.style.backgroundColor = "hsl(200, 55%, 45%, 100%)";
        highlightedStep.style.backgroundColor = "hsl(0, 0%, 100%, 20%)";
        content.style.backgroundColor = "hsl(200, 75%, 55%, 50%)";
        highlightedStep = content;
        scrollToStep(content);
        return;
    }
    highlightedStep.style.backgroundColor = "hsl(0, 0%, 100%, 20%)";
    content.style.backgroundColor = "hsl(250, 75%, 55%, 50%)";
    highlightedStep = content;
    if (mainStringRecursiveView[current.m - 1] ==
        subStringRecursiveView[current.n - 1]) {
        idCount++;
        stack.push(new stackCall(idCount, current.m - 1, current.n - 1, stack.indexOf(current)));
        current.result = [-1, -1];
        current.children = [idCount, -1];
        setResultText(resultText, current);
        recursiveTree.scrollTo({
            behavior: "smooth",
            top: content.offsetTop - recursiveTree.offsetTop,
        });
        scrollToStep(content);
    }
    else {
        idCount++;
        stack.push(new stackCall(idCount, current.m - 1, current.n, stack.indexOf(current)));
        current.children = [idCount];
        current.result = [-1];
        setResultText(resultText, current);
        recursiveTree.scrollTo({
            behavior: "smooth",
            top: content.offsetTop - recursiveTree.offsetTop,
        });
        scrollToStep(content);
    }
}
let startCountRecursiveView = true;
//# sourceMappingURL=countView.js.map