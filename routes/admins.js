var express				=	require('express');
var router				=	express.Router();
var Admin				=	require('../models/admin');
var User				=	require('../models/user');
var Teacher				=	require('../models/teacher');
var QPaper				=	require('../models/qpaper');
var FPaper				=	require('../models/fpaper');
var passport 			=	require('passport');
var LocalStrategy		=	require('passport-local').Strategy;
var readline			=	require('readline');
var crypto				=	require('crypto');
var client 				=	require('twilio')('ACb0aa49c5f893e6f806ed99b6a2ec90ff','934c60dc9d105a303996ef1276140e8b');
var nodemailer			=	require('nodemailer');
var nullpattern = /^NA[0-9]{3}$/;
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	else
	{
		req.flash('error', 'You have to be logged in. Use the credentials and log in.');
		res.redirect('/admins/login');
	}
}

//Register route
router.get('/register', function(req, res){
	res.render('register');
});

//Login route
router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			req.flash('error', err.message);
			return next(err); 
		}
		if (!user) {
			console.log(err);
			return res.redirect('/admins/login'); 
		}
		req.logIn(user, function(err) {
		 	if (err) { 
		 		return next(err); 
		 	}
		 	req.flash('success', 'Welcome back, ' + user.username);
		  	 res.redirect('/admins/home');
		});
	})(req, res, next);
});

router.post('/register', function(req, res){
		var newUser = new Admin({
			username: req.body.username,
			emailid: req.body.email,
			phonenumber: req.body.phno
		});
		Admin.register(newUser, req.body.password, function(err, newUser) {
			if(err) {
				req.flash('error', err.message);
				console.log(err);
				return res.redirect('/admins/register');
			}
			else
			{
				passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome, Your registration is complete.');
				res.redirect('/admins/home');
			});
			}
	});
	});

router.get('/home', ensureAuthenticated, function(req, res){
	res.render('admin/home')
});
router.post('/home', ensureAuthenticated, function(req, res){
			var subject1 = req.body.sub;
			console.log(subject1);
	QPaper.find({subjectname: subject1}, function(err,papers){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('admin/generateqpaper', {papers: papers});
		}
	})
});


router.get('/activate', ensureAuthenticated, function(req, res){
	User.find({}, function(err,users){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('admin/activateUsers', {users: users});
		}
	})
});

router.get('/activateTeacher', ensureAuthenticated, function(req, res){
	Teacher.find({}, function(err,users){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('admin/activateTeachers', {users: users});
		}
	})
});

router.post('/activateTeacher', ensureAuthenticated, function(req, res){
	var tidpattern = /^TID[0-9]{3}$/; 
	Teacher.findOne({emailid: req.body.emailid}, function(err, user){
		if(!(user.username.match(tidpattern))) 
		{
			var num = Math.floor(Math.random() * (999-100) + 100);
			var tid = "TID"+num;
		}
		else
		{	
			var num1 = Math.floor(Math.random() * (999-100) + 100);
			var tid  = "NA"+num1;
		}
		Teacher.updateOne({emailid: user.emailid}, {username: tid}, function(err)
		{
			if(err)
			{
				console.log("Updation Failed");
				res.redirect('/admins/activateTeacher');
			}
			else
			{
				console.log("Updated Successfully");
				if(user.username.match(nullpattern))
					{
						req.flash('success', 'Activated the account.');
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
 					subject: 'Account Activation',
 					text: 'Hello, '+ user.emailid + '\n\n' +
 						  'Congratulations, Your account has been activated!!'
 				};
 				 				 						client.messages.create({
	to: '+91'+ user.phonenumber,
	from: '+12015652472',
	body: 'Congratulations, Your account has been activated!!'
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
					}
				else
				{
					req.flash('error', 'Deactivated the account.');
				}
				res.redirect("/admins/activateTeacher");
			}
		})
	})
});



router.post('/activate', ensureAuthenticated, function(req, res){
	User.findOne({emailid: req.body.emailid}, function(err, user){
		var uidpattern = /^UID[0-9]{3}$/;
		if(!(user.username.match(uidpattern)))
		{
			var num = Math.floor(Math.random() * (999-100) + 100);
			var tid = "UID"+num;
		}
		else
		{
			var num1 = Math.floor(Math.random() * (999-100) + 100);
			var tid  = "NA"+num1;
		}
		User.updateOne({emailid: user.emailid}, {username: tid}, function(err)
		{
			if(err)
			{
				console.log("Updation Failed");
				res.redirect('/admins/activate');
			}
			else
			{
				console.log("Updated Successfully");
				if(user.username.match(nullpattern))
					{req.flash('success', 'Activated the account.');}
				else
				{
					req.flash('error', 'Deactivated the account.');
				}
				res.redirect("/admins/activate");
			}
		})
	})
});

router.get('/generatequestionpaper', ensureAuthenticated, function(req, res){
	//var prompts	=	readline.createInterface(process.stdin, process.stdout);
	//prompts.question("Enter the subjectcode", function(subject){

	});
//});

router.post('/generatequestionpaper', ensureAuthenticated, function(req, res){

	var a1 = req.body.a1;
	var b1 = req.body.b1;
	var c1 = req.body.c1;
	var d1 = req.body.d1;
	var a2 = req.body.a2;
	var b2 = req.body.b2;
	var c2 = req.body.c2;
	var d2 = req.body.d2;
	var a3 = req.body.a3;
	var b3 = req.body.b3;
	var c3 = req.body.c3;
	var d3 = req.body.d3;
	var a4 = req.body.a4;
	var b4 = req.body.b4;
	var c4 = req.body.c4;
	var d4 = req.body.d4;
	var  a5 = req.body.a5;
	var  b5 = req.body.b5;
	var  c5 = req.body.c5;
	var d5 = req.body.d5;
	var a1m = req.body.a1m;
	var b1m = req.body.b1m;
	var c1m = req.body.c1m;
	var d1m = req.body.d1m;
	var a2m = req.body.a2m;
	var b2m = req.body.b2m;
	var c2m = req.body.c2m;
	var d2m = req.body.d2m;
	var a3m = req.body.a3m;
	var b3m = req.body.b3m;
	var c3m = req.body.c3m;
	var d3m = req.body.d3m;
	var a4m = req.body.a4m;
	var b4m = req.body.b4m;
	var c4m = req.body.c4m;
	var d4m = req.body.d4m;
	var a5m = req.body.a5m;
	var b5m = req.body.b5m;
	var c5m = req.body.c5m;
	var d5m = req.body.d5m;
	var ca1 = req.body.ca1;
	var cb1 = req.body.cb1;
	var cc1 = req.body.cc1;
	var cd1 = req.body.cd1;
	var ca2 = req.body.ca2;
	var cb2 = req.body.cb2;
	var cc2 = req.body.cc2;
	var cd2 = req.body.cd2;
	var ca3 = req.body.ca3;
	var cb3 = req.body.cb3;
	var cc3 = req.body.cc3;
	var cd3 = req.body.cd3;
	var ca4 = req.body.ca4;
	var cb4 = req.body.cb4;
	var cc4 = req.body.cc4;
	var cd4 = req.body.cd4;
	var ca5 = req.body.ca5;
	var cb5 = req.body.cb5;
	var cc5 = req.body.cc5;
	var cd5 = req.body.cd5;
	var ba1 = req.body.ba1;
	var bb1 = req.body.bb1;
	var bc1 = req.body.bc1;
	var bd1 = req.body.bd1;
	var ba2 = req.body.ba2;
	var bb2 = req.body.bb2;
	var bc2 = req.body.bc2;
	var bd2 = req.body.bd2;
	var ba3 = req.body.ba3;
	var bb3 = req.body.bb3;
	var bc3 = req.body.bc3;
	var bd3 = req.body.bd3;
	var ba4 = req.body.ba4;
	var bb4 = req.body.bb4;
	var bc4 = req.body.bc4;
	var bd4 = req.body.bd4;
	var ba5 = req.body.ba5;
	var bb5 = req.body.bb5;
	var bc5 = req.body.bc5;
	var bd5 = req.body.bd5;
	var encdate = req.body.edate;
    var sdate =  new Date(encdate);
	console.log(sdate);
	console.log(encdate);
	var key = "gasfhksagflAGf%258925%";
	a1 = crypto.createCipher("aes-256-ctr", key).update(a1, "utf-8", "hex");
	b1 = crypto.createCipher("aes-256-ctr", key).update(b1, "utf-8", "hex");
	c1 = crypto.createCipher("aes-256-ctr", key).update(c1, "utf-8", "hex");
	d1 = crypto.createCipher("aes-256-ctr", key).update(d1, "utf-8", "hex");
	a2 = crypto.createCipher("aes-256-ctr", key).update(a2, "utf-8", "hex");
	b2 = crypto.createCipher("aes-256-ctr", key).update(b2, "utf-8", "hex");
	c2 = crypto.createCipher("aes-256-ctr", key).update(c2, "utf-8", "hex");
	d2 = crypto.createCipher("aes-256-ctr", key).update(d2, "utf-8", "hex");
	a3 = crypto.createCipher("aes-256-ctr", key).update(a3, "utf-8", "hex");
	b3 = crypto.createCipher("aes-256-ctr", key).update(b3, "utf-8", "hex");
	c3 = crypto.createCipher("aes-256-ctr", key).update(c3, "utf-8", "hex");
	d3 = crypto.createCipher("aes-256-ctr", key).update(d3, "utf-8", "hex");
	a4 = crypto.createCipher("aes-256-ctr", key).update(a4, "utf-8", "hex");
	b4 = crypto.createCipher("aes-256-ctr", key).update(b4, "utf-8", "hex");
	c4 = crypto.createCipher("aes-256-ctr", key).update(c4, "utf-8", "hex");
	d4 = crypto.createCipher("aes-256-ctr", key).update(d4, "utf-8", "hex");
	a5 = crypto.createCipher("aes-256-ctr", key).update(a5, "utf-8", "hex");
	b5 = crypto.createCipher("aes-256-ctr", key).update(b5, "utf-8", "hex");
	c5 = crypto.createCipher("aes-256-ctr", key).update(c5, "utf-8", "hex");
	d5 = crypto.createCipher("aes-256-ctr", key).update(d5, "utf-8", "hex");
	// a1m = crypto.createCipher("aes-256-ctr", key).update(a1m, "utf-8", "hex");
	// a2m = crypto.createCipher("aes-256-ctr", key).update(a2m, "utf-8", "hex");
	// a3m = crypto.createCipher("aes-256-ctr", key).update(a3m, "utf-8", "hex");
	// a4m = crypto.createCipher("aes-256-ctr", key).update(a4m, "utf-8", "hex");
	// a5m = crypto.createCipher("aes-256-ctr", key).update(a5m, "utf-8", "hex");
	// b1m = crypto.createCipher("aes-256-ctr", key).update(b1m, "utf-8", "hex");
	// b2m = crypto.createCipher("aes-256-ctr", key).update(b2m, "utf-8", "hex");
	// b3m = crypto.createCipher("aes-256-ctr", key).update(b3m, "utf-8", "hex");
	// b4m = crypto.createCipher("aes-256-ctr", key).update(b4m, "utf-8", "hex");
	// b5m = crypto.createCipher("aes-256-ctr", key).update(b5m, "utf-8", "hex");
	// c1m = crypto.createCipher("aes-256-ctr", key).update(c1m, "utf-8", "hex");
	// c2m = crypto.createCipher("aes-256-ctr", key).update(c2m, "utf-8", "hex");
	// c3m = crypto.createCipher("aes-256-ctr", key).update(c3m, "utf-8", "hex");
	// c4m = crypto.createCipher("aes-256-ctr", key).update(c4m, "utf-8", "hex");
	// c5m = crypto.createCipher("aes-256-ctr", key).update(c5m, "utf-8", "hex");
	// d1m = crypto.createCipher("aes-256-ctr", key).update(d1m, "utf-8", "hex");
	// d2m = crypto.createCipher("aes-256-ctr", key).update(d2m, "utf-8", "hex");
	// d3m = crypto.createCipher("aes-256-ctr", key).update(d3m, "utf-8", "hex");
	// d4m = crypto.createCipher("aes-256-ctr", key).update(d4m, "utf-8", "hex");
	// d5m = crypto.createCipher("aes-256-ctr", key).update(d5m, "utf-8", "hex");
	// ca1 = crypto.createCipher("aes-256-ctr", key).update(ca1, "utf-8", "hex");
	// ca2 = crypto.createCipher("aes-256-ctr", key).update(ca2, "utf-8", "hex");
	// ca3 = crypto.createCipher("aes-256-ctr", key).update(ca3, "utf-8", "hex");
	// ca4 = crypto.createCipher("aes-256-ctr", key).update(ca4, "utf-8", "hex");
	// ca5 = crypto.createCipher("aes-256-ctr", key).update(ca5, "utf-8", "hex");
	// cb1 = crypto.createCipher("aes-256-ctr", key).update(cb1, "utf-8", "hex");
	// cb2 = crypto.createCipher("aes-256-ctr", key).update(cb2, "utf-8", "hex");
	// cb3 = crypto.createCipher("aes-256-ctr", key).update(cb3, "utf-8", "hex");
	// cb4 = crypto.createCipher("aes-256-ctr", key).update(cb4, "utf-8", "hex");
	// cb5 = crypto.createCipher("aes-256-ctr", key).update(cb5, "utf-8", "hex");
	// cc1 = crypto.createCipher("aes-256-ctr", key).update(cc1, "utf-8", "hex");
	// cc2 = crypto.createCipher("aes-256-ctr", key).update(cc2, "utf-8", "hex");
	// cc3 = crypto.createCipher("aes-256-ctr", key).update(cc3, "utf-8", "hex");
	// cc4 = crypto.createCipher("aes-256-ctr", key).update(cc4, "utf-8", "hex");
	// cc5 = crypto.createCipher("aes-256-ctr", key).update(cc5, "utf-8", "hex");
	// cd1 = crypto.createCipher("aes-256-ctr", key).update(cd1, "utf-8", "hex");
	// cd2 = crypto.createCipher("aes-256-ctr", key).update(cd2, "utf-8", "hex");
	// cd3 = crypto.createCipher("aes-256-ctr", key).update(cd3, "utf-8", "hex");
	// cd4 = crypto.createCipher("aes-256-ctr", key).update(cd4, "utf-8", "hex");
	// cd5 = crypto.createCipher("aes-256-ctr", key).update(cd5, "utf-8", "hex");
	// ba1 = crypto.createCipher("aes-256-ctr", key).update(ba1, "utf-8", "hex");
	// ba2 = crypto.createCipher("aes-256-ctr", key).update(ba2, "utf-8", "hex");
	// ba3 = crypto.createCipher("aes-256-ctr", key).update(ba3, "utf-8", "hex");
	// ba4 = crypto.createCipher("aes-256-ctr", key).update(ba4, "utf-8", "hex");
	// ba5 = crypto.createCipher("aes-256-ctr", key).update(ba5, "utf-8", "hex");
	// bb1 = crypto.createCipher("aes-256-ctr", key).update(bb1, "utf-8", "hex");
	// bb2 = crypto.createCipher("aes-256-ctr", key).update(bb2, "utf-8", "hex");
	// bb3 = crypto.createCipher("aes-256-ctr", key).update(bb3, "utf-8", "hex");
	// bb4 = crypto.createCipher("aes-256-ctr", key).update(bb4, "utf-8", "hex");
	// bb5 = crypto.createCipher("aes-256-ctr", key).update(bb5, "utf-8", "hex");
	// bc1 = crypto.createCipher("aes-256-ctr", key).update(bc1, "utf-8", "hex");
	// bc2 = crypto.createCipher("aes-256-ctr", key).update(bc2, "utf-8", "hex");
	// bc3 = crypto.createCipher("aes-256-ctr", key).update(bc3, "utf-8", "hex");
	// bc4 = crypto.createCipher("aes-256-ctr", key).update(bc4, "utf-8", "hex");
	// bc5 = crypto.createCipher("aes-256-ctr", key).update(bc5, "utf-8", "hex");
	// bd1 = crypto.createCipher("aes-256-ctr", key).update(bd1, "utf-8", "hex");
	// bd2 = crypto.createCipher("aes-256-ctr", key).update(bd2, "utf-8", "hex");
 //    bd3 = crypto.createCipher("aes-256-ctr", key).update(bd3, "utf-8", "hex");
	// bd4 = crypto.createCipher("aes-256-ctr", key).update(bd4, "utf-8", "hex");
	// bd5 = crypto.createCipher("aes-256-ctr", key).update(bd5, "utf-8", "hex");

	var finalPaper	=	new FPaper({
		username: req.body.Subject,
		semester: req.body.Semester,
		subjectcode: req.body.SubjectCode,
		a1: a1,
		b1: b1,
		c1: c1,
		d1: d1,
		a2: a2,
		b2: b2,
		c2: c2,
		d2: d2,
		a3: a3,
		b3: b3,
		c3: c3,
		d3: d3,
		a4: a4,
		b4: b4,
		c4: c4,
		d4: d4,
		a5: a5,
		b5: b5,
		c5: c5,
		d5: d5,
		    a1m: a1m,
			b1m: b1m,
			c1m: c1m,
			d1m: d1m,
			a2m: a2m,
			b2m: b2m,
			c2m: c2m,
			d2m: d2m,
			a3m: a3m,
			b3m: b3m,
			c3m: c3m,
			d3m: d3m,
			a4m: a4m,
			b4m: b4m,
			c4m: c4m,
			d4m: d4m,
			a5m: a5m,
			b5m: b5m,
			c5m: c5m,
			d5m: d5m,
			ca1: ca1,
			cb1: cb1,
			cc1: cc1,
			cd1: cd1,
			ca2: ca2,
			cb2: cb2,
			cc2: cc2,
			cd2: cd2,
			ca3: ca3,
			cb3: cb3,
			cc3: cc3,
			cd3: cd3,
			ca4: ca4,
			cb4: cb4,
			cc4: cc4,
			cd4: cd4,
			ca5: ca5,
			cb5: cb5,
			cc5: cc5,
			cd5: cd5,
			ba1: ba1,
			bb1: bb1,
			bc1: bc1,
			bd1: bd1,
			ba2: ba2,
			bb2: bb2,
			bc2: bc2,
			bd2: bd2,
			ba3: ba3,
			bb3: bb3,
			bc3: bc3,
			bd3: bd3,
			ba4: ba4,
			bb4: bb4,
			bc4: bc4,
			bd4: bd4,
			ba5: ba5,
			bb5: bb5,
			bc5: bc5,
			bd5: bd5,
		hh: req.body.hh,
		mm: req.body.mm,
		ss: 0,
		d: sdate,
		key: 0,
		flag: 0
	});
	// console.log(d);
	console.log(encdate);
	console.log(finalPaper);
	console.log(encdate);
	FPaper.register(finalPaper, "null", function(err, paper) {
			if(err) {
				req.flash('error', "Unable to upload");
				console.log(err);
				return res.redirect('/admins/generatequestionpaper');
			}
			else
			{
				req.flash('success', 'Uploading the final paper for ' + paper.subjectcode + ' is complete.');
				res.redirect('/admins/home');
			}
});
	decKey	=	key;
});


router.get('/displayqpaper', ensureAuthenticated, function(req, res){
	//var prompts	=	readline.createInterface(process.stdin, process.stdout);
	//prompts.question("Enter the subjectcode", function(subject){

	});

router.post('/displayqpaper', ensureAuthenticated, function(req, res){
	//var prompts	=	readline.createInterface(process.stdin, process.stdout);
	//prompts.question("Enter the subjectcode", function(subject){
		var s = req.body.un;
			console.log(s);
				QPaper.find({username: s}, function(err,papers){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('admin/displayqpaper', {papers: papers});
		}
	})
	});

module.exports	=	router;