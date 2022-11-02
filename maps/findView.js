"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let i1 = 0;
let i2 = 0;
let subMapView = new Map();
let previousView = null;
let lastView = null;
let mainStringView = "";
let subStringView = "";
let settingMap = false;
let resolving = false;
let start = true;
let done = true;
let iteratorText = document.querySelector("p.iterator");
let mainStringViewText = document.querySelector("p.main-string");
let subMapViewItems = [];
let showingValues = false;
function showValues() {
    var values = document.querySelectorAll(".value-content:not(#values-1)");
    if (showingValues) {
        values.forEach((x) => {
            var layers = x.querySelectorAll(".unit");
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
        var layers = x.querySelectorAll(".unit");
        layers[0].style.height = "0px";
        setTimeout(() => {
            layers[0].style.display = "none";
            layers[1].style.display = "flex";
            layers[1].style.height = layers[1].scrollHeight + "px";
        }, 500);
    });
    showingValues = true;
}
function resetCountAggregateCalcView(mainString, subString) {
    document.querySelector(".map-items").remove();
    var mapItems = document.createElement("div");
    mapItems.className = "map-items";
    document.querySelector(".find-view>.border-box>div").prepend(mapItems);
    subMapViewItems = [];
    i1 = 0;
    i2 = 0;
    iteratorText.innerText = "i: ";
    mainStringViewText.innerText = "";
    subMapView = new Map();
    previousView = null;
    lastView = null;
    mainStringView = mainString;
    subStringView = subString;
    settingMap = false;
    resolving = false;
    start = true;
    done = false;
    mainStringViewText.innerText = mainString;
    countAggregateCalcView();
}
function addMapItem(item) {
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
    }
    else {
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
    addRepeatedValueItem(new repeatedValue(0, 0, 0), valuesLayer);
    infoLayer.appendChild(prev);
    infoLayer.appendChild(repeated);
    infoLayer.appendChild(values);
    content.appendChild(infoLayer);
    content.appendChild(valuesLayer);
    infobox.appendChild(letter);
    infobox.appendChild(content);
    document.querySelector(".map-items").appendChild(infobox);
    if (content.scrollHeight > content.clientHeight) {
        content.style.paddingRight = "5px";
    }
    else {
        content.style.paddingRight = "0px";
    }
    if (showingValues) {
        infoLayer.style.display = "none";
        valuesLayer.style.display = "flex";
        infoLayer.style.height = "0px";
        valuesLayer.style.height = valuesLayer.scrollHeight + "px";
    }
}
function addRepeatedValueItem(repeated, parent) {
    var repeatedValue = document.createElement("div");
    var value = document.createElement("p");
    var n = document.createElement("p");
    var prev = document.createElement("p");
    value.innerText = "value: " + repeated.value.toString();
    n.innerText = "n: " + repeated.n.toString();
    prev.innerText = "previous item value: " + repeated.backValue.toString();
    repeatedValue.className = "border-box";
    repeatedValue.appendChild(value);
    repeatedValue.appendChild(n);
    repeatedValue.appendChild(prev);
    parent === null || parent === void 0 ? void 0 : parent.appendChild(repeatedValue);
}
function updateMapItem(item) {
    var _a;
    var infobox = document.querySelector("#item" + item.letter);
    console.log(infobox === null || infobox === void 0 ? void 0 : infobox.querySelectorAll(".grid>div>p"), item.repeated.toString());
    var repeated = infobox === null || infobox === void 0 ? void 0 : infobox.querySelectorAll(".grid>div>p")[1];
    var value = infobox === null || infobox === void 0 ? void 0 : infobox.querySelectorAll(".grid>div>p")[2];
    repeated.innerText = "repeat: " + item.repeated.toString();
    value.innerText =
        "value: [ " +
            (item.values.length == 0
                ? item.getValue().toString()
                : item.values.map((x) => x.value).join(", ")) +
            " ]";
    var valuesLayer = infobox === null || infobox === void 0 ? void 0 : infobox.querySelectorAll(".grid>div")[1];
    var height = valuesLayer.scrollHeight;
    valuesLayer.remove();
    valuesLayer = document.createElement("div");
    item.values.forEach((x) => {
        addRepeatedValueItem(x, valuesLayer);
    });
    if (item.repeated < 2) {
        addRepeatedValueItem(new repeatedValue(item.n, (_a = subMapView.get(item.prev)) === null || _a === void 0 ? void 0 : _a.getValue(), item.value), valuesLayer);
    }
    valuesLayer.style.display = showingValues ? "flex" : "none";
    valuesLayer.style.height = height + "px";
    valuesLayer.className = "unit";
    var content = infobox === null || infobox === void 0 ? void 0 : infobox.querySelector(".grid");
    content.appendChild(valuesLayer);
    if (content.scrollHeight > content.clientHeight) {
        content.style.paddingRight = "5px";
    }
    else {
        content.style.paddingRight = "0px";
    }
}
function setMap() {
    if (!(i1 < subStringView.length)) {
        settingMap = false;
        resolving = true;
        return;
    }
    iteratorText.innerText = "i: " + i1;
    if (i1 == 0) {
        previousView = new item(subStringView.charCodeAt(i1), -1);
        subMapView.set(subStringView.charCodeAt(i1), previousView);
        addMapItem(previousView);
        lastView = previousView;
        i1++;
        return;
    }
    if (previousView.letter % 256 == subStringView.charCodeAt(i1)) {
        previousView.repeated++;
        previousView.fat = calcLowerRepeated(previousView.repeated);
        subMapView.set(previousView.letter, previousView);
        lastView = previousView;
        updateMapItem(previousView);
        i1++;
        return;
    }
    let index = subStringView.charCodeAt(i1);
    while (subMapView.has(index)) {
        index += 256;
    }
    previousView = new item(index, previousView.letter);
    subMapView.set(index, previousView);
    addMapItem(previousView);
    lastView = previousView;
    i1++;
}
function setMainStringView() {
    mainStringViewText.innerText = mainStringView.slice(0, i2);
    var b = document.createElement("b");
    b.innerText = mainStringView[i2];
    mainStringViewText.appendChild(b);
    mainStringViewText.insertAdjacentText("beforeend", mainStringView.slice(i2 + 1, mainStringView.length));
}
function resolveFind(mainStringView) {
    if (!(i2 < mainStringView.length)) {
        resolving = false;
        done = true;
        return;
    }
    setMainStringView();
    if (!subMapView.has(mainStringView.charCodeAt(i2))) {
        i2++;
        return;
    }
    let index = mainStringView.charCodeAt(i2);
    while (subMapView.has(index)) {
        let current = subMapView.get(index);
        let prev = subMapView.get(current.prev);
        index += 256;
        if (current.repeated > 1) {
            if (prev.getValue() <= 0)
                continue;
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
                updateMapItem(current);
            }
            continue;
        }
        current.value += prev.getValue();
        subMapView.set(current.letter, current);
        updateMapItem(current);
    }
    i2++;
}
function countAggregateCalcView() {
    return __awaiter(this, void 0, void 0, function* () {
        if (start) {
            subMapView.set(-1, new item(-1, -2, 1));
            addMapItem(subMapView.get(-1));
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
            return lastView.getValue();
        }
    });
}
//# sourceMappingURL=findView.js.map