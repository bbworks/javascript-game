function Level1State (game, callback) {
  State.call(this, game, callback);

  //Declare private constants and variables
  this.name = "level1";
  this.assets = [
    {name:"tilesheet",type:"tilesheet",src:"assets/rabbit-trap.png"}, //https://raw.githubusercontent.com/pothonprogramming/pothonprogramming.github.io/master/content/rabbit-trap/rabbit-trap.png
    {name:"player",type:"player",src:"assets/rabbit-trap.png"},
    {name:"enemy1",type:"enemy",src:"assets/rabbit-trap.png"},
    //{name:"coin",type:"coin",src:"assets/animated-png-photoshop-2.png"},
    {name:"level1Audio",type:"audio",src:"assets/sawsquarenoise_-_10_-_Towel_Defence_Ending.mp3"}
  ];

  this.levelMap =
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "........................#.............#......"+"\r\n"+
  ".....................................##......"+"\r\n"+
  "......................#.............###......"+"\r\n"+
  "....................#..............####......"+"\r\n"+
  "..................................#####......"+"\r\n"+
  ".................n...............######......"+"\r\n"+
  "________..___________________________________";

} //end constructor

Level1State.prototype = Object.create(State.prototype);

Level1State.prototype.constructor = Level1State;

Level1State.prototype.clear = function() {
  game.context.clearRect(0,0,game.context.canvas.width,game.context.canvas.height)
};

Level1State.prototype.update = function() {
  for(var each in game.world.object) {
    //Update all objects
    game.world.object[each].update();

    //Now, test collision BEFORE we scroll
    // (to avoid choppy movements from
    // collision system updating values)
    game.world.testCollision(game.world.object.player);
    game.world.testCollision(game.world.object.enemy1);

    //Now, let's update our viewport--scrolling the viewport as necessary
    //If we're hitting the left 200, stay left
    if (game.world.object.player.x < 200) {
      game.viewport.x = 0;
    }
    //If we're hitting the right 200, stay right
    else if (game.world.object.player.x > game.world.object.tilesheet.width-200) {
      game.viewport.x = game.world.object.tilesheet.width - game.viewport.width;
    }
    //Otherwise, scroll as necessary
    else {
      game.viewport.x = game.world.object.player.x - 200;
    }

    //If we go up too high, let's scroll up, otherwise stay at our base
    if (game.world.object.player.y <= game.world.object.tilesheet.height-Math.floor(game.viewport.height/2-game.world.object.player.height/2)) {
      game.viewport.y = game.world.object.player.y - (game.viewport.height-Math.floor(game.viewport.height/2-game.world.object.player.height/2));
    }
    else {
      game.viewport.y = game.viewport.baseY;
    }

    //Now, let's scroll all our objects as necessary
    game.world.object[each].scroll(game.viewport.x, game.viewport.y);
  }
};

Level1State.prototype.render = function() {
  this.clear();
  for(var each in game.world.object) {
    if (each != "player" && each != "enemy1" /*&& game.viewport.isViewable(game.world.object[each])*/) {
      game.world.object[each].render();
    }
  };
  game.world.object.player.render();
  game.world.object.enemy1.render();
};

Level1State.prototype.onEnter = function() {
  console.log("Inside \"Level1State.onEnter()\".");
  //Create the state-specific handlers
  document.addEventListener("keydown", function(event) {
    if (event.keyCode == 80) {
      self.onExit();
      self.nextState = new PauseMenuState(game, callback);
    }
  });
};

Level1State.prototype.onExit = function() {
  console.log("Inside \"Level1State.onExit()\".");
  //Create the state-specific handlers
  document.removeEventListener("keydown", function(event) {
    if (event.keyCode == 80) {
      self.onExit();
      self.nextState = new PauseMenuState(game, callback);
    }
  });
};
