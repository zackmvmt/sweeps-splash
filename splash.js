$(function() {
	
	// sign up form
	$('#get_started').click(function() {
		// get all the fields
		var f_name = $('input$f_name').val();
		var l_name = $('input$l_name').val();
		var email = $('input$email').val();
		var c_name = $('input$c_name').val();
		var phone = $('input$phone').val();
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
		} else if (c_name == '') {
			alert('Please enter your company name');
			return false;
		}
		// send off to server
	});
	
	// log in button

	// photo scroller
	
});
