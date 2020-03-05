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

	this.update = function() {
		if (self.world.object.hasOwnProperty("player")) {
			if (self.controller.key.left || self.controller.touch.left) {
				self.world.object.player.moveLeft();
			}
			else if (self.controller.key.right || self.controller.touch.right) {
				self.world.object.player.moveRight();
			}
			else {
				self.world.object.player.stopMovingX()
			}

			if (self.controller.key.up || self.controller.touch.up) {
				self.world.object.player.jump();
			};
		}
    self.state.update();
		self.state.updateState(); //update state last--so the engine STOPS when we need it to
	}

	this.render = function() {
    self.state.render();
	}

	//Initialize variables (var player/gameObjects/utilities = Class.create()
	this.context = context;

	this.world = {
		object: {},
	};

	this.start = function() {
		this.engine = new Engine(60, this.update, this.render);
		this.state = new StateStack(this);
		this.controller = new Controller(this.context.canvas);
		this.assetManager = new AssetManager(this);
		this.collisionSystem = new CollisionSystem(this);
		this.viewport = new Viewport(0,0,this.context.canvas.width,this.context.canvas.height, this);
		setupAudio();
		//for mobile only, show the on-screen controller
		if (window.matchMedia("(max-width: 600px)").matches) {
			this.controller.setupOnScreenController();
		}
		this.assetManager.initLoadingScreen(this);
		this.state.push(new MainMenuState(this, this.engine.start));
	}

	this.stop = function() {
		this.audio.music.pause();
		this.engine.stop();
	}

	console.log("End of \"game.js\".");
};

window.addEventListener ("error", function(error) {
    var defaultMessage = "[ERROR] The game failed to run.";
		if (error.message.toLowerCase().match(/script error/)) {
			window.alert(`${defaultMessage}\r\n`+
				`Review the browser console for more information (Ctrl+Shift+I).`);
		} else {
			window.alert(`${defaultMessage}\r\n`+
				`+ Error message: ${error.message}\r\n`+
				`+ File: ${error.filename || null}\r\n`+
				`+ Line: ${(error.lineno == 0 ? null : error.lineno)}\r\n`+
				`+ Column: ${(error.colno == 0 ? null : error.colno)}\r\n`+
				`+ Error: ${JSON.stringify(error.error)}`
			);
		}
    return false;
});

const game = new Game();
game.start();
