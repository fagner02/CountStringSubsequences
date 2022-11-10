let highlight: HTMLElement = document.querySelector(".highlight")!;
let highlightSelected = <HTMLElement>document.querySelector("p");

let highlightColors: any = {
  "0": "black",
  "1": "hsl(350, 55%, 55%)",
  "2": "hsl(210, 55%, 55%)",
};

function setHighlight() {
  highlight.style.opacity = "1";
  highlight.style.top = highlightSelected.offsetTop + "px";
  highlight.style.width = highlightSelected.offsetWidth + "px";
  highlight.style.height = highlightSelected.offsetHeight + "px";
  highlight.style.left = highlightSelected.offsetLeft + "px";

  var infoboxes = <HTMLElement[]>(
    (<any>document.querySelectorAll(".map-items>div>div"))
  );
  infoboxes.forEach((infobox) => {
    if (infobox.scrollHeight > infobox.clientHeight) {
      infobox.style.paddingRight = "5px";
    } else {
      infobox.style.paddingRight = "0px";
    }
  });
}
setTimeout(setHighlight, 100);

window.addEventListener("resize", setHighlight);

let popupBackground = <HTMLElement>document.querySelector(".pop-up")!;
let teamPresented = false;
let popupOn = false;

window.addEventListener("keydown", async (e: KeyboardEvent) => {
  console.log(e.ctrlKey, e.key, e.code);
  if (e.key == "Escape") {
    if (popupOn) {
      popupBackground.remove();
      popupBackground = <HTMLElement>document.createElement("div");
      popupBackground.className = "pop-up";
      popupOn = false;
    }
  }

  if (e.key == "|" && e.ctrlKey && e.shiftKey) {
    if (!teamPresented) {
      popupBackground.style.display = "block";
      popupOn = true;
      teamPresented = true;
    }
  }
});

let inputMain = <HTMLInputElement>document.querySelector("#main")!;
inputMain.value = "aa";

let inputSub = <HTMLInputElement>document.querySelector("#sub")!;
inputSub.value = "a";

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
      if (startCountRecursiveView) {
        resetCountRecursiveView(main, sub);
      }
    } else {
      countView.style.opacity = "0";
      countView.style.zIndex = "-1";
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
      if (startCountDynamicView) {
        resetCountDynamic(main, sub);
      }
    } else {
      dynamicView.style.opacity = "0";
      dynamicView.style.zIndex = "-1";
    }

    if (x.innerText == "Correctness") {
      correctness.style.opacity = "1";
      correctness.style.zIndex = "1";
      if (!correctnessOpened) {
        document.querySelector(".correctness > .grid")?.remove();
        let grid = <HTMLElement>document.createElement("div");
        grid.className = "grid border-box";
        let unit1 = <HTMLElement>document.createElement("div");
        unit1.className = "unit column";
        let unit2 = <HTMLElement>document.createElement("div");
        unit2.className = "unit column";
        grid.appendChild(unit1);
        grid.appendChild(unit2);
        document.querySelector(".correctness")?.appendChild(grid);
        stringToCodeBlock(unit1, recursiveCorrectness);
        stringToCodeBlock(unit2, dynamicCorrectness);
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
    if (str[end - 1] == "{") {
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
        parent.insertAdjacentText("beforeend", str.slice(index, end));
      }
      if (str[str.indexOf("\n", closeIndex) - 1] == "{") {
        sameLine = true;
      }
      stringToCodeBlock(div, newStr, sameLine);
      parent.insertAdjacentElement("beforeend", div);
      parent.insertAdjacentText(
        "beforeend",
        str.slice(closeIndex, str.indexOf("\n", closeIndex))
      );
      parent.insertAdjacentElement("beforeend", document.createElement("br"));

      div.className = "ident";
      end = closeIndex + 1;
    } else {
      var colored = str
        .slice(index, end)
        .replace(/\|o/g, "{")
        .replace(/\|c/g, "}");
      var p = document.createElement("p");
      while (true) {
        let cIndex = colored.indexOf("|ç");
        var b = document.createElement("b");
        b.innerText = colored.slice(0, cIndex);
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
      div.appendChild(p);
      // div.innerText = str;

      if (div.innerText == " ") {
        parent.insertAdjacentElement("beforeend", document.createElement("br"));
      } else {
        if (div.innerText.includes("|g")) {
          div.className = "correctness-highlight";
        }
        // div.innerText = div.innerText.replace(/\|g/g, "");
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

let dynamicCorrectness = `count|ç1(|ç0mainstring|ç2,|ç0 substring|ç2,|ç0 m|ç2,|ç0 n|ç2) {|ç0
  variável lookup = matriz de inteiro com dimensões [m+1][n+1]
 
  for (i = 0; i <= n; ++i) lookup[0][i] = 0
 
  for (i = 0; i <= m; ++i) lookup[i][0] = 1
 
  for (i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      se mainstring[i - 1] é igual a substring[j - 1] {
        lookup[i][j] = lookup[i - 1][j - 1] + lookup[i - 1][j];
      } caso contrario {
        lookup[i][j] = lookup[i - 1][j]
      } 
    }
  }
  retorna lookup[m][n]
}
`;

let recursiveCorrectness = `count(mainstring, substring, m, n){
  se n é igual a 0 {
    |gCaso base, se n for 0, uma sequência completa da substring foi encontrada na mainstring portanto retorna 1.
    retorne 1
  }
  se m é igual a 0 {
    |gCaso base, se m for 0 e n maior que 0, uma sequência completa da substring não foi encontrada na mainstring portanto retorna 0.
    retorne 0
  }
  se a[m - 1] é igual a b[n - 1] {
    |gCobre as duas possibilidades de continuar com uma sequência e começar uma nova.
    retorne count(mainstring, substring, m - 1, n - 1) + 
            count(mainstring, substring, m - 1, n)
  }
  caso contrário { 
    |gJá que os caracteres não são iguais, não existe continuação da sequência, portanto apenas cobre a possibilidade de começar uma nova sequência.
    retorne count(mainstring, substring, m - 1, n)
  }
}
`;
