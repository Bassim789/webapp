"use strict"
 
var Header = class 
{
	constructor()
	{
		this.sidr_width = 260
		this.sidr_transition = 200
		this.elem_to_move = [
			'header',
			'#background',
			'#body_wrap',
			'footer'
		]
		this.event()
		this.load()
	}

	event()
	{
		new module.Action(this,
		{
			click: ['toggle_sidr']
		})
	}

	load()
	{
		template('header', '#template_header',
		{
			logo: gvar.logo
		})
		this.load_backround_sidr()
	}

	load_backround_sidr()
	{
		$('#sidr').css({ backgroundImage: 'url(' + gvar.background_image_sidr + ')' })
	}

	toggle_sidr()
	{
		var is_closed = $('#overlay_sidebar_menu').css('display') == 'none'
		is_closed ? this.open_sidr() : this.close_sidr()
	}

	open_sidr()
	{
		var that = this
		var full_height = Math.max($(document).height(), $(window).height())
    	$('#overlay_sidebar_menu')
    		.show()
    		.css({
	    		height: full_height + 'px',
	    		opacity: 0.0
	    	})
	    	.animate({opacity: 0.7}, this.sidr_transition)

    	$.each(this.elem_to_move, function(i, elem)
    	{
    		$(elem).animate({right: that.sidr_width + "px"}, that.sidr_transition)
    	})

    	$('#menu_icon').animate({opacity: 0.0,}, this.sidr_transition)
	}

	close_sidr()
	{
		var that = this
		$('#overlay_sidebar_menu')
			.css({opacity: 0.7})
			.animate({opacity: 0.0},
	    	{
	    		duration: this.sidr_transition,
	            complete: function()
	            {
	                $('#overlay_sidebar_menu').hide()
	            }
	    	})

    	$.each(this.elem_to_move, function(i, elem)
    	{
    		$(elem).animate({right: "0px"}, that.sidr_transition)
    	})

		$('#menu_icon').animate({opacity: 1.0,}, this.sidr_transition)
	}
}

