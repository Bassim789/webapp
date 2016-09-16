"use strict"
 
page.admin.homepage = class
{
	constructor(name)
	{
		template('#body', '#template_page_admin_' + name)
		this.load()
		this.load_var()
		new module.Magic_form(this)
	}

	load()
	{
		api('admin/api/admin', 'get', {}, function(data)
		{
			$.each(data.admins, function(i, admin)
			{
				data.admins[i].email_left = admin.email.split('@')[0]
				data.admins[i].email_right = '@' + admin.email.split('@')[1]
			})

			$('#my_pseudo').html(data.my_pseudo)
			template('#admin_list_box', '#template_admin_list_box',
			{
				admins: data.admins
			})
		})
	}

	load_var()
	{
		api('admin/api/admin', 'get_var', {}, function(data)
		{
			template('#admin_var_box', '#template_admin_var',
			{
				var: data.var
			})

			new module.Editable_input('admin')
		})
	}
}