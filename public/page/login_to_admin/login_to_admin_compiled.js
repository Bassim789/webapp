'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

page.login_to_admin = function () {
	function _class(name) {
		_classCallCheck(this, _class);

		template('#body', '#template_page_login_to_admin');
		template('#login_box', '#template_login');
		new my_module.Action(this, {
			click: ['login', 'send_new_password', 'reset_password_box', 'login_box'],
			enter: ['login', 'send_new_password']
		});
	}

	_createClass(_class, [{
		key: 'login_box',
		value: function login_box() {
			this.clean_info_box();
			template('#login_box', '#template_login', {
				email: $('#email_new_password').val()
			});
		}
	}, {
		key: 'reset_password_box',
		value: function reset_password_box() {
			this.clean_info_box();
			template('#login_box', '#template_login_reset_password', {
				email: $('#email_login').val()
			});
		}
	}, {
		key: 'clean_info_box',
		value: function clean_info_box() {
			$('.popup_infobox').html('').attr('class', 'popup_infobox');
		}
	}, {
		key: 'login',
		value: function login() {
			var _this = this;

			var email = $('#email_login').val(),
			    password = $('#password_login').val();
			this.popup_loading();
			api('public/api/login', 'login', {
				email: email,
				password: password
			}, function (data) {
				if (data.state == 'success') {
					location.href = '?page=admin-homepage';
				} else {
					_this.popup_infobox(data);
				}
			});
		}
	}, {
		key: 'send_new_password',
		value: function send_new_password() {
			var _this2 = this;

			this.popup_loading();
			api('public/api/login', 'send_new_password', {
				email: $('#email_new_password').val()
			}, function (data) {
				_this2.popup_infobox(data);
			});
		}
	}, {
		key: 'popup_loading',
		value: function popup_loading() {
			$('.popup_infobox').attr('class', 'popup_infobox msg_loading').css('display', 'inline-block');
			template('.popup_infobox', '#template_loading');
		}
	}, {
		key: 'popup_infobox',
		value: function popup_infobox(data) {
			var state_class = data.state === 'success' ? 'msg_success' : 'msg_error';
			$('.popup_infobox').html(data.msg).css('display', 'inline-block').attr('class', 'popup_infobox ' + state_class);
		}
	}]);

	return _class;
}();
