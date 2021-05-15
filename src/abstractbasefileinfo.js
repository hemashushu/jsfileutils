class AbstractBaseFileInfo {
    constructor(name, creationTime) {
        this.name = name; // 文件名
        this.creationTime = creationTime; // Date，文件的创建时间
    }
}

module.exports = AbstractBaseFileInfo;