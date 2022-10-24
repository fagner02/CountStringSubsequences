function addCountStep(step: string, value: number) {
  var parent = <HTMLElement>document.querySelector(".count-view");
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

  if (parent.lastChild == null) content.id = "step: 1";
  else
    content.id =
      "step: " +
      (parseInt((<HTMLElement>parent.lastChild).id.slice(6)) + 1).toString();

  idText.innerText = content.id;

  parent.append(content);

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
  if (cancelOlView) {
    throw new Error("cancelled");
  }

  var content = <HTMLElement>addCountStep("countStep", 0);

  var mainStringText = <HTMLElement>content.querySelectorAll("p")[1];
  var subStringText = <HTMLElement>content.querySelectorAll("p")[2];
  var resultText = <HTMLElement>content.querySelectorAll("p")[3];

  mainStringText.innerText = `main string: '${
    a.slice(0, m).length < 1 ? " " : a.slice(0, m)
  }'`;
  subStringText.innerText = `sub string: '${
    b.slice(0, n).length < 1 ? " " : b.slice(0, n)
  }'`;
  await sleep(1000, "countStep");
  if (n == 0) {
    resultText.innerText = "result: 1";
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

    let res1 = await countStep(a, b, m - 1, n - 1);
    let res2 = await countStep(a, b, m - 1, n);
    await sleep(1000, "countStep");

    resultText.innerText = `result: (${res1.id} + ${res2.id}) = ${
      res1.value + res2.value
    }`;

    return new countStepResponse(res1.value + res2.value, content.id);
  } else {
    let a1 = a.slice(0, m - 1);
    a1 = a1.length < 1 ? " " : a1;
    let b1 = b.slice(0, n);
    b1 = b1.length < 1 ? " " : b1;

    resultText.innerText = `result: self('${a1}', '${b1}', ${m}-1, ${n})`;

    let res = await countStep(a, b, m - 1, n);
    await sleep(1000, "countStep");
    resultText.innerText = `result: (${res.id}) = ${res.value}`;
    return new countStepResponse(res.value, content.id);
  }
}
