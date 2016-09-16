
var Error_catcher = class
{
	constructor()
	{
		this.catched = false
		this.event()
	}

	event()
	{
		var that = this
		
		window.onerror = function(message, url, lineNumber, colno, error)
		{ 
			that.show_error(message, url, lineNumber, colno, error)
			return true
		}
	}

	get_clean_stack(stack_str)
	{
		var domain = window.location.hostname + gvar.domain
		var stacks = []
		var details = stack_str.split('\n')

		$.each(details, function(i, detail)
		{
			if (i < 2){ return true }

			var obj = detail.split('(')[0].replace('at ', '')
			
			if (detail.includes(domain))
			{
				var url = detail.split(domain)[1].split(':')[0]
			}
			else
			{
				var url = detail.split('://')[1].split(':')[0]
			}

			var line = detail.split(url)[1].split(':')[1]

			stacks.push({
				obj: obj,
				url: url,
				line: line
			})
		})

		return stacks
	}

	error_api(url, message, stack)
	{
		$('#body').html(Mustache.render($('#template_error_catcher').html(),
        {
            url: url,
            message: message,
            stacks: this.get_clean_stack(stack)
        }))
	}

	show_error(message, url, lineNumber, colno, error)
	{
		if (this.catched)
		{
			return false
		}
		this.catched = true
		var domain = window.location.hostname + gvar.domain
		$('#body').html(Mustache.render($('#template_error_catcher').html(),
		{
			url: url.split(domain)[1],
			message: message + ' <strong>on line ' + lineNumber + '</strong>',
			stacks: this.get_clean_stack(error.stack)
		}))
	}
}

var error_catcher = new Error_catcher()
