//setting up global variables for the menu
let MENUSCREEN = 0;
let STARTSCREEN = 1;
let screenState = MENUSCREEN;

let countries = [];
let numberOfCountries = 10;

let currentBestDistance;
let finalBestDistance;
let recordDistance = Infinity;

let order = [];

let population = [];
let populationSize = 10;

let fitness = [];

function setup() {
  //setting up the full screen
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < numberOfCountries; i++) { //we create the countries and an array of order
    countries[i] = createVector(random(width), random(height));
    order[i] = i; 
  }

  for (let i = 0; i < populationSize; i++){
    population[i] = order.slice();
    shuffle(population[i]);
  }
  // console.log(population);
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

  //Genectics algorithm function
  calculateFitness();
  pourcentFitness();
  nextGeneration();

  //Draw the best final path
  strokeWeight(6);
  noFill();
  stroke(0,255,0);
  beginShape();
  for (let i = 0; i < finalBestDistance.length; i++) {
    let j = finalBestDistance[i];
    vertex(countries[j].x, countries[j].y);
    ellipse(countries[j].x, countries[j].y, 16, 16);
  }
  endShape();
  
  //Draw all path between nodes (countries)
  stroke(255,255,255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < currentBestDistance.length; i++) {
    var j = currentBestDistance[i];
    vertex(countries[j].x, countries[j].y);
    ellipse(countries[j].x, countries[j].y, 16, 16);
  }
  endShape();

  //Display best current distance
  fill(255, 255, 255);
  textSize(28);
  text("Best path: "+ finalBestDistance, (windowWidth/2), 10);
}

//Allow to change the order of a given array 
function cross(arr, a, b) {
  let temporary = arr[a];
  arr[a] = arr[b];
  arr[b] = temporary;
}

function calculateDistance(nodes, order) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    let first_countrieIndex = order[i];
    let first_country = nodes[first_countrieIndex];
    let second_countrieIndex = order[i+1];
    let second_country = nodes[second_countrieIndex];
    let distance = dist(first_country.x, first_country.y, second_country.x, second_country.y);
    total = total + distance;
  }
  return total;
}

function keyPressed() {
  screenState = STARTSCREEN;
}


//Genetics Algorithms

function calculateFitness(){ //Calculate the fitness value of a distance
  let currentRecord = Infinity;

  for (let i = 0; i < population.length; i++) {
    let distance = calculateDistance(countries, population[i]);

    if (distance < recordDistance) {
      recordDistance = distance;
      finalBestDistance = population[i];
    }

    if (distance < currentRecord) {
      currentRecord = distance;
      currentBestDistance = population[i];
    }

    fitness[i] = 1/distance;
  }   
}

function pourcentFitness(){ //this function help us to set the fitness between 0 to 100% (all of them together being 100%)
  let total = 0;

  for (let i = 0; i < fitness.length; i++) {
  total = total + fitness[i];    
  }

  for (let i = 0; i < fitness.length; i++) {
  fitness[i] = fitness[i] / total;   
  }
}

function selectOne(arr, fitness) { //select an order according to his fitness probability value
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - fitness[index];
    index = index + 1;
  }
  index = index - 1;
  return arr[index].slice();
} 

function nextGeneration(){ //create the next generation 
    var newGeneration = [];
    for (var i = 0; i < population.length; i++) { //for every member of the existing population we make a new member of the new population 
      var order = selectOne(population, fitness);
      mutation(order);
      newGeneration[i] = order;
    }
    population = newGeneration;
}

function mutation(order) { //Make change on the best population
  var indexA = floor(random(order.length));
  var indexB = floor(random(order.length));
  cross(order, indexA, indexB);
}