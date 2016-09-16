"use strict"

var Footer = class
{
	constructor()
	{
		template('footer', '#template_footer',
		{
			title_footer: gvar.title_footer,
			year: new Date().getFullYear()
		})
	}
}