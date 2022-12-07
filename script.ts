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

const algorithmIterations = 100;

function setPath(avg: number, curve: number[], max: number) {
  var d = `M0 ${graphHeight}`;
  avg /= max;
  for (let i = 0; i < algorithmIterations; i++) {
    if (curve.length == i) {
      break;
    }
    if (isNaN(curve[i] / max)) {
      console.log("curve NaN");
      return;
    }
    d = d.replace(`V ${graphHeight}`, "");
    d +=
      "L" +
      i * (graphWidth / algorithmIterations) +
      " " +
      (graphHeight - (curve[i] / max) * graphHeight) +
      `V ${graphHeight}`;
    (graph?.firstElementChild as HTMLElement).setAttribute("d", d);
  }
  (graph?.children[2] as HTMLElement).setAttribute(
    "d",
    `M0 ${graphHeight - avg * graphHeight} H${graphWidth}`
  );
}

function setOptimizedResult(main: string, sub: string) {
  if (runAlgorithm != null) {
    window.clearTimeout(runningAlgorithm!);
  }
  runAlgorithm(count, 0, main, sub, 0, 0, 0, []);
}

let runningAlgorithm: null | number = null;

function runAlgorithm(
  algorithm: Function,
  i: number,
  main: string,
  sub: string,
  sum: number,
  max: number,
  actualMax: number,
  curve: number[]
): void {
  if (i == algorithmIterations) {
    return;
  }
  var result = 0;

  var start = performance.now();
  result = algorithm(main, sub, main.length, sub.length);
  var end = performance.now();

  let currentTime = (end - start) * 100;
  sum += currentTime;

  (<HTMLElement>resultsOp[1]).innerText = `result: ${result}`;
  (<HTMLElement>resultsOp[0]).innerText = `batch item: ${i.toString()}`;
  let time = (sum / 100 / (i + 1)).toString();
  (<HTMLElement>resultsOp[2]).innerText = `average timing: ${time.slice(
    0,
    time.indexOf(".") + 5
  )}ms`;

  let limit = 2;

  curve.push(currentTime);

  if (max < currentTime && (max == 0 || currentTime < max * limit)) {
    max = currentTime;
  }
  if (actualMax < currentTime) {
    actualMax = currentTime;
  }
  (graph?.children[1] as HTMLElement).setAttribute(
    "d",
    `M0 ${
      graphHeight - (actualMax / (max * limit)) * graphHeight
    } H${graphWidth}`
  );
  setPath(sum / (i + 1), curve, max * limit);
  runningAlgorithm = setTimeout(() => {
    return runAlgorithm(
      algorithm,
      i + 1,
      main,
      sub,
      sum,
      max,
      actualMax,
      curve
    );
  }, 1);
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
