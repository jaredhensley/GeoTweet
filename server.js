var express = require('express');
var session = require('express-session');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
	consumerKey: 'nV09ClLypPrrqdCLTzs9BISsi',
	consumerSecret: 'nGg4jRJU47DAqnND9KTRPhLoRJeleOGAF5oqLwZM2OC8EKw3r9',
	callbackURL: 'http://localhost:8888/api/auth/twitter/callback'
}, function(token, tokenSecret, profile, done) {
	// console.log("token", token);
	// console.log("tokenSecret", tokenSecret);
	// console.log("profile", profile);
	//FIND OR SAVE USER TO DB
	done(null, profile);
}));

var app = express();
app.use(session({secret: 'super secret something'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var requireAuth = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(403).end();
	}
	next();
};

app.get('/api/users/me', function(req, res) {
	return res.json(req.user);
});

app.get('/api/auth/twitter', passport.authenticate('twitter'));
app.get('/api/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/'
});

app.get('/api/geo-data', requireAuth, function(req, res) {
	return res.json({tweets: [{}, {}]});
});

app.listen(8888);