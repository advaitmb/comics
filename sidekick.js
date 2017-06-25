$(document).ready( function() {
    $("#stick").hide(); //hide your div initially
    var topOfOthDiv = $("#othdiv").offset().top;
    $(window).scroll(function() {
        if($(window).scrollTop() > topOfOthDiv) { //scrolled past the other div?
            $("#stick").show(500); //reached the desired point -- show div
        }
        $("#bubble_content").html("hello! This is a practice with my sidekick character! so cuuuuuute!");
    });
});