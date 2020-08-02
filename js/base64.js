export class Base64 {
    constructor() {
        this.b64c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        this.b64u = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        this.b64pad = '=';
    }
    encode(s) {
        const utf8str = unescape(encodeURIComponent(s));
        return this.encodeData(utf8str, utf8str.length, this.b64c);
    }
    urlEncode(s) {
        const utf8str = unescape(encodeURIComponent(s));
        return this.encodeData(utf8str, utf8str.length, this.b64u);
    }
    decode(data) {
        let dst = "";
        let i;
        let a;
        let b;
        let c;
        let d;
        for (i = 0; i < data.length - 3; i += 4) {
            a = this.charIndex(data.charAt(i + 0));
            b = this.charIndex(data.charAt(i + 1));
            c = this.charIndex(data.charAt(i + 2));
            d = this.charIndex(data.charAt(i + 3));
            dst += String.fromCharCode((a << 2) | (b >>> 4));
            if (data.charAt(i + 2) !== this.b64pad) {
                dst += String.fromCharCode(((b << 4) & 0xF0) | ((c >>> 2) & 0x0F));
            }
            if (data.charAt(i + 3) !== this.b64pad) {
                dst += String.fromCharCode(((c << 6) & 0xC0) | d);
            }
        }
        dst = decodeURIComponent(escape(dst));
        return dst;
    }
    urlSniff(s) {
        if (s.indexOf("-") >= 0) {
            return true;
        }
        if (s.indexOf("_") >= 0) {
            return true;
        }
        return false;
    }
    encodeData(data, len, b64x) {
        let dst = "";
        let i = 0;
        for (i = 0; i <= len - 3; i += 3) {
            dst += b64x.charAt(data.charCodeAt(i) >>> 2);
            dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
            dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6));
            dst += b64x.charAt(data.charCodeAt(i + 2) & 63);
        }
        if (len % 3 === 2) {
            dst += b64x.charAt(data.charCodeAt(i) >>> 2);
            dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
            dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2));
            dst += this.b64pad;
        }
        else if (len % 3 === 1) {
            dst += b64x.charAt(data.charCodeAt(i) >>> 2);
            dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4));
            dst += this.b64pad;
            dst += this.b64pad;
        }
        return dst;
    }
    charIndex(c) {
        if (c === "+") {
            return 62;
        }
        if (c === "/") {
            return 63;
        }
        return this.b64u.indexOf(c);
    }
}
;
//# sourceMappingURL=base64.js.map