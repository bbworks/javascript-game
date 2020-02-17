function Level1State (game, callback) {
  //Declare private constants and variables
  const stateName = "level1";
  const groundDepth = 35;
  const roadDepth = groundDepth/2;
  const treeDepth = groundDepth/3;
  const treeSeparation = 25;
  const cloudDepth = 15;
  const cloudSeparation = 25;
  const gameObjectsInfo = [
    //{name:"sky",type:"rectangle",style:"#18c9ff",x1:0,y1:0,x2:world.canvas.width,y2:world.canvas.height},
    //{name:"ground",type:"rectangle",style:"#209b45",x1:0,y1:world.canvas.height-groundDepth,x2:world.canvas.width,y2:world.canvas.height},
    //{name:"road",type:"rectangle",style:"#dacf33",x1:0,y1:world.canvas.height-roadDepth,x2:world.canvas.width,y2:world.canvas.height},
    {name:"tilesheet",type:"tilesheet",src:"assets/rabbit-trap.png"}, //https://raw.githubusercontent.com/pothonprogramming/pothonprogramming.github.io/master/content/rabbit-trap/rabbit-trap.png
    //{name:"enemy",type:"image",src:"https://art.pixilart.com/4905597645165ef.png"}, //"https://vectorskey.com/wp-content/uploads/2019/02/vector-illustration-car-automobile-clip-art-copy.png"
    {name:"player",type:"player",src:"assets/rabbit-trap.png"},
    //{name:"tree",type:"image",src:"https://external-preview.redd.it/F_If_-XcfBi0DkStwGndtl9yCrRFGN1APiTXoEtzDG4.png?auto=webp&s=b444f2782399ba6e4d3457b041cd6c78eba4feda"},
    //{name:"cloud",type:"image",src:"https://www.trzcacak.rs/myfile/full/39-395837_8-bit-clouds-png-circle.png"},
    {name:"level1Audio",type:"audio",src:"https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/sawsquarenoise/Towel_Defence_OST/sawsquarenoise_-_10_-_Towel_Defence_Ending.mp3"}
  ];
  const self = this;

  this.levelMap =
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "............................................."+"\r\n"+
  "........................#.............#......"+"\r\n"+
  ".....................................##......"+"\r\n"+
  "......................#.............###......"+"\r\n"+
  "....................#..............####......"+"\r\n"+
  "..................................#####......"+"\r\n"+
  ".................n...............######......"+"\r\n"+
  "________..___________________________________";

  //Create functions that need to access private data as public functions
  this.clear = function() {
    game.context.clearRect(0,0,game.context.canvas.width,game.context.canvas.height)
  };

  this.update = function() {
    for(var each in game.world.object) {
      //Update all objects
      game.world.object[each].update();

      //Now, let's update our viewport--scrolling the viewport as necessary
      //If we're hitting the left 200, stay left
      if (game.world.object.player.x < 200) {
        game.viewport.x = 0;
      }
      //If we're hitting the right 200, stay right
      else if (game.world.object.player.x > game.world.object.tilesheet.width-200) {
        game.viewport.x = game.world.object.tilesheet.width - game.viewport.width;
      }
      //Otherwise, scroll as necessary
      else {
        game.viewport.x = game.world.object.player.x - 200;
      }

      //If we go up too high, let's scroll up, otherwise stay at our base
      if (game.world.object.player.y <= 130) {
        game.viewport.y = game.world.object.player.y - 130;
      }
      else {
        game.viewport.y = game.viewport.baseY;
      }

      //Now, let's scroll all our objects as necessary
      game.world.object[each].scroll(game.viewport.x, game.viewport.y);
    }

    game.world.testCollision(game.world.object.player);
  };

  this.render = function() {
    this.clear();
    for(var each in game.world.object) {
      if (each != "player") {
        game.world.object[each].render();
      }
    };
    game.world.object.player.render();
  };

  this.onKeyDown = function(event) {
    if (event.keyCode == 80) {
      self.onExit();
      self.nextState = new PauseMenuState(game, callback);
    }
  }

  this.onEnter = function() {
    console.log("Inside \"Level1State.onEnter()\".");
    //Create the state-specific handlers
    document.addEventListener("keydown", this.onKeyDown);
  }

  State.call(this, stateName, gameObjectsInfo, this.update, this.render, this.onEnter, this.onExit, game, callback);
} //end constructor

Level1State.prototype = State.prototype;

Level1State.prototype = {
  constructor: Level1State,
  //onEnter: function() {},
  onExit: function() {},
}
