#!/usr/bin/env node
// #region requires
var base64 = require('../index').Base64;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var endOfLine = require('os').EOL;
// #endregion
// #region options
var options = {
  in: false, // input file
  out: false, // output file
  decode: false,
  encode: true,
  encodeUrl: false,
  sniff: false,
  s: false, // text to encode
  eol: false // determins if end of line should be included with output
};
// #region read params
for (var i = 2, ii = process.argv.length; i < ii; i++) {
  var arg = process.argv[i];

  if (arg.search('input:') >= 0) {
    var str = arg.split(':')[1];
    if (str) { options.s = str; }
  } else if (arg.search('in:') >= 0) {
    var str = arg.split(':')[1] + '';
    if (str.length > 0) {
      str = resolveHome(str);
      str = path.resolve(str);
      options.in = str;
    }
  } else if (arg.search('out:') >= 0) {
    var str = arg.split(':')[1] + '';
    if (str.length > 0) {
      str = resolveHome(str);
      str = path.resolve(str);
      options.out = str;
    }
  }
  else if (arg.search('decode') >= 0) {
    options.decode = true;
    options.encode = false;
  }
  else if (arg.search('encode') >= 0) {
    options.encode = true;
  }
  else if (arg.search('url') >= 0) {
    options.encodeUrl = true;
    options.encode = false;
  }
  else if (arg.search('sniff') >= 0) {
    options.sniff = true;
    options.encode = false;
  } else if (arg.search('eol') >= 0) {
    options.eol = true;
  }
};
// #endregion
// #endregion
// #region process
var b64 = new base64();
var result = '';
if (options.decode === true) {
  if (options.in) {
    if (fs.existsSync(options.in)) {
      try {
        result = readFileContents(options.in);
        result = b64.decode(result);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    } else {
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.decode(options.s);
  }
} else if (options.encode === true) {
  if (options.in) {
    if (fs.existsSync(options.in)) {
      try {
        result = readFileContents(options.in);
        result = b64.encode(result);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    } else {
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.encode(options.s);
  }
} else if (options.encodeUrl === true) {
  if (options.in) {
    if (fs.existsSync(options.in)) {
      try {
        result = readFileContents(options.in);
        result = b64.urlEncode(result);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    } else {
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.urlEncode(options.s);
  }
} else if (options.sniff === true) {
  result = 'false';
  if (fs.existsSync(options.in)) {
      try {
        var sniffString = readFileContents(options.in);
        if (b64.urlSniff(sniffString)) {
          result = 'true';
        }
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    } else if (options.s) {
    if (b64.urlSniff(options.s)) {
      result = 'true';
    }
  }
}
// #endregion
// #region do work
if (options.out) {
  try {
    writeFilecontents(options.out, result);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
} else if (options.s) {
  log(result, options.eol);
} else {
  log(result, options.eol);
}
// #endregion
// #region exit
process.exit(0);
// #endregion
// #region functions
function readFileContents(filePath) {
  var str = fs.readFileSync(filePath).toString();
  return str;
}
function writeFilecontents(filePath, contents) {
  var p = path.dirname(filePath);
  mkdirp.sync(p);
  fs.writeFileSync(filePath, contents);
}
function resolveHome(filepath) {
  if (filepath[0] === '~') {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}
function log(value, eol) {
  // use stdout instead of console.log
  // console.log adds a newline \n
  if (eol === true) {
    value += endOfLine;
  }
  process.stdout.write(value);
}
// #endregion
