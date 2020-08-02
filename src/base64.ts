export class Base64 {
  private b64c: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';   // base64 dictionary
  private b64u: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';   // base64url dictionary
  private b64pad: string = '=';
  /**
   * Encode a JavaScript string to base64
   * @param s The string to encode to base64
   * @returns Base64 encoded string
   * Specified string is first converted from JavaScript UCS-2 to UTF-8.
   */
  public encode(s: string): string {
    const utf8str = unescape(encodeURIComponent(s))
    return this.encodeData(utf8str, utf8str.length, this.b64c)
  }
  /**
   * Encode a JavaScript string to base64url.
   * @param s String to encode to base64
   * @return Returns the base64 encoded string
   * Specified string is first converted from JavaScript UCS-2 to UTF-8.
   */
  public urlEncode(s: string): string {
    const utf8str = unescape(encodeURIComponent(s))
    return this.encodeData(utf8str, utf8str.length, this.b64u)
  }
  /**
   * Decode a base64 or base64url string to a JavaScript string.
   * @param data Input is assumed to be a base64/base64url encoded UTF-8 string.
   * @return Returned result is a JavaScript (UCS-2) string.
   */
  public decode(data: string) {
    let dst: string = ""
    let i: number;
    let a: number;
    let b: number;
    let c: number;
    let d: number;

    for (i = 0; i < data.length - 3; i += 4) {
      a = this.charIndex(data.charAt(i + 0));
      b = this.charIndex(data.charAt(i + 1));
      c = this.charIndex(data.charAt(i + 2));
      d = this.charIndex(data.charAt(i + 3));

      dst += String.fromCharCode((a << 2) | (b >>> 4))
      if (data.charAt(i + 2) !== this.b64pad) {
        dst += String.fromCharCode(((b << 4) & 0xF0) | ((c >>> 2) & 0x0F))
      }

      if (data.charAt(i + 3) !== this.b64pad) {
        dst += String.fromCharCode(((c << 6) & 0xC0) | d)
      }
    }

    dst = decodeURIComponent(escape(dst))
    return dst
  }
  /**
   * Check whether specified base64 string contains base64url specific characters.
   * @param s a base64 string to sniff
   * @returns Return true if specified string is base64url encoded, false otherwise.
   */
  public urlSniff(s: string): boolean {
    if (s.indexOf("-") >= 0) {
      return true;
    }
    if (s.indexOf("_") >= 0) {
      return true;
    }
    return false
  }
  /**
   * Internal helper to encode data to base64 using specified dictionary.
   * @private
   */
  private encodeData(data: string, len: number, b64x: string) {
    let dst: string = ""
    let i: number = 0;

    for (i = 0; i <= len - 3; i += 3) {
      dst += b64x.charAt(data.charCodeAt(i) >>> 2)
      dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
      dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6))
      dst += b64x.charAt(data.charCodeAt(i + 2) & 63)
    }

    if (len % 3 === 2) {
      dst += b64x.charAt(data.charCodeAt(i) >>> 2)
      dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
      dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2))
      dst += this.b64pad
    }
    else if (len % 3 === 1) {
      dst += b64x.charAt(data.charCodeAt(i) >>> 2)
      dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4))
      dst += this.b64pad
      dst += this.b64pad
    }

    return dst
  }

  /**
   * Internal helper to translate a base64 character to its integer index.
   * @param c The single character to get the char index
   * @returns index of character represented by c
   * @private
   */
  private charIndex(c: string): number {
    if (c === "+") { return 62; }
    if (c === "/") { return 63; }
    return this.b64u.indexOf(c)
  }
};
