//setting up global variables for the menu
let MENUSCREEN = 0;
let STARTSCREEN = 1;
let screenState = MENUSCREEN;

//Application Parameters//
let numberOfCountries = 10;
let mutationRateValue = 0.01;
let popSize = 50;
//---------------------//

let countries = [];

let currentBestDistance;
let finalBestDistance;
let recordDistance = Infinity;

let order = [];

let time = Infinity;
let timeSaved = [];
let population = [];
let shuffledPop = [];

let fitness = [];
// let colors = [];

let savedDistance = [];

function setup() {
  //setting up the full screen
  let myCanvas = createCanvas(windowWidth / 2, windowHeight);
  myCanvas.parent("whole_algorithm");

  for (let i = 0; i < numberOfCountries; i++) { //we create the countries and an array of order
    let randomX = [150,250, 83, 182, 507,120,400,133,222,712];
    let randomY = [123, 333, 287, 210, 180,300,200,320,272,222];
    countries[i] = createVector(randomX[i], randomY[i]); //For test and comparaison purpose
    // countries[i] = createVector(random(width), randomIntFromInterval(100,350));
    order[i] = i;

  }


  for (let i = 0; i < popSize; i++) {
    population[i] = order.slice();
    shuffledPop = shuffle(population[i]);
  }
}


function draw() {
  background(0);
  if (screenState == MENUSCREEN) {
    drawMenu();
  } else if (screenState == STARTSCREEN) {
    drawStart();
    // background(0);
    fill(255);
    textSize(24);
    text(`${round(millis() / 1000)} seconds have gone by`, width/2, height / 2);
  } else {
    print("Error!");
  }
}

function drawMenu() {

  // Text title
  textSize(28);
  text("TSP sovled with Genetic Algorithm", (windowWidth / 4), 15);
  textAlign(CENTER, TOP);
  fill(255, 255, 255);

  textSize(28);
  text("Press any key to start", (windowWidth / 4), 85);
}

function drawStart() {

  //Genectics algorithm function
  calculateFitness();
  pourcentFitness();
  nextGeneration();

  //Draw the best final path
  strokeWeight(6);
  noFill();
  stroke(0, 255, 0);
  beginShape();
  for (let i = 0; i < finalBestDistance.length; i++) {
    let j = finalBestDistance[i];
    vertex(countries[j].x, countries[j].y);
    ellipse(countries[j].x, countries[j].y, 16, 16);
  }
  endShape();

  //Draw all path between nodes (countries)
  stroke(255, 255, 255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = 0; i < currentBestDistance.length; i++) {
    let j = currentBestDistance[i];
    vertex(countries[j].x, countries[j].y);
    ellipse(countries[j].x, countries[j].y, 16, 16);
  }
  endShape();

  //Display best current distance
  fill(255, 255, 255);
  textSize(28);
  text("Best path with GA : " + finalBestDistance, (windowWidth / 4), 10);
}

//Allow to change the order of a given array 
function cross(arr, a, b) {
  let temporary = arr[a];
  arr[a] = arr[b];
  arr[b] = temporary;
}

function crossOver(orderA, orderB) {
  let arrStart = floor(random(orderA.length));
  let arrEnd = floor(random(arrStart + 1, orderA.length));
  let neworder = orderA.slice(arrStart, arrEnd);
  for (let i = 0; i < orderB.length; i++) {
    let country = orderB[i];
    if (!neworder.includes(country)) {
      neworder.push(country);
    }
  }
  return neworder;
}

function calculateDistance(nodes) { //return the total distance of a path by making the sum between node i and node i+1 (not optimised)
  let total = 0;
  for (let i = 0; i < nodes.length - 1; i++) {
    let d = dist(nodes[i].x, nodes[i].y, nodes[i + 1].x, nodes[i + 1].y);
    total += d;
  }
  return total;
}

function calculateDistanceWithPop(nodes, order) { //Basically a calcultateDistance but more optimised with the use of the population order
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    let first_countrieIndex = order[i];
    let first_country = nodes[first_countrieIndex];
    let second_countrieIndex = order[i + 1];
    let second_country = nodes[second_countrieIndex];
    let distance = dist(first_country.x, first_country.y, second_country.x, second_country.y);
    total = total + distance;
  }
  return total;
}

function keyPressed() {
  screenState = STARTSCREEN;
}

function randomIntFromInterval(min, max) { // generate a random number between two values 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomHexColor() { // generate a random hexa color
  return `#${Math.random().toString(16).substring(2, 8)}`;
}

//Genetics Algorithms

function calculateFitness() { //Calculate the fitness value of a distance
  let currentRecord = Infinity;

  for (let i = 0; i < population.length; i++) {
    let distance = calculateDistanceWithPop(countries, population[i]);

    if (distance < recordDistance) {
      recordDistance = distance;
      savedDistance.push(recordDistance.toFixed(2));
      finalBestDistance = population[i];
      time = round(millis() / 1000);
      if(!timeSaved.includes(time)){
        timeSaved.push(time);
      }
      // console.log("record : " + recordDistance);
      // console.log("larray de save : " + savedDistance);
    }

    if (distance < currentRecord) {
      currentRecord = distance;
      currentBestDistance = population[i];
    }

    fitness[i] = 1 / distance;
  }
}

function pourcentFitness() { //this function help us to set the fitness between 0 to 100% (all of them together being 100%)
  let total = 0;

  for (let i = 0; i < fitness.length; i++) {
    total = total + fitness[i];
  }

  for (let i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / total;

    // if(colors.length<fitness.length){
    //   colors.push(generateRandomHexColor());
    // }

  }
}

function selectOne(arr, fitness) { //select an order according to his fitness probability value
  let index = 0;
  let randomNum = random(1);

  while (randomNum > 0) {
    randomNum = randomNum - fitness[index];
    index = index + 1;
  }
  index = index - 1;
  return arr[index].slice();
}

function nextGeneration() { //create the next generation 
  let newGeneration = [];
  for (let i = 0; i < population.length; i++) { //for every member of the existing population we make a new member of the new population 
    // let order = selectOne(population, fitness);
    let orderA = selectOne(population, fitness);
    let orderB = selectOne(population, fitness);
    let order = crossOver(orderA, orderB);
    mutation(order, mutationRateValue);
    newGeneration[i] = order;
  }
  population = newGeneration;
}

function mutation(order, mutationRate) { //Make change on the best population
  for (let i = 0; i < numberOfCountries; i++) {
    if(random(1) < mutationRate) {
      let indexA = floor(random(order.length));
      let indexB = (indexA + 1) % numberOfCountries;
      cross(order, indexA, indexB);
    }
    
  }
}