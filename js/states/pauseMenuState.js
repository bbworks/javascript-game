function PauseMenuState (game, callback) {
  //Declare private constants and variables
  const stateName = "pauseMenu";
  const text = "PAUSE";
  var drawn = false;
  const self = this;
  const gameObjectsInfo = [];

  //Create functions that need to access private data as public functions
  this.render = function() {
    if (!drawn) {
      //Draw the start screen background
      game.context.fillStyle = "white";
      game.context.globalAlpha = 0.5;
      game.context.fillRect(0,0,game.context.canvas.width, game.context.canvas.height);
      game.context.globalAlpha = 1;

      //Draw the title
      game.context.fillStyle = "orange";
      game.context.font = '48px monospace';
      var fontMeasurement = game.context.measureText(text);
      game.context.fillText(text,(game.context.canvas.width-fontMeasurement.width)/2,130);
      drawn = true;
    }
  };

  this.onKeyDown = function(event) {
    if (event.keyCode == 80) {
      self.nextState = "pop";
    }
  }

  this.onEnter = function() {
    console.log("Inside \"PauseMenuState.onEnter()\".");
    //Create the state-specific handlers
    document.addEventListener("keydown", this.onKeyDown);
  }

  this.onExit = function() {
    console.log("Inside \"PauseMenuState.onExit()\".");
    //Create the state-specific handlers
    document.removeEventListener("keydown", this.onKeyDown);
  }

  State.call(this, stateName, gameObjectsInfo, this.update, this.render, this.onEnter, this.onExit, game, callback);
} //end constructor

PauseMenuState.prototype = State.prototype;

PauseMenuState.prototype = {
  constructor: PauseMenuState,
  update: function() {},
  onEnter: function() {},
  onExit: function() {},
}
