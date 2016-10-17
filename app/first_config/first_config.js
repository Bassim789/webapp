var First_config = class {
	constructor() {
		template('#body', '#template_first_config', {
			title: gvar.title
		})
		this.url = 'app/first_config/first_config.php'
		this.form = $('#first_config_form')
		this.test_file_permission()
		new my_module.Action(this, {
			click: ['submit'],
			enter: ['submit']
		})
	}
	submit() {
		this.show_res({
			msg: 'loading...',
			state: 'load'
		})
		api(this.url, 'connect', this.form.serialize(), (data) => {
			this.show_res(data)
		})
	}
	show_res(data) {
		this.form.find('.form_response')
			.html(data.msg)
			.attr('class', 'form_response ' + data.state)
	}
	test_file_permission() {
		api(this.url, 'test_file_permission', {}, (data) => {
			if (data.file_permission_denied) {
				error_catcher.simple_msg('File permission denied')
			}
		})
	}
}