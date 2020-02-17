function MainMenuState (game, callback) {
  //Declare private constants and variables
  const title = "8Bit-venture";
  const subtitle = "Click to begin";

  const stateName = "mainMenu";
  const gameplayAudioUrl = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/sawsquarenoise/Towel_Defence_OST/sawsquarenoise_-_10_-_Towel_Defence_Ending.mp3";
  const gameObjectsInfo = [
    {name:"startScreenImage",type:"image",src:"https://image.shutterstock.com/image-vector/pixel-art-seamless-background-location-260nw-721777879.jpg"},
    {name:"startScreenAudio",type:"audio",src:"https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Rolemusic/Rolemusic_-_Singles/Rolemusic_-_Omou_matsu.mp3"}
  ];
  const self = this;

  //Create functions that need to access private data as public functions
  this.render = function() {
    //Draw the start screen background
    game.context.globalAlpha = 0.9;
    game.context.drawImage(game.world.object.startScreenImage.image,0,0,game.context.canvas.width, game.context.canvas.height);
    game.context.globalAlpha = 1;

    //Draw the title
    game.context.fillStyle = "white";
    game.context.font = '48px monospace';
    var fontMeasurement = game.context.measureText(title);
    game.context.fillText(title,(game.context.canvas.width-fontMeasurement.width)/2,130);

    //Draw the subtitle
    game.context.fillStyle = "white";
    game.context.font = '22px monospace';
    var fontMeasurement = game.context.measureText(subtitle);
    game.context.fillText(subtitle,(game.context.canvas.width-fontMeasurement.width)/2,153);
  }

  this.onClick = function(event) {
    //Change game audio
    //currentAudio.pause();
    //currentAudio = new Sound(gameplayAudioUrl);
    self.onExit();
    self.nextState = new Level1State(game, callback);
  }

  this.onEnter = function() {
    console.log("Inside \"MainMenuState.onEnter()\".");
    //Create the state-specific handlers
    game.context.canvas.addEventListener("click", this.onClick);
  }

  this.onExit = function() {
    console.log("Inside \"MainMenuState.onExit()\".");
    //Clear the state-specific handlers
    game.context.canvas.removeEventListener("click", this.onClick);
  }

  //Call our parent constructor
  State.call(this, stateName, gameObjectsInfo, this.update, this.render, this.onEnter, this.onExit, game, callback);

  //Any leftovers..
  //world.audio.src = self.object.startScreenAudio.src;

  /*var request = new XMLHttpRequest();
  request.open("GET", "./js/assets/mainMenuState.json", false);
  request.send(null)
  var test = JSON.parse(request.responseText);*/
} //end constructor

MainMenuState.prototype = State.prototype;

//MainMenuState.prototype.constructor = MainMenuState;

MainMenuState.prototype = {
  constructor: MainMenuState,
  update: function() {},
}
