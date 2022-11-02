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
class repeatedValue {
    constructor(n = 0, backValue = 0, value = 0) {
        this.n = n;
        this.backValue = backValue;
        this.value = value;
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
                    if (i == 0 || main.charCodeAt(i - 1) != current.letter % 256) {
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
        if (cancelOl) {
            throw new Error("Canceled");
        }
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
//# sourceMappingURL=algorithms.js.map