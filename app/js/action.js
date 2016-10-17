my_module.Action = class {
	constructor(source, actions) {
		this.each_action(source, actions)
	}
	each_action(source, actions) {
		$.each(actions, (action, events) => {
			$.each(events, (i, event) => {
				this.bind(source, action, event)
			})
		})
	}
	bind(source, action, event) {
		if (action === 'enter') {
			$('body').on('keyup', '[event~="' + action + ':' + event + '"]', function(e) {
				if (e.which == 13) {
					return source[event](this, e)
				}
			})
		} else if (action === 'keydown') {
			$('body').on(action, '[event~="' + action + ':' + event + '"]', function(e) {
				return source[event](this, e)
			})
		} else {
			$('body').on(action, '[event~="' + action + ':' + event + '"]', function(e) {
				return source[event](this, e)
			})
		}
	}
}