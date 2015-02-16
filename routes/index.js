var Helper = require('./helper_funcs.js');
var Twot = require('../models/twot_model.js').twot;
var User = require('../models/user_model.js').user;

var login_page = function(req,res){
    console.log(req.session.user);
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('login');
    }
};

var login_submit = function(req,res){
    var login_user = req.body.login_username;
    User.findOne({name:login_user}).exec(function(err,user){
        if(err){
          res.status(404).send('Server error while finding username!');
        } else {
            if(!user){
                var user_info = {name:login_user,twots:[]};
                var new_user = new User(user_info);
                new_user.save(function (err) {
                    if (err){
                        res.status(404).send('Server error while creating new user!');
                    } else {
                        req.session.user = login_user;
                        res.send('Success!');
                    }
                });
            } else {
                req.session.user = login_user;
                res.send('Success!');
            }
        }
    });
};

var home = function(req,res){
    if (req.session.user) {
        User.find().exec(function(err,users){
            if(err){
                res.status(404).send('Server error while finding username!');
            } else {
                var all_twots = [];
                var all_users = [];
                for (var i = 0; i < users.length; i++){
                    if(users[i].twots.length > 0) {
                        all_twots = all_twots.concat(users[i].twots);
                    }
                }
                for (var i = 0; i < users.length; i++){
                    all_users.push(users[i].name);
                }
                all_twots.sort(function compare(a,b) {
                    return b.time - a.time;
                });
                all_users.sort(function(a,b){
                    return a > b;
                });
                console.log(all_twots);
                var render_info = {};
                render_info.twotes = all_twots;
                render_info.users = all_users;
                render_info.logged_in_user = req.session.user;
                console.log(render_info);
                res.render('home',render_info);
            }
        });
    } else{
        res.redirect('/login');
    }
};


var twote_submit = function(req,res){
    var user_name = req.session.user;
    User.findOne({name:user_name}).exec(function(err,user){
        if(err){
            res.status(404).send('Server error while finding username!');
        } else {
            console.log(user);
            if (user) {
                if (Helper.is_white_space(req.body.text)) {
                    res.send({error_message:"Enter a message that isn't only whitespace!"});
                } else {
                    var submit_time = Helper.get_time();
                    var twote_info = {creator: user_name,text: req.body.text.slice(0,140), time: submit_time};
                    new_twote = Twot(twote_info);
                    twote_info.twote_id = new_twote._id;
                    user.twots = user.twots.concat(new_twote);
                    console.log(user);
                    user.save(function(err){
                        if (err) {
                            res.status(404).send("Couldn't update twotes!");
                        } else {
                            console.log('twote saved!');
                            res.send(twote_info);
                        }
                    })
                }
            } else {
                res.send({redirect:'/login'});
            }
        }
    });
};

var logout = function(req,res){
    req.session.user = undefined;
    res.send({redirect:'/login'});
};

var delete_twote = function(req,res){
    var user_name = req.session.user;
    var twote_id = req.body.twote_id.slice(7);
    console.log(twote_id);
    User.findOne({name:user_name}).exec(function(err,user){
        if(err){
            res.status(404).send('Server error while finding username!');
        } else {
            if (user) {
                new_twots = user.twots.filter(function (el) {
                    return el._id === twote_id ;
                });
                user.twots = new_twots;
                user.save(function(err){
                    if (err) {
                        res.status(404).send("Couldn't update twotes!");
                    } else {
                        console.log('Twote deleted!');
                        res.send({'twote_id':req.body.twote_id});
                    }
                })
            } else {
                res.send({redirect:'/login'});
            }
        }
    });
}

module.exports.login_page = login_page;
module.exports.login_submit = login_submit;
module.exports.home = home;
module.exports.twote_submit = twote_submit;
module.exports.logout = logout;
module.exports.delete_twote = delete_twote;
