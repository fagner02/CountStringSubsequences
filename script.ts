let highlight: HTMLElement = document.querySelector(".highlight")!;
highlight.style.width = document.querySelector("p")!.offsetWidth + "px";
highlight.style.height = document.querySelector("p")!.offsetHeight + "px";
highlight.style.left = document.querySelector("p")!.offsetLeft + "px";

let inputMain = <HTMLInputElement>document.querySelector("#main")!;
inputMain.value = "annnan";

let inputSub = <HTMLInputElement>document.querySelector("#sub")!;
inputSub.value = "a";

let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");

let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;
let cancelOlView = false;
let runningOlView = false;
let timeout: Map<string, number[]> = new Map([["countStep", []]]);

(<HTMLElement[]>(<any>document.querySelectorAll("p.option"))).forEach((x) => {
  x.addEventListener("click", async () => {
    highlight.style.left = x.offsetLeft + "px";
    highlight.style.top = x.offsetTop + "px";
    highlight.style.width = x.offsetWidth + "px";
    highlight.style.height = x.offsetHeight + "px";
    let main = inputMain.value;
    let sub = inputSub.value;

    let resultBox = <HTMLElement>document.querySelector(".result-box");
    let countView = <HTMLElement>document.querySelector(".count-view");

    if (x.innerText == "Old") {
      if (runningOlView) {
        cancelOlView = true;
      }
      resultBox.style.opacity = "1";
      resultBox.style.zIndex = "1";
      countView.style.opacity = "0";
      setOl(main, sub);
      return;
    }

    if (x.innerText == "Optimized") {
      if (runningOlView) {
        cancelOlView = true;
      }
      resultBox.style.opacity = "1";
      resultBox.style.zIndex = "1";
      countView.style.opacity = "0";
      setOp(main, sub);
      return;
    }

    if (x.innerText == "Both") {
      if (runningOlView) {
        cancelOlView = true;
      }
      resultBox.style.opacity = "1";
      resultBox.style.zIndex = "1";
      countView.style.opacity = "0";
      await setOp(main, sub);
      await setOl(main, sub);
    }

    if (x.innerText == "Visualize-Old-Code") {
      if (runningOlView) {
        timeout.get("showView")?.forEach((x) => window.clearTimeout(x));
        cancelOlView = true;

        if (!timeout.has("showView")) {
          timeout.set("showView", []);
        }
        timeout.get("showView")?.push(
          setTimeout(() => {
            showView(resultBox, countView, main, sub);
          }, 1000)
        );

        return;
      }
      showView(resultBox, countView, main, sub);
    }
  });
});

async function showView(
  resultBox: HTMLElement,
  countView: HTMLElement,
  main: string,
  sub: string
) {
  resultBox.style.opacity = "0";
  resultBox.style.zIndex = "-1";
  countView.style.opacity = "1";
  document.querySelector(".count-view")?.remove();
  var parent = document.createElement("div");
  parent.className = "count-view";
  document.querySelector("body>.grid")?.append(parent);
  try {
    runningOlView = true;
    await countStep(main, sub, main.length, sub.length);
    runningOlView = false;
  } catch {
    cancelOlView = false;
    runningOlView = false;
    timeout.get("countStep")!.forEach((x) => window.clearTimeout(x));
  }
}

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

async function setOp(main: string, sub: string) {
  var asum = 0;
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
    asum += end - start;

    (<HTMLElement>resultsOp[0]).innerText = `batch item: ${i.toString()}`;
    let time = (asum / (i + 1)).toString();
    (<HTMLElement>resultsOp[2]).innerText = `average timing: ${time.slice(
      0,
      time.indexOf(".") + 5
    )}ms`;
    await sleep(0);
  }
  runningOp = false;
}

async function setOl(main: string, sub: string) {
  var asum = 0;
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
    asum += end - start;
    (<HTMLElement>resultsOl[0]).innerText = `batch item: ${i.toString()}`;
    let time = (asum / (i + 1)).toString();
    (<HTMLElement>resultsOl[2]).innerText = `average timing: ${time.slice(
      0,
      time.indexOf(".") + 5
    )}ms`;
    await sleep(0);
  }
  runningOl = false;
}
