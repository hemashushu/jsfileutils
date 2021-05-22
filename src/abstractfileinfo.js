const path = require('path');

class AbstractFileInfo {
    constructor(filePath, creationTime) {
        this.filePath = filePath; // 文件路径
        this.creationTime = creationTime; // Date，文件的创建时间

        this.fileName = path.basename(filePath);
        this.fileDir = path.dirname(filePath);
    }
}

module.exports = AbstractFileInfo;