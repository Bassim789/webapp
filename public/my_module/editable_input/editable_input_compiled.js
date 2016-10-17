'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

my_module.Editable_input = function () {
	function _class(type) {
		_classCallCheck(this, _class);

		this.set_each_input();
		if (type === 'admin') {
			this.url = 'admin/api/editable_input';
		} else if (type === 'public') {
			this.url = 'public/api/editable_input';
		}
		new my_module.Action(this, {
			click: ['edit_input'],
			blur: ['save_editable_input']
		});
	}

	_createClass(_class, [{
		key: 'set_each_input',
		value: function set_each_input() {
			var that = this;
			$('.editable_input').each(function () {
				var val = $(this).data('val');
				if (val === '') {
					val = $(this).data('placeholder') || 'enter a value';
				}
				if ($(this).data('type') == 'textarea') {
					val = val.replace(/\n/g, '<br>');
				}
				$(this).html(val).on('click', function (event) {
					that.edit_input(this, event);
				});
			});
		}
	}, {
		key: 'edit_input',
		value: function edit_input(elem, event) {
			console.log('edit_input()');
			var that = this,
			    value = $(elem).data('val'),
			    id_row = $(elem).data('id-row'),
			    col = $(elem).data('col'),
			    type = $(elem).data('type'),
			    placeholder = $(elem).data('placeholder'),
			    table = $(elem).data('table'),
			    callback = $(elem).data('callback');
			// prevent action if click on same input already editable
			if ($(event.target).attr('class') == 'editable_input_editing' && $(event.target).data('table') == $(elem).data('table') && $(event.target).data('id-row') == $(elem).data('id-row') && $(event.target).data('col') == $(elem).data('col')) {
				return false;
			}
			if ($(elem).data('type') == 'text') {
				var input = $('<input>', {
					type: 'text',
					value: value,
					css: {
						width: '90%',
						padding: '10px'
					}
				});
			} else if ($(elem).data('type') == 'textarea') {
				var input = $('<textarea>', {
					html: value,
					css: {
						width: '100%',
						height: '200px'
					}
				});
			} else if ($(elem).data('type') == 'number') {
				var input = $('<input>', {
					type: 'number',
					value: value
				});
			} else if ($(elem).data('type') == 'price') {
				var input = $('<input>', {
					type: 'number',
					value: value
				});
			}
			input.attr('class', 'editable_input_editing').data('id-row', id_row).data('col', col).data('table', table).data('placeholder', placeholder).data('type', type).data('last-value', value).data('callback', callback).on('blur', function () {
				that.save_editable_input(this);
			});
			$(elem).html(input).find('.editable_input_editing').select();
		}
	}, {
		key: 'save_editable_input',
		value: function save_editable_input(elem) {
			var new_value = $(elem).val(),
			    new_value_br = new_value.replace(/\n/g, '<br>');
			if (new_value_br === '') {
				new_value_br = $(elem).data('placeholder') || 'enter a value';
			}
			if (new_value != $(elem).data('last-value')) {
				api(this.url, 'edit', {
					id_row: $(elem).data('id-row'),
					col: $(elem).data('col'),
					table: $(elem).data('table'),
					type: $(elem).data('type'),
					new_value: new_value
				}, function (data) {
					if ($(elem).data('callback') !== undefined) {
						eval($(elem).data('callback'));
					}
					$(elem).parent().html(new_value_br).data('val', new_value).data('last-value', new_value);
				});
			} else {
				$(elem).parent().html(new_value_br).data('val', new_value).data('last-value', new_value);
			}
		}
	}]);

	return _class;
}();
