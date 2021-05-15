const BaseFileInfo = require('./src/basefileinfo');
const BaseFolderInfo = require('./src/basefolderinfo');
const FileUtils = require('./src/fileutils');
const HashAlgorithm = require('./src/hashalgorithm');
const PromiseFileUtils = require('./src/promisefileutils');

module.exports = {
    BaseFileInfo: BaseFileInfo,
    BaseFolderInfo: BaseFolderInfo,
    FileUtils: FileUtils,
    HashAlgorithm: HashAlgorithm,
    PromiseFileUtils: PromiseFileUtils
};