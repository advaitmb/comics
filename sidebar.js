$(document).ready( function() {


$(window).scroll(function(){


     if ($(this).scrollTop() > 3800) {
        $('#stick').hide(500);
    }
    else {
       if ($(this).scrollTop() > 1800) {
           $('#stick').show(500);
       } else {
           $('#stick').hide(500);
       }
    };


});


$(window).scroll(function(){


        if ($(this).scrollTop() > 7200) {
        $('#stick2').hide(500);
    }
    else {
       if ($(this).scrollTop() > 6200) {
           $('#stick2').show(500);
       } else {
           $('#stick2').hide(500);
       }
    }

});






});