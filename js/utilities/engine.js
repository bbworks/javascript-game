function Engine (fps, update, render) {
	console.log("Inside \"engine.js\".");

	//Declare private constants and variables
	var fpsContainer;
	var isUpdated;
	var animationFrame;
	var self = this;
	var buffer = 0;
	var throttleCounter = 0;
	var deThrottleCounter = 0;
	var throttleTimer = 10
	var throttleCap = 30;

	this.isRunning = false;

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
			if (throttleCounter === throttleTimer) {
				deThrottleCounter = 0;
				console.log(`Throttling game to ${throttleCap} fps due to system slowness.`);
				this.throttleFps = throttleCap;
			}
		}
		else {
			throttleCounter = 0;
			deThrottleCounter++;
			if (deThrottleCounter === throttleTimer) {
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
		if (type === "engine") {
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
		return true;
	};

	//Declare public functions
	this.onBlur = function() {
		self.isRunning = false;
	};

	this.onFocus = function() {
		self.isRunning = true;
	};

	this.start = function() {
		console.log("engine.start()");
		self.isRunning = true;
		self.run();
	};

	this.run = function() {
		//request the next animation frame FIRST, so we can cancel it during our run if needed without going into another loop
		animationFrame = window.requestAnimationFrame(self.run);

		//Get the frames per second (number of times we can loop in one second based on current delta (1000ms / delta in ms))
		calculateFps("engine");
		if (handleGameUpdate()) {
			calculateFps("game");
		}

		//Visibly update the frames per second on-screen every 50 executions
		if (animationFrame % 50 === 0) {
			updateFps();
		}

		//Run the update as many times as necessary, based on our specified frame rate and on how long its been since we last updated
		while (handleGameUpdate()) {
			buffer -= 1000/self.throttleFps;
			if (self.isRunning) {
				update();
			}
			isUpdated = true;
		}

		//Run the render, only if the engine is running and also if we actually updated
		if (isUpdated) {
			if (self.isRunning) {
				render();
			}
			isUpdated = false;
		}
	};

	this.stop = function() {
		console.log("engine.stop()");
		cancelAnimationFrame(animationFrame);
		self.isRunning = false;
	};
}

Engine.prototype.constructor = Engine;
