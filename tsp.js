//setting up global variables for the menu
var MENUSCREEN = 0;
var STARTSCREEN = 1;
var screenState = MENUSCREEN;


function setup() {
  //setting up the full screen
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);
  if (screenState == MENUSCREEN) {
    drawMenu();
  } else if (screenState == STARTSCREEN) {
    drawStart();
  } else {
    print("Error!");
  }
}

function drawMenu() {  

  // Text title
  textSize(28);
  text("TSP sovled with Genetic Algorithm", (windowWidth/2), 15); 
  textAlign(CENTER, TOP);
  fill(255, 255, 255);

  textSize(28);
  text("Press any key to start", (windowWidth/2), 85);
}

function drawStart() {
  textSize(28);
  text("Let's make the algo here", (windowWidth/2), (windowHeight/2));
  fill(255, 255, 255);
}


function keyPressed() {
  screenState = STARTSCREEN;
}
