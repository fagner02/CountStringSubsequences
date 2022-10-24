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
document.querySelectorAll("p.option").forEach((x) => {
    x.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        highlight.style.left = x.offsetLeft + "px";
        highlight.style.width = x.offsetWidth + "px";
        let main = inputMain.value;
        let sub = inputSub.value;
        let resultBox = document.querySelector(".result-box");
        let countView = document.querySelector(".count-view");
        if (x.innerText == "Old") {
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            setOl(main, sub);
            return;
        }
        if (x.innerText == "Optimized") {
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            setOp(main, sub);
            return;
        }
        if (x.innerText == "Both") {
            resultBox.style.opacity = "1";
            resultBox.style.zIndex = "1";
            countView.style.opacity = "0";
            yield setOp(main, sub);
            yield setOl(main, sub);
        }
        if (x.innerText == "Visualize Old Code") {
            resultBox.style.opacity = "0";
            resultBox.style.zIndex = "-1";
            countView.style.opacity = "1";
            (_a = document.querySelector(".count-view")) === null || _a === void 0 ? void 0 : _a.remove();
            var parent = document.createElement("div");
            parent.className = "count-view";
            (_b = document.querySelector("body>.grid")) === null || _b === void 0 ? void 0 : _b.append(parent);
            countStep(main, sub, main.length, sub.length);
        }
    }));
});
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
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
            resultsOp[2].innerText = `average timing: ${(asum / 100)
                .toString()
                .slice(0, 5)}ms`;
            yield sleep(0);
        }
        runningOp = false;
        resultsOp[2].innerText = `average timing: ${(asum / 100)
            .toString()
            .slice(0, 5)}ms`;
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
            resultsOl[1].innerText = `result: ${(yield count(main, sub, main.length, sub.length)).toString()}`;
            var end = performance.now();
            asum += end - start;
            resultsOl[0].innerText = `batch item: ${i.toString()}`;
            resultsOl[2].innerText = `average timing:${(asum / 100)
                .toString()
                .slice(0, 5)}ms`;
            yield sleep(0);
        }
        runningOl = false;
        resultsOl[2].innerText = `average timing:${(asum / 100)
            .toString()
            .slice(0, 5)}ms`;
    });
}
class repeatedValue {
    constructor() {
        this.value = 0;
        this.n = 0;
        this.backValue = 0;
    }
}
class item {
    constructor(letter, prev, value = 0) {
        this.fat = 0;
        this.repeated = 1;
        this.n = 0;
        this.values = [];
        this.letter = letter;
        this.prev = prev;
        this.value = value;
    }
    getValue() {
        if (this.repeated > 1) {
            return this.values.map((x) => x.value).reduce((a, b) => a + b, 0);
        }
        return this.value;
    }
}
function calcUpperRepeated(n, repeat) {
    if (n < repeat)
        return 0;
    let result = 1;
    for (let i = n; i > n - repeat; i--) {
        result *= i;
    }
    return result;
}
function calcLowerRepeated(n) {
    if (n == 0)
        return 1;
    return n * calcLowerRepeated(n - 1);
}
function findSub(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        let subMap = new Map();
        let previous = null;
        let last = null;
        subMap.set(-1, new item(-1, -1, 1));
        for (var i = 0; i < sub.length; i++) {
            if (i == 0) {
                previous = new item(sub.charCodeAt(i), -1);
                subMap.set(sub.charCodeAt(i), previous);
                last = previous;
                continue;
            }
            if (previous.letter % 256 == sub.charCodeAt(i)) {
                previous.repeated++;
                previous.fat = calcLowerRepeated(previous.repeated);
                subMap.set(previous.letter, previous);
                last = previous;
                continue;
            }
            let index = sub.charCodeAt(i);
            while (subMap.has(index)) {
                index += 256;
            }
            previous = new item(index, previous.letter);
            subMap.set(index, previous);
            last = previous;
        }
        for (let i = 0; i < main.length; i++) {
            if (!subMap.has(main.charCodeAt(i))) {
                continue;
            }
            let index = main.charCodeAt(i);
            while (subMap.has(index)) {
                let current = subMap.get(index);
                let prev = subMap.get(current.prev);
                index += 256;
                if (current.repeated > 1) {
                    if (prev.getValue() <= 0)
                        continue;
                    if (main.charCodeAt(i - 1) != current.letter % 256) {
                        current.values.push(new repeatedValue());
                        current.values[current.values.length - 1].n = 0;
                        current.values[current.values.length - 1].backValue = prev.getValue();
                        if (current.values.length > 1) {
                            current.values.slice(0, -1).forEach((x) => {
                                current.values[current.values.length - 1].backValue -=
                                    x.backValue;
                            });
                        }
                    }
                    for (let i = 0; i < current.values.length; i++) {
                        current.values[i].n++;
                        current.values[i].value =
                            (calcUpperRepeated(current.values[i].n, current.repeated) /
                                current.fat) *
                                current.values[i].backValue;
                    }
                    continue;
                }
                current.value += prev.getValue();
                subMap.set(current.letter, current);
            }
        }
        return last.getValue();
    });
}
function count(a, b, m, n) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cancelOl)
            return 0;
        if (n == 0)
            return 1;
        if (m == 0)
            return 0;
        if (a[m - 1] == b[n - 1])
            return (yield count(a, b, m - 1, n - 1)) + (yield count(a, b, m - 1, n));
        else
            return count(a, b, m - 1, n);
    });
}
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
class countStepResponse {
    constructor(value, id = null) {
        this.value = value;
        this.id = id;
    }
}
function countStep(a, b, m, n) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cancelOl)
            return new countStepResponse(0);
        var content = addCountStep("countStep", 0);
        var idText = content.querySelectorAll("p")[0];
        var mainStringText = content.querySelectorAll("p")[1];
        var subStringText = content.querySelectorAll("p")[2];
        var resultText = content.querySelectorAll("p")[3];
        mainStringText.innerText = `main string: '${a.slice(0, m).length < 1 ? " " : a.slice(0, m)}'`;
        subStringText.innerText = `sub string: '${b.slice(0, n).length < 1 ? " " : b.slice(0, n)}'`;
        yield sleep(1000);
        if (n == 0) {
            resultText.innerText = "result: 1";
            return new countStepResponse(1, content.id);
        }
        if (m == 0) {
            resultText.innerText = "result: 0";
            return new countStepResponse(0, content.id);
        }
        if (a[m - 1] == b[n - 1]) {
            let a1 = a.slice(0, m - 1);
            a1 = a1.length < 1 ? " " : a1;
            let b1 = b.slice(0, n);
            b1 = b1.length < 1 ? " " : b1;
            let b2 = a.slice(0, n);
            b2 = b2.length < 1 ? " " : b2;
            resultText.innerText =
                `result: self('${a1}', '${b1}', ${m}-1, ${n}-1) + ` +
                    `self('${a1}', '${b2}', ${m}-1, ${n})`;
            let res1 = yield countStep(a, b, m - 1, n - 1);
            let res2 = yield countStep(a, b, m - 1, n);
            yield sleep(1000);
            resultText.innerText = `result: (${res1.id} + ${res2.id}) = ${res1.value + res2.value}`;
            return new countStepResponse(res1.value + res2.value, content.id);
        }
        else {
            let a1 = a.slice(0, m - 1);
            a1 = a1.length < 1 ? " " : a1;
            let b1 = b.slice(0, n);
            b1 = b1.length < 1 ? " " : b1;
            resultText.innerText = `result: self('${a1}', '${b1}', ${m}-1, ${n})`;
            let res = yield countStep(a, b, m - 1, n);
            yield sleep(1000);
            resultText.innerText = `result: (${res.id}) = ${res.value}`;
            return new countStepResponse(res.value, content.id);
        }
    });
}
//# sourceMappingURL=script.js.map