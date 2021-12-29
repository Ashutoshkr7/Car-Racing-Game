const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let player = {
  speed: 2, //To set the speed of the car,
  score: 0,
};

startScreen.addEventListener("click", start); //To start the game

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function keyDown(e) {
  e.preventDefault(); //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
  keys[e.key] = true; //Upon pressing a key, the value of the pressed key should be true
  console.log(e);
  console.log(e.key);
}

function keyUp(e) {
  e.preventDefault(); //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
  keys[e.key] = false; //Upon pressing a key, the value of the pressed key should be true
  console.log(e.key);
}

function isCollide(a, b) {
  //To detect the collision between cars, a= players car, b = enemy car
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function moveLines() {
  //To repeatedly move the lines in the middle of the road
  let lines = document.querySelectorAll(".lines");

  lines.forEach(function (item) {
    if (item.y >= 700) {
      //To set the lines again from the top so that they will appear to move from top to bottom after reaching bottom
      item.y -= 750;
    }

    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function endGame() {
  player.start = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "Game Over <br> Score : " +
    player.score +
    "<br> Press Here To Restart The Game";
}

function moveEnemy(car) {
  //To repeatedly move the randomly generated cars from top to bottom
  let enemy = document.querySelectorAll(".enemy");

  enemy.forEach(function (item) {
    if (isCollide(car, item)) {
      //car Can be accessed because of closure
      console.log("hit");
      endGame();
    }

    if (item.y >= 750) {
      //When the car will be at 750 px, its position will be set to -300
      //To set the enemy cars again from the top so that they will appear to move from top to bottom after reaching bottom
      item.y = -300; //Difference between 3rd and 1st car
      item.style.left = Math.floor(Math.random() * 350) + "px";
      //To set the enemy cars at randomly generated places each time they go down from top to bottom
    }

    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function gamePlay() {
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect(); //to get the dimension of the road

  if (player.start) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top + 70) {
      player.y -= player.speed; //Decrease the y-axis position of the car, to move the car up upon pressing up arrow key
    }
    if (keys.ArrowDown && player.y < road.bottom - 90) {
      player.y += player.speed; //Increase the y-axis position of the car, to move the car down upon pressing down arrow key
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed; //Decrease the x-axis position of the car, to move the car left upon pressing left arrow key
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      //50 is car's width
      player.x += player.speed; //Increase the x-axis position of the car, to move the car right upon pressing right arrow key
    }

    car.style.top = player.y + "px"; //To increase the final position of the car from top or bottom

    car.style.left = player.x + "px"; //To increase the final position of the car from left or right

    window.requestAnimationFrame(gamePlay);
    player.score++;
    let ps = player.score - 1; //Because score present in scoreboard is 1 more than the final score shown after endgame
    score.innerText = "Score : " + ps;
  }
}

function start() {
  //to start the game

  // gameArea.classList.remove("hide"); //To start the gameplay area by removing the hide class
  startScreen.classList.add("hide"); //To hide the start screen area by adding the hide class
  gameArea.innerHTML = "";
  player.start = true; //To ensure that the player wants to play the game
  player.score = 0;
  window.requestAnimationFrame(gamePlay); //After starting the game, now we want to play the game

  for (x = 0; x < 5; x++) {
    let roadLine = document.createElement("div"); //To create road Lines in the middle of road which will appear repeatedly
    roadLine.setAttribute("class", "lines");
    roadLine.y = x * 150;
    roadLine.style.top = roadLine.y + "px"; //Setting position of each line (in the middle of the road) from top
    gameArea.appendChild(roadLine); //Create road lines under gameArea[Create an element inside another element]
    //First-line will be created from top[0-100px] 2nd from top[150-250px] And so on..
  }

  let car = document.createElement("div"); //
  car.setAttribute("class", "car");
  // car.innerText = "Hey";
  gameArea.appendChild(car); //Create car under gameArea[Create an element inside another element]

  player.x = car.offsetLeft; //Storing position of car from the x axis(left side)
  player.y = car.offsetTop; //Storing position of car from the y axis(top side)

  for (x = 0; x < 3; x++) {
    //To generate 3 random cars
    let enemyCar = document.createElement("div"); //To create road Lines in the middle of road which will appear repeatedly
    enemyCar.setAttribute("class", "enemy");
    enemyCar.y = (x + 1) * 350 * -1; //Car will come to appear from -() px from top
    enemyCar.style.top = enemyCar.y + "px"; //Setting position of each line (in the middle of the road) from top
    enemyCar.style.backgroundColor = randomColor();
    // enemyCar.style.color = randomColor();
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px"; //Math.random() Will generate numbers like 0.45678, 0.12345678 etc
    //Multiplying by 350 to show the cars on road
    gameArea.appendChild(enemyCar); //Create road lines under gameArea[Create an element inside another element]
    //First-line will be created from top[0-100px] 2nd from top[150-250px] And so on..
  }
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16); //To convert it into hexadecimal colour
    return ("0" + String(hex)).substr(-2); //We want c() to return a two character string every time. In case if iT returns only one digit character, zero is added and we take only last two digits
  }
  return "#" + c() + c() + c();
}
