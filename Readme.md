<p align="center">
«-(¯`v´¯)-« <a href="https://www.npmjs.com/package/base64-string">【🇧​🇦​🇸​🇪​@-🇸​🇹​🇷​🇮​🇳​🇬​】</a> »-(¯`v´¯)-»
<br /><a href="https://en.wikipedia.org/wiki/Base64">Base64</a> string encode and decode including cli
</p>
<p align="center">
<a href="https://travis-ci.org/Amourspirit/node-base64-string"><img src="https://travis-ci.org/Amourspirit/node-base64-string.svg?branch=master" /></a>
<a href="https://snyk.io/test/github/Amourspirit/node-base64-string?targetFile=package.json"><img src="https://snyk.io/test/github/Amourspirit/node-base64-string/badge.svg?targetFile=package.json" />
<img src="https://img.shields.io/github/package-json/v/Amourspirit/node-base64-string.svg" />
<img src="https://img.shields.io/github/license/Amourspirit/node-base64-string.svg" />
</a>
</p>

# base64-string


## Install

```sh
$ npm install --save base64-string
```

## CLI

### CLI Options

```
base64-string:
  Options:
    in:     specifies a file for base64 encoding
    input:  specifies the string to process
    out:    specifies a file to write into
    decode  specifies the the process is to decode
    encode  specifies the process is to encode (default)
    sniff   specifies the process it to sniff if the 'in' 
            or 'input:' is to be tested is it may have 
            been url base64 encoded

    eol     specifies if an end of line should be appended
            to the the return output (stdOut).
            if eol is absent no end of line will be appended.
            The end of line is os specific.

    url     specifies if the process should base64 url encode

Notes:
  The order of parameter does not matter.

  If 'out:' is omitted result ares sent to stdOut

  When writing to a file 'eol' is not needed.
  It is the same result if you include 'eol'.

  'eol' is useful when using a terminal window.

  When writing files any directories needed will be automatically created.
  If a file exist it WILL be overwritten.
```

See [RFC-4648](https://en.wikipedia.org/wiki/Base64#RFC_4648) for more information on base64 url encoding.

### CLI Examples

```js
base64-string input:"hello world" // aGVsbG8gd29ybGQ=

base64-string input:"hello world" encode // aGVsbG8gd29ybGQ=

// returns and end of line based on the current os
base64-string input:"hello world" eol // aGVsbG8gd29ybGQ=\n

base64-string decode input:"aGVsbG8gd29ybGQ=" // hello world

// will write hello world into a file
base64-string decode input:"aGVsbG8gd29ybGQ=" out:"./where/hello.txt"

// base64 encodes file myfile.txt and saves to file enc.txt
base64-string encode in:"./myfile.txt" out:"./tmp/enc.txt"

// base64 decodes file b64.txt and saves to file decoded.txt
base64-string decode in:"./b64.txt" out:"./tmp/decoded.txt"

// base64 url encodes myfile.txt and outputs to stdOut
base64-string url in:"./myfile.txt"

// returs a true if text file is detected as url base64 encoded
base64-string sniff in:"./tmp/enc.txt"
```

## Usage

### base64.urlEncode()

Encode text to base64url, as per [RFC-4648](https://en.wikipedia.org/wiki/Base64#RFC_4648). The result is a URL-safe base64url encoded [UTF-8](https://en.wikipedia.org/wiki/UTF-8) string.  

**TypeScript:**

```ts
import { Base64 } from 'base64-string';
// other code
const enc = new Base64();
const b64 = enc.urlEncode('some url data');
```

**JavaScript:**

```js
var Base64 = require('base64-string').Base64;
// other code
var enc = new Base64();
var b64 = enc.urlEncode('some url data');
```

### base64.decode()

Decode base64 and base64url encoded text, as per [RFC-4648](https://en.wikipedia.org/wiki/Base64#RFC_4648). Input data is assumed to be a base64 or base64url encoded [UTF-8](https://en.wikipedia.org/wiki/UTF-8) string.  

**TypeScript:**

```ts
import { Base64 } from 'base64-string';
// other code
const enc = new Base64();
const b64 = enc.decode('aGVsbG8gd29ybGQ='); // hello world
```

**JavaScript:**

```js
var Base64 = require('base64-string').Base64;
// other code
var enc = new Base64();
var b64 = enc.decode('aGVsbG8gd29ybGQ='); // hello world
```

### base64.encode()

Encode text to base64, as per [RFC-4648](https://en.wikipedia.org/wiki/Base64#RFC_4648). The result is a base64 encoded [UTF-8](https://en.wikipedia.org/wiki/UTF-8) string.  

**TypeScript:**

```ts
import { Base64 } from 'base64-string';
// other code
const enc = new Base64();
const b64 = enc.encode('hello world'); // aGVsbG8gd29ybGQ=
```

**JavaScript:**

```js
var Base64 = require('base64-string').Base64;
// other code
var enc = new Base64();
var b64 = enc.encode('hello world'); // aGVsbG8gd29ybGQ=
```

### base64.urlSniff()

Check whether specified base64 string contains base64url specific characters.  
Return true if specified string is base64url encoded, false otherwise.  

**TypeScript:**

```ts
import { Base64 } from 'base64-string';
// other code
const enc = new Base64();
const b64 = enc.urlSniff(someStringVar); // returns a boolean
```

**JavaScript:**

```js
var Base64 = require('base64-string').Base64;
// other code
var enc = new Base64();
var isUrlBase64 = enc.urlSniff(someStringVar); // returns a boolean
```