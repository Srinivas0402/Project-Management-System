var  mongoose    = require("mongoose");
 var facultySchema= new mongoose.Schema({
 	facultynumber: String
 	
 });
  module.exports = mongoose.model("Faculty", facultySchema);