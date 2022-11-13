"use strict";
let blobCount = 0;
let blobs = [
    {
        width: "",
        height: "",
        className: "bar",
        path: "M57.8124 107C21 133.196 6.6342 175 0 209V0.000137329H385C356 23 350.247 33.3244 307 66C263.753 98.6756 242 93 169.646 80.0001C123 71.6191 82 89.7882 57.8124 107Z",
        transform: "",
    },
    {
        width: "",
        height: "",
        className: "blob",
        path: "M60.2,-58.4C76.8,-43.6,88.2,-21.8,84.2,-4C80.2,13.8,60.8,27.6,44.2,37.7C27.6,47.8,13.8,54.2,0.4,53.8C-13,53.5,-26.1,46.3,-38.5,36.2C-50.9,26.1,-62.7,13,-62.4,0.2C-62.2,-12.6,-50,-25.2,-37.6,-40.1C-25.2,-54.9,-12.6,-71.9,4.6,-76.5C21.8,-81.1,43.6,-73.2,60.2,-58.4Z",
        transform: "translate(100 100)",
    },
    {
        width: "",
        height: "",
        className: "bottom-right-blob",
        path: "M221 23C243.907 -6.07381 276 2 276 2L276 143L0 143C0 119 6 94 36 77.0003C66 60.0005 103 62 165 77.0003C196 84.5004 195 56 221 23Z",
        transform: "translate(10, 10)",
    },
];
function addBlob(width, height, className, path, fill, transform) {
    var stops = [
        { offset: "0", color: "#FE3030" },
        { offset: "0.21875", color: "#FFDB1C" },
        { offset: "0.401042", color: "#20FF1C" },
        { offset: "0.59375", color: "#1CFFD6" },
        { offset: "0.744792", color: "#1C77FF" },
        { offset: "0.927083", color: "#9B1CFF" },
    ];
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (width != "") {
        svg.setAttribute("width", width);
    }
    if (height != "") {
        svg.setAttribute("height", height);
    }
    svg.setAttribute("fill", fill);
    svg.classList.add(className);
    var blob = document.createElementNS("http://www.w3.org/2000/svg", "path");
    blob.setAttribute("d", path);
    blob.setAttribute("stroke", "black");
    blob.setAttribute("stroke-width", "10");
    blob.setAttribute("stroke-linejoin", "round");
    blob.setAttribute("stroke-linecap", "round");
    blob.setAttribute("stroke", `url(#blob-gradient-${blobCount})`);
    blob.setAttribute("transform", transform);
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    for (let i = 0; i < stops.length; i++) {
        var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", stops[i].offset);
        stop.setAttribute("stop-color", stops[i].color);
        gradient.appendChild(stop);
    }
    gradient.setAttribute("id", `blob-gradient-${blobCount}`);
    defs.appendChild(gradient);
    svg.appendChild(blob);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    blobCount++;
    return svg;
}
blobs.forEach((element) => {
    addBlob(element.width, element.height, element.className, element.path, "hsl(0, 0%, 10%)", element.transform);
    addBlob(element.width, element.height, element.className, element.path, "none", element.transform).classList.add("bar-b");
});
var options = document.querySelector(".cells");
options.addEventListener("click", (e) => {
    e.stopPropagation();
});
var bar = document.querySelector(".bar.bar-b");
bar === null || bar === void 0 ? void 0 : bar.addEventListener("click", (e) => {
    if (bar.dataset.clicked == "true") {
        return;
    }
    e.stopPropagation();
    document.querySelectorAll(".bar").forEach((x) => {
        x.dataset.clicked = "true";
    });
    document.querySelector(".main").dataset.clicked = "true";
});
document.body.addEventListener("click", () => {
    document.querySelectorAll(".bar").forEach((x) => {
        x.dataset.clicked = "false";
    });
    document.querySelector(".main").dataset.clicked = "false";
});
//# sourceMappingURL=svg.js.map