function Coin (imagePath, x, y, width, height, game) {
	GameObject.call(this, x, y, width, height);

	this.image.src = imagePath;
	const frames = [
	  {x: 6, y: 53, width: 96, height: 96},
	  {x: 126, y: 53, width: 96, height: 96},
	  {x: 246, y: 53, width: 96, height: 96},
	  {x: 366, y: 53, width: 96, height: 96},
	  {x: 484, y: 53, width: 96, height: 96},
	  {x: 604, y: 53, width: 96, height: 96}
	];
	this.animation = new Animation(this.image, frames, 5, true, game.context);
} //end constructor

Coin.prototype = Object.create(GameObject.prototype);

Coin.prototype.constructor = Coin;
