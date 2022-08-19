/*
  Copyright (C) 2021-present AV306

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// WOO LET'S GOOOOOOOOOOO
// Last modified 19/8/2022
// Last last modified 6/7/2021
// I need to refactor this someday
// NOTE: Does not follow my current styleguide, and I only changed comment styles up to line 125.


const cw = 1280;
const ch = 720;


let penCol = '#ffffff'; // default pen color: white

let brushSize = 5;

let brush, eraser, addText, brushS, imageS, addTextS, drawRect, drawRectS, drawCircle, drawCircleS, fillCanvas, fillCanvasS;

let tool = "brush"; // self-explanatory. 
let brushType = "pen"; // brush types: standard, pencil, splatter. Pencil not functional rn

let toSave;

let canvasArea;

let startX, startY, endX, endY, shapeWidth, shapeHeight; // geh

let brushSizeText, toolText; // var for text to display, technically works without this.

let hue = 0; // hue of rainbow pen 

//let fps;

function preload() {
  brush = loadImage('assets/brush.png');
  eraser = loadImage('assets/eraser.png');
  addText = loadImage('assets/addText.png'); 
  drawRect = loadImage('assets/drawRect.png');
  drawCircle = loadImage('assets/drawCircle.png');
  fillCanvas = loadImage('assets/fillCanvas.png');


  brushS = loadImage('assets/brushSelected.png');
  eraserS = loadImage('assets/eraserSelected.png');
  addTextS = loadImage('assets/addTextSelected.png');
  drawRectS = loadImage('assets/drawRectSelected.png');
  drawCircleS = loadImage('assets/drawCircleSelected.png');
  fillCanvasS = loadImage('assets/fillCanvasSelected.png');

}


function setup() {
  document.getElementById("app").style.cursor = "crosshair";
  createCanvas(/*Width*/ cw + 151, /*Height*/ ch + 90); // ...I'm just gonna trust this is a square. Edit: It is.
  background(220);
  stroke(0);

  strokeWeight(1);
  
  image(brush, 0, 70, 40, 40); // button images; duplicate of that in `draw()` for posterity. Can be removed.
  image(eraser, 45, 70, 40, 40);
  image(addText, 90, 70, 40, 40);
  image(drawRect, 0, 115, 40, 40);
  image(drawCircle, 45, 115, 40, 40);
  image(fillCanvas, 90, 115, 40, 40);

  
  fill("#ff0000"); rect(0, 0, 50, 30); // red swatch
  fill('#00ff00'); rect(50, 0, 50, 30); // green swatch
  fill('#0000ff'); rect(100, 0, 50, 30); // blu swatch
  
  fill('#ffff00'); rect(0, 30, 50, 30); //yellow swatch
  fill('#000000'); rect(50, 30, 50, 30); //black swatch
  fill('#ffffff'); rect(100, 30, 50, 30); //white swatch
  

  let colorPicker = createColorPicker('#ffffff');
  colorPicker.position(0, 160);
  colorPicker.size(145, 35);
  colorPicker.input(colPickerEvent);
  
  let hexInput = createInput('#de8f1f');
  hexInput.position(0, 240);
  hexInput.size(145, 35);
  hexInput.input(hexInputEvent);

  let rngColButton = createButton('Random Color');
  rngColButton.position(0, 285);
  rngColButton.size(145, 35);
  rngColButton.mousePressed(getRngCol);

  let clearButton = createButton('Clear');
  clearButton.position(300, 15);
  clearButton.size(100, 30);
  clearButton.mousePressed(clearCanvas);

  let saveButton = createButton('Save');
  saveButton.position(410, 15);
  saveButton.size(100, 30);
  saveButton.mousePressed(saveCanvasAsImage);

  let brushTypeSel = createSelect('Select Brush Type'); // Brush types selectbox
  brushTypeSel.position(190, 15);
  brushTypeSel.size(100, 30);
  brushTypeSel.option('pen');
  brushTypeSel.option('pencil');
  brushTypeSel.option('splatter');
  brushTypeSel.option('wied');
  brushTypeSel.option('wieder');
  brushTypeSel.option('rainbow');
  brushTypeSel.changed(brushTypeSelEvent);

  let startXInput = createInput(''); // Input for X of rect
  startXInput.position(0, 370);
  startXInput.size(100, 30);
  startXInput.input(startXInputEvent);

  let startYInput = createInput(''); // Input for Y of rect
  startYInput.position(0, 420);
  startYInput.size(100, 30);
  startYInput.input(startYInputEvent);

  let shapeWidthInput = createInput('');
  shapeWidthInput.position(0, 500);
  shapeWidthInput.size(100, 30);
  shapeWidthInput.input(shapeWidthInputEvent);

  let shapeHeightInput = createInput('');
  shapeHeightInput.position(0, 550);
  shapeHeightInput.size(100, 30);
  shapeHeightInput.input(shapeHeightInputEvent);

  let textToAddInput = createInput('');
  textToAddInput.position(0, 630);
  textToAddInput.size(100, 30);
  textToAddInput.input(textToAddInputEvent);

  let docsButton = createButton('How to use');
  docsButton.position(0, height - 70);
  docsButton.size(100, 30);
  docsButton.mousePressed(openDocs);

  let licenseButton = createButton('View License');
  licenseButton.position(0, height - 30);
  licenseButton.size(100, 30);
  licenseButton.mousePressed(openLicense);

  /*
  let frameRateSlider = createSlider(5, 60, 30, 5); //min: 5; max: 60; default: 30; step: 5
  frameRateSlider.position(150, height - 25);
  frameRateSlider.size(110);
  
  let frameRateInput = createInput('');
  frameRateInput.position(300, height - 31);
  frameRateInput.size(100, 25);
  frameRateInput.input(fpsInput);
  */
  
  
  /* // We don't need this.
    drawingCnv = get(150, 40, width, height);
    drawingCnv.mousePressed(getFirstCoordsForRect); //Function names are a balance between meaning and length. 
    drawingCnv.mouseReleased(getSecondCoordsForRect); //This is bound to break.
  */


  //line(0, 40, width, 40);
  
  textAlign(LEFT);
  textSize(20);
  textStyle(NORMAL);
}


function draw() {
  
  //console.log(mouseX, mouseY);

  
  toolHandler();
  
  
  stroke(0);

  strokeWeight(1);
  
  image(brush, 0, 70, 40, 40); // button images
  image(eraser, 45, 70, 40, 40); // This works here, don't touch it.
  image(addText, 90, 70, 40, 40);
  image(drawRect, 0, 115, 40, 40);
  image(drawCircle, 45, 115, 40, 40);
  image(fillCanvas, 90, 115, 40, 40);

  
  fill("#ff0000"); rect(0, 0, 50, 30); // red swatch
  fill('#00ff00'); rect(50, 0, 50, 30); // green swatch
  fill('#0000ff'); rect(100, 0, 50, 30); // blu swatch
  
  fill('#ffff00'); rect(0, 30, 50, 30); // yellow swatch
  fill('#000000'); rect(50, 30, 50, 30); // black swatch
  fill('#ffffff'); rect(100, 30, 50, 30); // white swatch


  brushSizeText = "Brush size: " + brushSize;
  toolText = " Tool: " + tool;


  // begin rects;
  fill(220); noStroke(); 
  rect(width - 850, 0, 850, 45); //These keeps the text from "bolding".

  rect(0, 210, 150, 25); //rects for labels at side (in order)
  rect(0, 340, 150, 25);
  rect(0, 470, 150, 25);
  rect(0, 600, 150, 25);

  // rect for falied actionbar
  rect(0, height - 30, width, 30);

  
  // begin texts
  fill('black'); textSize(20);

  // top bar text (RTL)
  text('Color: ', width - 150, 35);
  text(brushSizeText, width - 425, 35); 
  text(toolText, width - 280, 35);
  text('© 2021 AV306 (GNU GPL v3.0)', width - 750, 35);
  
  // sidebar text
  text('Input color / hex:', 0, 230);
  text('X, Y of shape:', 0, 360);
  text('W, H of shape:', 0, 490);
  text('Text to add:', 0, 620);

  //failed actionbar text
  //text('FPS: ', 400, height - 30);
  //text(fps, 400, height - 30);

  // current color rectangle
  stroke(0); strokeWeight(1); fill(penCol);
  rect(width - 90, 11, 50, 30);
  // YAY!
  

  
}










// custom listeners

function keyPressed() { // Keybinds
  switch (keyCode) {
    case UP_ARROW:
      brushSize += 1;
      break;
      
    case DOWN_ARROW:
      brushSize -= 1;
      break;
    
    case 66: //b key
      tool = "brush";
      brushType = "pen";
      break;

    case 69: //e key
      //questionable
      tool = "eraser";
      break;

    case 67: //c key
      clearCanvas();
      break;

    case 80: //p key
      saveCanvasAsImage();
      break;
    
    case 84: //t key
      tool = "addText";
      toolHandler(); // YEAH LETS GO IT WORKS
      break;
  }
}


function toolHandler() {
  
  if (mouseIsPressed) { // Thing that handles what was clicked
    if (mouseX >= 0 && mouseX <= 40 && mouseY >= 70 && mouseY <= 105) tool = "brush";
    if (mouseX >= 45 && mouseX <= 85 && mouseY >= 70 && mouseY <= 105) tool = "eraser";
    if (mouseX >= 90 && mouseX <= 130 && mouseY >= 70 && mouseY <= 105) tool = "addText";
    if (mouseX >= 0 && mouseX <= 40 && mouseY >= 115 && mouseY <= 160) tool = "drawRect";
    if (mouseX >= 45 && mouseX <= 85 && mouseY >= 115 && mouseY <= 160) tool = "drawCircle";
    if (mouseX >= 90 && mouseX <= 130 && mouseY >= 115 && mouseY <= 160) tool = "fillCanvas";


    if (mouseX >= 0 && mouseX <= 50 && mouseY >= 0 && mouseY <= 30) penCol = '#ff0000'; // red
    if (mouseX >= 50 && mouseX <= 100 && mouseY >= 0 && mouseY <= 30) penCol = '#00ff00'; // green
    if (mouseX >= 100 && mouseX <= 150 && mouseY >= 0 && mouseY <= 30) penCol = '#0000ff'; // blu
    if (mouseX >= 0 && mouseX <= 50 && mouseY >= 20 && mouseY <= 60) penCol = '#ffff00'; // yellow
    if (mouseX >= 50 && mouseX <= 100 && mouseY >= 20 && mouseY <= 60) penCol = '#000000'; // black
    if (mouseX >= 100 && mouseX <= 150 && mouseY >= 20 && mouseY <= 60) penCol = '#ffffff'; // white
    
  }
  
  switch (tool) {
    case "brush":

      switch (brushType) {
        case "pen":
          penHandler();
          break;
        
        case "pencil":
          pencilHandler();
          break;

        case "splatter":
          splatterHandler();
          break;

        case "wied":
          wiedHandler();
          break;

        case "wieder":
          wiederHandler();
          break;

        case 'rainbow':
          rainbowHandler();
          break;

      }

      noStroke(); fill(220);
      rect(0, 67, 149, 100);
      image(brushS, 0, 70, 40, 40);
      image(eraser, 45, 70, 40, 40); // sets images
      image(addText, 90, 70, 40, 40); 
      image(drawRect, 0, 115, 40, 40);
      image(drawCircle, 45, 115, 40, 40);
      image(fillCanvas, 90, 115, 40, 40);
      break;
      
    case "eraser":
      eraserHandler();

      noStroke(); fill(220);
      rect(0, 68, 149, 100);
      image(brush, 0, 70, 40, 40);
      image(eraserS, 45, 70, 40, 40);
      image(addText, 90, 70, 40, 40); 
      image(drawRect, 0, 115, 40, 40);
      image(drawCircle, 45, 115, 40, 40);
      image(fillCanvas, 90, 115, 40, 40);
      break;

    case "addText":
      noStroke(); fill(220);
      rect(0, 68, 149, 100);
      image(brush, 0, 70, 40, 40);
      image(eraser, 45, 70, 40, 40);
      image(addTextS, 90, 70, 40, 40);
      image(drawRect, 0, 115, 40, 40);
      image(drawCircle, 45, 115, 40, 40);
      image(fillCanvas, 90, 115, 40, 40);
      
      if (startX == null || startY == null || textToAdd == null) {
        alert("One or more required fields are empty. Defaulting all fields to 0.");
        startX = 0;
        startY = 0;
        textToAdd = 0; // failsafe
      } else {
      textHandler(); // this actually works. I can't believe it.
      }

      break;

    case "drawRect":
      noStroke(); fill(220);
      rect(0, 68, 149, 100);
      image(brush, 0, 70, 40, 40);
      image(eraser, 45, 70, 40, 40);
      image(addText, 90, 70, 40, 40);
      image(drawRectS, 0, 115, 40, 40);
      image(drawCircle, 45, 115, 40, 40);
      image(fillCanvas, 90, 115, 40, 40);

      drawRectHandler(); // whee
      //tool = "brush";
      break;

    case "drawCircle":
      noStroke(); fill(220);
      rect(0, 68, 149, 100);
      image(brush, 0, 70, 40, 40);
      image(eraser, 45, 70, 40, 40);
      image(addText, 90, 70, 40, 40);
      image(drawRect, 0, 115, 40, 40);
      image(drawCircleS, 45, 115, 40, 40);
      image(fillCanvas, 90, 115, 40, 40);

      drawCircleHandler();
      //tool = "brush";
      break;

    case "fillCanvas":
      noStroke(); fill(220);
      rect(0, 68, 149, 100);
      image(brush, 0, 70, 40, 40);
      image(eraser, 45, 70, 40, 40);
      image(addText, 90, 70, 40, 40);
      image(drawRect, 0, 115, 40, 40);
      image(drawCircle, 45, 115, 40, 40);
      image(fillCanvasS, 90, 115, 40, 40);

      fillCanvasHandler();

      tool = "brush";

  } 
}


// Block of handlers
function penHandler() { // standard brush type handler
  //colorMode(RGB);

  if (mouseIsPressed) {   
    stroke(penCol); // set the pen color
    strokeWeight(brushSize);
    if (mouseX > 155 && mouseY > 65 && mouseY < height - 30) line(pmouseX, pmouseY, mouseX, mouseY);
  }
}


function pencilHandler() {
  penHandler(); // we'll do this someday.
}

function wiedHandler() {
  stroke(penCol);
  fill(penCol);
  //colorMode(RGB);

  // Mouse coords is middle of invisible box
  let rangeXMin = mouseX - brushSize;
  let rangeYMin = mouseY - brushSize;
  let rangeXMax = mouseX + brushSize;
  let rangeYMax = mouseY + brushSize;
  let operations = random(80, 300);
  let dotSize = random(1, brushSize + 25);
  let dotPosX;
  let dotPosY;

  if (mouseIsPressed && mouseX > 155 && mouseY > 65 && mouseY < height - 30) {
    for (let i = 0; i < operations; i++){
      dotPosX = random(rangeXMin, rangeXMax);
      dotPosY = random(rangeYMin, rangeYMax);
      circle(dotPosX, dotPosY, dotSize);
    }
  }
}

function wiederHandler() {
    stroke(penCol);
    fill(penCol);
    //colorMode(RGB);

    // Mouse coords is middle of invisible box
    let rangeXMin = mouseX - brushSize*4;
    let rangeYMin = mouseY - brushSize*4;
    let rangeXMax = mouseX + brushSize*4;
    let rangeYMax = mouseY + brushSize*4;
    let operations = random(80, 300);
    let dotSize = random(1, brushSize + 25);
    let dotPosX;
    let dotPosY;
  
    if (mouseIsPressed && mouseX > 155 && mouseY > 65 && mouseY < height - 30) {
      for (let i = 0; i < operations; i++){
        dotPosX = random(rangeXMin, rangeXMax);
        dotPosY = random(rangeYMin, rangeYMax);
        circle(dotPosX, dotPosY, dotSize);
      }
    }
}

function splatterHandler() {
  stroke(penCol);
  fill(penCol);
  //colorMode(RGB);

  // Mouse coords is middle of invisible box
  let rangeXMin = mouseX - brushSize*10;
  let rangeYMin = mouseY - brushSize*10;
  let rangeXMax = mouseX + brushSize*10;
  let rangeYMax = mouseY + brushSize*10;
  let operations = random(5, 25);
  let dotSize = random(1, brushSize + 10);
  let dotPosX;
  let dotPosY;

  if (mouseIsPressed && mouseX > 155 && mouseY > 65 && mouseY < height - 30) {
    for (let i = 0; i < operations; i++){
      dotPosX = random(rangeXMin, rangeXMax);
      dotPosY = random(rangeYMin, rangeYMax);
      circle(dotPosX, dotPosY, dotSize);
    }
  }
}


// Rainbow brush!
function rainbowHandler() {
  strokeWeight(brushSize);

  // modified pen handler, someday I might make it a common lib (but not today)
  if (mouseIsPressed) {   
    noStroke();
    colorMode(HSL, 360); // temporarily set colorMode to HSB for rainbow

    stroke(hue, 200, 225); 
    if (mouseX > 155 && mouseY > 65 && mouseY < height - 30) line(pmouseX, pmouseY, mouseX, mouseY);
    if (hue <= 360) hue += 5; else hue = 0;

  } else colorMode(RGB);
}


//Eraser handler
function eraserHandler() {
  stroke(220);
  strokeWeight(brushSize * 2);
  if (mouseX > 155 && mouseY > 65 && mouseY < height - 30 && mouseIsPressed) line(pmouseX, pmouseY, mouseX, mouseY);
}



//Other handlers
function clearCanvas() {
  noStroke();
  fill(220);
  rect(0, 0, width, height);
}

function saveCanvasAsImage() {
  toSave = get(151, 60, width - 151, height - 90);
  toSave.save("canvas.png");

}

function textHandler() {
  fill(penCol); noStroke(); textSize(brushSize * 4);
  text(textToAdd, startX, startY);

  tool = "brush";
}

function drawRectHandler() {
  stroke(penCol); noFill();
  strokeWeight(brushSize);
  rect(startX, startY, shapeWidth, shapeHeight); // This just works. Very nice

  tool = "brush";
}

function drawCircleHandler() {
  stroke(penCol); noFill(); strokeWeight(brushSize);
  ellipse(startX, startY, shapeWidth, shapeHeight);

  tool = "brush";
}

function fillCanvasHandler() {
  fill(penCol); noStroke();
  rect(0, 0, width, height);
}


// These might come in useful someday. For now, they aren't. Don't touch 'em
/*
function getFirstCoordsForRect() {
  startX = mouseX;
  startY = mouseY; //most useless yet useful function.
}


function getSecondCoordsForRect() {
  endX = mouseX;
  endY = mouseY;
}
*/ 


// Block of input events
function startXInputEvent() { startX = this.value(); }
function startYInputEvent() { startY = this.value(); }
function shapeWidthInputEvent() { shapeWidth = this.value(); }
function shapeHeightInputEvent() { shapeHeight = this.value(); }
function textToAddInputEvent() { textToAdd = this.value(); }
function hexInputEvent()  { penCol = this.value(); }
function colPickerEvent() { penCol = this.value(); }
function brushTypeSelEvent() { brushType = this.value(); }
function openDocs() { window.open('https://av306.github.io/PaintApp/docs'); }
function openLicense()  {window.open('https://av306.github.io/PaintApp/GNU%20GPL%20v3.0.txt'); }
//function fpsInput() {fps = this.value();} // failed. Don't touch ever


function getRngCol() {
  let red = random(0, 256);
  let green = random(0, 256);
  let blue = random(0, 256);
  penCol = [red, green, blue]; // yeah, this is big brain time. Passing colors as an array :P
}
