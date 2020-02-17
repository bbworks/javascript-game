function Controller () {
  //Declare private constants and variables

  //Declare public variables
  this.left = false;
  this.up = false;
  this.right = false;
  this.down = false;

  //Declare private variables
  const self = this;

  //Create functions that need to access private data as public functions
  this.handleKeyDownUp = function(event) {
    var down = (event.type == "keydown") ? true : false;

    switch (event.keyCode)
    {
      case 37:
        self.left = down;
        break;
      case 38:
        self.up = down;
        break;
      case 39:
        self.right = down;
        break;
      case 40:
        self.down = down;
        break;
    }
    /*DEBUG*/ //console.log(`${self.left} ${self.up} ${self.right} ${self.down} `);
    /*DEBUG*/ //console.log(`${event.type} ${event.keyCode} ${down}`);
  }
} //end constructor

Controller.prototype = {
  constructor: Controller
}
