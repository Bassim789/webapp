page.admin.design = class {
	constructor(name) {
		this.load()
		new my_module.Action(this, {
			click: [
				'btn_delete_img',
				'add_new_img'
			],
			enter: ['add_new_img'],
			change: ['upload_new_img']
		})
	}
	load() {
		var images = Object.keys(gvar.img).map((var_name) => { 
			return {
				title: var_name.replace(/_/g, ' '), 
				url: gvar.img[var_name]
			}
		})
		template('#body', '#template_page_admin_design', {
			images: images
		})
		new my_module.Upload((url) => {
			if (url.includes('default_desktop')) {
				gvar.img.default_desktop = url
				app.Body.load_backround()
			} else if (url.includes('default_mobile')) {
				gvar.img.default_mobile = url
				app.Body.load_backround()
			} else if (url.includes('default_sidr')) {
				gvar.img.default_sidr = url
				app.Header.load()
				app.Timeout.reset_auto_logout()
			} else if (url.includes('header/logo')) {
				gvar.img.logo = url
				app.Header.load()
				app.Timeout.reset_auto_logout()
			}
		})
	}
	btn_delete_img(elem) {
		var img_url = $(elem).parent().parent().find('img').attr('src')
		confirmation('Delete this image?', () => {
			api('admin/api/image', 'delete', {img_url: img_url}, (data) => {
				if (data.error) {
					return popup_alert(data.error)
				}
				gvar.img = data.img
				this.load()
			})
		})
	}
	add_new_img(elem) {
		$(elem).parent().find('.file_upload').click()
	}
	progressHandlingFunction(e) {
		if(e.lengthComputable) {
			$('progress').attr({value:e.loaded,max:e.total})
		}
	}
	upload_new_img(elem) {
		var wrap = $(elem).parent().parent()
		var img_name = wrap.find('input').val()
		var progress = wrap.find('progress')
		if (img_name === '') return popup_alert('Enter an image name!')
		var send_data = new FormData()
		send_data.append('img_name', img_name)
		send_data.append('file', elem.files[0])
		progress.show()
		var that = this
		$.ajax({
			url: 'admin/api/image?action=upload_new',
			type: 'POST',
			xhr()
			{
				var myXhr = $.ajaxSettings.xhr()
				if(myXhr.upload) {
					myXhr.upload.addEventListener('progress', that.progressHandlingFunction, false)
				}
				return myXhr
			},
			success(data) {
				progress.hide()
				try {
					var data = $.parseJSON(data)
				} catch(err) {
					template('#body', '#template_error_catcher', {
						url: 'upload img',
						message: data,
						stacks: []
					})
				}
				console.log(data)
				if (data.error) {
					return popup_alert(data.error)
				}
				gvar.img = data.img
				that.load()
			},
			error(err) {
				template('#body', '#template_error_catcher', {
					url: 'upload img',
					message: err.statusText,
					stacks: []
				})
			},
			data: send_data,
			cache: false,
			contentType: false,
			processData: false
		})
	}
}