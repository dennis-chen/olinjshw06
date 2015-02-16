console.log('shit!');
//logout button behavior
var $login_form = $("#login_form");

var onSuccess = function(data, status){
    console.log('logged you in! redirecting...');
    window.location.replace('/home');
}

var onError = function(data, status) {
    console.log("status", status);
    console.log("error", data);
}

$login_form.submit(function(event) {
    event.preventDefault();
    console.log($login_form.serialize());
    $.post("login_submit", $login_form.serialize())
        .done(onSuccess)
        .error(onError);
});
