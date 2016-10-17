'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

my_module.Action = function () {
	function _class(source, actions) {
		_classCallCheck(this, _class);

		this.each_action(source, actions);
	}

	_createClass(_class, [{
		key: 'each_action',
		value: function each_action(source, actions) {
			var _this = this;

			$.each(actions, function (action, events) {
				$.each(events, function (i, event) {
					_this.bind(source, action, event);
				});
			});
		}
	}, {
		key: 'bind',
		value: function bind(source, action, event) {
			if (action === 'enter') {
				$('body').on('keyup', '[event~="' + action + ':' + event + '"]', function (e) {
					if (e.which == 13) {
						return source[event](this, e);
					}
				});
			} else if (action === 'keydown') {
				$('body').on(action, '[event~="' + action + ':' + event + '"]', function (e) {
					return source[event](this, e);
				});
			} else {
				$('body').on(action, '[event~="' + action + ':' + event + '"]', function (e) {
					return source[event](this, e);
				});
			}
		}
	}]);

	return _class;
}();
