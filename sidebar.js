$(document).ready( function() {
	
    // var topOfOthDiv = $("#othdiv").offset().top;
    // var topOfNames = $("#sidebar_text_names").offset().top;
    // $(window).scroll(function() {
    //     if($(window).scrollTop() > topOfOthDiv) { //scrolled past the other div?
    //         $("#stick").show(500); //reached the desired point -- show div
    //     }
    //      if($(window).scrollTop() > topOfNames) { //scrolled past the other div?
    //         $("#bubble_content").html("<span id='titleInsert'>Taking names?</span><br><span id='textInsert'>Click on a circle and I'll list gender-titled characters!</span><span id='textInsert_names'></span>"); //reached the desired point -- show div
    //     }
    // });



$(window).scroll(function(){


    // if ($(this).scrollTop() > 4000) {
    //     $('#stick').hide(500);
    // }
    // else {
    //    if ($(this).scrollTop() > 1800) {
    //        $('#stick').show(500);
    //    } else {
    //        $('#stick').hide(500);
    //    }
    // }


     if ($(this).scrollTop() > 7200) {
        $('#stick').hide(500);
    }
    else {
       if ($(this).scrollTop() > 6200) {
           $('#stick').show(500);
       } else {
           $('#stick').hide(500);
       }
    }



});



});