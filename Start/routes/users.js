var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var User = require('../models/user');

//Register
router.post('/register', function(req, res, next) {
 let newUser = new User({
 	name: req.body.name,
 	username: req.body.username,
 	email: req.body.email,
 	password: req.body.password

 });

 User.addUser(newUser, (err, user) =>{

if(err){
	res.json({success: false, msg: 'Failed to register User'});
}	
else{
	res.json({success: true, msg: 'User Successfully Registered'});
}
 
 });


});

/*//Register
router.post('/register', (req, res, next)=>{
	res.send('REGISTER');
});*/

//Authenticate
router.post('/authenticate', (req, res, next)=>{
	const username = req.body.username;
	const password = req.body.password;

		User.getUserByUsername(username , (err, user)=>{
			if (err) throw err;

			if (!user) {
				return res.json({success: false, msg: 'User not found'});
			}

			User.comparePassword(password, user.password, (err, isMatch) =>{
				if (err) throw err;
				 if(isMatch){
				 	const token = jwt.sign(user.toJSON(), config.secret, {
				 		expiresIn : 604800 // 1 week
				 	});

				 	res.json({
				 		success: true, 
				 		token: 'JWT ' +token,
				 		user: {
				 			id: user._id,
				 			name: user.name,
				 			username: user.username,
				 			email: user.email

				 		}
				 	});
				 }
				 else {
				 	return res.json({success: false, msg: 'Wrong password'});
				 }

			});

		});

});




//router.get('/profile',passport.authenticate('jwt', { session: false }), (req, res, next) => { console.log('req'); res.json({user: req.user}); });


/*// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

/*Profile
router.get('/profile' , passport.authenticate('jwt', {session:false}), (req, res, next) =>{
	res.json({user: req.user});
});*/

router.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    });


module.exports = router;
