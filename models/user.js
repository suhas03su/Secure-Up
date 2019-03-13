var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	ufname: String,
	ulname: String,
	college: {type: String, unique: true},
	emailid: {type: String, unique: true},
	phonenumber: {type: Number, unique: true},
	password: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);