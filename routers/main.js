var express = require('express');
var app = express.Router();
var controller = require('../controllers/main');
var middleware = require('../middlewares/main');

app.get('/', controller.home);
app.get('/signin', function (req, res) {
    var resp = req.session.resp;
    req.session.resp = null;
    res.render('signin', {
        user: {},
        resp: resp,
        redirect: req.query.redirect || '/',
    });
});
app.get('/signup', function (req, res) {
    var resp = req.session.resp;
    req.session.resp = null;
    res.render('signup', {
        user: {},
        resp: resp,
        redirect: req.query.redirect || '/',
    });
});
app.get('/signout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

app.get('/profile', middleware.isLoggedIn, function (req, res) {
    res.render('profile', {
        user: req.session.user
    });
});

app.post('/signin', middleware.signin, controller.signin);
app.post('/signup', middleware.signup, controller.signup);

app.post('/update-profile', middleware.isLoggedIn, middleware.updateProfile, controller.updateProfile);

app.post('/search', controller.search);

app.get('/notifications', middleware.isLoggedIn, function (req, res) {
    res.render('notifications', {
        user: req.session.user
    });
});

app.get('/mychats', middleware.isLoggedIn, controller.mychats);
app.get('/mynotifications', middleware.isLoggedIn, controller.mynotifications);

app.get('/chat', middleware.isLoggedIn, function (req, res, next) {
    if (req.query.email == req.session.user.email) {
        res.redirect('/');
        return;
    }
    next();
}, controller.chat);

app.post('/set-socket-id', middleware.isLoggedIn, middleware.setSocketID, controller.setSocketID);
app.get('/get-messages', middleware.isLoggedIn, controller.getMessages);
app.post('/message', middleware.isLoggedIn, middleware.insertMessage, controller.insertMessage);

module.exports = app;