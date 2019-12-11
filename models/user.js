var  mongoose    = require("mongoose");
var passportlocalmongoose =require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
		empid:String,
		username:String,
		password:String
});
userSchema.plugin(passportlocalmongoose);
module.exports= mongoose.model("user",userSchema);