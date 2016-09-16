"use strict"
 
module.Magic_form = class
{
	constructor(page)
	{
		this.page = page
		this.set_each_form()
		new module.Action(this,
		{
			click:[
				'toggle_magic_form',
				'close_magic_form'
			],
			enter: ['submit_magic_form']
		})
	}

	set_each_form()
	{
		var that = this
		$('.magic_form').each(function()
		{
			that.set_form($(this))
		})
	}

	set_form(form)
	{
		form.html(Mustache.render($('#template_magic_form').html(),
		{
			inputs: form.html(),
			text: form.data('text')
		}))

		form.css({display: 'inline-block', marginBottom: '20px'})
			.attr('action', 'javascript:void(0)')

		var inputs = form.find('input')
		inputs	.addClass('form_text_input')
				.attr('event', 'enter:submit_magic_form')
	}

	toggle_magic_form(elem)
	{
		if ($(elem).attr('open'))
		{
			this.submit_magic_form(elem)
		}
		else
		{
			this.open_magic_form(elem)
		}
	}

	open_magic_form(elem)
	{
		var form = $(elem).closest('.magic_form')
		var content = form.find('.magic_form_content')

		$(elem)	.css('width', '100%')
				.attr('open', true)

		content.show()
		form.css({display: 'block'})
	}

	close_magic_form(elem)
	{
		var form = $(elem).closest('.magic_form')
		var content = form.find('.magic_form_content')
		var btn = form.find('.btn')
		var info_box = form.find('.magic_form_info_box')

		btn	.css('width', 'auto').attr('open', false)
		form.css({display: 'inline-block'})
		content.hide()
		info_box.html('').attr('class', 'magic_form_info_box')
	}

	submit_magic_form(elem)
	{
		var that = this
		var form = $(elem).closest('.magic_form')
		this.popup_loading(form)
		api(form.data('url'), form.data('action'), form.serialize(), function(data)
		{
			that.popup_infobox(form, data)
		})
	}

	popup_loading(form)
	{
		var info_box = form.find('.magic_form_info_box')
		info_box
			.attr('class', 'magic_form_info_box msg_loading')
			.css('display', 'inline-block')
			.html($('#template_loading').html())
	}

	popup_infobox(form, data)
	{
		var info_box = form.find('.magic_form_info_box')

		info_box
			.html(data.msg)
			.css('display', 'inline-block')
			
		if (data.state == 'error')
		{
			info_box.attr('class', 'magic_form_info_box msg_error')
		}
		else if (data.state == 'success')
		{
			info_box.attr('class', 'magic_form_info_box msg_success')

			console.log(form.data('callback'))
			if (form.data('callback') !== undefined)
			{
				this.page[form.data('callback')]()
			}
		}
	}
}
