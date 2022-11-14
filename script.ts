let highlight: HTMLElement = document.querySelector(".highlight")!;
let highlightSelected = <HTMLElement>document.querySelector("p");

let highlightColors: any = {
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

let popupBackground = <HTMLElement>document.querySelector(".pop-up")!;
let teamPresented = false;
let popupOn = false;

let recursiveViewOn = false;
let dynamicViewOn = false;

window.addEventListener("keydown", async (e: KeyboardEvent) => {
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
      var el = document.querySelector(".pop-up-box") as HTMLElement;

      el.style.scale = "1";
      teamPresented = true;
      popupOn = true;
      return;
    }

    if (!popupOn && recursiveViewOn) {
      var el = document.querySelector(".pop-up-box") as HTMLElement;
      el.remove();
      el = document.createElement("div");
      el.className = "pop-up-box";
      el.style.scale = "0";
      document.querySelector(".pop-up")?.appendChild(el);
      stringToCodeBlock(el, recursiveCorrectness);
      el.style.scale = "1";
      popupOn = true;
    }

    if (!popupOn && dynamicViewOn) {
      var el = document.querySelector(".pop-up-box") as HTMLElement;
      el.remove();
      el = document.createElement("div");
      el.className = "pop-up-box";
      el.style.scale = "0";
      document.querySelector(".pop-up")?.appendChild(el);
      stringToCodeBlock(el, dynamicCorrectness);
      el.style.scale = "1";
      popupOn = true;
    }
  }
});

let inputMain = <HTMLInputElement>document.querySelector("#main")!;
inputMain.value = "banana";

let inputSub = <HTMLInputElement>document.querySelector("#sub")!;
inputSub.value = "ana";

let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");
let resultThree = document.querySelectorAll(".result-three > p");

let timeout: Map<string, number[]> = new Map([["countStep", []]]);

function openRecursiveCorrectness() {
  let units = <HTMLElement[]>(
    (<any>document.querySelectorAll(".correctness > .grid > .unit"))
  );
  let buttons = <HTMLElement[]>(
    (<any>document.querySelector(".correctness > .controls")?.children)
  );
  buttons[1].style.backgroundColor = "hsl(200, 50%, 50%)";
  buttons[0].style.backgroundColor = "hsl(0, 0%, 20%)";
  units[0].style.display = "flex";
  units[1].style.display = "none";
}

function openIterativeCorrectness() {
  let units = <HTMLElement[]>(
    (<any>document.querySelectorAll(".correctness > .grid > .unit"))
  );
  let buttons = <HTMLElement[]>(
    (<any>document.querySelector(".correctness > .controls")?.children)
  );
  buttons[0].style.backgroundColor = "hsl(200, 50%, 50%)";
  buttons[1].style.backgroundColor = "hsl(0, 0%, 20%)";
  units[1].style.display = "flex";
  units[0].style.display = "none";
}

let correctnessOpened = false;

(<HTMLElement[]>(<any>document.querySelectorAll("p.option"))).forEach((x) => {
  x.addEventListener("click", () => {
    highlightSelected = x;
    setHighlight();
    let main = inputMain.value;
    let sub = inputSub.value;

    let textBox = <HTMLInputElement>document.querySelector(".text")!;
    let resultBox = <HTMLElement>document.querySelector(".result-box");
    let countView = <HTMLElement>document.querySelector(".count-view");
    let findView = <HTMLElement>document.querySelector(".find-view");
    let dynamicView = <HTMLElement>document.querySelector(".dynamic-view");
    let introduction = <HTMLElement>document.querySelector(".introduction");
    let correctness = <HTMLElement>document.querySelector(".correctness");

    if (x.innerText == "Introduction" || x.innerText == "Correctness") {
      textBox.style.display = "none";
    } else {
      textBox.style.display = "flex";
    }

    if (x.innerText == "Introduction") {
      introduction.style.opacity = "1";
      introduction.style.zIndex = "1";
    } else {
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
    } else {
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
    } else {
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
    } else {
      dynamicView.style.opacity = "0";
      dynamicView.style.zIndex = "-1";
      dynamicViewOn = false;
    }

    if (x.innerText == "Correctness") {
      correctness.style.opacity = "1";
      correctness.style.zIndex = "1";
      if (!correctnessOpened) {
        document.querySelector(".correctness > .grid")?.remove();
        let grid = <HTMLElement>document.createElement("div");
        grid.className = "grid shadow-box";
        let unit1 = <HTMLElement>document.createElement("div");
        unit1.className = "unit column";
        let unit2 = <HTMLElement>document.createElement("div");
        unit2.className = "unit column";
        grid.appendChild(unit1);
        grid.appendChild(unit2);
        document.querySelector(".correctness")?.appendChild(grid);
        stringToCodeBlock(unit2, dynamicCorrectness);
        stringToCodeBlock(unit1, recursiveCorrectness);
        correctnessOpened = true;
      }
    } else {
      correctness.style.opacity = "0";
      correctness.style.zIndex = "-1";
    }

    if (x.innerText == "Results") {
      resultBox.style.opacity = "1";
      resultBox.style.zIndex = "1";
      setOptimizedResult(main, sub);
      setOldResult(main, sub);
    } else {
      resultBox.style.opacity = "0";
      resultBox.style.zIndex = "-1";
    }
  });
});

async function sleep(ms: number, group?: string) {
  return new Promise((resolve) => {
    if (group != null) {
      if (!timeout.has(group)) {
        timeout.set(group, []);
      }
      timeout.get(group)!.push(setTimeout(resolve, ms));
    }
    setTimeout(resolve, ms);
  });
}

async function setOptimizedResult(main: string, sub: string) {
  var sum = 0;
  for (let i = 0; i < 100; i++) {
    var start = performance.now();

    (<HTMLElement>resultsOp[1]).innerText = `result: ${(
      await findSub(main, sub)
    ).toString()}`;

    var end = performance.now();
    sum += end - start;

    (<HTMLElement>resultsOp[0]).innerText = `batch item: ${i.toString()}`;
    let time = (sum / (i + 1)).toString();
    (<HTMLElement>resultsOp[2]).innerText = `average timing: ${time.slice(
      0,
      time.indexOf(".") + 5
    )}ms`;
    await sleep(0);
  }
}

async function setOldResult(main: string, sub: string) {
  var sum = 0;
  for (let i = 0; i < 100; i++) {
    var start = performance.now();

    (<HTMLElement>resultsOl[1]).innerText = `result: ${count(
      main,
      sub,
      main.length,
      sub.length
    ).toString()}`;

    var end = performance.now();
    sum += end - start;
    (<HTMLElement>resultsOl[0]).innerText = `batch item: ${i.toString()}`;
    let time = (sum / (i + 1)).toString();
    (<HTMLElement>resultsOl[2]).innerText = `average timing: ${time.slice(
      0,
      time.indexOf(".") + 5
    )}ms`;
    await sleep(0);
  }
}

function createParagraph(colored: string) {
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

function stringToCodeBlock(
  parent: HTMLElement,
  str: string,
  sameLine: boolean = false
) {
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
        parent.insertAdjacentElement(
          "beforeend",
          createParagraph(str.slice(index, end))
        );
      }
      if (str[str.indexOf("\n", closeIndex) - 4] == "{") {
        sameLine = true;
      } else {
        sameLine = false;
      }
      stringToCodeBlock(div, newStr, sameLine);

      parent.insertAdjacentElement("beforeend", div);
      parent.insertAdjacentElement(
        "beforeend",
        createParagraph(str.slice(closeIndex, str.indexOf("\n", closeIndex)))
      );
      // parent.insertAdjacentElement("beforeend", document.createElement("br"));

      div.classList.add("ident");
      end = closeIndex + 1;
    } else {
      var colored = str
        .slice(index, end)
        .replace(/\|o/g, "{")
        .replace(/\|c/g, "}");

      div.appendChild(createParagraph(colored));
      // div.innerText = str;

      if (div.innerText == " ") {
        parent.insertAdjacentElement("beforeend", document.createElement("br"));
      } else {
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
