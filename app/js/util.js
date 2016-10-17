'use strict'
String.prototype.replaceAll = function(search, replacement) {
	var target = this
	return target.replace(new RegExp(search, 'g'), replacement)
}

function confirmation(msg, callback) {
	$.confirm(msg, (valided) => {
		if (valided) callback()
	})
}
function popup_alert(msg) {
	$.alert(msg)
}
function bind(action, name, execute) {
	$('body').on(action, '[event="' + name + '"]', function(e) {
		execute(this, e)
	})
}
function random_str(array) {
	return array[Math.floor(Math.random() * array.length)]
}
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min)
}
function template(container, template, data) {
	if(data === undefined) data = {}
	$(container).html(Mustache.render($(template).html(), data))
}
function format_price(array, cols) {
	if (array[0] !== undefined && array[0].constructor === Object) {
		$.each(array, (i, v) => {
			$.each(cols, (j, col) => {
				array[i][col] = v[col] / 100
			})
		})
	} else {
		$.each(cols, (j, col) => {
			array[col] = array[col] / 100
		})
	}
	return array
}
function unique(list) {
	var result = []
	$.each(list, (i, e) => {
		if ($.inArray(e, result) == -1) result.push(e)
	})
	return result
}
function unix_to_distance(timestamp) {
	var timestamp_now = Math.floor(Date.now() / 1000),
		distance = (timestamp - timestamp_now),
		distance_abs = Math.abs(distance)
	if (distance_abs <= 60) {
		var time = distance_abs + ' seconds'
	} else if (distance_abs <= 60 * 60) {
		var time = Math.round(distance_abs / 60) + ' minutes'
	} else if (distance_abs <= 60 * 60 * 24) {
		var time = Math.round(distance_abs / (60 * 60)) + ' hours'
	} else if (distance_abs <= 60 * 60 * 24 * 30) {
		var time = Math.round(distance_abs / (60 * 60 * 24)) + ' days'
	} else {
		var time = Math.round(distance_abs / (60 * 60 * 24 * 30)) + ' months'
	}
	if (distance > 0) {
		return 'in ' + time
	} else {
		return time + ' ago'
	}
}
function getUrlParam(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=')
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? false : sParameterName[1]
		}
	}
	return false
}