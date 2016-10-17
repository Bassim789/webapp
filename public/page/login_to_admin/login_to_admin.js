page.login_to_admin = class {
	constructor(name) {
		template('#body', '#template_page_login_to_admin')
		template('#login_box', '#template_login')
		new my_module.Action(this, {
			click: ['login', 'send_new_password', 'reset_password_box', 'login_box'],
			enter: ['login', 'send_new_password']
		})
	}
	login_box() {
		this.clean_info_box()
		template('#login_box', '#template_login', {
			email: $('#email_new_password').val()
		})
	}
	reset_password_box() {
		this.clean_info_box()
		template('#login_box', '#template_login_reset_password', {
			email: $('#email_login').val()
		})
	}
	clean_info_box() {
		$('.popup_infobox').html('').attr('class', 'popup_infobox')
	}
	login() {
		var email = $('#email_login').val(),
			password = $('#password_login').val()
		this.popup_loading()
		api('public/api/login', 'login', {
			email: email,
			password: password
		},
		(data) => {
			if (data.state == 'success') {
				location.href = '?page=admin-homepage'
			} else {
				this.popup_infobox(data)
			}
		})
	}
	send_new_password() {
		this.popup_loading()
		api('public/api/login', 'send_new_password', {
			email: $('#email_new_password').val()
		},
		(data) => {
			this.popup_infobox(data)
		})
	}
	popup_loading() {
		$('.popup_infobox')
			.attr('class', 'popup_infobox msg_loading')
			.css('display', 'inline-block')
		template('.popup_infobox', '#template_loading')
	}
	popup_infobox(data) {	
		var state_class = data.state === 'success' ? 'msg_success' : 'msg_error'
		$('.popup_infobox')
			.html(data.msg)
			.css('display', 'inline-block')
			.attr('class', 'popup_infobox ' + state_class)
	}
}