var mongoose = require('mongoose');

var twotSchema = mongoose.Schema({
    creator: String,
    text: String,
    time: String
});

module.exports.twot = mongoose.model('twot',twotSchema);
module.exports.twotSchema = twotSchema;
