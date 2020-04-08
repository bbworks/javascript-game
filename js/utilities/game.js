const Game = function(width, aspectRatio) {
	console.log("Inside \"game.js\".");

	//Declare constants and variables
	const ASPECT_RATIO = aspectRatio
	const SCREEN_WIDTH = width;
	const SCREEN_HEIGHT = SCREEN_WIDTH*(1/ASPECT_RATIO); //225px;
	var onStart = {
		audioIsPlaying: null,
	};
	this.stopOnBlur = true;
	this.isPaused = false;
	this.isTouchable = null;

	this.context = document.getElementById("canvas").getContext("2d");
	this.context.canvas.width = SCREEN_WIDTH;
	this.context.canvas.height = SCREEN_HEIGHT;
	this.context.imageSmoothingEnabled = false;

	this.world = {
		object: new Container({}),
		tilesheet: new Container({}),
	};

	this.debugger = {
		checkbox: document.getElementById("debug-checkbox"),
		input: document.getElementById("debug-input"),
		response: document.getElementById("debug-response"),
	}

	this.debugger.checkbox.addEventListener("click",
		function(event) {
			var isChecked = this.debugger.checkbox.checked;

			this.debugger.input.style.display = (isChecked ? "block" : "none");
			this.debugger.response.style.display = (isChecked ? "block" : "none");
			if (!isChecked) {
				this.debugger.response.value = "";
			}
			document.body.style.paddingRight = (isChecked ? "100px" : "0");
			this.resize();
		}.bind(this)
	);

	this.debugger.input.addEventListener("input",
		//Let's write a function to allow our built-in
		// debugger to function
		function(event) {
			if (event.inputType === "insertLineBreak") {
				//Initialize values
				var js = event.srcElement.value.replace("\r","").replace("\n","").replace("\u201c","\"").replace("\u201d","\""); //Take out line breaks and "fancy" quotation marks
				this.debugger.input.value = js;
				this.debugger.response.value = "";

				//Now, let's evaluate each statement separately
				js = js.split(";");
				for (var i in js) {
					var statement = js[i];

					if (statement) {
						//Run the statement
						// NOTE: If we specified a console.log(),
						// hijack the logged item so we can log it
						// to both the console and ourresponse textarea
						var isConsoleLog = statement.match(/console.log\((.*)\)/);
						var output;
						if (isConsoleLog) {
							output = eval.call(window, isConsoleLog[1]);
						} else {
							output = eval.call(window, statement);
					  }

						//Log the output to the console
						console.log(output);

						//Now, log the output to the response textarea
						// NOTE: If it is an object, let's actually
						// expand the object properties out visibily
						// NOTE: If object property is a function, let's
						// minimize it down to just "f ()" for simplicity
						// (the full function can still be viewed if returned)
						if (typeof output === "object") {
							//Let's return our object "view"

							//Return the name of the object (constructor)
							this.debugger.response.value += output.__proto__.constructor.name+"\r\n";

							//Now let's return each property's key and value
							// NOTE: If the object property is a function,
							// we minimize down to "f ()"
							for(var property in output) {
								var value = output[property];
								this.debugger.response.value += `  ${property}: ${(typeof value === "function" ? "f ()" : value)}\r\n`;
							}
						} else {
							//Let's just return the evaluated statement
							this.debugger.response.value += output+"\r\n";
						} //end if (typeof output === "object")
					} //end if (statement)
				} //end for (var i in js)
			} //end if (event.inputType === "insertLineBreak")
		}.bind(this)
	);

	//Declare functions
	var detectTouch = function() {
		try {
	    document.createEvent("TouchEvent");
	    return true;
	  } catch (exception) {
	    return false;
	  }
	};

	this.update = function() {
		this.state.handleInput();
		this.state.update();
		this.state.updateState(); //update state last--so the engine STOPS when we need it to
	}

	this.render = function() {
	  this.state.render();
	}

	this.resize = function() {
		this.controller.resize(this.context.canvas, this.isTouchable);
		this.audio.resize();
	}

	this.init = function() {
		//Setup utilities
		this.engine = new Engine(60, this.update.bind(this), this.render.bind(this));
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
		window.addEventListener("resize", this.resize.bind(this));
		window.addEventListener("orientationchange", this.resize.bind(this));
		window.addEventListener("blur",
			function() {
				if (this.stopOnBlur) {
						console.log("window.onblur()");
						this.controller.cancelInput();
						onStart.audioIsPlaying = this.audio.isPlaying() || onStart.audioIsPlaying || false;
						if (onStart.audioIsPlaying) {
							this.audio.pause("main");
						}
						this.engine.onBlur();
				}
			}.bind(this)
		);
		window.addEventListener("focus",
			function() {
				if (this.stopOnBlur || !this.engine.isRunning) {
						console.log("window.onfocus()");
						if (onStart.audioIsPlaying) {
							this.audio.play("main");
						}
						this.engine.onFocus();
				}
			}.bind(this)
		);
		this.assetManager.initLoadingScreen(this);

		//Start the game by pushing the first state
		this.state.push(new MainMenuState(this, this.start.bind(this)));
	};

	this.start = function() {
		this.engine.start();
		if (onStart.audioIsPlaying) {
			this.audio.play("main");
		}
	};

	this.stop = function() {
		onStart.audioIsPlaying = this.audio.isPlaying() || onStart.audioIsPlaying || false;
		this.audio.pause("main");
		this.controller.cancelInput();
		this.engine.stop();
	};

	console.log("End of \"game.js\".");
};

//Handle errors OUTSIDE the game class to assure we receive errors independently
window.addEventListener ("error",
	function(error) {
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
	}
);

const game = new Game(400, 16/9);
game.init();
