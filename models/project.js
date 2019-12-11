 var  mongoose    = require("mongoose");
 
 var projectSchema = new mongoose.Schema({
     title: String,
     briefdesc:String,
     compdesc:String,
     student:String,
     author:{
     	id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
 });

 module.exports = mongoose.model("project", projectSchema);