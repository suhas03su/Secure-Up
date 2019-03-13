var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var teacherSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	tfname: String,
	tlname: String,
	college: String,
	emailid:{type: String, unique: true},
	phonenumber:{type: Number, unique: true},
	password: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});
teacherSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Teacher", teacherSchema);