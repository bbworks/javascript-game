const Game = function(width, aspectRatio) {
	console.log("Inside \"game.js\".");

	//Declare constants and variables
	const ASPECT_RATIO = aspectRatio
	const SCREEN_WIDTH = width;
	const SCREEN_HEIGHT = SCREEN_WIDTH*(1/ASPECT_RATIO); //225px;
	const self = this;

	this.isGameOver = false;
	this.isPaused = false;
	this.isMuted = true;

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

	this.resize = function(event) {
		self.controller.resize(self);
		self.audio.positionSpeaker();
	}

	//Initialize variables (var player/gameObjects/utilities = Class.create()
	this.context = document.getElementById("canvas").getContext("2d");
  this.context.canvas.width = SCREEN_WIDTH;
  this.context.canvas.height = SCREEN_HEIGHT;
	this.context.imageSmoothingEnabled = false;

	this.world = {
		object: {},
	};

	this.audio = {
		button: document.createElement("button"),
		music: new Audio(),
		setupAudioButton: function() {
			this.button.style = "color:white;background-color:rgba(0,0,0,0);border:none;text-decoration:none;";
		},
		toggleSpeaker: function() {
			self.audio.button.setAttribute("class", (self.isMuted ? "fas fa-volume-down" : "fas fa-volume-up"));
		},
		positionSpeaker: function() {
			var speakerPosition = canvas.getBoundingClientRect();
		  self.audio.button.style.cssText += "position:absolute;top:"+(speakerPosition.top+5)+"px;left:"+(speakerPosition.left+5)+"px;";
		},
		onClick: function() {
			self.isMuted = !self.isMuted;
			if (self.audio.music.paused) {
				self.audio.music.play();
			}
			self.audio.music.muted = (self.isMuted ? true : false);
			this.toggleSpeaker();
		},
		setupAudio: function() {
			this.music.muted = (self.isMuted ? true : false);
			this.music.loop = true;
			if (!self.isMuted) {
				this.music.play(); //Start the audio if unmuted
			}
			this.setupAudioButton()
			this.toggleSpeaker();
			this.positionSpeaker();
			this.button.addEventListener("click", this.onClick);
			document.body.appendChild(this.button);
		},
	};

	this.start = function() {
		//Setup utilities
		this.engine = new Engine(60, this.update, this.render);
		this.state = new StateStack(this);
		this.controller = new Controller(this);
		this.assetManager = new AssetManager(this);
		this.collisionSystem = new CollisionSystem(this);
		this.viewport = new Viewport(0,0,this.context.canvas.width,this.context.canvas.height, this);

		//Setup game
		this.audio.setupAudio();
		this.resize();
		window.addEventListener("resize", this.resize);
		window.addEventListener("orientationchange", this.resize);
		this.assetManager.initLoadingScreen(this);

		//Start the game by pushing the first state
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
				` + Error: ${error.message}\r\n`+
				` + File: ${error.filename || null}\r\n`+
				` + Line: ${(error.lineno == 0 ? null : error.lineno)}\r\n`+
				` + Column: ${(error.colno == 0 ? null : error.colno)}`
			);
		}
    return false;
});

const game = new Game(400, 16/9);
game.start();
