function Controller (game) {
	this.key = {
	  left: false,
	  up: false,
	  right: false,
	  down: false,
		A: false,
		B: false,
		C: false,
		D: false,
		E: false,
		F: false,
		G: false,
		H: false,
		I: false,
		J: false,
		K: false,
		L: false,
		M: false,
		N: false,
		O: false,
		P: false,
		Q: false,
		R: false,
		S: false,
		T: false,
		U: false,
		V: false,
		W: false,
		X: false,
		Y: false,
		Z: false,
	};

	this.touch = {
	  left: false,
	  up: false,
	  right: false,
	  down: false,
	};

	this.mouse = {
	  left: false,
	  right: false,
	  x: null,
	  y: null,
	};

	//Holds the key/button constants
	this.input = {
		KEY: null,
		MOUSE: null,
	}

	this.input.KEY = {
		CANCEL: 3, //Cancel key.
		HELP: 6, //Help key.
		BACK_SPACE: 8, //Backspace key.
		TAB: 9, //Tab key.
		CLEAR: 12, //"5" key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key.
		RETURN: 13, //Return/enter key on the main keyboard.
		ENTER: 14, //Reserved, but not used. Obsolete since Gecko 30 (Dropped, see bug 969247.)
		SHIFT: 16, //Shift key.
		CONTROL: 17, //Control key.
		ALT: 18, //Alt (Option on Mac) key.
		PAUSE: 19, //Pause key.
		CAPS_LOCK: 20, //Caps lock.
		ESCAPE: 27, //Escape key.
		SPACE: 32, //Space bar.
		PAGE_UP: 33, //Page Up key.
		PAGE_DOWN: 34, //Page Down key.
		END: 35, //End key.
		HOME: 36, //Home key.
		LEFT: 37, //Left arrow.
		UP: 38, //Up arrow.
		RIGHT: 39, //Right arrow.
		DOWN: 40, //Down arrow.
		PRINTSCREEN: 44, //Print Screen key.
		INSERT: 45, //Ins(ert) key.
		DELETE: 46, //Del(ete) key.
		0: 48, //"0" key in standard key location.
		1: 49, //"1" key in standard key location.
		2: 50, //"2" key in standard key location.
		3: 51, //"3" key in standard key location.
		4: 52, //"4" key in standard key location.
		5: 53, //"5" key in standard key location.
		6: 54, //"6" key in standard key location.
		7: 55, //"7" key in standard key location.
		8: 56, //"8" key in standard key location.
		9: 57, //"9" key in standard key location.
		COLON: 58, //Colon (":") key.
		SEMICOLON: 59, //Semicolon (";") key.
		LESS_THAN: 60, //Less-than ("<") key.
		EQUALS: 61, //Equals ("=") key.
		GREATER_THAN: 62, //Greater-than (">") key.
		QUESTION_MARK: 63, //Question mark ("?") key.
		AT: 64, //Atmark ("@") key.
		A: 65, //"A" key.
		B: 66, //"B" key.
		C: 67, //"C" key.
		D: 68, //"D" key.
		E: 69, //"E" key.
		F: 70, //"F" key.
		G: 71, //"G" key.
		H: 72, //"H" key.
		I: 73, //"I" key.
		J: 74, //"J" key.
		K: 75, //"K" key.
		L: 76, //"L" key.
		M: 77, //"M" key.
		N: 78, //"N" key.
		O: 79, //"O" key.
		P: 80, //"P" key.
		Q: 81, //"Q" key.
		R: 82, //"R" key.
		S: 83, //"S" key.
		T: 84, //"T" key.
		U: 85, //"U" key.
		V: 86, //"V" key.
		W: 87, //"W" key.
		X: 88, //"X" key.
		Y: 89, //"Y" key.
		Z: 90, //"Z" key.
		WIN: 91, //Windows logo key on Windows. Or Super or Hyper key on Linux.
		CONTEXT_MENU: 93, //Opening context menu key.
		NUMPAD0: 96, //"0" on the numeric keypad.
		NUMPAD1: 97, //"1" on the numeric keypad.
		NUMPAD2: 98, //"2" on the numeric keypad.
		NUMPAD3: 99, //"3" on the numeric keypad.
		NUMPAD4: 100, //"4" on the numeric keypad.
		NUMPAD5: 101, //"5" on the numeric keypad.
		NUMPAD6: 102, //"6" on the numeric keypad.
		NUMPAD7: 103, //"7" on the numeric keypad.
		NUMPAD8: 104, //"8" on the numeric keypad.
		NUMPAD9: 105, //"9" on the numeric keypad.
		MULTIPLY: 106, //"*" on the numeric keypad.
		ADD: 107, //"+" on the numeric keypad.
		SUBTRACT: 109, //"-" on the numeric keypad.
		DECIMAL: 110, //Decimal point on the numeric keypad.
		DIVIDE: 111, //"/" on the numeric keypad.
		F1: 112, //F1 key.
		F2: 113, //F2 key.
		F3: 114, //F3 key.
		F4: 115, //F4 key.
		F5: 116, //F5 key.
		F6: 117, //F6 key.
		F7: 118, //F7 key.
		F8: 119, //F8 key.
		F9: 120, //F9 key.
		F10: 121, //F10 key.
		F11: 122, //F11 key.
		F12: 123, //F12 key.
		F13: 124, //F13 key.
		F14: 125, //F14 key.
		F15: 126, //F15 key.
		F16: 127, //F16 key.
		F17: 128, //F17 key.
		F18: 129, //F18 key.
		F19: 130, //F19 key.
		F20: 131, //F20 key.
		F21: 132, //F21 key.
		F22: 133, //F22 key.
		F23: 134, //F23 key.
		F24: 135, //F24 key.
		NUM_LOCK: 144, //Num Lock key.
		SCROLL_LOCK: 145, //Scroll Lock key.
		CIRCUMFLEX: 160, //Circumflex ("^") key.
		EXCLAMATION: 161, //Exclamation ("!") key.
		DOUBLE_QUOTE: 162, //Double quote (""") key.
		HASH: 163, //Hash ("#") key.
		DOLLAR: 164, //Dollar sign ("$") key.
		PERCENT: 165, //Percent ("%") key.
		AMPERSAND: 166, //Ampersand ("&") key.
		UNDERSCORE: 167, //Underscore ("_") key.
		OPEN_PAREN: 168, //Open parenthesis ("(") key.
		CLOSE_PAREN: 169, //Close parenthesis (")") key.
		ASTERISK: 170, //Asterisk ("*") key.
		PLUS: 171, //Plus ("+") key.
		PIPE: 172, //Pipe ("|") key.
		HYPHEN_MINUS: 173, //Hyphen-US/docs/Minus ("-") key.
		OPEN_CURLY_BRACKET: 174, //Open curly bracket ("{") key.
		CLOSE_CURLY_BRACKET: 175, //Close curly bracket ("}") key.
		TILDE: 176, //Tilde ("~") key.
		VOLUME_MUTE: 181, //Audio mute key.
		VOLUME_DOWN: 182, //Audio volume down key
		VOLUME_UP: 183, //Audio volume up key
		COMMA: 188, //Comma (",") key.
		PERIOD: 190, //Period (".") key.
		SLASH: 191, //Slash ("/") key.
		BACK_QUOTE: 192, //Back tick ("`") key.
		OPEN_BRACKET: 219, //Open square bracket ("[") key.
		BACK_SLASH: 220, //Back slash ("\") key.
		CLOSE_BRACKET: 221, //Close square bracket ("]") key.
		QUOTE: 222, //Quote (''') key.
		ZOOM: 251, //Zoom key.
	}

	this.input.MOUSE = {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2,
	}

	this.screenController = {
	  left: document.createElement("button"),
	  up: document.createElement("button"),
	  right: document.createElement("button"),
	  down: document.createElement("button"),
	  joystick: document.createElement("button")
	};

	this.screenController.left.name = "left";
	this.screenController.up.name = "up";
	this.screenController.right.name = "right";
	this.screenController.down.name = "down";
	this.screenController.joystick.name = "joystick";

	//Declare private variables
	var controllerContainer = document.getElementById("controller-container");

	var joystickHorizontalMovement = 15;
	var joystickVerticalMovement = 25;

	var buttonSize = 60;
	var buttonSizeLandscape = buttonSize * 0.6;

	var dPadPosition = "right";
	var dPadCenterOffset = 65;
	var dPadButtonSpacing = buttonSize*0.8;
	var dPadButtonSpacingLandscape = dPadButtonSpacing * 0.6;

	var joystickPosition = "left";
	var joystickCenterOffset = 30;

	const self = this;

	//Create functions that need to access private data as public functions
	var handleKeyDownUp = function(event) {
		if (
			event.srcElement.id === "debug-input" ||
			event.srcElement.id === "debug-reponse"
		) {
			return;
		}

		var down = (event.type === "keydown") ? true : false;

	  //Assure keys (specifically arrows) don't perform default behavior
	  if (
	    event.keyCode === this.input.KEY.LEFT ||
	    event.keyCode === this.input.KEY.UP ||
	    event.keyCode === this.input.KEY.RIGHT ||
	    event.keyCode === this.input.KEY.DOWN
	  ) {
	    event.preventDefault();
	  }

	  switch (event.keyCode)
	  {
	    case this.input.KEY.LEFT:
	      this.key.left = down;
	      break;
	    case this.input.KEY.UP:
	      this.key.up = down;
	      break;
	    case this.input.KEY.RIGHT:
	      this.key.right = down;
	      break;
	    case this.input.KEY.DOWN:
	      this.key.down = down;
	      break;
			case this.input.KEY.A:
				this.key.A = down;
				break;
			case this.input.KEY.B:
				this.key.B = down;
				break;
			case this.input.KEY.C:
				this.key.C = down;
				break;
			case this.input.KEY.D:
				this.key.D = down;
				break;
			case this.input.KEY.E:
				this.key.E = down;
				break;
			case this.input.KEY.F:
				this.key.F = down;
				break;
			case this.input.KEY.G:
				this.key.G = down;
				break;
			case this.input.KEY.H:
				this.key.H = down;
				break;
			case this.input.KEY.I:
				this.key.I = down;
				break;
			case this.input.KEY.J:
				this.key.J = down;
				break;
			case this.input.KEY.K:
				this.key.K = down;
				break;
			case this.input.KEY.L:
				this.key.L = down;
				break;
			case this.input.KEY.M:
				this.key.M = down;
				break;
			case this.input.KEY.N:
				this.key.N = down;
				break;
			case this.input.KEY.O:
				this.key.O = down;
				break;
			case this.input.KEY.P:
				this.key.P = down;
				break;
			case this.input.KEY.Q:
				this.key.Q = down;
				break;
			case this.input.KEY.R:
				this.key.R = down;
				break;
			case this.input.KEY.S:
				this.key.S = down;
				break;
			case this.input.KEY.T:
				this.key.T = down;
				break;
			case this.input.KEY.U:
				this.key.U = down;
				break;
			case this.input.KEY.V:
				this.key.V = down;
				break;
			case this.input.KEY.W:
				this.key.W = down;
				break;
			case this.input.KEY.X:
				this.key.X = down;
				break;
			case this.input.KEY.Y:
				this.key.Y = down;
				break;
			case this.input.KEY.Z:
				this.key.Z = down;
				break;
	  }
	  /*DEBUG*/ //console.log(`${self.left} ${self.up} ${self.right} ${self.down} `);
	  /*DEBUG*/ //console.log(`${event.type} ${event.keyCode} ${down}`);
	}

	var handleMouseDownUp = function(event) {
	  var isOnCanvas = event.srcElement === game.context.canvas;
	  if (isOnCanvas) {
			var down;
			var button = event.button;

			if (event.type === "mousedown" || event.type === "touchstart") {
				down = true;
			}
			else if (event.type === "mouseup" || event.type === "touchend") {
				down = false;
			}
			if (event.type === "touchstart" || event.type === "touchend") {
				button = this.input.MOUSE.LEFT;
			}

	    //Assure keys (specifically arrows) don't perform default behavior
	    if (
				(button === this.input.MOUSE.LEFT ||
					button === this.input.MOUSE.RIGHT) &&
				event.type !== "touchstart"
			) {
	      event.preventDefault();
	    }

	    switch (button)
	    {
	      case this.input.MOUSE.LEFT:
	        self.mouse.left = down;
	        break;
	      case this.input.MOUSE.RIGHT:
	        self.mouse.right = down;
	        break;
	    }
	    /*DEBUG*/ //console.log(`Event.type: ${event.type}\r\nMouse.left: ${self.mouse.left}\r\nMouse.right: ${self.mouse.right}`);
	  } //if (isOnCanvas)
	}

	var handleMouseMove = function(event) {
		var isOnCanvas = event.srcElement === game.context.canvas;
	  if (isOnCanvas) {
			var clientRect = game.context.canvas.getBoundingClientRect();
	  	if (event.type === "mousemove") {
				self.mouse.x = event.clientX - clientRect.left;
	  		self.mouse.y = event.clientY - clientRect.top;
			} else if (event.type === "touchmove") {
				self.mouse.x = event.touches[0].clientX - clientRect.left;
	  		self.mouse.y = event.touches[0].clientY - clientRect.top;
			}
	  	/*DEBUG*/ //console.log(this, self.mouse.x, self.mouse.y);
		}
	}

	var handleJoystickTouch = function(event) {
	  event.preventDefault();
	  if (event.type === "touchstart" || event.type === "touchmove") {
	    var x = event.touches[0].pageX;
	    var y = event.touches[0].pageY;
	  }
	  if (event.type === "touchstart") {
	    initialX = x;
	    initialY = y;
	  }
	  var deltaX = x - initialX;
	  var deltaY = y - initialY;
	  //var slope = deltaY/deltaX;
	  if (event.type === "touchstart" || event.type === "touchmove") {
	    //console.log(`${x}, ${y}`);
	    //console.log(`${deltaX}, ${deltaY}`);
	    //console.log(`slope: ${slope}`);
	    if (deltaX < -joystickHorizontalMovement) {
	      self.touch.left = true;
	      self.touch.right = false;
	    } else if (deltaX > joystickHorizontalMovement) {
	      self.touch.left = false;
	      self.touch.right = true;
	    }
	    else {
	      self.touch.right = false;
	      self.touch.left = false;
	    }

	    if (deltaY < -joystickVerticalMovement) {
	      self.touch.up = true;
	      self.touch.down = false;
	    } else if (deltaY > joystickVerticalMovement) {
	      self.touch.up = false;
	      self.touch.down = true;
	    }
	    else {
	      self.touch.up = false;
	      self.touch.down = false;
	    }
	  } else {
	    for (direction in self.touch) {
	      self.touch[direction] = false;
	    }
	  }
	};

	var handleDPadTouch = function(event) {
	  event.preventDefault();
	  if (event.type === "touchstart") {
	    self.touch[this.name] = true;
	  } else if (event.type === "touchend") {
	    self.touch[this.name] = false;
	  }
	};

	var setupScreenControllerContainer = function() {
	  controllerContainer.style.width = "100%";
	  controllerContainer.style.height = "175px";
	};

	var setupScreenControllerButtons = function(isLandscape) {
	  var size = (isLandscape ? buttonSizeLandscape : buttonSize);

	  for(button in self.screenController) {
	    var button = self.screenController[button];
	    button.style.position = "absolute";
	    button.style.width = size+"px";
	    button.style.height = size+"px";
	    button.style.fontSize = "20px";
	    button.style.backgroundColor = "rgb(255,0,0)";
	    button.style.border = "none";
	    button.style.textDecoration = "none";
	    button.style.borderRadius = "50%";
	    controllerContainer.appendChild(button);
	  }
	};

	var setupScreenControllerDPad = function() {
	  for (var button in self.screenController) {
			if (button !== "joystick") {
	      self.screenController[button].setAttribute("class", "fas fa-arrow-"+button);
		    self.screenController[button].addEventListener("touchstart", handleDPadTouch);
	      self.screenController[button].addEventListener("touchend", handleDPadTouch);
	    }
		}
	};

	var setupScreenControllerJoystick = function() {
	  var initialX, initialY;
	  self.screenController.joystick.setAttribute("class", "fas fa-gamepad");
	  self.screenController.joystick.addEventListener("touchstart", handleJoystickTouch);
	  self.screenController.joystick.addEventListener("touchmove", handleJoystickTouch);
	  self.screenController.joystick.addEventListener("touchend", handleJoystickTouch);
	};

	var positionScreenControllerButtons = function(isLandscape) {
		var canvasRect = game.context.canvas.getBoundingClientRect();
	  var screenRect = document.body.getBoundingClientRect();
	  var sideMargin = (screenRect.width - canvasRect.width)/2;
	  var size = (isLandscape ? buttonSizeLandscape : buttonSize);
	  var middleHeight = (parseInt(controllerContainer.style.height)-buttonSize)/2;

	  var spacing = (isLandscape ? dPadButtonSpacingLandscape : dPadButtonSpacing);
		var horizontalSpacing = spacing * (dPadPosition === "left" ? 1 : -1); //account for left or right--if right, make negaative
	  var dPadOffset = (isLandscape ? (sideMargin-size)/2 : dPadCenterOffset);
	  var joystickOffset = (isLandscape ? (sideMargin-size)/2 : joystickCenterOffset);

	  self.screenController.joystick.style.cssText += "top:"+middleHeight+"px;"+joystickPosition+":"+joystickOffset+"px;";
	  self.screenController.left.style.cssText += "top:"+middleHeight+"px;"+dPadPosition+":"+(dPadOffset-horizontalSpacing)+"px;";
	  self.screenController.up.style.cssText += "top:"+(middleHeight-spacing)+"px;"+dPadPosition+":"+dPadOffset+"px;";
	  self.screenController.right.style.cssText += "top:"+middleHeight+"px;"+dPadPosition+":"+(dPadOffset+horizontalSpacing)+"px;";
	  self.screenController.down.style.cssText += "top:"+(middleHeight+spacing)+"px;"+dPadPosition+":"+dPadOffset+"px;";

	  game.context.canvas.style.zIndex = "1";

	  if (isLandscape) {
	    game.context.canvas.style.position = "relative";
	    controllerContainer.style.bottom = canvasRect.height/5+"px";
	    controllerContainer.style.left = "-"+sideMargin+"px";
	    controllerContainer.style.width = screenRect.width+"px";
	  } else {
	    game.context.canvas.style.zIndex = null;
	    game.context.canvas.style.position = null;
	    controllerContainer.style.bottom = null;
	    controllerContainer.style.left = null;
	    controllerContainer.style.width = canvasRect.width+"px";
	  }
	};

	this.cancelInput = function() {
	  for (var button in self.key) {
	    self.key[button] = false;
	  }
	  for (var button in self.touch) {
	    self.touch[button] = false;
	  }
	  self.mouse.left = false;
	  self.mouse.right = false;
	};

	this.setupOnScreenController = function (isLandscape) {
	  this.hideOnScreenController();
	  setupScreenControllerContainer();
	  setupScreenControllerButtons(isLandscape);
	  setupScreenControllerDPad();
	  setupScreenControllerJoystick();
	  positionScreenControllerButtons(isLandscape);
	  controllerContainer.style.display = "block";
	}

	this.hideOnScreenController = function () {
	  controllerContainer.style.display = "none";
	}

	this.resize = function (canvas, isTouchable) {
	  var screenWidth = document.documentElement.clientWidth;
		var screenHeight = document.documentElement.clientHeight;

		if (window.matchMedia("(min-width: 1200px)").matches) {
			//Desktop
			console.log(`Desktop | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "900px";
		} else if (window.matchMedia("(min-width: 992px)").matches) {
			//Tablet, landscape
			console.log(`Tablet, landscape | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "800px";
		} else if (
	      window.matchMedia("(min-width: 768px)").matches ||
	      window.matchMedia("(min-width: 600px) and (orientation: portrait)").matches
	    ) {
			//Tablet, portrait
			console.log(`Tablet, portrait | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "700px";
		}	else if (window.matchMedia("(min-width: 600px) and (orientation: landscape)").matches) {
	    //Mobile, landscape
	    console.log(`Mobile, landscape | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "500px";
	  } else /*(max-width: 600px)*/{
			//Mobile portrait
	    console.log(`Mobile, portrait | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "350px";
		}

		if (isTouchable) {
			var isLandscape = (window.matchMedia("(orientation: landscape)").matches ? true : false);
			this.setupOnScreenController(isLandscape);
		} else {
			this.hideOnScreenController();
		}
	}

	window.addEventListener("keydown", handleKeyDownUp.bind(this));
	window.addEventListener("keyup", handleKeyDownUp.bind(this));
	window.addEventListener("mousedown", handleMouseDownUp.bind(this));
	window.addEventListener("mouseup", handleMouseDownUp.bind(this));
	window.addEventListener("mousemove", handleMouseMove.bind(this));
	window.addEventListener("touchstart", handleMouseDownUp.bind(this));
	window.addEventListener("touchend", handleMouseDownUp.bind(this));
	window.addEventListener("touchmove", handleMouseMove.bind(this));
} //end constructor

Controller.prototype.constructor =  Controller;
