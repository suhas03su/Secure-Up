var mongoose	=	require('mongoose');
var bcrypt 		= 	require('bcryptjs');
var passportLocalMongoose = require("passport-local-mongoose");
var adminSchema = new mongoose.Schema({
	username: String,
	emailid: {type: String, unique: true},
	password: String,
	phonenumber: Number
});
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", adminSchema);