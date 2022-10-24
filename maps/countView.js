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
        if (cancelOlView) {
            throw new Error("cancelled");
        }
        var content = addCountStep("countStep", 0);
        var idText = content.querySelector(".id-box");
        var mainStringText = content.querySelectorAll("p")[1];
        var subStringText = content.querySelectorAll("p")[2];
        var resultText = content.querySelectorAll("p")[3];
        mainStringText.innerText = `main string: '${a.slice(0, m).length < 1 ? " " : a.slice(0, m - 1)}`;
        let mainLast = a.slice(m - 1, m);
        let mainLastText = document.createElement("b");
        mainLastText.innerText = mainLast;
        mainStringText.appendChild(mainLastText);
        mainStringText.insertAdjacentText("beforeend", "'");
        subStringText.innerText = `sub string: '${b.slice(0, n).length < 1 ? " " : b.slice(0, n - 1)}`;
        let subLast = b.slice(n - 1, n);
        let subLastText = document.createElement("b");
        subLastText.innerText = subLast;
        subStringText.appendChild(subLastText);
        subStringText.insertAdjacentText("beforeend", "'");
        yield sleep(1000, "countStep");
        if (n == 0) {
            resultText.innerText = "result: 1";
            idText.style.backgroundColor = "hsl(113, 65%, 45%)";
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
            yield sleep(1000, "countStep");
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
            yield sleep(1000, "countStep");
            resultText.innerText = `result: (${res.id}) = ${res.value}`;
            return new countStepResponse(res.value, content.id);
        }
    });
}
//# sourceMappingURL=countView.js.map