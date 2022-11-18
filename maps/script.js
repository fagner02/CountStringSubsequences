"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let highlight = document.querySelector(".highlight");
let highlightSelected = document.querySelector("p");
let highlightColors = {
    "0": "white",
    "1": "hsl(350, 65%, 70%)",
    "2": "hsl(210, 65%, 70%)",
    "3": "hsl(140, 65%, 70%)",
};
function setHighlight() {
    highlight.style.opacity = "1";
    highlight.style.top = highlightSelected.offsetTop + "px";
    highlight.style.width = highlightSelected.offsetWidth + "px";
    highlight.style.left = highlightSelected.offsetLeft + "px";
    highlight.style.height = highlightSelected.clientHeight - 1 + "px";
}
setTimeout(setHighlight, 100);
window.addEventListener("resize", setHighlight);
let popupBackground = document.querySelector(".pop-up");
let teamPresented = false;
let popupOn = false;
let recursiveViewOn = false;
let dynamicViewOn = false;
window.addEventListener("keydown", (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(e.ctrlKey, e.key, e.code);
    if (e.key == "Escape") {
        if (popupOn) {
            popupBackground.style.display = "none";
            popupOn = false;
        }
    }
    if (e.key == "|" && e.ctrlKey && e.shiftKey) {
        popupBackground.style.display = "block";
        if (!teamPresented) {
            var el = document.querySelector(".pop-up-box");
            el.style.scale = "1";
            teamPresented = true;
            popupOn = true;
            return;
        }
        if (!popupOn && recursiveViewOn) {
            var el = document.querySelector(".pop-up-box");
            el.remove();
            el = document.createElement("div");
            el.className = "pop-up-box";
            el.style.scale = "0";
            (_a = document.querySelector(".pop-up")) === null || _a === void 0 ? void 0 : _a.appendChild(el);
            stringToCodeBlock(el, recursiveCorrectness);
            el.style.scale = "1";
            popupOn = true;
        }
        if (!popupOn && dynamicViewOn) {
            var el = document.querySelector(".pop-up-box");
            el.remove();
            el = document.createElement("div");
            el.className = "pop-up-box";
            el.style.scale = "0";
            (_b = document.querySelector(".pop-up")) === null || _b === void 0 ? void 0 : _b.appendChild(el);
            stringToCodeBlock(el, dynamicCorrectness);
            el.style.scale = "1";
            popupOn = true;
        }
    }
}));
let inputMain = document.querySelector("#main");
inputMain.value = "banana";
let inputSub = document.querySelector("#sub");
inputSub.value = "ana";
let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");
let resultThree = document.querySelectorAll(".result-three > p");
let timeout = new Map([["countStep", []]]);
function openRecursiveCorrectness() {
    var _a;
    let units = document.querySelectorAll(".correctness > .grid > .unit");
    let buttons = (_a = document.querySelector(".correctness > .controls")) === null || _a === void 0 ? void 0 : _a.children;
    buttons[1].style.backgroundColor = "hsl(200, 50%, 50%)";
    buttons[0].style.backgroundColor = "hsl(0, 0%, 20%)";
    units[0].style.display = "flex";
    units[1].style.display = "none";
}
function openIterativeCorrectness() {
    var _a;
    let units = document.querySelectorAll(".correctness > .grid > .unit");
    let buttons = (_a = document.querySelector(".correctness > .controls")) === null || _a === void 0 ? void 0 : _a.children;
    buttons[0].style.backgroundColor = "hsl(200, 50%, 50%)";
    buttons[1].style.backgroundColor = "hsl(0, 0%, 20%)";
    units[1].style.display = "flex";
    units[0].style.display = "none";
}
let correctnessOpened = false;
document.querySelectorAll("p.option").forEach((x) => {
    x.addEventListener("click", () => {
        var _a, _b;
        highlightSelected = x;
        setHighlight();
        let main = inputMain.value;
        let sub = inputSub.value;
        let textBox = document.querySelector(".text");
        let resultBox = document.querySelector(".result-box");
        let countView = document.querySelector(".count-view");
        let findView = document.querySelector(".find-view");
        let dynamicView = document.querySelector(".dynamic-view");
        let introduction = document.querySelector(".introduction");
        let correctness = document.querySelector(".correctness");
        if (x.innerText == "Introduction" || x.innerText == "Correctness") {
            textBox.style.display = "none";
        }
        else {
            textBox.style.display = "flex";
        }
        if (x.innerText == "Introduction") {
            introduction.style.opacity = "1";
            introduction.style.zIndex = "1";
        }
        else {
            introduction.style.opacity = "0";
            introduction.style.zIndex = "-1";
        }
        if (x.innerText == "Recursive-Code") {
            countView.style.opacity = "1";
            countView.style.zIndex = "1";
            recursiveViewOn = true;
            if (startCountRecursiveView) {
                resetCountRecursiveView(main, sub);
            }
        }
        else {
            countView.style.opacity = "0";
            countView.style.zIndex = "-1";
            recursiveViewOn = false;
        }
        if (x.innerText == "Iterative-Code") {
            findView.style.opacity = "1";
            findView.style.zIndex = "1";
            if (start) {
                resetCountAggregateCalcView(main, sub);
            }
        }
        else {
            findView.style.opacity = "0";
            findView.style.zIndex = "-1";
        }
        if (x.innerText == "Dynamic-Code") {
            dynamicView.style.opacity = "1";
            dynamicView.style.zIndex = "1";
            dynamicViewOn = true;
            if (startCountDynamicView) {
                resetCountDynamic(main, sub);
            }
        }
        else {
            dynamicView.style.opacity = "0";
            dynamicView.style.zIndex = "-1";
            dynamicViewOn = false;
        }
        if (x.innerText == "Correctness") {
            correctness.style.opacity = "1";
            correctness.style.zIndex = "1";
            if (!correctnessOpened) {
                (_a = document.querySelector(".correctness > .grid")) === null || _a === void 0 ? void 0 : _a.remove();
                let grid = document.createElement("div");
                grid.className = "grid shadow-box";
                let unit1 = document.createElement("div");
                unit1.className = "unit column";
                let unit2 = document.createElement("div");
                unit2.className = "unit column";
                grid.appendChild(unit1);
                grid.appendChild(unit2);
                (_b = document.querySelector(".correctness")) === null || _b === void 0 ? void 0 : _b.appendChild(grid);
                stringToCodeBlock(unit2, dynamicCorrectness);
                stringToCodeBlock(unit1, recursiveCorrectness);
                correctnessOpened = true;
            }
        }
        else {
            correctness.style.opacity = "0";
            correctness.style.zIndex = "-1";
        }
        if (x.innerText == "Results") {
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            setOptimizedResult(main, sub);
            setOldResult(main, sub);
        }
        else {
            resultBox.style.opacity = "0";
            resultBox.style.zIndex = "-1";
        }
    });
});
function sleep(ms, group) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            if (group != null) {
                if (!timeout.has(group)) {
                    timeout.set(group, []);
                }
                timeout.get(group).push(setTimeout(resolve, ms));
            }
            setTimeout(resolve, ms);
        });
    });
}
var curve = [];
const algorithmIterations = 100;
function setPath() {
    var d = `M0 ${graphHeight}`;
    for (let i = 0; i < algorithmIterations; i++) {
        if (curve.length == i) {
            return;
        }
        d = d.replace(`V ${graphHeight}`, "");
        d +=
            "L" +
                i * (graphWidth / algorithmIterations) +
                " " +
                (graphHeight - curve[i] * graphHeight) +
                `V ${graphHeight}`;
        (graph === null || graph === void 0 ? void 0 : graph.firstElementChild).setAttribute("d", d);
    }
}
function setOptimizedResult(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        curve = [];
        if (runAlgorithm != null) {
            window.clearTimeout(runningAlgorithm);
        }
        runAlgorithm(countDynamicPrograming, 0, main, sub, 0, 0);
    });
}
let runningAlgorithm = null;
function runAlgorithm(algorithm, i, main, sub, sum, max) {
    if (i == algorithmIterations) {
        return;
    }
    var start = performance.now();
    resultsOp[1].innerText = `result: ${algorithm(main, sub).toString()}`;
    var end = performance.now();
    let currentTime = end - start;
    sum += currentTime;
    resultsOp[0].innerText = `batch item: ${i.toString()}`;
    let time = (sum / (i + 1)).toString();
    resultsOp[2].innerText = `average timing: ${time.slice(0, time.indexOf(".") + 5)}ms`;
    let limit = 1.5;
    curve.push(currentTime / (max * limit));
    if (max < currentTime && (max == 0 || currentTime < max * 2)) {
        let rate = max == 0 ? 1 : max / (currentTime * limit);
        max = currentTime;
        curve = curve.map((x) => x * rate);
        curve[curve.length - 1] = 1 / limit;
    }
    setPath();
    runningAlgorithm = setTimeout(() => {
        return runAlgorithm(algorithm, i + 1, main, sub, sum, max);
    }, 1);
}
function setOldResult(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        var sum = 0;
        for (let i = 0; i < 100; i++) {
            var start = performance.now();
            resultsOl[1].innerText = `result: ${count(main, sub, main.length, sub.length).toString()}`;
            var end = performance.now();
            sum += end - start;
            resultsOl[0].innerText = `batch item: ${i.toString()}`;
            let time = (sum / (i + 1)).toString();
            resultsOl[2].innerText = `average timing: ${time.slice(0, time.indexOf(".") + 5)}ms`;
            yield sleep(0);
        }
    });
}
//# sourceMappingURL=script.js.map