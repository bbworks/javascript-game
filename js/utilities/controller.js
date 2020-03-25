function Controller (game) {
	this.key = {
	  left: false,
	  up: false,
	  right: false,
	  down: false,
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

	var dPadCenterLeftOffset = 65;
	var dPadButtonSpacing = buttonSize*0.8;
	var dPadButtonSpacingLandscape = dPadButtonSpacing * 0.6;
	var joystickCenterRightOffset = 30;

	const self = this;

	//Create functions that need to access private data as public functions
	var handleKeyDownUp = function(event) {
	  var down = (event.type === "keydown") ? true : false;

	  //Assure keys (specifically arrows) don't perform default behavior
	  if (
	    event.keyCode === 37 ||
	    event.keyCode === 38 ||
	    event.keyCode === 39 ||
	    event.keyCode === 40
	  ) {
	    event.preventDefault();
	  }

	  switch (event.keyCode)
	  {
	    case 37:
	      self.key.left = down;
	      break;
	    case 38:
	      self.key.up = down;
	      break;
	    case 39:
	      self.key.right = down;
	      break;
	    case 40:
	      self.key.down = down;
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
				button = 0;
			}

	    //Assure keys (specifically arrows) don't perform default behavior
	    if (
				(button === 0  || button === 2) &&
				event.type !== "touchstart"
			) {
	      event.preventDefault();
	    }

	    switch (button)
	    {
	      case 0:
	        self.mouse.left = down;
	        break;
	      case 2:
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
	  	/*DEBUG*/ //console.log(self.mouse.x, self.mouse.y);
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
	  var dPadOffset = dPadCenterLeftOffset - (isLandscape ? 20 : 0);
	  var dPadOffset = (isLandscape ? (sideMargin-size)/2 : dPadCenterLeftOffset);
	  var joystickOffset = (isLandscape ? (sideMargin-size)/2 : joystickCenterRightOffset);

	  self.screenController.joystick.style.cssText += "top:"+middleHeight+"px;right:"+joystickOffset+"px;";
	  self.screenController.left.style.cssText += "top:"+middleHeight+"px;left:"+(dPadOffset-spacing)+"px;";
	  self.screenController.up.style.cssText += "top:"+(middleHeight-spacing)+"px;left:"+dPadOffset+"px;";
	  self.screenController.right.style.cssText += "top:"+middleHeight+"px;left:"+(dPadOffset+spacing)+"px;";
	  self.screenController.down.style.cssText += "top:"+(middleHeight+spacing)+"px;left:"+dPadOffset+"px;";

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

	this.resize = function (canvas) {
	  var screenWidth = document.documentElement.clientWidth;
		var screenHeight = document.documentElement.clientHeight;

	  if (window.matchMedia("(min-width: 1200px)").matches) {
			//Desktop
			console.log(`Desktop | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "900px";
			this.hideOnScreenController();
		} else if (window.matchMedia("(min-width: 992px)").matches) {
			//Tablet, landscape
			console.log(`Tablet, landscape | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "800px";
			this.setupOnScreenController(true);
		} else if (
	      window.matchMedia("(min-width: 768px)").matches ||
	      window.matchMedia("(min-width: 600px) and (orientation: portrait)").matches
	    ) {
			//Tablet, portrait
			console.log(`Tablet, portrait | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "700px";
			this.setupOnScreenController(false);
		}	else if (window.matchMedia("(min-width: 600px) and (orientation: landscape)").matches) {
	    //Mobile, landscape
	    console.log(`Mobile, landscape | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "500px";
	    this.setupOnScreenController(true);
	  } else /*(max-width: 600px)*/{
			//Mobile portrait
	    console.log(`Mobile, portrait | ${screenWidth}px x ${screenHeight}px`);
	    canvas.style.width = "350px";
			this.setupOnScreenController(false);
		}
	}

	window.addEventListener("keydown", handleKeyDownUp);
	window.addEventListener("keyup", handleKeyDownUp);
	window.addEventListener("mousedown", handleMouseDownUp);
	window.addEventListener("mouseup", handleMouseDownUp);
	window.addEventListener("mousemove", handleMouseMove);
	window.addEventListener("touchstart", handleMouseDownUp);
	window.addEventListener("touchend", handleMouseDownUp);
	window.addEventListener("touchmove", handleMouseMove);
} //end constructor

Controller.prototype.constructor =  Controller;
