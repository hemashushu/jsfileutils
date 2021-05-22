const AbstractFileInfo = require('./abstractfileinfo');

class FolderInfo extends AbstractFileInfo {
    constructor(filePath, creationTime, children = []) {
        super(filePath, creationTime);

        // 文件夹里面的文件，或子文件夹
        // 是一个 AbstractFileInfo 对象数组
        this.children = children;
    }
}

module.exports = FolderInfo;