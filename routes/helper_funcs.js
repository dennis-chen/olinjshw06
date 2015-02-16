function unix_to_human(unix_timestamp){
    var newDate = new Date();
    newDate.setTime(unix_timestamp*1000);
    dateString = newDate.toUTCString();
    return dateString;
}

function get_time(){
    return Date.now();
}

function is_white_space(text){
    return /^\s*$/.test(text);
}

module.exports.unix_to_human = unix_to_human;
module.exports.get_time = get_time;
module.exports.is_white_space = is_white_space;
