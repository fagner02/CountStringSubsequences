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
document.querySelectorAll("p.option").forEach((x) => {
    x.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
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
        if (x.innerText == "Both") {
            yield setOp(main, sub);
            yield setOl(main, sub);
        }
        if (x.innerText == "Visualize Old Code") {
            document.querySelector(".result-box").style.opacity = "0";
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
            yield sleep(0);
        }
        runningOp = false;
        resultsOp[2].innerText = `elapsed time: ${(asum / 100)
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
            yield sleep(0);
        }
        runningOl = false;
        resultsOl[2].innerText = `elapsed time:${(asum / 100)
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
    var _a;
    var parent = document.querySelector(".count-view");
    var content = document.createElement("div");
    var title = document.createElement("div");
    var text = document.createElement("p");
    content.className = "content";
    content.className = "border-box";
    text.innerText = "tgybu";
    title.appendChild(text);
    content.appendChild(title);
    if (parent.firstChild == null)
        text.id = "s1";
    else
        text.id =
            "s" +
                (parseInt(((_a = parent.firstChild.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild).id.slice(1)) + 1).toString();
    parent.prepend(content);
    return content;
}
class countStepResponse {
    constructor(value, id = null) {
        this.value = value;
        this.id = id;
    }
}
function countStep(a, b, m, n) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (cancelOl)
            return new countStepResponse(0);
        var content = ((_a = addCountStep("countStep", 0).firstChild) === null || _a === void 0 ? void 0 : _a.firstChild);
        yield sleep(1000);
        if (n == 0) {
            content.innerText = content.id + "\n1";
            return new countStepResponse(1, content.id);
        }
        if (m == 0) {
            content.innerText = content.id + "\n0";
            return new countStepResponse(0, content.id);
        }
        if (a[m - 1] == b[n - 1]) {
            content.innerText =
                content.id +
                    `\nself(${a.slice(0, m - 1)},${b.slice(0, n - 1)},${m}-1, ${n}-1) + ` +
                    `self(${a.slice(0, m - 1)},${b.slice(0, n)}, ${m}-1, ${n})`;
            let res1 = yield countStep(a, b, m - 1, n - 1);
            let res2 = yield countStep(a, b, m - 1, n);
            yield sleep(1000);
            content.innerText =
                content.id + `\n${res1.id} + ${res2.id} = ${res1.value + res2.value}`;
            return new countStepResponse(res1.value + res2.value, content.id);
        }
        else {
            content.innerText =
                content.id + `\nself(${a.slice(0, m - 1)},${b.slice(0, n)},${m}-1, ${n})`;
            let res = yield countStep(a, b, m - 1, n);
            yield sleep(1000);
            content.innerText = content.id + `\n${res.id} = ${res.value}`;
            return new countStepResponse(res.value, content.id);
        }
    });
}
//# sourceMappingURL=script.js.map