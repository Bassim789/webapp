"use strict"
 
admin.Header = class extends Header
{
	constructor()
	{
		super()
	}

	event()
	{
		new module.Action(this,
		{
			click: [
				'toggle_sidr',
				'logout',
				'reset_auto_logout'
			]
		})
	}

	load()
	{
		template('header', '#template_admin_header',
		{
			logo: gvar.logo
		})
		this.load_backround_sidr()
	}

	reset_auto_logout()
	{
		app.Timeout.reset_auto_logout()
	}
	
	logout()
	{
		api('admin/api/admin', 'logout', {}, function()
		{
			location.href = 'login_to_admin'
		})
	}
}

