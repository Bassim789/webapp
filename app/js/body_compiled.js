'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

my_module.Body = function () {
	function _class() {
		_classCallCheck(this, _class);

		this.mobile_width_limite = 600;
		this.last_width = $(window).width();
		this.set_body_min_height();
		this.load_backround();
		this.event();
	}

	_createClass(_class, [{
		key: 'event',
		value: function event() {
			var _this = this;

			$(window).resize(function () {
				if (_this.last_width != $(window).width()) _this.reinit();
			});
		}
	}, {
		key: 'reinit',
		value: function reinit() {
			this.last_width = $(window).width();
			this.set_body_min_height();
			this.load_backround();
		}
	}, {
		key: 'set_body_min_height',
		value: function set_body_min_height() {
			$('#body_wrap').css('min-height', $(window).height() - 101 + 'px');
			$('.full_height_box').css('min-height', $(window).height() - 101 + 'px');
		}
	}, {
		key: 'load_backround',
		value: function load_backround() {
			var img_src = this.choose_background();
			$('<img/>').attr('src', img_src).load(function () {
				$(this).remove();
				$('#background').css({
					backgroundImage: 'url(' + img_src + ')',
					height: $(window).height() + 100
				}).fadeTo(700, 0.5);
			});
		}
	}, {
		key: 'choose_background',
		value: function choose_background() {
			if ($(window).width() < this.mobile_width_limite) {
				return gvar.img.default_mobile;
			} else {
				return gvar.img.default_desktop;
			}
		}
	}]);

	return _class;
}();
