//game.js

const Game = function() {
	console.log("Inside \"game.js\".");

	//Declare constants and variables
	const self = this;
	const FPS = 30;
	const ASPECT_RATIO = 16/9
	const SCREEN_WIDTH = 400;
	const SCREEN_HEIGHT = SCREEN_WIDTH*(1/ASPECT_RATIO); //225px;
	var isGameOver = false;
	var speaker;
	var isPaused = false;
	var isMuted = true;
	var gameAudio;


  //Initialize the canvas and context
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
	//context.imageSmoothingEnabled = false;

  //Declare event handler
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

	/*function start() {
    console.log("Inside \"game.start()\".");

    mainloop();
  }*/

  /*function clear() {
    context.clearRect(0,0,canvas.width,canvas.height)
  }

  function update() {
    if (currentScreen = "startScreen") {
      for(var gameObject in gameObjects.start) {
        gameObjects[gameObject].update();
      }
		}
    else
    {
      for(var gameObject in gameObjects) {
        gameObjects[gameObject].update();
      }
    }

    drawBackdrop();
    //push new Trees as needed
    if (treeArray.length == 0 || treeArray[treeArray.length-1].x == treeRandomDistance) {
      treeRandomDistance = Math.floor(canvas.width-Math.random()*treeSeparation);
      treeArray.push(new GameObject("tree", 50, Math.floor(Math.random()*treeDepth)));
    }
    //draw all Trees
    for (i=0;i<treeArray.length;i++) {
      treeArray[i].draw();
    }

    //push new Clouds as needed
    if (cloudArray.length == 0 || cloudArray[cloudArray.length-1].x == cloudRandomDistance) {
      cloudRandomDistance = Math.floor(canvas.width-Math.random()*cloudSeparation);
      cloudArray.push(new GameObject("cloud", 50, Math.floor(Math.random()*cloudDepth)));
    }
    //draw all Clouds
    for (i=0;i<cloudArray.length;i++) {
      cloudArray[i].draw();
    }

    p1.update();
    p1.draw();
    enemy1.update();
    enemy1.draw();
  }

  function render() {
    clear();
    for(var gameObject in gameObjects) {
      gameObjects[gameObject].draw();
    }
  }*/

  /*function mainloop() {
		//Get the FPS (number of deltas per second (1000ms / delta in ms))
  	currentTimestamp = window.performance.now();
    deltaTimestamp = currentTimestamp-lastTimestamp;
    currentFPS = Math.floor(1000/(deltaTimestamp));
    lastTimestamp = currentTimestamp;
    if (animationFrame % 50 == 0) {
			FPSdiv.innerHTML = currentFPS; //Only display updated value every so often
		}

		if (!isPaused) {
			gameStack.updateState();
      gameStack.update();
      gameStack.render();

    animationFrame = requestAnimationFrame(mainloop);
  }*/

  var onKeyDown = function(event) {
    //Assure keys (specifically arrows) don't perform default behavior
    if (event.keyCode == 32 ||
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40 ||
      event.keyCode == 81) {
        event.preventDefault();
      }

    if (event.keyCode == 37) { /*<-*/
      gameObjects["player"].moveLeft();
    }
    if (event.keyCode == 38) { /*^*/
      gameObjects["player"].moveUp();
    }
    if (event.keyCode == 39) { /*->*/
      gameObjects["player"].moveRight();
    }
    if (event.keyCode == 40) { /*v*/
      gameObjects["player"].moveDown();
    }
    if (event.keyCode == 32) { /*Space*/
      pause();
    }
    if (event.keyCode == 81) { /*q*/
      isGameOver = true;
    }
  }

  var onKeyUp = function(event) {
    if (event.keyCode == 37 || event.keyCode == 39) { /*<-*/ /*->*/
      gameObjects["player"].stopMovingX();
    }
    if (event.keyCode == 38 || event.keyCode == 40) { /*^*/ /*v*/
      gameObjects["player"].stopMovingY();
    }
  }

	var setupAudio = function() {
	  //Setup the volume button
	  speaker = document.createElement("button");
	  speaker.style = "color:white;background-color:rgba(0,0,0,0);border:none;text-decoration:none;";
	  speaker.setAttribute("class", (isMuted ? "fas fa-volume-down" : "fas fa-volume-up:"));
	  speaker.addEventListener("click", toggleVolume);
	  //Set the top and left based on the canvas top & left (placing button OVERTOP canvas ;D)
	  var speakerPosition = canvas.getBoundingClientRect();
	  speaker.style.cssText += "position:absolute;top:"+(speakerPosition.top+5)+"px;left:"+(speakerPosition.left+5)+"px;";
	  document.body.appendChild(speaker);

		//Setup audio
		self.audio = new Audio();
		self.audio.muted = (isMuted ? true : false);
		self.audio.loop = true;
		if (!isMuted) {
			self.audio.play(); //Start the audio if unmuted
		}
	}

	var toggleVolume = function() {
		isMuted = !isMuted;
		if (self.audio.paused) {
			self.audio.play();
		}
		self.audio.muted = (isMuted ? true : false);
		speaker.setAttribute("class", (isMuted ? "fas fa-volume-down" : "fas fa-volume-up"));
	}

	var update = function() {
		if (self.world.object.hasOwnProperty("player")) {
			if (self.controller.left) {
				self.world.object.player.moveLeft();
			}
			else if (self.controller.right) {
				self.world.object.player.moveRight();
			}
			else {
				self.world.object.player.stopMovingX()
			}

			if (self.controller.up) {
				self.world.object.player.jump();
			};
			/*else if (controller.down) {
				gameStack.top().object.player.moveDown();
			}
			else {
				gameStack.top().object.player.stopMovingY();
			};*/
		}
    self.state.update();
		self.world.testCollision(self.world.object.player);
		self.state.updateState(); //update state last--so the engine STOPS when we need it to
		//object = self.world.object;
	}

	var render = function() {
    self.state.render();
	}

	//Initialize variables (var player/gameObjects/utilities = Class.create()
	const Viewport = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};

	this.context = context;

	this.viewport = new Viewport(0,0,this.context.canvas.width,this.context.canvas.height);

	this.world = {
		object: {},
		testCollision: function(object) {
			if (self.world.object.hasOwnProperty("tilesheet") && self.world.object.tilesheet.hasOwnProperty("blocks")) {
				var blocksArray = self.world.object.tilesheet.blocks;
				for(var i = 0; i < blocksArray.length; i++) {
					if (blocksArray[i].isCollidable && blocksArray[i].isColliding(object)) {
					 /*DEBUG*/ //console.log(true);
					 object.collide(blocksArray[i]);
				 }
				}
			}
		}, //end testCollision
	};



	this.start = function() {
		setupAudio();
		this.engine = new Engine(30, update, render);
		this.state = new StateStack(this.engine);
		this.controller = new Controller();
		window.addEventListener("keydown", this.controller.handleKeyDownUp);
		window.addEventListener("keyup", this.controller.handleKeyDownUp);
		this.state.push(new MainMenuState(this, this.engine.start));
	}

	this.stop = function() {
		this.engine.stop();
	}

	console.log("End of \"game.js\".");
};

const game = new Game();
game.start();
