"use strict"

module.Body = class
{
	constructor()
	{
		this.mobile_width_limite = 600
		this.last_width = $(window).width()
		this.set_body_min_height()
		this.load_backround()
		this.event()
	}

	event()
	{
		var that = this
		$(window).resize(function()
		{
			if (that.last_width != $(window).width())
			{
				that.reinit()	
			}
		})
	}

	reinit()
	{
		this.last_width = $(window).width()
		this.set_body_min_height()
		this.load_backround()
	}

	set_body_min_height()
	{
		$('#body_wrap').css('min-height', $(window).height() - 101 + 'px')
	}

	load_backround()
	{
		var img_src = this.choose_background()

		$('<img/>').attr('src', img_src).load(function()
		{
			$(this).remove()
			$('#background').css({
				backgroundImage: 'url(' + img_src + ')',
				height: $(window).height() + 100
			}).fadeTo(700, 1)
		})
	}

	choose_background()
	{
		if ($(window).width() < this.mobile_width_limite)
		{
			return gvar.background_image_mobile
		}
		else
		{
			return gvar.background_image_desktop
		}
	}
}


