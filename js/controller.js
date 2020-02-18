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

    //Assure keys (specifically arrows) don't perform default behavior
    if (
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40
    ) {
      event.preventDefault();
    }

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
