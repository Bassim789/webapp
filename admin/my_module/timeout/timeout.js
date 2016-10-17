my_module.Timeout = class {
	constructor() {
		this.count_down_logout()
		setInterval(() => { 
			this.count_down_logout()
		}, 1000)
	}
	reset_auto_logout() {
		api('admin/api/my_module/timeout/reset', '', {}, (data) => {
			//console.log(data);
		})
		$('#auto_logout_time').data('time', Math.round(new Date().getTime()/1000))
		this.count_down_logout()
	}
	clean(str) {
		if(str.toString().length == 1) {
			return '0' + str
		}
		return str
	}
	count_down_logout() {
		var diff = Math.round(new Date().getTime() / 1000) - $('#auto_logout_time').data('time'),
			last = 30 * 60,
			rest = last - diff,
			res
		if (rest < 0) {
			res = 'PLEASE LOGIN'
		} else if(rest < 60) {
			res = '00:' + this.clean(rest)
		} else {
			var minute = Math.floor(rest / 60),
				seconde = rest - 60 * minute
			res = this.clean(minute) + ':' + this.clean(seconde)
		}
		$('#auto_logout_time').html(res)
	}
}