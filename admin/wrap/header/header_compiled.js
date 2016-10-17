'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

admin.Header = function (_Header) {
	_inherits(_class, _Header);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));
	}

	_createClass(_class, [{
		key: 'event',
		value: function event() {
			new my_module.Action(this, {
				click: ['toggle_sidr', 'logout', 'reset_auto_logout']
			});
		}
	}, {
		key: 'load',
		value: function load() {
			template('header', '#template_admin_header', {
				logo: gvar.img.logo
			});
			this.load_backround_sidr();
		}
	}, {
		key: 'reset_auto_logout',
		value: function reset_auto_logout() {
			app.Timeout.reset_auto_logout();
		}
	}, {
		key: 'logout',
		value: function logout() {
			api('admin/api/admin', 'logout', {}, function () {
				location.href = 'login_to_admin';
			});
		}
	}]);

	return _class;
}(Header);
