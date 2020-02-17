function NewState (canvas, context, audio, callback) {
  //Declare private constants and variables
  const stateName = "new";
  const gameObjectsInfo = [
    //{name:"object",type:"type",src:"src"}
  ];

  //Create functions that need to access private data as public functions

  //Call our parent constructor
  State.call(this, stateName, gameObjectsInfo, this.update, this.render, this.onEnter, this.onExit, callback);
} //end constructor

NewState.prototype = State.prototype;

NewState.prototype.constructor = {
  constructor: NewState,
  update: function() {},
  render: function() {},
  onEnter: function() {},
  onExit: function() {},
}
