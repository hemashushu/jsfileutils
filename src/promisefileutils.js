const FileUtils = require('./fileutils');

class PromiseFileUtils extends FileUtils {
    static findNewFileName(directory, fileName) {
        return new Promise((resolve, reject) => {
            FileUtils.findNewFileName(directory, fileName, (err, newFileName) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newFileName);
                }
            });
        });
    }

    static findNewFileNameWithSpecifiedExtensionName(directory, baseName, extensionName) {
        return new Promise((resolve, reject) => {
            FileUtils.findNewFileNameWithSpecifiedExtensionName(
                directory, baseName, extensionName, (err, newBaseName) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(newBaseName);
                    }
                });
        });
    }

    static findNewFolderName(directory, folderName) {
        return new Promise((resolve, reject) => {
            FileUtils.findNewFolderName(directory, folderName, (err, newFolderName) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newFolderName);
                }
            });
        });
    }

    static getFileInfo(filePath) {
        return new Promise((resolve, reject) => {
            FileUtils.getFileInfo(directory, (err, fileInfo) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(fileInfo);
                }
            });
        });
    }

    static list(folderPath) {
        return new Promise((resolve, reject) => {
            FileUtils.list(folderPath, (err, abstractFileInfos) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(abstractFileInfos);
                }
            });
        });
    }

    static listRecursively(folderPath) {
        return new Promise((resolve, reject) => {
            FileUtils.listRecursively(folderPath, (err, abstractFileInfos) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(abstractFileInfos);
                }
            });
        });
    }

    static listRecursivelyInTree(folderPath) {
        return new Promise((resolve, reject) => {
            FileUtils.listRecursivelyInTree(folderPath, (err, folderInfo) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(folderInfo);
                }
            });
        });
    }

    static hashFile(filePath, hashAlgorithm = HashAlgorithm.sha256) {
        return new Promise((resolve, reject) => {
            FileUtils.hashFile(filePath, hashAlgorithm, (err, hashValue) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hashValue);
                }
            });
        });
    }

    static backup(sourceFilePath, targetDir, targetFileName) {
        return new Promise((resolve, reject) => {
            FileUtils.backup(sourceFilePath,
                targetDir, targetFileName, (err, backupFilePath) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(backupFilePath);
                    }
                });
        });
    }

    static copyFileWhenTargetFileAbsent(sourceFilePath, targetFilePath) {
        return new Promise((resolve, reject) => {
            FileUtils.copyFileWhenTargetFileAbsent(
                sourceFilePath, targetFilePath, (err, isCopied) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(isCopied);
                    }
                });
        });
    }

    static renameFileWhenTargetFileAbsent(sourceFilePath, targetFilePath) {
        return new Promise((resolve, reject) => {
            FileUtils.renameFileWhenTargetFileAbsent(
                sourceFilePath, targetFilePath, (err, isRenamed) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(isRenamed);
                    }
                });
        });
    }

    static removeFileIgnoreNonExists(filePath) {
        return new Promise((resolve, reject) => {
            FileUtils.removeFileIgnoreNonExists(filePath, (err, isRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(isRemoved);
                }
            });
        });
    }

    /**
     *
     * @param {*} filePaths
     * @returns 返回 Promise ({isAllExists, absentFilePath})
     */
    static existsAll(filePaths) {
        return new Promise((resolve, reject) => {
            FileUtils.existsAll(filePaths, (err, isAllExists, absentFilePath) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({isAllExists, absentFilePath});
                }
            });
        });
    }

    /**
     *
     * @param {*} filePaths
     * @returns 返回 Promise ({isExistsAny, existsFilePath})
     */
    static existsAny(filePaths) {
        return new Promise((resolve, reject) => {
            FileUtils.existsAny(filePaths, (err, isExistsAny, existsFilePath) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({isExistsAny, existsFilePath});
                }
            });
        });
    }

    /**
     *
     * @param {*} filePath
     * @returns 返回 Promise (isExists)
     */
    static exists(filePath) {
        return new Promise((resolve, reject) => {
            FileUtils.exists(filePath, (err, isExists) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(isExists);
                }
            });
        });
    }
}

module.exports = PromiseFileUtils;