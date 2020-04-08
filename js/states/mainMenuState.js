function MainMenuState (game, callback) {
	//Call our parent constructor
	State.call(this, game, callback);

	//Declare private constants and variables
	this.name = "mainMenu";
	this.assets = [
	  {name:"startScreenImage",type:"image",src:"assets/pixel-art-seamless-background-location-260nw-721777879.jpg"},
	  {name:"main",type:"audio",src:"assets/Rolemusic_-_Omou_matsu.mp3"},
	];
	this.callback = callback;
	this.title = "8Bit-venture";
	this.subtitle = "Click to begin";
	this.rendered = false;
} //end constructor

MainMenuState.prototype = Object.create(State.prototype);

MainMenuState.prototype.constructor = MainMenuState;

MainMenuState.prototype.handleInput = function() {
	if (game.controller.mouse.left) {
		this.onExit();
	  this.nextState = new Level1State(game, this.callback);
	}
};

MainMenuState.prototype.render = function() {
	if (!this.rendered) {
	  //Draw the start screen background
	  game.context.globalAlpha = 0.9;
	  game.context.drawImage(game.world.object.children.startScreenImage.image,0,0,game.context.canvas.width, game.context.canvas.height);
	  game.context.globalAlpha = 1;

	  //Draw the title
	  game.context.fillStyle = "white";
	  game.context.font = '48px monospace';
	  var fontMeasurement = game.context.measureText(this.title);
	  game.context.fillText(this.title,(game.context.canvas.width-fontMeasurement.width)/2,130);

	  //Draw the subtitle
	  game.context.fillStyle = "white";
	  game.context.font = '22px monospace';
	  var fontMeasurement = game.context.measureText(this.subtitle);
	  game.context.fillText(this.subtitle,(game.context.canvas.width-fontMeasurement.width)/2,153);

	  //Only render this screen once, since it's static
	  this.rendered = true;
	}
};
