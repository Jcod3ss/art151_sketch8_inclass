//SKETCH 8
//COMPLETED BY: Joseph Vasquez
///DATE: 11/16/26

nn.on("load", () => {

  // KAPLAY SETUP

  kaplay({

    // button setup

    buttons: {
      moveUp: {
        keyboard: ["up", "w"],
        gamepad: ["dpad-up"],
      },
      moveDown: {
        keyboard: ["down", "s"],
        gamepad: ["dpad-down"],
      },
      moveLeft: {
        keyboard: ["left", "a"],
        gamepad: ["dpad-left"],
      },
      moveRight: {
        keyboard: ["right", "d"],
        gamepad: ["dpad-right"],
      },
    },

    // background color
background:[211,211,211]
    // background settings

  });



  // GLOBAL VARIABLES


  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;

  let soundEffect;
  let isPlaying = false;
  let bgm;

  let timeLeft = 30;
  let gameScore = 0;

  let spawnSide = "left";




  // SPRITES

  // player sprite

  // sprite file()
  loadSprite(
    "player","assests/playersprite.png", {

// sprite animation
    
      sliceX: 4,
      sliceY: 4,
anims: {
  forward: {
  from: 0,
  to: 3,
  speed: 5,
  loop: true,
},
  "left":{
  from: 4,
  to: 7,
  speed: 10,
  loop: true,
      },
  "right":{
   from: 8,
  to: 11,
  speed: 10,
  loop: true,
      },
      back:{
      from:12,
      to: 15,
      speed:10,
      loop: true,
},
     
    },
    });

  // idle sprite

 // loadSprite(
    //"playersprite",

    // sprite file

    //{

      // frame animation

   // }
  //);

  // enemy sprite

  loadSprite(
    "poison", "assests/potions.png");

    // enemy file
  //);

  // collectible sprite

  loadSprite(
    "yum","assests/Food.png");

    // collectible file
  //);



  // AUDIO ASSETS

  loadSound(
    "wiz","assests/wiz.wav");

    // sound file
  //);

  loadSound(
    "thud", "assests/thud.wav");

    // sound file
  //);

  loadMusic(
    "music", "assests/music.mp3");

    // music file
 // );



  // HELPERS

  function playSoundEffect () {
if(!isPlaying){
  isPlaying = true;
  soundEffect = play("wiz",
                     { 
    volume: 0.04,
  });

soundEffect.onEnd(() => {
  isPlaying = false;
});
 } 
  }



  function makePlatform (x, y, w, colorValue) {

    add([
      rect(w, 40),
      area(),
      outline(6),
      pos(x,y),
      body({
        isStatic: true
      }),
      color(colorValue),
      "platform"
    ]);

  }



  function spawnCollectible () {

    add([
      sprite("yum"),
      pos(rand(0,width()),rand(0,height())),
      scale(rand(0.5, 1.5)),
      roate(rand(0,65)),
      area(),
      anchor("center"),
      "yum",
    ]);

  }



  function spawnEnemy () {

    const poison = add([
      sprite("poison"),
      pos(rand(100,width()-100),
         rand(100,height()-100)),
      area(),
      anchor("center"),
      "poison"
    ]);
    wait(rand(3,30),()=> {
      if(poison.exists()){
        destroy(poison);
      }
    })

    // enemy timer

  }



  function spawnEnemyWave () {
const amount = randi(2,5);
    // wave logic
for(let i = 0; i < amount; i++){
  spawnEnemy();
}
  }



  // LVL 1 SCENE

  scene("level1", () => {

    setGravity(640);

    let facing = RIGHT;

    const scoreText = add([
text(gameScore.toString(),{
  size: 24,
}),
      pos(24,24),
      color(BLACK),
      // score display

    ]);

    const timer = add([
text(timeLeft.toFixed(0)),
      pos(width()-24,24),
      anchor("topright"),
      color(BLACK)
      // timer display
    ]);



    const player = add([
Sprite("player"),
      pos(center()),
      anchor("center"),
      area(),
      body({
        jumpForce: JUMP_FORCE,
      }),
      doubleJump(),
      // player setup

    ]);

player.play("forward");

    // LEVEL EXIT

    const levelExit = add([
rect(10,height()),
      pos(width()-10,0),
      area(),
      color(GREEN),
      "levelExit",
      // exit setup

    ]);



    // PLATFORMS
// floor
    makePlatform(0, height()-24,width(), MAGENTA);



    for (let i = 0; i < 5; i++) {

      // random platforms
makePlatform(
rand(0,width()-250),
  height()-150-(i *100),
  rand(50,230),
  rgb(rand(0,255),0,rand(0,255))
);
    }



    // COLLECTIBLES

    for (let i = 0; i < 5; i++) {

      spawnCollectible();

    }

    // collectible loop
loop(5,spawmCollectible)


    // ENEMIES

    spawnEnemyWave();

    // enemy loop

loop(15,spawnEnemyWave)

    // CONTROLS

    onButtonDown("moveRight", () => {
player.move(SPEED,0);
      facing = RIGHT;
        playSoundEffect();
      player.play("right");
      // move right

    });



    onButtonDown("moveLeft", () => {

      // move left
player.move(-SPEED,0);
      facing = LEFT;
     playSoundEffect();
      player.play('left');
    });



    onButtonDown("moveUp", () => {
player.doubleJump();
      player.play("forward")
      // jump logic

    });



    onButtonDown("moveDown", () => {

      // move down
player.move(0, -SPEED)
      player.play("back")
    });



    // PROJECTILES

    function shoot () {

      add([
        circle(4),
        color(BLUE),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({
          destroy: true
        }),
        "bullet",

      ]);

    }
onGamepadButtonPress("south",shoot);
    onKeyPress("f",shoot);


    // CAMERA

    // camera follow



    // TIMER & JOYSTICK (ANALOG) MOVEMENT

    onUpdate(() => {

      // movement logic
const moveDir = getGamepadStick("left");
      if(moveDir.len() > DEADZONE){
        player.move(moveDir.scale(SPEED));
      }
      // timer logic
timeLeft -=dt();
      timer.text = timeLeft.toFixed(1);
      // win check
if(timeLeft<= 0){
  go("win");
}
      // lose check

    });



    // COLLISIONS

    player.onCollide("yum", (item) => {

      // collect logic
      destroy(item);
      play("thud");
      gameScore+= 1;
      scoreText.text = gameScore.toString();

    });



    player.onCollide("poison", () => {

      // lose logic
      go("lose");

    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision
destroy(bullet);
      destroy(enemy);
      
      gameScore +=5;
      scoreText.text = gameScore.toString();
    });



    // TRANSITION EFFECT

    const fade = add([
      rect(width(),height()),
      pos(0,0),
      color(BLACK),
      opacity(0),
      fixed(),

      // fade overlay

    ]);



    player.onCollide("levelExit", () => {

      // level transition
      tween(
      0,
      1,
      0.5,
      (value) =>{
        fade.opacity = value;
      },
        easings.linear
        );
      wait(0.5,() =>{
        spawnSide = "left";
        go("level2")
      });

    });

  });



  // LVL 2 SCENE

  scene("level2", () => {
    conole.log("LEVEL2");

    setGravity(640);

    let facing = RIGHT;



    const scoreText = add([
      text(gameScore.toString(),{
        size: 24,
      }),
      pos(24,24),
      color(BLACK),
      fixed()

      // score display

    ]);



    const timer = add([
      text(timeLeft.toFixed(1)),
      pos(width() - 24, 24),
      anchor("topright"),
      color(BLACK),
      fixed()

      // timer display

    ]);



    const player = add([
      sprite("player"),
      pos(spawnSide === "left" ? 150 :width()- 150,
         height()/2),
      anchor("center"),
      area(),
      body({jumpForce: JUMP_FORCE,}),
      doubleJump(),

      // player setup

    ]);
player.play("forward");


    const returnExit = add([
  rect(10, height()),
      pos(0,0),
      area(),
      color(MAGENTA),
      //opacity(0),
      "returnExit",

      // return exit

  ]);



    // PLATFORMS

      // floor platform
 makePlatform(0,height()-24,width(),GREEN);



    // random platforms
      for(let i = 0; i < 12; i++){
      makePlatform(
      rand(0, width()- 300),
      rand(100, height()- 100),
      rand(100,350),
      rgb(0, rand(100,255), rand(100,255))
      );
    }



    // ENEMIES

    spawnEnemyWave();
    loop(20,()=>{
      spawnEnemyWave();
    })



    // enemy loop



    // COLLECTIBLES

    spawnCollectible();



    // collectible loop



    // CONTROLS
    
     onButtonDown("moveRight", () => {
player.move(SPEED,0);
      facing = RIGHT;
        playSoundEffect();
      player.play("right");
      // move right

    });



    onButtonDown("moveLeft", () => {

      // move left
player.move(-SPEED,0);
      facing = LEFT;
     playSoundEffect();
      player.play("left");
    });



    onButtonDown("moveUp", () => {
player.doubleJump();
      player.play("forward")
      // jump logic

    });



    onButtonDown("moveDown", () => {

      // move down
player.move(0, -SPEED)
      player.play("back")
    });


    // movement controls



    // PROJECTILES

   function shoot () {

      add([
        circle(4),
        color(YELLOW),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({
          destroy: true
        }),
        "bullet",

      ]);

    }
onGamepadButtonPress("south",shoot);
    onKeyPress("f",shoot);



    // COLLISIONS

     player.onCollide("yum", (item) => {

      // collect logic
      destroy(item);
      play("thud");
      gameScore+= 1;
      scoreText.text = gameScore.toString();

    });



    player.onCollide("poison", () => {

      // lose logic
      go("lose");

    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision
destroy(bullet);
      destroy(enemy);
      
      gameScore +=5;
      scoreText.text = gameScore.toString();
    });




    // CAMERA
    // camera scale
    setCamScale(1.5);

    // camera follow
    player.onUpdate(() =>{
      getCamPos(player.pos);
    });



    // TIMER + ANALOG MOVEMENT

    onUpdate(() => {

       // movement logic
const moveDir = getGamepadStick("left");
      if(moveDir.len() > DEADZONE){
        player.move(moveDir.scale(SPEED));
      }
      // timer logic
timeLeft -=dt();
      timer.text = timeLeft.toFixed(1);
      // win check
if(timeLeft<= 0){
  go("win");
}
      // lose check

    });



    player.onCollide("returnExit", () =>{
      spawnSide = "right";
      go("level1");

      // return transition
      

    });

  });



  // WIN GAME SCENE

  scene("win", (finalScore) => {

    add([
      text('YOU WIN!\nScore:${gameScore}',{
        size:32,
      }),
      pos(center()),
      anchor("center"),
      color(BLACK),

      // win text

    ]);



    add([
      text("press ENTER to play again"),
      pos(center().add(0,120)),
      anchor("center"),
      color(BLACK),

      // restart text
      ]);
      onKeyPress("enter",() =>{
      gameScore = 0;
      timeLeft = 30;
      go("level1");
    });
    
    onLoad(() => {
    bgm = play ("music",{
      loop: true,
      volume: 0.5,
    });

  });



  onKeyPress("space", () => {
    bgm.paused = !bgm.paused;

  });

  });



  //LOSE GAME SCENE

  scene("lose", () => {

    add([
      text("YOU LOSE",{
        size: 48,
      }),
      color(BLACK),
      pos(center()),
      anchor("center"),

      // lose text

    ]);



    add([
      text("Press ENTER to try again"),
      pos(center().add(0,80)),
      anchor("center"),
      color(BLACK),

      // restart text

    ]);



    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft=30;
      go("level1");

      // reset variables

      // restart game

    });

  });





  // START GAME 

  go("level1");

});



//onClick("player", (p) =>{
 // p.use(sprite("kat"));
 // play("bean_voice")
//})

