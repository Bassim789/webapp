'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {
	function Header() {
		_classCallCheck(this, Header);

		this.sidr_width = 260;
		this.sidr_transition = 200;
		this.elem_to_move = ['header', '#background', '#body_wrap', 'footer', '.full_height_box'];
		this.event();
		this.load();
	}

	_createClass(Header, [{
		key: 'event',
		value: function event() {
			new my_module.Action(this, {
				click: ['toggle_sidr']
			});
		}
	}, {
		key: 'load',
		value: function load() {
			template('header', '#template_header', {
				logo: gvar.img.logo
			});
			this.load_backround_sidr();
		}
	}, {
		key: 'load_backround_sidr',
		value: function load_backround_sidr() {
			$('#sidr_background').css({ backgroundImage: 'url(' + gvar.img.default_sidr + ')' });
		}
	}, {
		key: 'toggle_sidr',
		value: function toggle_sidr() {
			var is_closed = $('#overlay_sidebar_menu').css('display') == 'none';
			is_closed ? this.open_sidr() : this.close_sidr();
		}
	}, {
		key: 'open_sidr',
		value: function open_sidr() {
			var _this = this;

			var full_height = Math.max($(document).height(), $(window).height());
			$('#overlay_sidebar_menu').show().css({
				height: full_height + 'px',
				opacity: 0.0
			}).animate({ opacity: 0.7 }, this.sidr_transition);
			$.each(this.elem_to_move, function (i, elem) {
				$(elem).animate({ right: _this.sidr_width + "px" }, _this.sidr_transition);
			});
			$('.menu_btn').animate({ opacity: 0.0 }, this.sidr_transition);
		}
	}, {
		key: 'close_sidr',
		value: function close_sidr() {
			var _this2 = this;

			$('#overlay_sidebar_menu').css({ opacity: 0.7 }).animate({ opacity: 0.0 }, {
				duration: this.sidr_transition,
				complete: function complete() {
					$('#overlay_sidebar_menu').hide();
				}
			});
			$.each(this.elem_to_move, function (i, elem) {
				$(elem).animate({ right: "0px" }, _this2.sidr_transition);
			});
			$('.menu_btn').animate({ opacity: 1.0 }, this.sidr_transition);
		}
	}]);

	return Header;
}();
