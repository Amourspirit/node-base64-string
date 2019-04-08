// #region Requires and const
const assert = require('chai').assert;
require('mocha-sinon');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const endOfLine = require('os').EOL;
var isWin = process.platform === "win32";
const randomstring = require("randomstring");
const decodedTxt = process.cwd() + '/test/fixtures/decoded.txt';
const encodedTxt = process.cwd() + '/test/fixtures/encoded.txt';
const decodedUrlTxt = process.cwd() + '/test/fixtures/decodedUrlData.txt';
const encodedUrlTxt = process.cwd() + '/test/fixtures/encodedUrlData.txt';
const isTravis = false;
// if (process.env.TRAVIS) {
//   isTravis = true;
// }
// #endregion
// currently travis is working with bin test.
// #region functions const
const nodeMajor = _getNodeMajor();
function _getNodeMajor() {
  // https://www.regexpal.com/?fam=108819
  var s = process.version;
  var major = s.replace(/v?(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)/, '$1');
  return parseInt(major, 10);
}
function getCommand() {
  // including $(which node)  is not necessary for local test
  // ./bin/base64.js is 0777 and is executable
  // however there is an issue on travis ci where all calls to ./bin/base64.js fail
  // maybe I could have chmod the file in .travis.yml, this seemed the easy fix and still runs local
  if (arguments.length === 0) {
    throw new Error("getCommand requires one or more args");
  }
  var p = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    p += ' ' + arguments[i];
  }
  var result = '';
  if (isWin === true) {
    result = '.\\bin\\base64.cmd ' + p;
  } else {
    result = 'npx ./bin/base64.js ' + p;
  }
  return result;
}
function getCommandEncode(encodeString, optinalParams) {
  let params = 'encode input:"' + encodeString + '"';
  return getCommand(params, optinalParams);
}
function getCommandDecode(encodeString, optinalParams) {
  let params = 'decode input:"' + encodeString + '"';
  return getCommand(params, optinalParams);
}
function encodeText(s, optinalParams) {
  const fullCmd = getCommandEncode(s, optinalParams);
  const buff = execSync(fullCmd);
  var result = buff.toString();
  return result;
}
function decodeText(s, optinalParams) {
  const fullCmd = getCommandDecode(s, optinalParams);
  const buff = execSync(fullCmd);
  return buff.toString();
}
// #endregion
if ((isTravis === false)) {
// #region Bin Encoding
  describe("Bin Encoding", function() {
    it("should encode hello world", function(done) {
      let params = 'input:';
      params += '"hello world"';
      const fullCmd = getCommand(params, 'encode');
      exec(fullCmd, function(err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        assert.equal("aGVsbG8gd29ybGQ=", stdout);
        done();
      });
    });
    it("should write a file to equal base64 encoded fixture", function(done) {
      let outFile = './scratch/test/text/enc/encoded.txt';
      let params = 'in:"test/fixtures/decoded.txt"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'encode');
      exec(fullCmd, function(err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + outFile.substr(1);
        var src = fs.readFileSync(encodedTxt);
        var dest = fs.readFileSync(outFile);
        assert.isTrue(src.equals(dest));
        done();
      });
    });
    it("should write a file to equal base64 encodedUrlData fixture", function(done) {
      let outFile = 'scratch/test/text/enc/encodedUrlData.txt';
      let params = 'in:"./test/fixtures/decodedUrlData.txt"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'url');
      exec(fullCmd, function(err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + '/' + outFile;
        var src = fs.readFileSync(encodedUrlTxt);
        var dest = fs.readFileSync(outFile);
        assert.isTrue(src.equals(dest));
        done();
      });
    });
    it("should returns a result equal base64 encodedSimple fixture", function(done) {
      let inFile = 'test/fixtures/decodedSimple.txt';
      let params = 'in:"' + inFile + '"';
      const fullCmd = getCommand(params, 'encode');
      exec(fullCmd, function(err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        var strF = process.cwd() + '/test/fixtures/encodedSimple.txt';
        var src = fs.readFileSync(strF).toString()
        assert.equal(src, stdout);
        done();
      });
    });
    it("should write a file to with the encoded contents equal to hello world", function(done) {
      let outFile = './scratch/test/text/enc/encHelloWorld.txt';
      let params = 'input:"hello world"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'encode');
      exec(fullCmd, function(err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + outFile.substr(1);
        var dest = fs.readFileSync(outFile).toString();
        assert.equal('aGVsbG8gd29ybGQ=', dest);
        done();
      });
    });
  });
  // #endregion
  // #region Bin Decoding
  describe('Bin Decoding', function() {
    it('should decode to hello world', function (done) {
      let params = 'input:aGVsbG8gd29ybGQ='; // does not need to be passe in ""
      const fullCmd = getCommand(params, 'decode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        assert.equal('hello world', stdout);
        done();
      });
    });
    it('should write a file to equal base64 decoded fixture', function (done) {
      let outFile = './scratch/test/text/enc/decoded.txt';
      let params = 'in:"test/fixtures/encoded.txt"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'decode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + outFile.substr(1);
        var src = fs.readFileSync(decodedTxt);
        var dest = fs.readFileSync(outFile);
        assert.isTrue(src.equals(dest));
        done();
      });
    });
    it('should write a file to equal base64 decodedUrlData fixture', function (done) {
      let outFile = 'scratch/test/text/enc/decodedUrlData.txt';
      let params = 'in:"./test/fixtures/encodedUrlData.txt"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'decode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + '/' + outFile;
        var src = fs.readFileSync(decodedUrlTxt);
        var dest = fs.readFileSync(outFile);
        assert.isTrue(src.equals(dest));
        done();
      });
    });
    it('should returns a result equal base64 decodedSimple fixture', function (done) {
      let inFile = 'test/fixtures/encodedSimple.txt';
      let params = 'in:"' + inFile + '"';
      const fullCmd = getCommand(params, 'decode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        var strF = process.cwd() + '/test/fixtures/decodedSimple.txt';
        var src = fs.readFileSync(strF).toString()
        assert.equal(src, stdout);
        done();
      });
    });
    it('should write a file to with the decoded contents equal to hello world', function (done) {
      let outFile = './scratch/test/text/enc/decHelloWorld.txt';
      let params = 'input:aGVsbG8gd29ybGQ=';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'decode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + outFile.substr(1);
        var dest = fs.readFileSync(outFile).toString();
        assert.equal('hello world', dest);
        done();
      });
    });
  });
  // #endregion
  // #region Bin Sniff url
  describe("Bin Sniff url", function () {
    it("should detect that a url data fixture is indeed base64 url encoded", function (done) {
      const sFile = './test/fixtures/encodedUrlData.txt';
      const params = 'in:"' + sFile + '"';
      const fullCmd = getCommand(params, 'sniff');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        assert.isTrue(stdout === 'true');
        done();
      });
    });
  });
  // #endregion
  // #region Random Encode and Decode test
  describe('Bin Random Encode and decode test', function() {
    it('should generate a random string of 50 chars and encode and decode', function(done) {
      const rs = randomstring.generate(50);
      const enc = encodeText(rs);
      const dc = decodeText(enc);
      assert.equal(rs, dc);
      done();
    });
    it('should generate a random string of 500 chars and encode and decode', function(done) {
      const rs = randomstring.generate(500);
      const enc = encodeText(rs);
      const dc = decodeText(enc);
      assert.equal(rs, dc);
      done();
    });
    it('should generate a random string of 2000 chars and encode and decode', function(done) {
      const rs = randomstring.generate(2000);
      const enc = encodeText(rs);
      const dc = decodeText(enc);
      assert.equal(rs, dc);
      done();
    });
  });
// #endregion
// #region Bin EOL
  describe('Bin End of line test', function() {
    it('should encode hello world and add End of Line for the current os', function(done) {
      const enc = encodeText('hello world', 'eol');
      console.log("eol", endOfLine.length, endOfLine);
      assert.equal(('aGVsbG8gd29ybGQ=' + endOfLine), enc);
      done();
    });
    it("should encode hello world", function (done) {
      let params = 'input:';
      params += '"hello world"';
      const fullCmd = getCommand(params, 'encode');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        assert.equal("aGVsbG8gd29ybGQ=", stdout);
        done();
      });
    });
    it("should write a file to equal base64 encoded fixture and ignore eol", function (done) {
      let outFile = './scratch/test/text/enc/encodedEol.txt';
      let params = 'in:"test/fixtures/decoded.txt"';
      params += ' out:"' + outFile + '"';
      const fullCmd = getCommand(params, 'encode', 'eol');
      exec(fullCmd, function (err, stdout, stderr) {
        if (err) {
          // node couldn't execute the command
          return;
        }
        outFile = process.cwd() + outFile.substr(1);
        var src = fs.readFileSync(encodedTxt);
        var dest = fs.readFileSync(outFile);
        assert.isTrue(src.equals(dest));
        done();
      });
    });
  });
// #endregion
}
// #region functions
function getCommand() {
  // including $(which node)  is not necessary for local test
  // ./bin/base64.js is 0777 and is executable
  // however there is an issue on travis ci where all calls to ./bin/base64.js fail
  // maybe I could have chmod the file in .travis.yml, this seemed the easy fix and still runs local
  if (arguments.length === 0) {
    throw new Error("getCommand requires one or more args");
  }
  var p = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    p += ' ' + arguments[i];
  }
  var result = '';
  if (isWin === true) {
    result = '.\\bin\\base64.cmd ' + p;
  } else {
    if (nodeMajor <= 6) {
      result = '$(which node) ./bin/base64.js ' + p;
    } else {
      result = 'npx ./bin/base64.js ' + p;  
    }
    
  }
  return result;
}
function getCommandEncode(encodeString, optinalParams) {
  let params = 'encode input:"' + encodeString + '"';
  return getCommand(params, optinalParams);
}
function getCommandDecode(encodeString, optinalParams) {
  let params = 'decode input:"' + encodeString + '"';
  return getCommand(params, optinalParams);
}
function encodeText(s, optinalParams) {
  const fullCmd = getCommandEncode(s, optinalParams);
  const buff = execSync(fullCmd);
  var result = buff.toString();
  return result;
}
function decodeText(s, optinalParams) {
  const fullCmd = getCommandDecode(s, optinalParams);
  const buff = execSync(fullCmd);
  return buff.toString();
}
// #endregion