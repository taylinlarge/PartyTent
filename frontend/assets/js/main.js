console.log("Hello World from main.js!");

//hamburger menu
var register;
var ajaxResponse;

function hamColor() {
	if( $('.full-ham').hasClass('active')) {
		$('.ham__top, .ham__mid, .ham__bot').css('background-color', 'black');
	} else {
		$('.ham__top, .ham__mid, .ham__bot').css('background-color', '#7F00FF');
	}
}

function animateHam() {
	if($('.full-ham').hasClass('active')) {
		TweenMax.to('.ham__top', 0.2, {rotation: "45deg", top: '15px'});
		TweenMax.to('.ham__mid', 0.1, {width: "0%"});
		TweenMax.to('.ham__bot', 0.2, {rotation: "-45deg", top: '-15px'});
	} else {
		TweenMax.to('.ham__top', 0.4, {rotation: "0deg", top: 0});
		TweenMax.to('.ham__mid', 0.3, {width: '80%'});
		TweenMax.to('.ham__bot', 0.4, {rotation: "0deg", top: 0});
	}
}

$('.ham').on('click', function() {
	$('.full-ham').toggleClass('active');
	animateHam();
	hamColor();
})

$('.start-pt').on('click', function() {

	$('.nav-bar').hide();
	TweenMax.fromTo('.start-pt-form', 0.5, {opacity: 0, left: "-100%"}, {opacity: 1, left: 0});
	$('.start-pt-form').css('display', 'flex');
	register = true;
})

$('.form-back').on('click', function() {
	TweenMax.fromTo('.start-pt-form', 0.5, {opacity: 1, left: 0}, {opacity: 0, left: "-100%", onComplete: function(){
		$('.start-pt-form').css('display', 'none');
	}});
	$('.nav-bar').show();
})

$('button.find-tent').on('click', function(e) {
	e.preventDefault();
	$('.full-ham').removeClass('active');
	animateHam();
	TweenMax.to('.start-pt-form', 0.3, {opacity: 0, display: "none"});
	$('.nav-bar').show();
	hamColor();
})


// part tent list

$('.show-more').on('click', function() {
	$('.show-more').hide();
	TweenMax.to('.list', 0.3, {height: "40%"});
	$('.show-less').show();
	$('.expanded-list').show();
})

$('.show-less').on('click', function() {
	$('.expanded-list').hide();
	$('.show-less').hide();
	$('.show-more').show();
	TweenMax.to('.list', 0.3, {height: "50px"});
})

//initial AJAX call

$(function(){

	$.ajax
	({
	  type: "GET",
	  url: "http://165.227.202.224:3838/partytent",
	  dataType: 'json',
	  async: true,
	})
	.done(placeMarkers, populateList, function(data) {
		ajaxResponse = data;

		console.log(ajaxResponse);
	})
});

 function placeMarkers(data) {
 	console.log(data);
 	let height = $(window).width()*.773;
	let width = $(window).width();
	let m = 1;
 	for (var i = data.length - 1; i >= 0; i--) {
 
	 	let marker = $('<div>');
	 	marker.addClass('marker');

	 	marker.data({
			"y": data[i].long,
			"x": data[i].lat,	
		})
		
	 	marker.attr('data-id', m++);
	 	marker.attr('data-name', data[i].name);
		$(marker).css('left', width*$(marker).data("x") + "px");
		$(marker).css('top', (height*$(marker).data("y")) + 50 + "px");

		$('.map').append(marker);
 	}
 }

 function populateList(data) {
 	var tb = $('.expanded-list__tb tbody');


 	for (var i = 0; i < data.length; i++) {
 		console.log(data[i].name)

 		var tr = $('<tr>')
 		var thName = $('<th>');
 		var tdBeer = $('<td>');
 		var tdLiquor = $('<td>');
 		var tdMusic = $('<td>');
 		var tdOther = $('<td>');
 		var tdDes = $('<td>');
 		
 		thName.attr('scope', 'row');

 		
 		thName.text(data[i].name);
 		
 		if(data[i].beer == true) {
 			var greenDot = $('<div>');
	 		greenDot.addClass('dot');
 			tdBeer.append(greenDot);
 		} else {
 			tdBeer.text("");
 		}

 		if(data[i].Liquor == true) {
 			var greenDot = $('<div>');
	 		greenDot.addClass('dot');
 			tdLiquor.append(greenDot);
 		} else {
 			tdLiquor.text("");
 		}

 		if(data[i].music == true) {
 			var greenDot = $('<div>');
	 		greenDot.addClass('dot');
 			tdMusic.append(greenDot);
 		} else {
 			tdMusic.text("");
 		}

 		if(data[i].other == true) {
 			var greenDot = $('<div>');
	 		greenDot.addClass('dot');
 			tdOther.append(greenDot);
 		} else {
 			tdOther.text("");
 		}

 		tdDes.text(data[i].description);

	 	tr.append(thName, 
	 			  tdBeer,
	 	  		  tdLiquor,
	 	  		  tdMusic,
	 	  		  tdOther,
				  tdDes);
	 	tb.append(tr);
 	}
 }



$('.map').on('mousedown', function(e) {
	if(register) {

		console.log('click');
		let y = e.clientY - 50;
		let x = e.clientX;
		let marker = $('<div>');
		marker.addClass('marker');
		marker.css({
			top: y + 50,
			left: x,
		});
		marker.data({
			"y": (y)/(window.innerWidth*.773),
			"x": x/window.innerWidth,
		})

		$('.map').append(marker);
		register = false;
		sendTent(marker);
		populateList(data);
	}
})



$(window).on('resize', function() {
	let height = $(window).width()*.773;
	let width = $(window).width();
	let markers = $('.marker');
	for (var i = markers.length - 1; i >= 0; i--) {
		$(markers[i]).css('left', width*$(markers[i]).data("x") + "px");
		$(markers[i]).css('top', (height*$(markers[i]).data("y")) + 50 + "px");
	}
})

function sendTent(marker) {
	let tent = {
		name: $('input[name=name]').val(),
		beer: $( "input[type=checkbox][name=beer]:checked" ).val() ? true : false,
		liquor: $( "input[type=checkbox][name=liquor]:checked" ).val() ? true : false,
		music: $( "input[type=checkbox][name=music]:checked" ).val() ? true : false,
		other: $( "input[type=checkbox][name=other]:checked" ).val() ? true : false,
		description: $('input[type=text][name=description]').val(),
		image: null,
		long: marker.data('y'),
		lat: marker.data('x'),
	};

	$.ajax({
		url: "http://165.227.202.224:3838/partytent",
		method: 'POST',
		data: tent,
	}).done(function(res){
		console.log(res);
	})

	$('.pt-form').trigger('reset');
};















