require('dotenv').config();
var express				=	require('express'),
	path				=	require('path'),
	cookieParser 		=	require('cookie-parser'),
	bodyParser			=	require('body-parser'),
	expressValidator	=	require('express-validator'),
	flash				=	require('connect-flash'),
	session				=	require('express-session'),
	passport			=	require('passport'),
	LocalStrategy		=	require('passport-local').Strategy,
	mongo				=	require('mongodb'),
	mongoose			=	require('mongoose'),
	nodemailer			=	require('nodemailer'),
	moment				=	require('moment'),
	methodOverride		= 	require('method-override'),
	// client 				=	require('twilio')('ACb0aa49c5f893e6f806ed99b6a2ec90ff','934c60dc9d105a303996ef1276140e8b'),
	crypto				=	require('crypto');
	mongoose.connect(process.env.DATABASE_URL,
		function(){
    /* Drop the DB */
    // mongoose.connection.db.dropDatabase();
// , {useMongoClient: true});
});
 // mongoose.connect("mongodb://rakshith:2312@ds119090.mlab.com:19090/secure_up", function(){});
 
 // ,function(){});

//Routes
var routes				=	require('./routes/index');
var admin				=	require('./routes/admins');
var user				=	require('./routes/user');
var teacher				=	require('./routes/teacher');
//Initialise App
var app 	=	express();

//View Engine
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(flash());
app.use(cookieParser());


app.use(session({
	secret: 'secret',
	saveUninitialized: false,
	resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

//Global Variables for Flash messages
// app.use(function(req, res, next){
// 	res.locals.success_msg	=	req.flash('success_msg');
// 	res.locals.error_msg	=	req.flash('error_msg');
// 	res.locals.error 		=	req.flash('error');
// 	res.locals.decKey		=	0;
// 	next();
// });
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	// res.locals.error =	req.flash('error_msg');
	res.locals.decKey =	0;
	next();
});

app.use('/', routes);
app.use('/admins', admin);
app.use('/users', user);
app.use('/teachers', teacher);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
})

