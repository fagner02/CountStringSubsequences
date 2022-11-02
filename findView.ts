let i1: number = 0;
let i2: number = 0;

let subMapView: Map<number, item> = new Map();
let previousView: item | null = null;
let lastView: item | null = null;
let mainStringView: string = "";
let subStringView: string = "";

let settingMap = false;
let resolving = false;
let start = true;
let done = true;

let iteratorText = <HTMLElement>document.querySelector("p.iterator")!;
let mainStringViewText = <HTMLElement>document.querySelector("p.main-string")!;
let subStringViewText = <HTMLElement>document.querySelector("p.sub-string")!;
let mapItems = <HTMLElement>document.querySelector(".map-items")!.parentElement;
let resultText1 = <HTMLElement>(
  document.querySelector(".find-view>.colored-box")!
);
let subMapViewItems: HTMLElement[] = [];

let showingValues = false;
function showValues() {
  var values = document.querySelectorAll(".value-content:not(#values-1)");
  if (showingValues) {
    values.forEach((x) => {
      var layers = <HTMLElement[]>(<any>x.querySelectorAll(".unit"));

      layers[1].style.height = "0px";
      setTimeout(() => {
        layers[1].style.display = "none";
        layers[0].style.display = "flex";
        layers[0].style.height = layers[0].scrollHeight + "px";
      }, 500);
    });
    showingValues = false;
    return;
  }

  values.forEach((x) => {
    var layers = <HTMLElement[]>(<any>x.querySelectorAll(".unit"));

    layers[0].style.height = "0px";
    setTimeout(() => {
      layers[0].style.display = "none";
      layers[1].style.display = "flex";
      layers[1].style.height = layers[1].scrollHeight + "px";
    }, 500);
  });
  showingValues = true;
}

function resetCountAggregateCalcView(mainString: string, subString: string) {
  (<HTMLElement>document.querySelector(".map-items")).remove();
  var mapItems = document.createElement("div");
  mapItems.className = "map-items";
  (<HTMLElement>document.querySelector(".find-view>.border-box>div")).prepend(
    mapItems
  );
  subMapViewItems = [];

  i1 = 0;
  i2 = 0;
  iteratorText.innerText = "?";
  resultText1.innerText = "result: ?";
  resultText1.style.backgroundColor = "hsl(0, 0%, 20%)";
  mainStringViewText.innerText = mainString;
  subStringViewText.innerText = subString;
  subMapView = new Map();
  previousView = null;
  lastView = null;
  mainStringView = mainString;
  subStringView = subString;
  settingMap = false;
  resolving = false;
  start = true;
  done = false;

  countAggregateCalcView();
}

function addMapItem(item: item) {
  var infobox = document.createElement("div");
  var content = document.createElement("div");
  var infoLayer = document.createElement("div");
  var valuesLayer = document.createElement("div");
  var letter = document.createElement("p");
  var prev = document.createElement("p");
  var repeated = document.createElement("p");
  var values = document.createElement("p");

  if (item.letter == -1) {
    letter.innerText = "first ";
    values.innerText = "value: 1";
  } else {
    letter.innerText = String.fromCharCode(item.letter % 256);
    prev.innerText = "previous: " + String.fromCharCode(item.prev % 256);
    repeated.innerText = "repeat: " + item.repeated.toString();
    values.innerText = "value: [ " + item.getValue().toString() + " ]";
  }
  if (item.prev == -1) {
    prev.innerText = "previous: first";
  }

  infobox.className = "border-box";
  infobox.id = "item" + item.letter;

  content.className = "grid value-content";
  content.id = "values" + item.letter;

  infoLayer.className = "unit";
  valuesLayer.className = "unit";

  if (item.letter != -1) {
    addRepeatedValueItem(new repeatedValue(-1, 0, 0), valuesLayer);
  }

  infoLayer.appendChild(prev);
  infoLayer.appendChild(repeated);
  infoLayer.appendChild(values);
  content.appendChild(infoLayer);
  content.appendChild(valuesLayer);
  infobox.appendChild(letter);
  infobox.appendChild(content);

  (<HTMLElement>document.querySelector(".map-items")).appendChild(infobox);
  if (content.scrollHeight > content.clientHeight) {
    content.style.paddingRight = "5px";
  } else {
    content.style.paddingRight = "0px";
  }

  if (item.letter == -1) {
    return letter;
  }
  if (showingValues) {
    infoLayer.style.display = "none";
    valuesLayer.style.display = "flex";
    infoLayer.style.height = "0px";
    valuesLayer.style.height = valuesLayer.scrollHeight + "px";
  } else {
    infoLayer.style.height = infoLayer.scrollHeight + "px";
    valuesLayer.style.height = "0px";
  }

  return letter;
}

function addRepeatedValueItem(repeated: repeatedValue, parent: HTMLElement) {
  var repeatedValue = document.createElement("div");
  var value = document.createElement("p");
  var n = document.createElement("p");
  var prev = document.createElement("p");

  value.innerText = "value: " + repeated.value.toString();
  n.innerText = "n: " + (repeated.n == -1 ? "?" : repeated.n.toString());
  prev.innerText = "previous item value: " + repeated.backValue.toString();

  repeatedValue.className = "border-box";

  repeatedValue.appendChild(value);
  repeatedValue.appendChild(n);
  repeatedValue.appendChild(prev);

  parent?.appendChild(repeatedValue);
}

let highlightedItems: HTMLElement[] = [];

function updateMapItem(item: item) {
  var infobox = <HTMLElement>document.querySelector("#item" + item.letter);
  console.log(
    infobox?.querySelectorAll(".grid>div>p"),
    item.repeated.toString()
  );
  var idBox = <HTMLElement>infobox.querySelector("p");
  var repeated = <HTMLElement>infobox?.querySelectorAll(".grid>div>p")[1];
  var value = <HTMLElement>infobox?.querySelectorAll(".grid>div>p")[2];

  idBox.style.backgroundColor = "hsl(130, 55%, 45%)";
  repeated.innerText = "repeat: " + item.repeated.toString();
  value.innerText =
    "value: [ " +
    (item.values.length == 0
      ? item.getValue().toString()
      : item.values.map((x) => x.value).join(", ")) +
    " ]";

  var valuesLayer = <HTMLElement>infobox?.querySelectorAll(".grid>div")[1];
  var height = valuesLayer.scrollHeight;
  valuesLayer.remove();
  valuesLayer = document.createElement("div");

  item.values.forEach((x) => {
    addRepeatedValueItem(x, valuesLayer);
  });
  if (item.repeated < 2) {
    addRepeatedValueItem(
      new repeatedValue(-1, subMapView.get(item.prev)?.getValue(), item.value),
      valuesLayer
    );
  }

  if (item.letter != -1 && valuesLayer.firstChild == null) {
    addRepeatedValueItem(new repeatedValue(-1, 0, 0), valuesLayer);
  }

  valuesLayer.style.display = showingValues ? "flex" : "none";
  valuesLayer.style.height = height + "px";
  valuesLayer.className = "unit";
  var content = <HTMLElement>infobox?.querySelector(".grid");
  content.appendChild(valuesLayer);
  if (content.scrollHeight > content.clientHeight) {
    content.style.paddingRight = "5px";
  } else {
    content.style.paddingRight = "0px";
  }

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

  if (i1 == 0) {
    previousView = new item(subStringView.charCodeAt(i1), -1);
    subMapView.set(subStringView.charCodeAt(i1), previousView);
    setHighlightedItems(false);
    highlightedItems.push(addMapItem(previousView));
    setHighlightedItems(true, false);
    lastView = previousView;
    i1++;
    return;
  }

  if (previousView!.letter % 256 == subStringView.charCodeAt(i1)) {
    previousView!.repeated++;
    previousView!.fat = calcLowerRepeated(previousView!.repeated);
    subMapView.set(previousView!.letter, previousView!);
    lastView = previousView!;
    setHighlightedItems(false);
    highlightedItems.push(updateMapItem(previousView!));
    setHighlightedItems(true, false);
    i1++;
    return;
  }

  let index = subStringView.charCodeAt(i1);
  while (subMapView.has(index)) {
    index += 256;
  }

  previousView = new item(index, previousView!.letter);
  subMapView.set(index, previousView);
  setHighlightedItems(false);
  highlightedItems.push(addMapItem(previousView));
  setHighlightedItems(true, false);
  lastView = previousView;
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
  mapItems.scrollTo({
    behavior: "smooth",
    left: pos > max ? max : pos,
  });
}

function resolveFind(mainStringView: string) {
  if (!(i2 < mainStringView.length)) {
    resolving = false;
    done = true;
    setHighlightedItems(false);
    resultText1.innerText = "result: " + previousView?.getValue().toString();
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

  setHighlightedItems(false);

  let index = mainStringView.charCodeAt(i2);
  while (subMapView.has(index)) {
    let current = subMapView.get(index)!;
    let prev = subMapView.get(current.prev)!;
    index += 256;
    if (current.repeated > 1) {
      if (prev.getValue() <= 0) continue;
      if (mainStringView.charCodeAt(i2 - 1) != current.letter % 256) {
        current.values.push(new repeatedValue());
        current.values[current.values.length - 1].n = 0;
        current.values[current.values.length - 1].backValue = prev.getValue();
        if (current.values.length > 1) {
          current.values.slice(0, -1).forEach((x) => {
            current.values[current.values.length - 1].backValue -= x.backValue;
          });
        }
      }

      for (let i2 = 0; i2 < current.values.length; i2++) {
        current.values[i2].n++;
        current.values[i2].value =
          (calcUpperRepeated(current.values[i2].n, current.repeated) /
            current.fat) *
          current.values[i2].backValue;
        subMapView.set(current.letter, current);
        highlightedItems.push(updateMapItem(current));
      }
      continue;
    }

    current.value += prev.getValue();
    subMapView.set(current.letter, current);
    highlightedItems.push(updateMapItem(current));
  }
  setHighlightedItems(true);
  i2++;
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
  if (resolving) {
    resolveFind(mainStringView);
    return;
  }
  if (done) {
    return lastView!.getValue();
  }
}
