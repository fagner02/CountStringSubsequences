function addCountStep() {
  var parent = <HTMLElement>document.querySelector(".recursive-tree");
  var content = document.createElement("div");
  var stringsText = document.createElement("div");
  var idText = document.createElement("p");
  var mainStringText = document.createElement("p");
  var subStringText = document.createElement("p");
  var resultText = document.createElement("p");

  content.className = "border-box content";
  idText.className = "id-box";

  stringsText.style.display = "flex";

  stringsText.appendChild(mainStringText);
  stringsText.appendChild(subStringText);
  content.appendChild(idText);
  content.appendChild(stringsText);
  content.appendChild(resultText);

  if (parent.lastChild == null) content.id = "step: 1";
  else
    content.id =
      "step: " +
      (parseInt((<HTMLElement>parent.lastChild).id.slice(6)) + 1).toString();

  idText.innerText = content.id;

  parent.append(content);

  return content;
}

function resetCountRecursiveView(main: string, sub: string) {
  document.querySelector(".recursive-tree")?.remove();

  var parent = document.createElement("div");
  parent.className = "recursive-tree";
  document.querySelector("body>.grid>.count-view")?.append(parent);

  stack = [];
  idCount = 1;
  mainStringRecursiveView = main;
  subStringRecursiveView = sub;
  startCountRecursiveView = true;

  countRecursiveView();
}

let mainStringRecursiveView: string;
let subStringRecursiveView: string;

class countStepResponse {
  value: number;
  id: string | null;
  constructor(value: number, id: string | null = null) {
    this.value = value;
    this.id = id;
  }
}

class stackCall {
  id: number;
  m: number;
  n: number;
  parent: number | null;
  result: number[] = [];
  children: number[] = [];

  constructor(id: number, m: number, n: number, parent: number | null = null) {
    this.id = id;
    this.m = m;
    this.n = n;
    this.parent = parent;
  }
}
let idCount = 1;
let stack: stackCall[] = [];

function setResultText(resultText: HTMLElement, current: stackCall) {
  resultText.innerText = `result: recur(${mainStringRecursiveView.slice(
    0,
    current.m - 1
  )},${subStringRecursiveView.slice(0, current.n - 1)}, ${current.m - 1}, ${
    current.n - 1
  }) + recur(${mainStringRecursiveView.slice(
    0,
    current.m - 1
  )},${subStringRecursiveView.slice(0, current.n)}, ${current.m - 1}, ${
    current.n
  })`;
}

function countRecursiveView() {
  if (startCountRecursiveView) {
    stack.push(
      new stackCall(
        idCount,
        mainStringRecursiveView.length,
        subStringRecursiveView.length
      )
    );
    startCountRecursiveView = false;
  }

  let current = stack[stack.length - 1];

  if (current.result.length > 0 && current.result.every((x) => x > -1)) {
    if (current.parent == null) {
      return;
    }
    var parentCall = stack[current.parent];
    var parent = document.getElementById(`step: ${parentCall.id}`);
    var oldResult = parent?.querySelectorAll("p")[3];
    var first = `(step: ${parentCall.children[0]})`;
    var second =
      parentCall.result[0] > -1
        ? `(step: ${parentCall.children[1]})`
        : `recur(${mainStringRecursiveView.slice(
            0,
            parentCall.m - 1
          )},${subStringRecursiveView.slice(0, parentCall.n)}, ${
            parentCall.m - 1
          }, ${parentCall.n})`;

    if (parentCall.result[0] == -1) {
      parentCall.result[0] = current.result.reduce((a, b) => a + b, 0);
    } else {
      parentCall.result[1] = current.result.reduce((a, b) => a + b, 0);
    }
    var result = parentCall.result
      .filter((x) => x > -1)
      .reduce((a, b) => a + b, 0);

    if (parentCall.children.length == 1) {
      oldResult!.innerText = `result: ${first} = ${result}`;
    } else {
      oldResult!.innerText = `result: ${first} + ${second} = ${result}`;
    }

    stack.pop();
    return;
  }

  if (current.result.length > 0) {
    idCount++;
    stack.push(
      new stackCall(idCount, current.m - 1, current.n, stack.indexOf(current))
    );
    current.children = [current.children[0], idCount];
    return;
  }

  var content = <HTMLElement>addCountStep();
  var mainStringText = <HTMLElement>content.querySelectorAll("p")[1];
  var subStringText = <HTMLElement>content.querySelectorAll("p")[2];
  var resultText = <HTMLElement>content.querySelectorAll("p")[3];

  // Set the main string
  mainStringText.innerText = `main string: '${
    mainStringRecursiveView.slice(0, current.m).length < 1
      ? " "
      : mainStringRecursiveView.slice(0, current.m - 1)
  }`;

  let mainLast = mainStringRecursiveView.slice(current.m - 1, current.m);
  let mainLastText = document.createElement("b");

  mainLastText.innerText = mainLast;
  mainStringText.appendChild(mainLastText);
  mainStringText.insertAdjacentText("beforeend", "'");

  // Set the sub string
  subStringText.innerText = `main string: '${
    subStringRecursiveView.slice(0, current.n).length < 1
      ? " "
      : subStringRecursiveView.slice(0, current.n - 1)
  }`;

  let subLast = subStringRecursiveView.slice(current.n - 1, current.n);
  let subLastText = document.createElement("b");

  subLastText.innerText = subLast;
  subStringText.appendChild(subLastText);
  subStringText.insertAdjacentText("beforeend", "'");

  if (current.n == 0) {
    current.result.push(1);
    resultText.innerText = "result: 1";
    return;
  }
  if (current.m == 0) {
    current.result.push(0);
    resultText.innerText = "result: 0";
    return;
  }

  if (
    mainStringRecursiveView[current.m - 1] ==
    subStringRecursiveView[current.n - 1]
  ) {
    idCount++;
    stack.push(
      new stackCall(
        idCount,
        current.m - 1,
        current.n - 1,
        stack.indexOf(current)
      )
    );
    current.result = [-1, -1];
    current.children = [idCount, -1];

    setResultText(resultText, current);
  } else {
    idCount++;
    stack.push(
      new stackCall(idCount, current.m - 1, current.n, stack.indexOf(current))
    );
    current.children = [idCount];
    current.result = [-1];
  }
}

let startCountRecursiveView = true;
