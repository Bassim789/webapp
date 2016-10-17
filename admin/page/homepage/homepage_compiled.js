'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

page.admin.homepage = function () {
	function _class(name) {
		_classCallCheck(this, _class);

		template('#body', '#template_page_admin_' + name);
		this.load();
		this.load_var();
		new my_module.Magic_form(this);
	}

	_createClass(_class, [{
		key: 'load',
		value: function load() {
			api('admin/api/admin', 'get', {}, function (data) {
				$.each(data.admins, function (i, admin) {
					data.admins[i].email_left = admin.email.split('@')[0];
					data.admins[i].email_right = '@' + admin.email.split('@')[1];
				});
				$('#my_pseudo').html(data.my_pseudo);
				template('#admin_list_box', '#template_admin_list_box', {
					admins: data.admins
				});
			});
		}
	}, {
		key: 'load_var',
		value: function load_var() {
			api('admin/api/admin', 'get_var', {}, function (data) {
				template('#admin_var_box', '#template_admin_var', {
					var: data.var
				});
				new my_module.Editable_input('admin');
			});
		}
	}]);

	return _class;
}();
