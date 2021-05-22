const AbstractFileInfo = require('./abstractfileinfo');

class FileInfo extends AbstractFileInfo {
    constructor(filePath, creationTime, size, lastModified) {
        super(filePath, creationTime);

        this.size = size; // 整数
        this.lastModified = lastModified; // Date，文件内容（非文件状态）的修改时间
    }
}

module.exports = FileInfo;