'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

admin.Footer = function () {
	function _class() {
		_classCallCheck(this, _class);

		template('footer', '#template_admin_footer', {
			title_footer: gvar.title_footer,
			year: new Date().getFullYear()
		});
	}

	return _class;
}();
