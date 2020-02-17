function State(name, objectInfo, update, render, onEnter, onExit, game, callback) {
  this.object = {};
  this.audio = {};
  this.update = update;
  this.render = render;
  this.onEnter = onEnter;
  this.onExit = onExit;
  this.nextState = false;
  this.getName = function() {
      return name;
  };

  var name = name;
  var self = this;

  this.setupObjects = function() {
    game.world.object = this.object;
    game.audio = this.audio;
  };

  this.start = function() {
    this.setupObjects();
    callback();
  };

  this.loadAssets = function() {
    console.log("Inside \"State.loadAssets()\".");
    var counter = objectInfo.length;

    var onload = function() {
      console.log("Loaded "+this+".");
      //Let's catch for if we had NO objects, or just loaded them all
      if (counter == 0 || --counter == 0) {
        console.log("Loaded all "+self.getName()+" objects.");
        self.start();
      }
    };

    //If we already had NO objects, let's continue on
    if (counter == 0) {
      onload();
    }
    else {
      for(var i=0; i < objectInfo.length; i++) {
        const item = objectInfo[i];

        switch (item.type) {
          case "rectangle":
            self.object[item.name] = {
              update: function() {},
              render: function() {
                game.context.fillStyle = item.style;
                game.context.fillRect(item.x1,item.y1,item.x2,item.y2);
              }
            };
            onload(); //Manually call the onload function, as a rectangle doesn't need to load
            break;
          case "image":
            self.object[item.name] = {
              image: new Image(),
              update: function(){},
              render: function(){},
            };
            self.object[item.name].image.addEventListener("load", onload);
            self.object[item.name].image.src = item.src;
            break;
          case "audio":
            self.audio[item.name] = new Audio();
            self.audio[item.name].addEventListener("canplaythrough", onload);
            self.audio[item.name].src = item.src;
            break;
          case "player":
            self.object[item.name] = new Player(5, game.context.canvas.height-24-16-1, 20, 24, 2, 0, game.context);
            self.object[item.name].image.addEventListener("load", onload);
            self.object[item.name].image.src = item.src;
            break;
          case "tilesheet":
            var tilesheetImage = new Image();
            tilesheetImage.addEventListener("load", function() {
                self.object[item.name] = new TileSheet(tilesheetImage, 16, game);
                self.object[item.name].addLevelMap(self.levelMap);
                onload();
              }
            );
            tilesheetImage.src = item.src;

            /*world.object[item.name+"Image"] = new Image()
            world.object[item.name+"Image"].addEventListener("load",
              function() {
                onload();
                world.object[item.name+"Image"].image.src = item.src;
                world.object[item.name] = new SpriteSheet(world.object[item.name+"Image"], null, 16, world.canvas, world.context);
              }
            );*/
            break;
        } //end switch
      } //end for
    } //end else
  }

  //this.loadAssets();
} //end constructor

State.prototype.constructor = State;
