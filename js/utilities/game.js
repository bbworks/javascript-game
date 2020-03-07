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

	this.resize = function(event) {
		self.controller.resize(self);
	}


	//Initialize variables (var player/gameObjects/utilities = Class.create()
	this.context = document.getElementById("canvas").getContext("2d");
  this.context.canvas.width = SCREEN_WIDTH;
  this.context.canvas.height = SCREEN_HEIGHT;
	this.context.imageSmoothingEnabled = false;

	this.world = {
		object: {},
	};

	this.css = {
		getAttribute: function(element, attribute, isNumber) {
			var regEx;
			if (isNumber) {
				regEx = new RegExp(attribute+"\\s*:\\s*([\\d]+)[\\w%]*;")
			} else {
				regEx = new RegExp(attribute+"\\s*:\\s*([\\d\\w%]+);")
			}
			var match = element.style.cssText.match(regEx)
			if (match) {
				return (isNumber ? Number(match[1]) : match[1]);
			}
			else {
				return false;
			}
		},
		styleElement: function(element, attribute, value) {
			var regEx = new RegExp(attribute+"\\s*:\\s*(-*[\\d\\w]+);");

			if (value == null) {
				element.style.cssText = element.style.cssText.replace(regEx, "");
			} else if (element.style.cssText.match(regEx)) {
	      element.style.cssText = element.style.cssText.replace(regEx, `${attribute}:${value};`);
	    } else {
	      element.style.cssText += `${attribute}:${value};`
	    }
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
		this.resize(); //Let's set up the canvas as appropriate
		window.addEventListener("resize", this.resize);
		window.addEventListener("orientationchange", this.resize);
		setupAudio();
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
