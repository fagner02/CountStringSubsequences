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
class item {
    constructor(letter, prev, value = 0) {
        this.code = -1;
        this.count = 1;
        this.letter = letter;
        this.prev = prev;
        this.value = value;
    }
}
function findSub(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        let previous;
        let subMap = {};
        subMap[-1] = new item(-1, -1, 1);
        for (var i = 0; i < sub.length; i++) {
            let charCodeAt = sub.charCodeAt(i);
            let index = charCodeAt;
            let last = subMap[index];
            if (last != undefined) {
                index = index + last.count * 256;
                last.count++;
            }
            previous = i == 0 ? new item(index, -1) : new item(index, previous.letter);
            previous.code = charCodeAt;
            subMap[index] = previous;
        }
        for (let i = 0; i < main.length; i++) {
            var index = main.charCodeAt(i);
            let current = subMap[index];
            if (current == undefined) {
                continue;
            }
            let initial = current.count;
            let last = subMap[current.prev].value;
            for (let k = 0; k < initial; k++) {
                let current = subMap[index];
                let newLast = current.value;
                let prev = subMap[current.prev];
                if (current.code != prev.code) {
                    current.value += prev.value;
                }
                else {
                    current.value += last;
                }
                last = newLast;
                index += 256;
            }
        }
        return previous.value;
    });
}
function count(a, b, m, n) {
    return __awaiter(this, void 0, void 0, function* () {
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