function StateStack(game) {
	var stack = [];

	this.top = function() {
	  var state = stack[stack.length-1];
	  return state;
	};
	this.push = function(state) {
	  game.stop();
	  stack.push(state);
	  state.onEnter();
	  state.loadAssets(); //because we start the engine on asset load, let's save that for LAST
	};
	this.pop = function() {
	  var poppedState = this.top();
	  poppedState.onExit();
	  stack.pop();
	  game.stop();

	  state = this.top();
	  state.nextState = null;
	  state.setupObjects(false);
	  game.start();

	};
	this.handleInput = function() {
	  var state = this.top();
	  state.handleInput();
	};
	this.update = function() {
	  var state = this.top();
	  state.update();
	};
	this.render = function() {
	  var state = this.top();
	  state.render();
	};
	this.getStack = function() {
	  return stack;
	};
	this.updateState = function() {
	  var state = this.top();
		if (state.nextState) {
			if (state.nextState === "pop") {
		    this.pop();
		  } else {
		    this.push(state.nextState)
		  }
		}
	};
} //end constructor

StateStack.prototype = {
	constructor: StateStack,
	top: this.top,
	push: this.push,
	pop: this.pop,
	update: this.update,
	render: this.render
};
