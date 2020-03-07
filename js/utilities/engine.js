function Engine (fps, update, render) {
	console.log("Inside \"engine.js\".");

	//Declare private constants and variables
  var fpsContainer;
	var isRunning = false;
	var isUpdated;
	var animationFrame;
  var self = this;
	var buffer = 0;
	var throttleCounter = 0;
	var deThrottleCounter = 0;
	var throttleTimer = 10
	var throttleCap = 30;

	this.fps = fps;
	this.throttleFps = this.fps;

	this.engineLastTimestamp = window.performance.now();
	this.engineCurrentTimestamp;
	this.engineDeltaTimestamp;
	this.engineFPS;

	this.gameLastTimestamp = window.performance.now();
	this.gameCurrentTimestamp;
	this.gameDeltaTimestamp;
	this.gameFPS;

	//Create the FPS div module
  fpsContainer = document.getElementById("fps-container");
	fpsContainer.innerHTML = `Engine FPS: ${null} | Game FPS: ${null}`;
  document.body.appendChild(fpsContainer);

	var handleThrottle = function() {
		if (self.engineFPS <= throttleCap) {
			throttleCounter++;
			if (throttleCounter == throttleTimer) {
				deThrottleCounter = 0;
				console.log(`Throttling game to ${throttleCap} fps due to system slowness.`);
				this.throttleFps = throttleCap;
			}
		}
		else {
			throttleCounter = 0;
			deThrottleCounter++;
			if (deThrottleCounter == throttleTimer) {
				console.log(`Dethrottling game back to ${self.fps}.`);
				this.throttleFps = this.fps;
			}
		}
	};

  var calculateFps = function(type) {
		self[type+"CurrentTimestamp"] = window.performance.now();
		self[type+"DeltaTimestamp"] = self[type+"CurrentTimestamp"]-self[type+"LastTimestamp"];
		self[type+"FPS"] = Math.floor(1000/(self[type+"DeltaTimestamp"]));
		self[type+"LastTimestamp"] = self[type+"CurrentTimestamp"];
		if (type == "engine") {
			buffer += self.engineDeltaTimestamp;
			handleThrottle();
		}
	};

	var updateFps = function() {
    	fpsContainer.innerHTML = `Engine FPS: ${self.engineFPS} | Game FPS: ${self.gameFPS}`; //Only display updated value every so often
  };

	var handleGameUpdate = function() {
		if (buffer < 1000/self.throttleFps) {
			return false;
		}
		else {
			return true;
		}
	};

  //Declare public functions
	this.start = function() {
		console.log("engine.start()");
		isRunning = true;
		self.run();
  };

	this.run = function() {
		animationFrame = window.requestAnimationFrame(self.run);

		//Get the FPS (number of deltas per second (1000ms / delta in ms))
  	calculateFps("engine");
		/*DEBUG*/ //console.log(`Engine FPS: ${self.engineFPS}`);
		if (handleGameUpdate()) {
			calculateFps("game");
			/*DEBUG*/ //console.log(`Game FPS: ${self.gameFPS}\r\nGame current: ${self.gameCurrentTimestamp}\r\nGame delta: ${self.gameDeltaTimestamp}`);
		}
		if (animationFrame % 50 == 0) {
			updateFps();
		}

		while (handleGameUpdate()) {
			buffer -= 1000/self.throttleFps;
			if (isRunning) {
				update();
			}
			isUpdated = true;
		}

		if (isUpdated) {
			if (isRunning) {
				render();
			}
			isUpdated = false;
		}
	};

	this.stop = function() {
		console.log("engine.stop()");
	  cancelAnimationFrame(animationFrame);
		isRunning = false;
  };
}

Engine.prototype.constructor = Engine;
