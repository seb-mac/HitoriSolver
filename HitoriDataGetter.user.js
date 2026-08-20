// ==UserScript==
// @name        HitoriDataGetter
// @namespace   Violentmonkey Scripts
// @icon
// @version     1.0.0
//
// @match       https://www.puzzles-mobile.com/hitori/*
// @grant       none
//
// @author      -
// @description
// ==/UserScript==
let numList = [];
let divList;
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

function createButtons() {
  if (!document.body) return; //Return if DOM !loaded

  //#region CSS Injection
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = cssRules; // Add CSS rules as a string
  document.head.appendChild(style); // Append to <head>
  console.log("Injected CSS");
  //#endregion

  const puzzleContainer =
    document.getElementsByClassName("hitori-cell-back")[0];
  console.log(puzzleContainer);
  //#region Adding custom buttons
  const getListButton = document.createElement("button");
  getListButton.type = "button";

  getListButton.append(document.createTextNode("Get list"));

  puzzleContainer.appendChild(getListButton);

  getListButton.addEventListener("click", getBoard);
  //#endregion
}

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

window.addEventListener("load", createButtons);
