"use strict"

admin.Footer = class
{
	constructor()
	{
		template('footer', '#template_admin_footer',
		{
			title_footer: gvar.title_footer,
			year: new Date().getFullYear()
		})
	}
}