$(document).ready( function() {
    $("#stick").hide(); //hide your div initially
    var topOfOthDiv = $("#othdiv").offset().top;
    $(window).scroll(function() {
        if($(window).scrollTop() > topOfOthDiv) { //scrolled past the other div?
            $("#dvid").show(); //reached the desired point -- show div
        }
    });
});