"use strict"

page.admin.design = class
{
	constructor(name)
	{
		this.load()
		new module.Upload(function(url)
		{
			if (url.includes('default_desktop'))
			{
				gvar.background_image_desktop = url
				app.Body.load_backround()
			}
			else if (url.includes('default_mobile'))
			{
				gvar.background_image_mobile = url
				app.Body.load_backround()
			}
			else if (url.includes('default_sidr'))
			{
				gvar.background_image_sidr = url
				app.Header.load()
				app.Timeout.reset_auto_logout()
			}
			else if (url.includes('header/logo'))
			{
				gvar.logo = url
				app.Header.load()
				app.Timeout.reset_auto_logout()
			}
		})
	}

	load()
	{
		template('#body', '#template_page_admin_design',
		{
			img_desktop: gvar.background_image_desktop,
			img_mobile: gvar.background_image_mobile,
			img_sidr: gvar.background_image_sidr,
			img_logo: gvar.logo
		})
	}
}

