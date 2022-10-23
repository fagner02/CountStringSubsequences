let highlight: HTMLElement = document.querySelector(".highlight")!;
highlight.style.width = document.querySelector("p")!.offsetWidth + "px";

let inputMain = <HTMLInputElement>document.querySelector("#main")!;
inputMain.value = "annnan";

let inputSub = <HTMLInputElement>document.querySelector("#sub")!;
inputSub.value = "aanna";

let resultsOp = document.querySelectorAll(".result-op > p");
let resultsOl = document.querySelectorAll(".result-ol > p");

let cancelOp = false;
let cancelOl = false;
let runningOp = false;
let runningOl = false;

(<HTMLElement[]>(<any>document.querySelectorAll("p.option"))).forEach((x) => {
  x.addEventListener("click", async () => {
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
      await setOp(main, sub);
      await setOl(main, sub);
    }

    if (x.innerText == "Visualize Old Code") {
      (<HTMLElement>document.querySelector(".result-box")).style.opacity = "0";
      document.querySelector(".count-view")?.remove();
      var parent = document.createElement("div");
      parent.className = "count-view";
      document.querySelector("body>.grid")?.append(parent);
      countStep(main, sub, main.length, sub.length);
    }
  });
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    await sleep(0);
  }
  runningOp = false;
  (<HTMLElement>resultsOp[2]).innerText = `elapsed time: ${(asum / 100)
    .toString()
    .slice(0, 5)}ms`;
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

    (<HTMLElement>resultsOl[1]).innerText = `result: ${(
      await count(main, sub, main.length, sub.length)
    ).toString()}`;

    var end = performance.now();
    asum += end - start;
    (<HTMLElement>resultsOl[0]).innerText = `batch item: ${i.toString()}`;
    await sleep(0);
  }
  runningOl = false;
  (<HTMLElement>resultsOl[2]).innerText = `elapsed time:${(asum / 100)
    .toString()
    .slice(0, 5)}ms`;
}

class repeatedValue {
  value: number = 0;
  n: number = 0;
  backValue: number = 0;
}

class item {
  letter: number;
  prev: number;
  fat: number = 0;
  value: number;
  getValue() {
    if (this.repeated > 1) {
      return this.values.map((x) => x.value).reduce((a, b) => a + b, 0);
    }
    return this.value;
  }
  repeated: number = 1;
  n: number = 0;
  values: repeatedValue[] = [];
  constructor(letter: number, prev: number, value: number = 0) {
    this.letter = letter;
    this.prev = prev;
    this.value = value;
  }
}

function calcUpperRepeated(n: number, repeat: number) {
  if (n < repeat) return 0;
  let result = 1;
  for (let i = n; i > n - repeat; i--) {
    result *= i;
  }
  return result;
}

function calcLowerRepeated(n: number): number {
  if (n == 0) return 1;
  return n * calcLowerRepeated(n - 1);
}

async function findSub(main: string, sub: string) {
  let subMap: Map<number, item> = new Map();
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

    if (previous!.letter % 256 == sub.charCodeAt(i)) {
      previous!.repeated++;
      previous!.fat = calcLowerRepeated(previous!.repeated);

      subMap.set(previous!.letter, previous!);

      last = previous!;
      continue;
    }

    let index = sub.charCodeAt(i);
    while (subMap.has(index)) {
      index += 256;
    }

    previous = new item(index, previous!.letter);
    subMap.set(index, previous);
    last = previous;
  }

  for (let i = 0; i < main.length; i++) {
    if (!subMap.has(main.charCodeAt(i))) {
      continue;
    }
    let index = main.charCodeAt(i);
    while (subMap.has(index)) {
      let current = subMap.get(index)!;
      let prev = subMap.get(current.prev)!;
      index += 256;
      if (current.repeated > 1) {
        if (prev.getValue() <= 0) continue;
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
  return last!.getValue();
}

async function count(a: any, b: any, m: any, n: any): Promise<number> {
  if (cancelOl) return 0;
  if (n == 0) return 1;

  if (m == 0) return 0;

  if (a[m - 1] == b[n - 1])
    return (await count(a, b, m - 1, n - 1)) + (await count(a, b, m - 1, n));
  else return count(a, b, m - 1, n);
}

function addCountStep(step: string, value: number) {
  var parent = <HTMLElement>document.querySelector(".count-view");
  var content = document.createElement("div");
  var title = document.createElement("div");
  var text = document.createElement("p");

  content.className = "content";
  content.className = "border-box";

  text.innerText = "tgybu";

  title.appendChild(text);
  content.appendChild(title);
  if (parent.firstChild == null) text.id = "s1";
  else
    text.id =
      "s" +
      (
        parseInt(
          (<HTMLElement>parent.firstChild.firstChild?.firstChild).id.slice(1)
        ) + 1
      ).toString();
  parent.prepend(content);

  return content;
}

class countStepResponse {
  value: number;
  id: string | null;
  constructor(value: number, id: string | null = null) {
    this.value = value;
    this.id = id;
  }
}

async function countStep(
  a: any,
  b: any,
  m: any,
  n: any
): Promise<countStepResponse> {
  if (cancelOl) return new countStepResponse(0);

  var content = <HTMLElement>(
    addCountStep("countStep", 0).firstChild?.firstChild
  );
  await sleep(1000);
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
    let res1 = await countStep(a, b, m - 1, n - 1);
    let res2 = await countStep(a, b, m - 1, n);
    await sleep(1000);
    content.innerText =
      content.id + `\n${res1.id} + ${res2.id} = ${res1.value + res2.value}`;
    return new countStepResponse(res1.value + res2.value, content.id);
  } else {
    content.innerText =
      content.id + `\nself(${a.slice(0, m - 1)},${b.slice(0, n)},${m}-1, ${n})`;
    let res = await countStep(a, b, m - 1, n);
    await sleep(1000);
    content.innerText = content.id + `\n${res.id} = ${res.value}`;
    return new countStepResponse(res.value, content.id);
  }
}
