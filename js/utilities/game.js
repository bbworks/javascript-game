const Game = function(width, aspectRatio) {
	console.log("Inside \"game.js\".");

	//Declare constants and variables
	const ASPECT_RATIO = aspectRatio
	const SCREEN_WIDTH = width;
	const SCREEN_HEIGHT = SCREEN_WIDTH*(1/ASPECT_RATIO); //225px;
	const self = this;

	this.stopOnBlur = true;
	this.isPaused = false;
	this.isTouchable = null;
	var onStart = {
		audioIsPlaying: null,
	};

	var detectTouch = function() {
		try {
	    document.createEvent("TouchEvent");
	    return true;
	  } catch (exception) {
	    return false;
	  }
	};

	this.resize = function() {
		self.controller.resize(self.context.canvas, self.isTouchable);
		self.audio.resize();
	}

	this.update = function() {
		self.state.handleInput();
		self.state.update();
		self.state.updateState(); //update state last--so the engine STOPS when we need it to
	}

	this.render = function() {
	  self.state.render();
	}

	//Initialize variables (var player/gameObjects/utilities = Class.create()
	this.context = document.getElementById("canvas").getContext("2d");
	this.context.canvas.width = SCREEN_WIDTH;
	this.context.canvas.height = SCREEN_HEIGHT;
	this.context.imageSmoothingEnabled = false;

	this.world = {
		object: {},
	};

	this.debugger = {
		checkbox: document.getElementById("debug-checkbox"),
		input: document.getElementById("debug-input"),
		response: document.getElementById("debug-response"),
	}

	this.debugger.checkbox.addEventListener("click",
		function(event) {
			self.debugger.input.style.display = (this.checked ? "block" : "none");
			self.debugger.response.style.display = (this.checked ? "block" : "none");
			if (!this.checked) {
				self.debugger.response.value = "";
			}
			document.body.style.paddingRight = (this.checked ? "100px" : "0");
			self.resize();
		}
	);

	this.debugger.input.addEventListener("input",
		function(event) {
			if(event.inputType === "insertLineBreak") {
				var js = event.srcElement.value.replace("\r","").replace("\n","").replace("\u201c","\"").replace("\u201d","\"");
				self.debugger.input.value = js;
				console.log(eval(js));
				self.debugger.response.value = eval(js);
			}
		}
	);

	this.init = function() {
		//Setup utilities
		this.engine = new Engine(60, this.update, this.render);
		this.state = new StateStack(this);
		this.controller = new Controller(this);
		this.assetManager = new AssetManager(this);
		this.collisionSystem = new CollisionSystem(this);
		this.viewport = new Viewport(0,0,this.context.canvas.width,this.context.canvas.height, this);
		this.audio = new AudioEngine(this, 0.2, true);

		//Setup game
		this.audio.init();
		this.isTouchable = detectTouch(); //Find this BEFORE calling resize()
		this.resize();
		window.addEventListener("resize", this.resize);
		window.addEventListener("orientationchange", this.resize);
		window.addEventListener("blur",
			function() {
				if (self.stopOnBlur) {
						console.log("window.onblur()");
						self.controller.cancelInput();
						onStart.audioIsPlaying = self.audio.isPlaying() || onStart.audioIsPlaying || false;
						if (onStart.audioIsPlaying) {
							self.audio.pause("main");
						}
						self.engine.onBlur();
				}
			}
		);
		window.addEventListener("focus",
			function() {
				if (self.stopOnBlur || !self.engine.isRunning) {
						console.log("window.onfocus()");
						if (onStart.audioIsPlaying) {
							self.audio.play("main");
						}
						self.engine.onFocus();
				}
			}
		);
		this.assetManager.initLoadingScreen(this);

		//Start the game by pushing the first state
		this.state.push(new MainMenuState(this, this.start));
	};

	this.start = function() {
		self.engine.start();
		if (onStart.audioIsPlaying) {
			self.audio.play("main");
		}
	};

	this.stop = function() {
		onStart.audioIsPlaying = this.audio.isPlaying() || onStart.audioIsPlaying || false;
		this.audio.pause("main");
		this.engine.stop();
	};

	console.log("End of \"game.js\".");
};

//Handle errors OUTSIDE the game class to assure we receive errors independently
window.addEventListener ("error", function(error) {
  var defaultMessage = "[ERROR] The game failed to run.";
	if (error.message.toLowerCase().match(/script error/)) {
		window.alert(`${defaultMessage}\r\n`+
			`Review the browser console for more information (Ctrl+Shift+I).`);
	} else {
		window.alert(`${defaultMessage}\r\n`+
			` + Error: ${error.message}\r\n`+
			` + File: ${error.filename || null}\r\n`+
			` + Line: ${(error.lineno === 0 ? null : error.lineno)}\r\n`+
			` + Column: ${(error.colno === 0 ? null : error.colno)}`
		);
	}
  return false;
});

const game = new Game(400, 16/9);
game.init();
