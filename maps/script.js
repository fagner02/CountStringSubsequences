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
highlight.style.width = document.querySelector("p").offsetWidth + "px";
highlight.style.height = document.querySelector("p").offsetHeight + "px";
highlight.style.left = document.querySelector("p").offsetLeft + "px";
let inputMain = document.querySelector("#main");
inputMain.value = "annnan";
let inputSub = document.querySelector("#sub");
inputSub.value = "a";
let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");
let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;
let cancelOlView = false;
let runningOlView = false;
let timeout = new Map([["countStep", []]]);
document.querySelectorAll("p.option").forEach((x) => {
    x.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        highlight.style.left = x.offsetLeft + "px";
        highlight.style.top = x.offsetTop + "px";
        highlight.style.width = x.offsetWidth + "px";
        highlight.style.height = x.offsetHeight + "px";
        let main = inputMain.value;
        let sub = inputSub.value;
        let resultBox = document.querySelector(".result-box");
        let countView = document.querySelector(".count-view");
        if (x.innerText == "Old") {
            if (runningOlView) {
                cancelOlView = true;
            }
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            setOl(main, sub);
            return;
        }
        if (x.innerText == "Optimized") {
            if (runningOlView) {
                cancelOlView = true;
            }
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            setOp(main, sub);
            return;
        }
        if (x.innerText == "Both") {
            if (runningOlView) {
                cancelOlView = true;
            }
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            yield setOp(main, sub);
            yield setOl(main, sub);
        }
        if (x.innerText == "Visualize Old Code") {
            if (runningOlView) {
                (_a = timeout.get("showView")) === null || _a === void 0 ? void 0 : _a.forEach((x) => window.clearTimeout(x));
                cancelOlView = true;
                if (!timeout.has("showView")) {
                    timeout.set("showView", []);
                }
                (_b = timeout.get("showView")) === null || _b === void 0 ? void 0 : _b.push(setTimeout(() => {
                    showView(resultBox, countView, main, sub);
                }, 1000));
                return;
            }
            showView(resultBox, countView, main, sub);
        }
    }));
});
function showView(resultBox, countView, main, sub) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        resultBox.style.opacity = "0";
        resultBox.style.zIndex = "-1";
        countView.style.opacity = "1";
        (_a = document.querySelector(".count-view")) === null || _a === void 0 ? void 0 : _a.remove();
        var parent = document.createElement("div");
        parent.className = "count-view";
        (_b = document.querySelector("body>.grid")) === null || _b === void 0 ? void 0 : _b.append(parent);
        try {
            runningOlView = true;
            yield countStep(main, sub, main.length, sub.length);
            runningOlView = false;
        }
        catch (_c) {
            cancelOlView = false;
            runningOlView = false;
            timeout.get("countStep").forEach((x) => window.clearTimeout(x));
        }
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