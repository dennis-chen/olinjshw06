//Constants
var MAX_CHARS = 140;

//error handling at its finest
var onError = function(data, status) {
    console.log("status", status);
    console.log("error", data);
}

//logout button behavior
var $logout = $("#logout");

var logout_success = function(data, status){
    console.log(data);
    if (data.redirect){
        window.location = data.redirect;
    }
}

$logout.submit(function(event) {
    event.preventDefault();
    $.post("logout")
        .done(logout_success)
        .error(onError);
});

//twote submit behavior
var $twote = $("#twote_submit_form");
var $twote_text = $("#twote_submit_text");

var twote_success = function(data, status){
    if (data.error_message) {
        $('#error_message').text(data.error_message);
    } else {
        if (data.redirect){
            window.location = data.redirect;
        } else {
            $('#error_message').text('');
            console.log(data.twote_id);
            var new_twote = '<div hidden id="'+data.twote_id+'" class="twote" creator="'+data.creator+'">'+
                            ' <h3 class="creator"> '+data.creator+' '+
                            '    <button id="delete_'+data.twote_id+'" class="delete_button" tweet_id="'+data.twote_id+'" creator="'+data.creator+'">x</button>'+
                            '    </h3>'+
                            '    <p> '+data.text+' </p>';
            $(new_twote).insertAfter('#twote_header');
            $('#'+data.twote_id).slideDown();
            show_buttons();
            console.log(data);
        }
    }
}

$twote.submit(function(event) {
    event.preventDefault();
    var twote_obj = {text:$twote_text.val()};
    $.post("twote_submit", twote_obj)
        .done(twote_success)
        .error(onError);
});

//character limit counter and enforcer
$("#twote_submit_text").keyup(function(){
    var twote_len = $(this).val().length;
    $("#char_counter").text(twote_len + "/" + MAX_CHARS);
    if($(this).val().length > MAX_CHARS){
            $(this).val($(this).val().substr(0, MAX_CHARS));
    }
})

//twote delete behavior
var $logged_in_user = $('#logged_in_user');
console.log('hallo!');
console.log($logged_in_user);

function show_buttons(){
    var $delete_buttons = $('.delete_button');
    $delete_buttons.each(function(){
        if ($(this).attr('creator') === $logged_in_user.text()){
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    $delete_buttons.each(function(){
        var button = $(this);
        button.click(function(event){
            event.preventDefault();
            console.log('clicked!');
            $.post('delete_twote', {twote_id:button.attr('id')})
                .done(delete_twote_success)
                .error(onError);
        });
    });
}
show_buttons();

var delete_twote_success = function(data, status){
    var id_to_del = data.twote_id.slice(7);
    console.log(id_to_del);
    console.log('twote deleted!');
    $('#'+id_to_del).slideUp( function() {
        $('#'+id_to_del).hide();
    });
}

//user name click highlighting
var users = $('.username');
users.each(function(){
    var user = $(this);
    user.click(function(event){
        users.each(function(){
            $(this).css({'color':'grey','border-left':'0px'});
        });
        user.css({'color':'black','border-left':'2px solid #006699'});
        var sel_user = user.attr('id').slice(5)
        console.log($("[creator="+sel_user+"]"));
        $('[creator]').each(function(){
            $(this).css('background-color','white');
        });
        $("[creator="+sel_user+"]").each(function(){
            console.log('hi');
            console.log($(this));
            $(this).css({'background-color':'#8EC2DA'});
        });
    });
});
