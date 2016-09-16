"use strict"

var First_config = class
{
	constructor()
	{
		template('#body', '#template_first_config',
		{
			title: gvar.title
		})

		this.url = 'app/first_config/first_config.php'
		this.form = $('#first_config_form')

		new module.Action(this,
		{
			click: ['submit'],
			enter: ['submit']
		})
	}

	submit()
	{
		var that = this
		this.show_res({
			msg: 'loading...',
			state: 'load'
		})
		console.log('ok')
		api(this.url, 'connect', this.form.serialize(), function(data)
		{
			that.show_res(data)
		})
	}

	show_res(data)
	{
		this.form.find('.form_response')
			.html(data.msg)
			.attr('class', 'form_response ' + data.state)
	}
}