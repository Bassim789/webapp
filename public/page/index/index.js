page.index = class {
	constructor(name) {
		this.delay = app.on_first_page_loaded ? 1000 : 0
		template('#body', '#template_page_index', {
			title: gvar.title,
			title_homepage: gvar.title_homepage,
			logo: gvar.img.logo,
		})
		app.Body.set_body_min_height()
		this.show_first_section()
		this.hide_first_section_on_scroll()
	}
	show_first_section() {
		$('.fixed_full').css({opacity: 0})
		setTimeout(() => {
			$('.fixed_full').animate({
				opacity: 1
			}, 1500)
		}, this.delay)
	}
	hide_first_section_on_scroll() {
		var wh = $(window).height()
		$(window).scroll(() => {
			var ws = $(window).scrollTop()
			$('.fixed_full').css({
				opacity: Math.max((wh - (2 * ws)) / wh, 0)
			})
		})
	}
}