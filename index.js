const FileInfo = require('./src/fileinfo');
const FolderInfo = require('./src/folderinfo');
const FileUtils = require('./src/fileutils');
const HashAlgorithm = require('./src/hashalgorithm');
const PromiseFileUtils = require('./src/promisefileutils');

module.exports = {
    FileInfo: FileInfo,
    FolderInfo: FolderInfo,
    FileUtils: FileUtils,
    HashAlgorithm: HashAlgorithm,
    PromiseFileUtils: PromiseFileUtils
};