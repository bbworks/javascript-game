function Controller (canvas) {
  //Declare private constants and variables

  //Declare public variables
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
  var joystickMovement = 25;
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
      if (deltaX < -joystickMovement) {
        self.key.left = true;
        self.key.right = false;
      } else if (deltaX > joystickMovement) {
        self.key.left = false;
        self.key.right = true;
      }
      else {
        self.key.right = false;
        self.key.left = false;
      }

      if (deltaY < -joystickMovement) {
        self.key.up = true;
        self.key.down = false;
      } else if (deltaY > joystickMovement) {
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
    //console.log(this.name, self.touch[this.name])
  };

  var positionScreenControllerButtons = function() {
    var speakerPosition = canvas.getBoundingClientRect();
    var dPadLeftOffset = 75;
    var dPadButtonSpacing = 30;
    var joystickRightOffset = 100;
    var bottomOffset = 35;

    self.screenController.joystick.style.cssText += "position:absolute;top:"+(speakerPosition.bottom+bottomOffset)+"px;left:"+(speakerPosition.right-joystickRightOffset)+"px;";
    self.screenController.left.style.cssText += "position:absolute;top:"+(speakerPosition.bottom+bottomOffset)+"px;left:"+(speakerPosition.left-dPadButtonSpacing+dPadLeftOffset)+"px;";
    self.screenController.up.style.cssText += "position:absolute;top:"+(speakerPosition.bottom-dPadButtonSpacing+bottomOffset)+"px;left:"+(speakerPosition.left+dPadLeftOffset)+"px;";
    self.screenController.right.style.cssText += "position:absolute;top:"+(speakerPosition.bottom+bottomOffset)+"px;left:"+(speakerPosition.left+dPadButtonSpacing+dPadLeftOffset)+"px;";
    self.screenController.down.style.cssText += "position:absolute;top:"+(speakerPosition.bottom+dPadButtonSpacing+bottomOffset)+"px;left:"+(speakerPosition.left+dPadLeftOffset)+"px;";
  };

  var setupScreenControllerDPad = function() {
    //Set up & display the on-screen d-pad
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

  this.setupOnScreenController = function () {
    for (var button in self.screenController) {
      self.screenController[button].style = "width:40px;height:40px;font-size:20px;background-color:rgb(255,0,0);border:none;text-decoration:none;border-radius:50%;";
      document.body.appendChild(self.screenController[button]);
  	}
    setupScreenControllerDPad();
    setupScreenControllerJoystick();
  	positionScreenControllerButtons();
    window.addEventListener("resize", positionScreenControllerButtons);
  }

  window.addEventListener("keydown", handleKeyDownUp);
  window.addEventListener("keyup", handleKeyDownUp);
} //end constructor

Controller.prototype = {
  constructor: Controller
}
