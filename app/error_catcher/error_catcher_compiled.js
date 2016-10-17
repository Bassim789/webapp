'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Error_catcher = function () {
	function Error_catcher() {
		_classCallCheck(this, Error_catcher);

		this.catched = false;
		this.event();
	}

	_createClass(Error_catcher, [{
		key: 'event',
		value: function event() {
			var _this = this;

			window.onerror = function (message, url, lineNumber, colno, error) {
				_this.show_error(message, url, lineNumber, colno, error);
				return true;
			};
		}
	}, {
		key: 'get_clean_stack',
		value: function get_clean_stack(stack_str) {
			var domain = window.location.hostname,
			    stacks = [];
			if (stack_str !== undefined) {
				var details = stack_str.split('\n');
				$.each(details, function (i, detail) {
					if (i < 2) return false;
					if (detail === undefined) return false;
					var obj = detail.split('(')[0].replace('at ', '');
					if (detail.includes(domain)) {
						var url = detail.split(domain)[1].split(':')[0];
					} else {
						var url = detail.split('://')[1].split(':')[0];
					}
					var line = detail.split(url)[1].split(':')[1];
					stacks.push({
						obj: obj,
						url: url,
						line: line
					});
				});
			}
			return stacks;
		}
	}, {
		key: 'simple_msg',
		value: function simple_msg(msg) {
			this.error_api('', msg, '');
		}
	}, {
		key: 'error_api',
		value: function error_api(url, message, stack) {
			var _this2 = this;

			console.log(message);
			console.log(stack);
			if (this.catched) return false;
			this.catched = true;
			$.get('app/error_catcher/error_catcher.html', function (error_template) {
				$('#error_catcher_box').html(Mustache.render(error_template, {
					url: url,
					message: message,
					stacks: _this2.get_clean_stack(stack)
				}));
				$('.loading_splash_screen').fadeOut(1000);
				$('#error_catcher_box').fadeIn(1000);
			});
		}
	}, {
		key: 'show_error',
		value: function show_error(message, url, lineNumber, colno, error) {
			var _this3 = this;

			var domain = window.location.hostname,
			    stacks = error !== null ? error.stack : '';
			console.log(stacks);
			console.log('line: ' + lineNumber);
			if (this.catched) return false;
			this.catched = true;
			$.get('app/error_catcher/error_catcher.html', function (error_template) {
				$('#error_catcher_box').html(Mustache.render(error_template, {
					url: url.split(domain)[1],
					message: message + ' <strong>on line ' + lineNumber + '</strong>',
					stacks: _this3.get_clean_stack(stacks)
				}));
				$('.loading_splash_screen').fadeOut(1000);
				$('#error_catcher_box').fadeIn(1000);
			});
		}
	}]);

	return Error_catcher;
}();
var error_catcher = new Error_catcher();
