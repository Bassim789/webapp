'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

page.admin.code_manager = function () {
	function _class(name) {
		_classCallCheck(this, _class);

		template('#body', '#template_page_admin_' + name);
		this.manager_path = 'admin/api/code_manager.php';
		this.set_exclude_folder();
		this.get_ftp_view();
		this.order_exclude();
		new my_module.Action(this, {
			click: ['diff_dev_prod', 'change_folder', 'back_folder', 'add_to_exclude', 'show_database', 'diff_dev_prod_database', 'toggle_table', 'toggle_table_prev'],
			enter: ['search']
		});
	}

	_createClass(_class, [{
		key: 'toggle_table_prev',
		value: function toggle_table_prev(elem) {
			this.toggle_table($(elem).prev('tr'));
		}
	}, {
		key: 'set_exclude_folder',
		value: function set_exclude_folder() {
			$('#exclud_folders_input').val($('#code_manager_main_exclude').html().trim());
		}
	}, {
		key: 'get_exclud_folders',
		value: function get_exclud_folders() {
			return $('#exclud_folders_input').val().trim().split("\n");
		}
	}, {
		key: 'diff_dev_prod',
		value: function diff_dev_prod() {
			template('#result', '#template_loading');
			api(this.manager_path, 'get_ftp_diff_dev_prod', {
				folder: $('#code_manager_input_path').val(),
				exclud_folders: this.get_exclud_folders()
			}, function (data) {
				$('#result').html(data);
			});
		}
	}, {
		key: 'search',
		value: function search() {
			template('#result', '#template_loading');
			api(this.manager_path, 'get_search_in_files', {
				to_find: $('#search_input').val(),
				folder: $('#code_manager_input_path').val(),
				exclud_folders: this.get_exclud_folders()
			}, function (data) {
				$('#result').html(data);
			});
		}
	}, {
		key: 'toggle_table',
		value: function toggle_table(elem) {
			if ($(elem).next('tr').css('display') == 'none') {
				this.show_db_table(elem);
			} else {
				this.hide_db_table(elem);
			}
		}
	}, {
		key: 'show_db_table',
		value: function show_db_table(elem) {
			$(elem).next('tr').show();
			$(elem).css('border', 'none').find('td:first-child').css('padding', '10px');
		}
	}, {
		key: 'hide_db_table',
		value: function hide_db_table(elem) {
			$(elem).next('tr').hide();
			$(elem).css('border-bottom', '1px solid #ddd').find('td:first-child').css('padding', '0px 10px');
		}
	}, {
		key: 'get_ftp_view',
		value: function get_ftp_view() {
			var folder = $('#code_manager_input_path').val();
			this.load_ftp_view();
			api(this.manager_path, 'get_ftp_view', {
				folder: folder
			}, function (rows) {
				template('#ftp_view', '#template_ftp_view', {
					rows: rows
				});
			});
		}
	}, {
		key: 'load_ftp_view',
		value: function load_ftp_view() {
			template('#ftp_view', '#template_loading');
		}
	}, {
		key: 'load_result_view',
		value: function load_result_view() {
			template('#result', '#template_loading');
		}
	}, {
		key: 'change_folder',
		value: function change_folder(elem) {
			var folder = $(elem).data('path');
			folder = ($('#code_manager_input_path').val() + '/' + folder).replace(/^\/+/, '');
			$('#code_manager_input_path').val(folder);
			this.get_ftp_view();
		}
	}, {
		key: 'back_folder',
		value: function back_folder(elem) {
			var folder = $(elem).data('path');
			$('#code_manager_input_path').val(folder);
			this.get_ftp_view();
		}
	}, {
		key: 'add_to_exclude',
		value: function add_to_exclude(elem, event) {
			event.stopPropagation();
			var folder = $(elem).data('path');
			var path = folder = ($('#code_manager_input_path').val() + '/' + folder).replace(/^\/+/, '');
			$('#exclud_folders_input').val($('#exclud_folders_input').val() + "\n" + path);
			this.order_exclude();
		}
	}, {
		key: 'order_exclude',
		value: function order_exclude() {
			var excludes_sorted = '';
			var excludes = unique($('#exclud_folders_input').val().trim().split("\n").sort());
			$.each(excludes, function (key, val) {
				excludes_sorted += val + "\n";
			});
			$('#exclud_folders_input').val(excludes_sorted.trim());
		}
	}, {
		key: 'diff_dev_prod_database',
		value: function diff_dev_prod_database() {
			var html = '';
			this.load_result_view();
			api(this.manager_path, 'diff_dev_prod_database', {}, function (data) {
				$.each(data.databases, function (key, database) {
					html += '<h2>' + database.db_name + '</h2>';
					if (database.tables_only_dev.length > 0) {
						html += '<h3>' + database.nb_tables_only_dev + ' tables only on dev:</h3>';
						html += Mustache.render($('#template_table_db_classic').html(), {
							tables: database.tables_only_dev
						});
					}
					if (database.tables_only_prod.length > 0) {
						html += '<h3>' + database.nb_tables_only_prod + ' tables only on prod:</h3>';
						html += Mustache.render($('#template_table_db_classic').html(), {
							tables: database.tables_only_prod
						});
					}
					if (database.tables_diff_in.length > 0) {
						html += '<h3>' + database.nb_tables_diff_in + ' tables diff in:</h3>';
						html += Mustache.render($('#template_table_db_classic').html(), {
							tables: database.tables_diff_in
						});
					}
				});
				$('#result').html(html);
			});
		}
	}, {
		key: 'show_database',
		value: function show_database() {
			this.load_result_view();
			api(this.manager_path, 'show_database', {}, function (data) {
				var html = '<h2>' + data.databases.length + ' databases</h2>';
				$.each(data.databases, function (key, database) {
					html += '<h3>' + database.db_name + ' (' + database.tables.length + ' tables)</h3>';
					html += Mustache.render($('#template_table_db_classic').html(), {
						tables: database.tables
					});
				});
				$('#result').html(html);
			});
		}
	}]);

	return _class;
}();
