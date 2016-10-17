'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

my_module.Timeout = function () {
	function _class() {
		var _this = this;

		_classCallCheck(this, _class);

		this.count_down_logout();
		setInterval(function () {
			_this.count_down_logout();
		}, 1000);
	}

	_createClass(_class, [{
		key: 'reset_auto_logout',
		value: function reset_auto_logout() {
			api('admin/api/my_module/timeout/reset', '', {}, function (data) {
				//console.log(data);
			});
			$('#auto_logout_time').data('time', Math.round(new Date().getTime() / 1000));
			this.count_down_logout();
		}
	}, {
		key: 'clean',
		value: function clean(str) {
			if (str.toString().length == 1) {
				return '0' + str;
			}
			return str;
		}
	}, {
		key: 'count_down_logout',
		value: function count_down_logout() {
			var diff = Math.round(new Date().getTime() / 1000) - $('#auto_logout_time').data('time'),
			    last = 30 * 60,
			    rest = last - diff,
			    res;
			if (rest < 0) {
				res = 'PLEASE LOGIN';
			} else if (rest < 60) {
				res = '00:' + this.clean(rest);
			} else {
				var minute = Math.floor(rest / 60),
				    seconde = rest - 60 * minute;
				res = this.clean(minute) + ':' + this.clean(seconde);
			}
			$('#auto_logout_time').html(res);
		}
	}]);

	return _class;
}();
