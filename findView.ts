let i1: number = 0;
let i2: number = 0;
let i3: number = 0;

let subMapView: Map<number, item> = new Map();
let previousView: item | null = null;
let mainStringView: string = "";
let subStringView: string = "";

let settingMap = false;
let resolvingRepeated = false;
let resolving = false;
let start = true;
let done = true;

let iteratorText = <HTMLElement>document.querySelector("p.iterator")!;
let mainStringViewText = <HTMLElement>document.querySelector("p.main-string")!;
let subStringViewText = <HTMLElement>document.querySelector("p.sub-string")!;
let repeatedCharacterValueText = <HTMLElement>(
  document.querySelector("p.last-repeated-character")!
);
let currentRepeatedCharacterValue = <HTMLElement>(
  document.querySelector("p.cur-repeated-character")!
);
let mapItems = <HTMLElement>document.querySelector(".map-items")!.parentElement;
let resultText1 = <HTMLElement>(
  document.querySelector(".find-view>.colored-box")!
);
let subMapViewItems: HTMLElement[] = [];

let showingValues = false;

function resetCountAggregateCalcView(mainString: string, subString: string) {
  (<HTMLElement>document.querySelector(".map-items")).remove();
  mapItems = document.createElement("div");
  mapItems.className = "map-items";
  (<HTMLElement>document.querySelector(".find-view>.column>div")).prepend(
    mapItems
  );
  subMapViewItems = [];

  i1 = 0;
  i2 = 0;
  i3 = 0;

  repeatedCharacterValueText.innerText = "?";
  iteratorText.innerText = "?";
  resultText1.innerText = "result: ?";
  resultText1.style.backgroundColor = "hsl(0, 0%, 20%)";
  mainStringViewText.innerText = mainString;
  subStringViewText.innerText = subString;
  subMapView = new Map();
  previousView = null;
  mainStringView = mainString;
  subStringView = subString;
  settingMap = false;
  resolvingRepeated = false;
  resolving = false;
  start = true;
  done = false;

  countAggregateCalcView();
}

function addMapItem(item: item) {
  var infobox = document.createElement("div");
  var content = document.createElement("div");
  var letter = document.createElement("p");
  var prev = document.createElement("p");
  var count = document.createElement("p");
  var value = document.createElement("p");

  if (item.letter == -1) {
    letter.innerText = "first ";
    value.innerText = "value: 1";
  } else {
    letter.innerText =
      String.fromCharCode(item.letter % 256) + " - " + item.letter.toString();
    prev.innerText = "previous: " + item.prev;
    value.innerText = "value: " + item.value.toString();
    count.innerText =
      "count: " + (subMapView.get(item.code)!.count - 1).toString();
  }
  if (item.prev == -1) {
    prev.innerText = "previous: first";
  }

  infobox.className = "border-box";
  infobox.id = "item" + item.letter;

  content.className = "value-content";
  content.id = "values" + item.letter;

  content.appendChild(value);
  content.appendChild(prev);
  content.appendChild(count);
  infobox.appendChild(letter);
  infobox.appendChild(content);
  mapItems.appendChild(infobox);
  return letter;
}

let highlightedItems: HTMLElement[] = [];

function updateMapItem(item: item) {
  var infobox = <HTMLElement>document.querySelector("#item" + item.letter);

  var idBox = <HTMLElement>infobox.querySelector("p");

  var value = <HTMLElement>infobox?.querySelectorAll(".value-content>p")[0];
  var count = <HTMLElement>infobox?.querySelectorAll(".value-content>p")[2];

  idBox.style.backgroundColor = "hsl(130, 55%, 45%)";
  value.innerText = "value: " + item.value.toString();

  return idBox;
}

function setMap() {
  if (!(i1 < subStringView.length)) {
    settingMap = false;
    resolving = true;
    let sub = subStringViewText.innerText;
    subStringViewText.innerText = "";
    let b = document.createElement("b");
    b.innerText = sub;
    subStringViewText.appendChild(b);
    setHighlightedItems(false);
    return;
  }
  iteratorText.innerText = i1.toString();
  setSubStringView();

  let index = subStringView.charCodeAt(i1);
  if (subMapView.has(index)) {
    subMapView.get(index)!.count++;
    index += (subMapView.get(index)!.count - 1) * 256;
  }

  previousView =
    i1 == 0
      ? new item(subStringView.charCodeAt(i1), -1)
      : new item(index, previousView!.letter);
  previousView.code = subStringView.charCodeAt(i1);
  subMapView.set(index, previousView);
  setHighlightedItems(false);
  highlightedItems.push(addMapItem(previousView));
  setHighlightedItems(true, false);
  i1++;
}

function setMainStringView() {
  mainStringViewText.innerText = mainStringView.slice(0, i2);
  var b = document.createElement("b");
  b.innerText = mainStringView[i2];
  mainStringViewText.appendChild(b);
  mainStringViewText.insertAdjacentText(
    "beforeend",
    mainStringView.slice(i2 + 1, mainStringView.length)
  );
}

function setSubStringView() {
  subStringViewText.innerText = subStringView.slice(0, i1);
  var b = document.createElement("b");
  b.innerText = subStringView[i1];
  subStringViewText.appendChild(b);
  subStringViewText.insertAdjacentText(
    "beforeend",
    subStringView.slice(i1 + 1, subStringView.length)
  );
}

function setHighlightedItems(active: boolean, useResolveColor = true) {
  highlightedItems.forEach((x) => {
    x.style.backgroundColor = active
      ? useResolveColor
        ? "hsl(130, 55%, 45%)"
        : "hsl(200, 50%, 50%)"
      : "hsl(0, 0%, 20%)";
  });

  if (!active) {
    highlightedItems = [];
    return;
  }
  scrollToItem(highlightedItems[highlightedItems.length - 1]);
}

function scrollToItem(item: HTMLElement) {
  let pos = item.offsetLeft - mapItems.offsetLeft - 10;
  let max = mapItems.scrollWidth - mapItems.offsetWidth;
  (<HTMLElement>mapItems.parentElement).scrollTo({
    behavior: "smooth",
    left: pos > max ? max : pos,
  });
}

let initialCountAggregateView = 0;
let indexAggregateView = 0;
let lastAggregateView: number;
let newLastAggregateView: number = 1;
let firstBlue = false;

function repeatedItemResolve() {
  if (i3 >= initialCountAggregateView) {
    resolvingRepeated = false;
    i2++;
    i3 = 0;
    return countAggregateCalcView();
  }
  let current = subMapView.get(indexAggregateView)!;
  if (newLastAggregateView != -1) {
    setHighlightedItems(false);
    repeatedCharacterValueText.innerText = lastAggregateView.toString();
    currentRepeatedCharacterValue.innerText = current.value.toString();

    newLastAggregateView = -1;
    repeatedCharacterValueText.style.backgroundColor = firstBlue
      ? "hsl(250, 50%, 50%)"
      : "hsl(200, 50%, 50%)";
    currentRepeatedCharacterValue.style.backgroundColor = firstBlue
      ? "hsl(200, 50%, 50%)"
      : "hsl(250, 50%, 50%)";
    firstBlue = !firstBlue;
    return;
  }

  newLastAggregateView = current.value;

  let prev = subMapView.get(current.prev)!;
  if (current.code != prev.code) {
    current.value += prev.value;
  } else {
    current.value += lastAggregateView;
  }
  // repeatedCharacterValueText.innerText = newLastAggregateView.toString();
  lastAggregateView = newLastAggregateView;
  indexAggregateView += 256;
  setHighlightedItems(false);
  highlightedItems.push(updateMapItem(current));
  setHighlightedItems(true);

  i3++;

  if (i3 == initialCountAggregateView) {
    repeatedCharacterValueText.style.backgroundColor = "hsl(0, 0%, 20%)";
    currentRepeatedCharacterValue.style.backgroundColor = "hsl(0, 0%, 20%)";
  }
}

function resolveFind(mainStringView: string) {
  if (!(i2 < mainStringView.length)) {
    resolving = false;
    done = true;
    setHighlightedItems(false);
    resultText1.innerText = "result: " + previousView?.value.toString();
    highlightedItems.push(resultText1);
    setHighlightedItems(true);
    let main = mainStringViewText.innerText;
    let b = document.createElement("b");
    b.innerText = main;
    mainStringViewText.innerText = "";
    mainStringViewText.appendChild(b);
    return;
  }

  iteratorText.innerText = i2.toString();
  setMainStringView();
  if (!subMapView.has(mainStringView.charCodeAt(i2))) {
    i2++;
    return;
  }

  indexAggregateView = mainStringView.charCodeAt(i2);
  let current = subMapView.get(indexAggregateView)!;

  initialCountAggregateView = current.count;
  lastAggregateView = subMapView.get(current.prev)!.value;
  newLastAggregateView = 1;

  resolvingRepeated = true;
  firstBlue = false;
  repeatedItemResolve();
}

async function countAggregateCalcView() {
  if (start) {
    subMapView.set(-1, new item(-1, -2, 1));
    addMapItem(subMapView.get(-1)!);
    start = false;
    settingMap = true;
    return;
  }
  if (settingMap) {
    setMap();
    return;
  }
  if (resolvingRepeated) {
    repeatedItemResolve();
    return;
  }
  if (resolving) {
    resolveFind(mainStringView);
    return;
  }
  if (done) {
    return previousView!.value;
  }
}
