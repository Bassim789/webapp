'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var page = { admin: {} },
    admin = {},
    my_module = {},
    gvar = {};

var App = function () {
	function App() {
		_classCallCheck(this, App);

		this.on_first_page_loaded = true;
		this.nb_file_loaded = 0;
		this.nb_file_to_load = 0;
		this.t0 = performance.now();
	}

	_createClass(App, [{
		key: 'run',
		value: function run() {
			var _this = this;

			var ie_browser = this.prevent_ie();
			if (ie_browser) return false;
			api('app/php/load_ressources', '', {}, function (data) {
				gvar = data.gvar;
				_this.nb_file_to_load = data.files.length;
				$('#shortcut_icon').attr('href', gvar.img.logo);
				$('#head_html_title').html(gvar.title);
				$('#head_html_description').attr('content', gvar.description);
				$('body').append(data.templates);
				_this.load_files(data.files);
			});
		}
	}, {
		key: 'load_files',
		value: function load_files(files) {
			var _this2 = this;

			$.each(files, function (key, file) {
				if (file.type === 'js') {
					var script = document.createElement('script');
					script.setAttribute("type", "text/javascript");
					script.setAttribute("src", file.url);
					document.getElementsByTagName('head')[0].appendChild(script);
				} else if (file.type === 'css') {
					var script = document.createElement("link");
					script.setAttribute("rel", "stylesheet");
					script.setAttribute("type", "text/css");
					script.setAttribute("href", file.url);
					$('head').prepend(script);
				}
				script.onload = function () {
					script.onload = null;
					_this2.incremente_file_uploaded();
				};
			});
		}
	}, {
		key: 'incremente_file_uploaded',
		value: function incremente_file_uploaded() {
			this.nb_file_loaded += 1;
			if (this.nb_file_loaded === this.nb_file_to_load) {
				this.setup();
			}
		}
	}, {
		key: 'setup',
		value: function setup() {
			this.event();
			$('.loading_splash_screen').fadeOut(1000);
			if (gvar.logged) {
				this.Header = new admin.Header();
				this.Footer = new admin.Footer();
				this.Timeout = new my_module.Timeout();
			} else {
				this.Header = new Header();
				this.Footer = new Footer();
			}
			this.Body = new my_module.Body();
			if (!gvar.configured) {
				new First_config();
			} else {
				this.load_page();
			}
		}
	}, {
		key: 'event',
		value: function event() {
			var _this3 = this;

			$(window).on('popstate', function () {
				return _this3.popstate();
			});
			new my_module.Action(this, {
				click: ['goto']
			});
		}
	}, {
		key: 'goto',
		value: function goto(elem) {
			this.change_page($(elem).attr('page'));
		}
	}, {
		key: 'change_page',
		value: function change_page(page) {
			$('#body').html('');
			window.history.pushState('', '', gvar.domain + page);
			this.Header.close_sidr();
			this.load_page();
			$(window).scrollTop();
		}
	}, {
		key: 'reset_event',
		value: function reset_event() {
			$('body').unbind();
			$(window).unbind();
			this.event();
			this.Header.event();
			this.Body.event();
			error_catcher.event();
		}
	}, {
		key: 'popstate',
		value: function popstate() {
			this.Header.close_sidr();
			this.load_page();
		}
	}, {
		key: 'load_page',
		value: function load_page() {
			if (error_catcher.catched) return false;
			this.reset_event();
			if (gvar.logged) {
				this.Timeout.reset_auto_logout();
			}
			var page_arg = getUrlParam('page');
			if (page_arg) {
				if (page_arg.startsWith('admin-')) {
					var new_url = gvar.domain + page_arg;
				} else {
					var new_url = window.location.href.replace('?page=', '').replace('&', '?');
				}
				window.history.replaceState('', '', new_url);
			}
			var name = location.pathname.split(gvar.domain)[1].replace(/\//g, '');
			name = name === '' ? 'index' : name;
			if (name.startsWith('admin-')) {
				if (!gvar.logged) return this.change_page('login_to_admin');
				name = name.split('admin-')[1];
				new page.admin[name](name);
			} else {
				new page[name](name);
			}
			this.on_first_page_loaded = false;
		}
	}, {
		key: 'detect_ie',
		value: function detect_ie() {
			var ua = window.navigator.userAgent;
			return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0;
		}
	}, {
		key: 'prevent_ie',
		value: function prevent_ie() {
			if (this.detect_ie()) {
				var msg = '<div style="text-align: center; width: 100%;">\n\t\t\t\t\t\tInternet explorer n\'est pas pris en charge par ce site web.\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\tMerci d\'utiliser Chrome, Firefox ou Safari.</div>';
				$('#body').html(msg);
				$('.loading_splash_screen').fadeOut(1000);
				return true;
			}
			return false;
		}
	}]);

	return App;
}();
var app = new App();
app.run();
