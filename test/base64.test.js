// #region const and require
// import { Base64 } from '../index.js';
// const b64 = Base64;
const assert = require('chai').assert;
require('mocha-sinon');
const fs = require('fs');
const b64 = require('../index.js').Base64;


const randomstring = require('randomstring');
const decodedTxt = process.cwd() + '/test/fixtures/decoded.txt';
const encodedTxt = process.cwd() + '/test/fixtures/encoded.txt';
const decodedUrlTxt = process.cwd() + '/test/fixtures/decodedUrlData.txt';
const encodedUrlTxt = process.cwd() + '/test/fixtures/encodedUrlData.txt';
// #endregion
// #region Encoding
describe('Encoding', function () {
  it('should encode hello world', function (done) {
    let b = new b64();
    const encoded = b.encode('hello world');
    assert.equal(encoded,'aGVsbG8gd29ybGQ=');
    done();
  });
  it('should encode file to equal base64 encoded fixture', function (done) {

    fs.readFile(decodedTxt, function(err, contents){
      const decodedFile = contents.toString();
      fs.readFile(encodedTxt, function(err, contents) {
        const encodedFile = contents.toString();
        let b = new b64();
        const encoded = b.encode(decodedFile);
        assert.equal(encoded, encodedFile);
        done();
      });
    });
  });
  it('should encode file to equal url base64 encoded fixture', function (done) {
    fs.readFile(decodedUrlTxt, function (err, contents) {
      const decodedFile = contents.toString();
      fs.readFile(encodedUrlTxt, function (err, contents) {
        const encodedFile = contents.toString();
        let b = new b64();
        const encoded = b.urlEncode(decodedFile);
        assert.equal(encoded, encodedFile);
        done();
      });
    });
  });
  // it('should encode file and do a round robin to equal the original file', function (done) {
  //   fs.readFile(decodedTxt, function (err, contents) {
  //     const decodedFile = contents.toString();
  //     let b = new b64();
  //     const encoded = b.encode(decodedFile);
  //     const decoded = b.decode(encoded);
  //     assert.equal(decoded, 'hello world');
  //     done();
  //   });
  // });
});
// #endregion
// #region Decoding
describe('Decoding', function () {
  it('should decode to hello world', function (done) {
    let b = new b64();
    const decoded = b.decode('aGVsbG8gd29ybGQ=');
    assert.equal(decoded, 'hello world');
    done();
  });
  it('should decode base64 file to equal decoded fixture', function (done) {
    fs.readFile(decodedTxt, function (err, contents) {
      const decodedFile = contents.toString();
      fs.readFile(encodedTxt, function (err, contents) {
        const encodedFile = contents.toString();
        let b = new b64();
        const decoded = b.decode(encodedFile);
        assert.equal(decoded, decodedFile);
        done();
      });
    });
  });
  it('should decode base64 url data file to equal decoded fixture', function (done) {
    fs.readFile(decodedUrlTxt, function (err, contents) {
      const decodedFile = contents.toString();
      fs.readFile(encodedUrlTxt, function (err, contents) {
        const encodedFile = contents.toString();
        let b = new b64();
        const decoded = b.decode(encodedFile);
        assert.equal(decoded, decodedFile);
        done();
      });
    });
  });
});
// #endregion
// #region Snif url
describe('Sniff url', function (){
  it('should detect that a url data fixture is indeed base64 url encoded', function (done){
    fs.readFile(decodedUrlTxt, function (err, contents) {
      let b = new b64();
      assert.isTrue(b.urlSniff(contents.toString()));
      done();
    });
  });
});
// #endregion
// #region Random Encode and Decode test
describe('Random Encode and decode test', function () {
  it('should generate a random string of 50 chars and encode and decode', function (done) {
    const rs = randomstring.generate(50);
    const b = new b64();
    const enc = b.encode(rs);
    const dc = b.decode(enc);
    assert.equal(rs, dc);
    done();
  });
  it('should generate a random string of 500 chars and encode and decode', function (done) {
    const rs = randomstring.generate(500);
    const b = new b64();
    const enc = b.encode(rs);
    const dc = b.decode(enc);
    assert.equal(rs, dc);
    done();
  });
  it('should generate a random string of 2000 chars and encode and decode', function (done) {
    const rs = randomstring.generate(2000);
    const b = new b64();
    const enc = b.encode(rs);
    const dc = b.decode(enc);
    assert.equal(rs, dc);
    done();
  });
});
// #endregion