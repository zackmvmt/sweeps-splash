$(function() {
	
	var Global = {};
	Global.Server = 'https://api-sweepstakes.movementstrategy.com';
	var auth = 'Basic ' + Base64.encode('5IUl3fKao5' + ':' + '426LJy7887QzxC2VG434UmZl2d4brc54');

	// mash
	$('input#phone').mask('(999) 999-9999');

	// sign up form
	$('#get_started').click(function() {
		// get all the fields
		var f_name = $('input#f_name').val();
		var l_name = $('input#l_name').val();
		var email = $('input#email').val();
		var password = $('input#password').val();
		var c_password = $('input#password_confirm').val();
		// validate fields
		var email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (f_name == '') {
			alert('Please enter you first name');
			return false;
		} else if (l_name == '') {
			alert('Please enter your last name');
			return false;
		} else if (email == '' && email_reg.test(email)) {
			alert('Please enter your email address');
			return false;
		} else if (password == '' || password.length < 6) {
			alert('Please enter your password of at least 6 characters');
			return false;
		} else if (password != c_password) {
			alert('Your passwords don\'t match');
			return false;
		}
		// validate that user does not already exist
		$.ajax({
			type: 'GET',
			url: Global.Server + '/users?email=' + email,
			headers: { Authorization: auth },
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(Global.Client),
			success: function(user, textStatus, jqXHR) {
				if (user.length) {
					alert('Email already exists.');
					return false;
				}
				// save the information
				Global.User = { first_name: f_name, last_name: l_name, email: email, password: password };
				// show the next step
				$('#form .page:first').animate({ 'margin-left': '-=336px' }, 500);
			}
		});
	});

	$('#set_up').click(function() {
		// get the remaining fields
		var c_name = $('input#c_name').val();
		var phone = $('input#phone').val();
		// validate the fields
		if (c_name == '') {
			alert('Please enter your company name');
			return false;
		} else if (phone == '') {
			alert('Please enter a contact phone number');
			return false;
		}

		// save the information
		Global.Client = { name: c_name, phone: phone };
		// create client
		$.ajax({
			type: 'POST',
			url: Global.Server + '/clients',
			headers: { Authorization: auth },
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(Global.Client),
			success: function(client, textStatus, jqXHR) {
				if (typeof client._id === 'undefined') {
					alert('An unknown error occured.');
					return false;
				}
				Global.User.clients = [client._id];
				// create user
				$.ajax({
					type: 'POST',
					url: Global.Server + '/users',
					headers: { Authorization: auth },
					contentType: 'application/json',
					dataType: 'json',
					data: JSON.stringify(Global.User),
					success: function(user, textStatus, jqXHR) {
						if (typeof user._id === 'undefined') {
							alert('An unknown error occured.');
							return false;
						}
						// cookies so they are auto logged in
						var exp = new Date();
						var now = exp.setTime(exp.getTime() + (1200 * 1000)); // 20 minute expiration
						document.cookie = 'cid=' + client._id + ';expires=' + exp.toGMTString() + ';path=/;secure;';
						document.cookie = 'uid=' + user._id + ';expires=' + exp.toGMTString() + ';path=/;secure;';
						// redirect to app
						window.location = 'https://sweepstakes.movementstrategy.com';
					}
				});
			}
		});
	});
	
	// log in button
	$('#header #login').click(function() {
		window.location = 'https://sweepstakes.movementstrategy.com';
	});

	// photo scroller - position the slides initially
	$('#main_img .slide').each(function() {
		$(this).css({ left: 350 * $(this).index() + 'px' });
	});
	// photo scroller - slideshow
	$.slider = setInterval(nextSlide, 3000);
	function nextSlide() {
		// get the slides
		var slides = $('#main_img .slide');
		// animate them over
		slides.animate({ left: '-=350' }, 500, function() {
			var pos = $(this).css('left');
			if (pos == '-350px') $(this).css({ left: '1050px' });
			if ($(this).hasClass('current')) $(this).removeClass('current');
			if (pos == '0px') $(this).addClass('current');
			var current = $('#main_img .slide.current').index();
			$('#slides ul li').removeClass();
			$('#slides ul li').eq(current).addClass('current');
		});
	}
	
});