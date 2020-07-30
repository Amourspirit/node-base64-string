'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Base64 = void 0;
var Base64 = (function () {
	function Base64() {
		this.b64c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		this.b64u = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
		this.b64pad = '=';
	}
	Base64.prototype.encode = function (s) {
		var utf8str = unescape(encodeURIComponent(s));
		return this.encodeData(utf8str, utf8str.length, this.b64c);
	};
	Base64.prototype.urlEncode = function (s) {
		var utf8str = unescape(encodeURIComponent(s));
		return this.encodeData(utf8str, utf8str.length, this.b64u);
	};
	Base64.prototype.decode = function (data) {
		var dst = '';
		var i;
		var a;
		var b;
		var c;
		var d;
		for (i = 0; i < data.length - 3; i += 4) {
			a = this.charIndex(data.charAt(i + 0));
			b = this.charIndex(data.charAt(i + 1));
			c = this.charIndex(data.charAt(i + 2));
			d = this.charIndex(data.charAt(i + 3));
			dst += String.fromCharCode((a << 2) | (b >>> 4));
			if (data.charAt(i + 2) !== this.b64pad) {
				dst += String.fromCharCode(((b << 4) & 0xf0) | ((c >>> 2) & 0x0f));
			}
			if (data.charAt(i + 3) !== this.b64pad) {
				dst += String.fromCharCode(((c << 6) & 0xc0) | d);
			}
		}
		dst = decodeURIComponent(escape(dst));
		return dst;
	};
	Base64.prototype.urlSniff = function (s) {
		if (s.indexOf('-') >= 0) {
			return true;
		}
		if (s.indexOf('_') >= 0) {
			return true;
		}
		return false;
	};
	Base64.prototype.encodeData = function (data, len, b64x) {
		var dst = '';
		var i = 0;
		for (i = 0; i <= len - 3; i += 3) {
			dst += b64x.charAt(data.charCodeAt(i) >>> 2);
			dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
			dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6));
			dst += b64x.charAt(data.charCodeAt(i + 2) & 63);
		}
		if (len % 3 === 2) {
			dst += b64x.charAt(data.charCodeAt(i) >>> 2);
			dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
			dst += b64x.charAt((data.charCodeAt(i + 1) & 15) << 2);
			dst += this.b64pad;
		} else if (len % 3 === 1) {
			dst += b64x.charAt(data.charCodeAt(i) >>> 2);
			dst += b64x.charAt((data.charCodeAt(i) & 3) << 4);
			dst += this.b64pad;
			dst += this.b64pad;
		}
		return dst;
	};
	Base64.prototype.charIndex = function (c) {
		if (c === '+') {
			return 62;
		}
		if (c === '/') {
			return 63;
		}
		return this.b64u.indexOf(c);
	};
	return Base64;
})();
exports.Base64 = Base64;
