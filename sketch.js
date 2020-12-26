var trex, trex_running, trex_collided,rand;
var score=0, game_over,game_overimg,restart_img, restart;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage,obstacle;
var obs1_img1, obs1_img2, obs1_img3, obs1_img4, obs1_img5, obs1_img6, trex_collide;
var cloudgroup, obstaclegroup;
var newImage;
var jump_sound, colide_sound, score_sound;

var gamestate= "PLAY"

function preload(){
  trex_collide = loadAnimation("trex_collided.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
 
 game_overimg = loadImage("gameOver.png");
 restart_img = loadImage("restart.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
 
  obs1_img1=loadImage("obstacle1.png");
  obs1_img2=loadImage("obstacle2.png");
  obs1_img3=loadImage("obstacle3.png");
  obs1_img4=loadImage("obstacle4.png");
  obs1_img5=loadImage("obstacle5.png");
  obs1_img6=loadImage("obstacle6.png");
  
  jump_sound=loadSound("jump.mp3");
  colide_sound=loadSound("die.mp3");
  score_sound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  cloudgroup = new Group();
  obstaclegroup = new Group();
   
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collide)
  trex.scale = 0.5;
  //trex.debug=true
  trex.setCollider("rectangle",0,0,70,100)
  
  game_over=createSprite(300,100)
  game_over.addImage(game_overimg)
  game_over.scale=0.5
  game_over.visible=false
  
  restart=createSprite(300,130)
  restart.addImage(restart_img)
  restart.scale=0.4
  restart.visible=false
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
}

function draw() {
  background(180);
   
   if (gamestate ==="PLAY"){
      console.log(getFrameRate())
     score=score+Math.round(getFrameRate()/60);
    
     if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -10;
        jump_sound.play();
      }
     
    trex.velocityY = trex.velocityY + 0.4
     
    if (ground.x < 0){
        ground.x = ground.width/2;
      }
     
       ground.velocityX = -(6+3*score/100);
     
     if(score%100===0 && score>0){
      score_sound.play();
                   
      }
     
     //spawn clouds
      spawnClouds();
      spawn_obstacles();
     
     if ( obstaclegroup.isTouching(trex)){
     gamestate="END";
     colide_sound.play();
    }
   }
  
 else if (gamestate==="END"){
   trex.velocityY=0;
   ground.velocityX=0;  
   obstaclegroup.setVelocityXEach(0);
   cloudgroup.setVelocityXEach(0);
   obstaclegroup.setLifetimeEach(-1)
   cloudgroup.setLifetimeEach(-1)
   trex.changeAnimation("collided",trex_collide);
   restart.visible=true
   game_over.visible=true
 }
  
  if(mousePressedOver(restart)){
    reset();    
  }
  
  text("Score "+score,500,20);
  trex.collide(invisibleGround); 
  drawSprites();
}


function spawnClouds() {

  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloudgroup.add(cloud);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
        
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function spawn_obstacles(){
  
  if(frameCount%100===0){
   obstacle=createSprite(550,160,10,10);
   //obstacle.debug=true
   obstaclegroup.add(obstacle);
   rand=Math.round(random(1,6));
   
   switch(rand){
     case 1:obstacle.addImage(obs1_img1);
         break;
     case 2:obstacle.addImage(obs1_img2);
         break;
     case 3:obstacle.addImage(obs1_img3);
         break;
     case 4:obstacle.addImage(obs1_img4);
         break;      
     case 5:obstacle.addImage(obs1_img5);
         break;
     case 6:obstacle.addImage(obs1_img6);
         break;
     default: break;     
   }
   obstacle.scale=0.5
   obstacle.velocityX=-(4+score/100);
  obstacle.lifetime=190
  }
}

function reset(){
  if(gamestate==="END"){
  gamestate="PLAY";
  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  game_over.visible=false
  restart.visible=false
  score=0
  trex.changeAnimation("running", trex_running)
  }

}