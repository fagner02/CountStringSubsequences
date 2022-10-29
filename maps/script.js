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
function setHighlight() {
    highlight.style.opacity = "1";
    highlight.style.top = highlightSelected.offsetTop + "px";
    highlight.style.width = highlightSelected.offsetWidth + "px";
    highlight.style.height = highlightSelected.offsetHeight + "px";
    highlight.style.left = highlightSelected.offsetLeft + "px";
    var infoboxes = document.querySelectorAll(".map-items>div>div");
    infoboxes.forEach((infobox) => {
        if (infobox.scrollHeight > infobox.clientHeight) {
            infobox.style.paddingRight = "5px";
        }
        else {
            infobox.style.paddingRight = "0px";
        }
    });
}
setTimeout(setHighlight, 100);
window.addEventListener("resize", setHighlight);
let inputMain = document.querySelector("#main");
inputMain.value = "aananananana";
let inputSub = document.querySelector("#sub");
inputSub.value = "aann";
let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");
let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;
let timeout = new Map([["countStep", []]]);
document.querySelectorAll("p.option").forEach((x) => {
    x.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        highlightSelected = x;
        setHighlight();
        let main = inputMain.value;
        let sub = inputSub.value;
        let resultBox = document.querySelector(".result-box");
        let countView = document.querySelector(".count-view");
        let findView = document.querySelector(".find-view");
        if (x.innerText == "Old") {
            resetCountRecursiveView("", "");
            resetView();
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            findView.style.opacity = "0";
            setOl(main, sub);
            return;
        }
        if (x.innerText == "Optimized") {
            resetCountRecursiveView("", "");
            resetView();
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            findView.style.opacity = "0";
            setOp(main, sub);
            return;
        }
        if (x.innerText == "Both") {
            resetCountRecursiveView("", "");
            resetView();
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            findView.style.opacity = "0";
            yield setOp(main, sub);
            yield setOl(main, sub);
        }
        if (x.innerText == "Visualize-Old-Code") {
            findView.style.opacity = "0";
            findView.style.zIndex = "-1";
            resultBox.style.opacity = "0";
            resultBox.style.zIndex = "-1";
            countView.style.opacity = "1";
            resetView();
            showView(main, sub);
        }
        if (x.innerText == "Visualize-Optimized-Code") {
            resultBox.style.opacity = "0";
            resultBox.style.zIndex = "-1";
            countView.style.opacity = "0";
            countView.style.zIndex = "-1";
            findView.style.opacity = "1";
            findView.style.zIndex = "1";
            resetCountRecursiveView("", "");
            resetView();
            findSubView(main, sub);
        }
    }));
});
function showView(main, sub) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector(".count-view>.recursive-tree")) === null || _a === void 0 ? void 0 : _a.remove();
        var parent = document.createElement("div");
        parent.className = "recursive-tree";
        (_b = document.querySelector("body>.grid>.count-view")) === null || _b === void 0 ? void 0 : _b.append(parent);
        resetCountRecursiveView(main, sub);
        countRecursiveView();
    });
}
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
function cancelOlFunc() {
    if (!runningOl)
        return;
    cancelOl = true;
}
function cancelOpFunc() {
    if (!runningOp)
        return;
    cancelOp = true;
}
function setOp(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        var asum = 0;
        runningOp = true;
        for (let i = 0; i < 100; i++) {
            if (cancelOp) {
                cancelOp = false;
                return;
            }
            var start = performance.now();
            resultsOp[1].innerText = `result: ${(yield findSub(main, sub)).toString()}`;
            var end = performance.now();
            asum += end - start;
            resultsOp[0].innerText = `batch item: ${i.toString()}`;
            let time = (asum / (i + 1)).toString();
            resultsOp[2].innerText = `average timing: ${time.slice(0, time.indexOf(".") + 5)}ms`;
            yield sleep(0);
        }
        runningOp = false;
    });
}
function setOl(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        var asum = 0;
        runningOl = true;
        for (let i = 0; i < 100; i++) {
            if (cancelOl) {
                cancelOl = false;
                return;
            }
            var start = performance.now();
            try {
                resultsOl[1].innerText = `result: ${(yield count(main, sub, main.length, sub.length)).toString()}`;
            }
            catch (_a) {
                return;
            }
            var end = performance.now();
            asum += end - start;
            resultsOl[0].innerText = `batch item: ${i.toString()}`;
            let time = (asum / (i + 1)).toString();
            resultsOl[2].innerText = `average timing: ${time.slice(0, time.indexOf(".") + 5)}ms`;
            yield sleep(0);
        }
        runningOl = false;
    });
}
//# sourceMappingURL=script.js.map