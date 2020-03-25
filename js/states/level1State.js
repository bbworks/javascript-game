function Level1State (game, callback) {
	State.call(this, game, callback);

	//Declare private constants and variables
	this.name = "level1";
	this.assets = [
	  {name:"tilesheet",type:"tilesheet",src:"assets/rabbit-trap.png"}, //https://raw.githubusercontent.com/pothonprogramming/pothonprogramming.github.io/master/content/rabbit-trap/rabbit-trap.png
	  {name:"player",type:"player",src:"assets/rabbit-trap.png"},
	  {name:"enemy1",type:"enemy",src:"assets/NES_-_Super_Mario_Bros_-_Enemies_&_Bosses.png"},
	  {name:"coin",type:null,src:"assets/animated-png-photoshop-2.png"},
	  {name:"platform",type:null,src:"assets/NES_-_Super_Mario_Bros_-_Items_Objects_and_NPCs.png"},
	  {name:"main",type:"audio",src:"assets/sawsquarenoise_-_10_-_Towel_Defence_Ending.mp3"},
	  {name:"coin",type:"audio",src:"assets/coins_1.mp3"}, //https://freesound.org/people/ProjectsU012/sounds/341695/
		{name:"jump",type:"audio",src:"assets/jump_15.mp3"},//https://freesound.org/data/previews/273/273566_3554699-lq.mp3
	];
	const self = this;

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
	"..........................0..............0..."+"\r\n"+
	".........................0.0................."+"\r\n"+
	"........................#...0.........#......"+"\r\n"+
	"............................0........##..v..."+"\r\n"+
	"......................#.....0.......###......"+"\r\n"+
	"....................#.......0......####......"+"\r\n"+
	"............................0.....#####....v."+"\r\n"+
	"..............0..n..........0....######......"+"\r\n"+
	"________..___________________________________";

	this.onEnter = function() {
	  console.log("Inside \"Level1State.onEnter()\".");
	  //Create the state-specific handlers
	  document.addEventListener("keydown", function(event) {
	    if (event.keyCode === 80) {
	      self.onExit();
	      self.nextState = new PauseMenuState(game, callback);
	    }
	  });
	};

	this.onExit = function() {
	  console.log("Inside \"Level1State.onExit()\".");
	  //Create the state-specific handlers
	  document.removeEventListener("keydown", function(event) {
	    if (event.keyCode === 80) {
	      self.onExit();
	      self.nextState = new PauseMenuState(game, callback);
	    }
	  });
	};
} //end constructor

Level1State.prototype = Object.create(State.prototype);

Level1State.prototype.constructor = Level1State;

Level1State.prototype.clear = function() {
	game.context.clearRect(0,0,game.context.canvas.width,game.context.canvas.height)
};

Level1State.prototype.handleInput = function() {
	if (game.controller.key.left || game.controller.touch.left) {
	  game.world.object.player.moveLeft();
	}
	else if (game.controller.key.right || game.controller.touch.right) {
	  game.world.object.player.moveRight();
	}
	else {
	  game.world.object.player.stopMovingX()
	}

	if (game.controller.key.up || game.controller.touch.up) {
	  game.world.object.player.jump();
	}
};

Level1State.prototype.update = function() {
	//Because the viewport position
	// (and therefore, every other object's render position)
	// are dependent on the player's position,
	// let's update player FIRST (and other objects)
	for(var each in game.world.object) {
	  game.world.object[each].update();
	}

	//Now, test collision BEFORE we scroll
	// (to avoid choppy movements from
	// collision system updating values)
	game.collisionSystem.detectCollision(game.world.object.player);
	game.collisionSystem.detectCollision(game.world.object.enemy1);

	//Now, let's update the viewport position,
	// since we now know our definite player position
	// (post-collisions)
	game.viewport.update();

	//Now, let's scroll all our objects as necessary
	for(var each in game.world.object) {
	  game.world.object[each].scroll(game.viewport.x, game.viewport.y);
	}
};

Level1State.prototype.render = function() {
	this.clear();
	for(var each in game.world.object) {
	  if (each !== "player" && each !== "enemy1" /*&& game.viewport.isViewable(game.world.object[each])*/) {
	    game.world.object[each].render();
	  }
	};
	game.world.object.player.render();
	game.world.object.enemy1.render();
};
