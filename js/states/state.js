function State(game, callback) {
  this.name = "";
  this.assets = [];
  this.object = {};
  this.audio = {};
  this.nextState = false;
  this.callback = callback;
} //end constructor

State.prototype.constructor = State;

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
  }

  //And now, set it for the game
  game.world.object = this.object;
  game.audio.music = this.audio;
  if (!game.isMuted) {game.audio.music.play();}
};
