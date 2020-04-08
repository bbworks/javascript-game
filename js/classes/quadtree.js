function QuadTree(bounds, level) {
	//This is a data structure to be used for broad-phase
	// collision detection, that subdivides the screen into
	// four quadrants, placing objects into each quadrant,
	// and further subdividing each quadrant into quadrants
	// as more objects are added. The quadrants are as below:
	//   II  |   I
	//---------------
	//  III  |  IV

  const MAX_OBJECTS = 4;
	const MAX_LEVELS = 4;
	var level = level || 0;
	var bounds = bounds;
	var objects = [];
	var nodes = [];

	this.clear = function() {
		//Start by emptying our objects
		objects = [];

		//If we have child nodes, let's pass through them as well
		if (nodes[0]) {
			for(var i in nodes) {
				var node = nodes[i];
				node.clear();
			}
		}

		//Then, clear our children
		nodes = [];
	}

	this.split = function() {
    /*DEBUG*/ //console.log("quadtree.split()");
    //Let's find the half-width and height of this quadrant,
		// and separate it into 4 child quadrants 1 level deeper
		var halfWidth = bounds.width/2;
		var halfHeight = bounds.height/2;
		var x = bounds.x;
		var y = bounds.y;
		var nodeLevel = level+1;

		nodes[0] = new QuadTree(new Position(x+halfWidth, y, halfWidth, halfHeight), nodeLevel); //Quadrant I
		nodes[1] = new QuadTree(new Position(x, y, halfWidth, halfHeight), nodeLevel); //Quadrant II
		nodes[2] = new QuadTree(new Position(x, y+halfHeight, halfWidth, halfHeight), nodeLevel); //Quadrant III
		nodes[3] = new QuadTree(new Position(x+halfWidth, y+halfHeight, halfWidth, halfHeight), nodeLevel); //Quadrant IV
	}

	this.getIndex = function(object) {
    /*DEBUG*/ //console.log("quadtree.getIndex()");
    var index = -1;
		var horizontalMidpoint = bounds.x + bounds.height/2;
		var verticalMidpoint = bounds.y + bounds.width/2;

		var isTopQuadrant = object.position.getViewportBottom() < horizontalMidpoint;
		var isBottomQuadrant = object.position.getViewportTop() > horizontalMidpoint;
		var isLeftQuadrant = object.position.getViewportRight() < verticalMidpoint;
		var isRightQuadrant = object.position.getViewportLeft() > verticalMidpoint;

    /*DEBUG*/ //console.log(isTopQuadrant, isBottomQuadrant, isLeftQuadrant, isRightQuadrant);
		if (isTopQuadrant) {
			if (isRightQuadrant) {
				index = 0;
			} else if (isLeftQuadrant) {
				index = 1;
			}
		} else if (isBottomQuadrant) {
			if (isLeftQuadrant) {
				index = 2;
			} else if (isRightQuadrant) {
				index = 3;
			}
		}
		return index;
	}

	this.insert = function(object) {
    /*DEBUG*/ //console.log("quadtree.insert()");

    //First, check if this object is a container
    // if so, insert the container
    if (object instanceof Container) {
      this.insertContainer(object);
      return;
    }

    //First, check if we have child quadrants,
		// and that the object doesn't belong in them
		if (nodes[0]) {
			var index = this.getIndex(object);
			if (index !== -1) {
				nodes[index].insert(object);
				return;
			}
		}

		//If not, proceed to add to this node
		objects.push(object);

		//Now, let's make sure we didn't exceed our maximum objects
    // NOTE: If we hit our max levels, our last level will just have
    // as many objects as necessary
		if (objects.length > MAX_OBJECTS && level < MAX_LEVELS) {
			if (!nodes[0]) {
				this.split();
			}

			var i = 0;
			while (i < objects.length) {
				var object = objects[i];
				var index = this.getIndex(object);
				if (index != -1) {
          //Splice out the one object
          // NOTE: splice() returns an Array
          var splicedObject = objects.splice(i,1)[0];
					nodes[index].insert(splicedObject);
				}
				else {
					i++;
				}
			}
		}

	}

	this.insertContainer = function(container) {
    /*DEBUG*/ //console.log("quadtree.insertContainer()");

    for(var i in container.children) {
			var child = container.children[i];
			this.insert(child);
		}
	};

	this.retrieve = function(object) {
    /*DEBUG*/ //console.log("quadtree.retrieve()");
    var collidableObjects = objects.slice(); //slice() returns a new array ()

		//Check first if the object fits in any child quadrants
		if (nodes[0]) {
			var index = this.getIndex(object);

			//If it fits in one child quadrant, check it's child quadrants
			if (index !== -1) {
				var recursiveObjects = nodes[index].retrieve(object);
				for (var i in recursiveObjects) {
					var recursiveObject = recursiveObjects[i];
					collidableObjects.push(recursiveObject);
				}
			}
			//Otherwise, it could belong to any/all child quadrants, check them
			else {
				for (var i in nodes) {
					var node = nodes[i];
					var recursiveObjects = node.retrieve(object);
					for (var i in recursiveObjects) {
						var recursiveObject = recursiveObjects[i];
						collidableObjects.push(recursiveObject);
					}
				}
			}
		}
		return collidableObjects;
	}

  this.getObjects = function() {
    return objects;
  }

  this.getNodes = function() {
    return nodes;
  }

} //end Constructor

QuadTree.prototype.constructor = QuadTree;
