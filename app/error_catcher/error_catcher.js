var Error_catcher = class {
	constructor() {
		this.catched = false
		this.event()
	}
	event() {
		window.onerror = (message, url, lineNumber, colno, error) => { 
			this.show_error(message, url, lineNumber, colno, error)
			return true
		}
	}
	get_clean_stack(stack_str) {
		var domain = window.location.hostname,
			stacks = []
		if (stack_str !== undefined) {
			var details = stack_str.split('\n')
			$.each(details, (i, detail) => {
				if (i < 2) return false
				if (detail === undefined) return false
				var obj = detail.split('(')[0].replace('at ', '')
				if (detail.includes(domain)) {
					var url = detail.split(domain)[1].split(':')[0]
				} else {
					var url = detail.split('://')[1].split(':')[0]
				}
				var line = detail.split(url)[1].split(':')[1]
				stacks.push({
					obj: obj,
					url: url,
					line: line
				})
			})
		}
		return stacks
	}
	simple_msg(msg) {
		this.error_api('', msg, '')
	}
	error_api(url, message, stack) {
		console.log(message)
		console.log(stack)
		if (this.catched) return false
		this.catched = true
		$.get('app/error_catcher/error_catcher.html', (error_template) => {
			$('#error_catcher_box').html(Mustache.render(error_template, {
				url: url,
				message: message,
				stacks: this.get_clean_stack(stack)
			}))
			$('.loading_splash_screen').fadeOut(1000)
			$('#error_catcher_box').fadeIn(1000)
		})
	}
	show_error(message, url, lineNumber, colno, error) {
		var domain = window.location.hostname,
			stacks = error !== null ? error.stack : ''
		console.log(stacks)
		console.log('line: ' + lineNumber)
		if (this.catched) return false
		this.catched = true
		$.get('app/error_catcher/error_catcher.html', (error_template) => {
			$('#error_catcher_box').html(Mustache.render(error_template, {
				url: url.split(domain)[1],
				message: message + ' <strong>on line ' + lineNumber + '</strong>',
				stacks: this.get_clean_stack(stacks)
			}))
			$('.loading_splash_screen').fadeOut(1000)
			$('#error_catcher_box').fadeIn(1000)
		})
	}
}
var error_catcher = new Error_catcher()