// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @icon
// @version     1.0.0
//
// @match       https://www.puzzle-hitori.com/
// @grant       none
//
// @author      -
// @description
// ==/UserScript==

let numList = [];
let size;
let number;
let divList;
let puzzleContainer = null;

let cssRules = `
          #target {
            width: 200px;
            height: 200px;
            background-color: lightblue;
            margin: 50px;
            position: relative;
            }
          #indicator {
            width: 20px;
            height: 20px;
            background-color: red;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            display: block;
            opacity: 0.9;
        }

        #puzzleContainer {
            position: relative;
            overflow: hidden;
        }`;

function getNumFromDiv(div) {
  let number = div.children[0].innerHTML;
  return number;
}

function getBoard() {
  divList = [];
  numList = [];

  divList = document.getElementsByClassName("hitori-cell-back")[0].childNodes;

  console.log(divList);

  console.log(numList);
  for (let i = 1; i < divList.length; i++) {
    number = getNumFromDiv(divList[i]);
    console.log(number);
    numList.push(number);
  }
  console.log(`numList: ${numList}`);

  size = Math.sqrt(numList.length);
  console.log(`Size: ${size}`);
}

function createButtons() {
  if (!document.body) return; //Return if DOM !loaded

  // Disable auto-hiding feature
  window.addEventListener(
    "blur",
    function () {
      handleVisibilityChange(!0);
    },
    !1,
  );

  //#region CSS Injection
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = cssRules; // Add CSS rules as a string
  document.head.appendChild(style); // Append to <head>
  //#endregion

  //#region Add simulated mouse cursor
  puzzleContainer = document.getElementById("puzzleContainer");

  if (!puzzleContainer) return;

  const simulatedMouse = document.createElement("div");
  simulatedMouse.id = "indicator";
  simulatedMouse.style.position = "absolute";
  simulatedMouse.style.top = "0px";
  simulatedMouse.style.left = "0px";
  simulatedMouse.style.pointerEvents = "none";
  puzzleContainer.appendChild(simulatedMouse);
  //endregion

  //#region Adding custom buttons
  const getListButton = document.createElement("button");
  getListButton.type = "button";
  const showMatchesButton = document.createElement("button");
  showMatchesButton.type = "button";

  getListButton.append(document.createTextNode("Get list"));
  showMatchesButton.append(document.createTextNode("Show matches."));

  puzzleContainer.appendChild(getListButton);
  puzzleContainer.appendChild(showMatchesButton);

  getListButton.addEventListener("click", getBoard);
  showMatchesButton.addEventListener("click", showMatches);
  //#endregion
}

function isDetected(cell_id) {
  if (
    size - 1 < cell_id < size ** 2 - size &&
    numList[cell_id - size] == numList[cell_id + size]
  ) {
    return true;
  }

  return (
    cell_id % size != 0 &&
    cell_id % size != size - 1 &&
    numList[cell_id - 1] == numList[cell_id + 1]
  );
}

function showMatches() {
  // for (let cell_id = 1; cell_id < divList.length; cell_id++) {
  //   console.log(cell_id);
  //   if (isDetected(cell_id)) {
  //     console.log(divList[cell_id]);
  //     automateMovement(divList[cell_id]);
  //     console.log(getElementScreenPos(divList[cell_id]));
  //     console.log(`LOG: cell number ${cell_id} is ${isDetected(5)}`);
  //   }
  // }
  console.log(`Container Pos: ${getElementScreenPos(puzzleContainer)}`);
  automateMovement(getElementScreenPos(divList[1]));
}

function getElementScreenPos(el) {
  if (!puzzleContainer) return [0, 0];

  const rect = el.getBoundingClientRect();
  const containerRect = puzzleContainer.getBoundingClientRect();

  return [rect.left - containerRect.left, rect.top - containerRect.top];
}

function moveMouse(x, y) {
  const indicator = document.getElementById("indicator");
  if (!indicator || !puzzleContainer) return;

  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;

  const mouseMoveEvent = new MouseEvent("mousemove", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x + puzzleContainer.getBoundingClientRect().left,
    clientY: y + puzzleContainer.getBoundingClientRect().top,
  });

  puzzleContainer.dispatchEvent(mouseMoveEvent);
}

function automateMovement(coords) {
  const targetX = coords[0];
  const targetY = coords[1];
  let x = 0;
  let y = 0;
  const step = 10;

  const interval = setInterval(() => {
    const dx = targetX - x;
    const dy = targetY - y;

    if (Math.abs(dx) <= step && Math.abs(dy) <= step) {
      moveMouse(targetX, targetY);
      clearInterval(interval);
      indicator.style.left = `${targetX}px`;
      indicator.style.top = `${targetY}px`;
      setTimeout(() => {
        console.log(`X: ${targetX}, Y: ${targetY}`);
        clickMouse(targetX, targetY);
      }, 500);
    }

    if (Math.abs(dx) > step) {
      x += Math.sign(dx) * step;
    } else {
      x = targetX;
    }

    if (Math.abs(dy) > step) {
      y += Math.sign(dy) * step;
    } else {
      y = targetY;
    }

    moveMouse(x, y);
  }, 100);
}

function clickMouse(x, y) {
  const target = puzzleContainer;

  // Creates a new mouse click event
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    isTrusted: true,
  });
  console.log("Click event about to run");
  target.dispatchEvent(clickEvent);
  console.log("Click event ran");
}
window.addEventListener("load", createButtons);
