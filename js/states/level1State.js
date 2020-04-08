function Level1State (game, callback) {
	State.call(this, game, callback);

	//Declare private constants and variables
	this.name = "level1";
	this.callback = callback;
	this.assets = [
	  {name:"level",type:"tilesheet",src:"assets/rabbit-trap.png"}, //https://raw.githubusercontent.com/pothonprogramming/pothonprogramming.github.io/master/content/rabbit-trap/rabbit-trap.png
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

} //end constructor

Level1State.prototype = Object.create(State.prototype);

Level1State.prototype.constructor = Level1State;

Level1State.prototype.clear = function() {
	game.context.clearRect(0,0,game.context.canvas.width,game.context.canvas.height)
};

Level1State.prototype.handleInput = function() {
	if (game.controller.key.left || game.controller.touch.left) {
	  game.world.object.children.player.moveLeft();
	}
	else if (game.controller.key.right || game.controller.touch.right) {
	  game.world.object.children.player.moveRight();
	}
	else {
	  game.world.object.children.player.stopMovingX()
	}

	if (game.controller.key.up || game.controller.touch.up) {
	  game.world.object.children.player.jump();
	}

	if (game.controller.key.P) {
	  this.onExit();
		this.nextState = new PauseMenuState(game, this.callback);
	}
};

Level1State.prototype.update = function() {
	//Update our TileSheets
	game.world.tilesheet.update();

	//Because the viewport position
	// (and therefore, every other object's render position)
	// are dependent on the player's position,
	// let's update player FIRST (and other objects)
	game.world.object.update();

	//Now, test collision BEFORE we scroll
	// (to avoid choppy movements from
	// collision system updating values)

	/*TIMER*/ //window._start = window.performance.now();
	/*FOR QUADRTREE IMPLEMENTATION WHEN NEEDED*/ //game.collisionSystem.quadtree.clear();
	/*FOR QUADRTREE IMPLEMENTATION WHEN NEEDED*/ //game.collisionSystem.quadtree.insertContainer(game.world.object);
	game.collisionSystem.check(game.world.object.children.player);
	game.collisionSystem.check(game.world.object.children.enemy1);
	/*TIMER*/ //window._end = window.performance.now();
	/*TIMER*/ //window._duration = window._end - window._start;
	/*TIMER*/ //window._totalDuration = window._totalDuration + window._duration || window._duration;
	/*TIMER*/ //window._increment = window._increment + 1 || 1;
	/*TIMER*/ //console.log(`Duration: ${window._duration.toFixed(2)} AVG: ${(window._totalDuration/window._increment).toFixed(2)}`)

	//Now, let's update the viewport position,
	// since we now know our definite player position
	// (post-collisions)
	game.viewport.update();
};

Level1State.prototype.render = function() {
	//Clear the screen
	this.clear();

	//Update our TileSheets
	game.world.tilesheet.render();

	//Update our GameObjects
	game.world.object.render();
};
