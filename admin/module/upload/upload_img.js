"use strict"

module.Upload = class
{
	constructor(callback)
	{
		this.callback = callback
		this.set_html()
		new module.Action(this,
		{
			click: ['change_image'],
			change: ['file_upload']
		})
	}

	set_html()
	{
		var that = this

		$('[event="click:change_image"]').each(function()
		{
			var el = $(this)
			if (el.data('img_uploader') === 'already set')
			{
				return false
			} 

			var form = $('<form>',
			{
				method: 'post',
				target: '_blanck',
				enctype: 'multipart/form-data',
				css: { display: 'none' }
			})

			var input = $('<input>',
			{
				event: 'change:file_upload',
				class: 'file_upload',
				type: 'file',
				name: 'files[]'
			})

			var progress = $('<progress>',
			{
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

	change_image(elem)
	{
		$(elem).parent().find('.file_upload').click()
	}

	progressHandlingFunction(e)
	{
	    if(e.lengthComputable)
	    {
	        $('progress').attr({value:e.loaded,max:e.total})
	    }
	}

	file_upload(elem)
	{
		var that = this
		var url = 'admin/api/upload_img.php'
		var wrap = $(elem).parent().parent()
		var progress = wrap.find('progress')
		var img = wrap.find('img')
		var img_url = img.data('url')
		var data = new FormData()
    	data.append('img', elem.files[0])
    	data.append('url', img_url)

    	progress.show()
    	img.hide()
    		
	    $.ajax({
	        url: url,
	        type: 'POST',
	        xhr: function()
	        {
	            var myXhr = $.ajaxSettings.xhr()
	            if(myXhr.upload)
	            {
	                myXhr.upload.addEventListener('progress', that.progressHandlingFunction, false)
	            }
	            return myXhr
	        },
	        //Ajax events
	        //beforeSend: beforeSendHandler,
	        success: function(data)
	        {
	        	try
	        	{
	        		var data = $.parseJSON(data)
	        	}
	        	catch(err)
	        	{
	        		template('#body', '#template_error_catcher',
					{
						url: url,
						message: data,
						stacks: []
					})
	        	}
	        	
	        	if (data.state == 'ok')
	        	{
	        		
    				img.attr('src', data.img).data('url', data.img).show()
    				progress.hide()
    				that.callback(data.img)
	        	}
	        },
	        error: function(err)
	        {
	        	template('#body', '#template_error_catcher',
				{
					url: 'upload img',
					message: err.statusText,
					stacks: []
				})
	        },
	        // Form data
	        data: data,
	        cache: false,
	        contentType: false,
	        processData: false
	    })
	}
}
