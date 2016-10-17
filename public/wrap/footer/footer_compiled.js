'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Footer = function Footer() {
	_classCallCheck(this, Footer);

	template('footer', '#template_footer', {
		title_footer: gvar.title_footer,
		year: new Date().getFullYear()
	});
};
