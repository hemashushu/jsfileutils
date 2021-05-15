const AbstractBaseFileInfo = require('./abstractbasefileinfo');

class BaseFileInfo extends AbstractBaseFileInfo {
    constructor(name, creationTime, size, lastModified) {
        super(name, creationTime);

        this.size = size; // 整数
        this.lastModified = lastModified; // Date，文件内容（非文件状态）的修改时间
    }
}

module.exports = BaseFileInfo;