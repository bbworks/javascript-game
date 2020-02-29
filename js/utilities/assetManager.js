function AssetManager (game) {
  //Declare public properties
  this.paths = [];
  this.assets = {};
  this.object = {};
  this.audio = {};
  //this.successAssets;
  //this.errorAssets;

  //Declare private constants and variables

  //Create functions that need to access private data as public functions

} //end constructor

AssetManager.prototype.constructor = {
  constructor: AssetManager
};

AssetManager.prototype.addAsset = function(asset) {
  this.paths.push(asset.src);
  this.createObject(asset);
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
      this.object[asset.name] = new Enemy(200, /*game.context.canvas.height-24-16-1*/ 279, 20, 24, 0.7, game);
      this.object[asset.name].image.src = asset.src;
      break;
    case "coin":
      this.object[asset.name] = new Image();
      this.object[asset.name].image = new Image();
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
    console.log("Loaded \""+this.attributes.src.value+"\".");
    //Let's catch for if we had NO objects, or just loaded them all
    if (counter == 0 || --counter == 0) {
      console.log("Loaded all assets.");
      self.assignAssets();
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
      var fileExtension = path.match(/.+(?<extension>\.\w+)/).groups.extension;

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
    if (object.__proto__.constructor == TileSheet) {
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
