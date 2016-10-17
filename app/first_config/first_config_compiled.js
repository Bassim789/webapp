'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var First_config = function () {
	function First_config() {
		_classCallCheck(this, First_config);

		template('#body', '#template_first_config', {
			title: gvar.title
		});
		this.url = 'app/first_config/first_config.php';
		this.form = $('#first_config_form');
		this.test_file_permission();
		new my_module.Action(this, {
			click: ['submit'],
			enter: ['submit']
		});
	}

	_createClass(First_config, [{
		key: 'submit',
		value: function submit() {
			var _this = this;

			this.show_res({
				msg: 'loading...',
				state: 'load'
			});
			api(this.url, 'connect', this.form.serialize(), function (data) {
				_this.show_res(data);
			});
		}
	}, {
		key: 'show_res',
		value: function show_res(data) {
			this.form.find('.form_response').html(data.msg).attr('class', 'form_response ' + data.state);
		}
	}, {
		key: 'test_file_permission',
		value: function test_file_permission() {
			api(this.url, 'test_file_permission', {}, function (data) {
				if (data.file_permission_denied) {
					error_catcher.simple_msg('File permission denied');
				}
			});
		}
	}]);

	return First_config;
}();
