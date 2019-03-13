 var express				=	require('express');
var router				=	express.Router();
var Teacher				=	require('../models/teacher');
var QPaper				=	require('../models/qpaper');
var passport 			=	require('passport');
var teacherAuth 		= 	new passport.Passport();
var LocalStrategy		=	require('passport-local').Strategy;
var nodemailer			=	require('nodemailer');
var readline			=	require('readline');
var flag				=	0;
var client 				=	require('twilio')('ACb0aa49c5f893e6f806ed99b6a2ec90ff','934c60dc9d105a303996ef1276140e8b');
var detail;
var otp;
var async		=	require('async');
var crypto 		=	require('crypto');
var Tname;
var Temail;
var Tcollege;
	var tidpattern = /^TID[0-9]{3}$/; 
	var nullpattern = /^NA[0-9]{3}$/;
teacherAuth.use(new LocalStrategy(Teacher.authenticate()));
teacherAuth.serializeUser(Teacher.serializeUser());
teacherAuth.deserializeUser(Teacher.deserializeUser());
function ensureAuthenticated(req, res, next){
	if(flag == 1)
	{
		return next();
	}
	else
	{
		req.flash('error', 'You have to be logged in. Use the credentials and log in.');
		res.redirect('/teachers/login');
	}
}


router.get('/register', function(req, res){
	res.render('tsignup');
});

router.post('/register', function(req, res){ 
	var num = Math.floor(Math.random() * (999-100) + 100);
		var newUser = new Teacher({
			username: "NA"+num,
			tfname: req.body.fname,
			tlname: req.body.lname,
			emailid: req.body.emailid,
			college: req.body.college,
			phonenumber: req.body.pno
		});
		Teacher.register(newUser, req.body.password, function(err, newUser) {
			if(err) {
				req.flash('error', err.message);
				console.log(err);
				return res.redirect('/teachers/register');
			}
			else
			{
				req.flash('success', 'Registration Successful.');
				res.redirect('/teachers/login');
			}
	});
});

router.get('/login', function(req, res){
	res.render('tlogin');
});

router.post('/login', function(req, res){
	detail = req.body.emailid;
 	Teacher.findOne({emailid: req.body.emailid}, function(err, user){
 		if (!user) {
					req.flash('error', 'No account with that email address exists.');
					console.log("No account with that email address exists.");
					return res.redirect('/teachers/login');
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
				res.render('tlogin');
				
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
 						  'Use the TID "' + user.username + '" and OTP provided to login ' + num + '.'
 				};
 						client.messages.create({
	to: '+91'+ user.phonenumber,
	from: '+12015652472',
	body: 'Use the TID "' + user.username + '" and OTP ' + num +' to login .'
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
				res.render('otppage');
	}
 if(err)
 {
 	console.log(err);
 }
 });
});


router.get('/OTP', function(req, res){
	res.render('otppage');
});


router.post('/OTP', function(req, res, next) {
	teacherAuth.authenticate('local', function(err, user, info) {
		if (err) { 
			req.flash('error', err.message);
			return next(err); 
		}
		if (!user) {
			console.log(err);
			console.log("Not happening");
			return res.redirect('/teachers/login'); 
		}

		//OTP verification
		//var prompts	=	readline.createInterface(process.stdin, process.stdout);
		//prompts.question("Enter the OTP", function(subject){
			
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
		 	  Teacher.updateOne({username:user.username}, {username: "TID"+num}, function(err){
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
			Tname = user.tfname;
			Temail = user.emailid;
			Tcollege = user.college;
		  	req.flash('success', 'Welcome back, ' + user.username);

		   	res.redirect('/teachers/home');
		   	}
		 	});
		 	subject = "";
		 }
		 else
		 {
		 	req.flash("error", "Couldnt authenticate, please Retry!");
		 	res.redirect("/teachers/login");
		 }
	//});
	})(req, res, next);
});
//forgot password
router.get('/forgot', function(req, res) {
	res.render('forgot');
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
			Teacher.findOne({ emailid: req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					console.log("No account with that email address exists.");
					return res.redirect('/teachers/login');
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
				'http://' + req.headers.host + '/teachers/reset/' + token + '\n\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'An e-mail has been sent to ' + user.emailid + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/teachers/login');
	});
});

router.get('/reset/:token', function(req, res) {
	Teacher.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }}, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired');
			return res.redirect('/teachers/forgot');
		}
		res.render('reset', {token: req.params.token});
	});
});


router.post('/reset/:token', function(req, res) {
	async.waterfall([
		function(done) {
			Teacher.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }}, function(err, user) {
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
					pass: 'password goes here'
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
		res.redirect('/teachers/login');
	});
});
router.get('/questionpaper', ensureAuthenticated,  function(req, res){
	// res.render('teacher/questionpaper');
		Teacher.find({emailid: detail}, function(err,details){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('teacher/questionpaper', {details: details});
		}
	})
});

router.post('/questionpaper', ensureAuthenticated, function(req, res){
	var num = Math.floor(Math.random() * (999-100) + 100);
		var newPaper = new QPaper({
			username: num,
			subjectname: req.body.Subject,
			semester: req.body.Semester,
			subjectcode: req.body.SubjectCode,
			a1: req.body.a1,
			b1: req.body.b1,
			c1: req.body.c1,
			d1: req.body.d1,
			a2: req.body.a2,
			b2: req.body.b2,
			c2: req.body.c2,
			d2: req.body.d2,
			a3: req.body.a3,
			b3: req.body.b3,
			c3: req.body.c3,
			d3: req.body.d3,
			a4: req.body.a4,
			b4: req.body.b4,
			c4: req.body.c4,
			d4: req.body.d4,
			a5: req.body.a5,
			b5: req.body.b5,
			c5: req.body.c5,
			d5: req.body.d5,
			a1m: req.body.a1m,
			b1m: req.body.b1m,
			c1m: req.body.c1m,
			d1m: req.body.d1m,
			a2m: req.body.a2m,
			b2m: req.body.b2m,
			c2m: req.body.c2m,
			d2m: req.body.d2m,
			a3m: req.body.a3m,
			b3m: req.body.b3m,
			c3m: req.body.c3m,
			d3m: req.body.d3m,
			a4m: req.body.a4m,
			b4m: req.body.b4m,
			c4m: req.body.c4m,
			d4m: req.body.d4m,
			a5m: req.body.a5m,
			b5m: req.body.b5m,
			c5m: req.body.c5m,
			d5m: req.body.d5m,
			ca1: req.body.ca1,
			cb1: req.body.cb1,
			cc1: req.body.cc1,
			cd1: req.body.cd1,
			ca2: req.body.ca2,
			cb2: req.body.cb2,
			cc2: req.body.cc2,
			cd2: req.body.cd2,
			ca3: req.body.ca3,
			cb3: req.body.cb3,
			cc3: req.body.cc3,
			cd3: req.body.cd3,
			ca4: req.body.ca4,
			cb4: req.body.cb4,
			cc4: req.body.cc4,
			cd4: req.body.cd4,
			ca5: req.body.ca5,
			cb5: req.body.cb5,
			cc5: req.body.cc5,
			cd5: req.body.cd5,
			ba1: req.body.ba1,
			bb1: req.body.bb1,
			bc1: req.body.bc1,
			bd1: req.body.bd1,
			ba2: req.body.ba2,
			bb2: req.body.bb2,
			bc2: req.body.bc2,
			bd2: req.body.bd2,
			ba3: req.body.ba3,
			bb3: req.body.bb3,
			bc3: req.body.bc3,
			bd3: req.body.bd3,
			ba4: req.body.ba4,
			bb4: req.body.bb4,
			bc4: req.body.bc4,
			bd4: req.body.bd4,
			ba5: req.body.ba5,
			bb5: req.body.bb5,
			bc5: req.body.bc5,
			bd5: req.body.bd5,
			tname: Tname,
			tcollege: Tcollege,
			tmail: Temail
		});
		QPaper.register(newPaper, "null", function(err, newUser) {
			if(err) {
				req.flash('error', "Couldn't Upload Question Paper");
				console.log(err);
				return res.redirect('/teachers/questionpaper');
			}
			else
			{
				req.flash('success', 'Paper Uploaded Successfully');
				res.redirect('/teachers/home');
			}
	});
});

router.get('/logout', function(req, res) {
	flag = 0;
	req.logout();
	req.flash('success', 'Successfully logged out.');
	flag = 0;
	res.redirect('/homes');
});

router.get('/home', ensureAuthenticated, function(req, res){
	// res.render('teacher/home');
			Teacher.find({emailid: detail}, function(err,details){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('teacher/home', {details: details});
		}
	})
});

module.exports	=	router;