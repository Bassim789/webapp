my_module.Upload = class {
	constructor(callback) {
		this.callback = callback
		this.set_html()
		new my_module.Action(this, {
			click: ['change_image'],
			enter: ['change_image'],
			change: ['file_upload']
		})
	}
	set_html() {
		var that = this
		$('[event="click:change_image"]').each(function() {
			var el = $(this)
			if (el.data('img_uploader') === 'already set') {
				return false
			} 
			var form = $('<form>', {
				method: 'post',
				target: '_blanck',
				enctype: 'multipart/form-data',
				css: { display: 'none' }
			})
			var input = $('<input>', {
				event: 'change:file_upload',
				class: 'file_upload',
				type: 'file',
				name: 'files[]'
			})
			var progress = $('<progress>', {
				css: {
					display: 'none',
					width: '100%'
				}
			})
			form.html(input)
			el  .attr('src', el.data('url'))
				.after(form)
				.after(progress)
		})
	}
	change_image(elem) {
		$(elem).parent().find('.file_upload').click()
	}
	progressHandlingFunction(e) {
		if(e.lengthComputable) {
			$('progress').attr({value:e.loaded,max:e.total})
		}
	}
	file_upload(elem) {
		var that = this,
			url = 'admin/api/upload_img.php',
			wrap = $(elem).parent().parent(),
			progress = wrap.find('progress'),
			img = wrap.find('img'),
			img_url = img.data('url'),
			data = new FormData()

		data.append('img', elem.files[0])
		data.append('url', img_url)
		progress.show()
		img.hide()
		$.ajax({
			url: url,
			type: 'POST',
			xhr() {
				var myXhr = $.ajaxSettings.xhr()
				if(myXhr.upload) {
					myXhr.upload.addEventListener('progress', that.progressHandlingFunction, false)
				}
				return myXhr
			},
			//Ajax events
			//beforeSend: beforeSendHandler,
			success(data) {
				try {
					var data = $.parseJSON(data)
				} catch(err) {
					template('#body', '#template_error_catcher',
					{
						url: url,
						message: data,
						stacks: []
					})
				}
				if (data.state == 'ok') {
					img.attr('src', data.img).data('url', data.img).show()
					progress.hide()
					that.callback(data.img)
				}
			},
			error(err) {
				template('#body', '#template_error_catcher', {
					url: 'upload img',
					message: err.statusText,
					stacks: []
				})
			},
			data: data,
			cache: false,
			contentType: false,
			processData: false
		})
	}
}