//setting up global variables for the menu
var MENUSCREEN = 0;
var STARTSCREEN = 1;
var screenState = MENUSCREEN;

let countries = [];
let bestDistance;
let numberOfCountries = 4;

function setup() {
  //setting up the full screen
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < numberOfCountries; i++) {
    countries[i] = createVector(random(width), random(height));
  }

  let distance = getDistance(countries);
  bestDistance = distance;
  bestPath = countries.slice();

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
  text("TSP sovled with Genetic Algorithm", (windowWidth / 2), 15);
  textAlign(CENTER, TOP);
  fill(255, 255, 255);

  textSize(28);
  text("Press any key to start", (windowWidth / 2), 85);
}

function drawStart() {

  fill(255);
  for (let i = 0; i < countries.length; i++) { // creating nodes (countries)
    ellipse(countries[i].x, countries[i].y, 15, 15);
  }


  //Draw all path between nodes (countries)
  stroke(255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < countries.length; i++) {
    vertex(countries[i].x, countries[i].y);
  }
  endShape();

  //Draw the best current path between nodes (countries)
  stroke(0,255,0);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < countries.length; i++) {
    vertex(bestPath[i].x, bestPath[i].y);
  }
  endShape();

  //Test all the possible path between nodes
  let a = floor(random(countries.length));
  let b = floor(random(countries.length));
  cross(countries, a, b); //Change the order of the countries array

  let distance = getDistance(countries);
  if(distance < bestDistance){
    bestDistance = distance;
    // console.log(bestDistance);
  }

  //Display best current distance
  fill(255, 255, 255);
  textSize(28);
  text("Best path: "+ bestDistance, (windowWidth/2), 10);
}

//Allow to change the order of a given array 
function cross(arr, a, b) {
  let temporary = arr[a];
  arr[a] = arr[b];
  arr[b] = temporary;
}

//return the total distance of a path by making the sum between node i and node i+1
function getDistance(nodes) {
  let total = 0;

  for (let i = 0; i < nodes.length-1; i++) {
    //a optimiser
    let d = dist(nodes[i].x, nodes[i].y, nodes[i + 1].x, nodes[i + 1].y);
    total += d;
  }

  return total;
}

function keyPressed() {
  screenState = STARTSCREEN;
}
