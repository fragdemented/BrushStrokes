
    // GLOBAL VARIABLES
    // for the target image and brush image
let img;
let brush;
    // blank array to store pixel data later
let arr = [];
    // holds the total size of the array to show progress later
let arrTotal;
let arrCurrent;

    // pixel size of the brush width and height usually.
let brushSize = 20;
    // declaring the filename in this way fixes a bug where P5js renames it.
let baseDir = "BasePhotos";
let fileName = "Nebula";
let fileExt = ".jpg";
let fn = "\\" + baseDir + "\\" + fileName + fileExt;
    // for the status readout
let pStatus;
let pDebug;
    // time management
let d = new Date();    
let tStart, tNow, tElapsed, tEstimated, tMultiplier;
let seconds = 1000;
let minutes = seconds * 60;
let hours = minutes * 60;
let days = hours * 24;
let years = days * 365;

let vDebug;


    //preloading the images of course
function preload(){
  img = loadImage(fn);
  brush = loadImage("\\Brushes\\brush.png");
}

function setup() {
    //resize the brush and load the pixels for manipulation later.
  brush.resize(brushSize,brushSize);
  brush.loadPixels();
    //Setup the control buttons
  let buttonS = createButton("Save");
  buttonS.mousePressed(Export);
  let buttonP = createButton("Pause");
  buttonP.mousePressed(butPause);
  let buttonC = createButton("Continue");
  buttonC.mousePressed(butContinue);
    //Setup initial message about starting the process.
  pStatus = createP("Processing...");
  pDebug = createP("-Debug Area-");
    // Setup the canvas to be the exact width and height of the target image
  //img.resize(150,0);
  createCanvas(img.width, img.height);
    // load the pixel data for the image
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let px = (i/4)%img.width;
    let py = Math.floor((i/4)/img.width);
    let pr = img.pixels[i];
    let pg = img.pixels[i + 1];
    let pb = img.pixels[i + 2];
    let pa = img.pixels[i + 3];
    vDebug = i;
    if (i%(brushSize) == 0) {makeArray(px,py,pr,pg,pb,pa);} // Send the pixels to an array. Skip some based on the brush size to lower the render time.
  }
  arrTotal = arr.length; // get the length of the resulting array for calculations later
  tStart = d.getTime(); // mark the start of the render
}

function draw() {
  //background(255); // optional background color.
  pStatus.elt.innerHTML = "Processing " + fileName + " " + 
    Math.round((1 - (arr.length/arrTotal)) * 100) + "% " + 
    "(" + (arrTotal - arr.length) + "/" + arrTotal + ")"; // Status readout
  let dNow = new Date();  // get now as a date. (When will then be now? Soon...)
  tNow = dNow.getTime(); // get now as a time
  tElapsed = tNow - tStart; // calculate elapsed time
  tMultiplier = arr.length / arrCurrent;
  tEstimated = tElapsed * tMultiplier; // calculate estimated time remaining.
  pDebug.elt.innerHTML = `Time Elapsed: ${timeString(tElapsed)} </br> Estimated Time Remaining: ${timeString(tEstimated)} </br> Resolution: ${img.width}x${img.height} ${vDebug}`;
    
  useArray(); // Do the thing!
  
  //console.log(arr);
}

// separating milliseconds into years, days, etc, etc
function timeString(theTimeInMil) {
  let finalString = "";
  let hourglass = theTimeInMil;
  let yr = Math.floor(hourglass/years);
  hourglass -= yr * years;
  if (yr > 0) {finalString += yr + "years ";}
  let dy = Math.floor(hourglass/days);
  hourglass -= dy * days;
  if (dy > 0) {finalString += dy + "days ";}
  let hr = Math.floor(hourglass/hours);
  hourglass -= hr * hours;
  if (hr > 0) {finalString += hr + "hours ";}
  let min = Math.floor(hourglass/minutes);
  hourglass -= min * minutes;
  if (min > 0) {finalString += min + "mins ";}
  let sec = Math.floor(hourglass/seconds);
  hourglass -= sec * seconds;
  if (sec > 0) {finalString += sec + "secs ";}
  //hourglass remainder is milliseconds
  return finalString;
}

//at any time you can save the canvas to a file.
function Export() {
  save(brushSize + "_" + fileName + fileExt);
}

// Pause the process
function butPause() {
  noLoop();
  if (pStatus.elt.innerHTML == "Script Complete!") {return;} // if the script is complete don't change the message.
  pStatus.elt.innerHTML = "Paused";
}

//Continue the process
function butContinue() {
  loop();
  if (pStatus.elt.innerHTML == "Script Complete!") {return;}
  pStatus.elt.innerHTML = "Processing...";
}

// I honestly can't remember why I built this function
function makeArray(xx, yy, rr, gg, bb, aa) {
  arr.push([xx,yy,rr,gg,bb,aa]);
}

/* 
This is where the magic starts to happen.

This function takes a random index from the array of pixels, 
grabs the color and sends it to the paint function before 
deleting the random point in the array.

choosing a random point in the array keeps the picture from looking too uniform,
and so the picture can be acceptibly done at around 50%
*/
function useArray() {
  //console.log(arr.length);
  if (arr.length > 0) {
  let rindex = Math.floor(random(0, arr.length-1));
  if (arr[rindex][5] == 0) {
    arr.splice(rindex,1);
  } else {
    paint(
      arr[rindex][0],
      arr[rindex][1],
      arr[rindex][2],
      arr[rindex][3],
      arr[rindex][4],
      arr[rindex][5]
    );
    arr.splice(rindex,1);
    }
    arrCurrent = arrTotal - arr.length;
  } else {
    pStatus.elt.innerHTML = "Script Complete!";
    Export();
    noLoop();
  }
}
/*
the rest of the magic.

this takes an image of a brushstroke, 
applies the color from the sampled place in the picture, 
rotates by a random value,
then applies it to the same location on the canvas.

the random rotation improves the appearance, 
and hides the same brush stroke being applied
*/
function paint(xx, yy, rr, gg, bb, aa) {
  //pDebug.elt.innerHTML = bb;
  for (let i = 0; i < brush.pixels.length; i+=4) {
    brush.pixels[i] = rr;
    brush.pixels[i + 1] = gg;
    brush.pixels[i + 2] = bb;
    brush.pixels[i + 3] *= 1;
    //if (brush.pixels[i + 3] > aa) {brush.pixels[i + 3] = aa;}
  }
  brush.updatePixels();
  push();
  translate(xx,yy);
  rotate(random(0,TWO_PI));
  image(brush,0 - brushSize/2,0 - brushSize/2);
  pop();
}
