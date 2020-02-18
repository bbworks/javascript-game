//game.js

const Game = function() {
	console.log("Inside \"game.js\".");

	//Declare constants and variables
	const self = this;
	const FPS = 30;
	const ASPECT_RATIO = 16/9
	const SCREEN_WIDTH = 400;
	const SCREEN_HEIGHT = SCREEN_WIDTH*(1/ASPECT_RATIO); //225px;
	var speaker;

	this.isGameOver = false;
	this.isPaused = false;
	this.isMuted = true;

  //Initialize the canvas and context
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
	//context.imageSmoothingEnabled = false;

  //Setup the volume button
	var setupAudio = function() {
		self.audio = {
			button: document.createElement("button"),
			music: new Audio(),
		}

		//Initialize the game audio
		self.audio.music.muted = (self.isMuted ? true : false);
		self.audio.music.loop = true;
		if (!self.isMuted) {
			self.audio.music.play(); //Start the audio if unmuted
		}

		//Display the volume button
		var toggleSpeaker = function() {self.audio.button.setAttribute("class", (self.isMuted ? "fas fa-volume-down" : "fas fa-volume-up"));}
	  self.audio.button.style = "color:white;background-color:rgba(0,0,0,0);border:none;text-decoration:none;";
		toggleSpeaker();

		//Add an event handler to toggle the button onclick
		self.audio.button.addEventListener("click", function() {
			self.isMuted = !self.isMuted;
			if (self.audio.music.paused) {
				self.audio.music.play();
			}
			self.audio.music.muted = (self.isMuted ? true : false);
			toggleSpeaker();
		});

	  //Set the top and left based on the canvas top & left
		// (placing button OVERTOP canvas ;D),
		// and let's also add this to the window resize
		var positionSpeaker = function() {
			var speakerPosition = canvas.getBoundingClientRect();
		  self.audio.button.style.cssText += "position:absolute;top:"+(speakerPosition.top+5)+"px;left:"+(speakerPosition.left+5)+"px;";
		}
		positionSpeaker();
	  document.body.appendChild(self.audio.button);
		window.addEventListener("resize", positionSpeaker);
	}

	//Setup buttons (if on mobile)
	var setupControllerButtons = function() {
		self.screenController = {
			left: document.createElement("button"),
			up: document.createElement("button"),
			right: document.createElement("button"),
			down: document.createElement("button"),
			joystick: document.createElement("button")
		}

		self.screenController.left.name = "left";
		self.screenController.up.name = "up";
		self.screenController.right.name = "right";
		self.screenController.down.name = "down";
		self.screenController.joystick.name = "joystick";

		//Set up & display the on-screen d-pad
		for (var button in self.screenController) {
			self.screenController[button].setAttribute("class", "fas fa-arrow-"+button);
			self.screenController[button].style = "background-color:rgba(255,0,0,0.5);border:none;text-decoration:none;width:25px;height:25px;";
			self.screenController[button].addEventListener("touchstart", function(event) {
				event.preventDefault();
				console.log("Button "+this.name+" pressed.");
				self.controller[this.name] = true;
			});
			self.screenController[button].addEventListener("touchend", function(event) {
				event.preventDefault();
				console.log("Button "+this.name+" released.");
				self.controller[this.name] = false;
			});
		}

		//Set up & display the on-screen joystick
		{
			var initialX, initialY;
			var handleJoystickTouch = function(event) {
				event.preventDefault();
				if (event.type == "touchstart" || event.type == "touchmove") {
					var x = event.touches[0].pageX;
					var y = event.touches[0].pageY;
				}
				if (event.type == "touchstart") {
					initialX = x;
					initialY = y;
				}
				var deltaX = x - initialX;
				var deltaY = y - initialY;
				var slope = deltaY/deltaX;
				if (event.type == "touchstart" || event.type == "touchmove") {
					//console.log(`${x}, ${y}`);
					console.log(`${deltaX}, ${deltaY}`);
					//console.log(`slope: ${slope}`);
					if (deltaX < -25) {
						self.controller.left = true;
						self.controller.right = false;
					} else if (deltaX > 25) {
						self.controller.right = true;
						self.controller.left = false;
					}
					else {
						self.controller.right = false;
						self.controller.left = false;
					}
				} else {
					for (direction in self.controller) {
						self.controller[direction] = false;
					}
				}

			};

			self.screenController.joystick.setAttribute("class", "fas fa-gamepad");
			self.screenController.joystick.addEventListener("touchstart", handleJoystickTouch);
			self.screenController.joystick.addEventListener("touchmove", handleJoystickTouch);
			self.screenController.joystick.addEventListener("touchend", handleJoystickTouch);
		}

		var positionButtons = function() {
			var speakerPosition = canvas.getBoundingClientRect();
			var joystickRightOffset = 75;
			var leftOffset = 50;
			var rightOffset = 50;
			var bottomOffset = -25;
			var buttonSpacing = 20;
		  self.screenController.joystick.style.cssText += "position:absolute;top:"+(speakerPosition.bottom-bottomOffset)+"px;left:"+(speakerPosition.right-joystickRightOffset)+"px;";
			self.screenController.left.style.cssText += "position:absolute;top:"+(speakerPosition.bottom-bottomOffset)+"px;left:"+(speakerPosition.left-buttonSpacing+rightOffset)+"px;";
			self.screenController.up.style.cssText += "position:absolute;top:"+(speakerPosition.bottom-buttonSpacing-bottomOffset)+"px;left:"+(speakerPosition.left+rightOffset)+"px;";
			self.screenController.right.style.cssText += "position:absolute;top:"+(speakerPosition.bottom-bottomOffset)+"px;left:"+(speakerPosition.left+buttonSpacing+rightOffset)+"px;";
			self.screenController.down.style.cssText += "position:absolute;top:"+(speakerPosition.bottom+buttonSpacing-bottomOffset)+"px;left:"+(speakerPosition.left+rightOffset)+"px;";
		}
		positionButtons();
		for (var button in self.screenController) {
	  	document.body.appendChild(self.screenController[button]);
		}
		window.addEventListener("resize", positionButtons);
	}

	this.update = function() {
		if (self.world.object.hasOwnProperty("player")) {
			if (self.controller.left) {
				self.world.object.player.moveLeft();
			}
			else if (self.controller.right) {
				self.world.object.player.moveRight();
			}
			else {
				self.world.object.player.stopMovingX()
			}

			if (self.controller.up) {
				self.world.object.player.jump();
			};
		}
    self.state.update();
		self.world.testCollision(self.world.object.player);
		self.state.updateState(); //update state last--so the engine STOPS when we need it to
	}

	this.render = function() {
    self.state.render();
	}

	//Initialize variables (var player/gameObjects/utilities = Class.create()
	this.context = context;

	const Viewport = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};

	this.viewport = new Viewport(0,0,this.context.canvas.width,this.context.canvas.height);

	this.world = {
		object: {},
		testCollision: function(object) {
			if (self.world.object.hasOwnProperty("tilesheet") && self.world.object.tilesheet.hasOwnProperty("blocks")) {
				var blocksArray = self.world.object.tilesheet.blocks;
				for(var i = 0; i < blocksArray.length; i++) {
					if (blocksArray[i].isCollidable && blocksArray[i].isColliding(object)) {
					 /*DEBUG*/ //console.log(true);
					 object.collide(blocksArray[i]);
				 }
				}
			}
		}, //end testCollision
	};

	this.start = function() {
		setupAudio();
		//for mobile only, show the on-screen controller
		if (window.matchMedia("(max-width: 600px)").matches) {
			setupControllerButtons();
		}
		this.engine = new Engine(30, this.update, this.render);
		this.state = new StateStack(this);
		this.controller = new Controller();
		window.addEventListener("keydown", this.controller.handleKeyDownUp);
		window.addEventListener("keyup", this.controller.handleKeyDownUp);
		this.state.push(new MainMenuState(this, this.engine.start));
	}

	this.stop = function() {
		this.audio.music.pause();
		this.engine.stop();
	}

	console.log("End of \"game.js\".");
};

const game = new Game();
game.start();
