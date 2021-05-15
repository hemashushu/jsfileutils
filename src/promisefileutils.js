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

    static list(directory) {
        return new Promise((resolve, reject) => {
            FileUtils.list(directory, (err, fileInfos) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(fileInfos);
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

    static existsAll(filePaths) {
        return new Promise((resolve, reject) => {
            FileUtils.existsAll(filePaths, (err, allExists, absentFilePath) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(allExists, absentFilePath);
                }
            });
        });
    }

    static existsAny(filePaths) {
        return new Promise((resolve, reject) => {
            FileUtils.existsAny(filePaths, (err, existsAny, existsFilePath) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(existsAny, existsFilePath);
                }
            });
        });
    }

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

    static readTextFileIntoLines(filePath) {
        return new Promise((resolve, reject) => {
            FileUtils.readTextFileIntoLines(filePath, (err, lines) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(lines);
                }
            });
        });
    }

    static writeLinesToTextFile(filePath, lines) {
        return new Promise((resolve, reject) => {
            FileUtils.writeLinesToTextFile(filePath, lines, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = PromiseFileUtils;