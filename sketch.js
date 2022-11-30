var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage; 
var numbers = [5,8,2,10,7,3,4,30,38,67,69,33];
//above this comment is a practice exercise.
var gameState = "play"

function preload(){
  trex_running = loadAnimation("trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png")
  cloudImg = loadImage("cloud.png")
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  checkpoint = loadSound("checkpoint.mp3")
  death = loadSound("die.mp3")
  jumping = loadSound("jump.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for(var i = 0; i<numbers.length; i++){
    if(numbers[i]<10){
      console.log(numbers[i])
    }
  }
  
  trex_running.frameDelay=2

  edges = createEdgeSprites();
  //create a trex sprite
  trex = createSprite(50,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.debug = false
  trex.setCollider("rectangle",0,0,70,80)
  
  //adding scale and position to trex
  trex.scale = 0.8;
  trex.x = 80
  
  //create ground sprite
  ground = createSprite(width/2,height-120,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.scale=1.3

  ground2 = createSprite(300,height-110,600,10)
  ground2.visible = false

  cloudsGroup = createGroup()
  cactusGroup = new Group()

  gameOver = createSprite(width/2,height/2)
  gameOver.addImage(gameoverImg)

  restart = createSprite(width/2,height/2+50 )
  restart.addImage(restartImg)
  restart.scale=0.6
  
  score = 0
}


function draw() {
  background(255); 

  console.log(getFrameRate())
 
 //stop trex from falling down 
  trex.collide(ground2);
  
  drawSprites();

  fill ("grey")
  textSize(20)
  text ("Score:" + score, width-130, 40)
  
  if (gameState == "play"){
    ground.velocityX = -(4+score/100)
  
    gameOver.visible = false;
    restart.visible = false;
    
    score = score + Math.round(getFrameRate()/60);

    if (score%1000==0&&score>0){
      checkpoint.play()
    }

    if (ground.x<0){
      ground.x = ground.width/1.5;
    }
    
    //jumping the trex on space key press
    if((keyDown("space") || keyDown("up")|| touches.length>0)&& trex.y>height-150) {
      trex.velocityY = -17;
      jumping.play()
      touches=[]
    }
    
    trex.velocityY = trex.velocityY + 0.8
    
    clouds()
    cactus()

    if(cactusGroup.isTouching(trex)){
      death.play()
      gameState = "end"
      //trex.velocityY = -13;
      //jumping.play()
    }
  }
  else if(gameState == "end"){
    trex.velocityY=-30
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX=0
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided");
    cactusGroup.setLifetimeEach(-5);
    cloudsGroup.setLifetimeEach(-2);

    if(mousePressedOver(restart) || touches.length>0){
      reset()
      touches=[]
    }
  }
}
 
function reset(){
  gameState = "play"
  cloudsGroup.destroyEach()
  cactusGroup.destroyEach()
  trex.y = 180
  score = 0
  trex.velocityY = 0
  trex.changeAnimation("running")
}


function clouds(){
  if(frameCount%70===0){
    cloud = createSprite (width,50,70,20);
    cloud.velocityX=-4
    cloud.addImage(cloudImg)
    cloud.y= Math.round(random(50,200))
    cloud.scale= random(0.5,1)
    trex.depth = cloud.depth
    trex.depth+=1
    cloud.lifetime=width/4
    cloudsGroup.add(cloud)
  }
}

function cactus(){
  if (frameCount % 100 === 0){
    enemy = createSprite(width,height-145,20,70)
    enemy.velocityX= -(4+score/100)
    r=Math.round(random(1,6))
    switch(r){
      case 1: enemy.addImage(cactus1)
      break;
      case 2: enemy.addImage(cactus2)
      break;
      case 3: enemy.addImage(cactus3)
      break;
      case 4: enemy.addImage(cactus4)
      break;
      case 5: enemy.addImage(cactus5)
      break;
      case 6: enemy.addImage(cactus6)
      break;
      default:break;
    }
    enemy.scale=0.8
    enemy.lifetime=width/enemy.velocityX
    cactusGroup.add(enemy)
  }
}
