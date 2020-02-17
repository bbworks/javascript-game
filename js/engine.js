function Engine (fps, update, render) {
	console.log("Inside \"engine.js\".");

	//Declare private constants and variables
  var lastTimestamp = window.performance.now();
  var fpsDiv;
	var isRunning = false;
	var animationFrame;
  var self = this;

  //Create the FPS div module
  fpsDiv = document.createElement("div");
	fpsDiv.innerHTML = "0";
  document.body.appendChild(fpsDiv);

  //Declare private functions
  var updateFps = function() {
    var currentTimestamp = window.performance.now();
    var deltaTimestamp = currentTimestamp-lastTimestamp;
    var currentFPS = Math.floor(1000/(deltaTimestamp));
    lastTimestamp = currentTimestamp;
		if (animationFrame % 50 == 0) {
			fpsDiv.innerHTML = currentFPS; //Only display updated value every so often
		}
  };

  //Declare public functions
	this.start = function() {
		console.log("engine.start()");
		isRunning = true;
		self.run();
  };

	this.run = function() {
		if (isRunning) {
			animationFrame = requestAnimationFrame(self.run);
		}
		//Get the FPS (number of deltas per second (1000ms / delta in ms))
  	updateFps();

		if (isRunning) {update();}
    if (isRunning) {render();}
	};

	this.stop = function() {
		console.log("engine.stop()");
	  cancelAnimationFrame(animationFrame);
		isRunning = false;
  };
}

Engine.prototype.constructor = Engine;
