var express				=	require('express');
var router				=	express.Router();
var User				=	require('../models/user');
var FPaper				=	require('../models/fpaper');
var passport 			=	require('passport');
var userAuth 			= 	new passport.Passport();
var LocalStrategy		=	require('passport-local').Strategy;
var nodemailer			=	require('nodemailer');
var readline			=	require('readline');
var flag				=	0;
var ffa1,ffb1,ffc1,ffd1,ffa2,ffb2,ffc2,ffd2,ffa3,ffb3,ffc3,ffd3,ffa4,ffb4,ffc4,ffd4,ffa5,ffb5,ffc5,ffd5;
var client 				=	require('twilio')('ACb0aa49c5f893e6f806ed99b6a2ec90ff','934c60dc9d105a303996ef1276140e8b');
var crypto				=	require('crypto');
var moment 				= 	require('moment');
var readline				=	require('readline');
var time;
var f1,f2,f3;
var otp;
var subject1;
var async		=	require('async');
var detail;
var count;
var eagain;
var request = require('request');
var yargs	=	require('yargs');
var date;
var present;
var report;
var nullpattern = /^NA[0-9]{3}$/;
var uidpattern = /^UID[0-9]{3}$/;
var timeToDecrypt;
var endDecrypt;
var key = "gasfhksagflAGf%258925%";

userAuth.use(new LocalStrategy(User.authenticate()));
userAuth.serializeUser(User.serializeUser());
userAuth.deserializeUser(User.deserializeUser());

function ensureAuthenticated(req, res, next){
	if(flag == 1)
	{
		return next();
	}
	else
	{
		req.flash('error', 'You have to be logged in. Use the credemtials and log in.');
		res.redirect('/users/login');
	}
}


router.get('/register', function(req, res){
	res.render('Uregister');
});

router.post('/register', function(req, res){
	var num = Math.floor(Math.random() * (999-100) + 100);
		var newUser = new User({
			username: "NA" + num,
			ufname: req.body.fname,
			ulname: req.body.lname,
			college: req.body.college,
			emailid: req.body.emailid,
			phonenumber: req.body.pno
		});
		User.register(newUser, req.body.password, function(err, newUser) {
			if(err) {
				req.flash('error_msg', err.message);
				console.log(err);
				return res.redirect('/users/register');
			}
			else
			{
				req.flash('success', 'Registration Successful. Use the credentials once you receive and log in..');
				res.redirect('/users/login');
			
			}
	});
});

router.get('/login', function(req, res){
	res.render('ulogin');
});

router.post('/login', function(req, res){
	detail = req.body.emailid;
	User.findOne({emailid: req.body.emailid}, function(err, user){
		if (!user) {
					req.flash('error', 'No account with that email address exists.');
					console.log("No account with that email address exists.");
					return res.redirect('/users/login');
				}
 	if(user.username.match(nullpattern))
 	{
 		var smtpTransport = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					},
 					tls: {
 						rejectUnauthorized: false 
 					}
 				});
 				var mailOptions = {
 					to: user.emailid,
 					from: 'secure.up.rear@gmail.com',
 					subject: 'OTP',
 					text: 'Hello, '+ user.emailid + '\n\n' +
 						  'Sorry your account has not been activated yet'
 				};
 				 				 						client.messages.create({
	to: '+91'+ user.phonenumber,
	from: '+12015652472',
	body: 'Sorry your account has not been activated yet'
}, function(err, data){
	if(err)
		console.log(err);
	else
		console.log(data);
});
 				smtpTransport.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
				console.log("The mail was sent");
 				});
 				
 				req.flash('error', 'Sorry your account has not been activated yet');
				res.render('ulogin');
	}
	else
	{
		var smtpTransport = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					},
 					tls: {
 						rejectUnauthorized: false 
 					}
 				});
				var num = Math.floor(Math.random() * (999-100) + 100);
 				var mailOptions = {
 					to: user.emailid,
 					from: 'secure.up.rear@gmail.com',
 					subject: 'OTP',
 					text: 'Hello, '+ user.emailid + '\n\n' +
 						  'Use the UID "' + user.username + '" and OTP provided to login ' + num + '.'
 				};
 				 						client.messages.create({
	to: '+91'+ user.phonenumber,
	from: '+12015652472',
	body: 'Use the UID "' + user.username + '" and OTP ' + num +' to login .'
}, function(err, data){
	if(err)
		console.log(err);
	else
		console.log(data);
});
 				smtpTransport.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
				console.log("The mail was sent");
 				console.log(user.username);
 				});
 				otp = num;
				console.log(otp);
				res.render('otpupage');
	}
 if(err)
 {
 	console.log(err);
 }
 });
});

router.get('/OTP', function(req, res){
	res.render('otpupage');
});

router.post('/OTP', function(req, res, next) {
	userAuth.authenticate('local', function(err, user, info) {
		if (err) { 
			req.flash('error', err.message);
			return next(err); 
		}
		if (!user) {
			console.log(err);
			console.log("Not happening");
			return res.redirect('/users/login'); 
		}

		//OTP verification
			var num1 = req.body.num
			if(num1 == otp)
			{
			req.logIn(user, function(err) {
		 	if (err) { 
		 		return next(err); 
		 			 }
		 	else
		 	{		 
		 	  var num = Math.floor(Math.random() * (999-100) + 100);
			  User.updateOne({username:user.username}, {username: "UID"+num}, function(err){
			 			if(err)
			 			{
			 				console.log("Couldnt Update TID");
			 			}
			 			else
			 			{
			 				console.log("Updated TID");
			 			}
			 });
			flag = 1;
		 	req.flash('success', 'Welcome back, ' + user.username);
		  	res.redirect('/users/home');
		  	}
			});
			
		}
		else
		{
			req.flash("error", "Couldnt authenticate, please Retry!");
			res.redirect("/users/login");
		}
	})(req, res, next);
});

//forgot password
router.get('/forgot', function(req, res) {
	res.render('uforgot');
});

router.post('/forgot', function(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ emailid: req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					console.log("No account with that email address exists.");
					return res.redirect('/users/login');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail', 
				auth: {
					user: 'secure.up.rear@gmail.com',
					pass: 'Rsss@2018'
				}
			});
			var mailOptions = {
				to: user.emailid,
				from: 'secure.up.rear@gmail.com',
				subject: 'SecureUP Password Reset Request',
				text:'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/users/reset/' + token + '\n\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'An e-mail has been sent to ' + user.emailid + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/users/login');
	});
});

router.get('/reset/:token', function(req, res) {
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }}, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired');
			return res.redirect('/users/forgot');
		}
		res.render('ureset', {token: req.params.token});
	});
});


router.post('/reset/:token', function(req, res) {
	async.waterfall([
		function(done) {
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }}, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired');
					return res.redirect('back');
				}
				if (req.body.password === req.body.confirmPassword) {
					user.setPassword(req.body.password, function(err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;
						
						user.save(function(err) {
							req.logIn(user, function(err) {
								done(err, user);
							});
						});		
					});
				} else {
					req.flash('error', 'Passwords do not match');
					return res.redirect('back');
				}
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'secure.up.rear@gmail.com',
					pass: 'Rsss@2018'
				}
			});
			var mailOptions = {
				to: user.emailid,
				from: 'secure.up.rear@gmail.com',
				subject: 'Your SecureUP account password has been changed',
				text: 'Hello,\n\n' +
					  'This is a confirmation that the password for your account at SecureUP has just been changed.'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Password successfully changed');
				done(err);
			});
		}	
	],
	function(err) {
		res.redirect('/users/login');
	});
});

router.get('/home', ensureAuthenticated, function(req, res){
		User.find({emailid: detail}, function(err,details){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('user/home', {details: details});
		}
	})
});
router.post('/home', ensureAuthenticated, function(req, res){

			subject1 = req.body.sub;
			console.log(subject1);
			FPaper.findOne({username: subject1}, function(err, paper){
				if (!paper) {
					req.flash('error', 'No paper with that subject name exists.');
					console.log("No paper with that subject name exists.");
					return res.redirect('/users/home');
				}
				ffa1	=	paper.a1;
				ffb1	=	paper.b1;
				ffc1	=	paper.c1;
				ffd1	=	paper.d1;
				ffa2	=	paper.a2;
				ffb2	=	paper.b2;
				ffc2	=	paper.c2;
				ffd2	=	paper.d2;
				ffa3	=	paper.a3;
				ffb3	=	paper.b3;
				ffc3	=	paper.c3;
				ffd3	=	paper.d3;
				ffa4	=	paper.a4;
				ffb4	=	paper.b4;
				ffc4	=	paper.c4;
				ffd4	=	paper.d4;
				ffa5	=	paper.a5;
				ffb5	=	paper.b5;
				ffc5	=	paper.c5;
				ffd5	=	paper.d5;
				f1 = paper.hh; 
				f2 = paper.mm;
				f3 = paper.ss;
				date = paper.d;
				timeToDecrypt = paper.key;
				res.redirect('/users/questionpaper');
			// var key = "gasfhksagflAGf%258925%";
			
			// console.log(aa1);
		});

			
		//res.redirect('/users/questionpaper');
			
});
router.get('/questionpaper', ensureAuthenticated, function(req, res){
			console.log(date);
			var pre = new Date();
	    	present = pre.toString();
	    	console.log(present);
	 		var t1 = moment().format('hh');
			var t2 = moment().format('mm');
			var deadline1;
			var deadline2;
			var deadline3;
			var deadline4;
			var temp1;
			var temp2;
			var temp3;
			var temp4;
			var data1;
			var data2;
			var data3;
			var data4;
			var buffer1  = 15;
			var buffer2 = 30;
			var buffer3 = 30;
			var buffer4 = 45;
// rear technology
// 15 mins before
data1 = new Date(date);
temp1 = data1;
var startdate1 = new Date(data1);
startdate1.setMinutes(temp1.getMinutes() - buffer1);
deadline1 = startdate1.toString();
// 30 mins before
data2 = new Date(date);
temp2 = data2;
var startdate2 = new Date(data2);
startdate2.setMinutes(temp2.getMinutes() - buffer2);
deadline2 = startdate2.toString();
// 30 mins after
data3 = new Date(date);
temp3 = data3;
var startdate3 = new Date(data3);
startdate3.setMinutes(temp3.getMinutes() + buffer3);
deadline3 = startdate3.toString();
// 45 mins after
data4 = new Date(date);
temp4 = data4;
var startdate4 = new Date(data4);
startdate4.setMinutes(temp4.getMinutes() + buffer4);
deadline4 = startdate4.toString();

//report
var pre = new Date(present);
var dat = new Date(date);
var presenttodate = pre.toLocaleDateString();
var datetodate = dat.toLocaleDateString();
console.log(presenttodate);
console.log(datetodate);

// end of rear


			var efa1	= ffa1;
			var efb1	= ffb1;
			var efc1	= ffc1;
			var efd1	= ffd1;
			var efa2	= ffa2;
			var efb2	= ffb2;
			var efc2	= ffc2;
			var efd2	= ffd2;
			var efa3	= ffa3;
			var efb3	= ffb3;
			var efc3	= ffc3;
			var efd3	= ffd3;
			var efa4	= ffa4;
			var efb4	= ffb4;
			var efc4	= ffc4;
			var efd4	= ffd4;
			var efa5	= ffa5;
			var efb5	= ffb5;
			var efc5	= ffc5;
			var efd5	= ffd5;
			//level 1 decription
	 		
	 		console.log(ffa1);
	 		console.log(ffb1);
	 		console.log(ffc1);
	 		console.log(ffd1);
	 		console.log(ffa2);
	 		console.log(ffb2);
	 		console.log(ffc2);
	 		console.log(ffd2);
	 		console.log(ffa3);
	 		console.log(ffb3);
	 		console.log(ffc3);
	 		console.log(ffd3);
	 		console.log(ffa4);
	 		console.log(ffb4);
	 		console.log(ffc4);
	 		console.log(ffd4);
	 		console.log(ffa5);
	 		console.log(ffb5);
	 		console.log(ffc5);
	 		console.log(ffd5);
 			// var aa1	= crypto.createDecipher("aes-256-ctr", key).update(ffa1, "hex", "utf-8");
 			// var bb1	= crypto.createDecipher("aes-256-ctr", key).update(ffb1, "hex", "utf-8");
 			// var cc1	= crypto.createDecipher("aes-256-ctr", key).update(ffc1, "hex", "utf-8");
 			// var dd1	= crypto.createDecipher("aes-256-ctr", key).update(ffd1, "hex", "utf-8");
 			// var aa2	= crypto.createDecipher("aes-256-ctr", key).update(ffa2, "hex", "utf-8");
 			// var bb2	= crypto.createDecipher("aes-256-ctr", key).update(ffb2, "hex", "utf-8");
 			// var cc2	= crypto.createDecipher("aes-256-ctr", key).update(ffc2, "hex", "utf-8");
 			// var dd2	= crypto.createDecipher("aes-256-ctr", key).update(ffd2, "hex", "utf-8");
 			// var aa3	= crypto.createDecipher("aes-256-ctr", key).update(ffa3, "hex", "utf-8");
 			// var bb3	= crypto.createDecipher("aes-256-ctr", key).update(ffb3, "hex", "utf-8");
 			// var cc3	= crypto.createDecipher("aes-256-ctr", key).update(ffc3, "hex", "utf-8");
 			// var dd3	= crypto.createDecipher("aes-256-ctr", key).update(ffd3, "hex", "utf-8");
 			// var aa4	= crypto.createDecipher("aes-256-ctr", key).update(ffa4, "hex", "utf-8");
 			// var bb4	= crypto.createDecipher("aes-256-ctr", key).update(ffb4, "hex", "utf-8");
 			// var cc4	= crypto.createDecipher("aes-256-ctr", key).update(ffc4, "hex", "utf-8");
 			// var dd4	= crypto.createDecipher("aes-256-ctr", key).update(ffd4, "hex", "utf-8");
 			// var aa5	= crypto.createDecipher("aes-256-ctr", key).update(ffa5, "hex", "utf-8");
 			// var bb5	= crypto.createDecipher("aes-256-ctr", key).update(ffb5, "hex", "utf-8");
 			// var cc5	= crypto.createDecipher("aes-256-ctr", key).update(ffc5, "hex", "utf-8");
 			// var dd5	= crypto.createDecipher("aes-256-ctr", key).update(ffd5, "hex", "utf-8");
 			//Re encryption
 		// 	var rfa1	=   crypto.createCipher("aes-256-ctr", key).update(aa1, "utf-8", "hex");
			// var rfb1	= 	crypto.createCipher("aes-256-ctr", key).update(bb1, "utf-8", "hex");
			// var rfc1	= 	crypto.createCipher("aes-256-ctr", key).update(cc1, "utf-8", "hex");
			// var rfd1	= 	crypto.createCipher("aes-256-ctr", key).update(dd1, "utf-8", "hex");
			// var rfa2	= 	crypto.createCipher("aes-256-ctr", key).update(aa2, "utf-8", "hex");
			// var rfb2	= 	crypto.createCipher("aes-256-ctr", key).update(bb2, "utf-8", "hex");
			// var rfc2	= 	crypto.createCipher("aes-256-ctr", key).update(cc2, "utf-8", "hex");
			// var rfd2	= 	crypto.createCipher("aes-256-ctr", key).update(dd2, "utf-8", "hex");
			// var rfa3	= 	crypto.createCipher("aes-256-ctr", key).update(aa3, "utf-8", "hex");
			// var rfb3	= 	crypto.createCipher("aes-256-ctr", key).update(bb3, "utf-8", "hex");
			// var rfc3	= 	crypto.createCipher("aes-256-ctr", key).update(cc3, "utf-8", "hex");
			// var rfd3	= 	crypto.createCipher("aes-256-ctr", key).update(dd3, "utf-8", "hex");
			// var rfa4	= 	crypto.createCipher("aes-256-ctr", key).update(aa4, "utf-8", "hex");
			// var rfb4	= 	crypto.createCipher("aes-256-ctr", key).update(bb4, "utf-8", "hex");
			// var rfc4	= 	crypto.createCipher("aes-256-ctr", key).update(cc4, "utf-8", "hex");
			// var rfd4	= 	crypto.createCipher("aes-256-ctr", key).update(dd4, "utf-8", "hex");
			// var rfa5	= 	crypto.createCipher("aes-256-ctr", key).update(aa5, "utf-8", "hex");
			// var rfb5	= 	crypto.createCipher("aes-256-ctr", key).update(bb5, "utf-8", "hex");
			// var rfc5	= 	crypto.createCipher("aes-256-ctr", key).update(cc5, "utf-8", "hex");
			// var rfd5	= 	crypto.createCipher("aes-256-ctr", key).update(dd5, "utf-8", "hex");
			//Re Decrypt
			if(timeToDecrypt == 0)
			{
			 fa1	= crypto.createDecipher("aes-256-ctr", key).update(ffa1, "hex", "utf-8");
 			 fb1	= crypto.createDecipher("aes-256-ctr", key).update(ffb1, "hex", "utf-8");
 			 fc1	= crypto.createDecipher("aes-256-ctr", key).update(ffc1, "hex", "utf-8");
 			 fd1	= crypto.createDecipher("aes-256-ctr", key).update(ffd1, "hex", "utf-8");
 			 fa2	= crypto.createDecipher("aes-256-ctr", key).update(ffa2, "hex", "utf-8");
 			 fb2	= crypto.createDecipher("aes-256-ctr", key).update(ffb2, "hex", "utf-8");
 			 fc2	= crypto.createDecipher("aes-256-ctr", key).update(ffc2, "hex", "utf-8");
 			 fd2	= crypto.createDecipher("aes-256-ctr", key).update(ffd2, "hex", "utf-8");
 			 fa3	= crypto.createDecipher("aes-256-ctr", key).update(ffa3, "hex", "utf-8");
 			 fb3	= crypto.createDecipher("aes-256-ctr", key).update(ffb3, "hex", "utf-8");
 			 fc3	= crypto.createDecipher("aes-256-ctr", key).update(ffc3, "hex", "utf-8");
 			 fd3	= crypto.createDecipher("aes-256-ctr", key).update(ffd3, "hex", "utf-8");
 			 fa4	= crypto.createDecipher("aes-256-ctr", key).update(ffa4, "hex", "utf-8");
 			 fb4	= crypto.createDecipher("aes-256-ctr", key).update(ffb4, "hex", "utf-8");
 			 fc4	= crypto.createDecipher("aes-256-ctr", key).update(ffc4, "hex", "utf-8");
 			 fd4	= crypto.createDecipher("aes-256-ctr", key).update(ffd4, "hex", "utf-8");
 			 fa5	= crypto.createDecipher("aes-256-ctr", key).update(ffa5, "hex", "utf-8");
 			 fb5	= crypto.createDecipher("aes-256-ctr", key).update(ffb5, "hex", "utf-8");
 			 fc5	= crypto.createDecipher("aes-256-ctr", key).update(ffc5, "hex", "utf-8");
 			 fd5	= crypto.createDecipher("aes-256-ctr", key).update(ffd5, "hex", "utf-8");
 			 timeToDecrypt = 1;
 			}

 			// if(((t1==f1)&&(t2>=f2))||(t1>f1))
 			if((present>date)&&(presenttodate>=datetodate))
 			{
 				endDecrypt=1;
 			FPaper.updateOne({username: subject1}, {a1: fa1}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {b1: fb1}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {c1: fc1}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {d1: fd1}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {a2: fa2}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {b2: fb2}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {c2: fc2}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {d2: fd2}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {a3: fa3}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {b3: fb3}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {c3: fc3}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});

 			FPaper.updateOne({username: subject1}, {d3: fd3}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});

 			FPaper.updateOne({username: subject1}, {a4: fa4}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {b4: fb4}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {c4: fc4}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {d4: fd4}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});

 			FPaper.updateOne({username: subject1}, {a5: fa5}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});

 			FPaper.updateOne({username: subject1}, {b5: fb5}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {c5: fc5}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {d5: fd5}, function(err){
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			FPaper.updateOne({username: subject1}, {key: timeToDecrypt}, function(err){
 				endDecrypt=0;
 				if(err)
 				{
 					console.log(err);
 				}
 				else
 				{
 					console.log("Successful");
 				}
 			});
 			endDecrypt=0;
 			if(endDecrypt==0)
 			{
	FPaper.find({username: subject1}, function(err,papers){
		console.log(papers);
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('user/fpaper', {papers: papers});
		 	// FPaper.updateOne({username: subject1}, {a1: efa1}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {b1: efb1}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {c1: efc1}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {d1: efd1}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {a2: efa2}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {b2: efb2}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {c2: efc2}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {d2: efd2}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {a3: efa3}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {b3: efb3}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {c3: efc3}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });

 			// FPaper.updateOne({username: subject1}, {d3: efd3}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });

 			// FPaper.updateOne({username: subject1}, {a4: efa4}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {b4: efb4}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {c4: efc4}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {d4: fd4}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });

 			// FPaper.updateOne({username: subject1}, {a5: efa5}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });

 			// FPaper.updateOne({username: subject1}, {b5: efb5}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {c5: efc5}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });
 			// FPaper.updateOne({username: subject1}, {d5: efd5}, function(err){
 			// 	if(err)
 			// 	{
 			// 		console.log(err);
 			// 	}
 			// 	else
 			// 	{
 			// 		console.log("Successful");
 			// 	}
 			// });

		}

	});
}
	
}
else if((present>deadline1) && (present<date) &&(presenttodate>=datetodate))
{
	FPaper.find({username: subject1}, function(err,papers){
		console.log(papers);
		if(err)
		{
			console.log(err);
		}
		else
		{console.log("cought you");
	var URL = "https://www.ipapi.co/json";
			var argv = yargs.options({
					ip: {
						describe: 'IP Address to which you want to find location',
						alias: 'i',
						string: true
					}
				});
				yargs.help()
				yargs.alias('help', 'h')
				.argv;

			request({
				url: URL,
				json: true
			}, function(err, res, body){
				if(!err && res.statusCode == 200)
				{	report = body;
					console.log(body);
				}
			});
			console.log(URL);
			var smtpTransport1 = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					}
 				});
 				var mailOptions = {
 					to: 'rakshith1223@gmail.com',
 					from: 'secure.up.rear@gmail.com',
 					subject: 'Intruder Alert',
 					text: 'Hello, Admin \n' + 'There was an intruder trying to download the file before the stipulated time.\n'+'The details are as follows\n'+ 'click on the link ' + URL +'\n\n Take Action Immediately\n\n Thank you.'
 				};
 				smtpTransport1.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
				console.log("The mail was sent");
 				});
			res.render('user/fpaper', {papers: papers});
		}
	});
}
else if((present>deadline2) && (present<deadline1) &&(presenttodate>=datetodate))
{
FPaper.find({username: subject1}, function(err,papers){
		console.log(papers);
		if(err)
		{
			console.log(err);
		}
		else
		{console.log("cought you criminal");
	var URL = "https://www.ipapi.co/json";
			var argv = yargs.options({
					ip: {
						describe: 'IP Address to which you want to find location',
						alias: 'i',
						string: true
					}
				});
				yargs.help()
				yargs.alias('help', 'h')
				.argv;

			request({
				url: URL,
				json: true
			}, function(err, res, body){
				if(!err && res.statusCode == 200)
				{	report = body;
					console.log(body);
				}
			});
			console.log(URL);
	var smtpTransport1 = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					}
 				});
 				var mailOptions = {
 					to: 'rakshith1223@gmail.com',
 					from: 'secure.up.rear@gmail.com',
 					subject: 'Intruder Alert',
 					text: 'Hello, Admin \n' + 'There was an intruder trying to access the files way before the time.\n'+'The details are as follows\n'+ 'click on the link ' + URL +'\n\n Take Action Immediately\n\n Thank you.'
 				};
 				smtpTransport1.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
				console.log("The mail was sent");
 				});
			res.render('user/fpaper', {papers: papers});
		}
	});
}
else
{
FPaper.find({username: subject1}, function(err,papers){
		console.log(papers);
		if(err)
		{
			console.log(err);
		}
		else
		{ console.log("cought you criminal ass");
	var URL = "https://www.ipapi.co/json";
			var argv = yargs.options({
					ip: {
						describe: 'IP Address to which you want to find location',
						alias: 'i',
						string: true
					}
				});
				yargs.help()
				yargs.alias('help', 'h')
				.argv;

			request({
				url: URL,
				json: true
			}, function(err, res, body){
				if(!err && res.statusCode == 200)
				{	report = body;
					console.log(body);
				}
			});
			console.log(URL);
	var smtpTransport1 = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					}
 				});
 				var mailOptions = {
 					to: 'rakshith1223@gmail.com',
 					from: 'secure.up.rear@gmail.com',
 					subject: 'Intruder Alert',
 					text: 'Hello, Admin \n' + 'There was an intruder.\n'+'The details are as follows\n'+ 'click on the link ' + URL +'\n\n Take Action Immediately\n\n Thank you.'
 				};
 				smtpTransport1.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
				console.log("The mail was sent");
 				});
			res.render('user/fpaper', {papers: papers});
		}
	});
}
});


router.get('/logout', function(req, res) {
	req.logout();
	flag = 0;
	req.flash('success', 'Successfully logged out.');
	res.redirect('/homes');
});

//date logic
// var d = new Date();
//     var n = d.toString();
//     console.log(n);
//     var x = n;
//     var y = n;
//     var w = d;
//     var z = d;
//     var a = d - 3600000;
//     var b = a.toString();
//     console.log(d);
//  var todate;
//  var totime;

// todate = d.toLocaleDateString();
// totime = d.toLocaleTimeString();
// console.log(todate);
// console.log(totime);
// var temp = totime.toString();
// var temp1 = todate.toString();
// console.log(temp);
// console.log(temp1);

// var endDate = d;
// var end = d;
// var startdate = new Date(d);
// var start = new Date(d);
// var durationInMinutes = 15;
// var cunt = new Date(y);
// console.log(cunt);

// cunt2.setMinutes(.getMinutes() - durationInMinutes);
// startdate.setMinutes(endDate.getMinutes() - durationInMinutes);
// start.setMinutes(end.getMinutes() + durationInMinutes);
// var temp2= cunt2.toString();

// console.log(temp2);





module.exports	=	router; 