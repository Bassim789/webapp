'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

page.index = function () {
	function _class(name) {
		_classCallCheck(this, _class);

		this.delay = app.on_first_page_loaded ? 1000 : 0;
		template('#body', '#template_page_index', {
			title: gvar.title,
			title_homepage: gvar.title_homepage,
			logo: gvar.img.logo
		});
		app.Body.set_body_min_height();
		this.show_first_section();
		this.hide_first_section_on_scroll();
	}

	_createClass(_class, [{
		key: 'show_first_section',
		value: function show_first_section() {
			$('.fixed_full').css({ opacity: 0 });
			setTimeout(function () {
				$('.fixed_full').animate({
					opacity: 1
				}, 1500);
			}, this.delay);
		}
	}, {
		key: 'hide_first_section_on_scroll',
		value: function hide_first_section_on_scroll() {
			var wh = $(window).height();
			$(window).scroll(function () {
				var ws = $(window).scrollTop();
				$('.fixed_full').css({
					opacity: Math.max((wh - 2 * ws) / wh, 0)
				});
			});
		}
	}]);

	return _class;
}();
