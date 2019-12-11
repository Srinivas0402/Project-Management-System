var  mongoose    = require("mongoose");
 var coordinatorSchema= new mongoose.Schema({
 	facultynumber: String
 	
 });
  module.exports = mongoose.model("Coordinator", coordinatorSchema);