function Engine (fps, update, render) {
	console.log("Inside \"engine.js\".");

	//Declare private constants and variables
	var fpsContainer;
	var isUpdated;
	var animationFrame;
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
		if (this.engineFPS <= throttleCap) {
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
				console.log(`Dethrottling game back to ${this.fps}.`);
				this.throttleFps = this.fps;
			}
		}
	};

	var calculateFps = function(type) {
		this[type+"CurrentTimestamp"] = window.performance.now();
		this[type+"DeltaTimestamp"] = this[type+"CurrentTimestamp"]-this[type+"LastTimestamp"];
		this[type+"FPS"] = Math.floor(1000/(this[type+"DeltaTimestamp"]));
		this[type+"LastTimestamp"] = this[type+"CurrentTimestamp"];
		if (type === "engine") {
			buffer += this.engineDeltaTimestamp;
			handleThrottle();
		}
	};

	var updateFps = function() {
	  	fpsContainer.innerHTML = `Engine FPS: ${this.engineFPS} | Game FPS: ${this.gameFPS}`; //Only display updated value every so often
	};

	var handleGameUpdate = function() {
		if (buffer < 1000/this.throttleFps) {
			return false;
		}
		return true;
	};

	//Declare public functions
	this.onBlur = function() {
		this.isRunning = false;
	};

	this.onFocus = function() {
		this.isRunning = true;
	};

	this.start = function() {
		console.log("engine.start()");
		this.isRunning = true;
		this.run();
	};

	this.run = function() {
		//request the next animation frame FIRST, so we can cancel it during our run if needed without going into another loop
		animationFrame = window.requestAnimationFrame(this.run.bind(this));

		//Get the frames per second (number of times we can loop in one second based on current delta (1000ms / delta in ms))
		calculateFps.call(this, "engine");
		if (handleGameUpdate.apply(this)) {
			calculateFps.call(this, "game");
		}

		//Visibly update the frames per second on-screen every 50 executions
		if (animationFrame % 50 === 0) {
			updateFps.apply(this);
		}

		//Run the update as many times as necessary, based on our specified frame rate and on how long its been since we last updated
		while (handleGameUpdate.apply(this)) {
			buffer -= 1000/this.throttleFps;
			if (this.isRunning) {
				update.apply(this);
			}
			isUpdated = true;
		}

		//Run the render, only if the engine is running and also if we actually updated
		if (isUpdated) {
			if (this.isRunning) {
				render.apply(this);
			}
			isUpdated = false;
		}
	};

	this.stop = function() {
		console.log("engine.stop()");
		window.cancelAnimationFrame(animationFrame);
		this.isRunning = false;
	};
}

Engine.prototype.constructor = Engine;
