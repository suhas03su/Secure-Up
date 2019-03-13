var express	=	require('express');
var app = express();
var router	=	express.Router();
var nodemailer			=	require('nodemailer');
var client 				=	require('twilio')('ACb0aa49c5f893e6f806ed99b6a2ec90ff','934c60dc9d105a303996ef1276140e8b');
app.use(express.static('routes/public'));
//Get Homepage
router.get('/', function(req, res){
	res.render('landing');
});
router.post('/', function(req, res){

 		var smtpTransport = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					}
 				});
 				var mailOptions = {
 					to:'secure.up.feedback@gmail.com' ,
 					from: 'secure.up.rear@gmail.com',
 					subject: 'Contact',
 					text: 'Hello, SecureUp team.\n' + req.body.name +' tried contacting you.\n' +'They have this message for you, \n' +req.body.message + 
 					'\n' + 'In case if you want to contact them, \ncall them on: '+req.body.phone+'\n'+'Or Mail them on: '+req.body.email+'.\n'
 				};
 				//  client.messages.create({
					// to: '+918197856345'
					// from: '+12015652472',
					// body: 'Hello, SecureUp team.\n' + req.body.name +'tried contacting you.\n' + 'They have this message for you, \n' + req.body.message + 
 				// 	'\n' + 'In case if you want to contact them, \n call them on: '+req.body.phone+'\n'+'Or Mail them on: '+req.body.mail+'.\n'
					// }, function(err, data){
					// 	if(err)
					// 			console.log(err);
					// 	else
					// 			console.log(data);
					// 	});
 				smtpTransport.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
 				var smtTransport = nodemailer.createTransport({
 					service: 'Gmail',
 					auth: {
 						user: 'secure.up.rear@gmail.com',
 						pass: 'Rsss@2018'
 					}
 				});
 				var mailOptions = {
 					to: req.body.email ,
 					from: 'secure.up.rear@gmail.com',
 					subject: 'Contact',
 					text: 'Hello, '+req.body.name+'.\n' +'Thank you for reaching us'+'.\n'
 					+ 'Our team Will revert back soon, in case of anything dont be shy to contact us @ secure.up.rear@gmail.com. \n'+'Regards: SecureUP Team.'
 				};
 				 smtTransport.sendMail(mailOptions, function(err) {
 					if(err)
				{
					console.log(err);
				}
 				});
 				});
				res.render('landing');
 });

router.get('/homes', function(req, res){
	res.render('index');
});
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Successfully logged out.');
	res.redirect('/homes');
});


module.exports	=	router;