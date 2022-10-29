"use strict";
function addCountStep(step, value) {
    var parent = document.querySelector(".count-view");
    var content = document.createElement("div");
    var title = document.createElement("div");
    var idText = document.createElement("p");
    var mainStringText = document.createElement("p");
    var subStringText = document.createElement("p");
    var resultText = document.createElement("p");
    content.className = "border-box content";
    idText.className = "id-box";
    content.appendChild(idText);
    content.appendChild(mainStringText);
    content.appendChild(subStringText);
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
    stack = [];
    idCount = 1;
    mainStringRecursiveView = main;
    subStringRecursiveView = sub;
    stack.push(new stackCall(idCount, main.length, sub.length, null));
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
        this.id = id;
        this.m = m;
        this.n = n;
        this.parent = parent;
    }
}
let idCount = 1;
let stack = [];
function countRecursiveView() {
    let current = stack[stack.length - 1];
    if (current.result.length > 0 && current.result.every((x) => x > -1)) {
        var parent = document.querySelector(`#step: ${stack[current.parent].id}`);
        var oldResultText = parent === null || parent === void 0 ? void 0 : parent.querySelectorAll("p")[3].innerText;
        var first = oldResultText === null || oldResultText === void 0 ? void 0 : oldResultText.slice(0, oldResultText.indexOf(")"));
        var second = oldResultText === null || oldResultText === void 0 ? void 0 : oldResultText.slice(oldResultText.indexOf("+"), oldResultText.length);
    }
    var content = addCountStep("countStep", 0);
    var idText = content.querySelector(".id-box");
    var mainStringText = content.querySelectorAll("p")[1];
    var subStringText = content.querySelectorAll("p")[2];
    var resultText = content.querySelectorAll("p")[3];
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
    subStringText.innerText = `main string: '${subStringRecursiveView.slice(0, current.n).length < 1
        ? " "
        : subStringRecursiveView.slice(0, current.n - 1)}`;
    let subLast = subStringRecursiveView.slice(current.n - 1, current.n);
    let subLastText = document.createElement("b");
    subLastText.innerText = subLast;
    subStringText.appendChild(subLastText);
    subStringText.insertAdjacentText("beforeend", "'");
    if (current.n == 0) {
        current.result.push(1);
        return;
    }
    if (current.m == 0) {
        current.result.push(0);
        return;
    }
    if (mainStringRecursiveView[current.m - 1] ==
        subStringRecursiveView[current.n - 1]) {
        idCount++;
        stack.push(new stackCall(idCount, current.m - 1, current.n));
        idCount++;
        current.result = [-1, -1];
        stack.push(new stackCall(idCount, current.m - 1, current.n - 1));
    }
    else {
        idCount++;
        stack.push(new stackCall(idCount, current.m - 1, current.n));
        current.result = [-1];
    }
}
//# sourceMappingURL=countView.js.map