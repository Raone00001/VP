var dog, sadDogIMG, dIMG, hpIMG;
var bIMG, gIMG, wIMG;

var database;
var foodS,foodStock;

var fedTime, lastFed;
var feedPet, addFood;

var foodObj;

var gameState, rGameState;
var currentTime;

function preload(){

  dIMG = loadImage("images/Dog.png");
  hpIMG = loadImage("images/dogImg1.png");
  sadDogIMG = loadImage("images/Lazy.png")

  bIMG = loadImage("images/Bed Room.png");
  gIMG = loadImage("images/Garden.png");
  wIMG = loadImage("images/Wash Room.png");

}

function setup() {
  createCanvas(500, 500);

    foodObj = new Food();

    database = firebase.database();
    
    dog = createSprite(400,250,30,30);
    dog.addImage(dIMG);
    dog.scale = 0.1;

    foodStock = database.ref('Food');
    foodStock.on("value", readStock);

    feedPet = createButton("Feed The Dog");
    feedPet.position(500,75);
    feedPet.mousePressed(feedDog);

    addFood = createButton("Add Food");
    addFood.position(600,75);
    addFood.mousePressed(addFoods);

    rGameState = database.ref('gameState');
    rGameState.on("value", function(data){

      gameState = data.val();

    });

}


function draw() {  
  background(rgb(46, 139, 87));

  //foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){

    lastFed = data.val();

  })

    fill("white");
    stroke("black");
    textSize(10);

  if (lastFed >= 12){

        text("Last Fed: " + lastFed % 12 + "PM", 200, 10);
      
    } else if (lastFed == 0) {

        text("Last Fed: 12 AM ", 200, 10);

    } else {

        text("Last Fed: " + lastFed + "AM", 200, 10);

    }

currentTime = hour();

    if (currentTime == (lastFed+1)){

        update("Playing");
        foodObj.garden();

    } else if (currentTime == (lastFed+2)) {

      update("Sleeping");
      foodObj.bedroom();

    } else if (currentTime > (lastFed+2) && currentTime <= (lastFed+4)){

      update("Bathing");
      foodObj.washroom();

    } else {

      update("Hungry");
      foodObj.display();

    }

    if (gameState != "Hungry"){

      feedPet.hide();
      addFood.hide();
      dog.remove();

    } else {

      feedPet.show();
      addFood.show();
      dog.addImage(sadDogIMG)

    }

    update(gameState);
    //dog.addImage(hpIMG);

  drawSprites();

}

//function writeStock(x){

 // if(x <= 0){

  //  x = 0;

 // } else {

 //   x = x-1;

 // }

 // database.ref('/').update({

  //  Food: x

 // })

//}

function update(state){

  database.ref('/').update({  

    gameState: state

  });

}

function addFoods(){

  foodS++;
  database.ref('/').update({

    Food: foodS

  })

}

function feedDog(){

  dog.addImage(hpIMG);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({

    Food: foodObj.getFoodStock(),
    FeedTime: hour()

  })

}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}