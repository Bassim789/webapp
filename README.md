# Webapp

Webapp (temporary name) is a little framework for building SPA (Single Page Application) responsive website with Javascript.

Jquery and Mustache templating are used and data are called with AJAX and PHP serves as an API with an SQL database. These choises are made to be very simple to implement in every web-hosting. The goal is two be able to build rapidly nice webapp without spend to much time to learn complexe and heavy framework. It's very modulable so you can easily re-use your code.

With Node.js on your server you can use Babel to transpil your es6 code to es5 and Stylus for writing nice CSS. But Webapp doesn't require Node to run, it's juste better if you have it for the developpement stage.

The architecture help to maintain clean separation between the public and admin content, between client and server and the different languages. It's very flexible, so you can put all the HTML, CSS and JS in one file for each page if it's small or separate the three in a same folder to have cleaner code. You can also use another api than PHP, it will be some work but it's possible to do that without changing the front-end code.

If you are connected to admin, you have access to all the ressources, including the public one. If you are not, only the public ressources are loaded and you can not access the admin api.


##Simple example

public/page/index/index.html:
```html
<template id="template_page_index">
	<img class="homepage_main_img" src="{{logo}}">
	<div class="big_middle_title">
		Welcome to {{title}}
	</div>
</template>
```

public/page/index/index.js:
```js
page.index = class {
	constructor(name) {
		template('#body', '#template_page_index', {
			title: gvar.title,
			logo: gvar.img.logo
		})
	}			
}
```
Result:
![alt tag](https://cloud.githubusercontent.com/assets/14947215/19451485/af88c758-94ad-11e6-90d9-c0a814f0074b.png)


## Event binding
The method to bind event is designed to work when new html is dynamicly added. In your html use the "event" tag with the action and the function to call in the js class. So if you put event="click:login" a click on this element will call the login function in the js. In your login function the first argument is the element and the second is the event. You can also put multiple event like this: event="enter:login blur:login" or event="enter:login blur:anotheraction". 

public/page/login_to_admin/login_to_admin.html:
```html
<template id="template_login">
	<input type="email" id="email_login" class="form_text_input" event="enter:login" placeholder="email" value="{{email}}">
	<input type="password" id="password_login" class="form_text_input" event="enter:login" placeholder="password">
	<div class="form_action_btn noselect" event="click:login">
		Login
	</div>
	<br>
	<div style="text-decoration: underline; cursor: pointer; font-size: 10px;" event="click:reset_password_box">
		Forget password ?
	</div>
</template>
```

public/page/login_to_admin/login_to_admin.js:
```js
page.login_to_admin = class {
	constructor(name) {
		template('#body', '#template_page_login_to_admin')
		template('#login_box', '#template_login')
		new module.Action(this, {
			click: ['login', 'send_new_password', 'reset_password_box', 'login_box'],
			enter: ['login', 'send_new_password']
		})
	}
	login() {
		var email = $('#email_login').val(),
			password = $('#password_login').val()
		this.popup_loading()
		api('public/api/login', 'login', {
			email: email,
			password: password
		},
		(data) => {
			if (data.state == 'success') {
				location.href = '?page=admin-homepage'
			} else {
				this.popup_infobox(data)
			}
		})
	}
}
```

##Installation
Download the repesitory and put it in your www folder. You can also put it in a sub-folder of an existant website, in this case you have to use an empty database and not one that you are already using. When you first go to your website there is a little form asking for your email, password and database information. When you have submited the form an email is sent, you click on the link and your Webapp is ready. You can now login to the admin and start building your project!

Please be carful if you want to use Webapp in a production website. It's still in early developpement so there is no garanti and the new versions may introduce a lot of change.


##Comming soon
* Documentation about code manager, image upload, editable input, api, database abstraction and error system.
* Test and adaptation to work in local environment. Maybe it's already working but i dont have tested yet.
* Improve the error system to be configurable. For now all errors are nicely showed and it's perfect for developpement. For production we need to be able to log the error in the database or a file and not show them directly.
* Improve modularity of some processes
* Build new module, like blog, user profil, admin permission management, website analytics.
* Explore the possibility to implement Webapp in Android and IOS with Cordova.



