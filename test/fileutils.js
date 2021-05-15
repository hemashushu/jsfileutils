const assert = require('assert/strict');
const {ObjectUtils} = require('jsobjectutils');

const BaseFileInfo = require('../src/basefileinfo');
const BaseFolderInfo = require('../src/basefolderinfo');
const FileUtils = require('../src/fileutils');
const HashAlgorithm = require('../src/hashalgorithm');
const PromiseFileUtils = require('../src/promisefileutils');

describe('FileUtils Test', () => {
    it('Test isAbsoulteUrl()', ()=>{
        assert(FileUtils.isAbsoulteUrl('http://some.domain/path/to/page'));
        assert(FileUtils.isAbsoulteUrl('https://some.domain/path/to/page'));
        assert(FileUtils.isAbsoulteUrl('file:///path/to/file'));
        assert(!FileUtils.isAbsoulteUrl('some.domain/path/to/page'));
        assert(!FileUtils.isAbsoulteUrl('/path/to/page'));
    });

});
