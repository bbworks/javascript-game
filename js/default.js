function Default () {
  ParentClass.call();

  //Declare public properties


  //Declare private constants and variables


  //Create functions that need to access private data as public functions


} //end constructor

Default.prototype = Object.create(ParentClass.prototype);

Default.prototype.constructor = Default;
