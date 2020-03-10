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
  var containerInfo = controllerContainer.getBoundingClientRect();

  var joystickHorizontalMovement = 15;
  var joystickVerticalMovement = 25;

  var buttonSize = 60;
  var buttonSizeLandscape = buttonSize * 0.6;

  var dPadCenterLeftOffset = 65;
  var dPadButtonSpacing = buttonSize*0.8;
  var dPadButtonSpacingLandscape = dPadButtonSpacing * 0.6;
  var joystickCenterRightOffset = 30;
  var middleHeight = (containerInfo.height-buttonSize)/2;

  const self = this;

  //Create functions that need to access private data as public functions
  var handleKeyDownUp = function(event) {
    var down = (event.type == "keydown") ? true : false;

    //Assure keys (specifically arrows) don't perform default behavior
    if (
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40
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
    //var slope = deltaY/deltaX;
    if (event.type == "touchstart" || event.type == "touchmove") {
      //console.log(`${x}, ${y}`);
      //console.log(`${deltaX}, ${deltaY}`);
      //console.log(`slope: ${slope}`);
      if (deltaX < -joystickHorizontalMovement) {
        self.key.left = true;
        self.key.right = false;
      } else if (deltaX > joystickHorizontalMovement) {
        self.key.left = false;
        self.key.right = true;
      }
      else {
        self.key.right = false;
        self.key.left = false;
      }

      if (deltaY < -joystickVerticalMovement) {
        self.key.up = true;
        self.key.down = false;
      } else if (deltaY > joystickVerticalMovement) {
        self.key.up = false;
        self.key.down = true;
      }
      else {
        self.key.up = false;
        self.key.down = false;
      }
    } else {
      for (direction in self.key) {
        self.key[direction] = false;
      }
    }
  };

  var handleDPadTouch = function(event) {
    event.preventDefault();
    if (event.type == "touchstart") {
      self.touch[this.name] = true;
    } else if (event.type == "touchend") {
      self.touch[this.name] = false;
    }
  };

  var setupScreenControllerContainer = function() {
    controllerContainer.style.display = "block";
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
			if (button != "joystick") {
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
    game.audio.button.style.zIndex = "2";

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

  this.setupOnScreenController = function (isLandscape) {
    setupScreenControllerContainer();
    setupScreenControllerButtons(isLandscape);
    setupScreenControllerDPad();
    setupScreenControllerJoystick();
    positionScreenControllerButtons(isLandscape);
  }

  this.hideOnScreenController = function () {
    controllerContainer.style.display = "none";
  }

  this.resize = function (game) {
    var screenWidth = document.documentElement.clientWidth;
		var screenHeight = document.documentElement.clientHeight;

    if (window.matchMedia("(min-width: 1200px)").matches) {
			//Desktop
			console.log(`Desktop | ${screenWidth}px x ${screenHeight}px`);
      game.context.canvas.style.width = "900px";
			this.hideOnScreenController();
		} else if (window.matchMedia("(min-width: 992px)").matches) {
			//Tablet, landscape
			console.log(`Tablet, landscape | ${screenWidth}px x ${screenHeight}px`);
      game.context.canvas.style.width = "800px";
			this.setupOnScreenController(true);
		} else if (
        window.matchMedia("(min-width: 768px)").matches ||
        window.matchMedia("(min-width: 600px) and (orientation: portrait)").matches
      ) {
			//Tablet, portrait
			console.log(`Tablet, portrait | ${screenWidth}px x ${screenHeight}px`);
      game.context.canvas.style.width = "700px";
			this.setupOnScreenController(false);
		}	else if (window.matchMedia("(min-width: 600px) and (orientation: landscape)").matches) {
      //Mobile, landscape
      console.log(`Mobile, landscape | ${screenWidth}px x ${screenHeight}px`);
      game.context.canvas.style.width = "500px";
      this.setupOnScreenController(true);
    } else /*(max-width: 600px)*/{
			//Mobile portrait
      console.log(`Mobile, portrait | ${screenWidth}px x ${screenHeight}px`);
      game.context.canvas.style.width = "350px";
			this.setupOnScreenController(false);
		}
  }

  window.addEventListener("keydown", handleKeyDownUp);
  window.addEventListener("keyup", handleKeyDownUp);
} //end constructor

Controller.prototype.constructor =  Controller;
