'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

my_module.Magic_form = function () {
	function _class(page) {
		_classCallCheck(this, _class);

		this.page = page;
		this.set_each_form();
		new my_module.Action(this, {
			click: ['toggle_magic_form', 'close_magic_form'],
			enter: ['submit_magic_form']
		});
	}

	_createClass(_class, [{
		key: 'set_each_form',
		value: function set_each_form() {
			var that = this;
			$('.magic_form').each(function () {
				that.set_form($(this));
			});
		}
	}, {
		key: 'set_form',
		value: function set_form(form) {
			form.html(Mustache.render($('#template_magic_form').html(), {
				inputs: form.html(),
				text: form.data('text')
			}));
			form.css({ display: 'inline-block', marginBottom: '20px' }).attr('action', 'javascript:void(0)');
			var inputs = form.find('input');
			inputs.addClass('form_text_input').attr('event', 'enter:submit_magic_form');
		}
	}, {
		key: 'toggle_magic_form',
		value: function toggle_magic_form(elem) {
			if ($(elem).attr('open')) {
				this.submit_magic_form(elem);
			} else {
				this.open_magic_form(elem);
			}
		}
	}, {
		key: 'open_magic_form',
		value: function open_magic_form(elem) {
			var form = $(elem).closest('.magic_form'),
			    content = form.find('.magic_form_content');
			$(elem).css('width', '100%').attr('open', true);
			content.show();
			form.css({ display: 'block' });
		}
	}, {
		key: 'close_magic_form',
		value: function close_magic_form(elem) {
			var form = $(elem).closest('.magic_form'),
			    content = form.find('.magic_form_content'),
			    btn = form.find('.btn'),
			    info_box = form.find('.magic_form_info_box');
			btn.css('width', 'auto').attr('open', false);
			form.css({ display: 'inline-block' });
			content.hide();
			info_box.html('').attr('class', 'magic_form_info_box');
		}
	}, {
		key: 'submit_magic_form',
		value: function submit_magic_form(elem) {
			var _this = this;

			var form = $(elem).closest('.magic_form');
			this.popup_loading(form);
			api(form.data('url'), form.data('action'), form.serialize(), function (data) {
				_this.popup_infobox(form, data);
			});
		}
	}, {
		key: 'popup_loading',
		value: function popup_loading(form) {
			var info_box = form.find('.magic_form_info_box');
			info_box.attr('class', 'magic_form_info_box msg_loading').css('display', 'inline-block').html($('#template_loading').html());
		}
	}, {
		key: 'popup_infobox',
		value: function popup_infobox(form, data) {
			var info_box = form.find('.magic_form_info_box');
			info_box.html(data.msg).css('display', 'inline-block');
			if (data.state == 'error') {
				info_box.attr('class', 'magic_form_info_box msg_error');
			} else if (data.state == 'success') {
				info_box.attr('class', 'magic_form_info_box msg_success');
				console.log(form.data('callback'));
				if (form.data('callback') !== undefined) {
					this.page[form.data('callback')]();
				}
			}
		}
	}]);

	return _class;
}();
