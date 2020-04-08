function State(game, callback) {
	this.name = "";
	this.assets = [];
	this.object = {};
	this.audio = {};
	this.nextState = false;
	this.callback = callback;
} //end constructor

State.prototype.constructor = State;

State.prototype.handleInput = function() {};

State.prototype.update = function() {};

State.prototype.render = function() {};

State.prototype.onEnter = function() {};

State.prototype.onExit = function() {};

State.prototype.start = function() {
	this.setupObjects(true);
	game.assetManager.clearAssets();
	this.callback();
};

State.prototype.addAssets = function() {
	for(var asset in this.assets) {
	  game.assetManager.addAsset(this.assets[asset]);
	}
};

State.prototype.loadAssets = function() {
	this.addAssets();
	game.assetManager.loadAssets(this.start.bind(this));
};

State.prototype.setupObjects = function(returnAssets) {
	//Set the assetManager's objects and audio into the state to hold
	if (returnAssets) {
	  this.object = game.assetManager.object;
	  this.audio = game.assetManager.audio;
		this.tilesheet = game.assetManager.tilesheet;
	}

	//And now, set it for the game
	game.world.object = new Container(this.object);
	//Before we lose the coins from the TileSheet,
	// store them in Game.world.object
	if (this.tilesheet.level) {
		if (this.tilesheet.level.coins) {
			game.world.object.add(this.tilesheet.level.coins, "coins");
		}
		if (this.tilesheet.level.platforms) {
			game.world.object.add(this.tilesheet.level.platforms, "platforms");
		}
	}
	game.world.tilesheet = new Container(this.tilesheet);
	game.audio.loadAssets(this.audio);
};
