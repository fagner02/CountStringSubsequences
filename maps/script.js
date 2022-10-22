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
inputSub.value = "aanna";
let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");
let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;
document.querySelectorAll("p").forEach((x) => {
    x.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        highlight.style.left = x.offsetLeft + "px";
        highlight.style.width = x.offsetWidth + "px";
        let main = inputMain.value;
        let sub = inputSub.value;
        if (x.innerText == "Old") {
            setOl(main, sub);
            return;
        }
        if (x.innerText == "Optimized") {
            setOp(main, sub);
            return;
        }
        yield setOp(main, sub);
        yield setOl(main, sub);
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
            resultsOp[1].innerText =
                "result: " + (yield findSub(main, sub)).toString();
            var end = performance.now();
            asum += end - start;
            resultsOp[0].innerText = "batch item: " + i.toString();
            yield sleep(0);
        }
        runningOp = false;
        resultsOp[2].innerText =
            "elapsed time: " + (asum / 100).toString().slice(0, 5);
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
            resultsOl[1].innerText =
                "result: " + (yield Count(main, sub, main.length, sub.length)).toString();
            var end = performance.now();
            asum += end - start;
            resultsOl[0].innerText = "batch item: " + i.toString();
            yield sleep(0);
        }
        runningOl = false;
        resultsOl[2].innerText =
            "elapsed time:" + (asum / 100).toString().slice(0, 5);
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
        // console.log(subMap);
        // var lastRepeat = null;
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
function Count(a, b, m, n) {
    return __awaiter(this, void 0, void 0, function* () {
        // If both first and second string is empty,
        // or if second string is empty, return 1
        if (cancelOl)
            return 0;
        if ((m == 0 && n == 0) || n == 0)
            return 1;
        // If only first string is empty and
        // second string is not empty, return 0
        if (m == 0)
            return 0;
        // If last characters are same
        // Recur for remaining strings by
        // 1. considering last characters of
        // both strings
        // 2. ignoring last character of
        // first string
        if (a[m - 1] == b[n - 1])
            return (yield Count(a, b, m - 1, n - 1)) + (yield Count(a, b, m - 1, n));
        // If last characters are different,
        // ignore last char of first string
        // and recur for remaining string
        else
            return Count(a, b, m - 1, n);
    });
}
// Driver code
//# sourceMappingURL=script.js.map