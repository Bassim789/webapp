"use strict"

module.Action = class
{
	constructor(source, actions)
	{
		$.each(actions, function(action, events)
		{
			$.each(events, function(i, event)
			{
				if(action === 'enter')
				{
					$('body').on('keyup', '[event~="' + action + ':' + event + '"]', function(e)
				    {
				        if(e.which == 13)
						{
							return source[event](this, e)
						}
				    })
				}
				else if(action === 'keydown')
				{
					$('body').on(action, '[event~="' + action + ':' + event + '"]', function(e)
				    {
				        return source[event](this, e)
				    })
				}
				else
				{
					$('body').on(action, '[event~="' + action + ':' + event + '"]', function(e)
				    {
				        return source[event](this, e)
				    })
				}
			})
		})
	}
}