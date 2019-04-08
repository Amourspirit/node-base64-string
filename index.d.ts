export declare class Base64 {
    private b64c;
    private b64u;
    private b64pad;
    /**
     * Encode a JavaScript string to base64
     * @param s The string to encode to base64
     * @returns Base64 encoded string
     * Specified string is first converted from JavaScript UCS-2 to UTF-8.
     */
    encode(s: string): string;
    /**
     * Encode a JavaScript string to base64url.
     * @param s String to encode to base64
     * @return Returns the base64 encoded string
     * Specified string is first converted from JavaScript UCS-2 to UTF-8.
     */
    urlEncode(s: string): string;
    /**
     * Decode a base64 or base64url string to a JavaScript string.
     * @param data Input is assumed to be a base64/base64url encoded UTF-8 string.
     * @return Returned result is a JavaScript (UCS-2) string.
     */
    decode(data: string): string;
    /**
     * Check whether specified base64 string contains base64url specific characters.
     * @param s a base64 string to sniff
     * @returns Return true if specified string is base64url encoded, false otherwise.
     */
    urlSniff(s: string): boolean;
    /**
     * Internal helper to encode data to base64 using specified dictionary.
     * @private
     */
    private encodeData;
    /**
     * Internal helper to translate a base64 character to its integer index.
     * @param c The single character to get the char index
     * @returns index of character represented by c
     * @private
     */
    private charIndex;
}
