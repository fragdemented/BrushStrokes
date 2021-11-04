
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
    if (i%(brushSize) == 0) {makeArray(px,py,pr,pg,pb,pa);}
  }
  //image(img,0,0);
  arrTotal = arr.length;
  tStart = d.getTime();
}

function draw() {
  //background(255);
  pStatus.elt.innerHTML = "Processing " + fileName + " " + 
    Math.round((1 - (arr.length/arrTotal)) * 100) + "% " + 
    "(" + (arrTotal - arr.length) + "/" + arrTotal + ")";
  let dNow = new Date();  
  tNow = dNow.getTime();
  tElapsed = tNow - tStart;
  tMultiplier = arr.length / arrCurrent;
  tEstimated = tElapsed * tMultiplier;
  pDebug.elt.innerHTML = `Time Elapsed: ${timeString(tElapsed)} </br> Estimated Time Remaining: ${timeString(tEstimated)} </br> Resolution: ${img.width}x${img.height} ${vDebug}`;
    
  useArray();
  
  //console.log(arr);
}

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

function Export() {
  save(brushSize + "_" + fileName + fileExt);
}

function butPause() {
  noLoop();
  if (pStatus.elt.innerHTML == "Script Complete!") {return;}
  pStatus.elt.innerHTML = "Paused";
}

function butContinue() {
  loop();
  if (pStatus.elt.innerHTML == "Script Complete!") {return;}
  pStatus.elt.innerHTML = "Processing...";
}

function makeArray(xx, yy, rr, gg, bb, aa) {
  arr.push([xx,yy,rr,gg,bb,aa]);
}

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
