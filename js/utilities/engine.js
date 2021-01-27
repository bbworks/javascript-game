function Engine (fps, update, render) {
	console.log("Inside \"engine.js\".");

	var isUpdated;
	var animationFrame;
	var frameTime = 0;
	var buffer = 0;

	//Throttling information
	var throttleTimer = 10 //Number of consecutive under-performing frames required to initiate throttle
	var throttleFps = 30; //The FPS we throttle down to on under-performing systems
	var throttleCounter = 0; //Used to track number of consecutive under-performing frames
	var deThrottleCounter = 0; //Used to track number of consecutive well-performing frames

	var fpsContainer; //The div that contains our FPS meter

	//Default measurement for engine performance (togglable on click)
	var fpsMeasurement = "FPS"; //"FPS" or "MS"

	//How often to render our FPS to the screen
	var renderTimerDuration = 1000;
	var renderTimerMeasurement = "ms"; //"frames" or "ms"

	var updateCount = 0; //used to track fpsContainer rendering for "ms"

	this.isRunning = false;

	this.fps = fps; //the desired FPS
	this.currentFPS = this.fps; //the current FPS we're using (the max currently allowed)

	this.engineLastTimestamp = window.performance.now();
	this.engineCurrentTimestamp;
	this.engineFrameDuration;
	this.engineFPS = 0;

	this.gameLastTimestamp = window.performance.now();
	this.gameCurrentTimestamp;
	this.gameFrameDuration;
	this.gameFPS = 0;

	var renderFps = function() {
		var measurement = (fpsMeasurement === "FPS" ? "FPS" : "Frame");
		var value = (fpsMeasurement === "FPS" ? "FPS" : "FrameDuration");
		var unit = (fpsMeasurement === "MS" ? "ms" : "");
		fpsContainer.innerHTML = `Engine ${measurement}: ${this["engine"+value]}${unit} | Game ${measurement}: ${this["game"+value]}${unit}`;
	};

	var handleRenderFps = function() {
		if (renderTimerMeasurement === "frames") {
			//return if we hit the specified number of frames/interval
			return animationFrame % renderTimerDuration === 0;
		}
		else if (renderTimerMeasurement === "ms") {
			//return if we surpass the specified time in ms
			var isReady = frameTime/renderTimerDuration > updateCount;
			if (isReady) {
				updateCount++;
			}
			return isReady;
		}
	};

	var initFpsContainer = function() {
		fpsContainer = document.createElement("div");
		fpsContainer.classList.add("fps-container");
		fpsContainer.style.position = "fixed";
		fpsContainer.style.bottom = 0;
		fpsContainer.style.width = "100%";
		fpsContainer.style.backgroundColor = "rgb(245,245,245)";
		fpsContainer.style.textAlign = "center";
		fpsContainer.style.fontFamily = "monospace";
		document.body.appendChild(fpsContainer);
		renderFps.apply(this);
		fpsContainer.addEventListener("click",
			function(event) {
				fpsMeasurement = (fpsMeasurement === "FPS" ? "MS" : "FPS");
				renderFps.apply(this);
			}.bind(this)
		);
	};

	var calculateFps = function(type) {
		this[type+"CurrentTimestamp"] = window.performance.now();
		this[type+"FrameDuration"] = this[type+"CurrentTimestamp"]-this[type+"LastTimestamp"];
		this[type+"FPS"] = (1000/(this[type+"FrameDuration"])).toFixed(1);
		this[type+"LastTimestamp"] = this[type+"CurrentTimestamp"];
		if (type === "engine") {
			buffer += this.engineFrameDuration;
			frameTime += this.engineFrameDuration;
			handleThrottle();
		}
		this[type+"FrameDuration"] = this[type+"FrameDuration"].toFixed(1); //Neaten the decimal places (for fpsContainer rendering)
	};

	var handleThrottle = function() {
		if (this.engineFPS <= throttleFps) {
			throttleCounter++;
			if (throttleCounter === throttleTimer) {
				deThrottleCounter = 0;
				console.log(`Throttling game to ${throttleFps} fps due to system slowness.`);
				this.currentFPS = throttleFps;
			}
		}
		else {
			throttleCounter = 0;
			deThrottleCounter++;
			if (deThrottleCounter === throttleTimer) {
				console.log(`Dethrottling game back to ${this.fps}.`);
				this.currentFPS = this.fps;
			}
		}
	};

	var handleGameUpdate = function() {
		if (buffer < 1000/this.currentFPS) {
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
		if (handleRenderFps()) {
			renderFps.apply(this);
		}

		//Run the update as many times as necessary, based on our specified frame rate and on how long its been since we last updated
		while (handleGameUpdate.apply(this)) {
			buffer -= 1000/this.currentFPS;
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

	initFpsContainer.apply(this);
}

Engine.prototype.constructor = Engine;
