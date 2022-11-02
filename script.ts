let highlight: HTMLElement = document.querySelector(".highlight")!;
let highlightSelected = <HTMLElement>document.querySelector("p");

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

let inputMain = <HTMLInputElement>document.querySelector("#main")!;
inputMain.value = "aa";

let inputSub = <HTMLInputElement>document.querySelector("#sub")!;
inputSub.value = "a";

let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");

let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;
let timeout: Map<string, number[]> = new Map([["countStep", []]]);

(<HTMLElement[]>(<any>document.querySelectorAll("p.option"))).forEach((x) => {
  x.addEventListener("click", async () => {
    highlightSelected = x;
    setHighlight();
    let main = inputMain.value;
    let sub = inputSub.value;

    let resultBox = <HTMLElement>document.querySelector(".result-box");
    let countView = <HTMLElement>document.querySelector(".count-view");
    let findView = <HTMLElement>document.querySelector(".find-view");

    if (x.innerText == "Results") {
      resultBox.style.opacity = "1";
      resultBox.style.zIndex = "1";
      countView.style.opacity = "0";
      findView.style.opacity = "0";
      countView.style.zIndex = "-1";
      findView.style.zIndex = "-1";
      await setOptimizedResult(main, sub);
      await setOldResult(main, sub);
    }

    if (x.innerText == "Visualize-Old-Code") {
      findView.style.opacity = "0";
      findView.style.zIndex = "-1";
      resultBox.style.opacity = "0";
      resultBox.style.zIndex = "-1";
      countView.style.opacity = "1";
      countView.style.zIndex = "1";
      if (startCountRecursiveView) {
        resetCountRecursiveView(main, sub);
      }
    }

    if (x.innerText == "Visualize-Optimized-Code") {
      resultBox.style.opacity = "0";
      resultBox.style.zIndex = "-1";
      countView.style.opacity = "0";
      countView.style.zIndex = "-1";
      findView.style.opacity = "1";
      findView.style.zIndex = "1";
      if (start) {
        resetCountAggregateCalcView(main, sub);
      }
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

function cancelOlFunc() {
  if (!runningOl) return;
  cancelOl = true;
}

function cancelOpFunc() {
  if (!runningOp) return;
  cancelOp = true;
}

async function setOptimizedResult(main: string, sub: string) {
  var sum = 0;
  runningOp = true;
  for (let i = 0; i < 100; i++) {
    if (cancelOp) {
      cancelOp = false;
      return;
    }

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
  runningOp = false;
}

async function setOldResult(main: string, sub: string) {
  var sum = 0;
  runningOl = true;
  for (let i = 0; i < 100; i++) {
    if (cancelOl) {
      cancelOl = false;
      return;
    }
    var start = performance.now();

    try {
      (<HTMLElement>resultsOl[1]).innerText = `result: ${(
        await count(main, sub, main.length, sub.length)
      ).toString()}`;
    } catch {
      return;
    }

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
  runningOl = false;
}
