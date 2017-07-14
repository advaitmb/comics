	$(function() {
		  if($(window).width() <= 410) {
		    $("#swarm").each(function() {
		      $(this).attr("src", $(this).attr("src").replace("images/swarm.jpg", "images/swarm_mobile.jpg"));
		    });
		  }
		});