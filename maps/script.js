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
    "0": "black",
    "1": "hsl(350, 65%, 45%)",
    "2": "hsl(210, 50%, 40%)",
    "3": "hsl(140, 55%, 40%)",
};
function setHighlight() {
    highlight.style.opacity = "1";
    highlight.style.top = highlightSelected.offsetTop + "px";
    highlight.style.width = highlightSelected.offsetWidth + "px";
    highlight.style.left = highlightSelected.offsetLeft + "px";
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
                grid.className = "grid border-box";
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
function setOptimizedResult(main, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        var sum = 0;
        for (let i = 0; i < 100; i++) {
            var start = performance.now();
            resultsOp[1].innerText = `result: ${(yield findSub(main, sub)).toString()}`;
            var end = performance.now();
            sum += end - start;
            resultsOp[0].innerText = `batch item: ${i.toString()}`;
            let time = (sum / (i + 1)).toString();
            resultsOp[2].innerText = `average timing: ${time.slice(0, time.indexOf(".") + 5)}ms`;
            yield sleep(0);
        }
    });
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
function createParagraph(colored) {
    var p = document.createElement("p");
    p.className = "code-line";
    while (true) {
        let cIndex = colored.indexOf("|ç");
        var b = document.createElement("b");
        b.innerText = colored.slice(0, cIndex == -1 ? colored.length : cIndex);
        b.style.color = highlightColors[colored[cIndex + 2]];
        p.appendChild(b);
        if (cIndex == -1) {
            break;
        }
        colored = colored.slice(colored.indexOf("|ç") + 3);
        if (colored.length == 0) {
            break;
        }
    }
    return p;
}
function stringToCodeBlock(parent, str, sameLine = false) {
    let index = 0;
    while (true) {
        let end = str.indexOf("\n", index);
        if (end == -1) {
            break;
        }
        let div = document.createElement("div");
        div.className = "code-line";
        if (str[end - 1] == "{" || str[end - 4] == "{") {
            let openIndex = end + 1;
            let closeIndex = end + 1;
            while (true) {
                let newOpenIndex = str.indexOf("{", openIndex) + 1;
                if (newOpenIndex < openIndex) {
                    closeIndex = str.indexOf("}", closeIndex) + 1;
                    break;
                }
                openIndex = newOpenIndex;
                closeIndex = str.indexOf("}", closeIndex) + 1;
                if (openIndex > closeIndex) {
                    break;
                }
            }
            closeIndex--;
            let newStr = str.slice(end + 1, closeIndex);
            if (!sameLine) {
                parent.insertAdjacentElement("beforeend", createParagraph(str.slice(index, end)));
            }
            if (str[str.indexOf("\n", closeIndex) - 4] == "{") {
                sameLine = true;
            }
            else {
                sameLine = false;
            }
            stringToCodeBlock(div, newStr, sameLine);
            parent.insertAdjacentElement("beforeend", div);
            parent.insertAdjacentElement("beforeend", createParagraph(str.slice(closeIndex, str.indexOf("\n", closeIndex))));
            // parent.insertAdjacentElement("beforeend", document.createElement("br"));
            div.classList.add("ident");
            end = closeIndex + 1;
        }
        else {
            var colored = str
                .slice(index, end)
                .replace(/\|o/g, "{")
                .replace(/\|c/g, "}");
            div.appendChild(createParagraph(colored));
            // div.innerText = str;
            if (div.innerText == " ") {
                parent.insertAdjacentElement("beforeend", document.createElement("br"));
            }
            else {
                if (div.innerText.includes("|g")) {
                    div.classList.add("correctness-highlight");
                    div.innerText = div.innerText.replace(/\|g/g, "");
                }
                parent.insertAdjacentElement("beforeend", div);
            }
        }
        index = end + 1;
    }
}
let iterativeCorrectness = `classe item {
  int letra;
  int anterior;
  int valor;
  int contador;
  int code;
}
 
count(mainstring, substring, m, n) {
  variável dicionário = novo dicionário<inteiro, item>
  variável anterior = null
  dicionário[-1] = item com |ocode = -1, valor = 1|c
  for(int i = 0; i < n; i++) {
    variável index = substring[i]
    se index for uma chave existente no dicionário {
      variável contador = dicionário[index].contador
      dicionário[index].contador = contador + 1
      index = index + contador * 256
    }
    variável item
    se i == 0 {
      item = item com |oletra = substring[i], code = index, valor = 0, contador = 1, anterior = -1|c
    } caso contrário {
      item = item com |oletra = substring[i], code = index, valor = 0, contador = 1, anterior = anterior.code|c
    }
    anterior = item
    dicionário[index] = item
  }
 
  for(int i = 0; i < m; i++) {
    variável valorAnterior = 0;
    para todos os itens do dicionário com letra igual mainstring[i] {
      variável novoValor = item.valor;
      se item.letra == dicionário[item.anterior].letra {
        item.valor = item.valor + valorAnterior;
      } caso contrário {
        item.valor = item.valor + dicionário[item.anterior].valor;
      }
      valorAnterior = novoValor;
    }
  }
 
  retorna anterior.valor
}
`;
let dynamicCorrectness = `algoritmo |ç0countOccurrencesDP|ç1 (|ç0mainstring|ç2,|ç0 substring|ç2,|ç0 m|ç2,|ç0 n|ç2) {|ç0
    variável|ç0 lookup|ç2 =|ç0 matriz de inteiro com dimensões|ç3 [m+1][n+1]|ç0
 
    para|ç1 i|ç2 de|ç1 1|ç2 até|ç1 m|ç2{|ç0
        lookup|ç2[0][i]|ç0 = |ç00|ç2
    }
    para|ç1 j|ç2 de|ç1 1|ç2 até|ç1 n|ç2{
      lookup|ç2[i][0] = |ç01|ç2
    }
    para |ç1i|ç2 de|ç1 1|ç2 até|ç1 m|ç2 {|ç0
      para |ç1j |ç2de|ç1 1|ç2 até|ç1 n|ç2 {|ç0
            se|ç1 mainstring|ç2[i - 1] == [j - 1]{|ç0
                lookup|ç2[i][j] =  |ç0lookup|ç2[i - 1][j - 1] + |ç0
                                lookup|ç2[i - 1][j]|ç0
            }
            caso contrario |ç1{|ç0
                lookup|ç2[i][j] =|ç0 lookup|ç2[i - 1][j]|ç0
              }
      }
    }
  
    retorna|ç1 lookup|ç0[m][n]
    }
`;
let recursiveCorrectness = `
    pré condições: a e b são strings, m e n são inteiros positivos|ç3
    pós condições: retorna o número de vezes que b ocorre em a|ç3
    algoritmo |ç0contarOcorrencia|ç1(|ç0a|ç2,|ç0 b|ç2,|ç0 m|ç2,|ç0 n|ç2){|ç0
    se|ç1 n|ç2 ==|ç0 0|ç2 {|ç0
        retorne|ç1 1|ç2
    }
    se|ç1 m |ç2== |ç00|ç2 {|ç0
        retorne|ç1 0|ç2
    }
    se|ç1 a|ç2[|ç0m|ç2 -|ç0 1|ç2] == |ç0b|ç2[|ç0n|ç2 -|ç0 1|ç2] {|ç0
        retorne |ç1contarOcorrencia|ç0(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2|ç2-|ç01|ç2) + contarOcorrencia(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2)
    }|ç0 senão|ç1 {|ç0
        retorne|ç1 contarOcorrencia|ç0(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2)
    }
}
`;
var morph = anime({
    targets: ".blob path",
    d: [
        {
            value: "M60.2,-58.4C76.8,-43.6,88.2,-21.8,84.2,-4C80.2,13.8,60.8,27.6,44.2,37.7C27.6,47.8,13.8,54.2,0.4,53.8C-13,53.5,-26.1,46.3,-38.5,36.2C-50.9,26.1,-62.7,13,-62.4,0.2C-62.2,-12.6,-50,-25.2,-37.6,-40.1C-25.2,-54.9,-12.6,-71.9,4.6,-76.5C21.8,-81.1,43.6,-73.2,60.2,-58.4Z",
        },
        {
            value: "M50.3,-47.5C64.9,-35.7,76.2,-17.9,75.7,-0.4C75.3,17,63.1,34,48.6,40.2C34,46.3,17,41.7,1.6,40.1C-13.8,38.4,-27.5,39.9,-35,33.7C-42.6,27.5,-43.9,13.8,-42.7,1.2C-41.5,-11.4,-37.8,-22.8,-30.3,-34.5C-22.8,-46.3,-11.4,-58.5,3.2,-61.8C17.9,-65,35.7,-59.3,50.3,-47.5Z",
        },
    ],
    duration: 1000,
    easing: "easeInOutQuad",
    loop: true,
    direction: "alternate",
    autoplay: false,
});
// var squareToBlob = anime({
//   targets: ".pop-up-blob",
//   duration: 1000,
//   autoplay: false,
// });
//# sourceMappingURL=script.js.map