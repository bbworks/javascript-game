function PauseMenuState (game, callback) {
	State.call(this, game, callback);

	this.name = "pauseMenu";
	this.text = "PAUSE";
	this.drawn = false

} //end constructor

PauseMenuState.prototype = Object.create(State.prototype);

PauseMenuState.prototype.constructor = PauseMenuState;

PauseMenuState.prototype.handleInput = function() {
	if (game.controller.key.P) {
	  this.onExit();
		this.nextState = "pop";
	}
};

PauseMenuState.prototype.render = function() {
	if (!this.drawn) {
		//Draw the start screen background
		game.context.fillStyle = "white";
		game.context.globalAlpha = 0.5;
		game.context.fillRect(0,0,game.context.canvas.width, game.context.canvas.height);
		game.context.globalAlpha = 1;

		//Draw the title
		game.context.fillStyle = "orange";
		game.context.font = '48px monospace';
		var fontMeasurement = game.context.measureText(this.text);
		game.context.fillText(this.text,(game.context.canvas.width-fontMeasurement.width)/2,130);
		this.drawn = true;
	}
};
