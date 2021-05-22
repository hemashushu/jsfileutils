class AbstractFileInfo {
    constructor(filePath, creationTime) {
        this.filePath = filePath; // 文件路径，实际上文件路径也包含有文件名称
        this.creationTime = creationTime; // Date，文件的创建时间
    }
}

module.exports = AbstractFileInfo;