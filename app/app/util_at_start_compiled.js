'use strict';

function api(url, action, data, callback) {
	var stack = new Error().stack;
	return $.post(url + '?action=' + action, data, callback, "json").fail(function (data) {
		if (data.responseText === 'not logged') {
			location.href = 'login_to_admin';
		} else {
			error_catcher.error_api(url, data.responseText, stack);
		}
	});
}
