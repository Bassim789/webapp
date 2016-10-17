var page = {admin: {}},
	admin = {},
	my_module = {},
	gvar = {}

var App = class {
	constructor() {
		this.on_first_page_loaded = true
		this.nb_file_loaded = 0
		this.nb_file_to_load = 0
		this.t0 = performance.now()
	}
	run() {
		var ie_browser = this.prevent_ie()
		if (ie_browser) return false
		api('app/php/load_ressources', '', {}, (data) => {
			gvar = data.gvar
			this.nb_file_to_load = data.files.length
			$('#shortcut_icon').attr('href', gvar.img.logo)
			$('#head_html_title').html(gvar.title)
			$('#head_html_description').attr('content', gvar.description)
			$('body').append(data.templates)
			this.load_files(data.files)
		})
	}
	load_files(files) {
		$.each(files, (key, file) => {
			if (file.type === 'js') {
				var script = document.createElement('script')
				script.setAttribute("type","text/javascript")
				script.setAttribute("src", file.url)
				document.getElementsByTagName('head')[0].appendChild(script)
			}
			else if (file.type === 'css') {
				var script = document.createElement("link")
				script.setAttribute("rel", "stylesheet")
				script.setAttribute("type", "text/css")
				script.setAttribute("href", file.url)
				$('head').prepend(script)
			}
			script.onload = () => {
				script.onload = null
				this.incremente_file_uploaded()
			}
		})
	}
	incremente_file_uploaded() {
		this.nb_file_loaded += 1
		if (this.nb_file_loaded === this.nb_file_to_load) {
			this.setup()
		}
	}
	setup() {
		this.event()
		$('.loading_splash_screen').fadeOut(1000)
		if (gvar.logged) {
			this.Header = new admin.Header()
			this.Footer = new admin.Footer()
			this.Timeout = new my_module.Timeout()
		} else {
			this.Header = new Header()
			this.Footer = new Footer()
		}
		this.Body = new my_module.Body()
		if (!gvar.configured) {
			new First_config()
		} else {
			this.load_page()
		}
	}
	event() {
		$(window).on('popstate', () => this.popstate())
		new my_module.Action(this, {
			click: ['goto']
		})
	}
	goto(elem) {
		this.change_page($(elem).attr('page'))
	}
	change_page(page) {
		$('#body').html('')
		window.history.pushState('', '', gvar.domain + page)
		this.Header.close_sidr()
		this.load_page()
		$(window).scrollTop()
	}
	reset_event() {
		$('body').unbind()
		$(window).unbind()
		this.event()
		this.Header.event()
		this.Body.event()
		error_catcher.event()
	}
	popstate() {
		this.Header.close_sidr()
		this.load_page()
	}
	load_page() {
		if (error_catcher.catched) return false
		this.reset_event()
		if (gvar.logged) {
			this.Timeout.reset_auto_logout()
		}
		var page_arg = getUrlParam('page')
		if (page_arg) {
			if (page_arg.startsWith('admin-')) {
				var new_url = gvar.domain + page_arg
			} else {
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
		if (name.startsWith('admin-')) {
			if (!gvar.logged) return this.change_page('login_to_admin')
			name = name.split('admin-')[1]
			new page.admin[name](name)
		} else {
			new page[name](name)
		}
		this.on_first_page_loaded = false
	}
	detect_ie() {
		var ua = window.navigator.userAgent
		return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0
	}
	prevent_ie() {
		if (this.detect_ie()){
			var msg = `<div style="text-align: center; width: 100%;">
						Internet explorer n'est pas pris en charge par ce site web.
						<br>
						Merci d'utiliser Chrome, Firefox ou Safari.</div>`
			$('#body').html(msg)
			$('.loading_splash_screen').fadeOut(1000)
			return true
		}
		return false
	}
}
var app = new App()
app.run()
