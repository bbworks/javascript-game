function AssetManager (game) {
  this.paths = [];
  this.assets = {};
  this.object = {};
  this.audio = {};
  //this.successAssets;
  //this.errorAssets;

  this.gameContent = document.getElementById("game-content");
  this.loadingBar = document.getElementById("loading-container");
  this.loadedBar = document.getElementById("loaded-container");
} //end constructor

AssetManager.prototype.constructor = AssetManager

AssetManager.prototype.addAsset = function(asset) {
  this.paths.push(asset.src);
  if (asset.type != null) {
    this.createObject(asset);
  }
};

AssetManager.prototype.createObject = function(asset) {
  switch (asset.type) {
    case "rectangle":
      this.object[asset.name] = {
        update: function() {},
        render: function() {
          game.context.fillStyle = asset.style;
          game.context.fillRect(asset.x1,asset.y1,asset.x2,asset.y2);
        }
      };
      onload(); //Manually call the onload function, as a rectangle doesn't need to load
      break;
    case "image":
      this.object[asset.name] = {
        image: new Image(),
        update: function(){},
        render: function(){},
      };
      this.object[asset.name].image.src = asset.src;
      break;
    case "audio":
      this.audio = new Audio();
      this.audio.src = asset.src;
      this.audio.load();
      break;
    case "player":
      this.object[asset.name] = new Player(5, /*game.context.canvas.height-24-16-1*/ 279, 20, 24, 2, game);
      this.object[asset.name].image.src = asset.src;
      break;
    case "enemy":
      this.object[asset.name] = new Enemy(200, /*game.context.canvas.height-24-16-1*/ 279, 20, 20, 0.7, game);
      this.object[asset.name].image.src = asset.src;
      break;
    case "tilesheet":
      this.object[asset.name] = new TileSheet(16, game);
      this.object[asset.name].image.src = asset.src;
      break;
  } //end switch
};

AssetManager.prototype.loadAssets = function(callback) {
  console.log("Inside \"AssetManager.loadAssets()\".");
  var self = this;
  var counter = this.paths.length;
  var onload = function() {
    if (self.paths && this.attributes) {
      console.log("Loaded \""+this.attributes.src.value+"\".");
    }
    self.updateLoadingScreen(counter-1);
    //Let's catch for if we had NO objects, or just loaded them all
    if (counter == 0 || --counter == 0) {
      console.log("Loaded all assets.");
      self.assignAssets();
      self.resetLoadingScreen();
      callback();
    }
  };

  //If we already had NO objects, let's continue on
  if (counter == 0) {
    onload();
  }
  else {
    for(var i=0; i < this.paths.length; i++) {
      const path = this.paths[i];
      var fileExtension = path.match(/.+(\.\w+)/)[1];

      switch (fileExtension) {
        case ".jpg":
        case ".png":
          this.assets[path] = new Image();
          this.assets[path].addEventListener("load", onload);
          this.assets[path].src = path;
          break;
        case ".mp3":
          this.assets[path] = new Audio();
          this.assets[path].addEventListener("canplaythrough", onload);
          this.assets[path].src = path;
          this.assets[path].load();
          break;
      } //end switch
    } //end for
  } //end else
};

AssetManager.prototype.assignAssets = function() {
  for (var i in this.object) {
    var object = this.object[i];
    object.image = this.assets[object.image.attributes.src.value];
    if (object instanceof TileSheet) {
      object.addLevelMap(game.state.top().levelMap);
    }
  }
};

AssetManager.prototype.clearAssets = function() {
  this.paths = [];
  this.assets = {};
  this.object = {};
  this.audio = {};
};

AssetManager.prototype.initLoadingScreen = function(game) {
  var canvas = game.context.canvas;
  var loadingBarWidth = canvas.width*0.75;
  var loadingBarHeight = 25;
  this.gameContent.style.cssText = "position:relative;";
  this.loadingBar.style.cssText = "position:absolute;text-align:center;width: "+canvas.width*0.75+"px;height:"+loadingBarHeight+"px;background-color:lightgray;top:"+(canvas.height-loadingBarHeight)/2+"px;left:"+(canvas.width-loadingBarWidth)/2+"px;";
  this.loadedBar.style.cssText = "position:absolute;top:0;left:0;width: 0%;height:100%;background-color:rgba(255, 145, 48, 0.7)";
};

AssetManager.prototype.updateLoadingScreen = function(counter) {
  var assetsLoaded = this.paths.length - counter;
  var percentLoaded = Math.floor((assetsLoaded/this.paths.length)*100);

  //Set the width of the loaded bar back to 0
  this.loadedBar.style.cssText = this.loadedBar.style.cssText.replace(/width:\s*([\d]+)([\w*%]+)/, "width:"+percentLoaded+"$2");
};

AssetManager.prototype.resetLoadingScreen = function() {
  //Set the width of the loaded bar back to 0
  this.loadedBar.style.cssText = this.loadedBar.style.cssText.replace(/width:\s*([\d]+)([\w*%]+)/, "width:0$2");

  //Now hide the loading bar
  if (this.loadingBar.style.cssText.match(/display\s*:\s*(\w+)/)) {
    this.loadingBar.style.cssText.replace(/display\s*:\s*(\w+)/, "display:none");
  } else {
    this.loadingBar.style.cssText += "display:none;"
  }
};
