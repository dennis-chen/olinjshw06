var mongoose = require('mongoose');

var twotSchema = require('./twot_model.js').twotSchema;
var User = require('../models/user_model.js').user;

var userSchema = mongoose.Schema({
    name: String,
    twots: [twotSchema]
});

module.exports.user = mongoose.model('user',userSchema);
