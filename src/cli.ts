// #region imports
import { Base64 } from './base64';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
const endOfLine = os.EOL;
// #endregion
// #region options
interface IOptions {
  in: string | boolean, // input file
  out: string | boolean, // output file
  decode: boolean,
  encode: boolean,
  encodeUrl: boolean,
  sniff: boolean,
  s: string | boolean, // text to encode
  eol: boolean // determins if end of line should be included with output
}
const options: IOptions = {
  in: false, // input file
  out: false, // output file
  decode: false,
  encode: true,
  encodeUrl: false,
  sniff: false,
  s: false, // text to encode
  eol: false // determins if end of line should be included with output
}
// #endregion
// #region functions
const readFileContents = (filePath: string) => {
  const s = fs.readFileSync(filePath).toString();
  return s;
}
const writeFilecontents = (filePath: string, contents: string) => {
  const p = path.dirname(filePath);
  mkdirp.sync(p);
  fs.writeFileSync(filePath, contents);
}
const resolveHome = (filepath: string) => {
  if (filepath[0] === '~' && process.env.HOME) {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}
const log = (value: string, eol: boolean) => {
  // use stdout instead of console.log
  // console.log adds a newline \n
  if (eol === true) {
    value += endOfLine;
  }
  process.stdout.write(value);
}
// #endregion
// #region read params
// tslint:disable-next-line: one-variable-per-declaration
for (let i = 2, ii = process.argv.length; i < ii; i++) {
  const arg = process.argv[i];
  let str = '';
  if (arg.search('input:') >= 0) {
    str = arg.split(':')[1];
    if (str) { options.s = str; }
  } else if (arg.search('in:') >= 0) {
    str = arg.split(':')[1] + '';
    if (str.length > 0) {
      str = resolveHome(str);
      str = path.resolve(str);
      options.in = str;
    }
  } else if (arg.search('out:') >= 0) {
    str = arg.split(':')[1] + '';
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
// #region process
const b64 = new Base64();
let result = '';
if (options.decode === true) {
  if (options.in) {
    if (fs.existsSync(options.in.toString())) {
      try {
        result = readFileContents(options.in.toString());
        result = b64.decode(result);
      } catch (error) {
// tslint:disable-next-line: no-console
        console.error(error);
        process.exit(1);
      }
    } else {
// tslint:disable-next-line: no-console
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.decode(options.s.toString());
  }
} else if (options.encode === true) {
  if (options.in) {
    if (fs.existsSync(options.in.toString())) {
      try {
        result = readFileContents(options.in.toString());
        result = b64.encode(result);
      } catch (error) {
// tslint:disable-next-line: no-console
        console.error(error);
        process.exit(1);
      }
    } else {
// tslint:disable-next-line: no-console
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.encode(options.s.toString());
  }
} else if (options.encodeUrl === true) {
  if (options.in) {
    if (fs.existsSync(options.in.toString())) {
      try {
        result = readFileContents(options.in.toString());
        result = b64.urlEncode(result);
      } catch (error) {
// tslint:disable-next-line: no-console
        console.error(error);
        process.exit(1);
      }
    } else {
// tslint:disable-next-line: no-console
      console.error('File specified for in: parameter not found');
      process.exit(1);
    }
  } else if (options.s) {
    result = b64.urlEncode(options.s.toString());
  }
} else if (options.sniff === true) {
  result = 'false';
  if (fs.existsSync(options.in.toString())) {
    try {
      const sniffString = readFileContents(options.in.toString());
      if (b64.urlSniff(sniffString)) {
        result = 'true';
      }
    } catch (error) {
// tslint:disable-next-line: no-console
      console.error(error);
      process.exit(1);
    }
  } else if (options.s) {
    if (b64.urlSniff(options.s.toString())) {
      result = 'true';
    }
  }
}
// #endregion
// #region do work
if (options.out) {
  try {
    writeFilecontents(options.out.toString(), result);
    process.exit(0);
  } catch (error) {
// tslint:disable-next-line: no-console
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
