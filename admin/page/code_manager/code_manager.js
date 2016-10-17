page.admin.code_manager = class {
	constructor(name) {
		template('#body', '#template_page_admin_' + name)
		this.manager_path = 'admin/api/code_manager.php'
		this.set_exclude_folder()
		this.get_ftp_view()
		this.order_exclude()
		new my_module.Action(this, {
			click: [
				'diff_dev_prod',
				'change_folder',
				'back_folder',
				'add_to_exclude',
				'show_database',
				'diff_dev_prod_database',
				'toggle_table',
				'toggle_table_prev'
			],
			enter: ['search']
		})
	}
	toggle_table_prev(elem) {
		this.toggle_table($(elem).prev('tr'))
	}
	set_exclude_folder() {
		$('#exclud_folders_input').val(
			$('#code_manager_main_exclude').html().trim()
		)
	}
	get_exclud_folders() {
		return $('#exclud_folders_input').val().trim().split("\n")
	}
	diff_dev_prod()
	{
		template('#result', '#template_loading')
		api(this.manager_path, 'get_ftp_diff_dev_prod', {
			folder: $('#code_manager_input_path').val(),
			exclud_folders: this.get_exclud_folders()
		},
		(data) => {
			$('#result').html(data)
		})
	}
	search() {
		template('#result', '#template_loading')
		api(this.manager_path, 'get_search_in_files', {
			to_find: $('#search_input').val(),
			folder: $('#code_manager_input_path').val(),
			exclud_folders: this.get_exclud_folders()
		},
		(data) => {
			$('#result').html(data)
		})
	}
	toggle_table(elem) {
		if ($(elem).next('tr').css('display') == 'none') {
			this.show_db_table(elem)
		} else {
			this.hide_db_table(elem)
		}
	}
	show_db_table(elem) {
		$(elem).next('tr').show()
		$(elem).css('border', 'none').find('td:first-child').css('padding', '10px')
	}
	hide_db_table(elem)
	{
		$(elem).next('tr').hide()
		$(elem)
			.css('border-bottom', '1px solid #ddd')
			.find('td:first-child')
			.css('padding', '0px 10px')
	}
	get_ftp_view() {
		var folder = $('#code_manager_input_path').val()
		this.load_ftp_view()
		api(this.manager_path, 'get_ftp_view', {
			folder: folder
		},
		(rows) => {
			template('#ftp_view', '#template_ftp_view', {
				rows: rows
			})
		})
	}
	load_ftp_view() {
		template('#ftp_view', '#template_loading')
	}
	load_result_view() {
		template('#result', '#template_loading')
	}
	change_folder(elem) {
		var folder = $(elem).data('path') 
		folder = ($('#code_manager_input_path').val() + '/' + folder).replace(/^\/+/,'')
		$('#code_manager_input_path').val(folder)
		this.get_ftp_view()
	}
	back_folder(elem) {
		var folder = $(elem).data('path')
		$('#code_manager_input_path').val(folder)
		this.get_ftp_view()
	}
	add_to_exclude(elem, event) {
		event.stopPropagation()
		var folder = $(elem).data('path')
		var path = folder = ($('#code_manager_input_path').val() + '/' + folder).replace(/^\/+/,'')
		$('#exclud_folders_input').val(
			$('#exclud_folders_input').val() + "\n" + path
		)
		this.order_exclude()
	}
	order_exclude() {
		var excludes_sorted = ''
		var excludes = unique($('#exclud_folders_input').val().trim().split("\n").sort())
		$.each(excludes, (key, val) => {
			excludes_sorted += val + "\n"
		})
		$('#exclud_folders_input').val(excludes_sorted.trim())
	}
	diff_dev_prod_database() {
		var html = ''
		this.load_result_view()
		api(this.manager_path, 'diff_dev_prod_database', {}, (data) => {
			$.each(data.databases, (key, database) => {
				html += '<h2>' + database.db_name + '</h2>'
				if (database.tables_only_dev.length > 0) {
					html += '<h3>' + database.nb_tables_only_dev + ' tables only on dev:</h3>'
					html += Mustache.render($('#template_table_db_classic').html(),
					{
						tables: database.tables_only_dev
					})
				}
				if (database.tables_only_prod.length > 0) {
					html += '<h3>' + database.nb_tables_only_prod + ' tables only on prod:</h3>'
					html += Mustache.render($('#template_table_db_classic').html(),
					{
						tables: database.tables_only_prod
					})
				}
				if (database.tables_diff_in.length > 0) {
					html += '<h3>' + database.nb_tables_diff_in + ' tables diff in:</h3>'
					html += Mustache.render($('#template_table_db_classic').html(),
					{
						tables: database.tables_diff_in
					})
				}
			})
			$('#result').html(html)
		})
	}
	show_database() {
		this.load_result_view()
		api(this.manager_path, 'show_database', {}, (data) => {
			var html = '<h2>' + data.databases.length + ' databases</h2>'
			$.each(data.databases, (key, database) => {
				html += '<h3>' + database.db_name + ' (' + database.tables.length + ' tables)</h3>'
				html += Mustache.render($('#template_table_db_classic').html(), {
					tables: database.tables
				})
			})
			$('#result').html(html)
		})
	}
}