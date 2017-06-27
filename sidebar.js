$(document).ready( function() {
	
    var topOfOthDiv = $("#othdiv").offset().top;
    var topOfNames = $("#sidebar_text_names").offset().top;
    $(window).scroll(function() {
        if($(window).scrollTop() > topOfOthDiv) { //scrolled past the other div?
            $("#stick").show(500); //reached the desired point -- show div
        }
         if($(window).scrollTop() > topOfNames) { //scrolled past the other div?
            $("#bubble_content").html("<span id='titleInsert'>Taking names?</span><br><span id='textInsert'>Click on a circle and I'll list gender-titled characters!</span>"); //reached the desired point -- show div
        }
    });





});