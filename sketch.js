const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink,eat,sad;

var bg_sound,cut_sound,sad_sound,eat_sound,air_sound;
var blower;
var muteButton;

function preload()
{
  bg_img = loadImage('assets/background.png');
  food = loadImage('assets/melon.png');
  rabbit = loadImage('assets/Rabbit-01.png');;
  blink = loadAnimation("assets/blink_1.png","assets/blink_2.png","assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png" , "assets/eat_1.png","assets/eat_2.png","assets/eat_3.png","assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png","assets/sad_2.png","assets/sad_3.png");
  bg_sound = loadSound("assets/sound1.mp3");
  cut_sound = loadSound("assets/rope_cut.mp3");
  sad_sound = loadSound("assets/sad.wav");
  eat_sound = loadSound("assets/eating_sound.mp3");
  air_sound = loadSound("assets/air.wav");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  createCanvas(500,700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  bg_sound.play();
  bg_sound.setVolume(0.08);

  button = createImg('assets/cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);
  
  blower = createImg("assets/balloon.png");
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airblow);

  muteButton = createImg("assets/mute.png");
  muteButton.position(450,20);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);

  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(420,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,490,690);

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  Engine.update(engine);
  ground.show();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eat_sound.play();
  }
   
  if(collide(fruit,ground.body)==true )
  {
     bunny.changeAnimation('crying');
     sad_sound.play();
   }

   drawSprites();
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airblow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  air_sound.play()
}

function mute(){
  if(bg_sound.isPlaying()){
    bg_sound.stop();
  }
  else{
    bg_sound.play();
  }
}