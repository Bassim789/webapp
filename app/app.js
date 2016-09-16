"use strict"

var page = {}
var module = {}
var admin = {}
page.admin = {}

var App = class
{
	constructor()
	{
		this.event()
		
		if (gvar.logged)
		{
			this.Header = new admin.Header()
			this.Footer = new admin.Footer()
			this.Timeout = new module.Timeout()
		}
		else
		{
			this.Header = new Header()
			this.Footer = new Footer()
		}

		this.Body = new module.Body()

		if (!gvar.configured)
		{
			new First_config()
		}
		else
		{
			this.load_page()
		}
	}

	event()
	{
		var that = this

		new module.Action(this,
		{
			click: ['goto']
		})

		$(window).on('popstate', function()
		{
		    that.popstate()
		})
	}

	goto(elem)
	{
		this.change_page($(elem).attr('page'))
	}

	change_page(page)
	{
		window.history.pushState('', '', gvar.domain + page)
		this.Header.close_sidr()
		this.load_page()
	}

	reset_event()
	{
		$('body').unbind()
		$(window).unbind()
		
		this.event()
		this.Header.event()
		this.Body.event()
		error_catcher.event()
	}

	popstate()
	{
		this.Header.close_sidr()
		this.load_page()
	}

	load_page()
	{	
		if (error_catcher.catched) return false

		this.reset_event()

		if (gvar.logged)
		{
			this.Timeout.reset_auto_logout()
		}

		var page_arg = getUrlParam('page')

		if (page_arg)
		{
			if (page_arg.startsWith('admin-'))
			{
				var new_url = gvar.domain + page_arg
			}
			else
			{
				var new_url = window.location.href
					.replace('?page=', '')
					.replace('&', '?')
			}

			window.history.replaceState ('', '', new_url)
		}

		var name = location.pathname
			.split(gvar.domain)[1]
			.replace(/\//g,'')
		name = name === '' ? 'index' : name

		if(name.startsWith('admin-'))
		{
			name = name.split('admin-')[1]
			new page.admin[name](name)
		}
		else
		{
			new page[name](name)
		}
	}
}
