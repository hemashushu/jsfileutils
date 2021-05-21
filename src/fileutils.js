const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { ObjectUtils } = require('jsobjectutils');

const HashAlgorithm = require('./hashalgorithm');
const BaseFileInfo = require('./basefileinfo');
const BaseFolderInfo = require('./basefolderinfo');

// URI 的方案/协议
//
// 一般有 http, https 和 file 等
// https://en.wikipedia.org/wiki/List_of_URI_schemes
// https://en.wikipedia.org/wiki/File_URI_scheme
// https://blogs.msdn.microsoft.com/ie/2006/12/06/file-uris-in-windows/
//
// 文件 URI 示例:
//
// file://laptop/My%20Documents/FileSchemeURIs.doc
// file:///C:/Documents%20and%20Settings/davris/FileSchemeURIs.doc
// file:///D:/Program%20Files/Viewer/startup.htm
// file:///C:/Program%20Files/Music/Web%20Sys/main.html?REQUEST=RADIO
// file://applib/products/a-b/abc_9/4148.920a/media/start.swf
// file:///C:/exampleㄓ.txt

const generalUriSchemes = ['http://', 'https://', 'file://'];

const defaultLocaleByteTitles = {
    byte: 'Byte',
    bytes: 'Bytes',
    kb: 'KB',
    mb: 'MB',
    gb: 'GB'
}

const KByteValue = 1024;
const MByteValue = 1024 * KByteValue;
const GByteValue = 1024 * MByteValue;

class FileUtils {

    /**
     * 判断一个 URL 是否绝对地址
     * 这里仅简答地判断 URL 是否以 URI 协议开头
     *
     * @param {*} url
     * @returns
     */
    static isAbsoulteUrl(url) {
        return generalUriSchemes.find((item) => {
            return url.startsWith(item);
        }) !== undefined;
    }

    /**
     * 移除文件名当中的非法字符。
     *
     * 在 Linux 常见的文件系统中对文件名允许的字符限制较少，除了 '/' 保留作为
     * 路径分隔符之外，大部分字符都可以作为文件名。
     * 但 Windows 文件系统的文件名保留了下列字符：
     *
     * - The following reserved characters:
     * - < (less than)
     * - > (greater than)
     * - : (colon)
     * - " (double quote)
     * - / (forward slash)
     * - \ (backslash)
     * - | (vertical bar or pipe)
     * - ? (question mark)
     * - * (asterisk)
     *
     * https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
     *
     * 为了让应用程序产生的文件有较好的平台兼容性，可以使用这个方法把 Windows 文件系统
     * 的文件名保留字符替换为空格。
     *
     * @param {*} fileName
     * @returns
     */
    static removeFileNameInvalidCharacters(fileName) {
        // 把 Windows 文件系统的文件名保留字符替换为空格。
        fileName = fileName.replace(/[<>:"\/\\|?*]+/g, ' ');

        // 连续的 2 个以上空格替换为 1 个空格。
        fileName = fileName.replace(/\s{2,}/g, ' ');
        fileName = fileName.trim();

        return fileName === '' ? '_' : fileName;
    }

    /**
     * 在指定的目录里获取一个不重复的文件名。
     *
     * 该方法一般用于创建新文件之前为用户选择合适的默认文件名。
     *
     * 示例：
     * fileName = 'demo.txt'
     *
     * - 如果在 directory 里不存在这个名称，则方法返回 'demo.txt'
     * - 如果已经存在，则 callback 返回 'demo 2.txt'
     * - 如果以上都存在，则 callback 返回 'demo 3.txt'，文件名后面的数字会递增。
     *
     * @param {*} directory
     * @param {*} fileName 基本文件名称，需要包含扩展名。
     * @param {*} callback callback(new_file_name)
     */
    static findNewFileName(directory, fileName, callback) {

        let processNext = (fileName) => {
            // file full name
            let filePath = path.join(directory, fileName);

            fs.access(filePath, (err) => {
                if (err) {
                    // 指定的文件名不存在，返回此文件名
                    callback(fileName);
                    return;
                }

                // 指定的文件名已存在。

                // 提取文件名的本名和扩展名
                // https://nodejs.org/api/path.html#path_path_parse_path
                let nameDetails = path.parse(fileName);

                // base name 即不带扩展名的文件名
                // 注意 path.parse() 方法返回的对象当中，
                // .base 对应的是文件名（含扩展名），
                // .name 对应的是我们需要的 base name。

                let baseName = nameDetails.name;
                let extName = nameDetails.ext; // 扩展名，包括前缀的点号

                // 尝试提取文件名末尾的数字，最多允许 4 位数字，即从 2 开始到 9999，
                // 如果超过 4 位，则数字前面将会是 1 个或连续多个 1。
                let match = /\d{1,4}$/.exec(baseName);
                if (match !== null) {
                    let lastPart = match[0];

                    // 数字递增 1
                    let num = parseInt(lastPart, 10);
                    num++;

                    let nextFileName = baseName.substring(0, match.index) + num + extName;

                    // 再次进入检查过程
                    processNext(nextFileName);
                    return;
                }

                // 添加一个空格 ' ' 和一个数字 2 到文件名之中。
                // 为了较少歧义，数字从 2 开始。
                let nextFileName = baseName + ' ' + '2' + extName;

                // 再次进入检查过程
                processNext(nextFileName);
            });

        };

        processNext(fileName);
    }

    /**
     * 在指定的目录里获取一个指定扩展名的不重复的文件名的基本名称。
     *
     * 此方法的作用跟 findNewFileName() 类似，不过返回的是文件名的
     * 基本名称部分。（文件名包含“基本名称”和“扩展名”两部分，比如
     * “hello.txt”，基本名称是 “hello”，扩展名是 “.txt”）
     *
     * @param {*} directory
     * @param {*} baseName 文件的基本名称，即不带扩展名的文件名
     * @param {*} extensionName 文件的扩展名，以一个点号 “.” 开始，比如 “.txt”
     * @param {*} callback callback(new_main_name)
     */
    static findNewFileNameWithSpecifiedExtensionName(directory, baseName, extensionName, callback) {

        let processNext = (baseName) => {
            // file full name
            let filePath = path.join(directory, baseName + extensionName);

            fs.access(filePath, (err) => {
                if (err) {
                    // 指定的文件名不存在，返回此文件名的基本名称
                    callback(baseName);
                    return;
                }

                // 指定的文件名已存在。
                //
                // 尝试提取文件名末尾的数字，最多允许 4 位数字，即从 2 开始到 9999，
                // 如果超过 4 位，则数字前面将会是 1 个或连续多个 1。
                let match = /\d{1,4}$/.exec(baseName);
                if (match !== null) {
                    let lastPart = match[0];

                    // 数字递增 1
                    let num = parseInt(lastPart, 10);
                    num++;

                    let nextBaseName = baseName.substring(0, match.index) + num;

                    // 再次进入检查过程
                    processNext(nextBaseName);
                    return;
                }

                // 添加一个空格 ' ' 和一个数字 2 到文件名之中。
                // 为了较少歧义，数字从 2 开始。
                let nextBaseName = baseName + ' ' + '2';

                // 再次进入检查过程
                processNext(nextBaseName);
            });
        };

        processNext(baseName);
    }

    /**
     * 获取不重复的目录名称。
     *
     * 此方法的作用跟 findNewFileName() 和 findNewFileNameWithSpecifiedExtensionName()
     * 类似，不过在判断是否重名时，是把文件名作为一个整体进行比较，而不是把主要名和扩展名分开来比较。
     *
     * 比如某目录里已经存在 “foo.bar” 目录，
     * - findNewFileName() 将会返回 “foo 2.bar”
     * - findNewFolderName() 将会返回 “foo.bar 2”
     *
     * 所以此方法适合寻找不重名的目录名称，需注意的是，这三个方法在比较名称时，并不区分目标的类型
     * 是文件还是目录（因为一般文件系统不允许同名的文件和目录，尽管它们类型不同）。
     *
     * @param {*} directory
     * @param {*} folderName
     * @param {*} callback callback(new_folder_name)
     */
    static findNewFolderName(directory, folderName, callback) {

        let processNext = (folderName) => {
            // folder full name
            let filPath = path.join(directory, folderName);

            fs.access(filPath, (err) => {
                if (err) {
                    // 指定的文件名不存在，返回此文件名的基本名称
                    callback(folderName);
                    return;
                }

                // 指定的文件名已存在。
                //
                // 尝试提取文件名末尾的数字，最多允许 4 位数字，即从 2 开始到 9999，
                // 如果超过 4 位，则数字前面将会是 1 个或连续多个 1。
                let match = /\d{1,4}$/.exec(folderName);
                if (match !== null) {
                    let lastPart = match[0];

                    // 数字递增 1
                    let num = parseInt(lastPart, 10);
                    num++;

                    let nextFolderName = folderName.substring(0, match.index) + num;

                    // 再次进入检查过程
                    processNext(nextFolderName);
                    return;
                }

                // 添加一个空格 ' ' 和一个数字 2 到文件名末尾。
                // 为了较少歧义，数字从 2 开始。
                let numberFolderName = folderName + ' ' + '2';

                // 再次进入检查过程
                processNext(numberFolderName);
            });
        };

        processNext(folderName);
    }

    /**
     * 简单列举一个目录里的文件及子目录
     *
     * @param {*} directory
     * @param {*} callback callback(err, [AbstractBaseFileInfo,...])
     */
    static list(directory, callback) {

        let items = [];

        let processNext = (fileNames) => {
            if (fileNames.length === 0) {
                callback(null, items);
                return;
            }

            let fileName = fileNames.pop();
            let filePath = path.join(directory, fileName);

            fs.stat(filePath, (err, stat) => {
                if (err) {
                    callback(err);
                    return;
                }

                // stat.birthtime 为文件的创建时间，为 Date 类型的数据
                // stat.birthtimeMS 同样也是文件的创建时间，不过数据类型
                //     为 int, 数值是从 1970 开始经过的毫秒（milliseconds）。
                //
                // stat.mtime 为文件内容修改的时间
                // stat.ctime 为文件状态（比如权限）的修改时间

                if (stat.isDirectory()) {
                    let item = new BaseFolderInfo(
                        fileName,
                        stat.birthtime);

                    items.push(item);

                } else {
                    let item = new BaseFileInfo(
                        fileName,
                        stat.birthtime,
                        stat.size,
                        stat.mtime
                    );

                    items.push(item);
                }

                processNext(fileNames);
            });
        };

        fs.readdir(directory, (err, fileNames) => {
            if (err) {
                callback(err);
                return;
            }

            processNext(fileNames);
        });
    }

    /**
     * 计算文件的哈希值(Hash)/散列值
     *
     * @param {*} filePath
     * @param {*} hashAlgorithm HashAlgorithm 类型
     * @param {*} callback callback(err, hash_value_hex_lower_case) 返回
     *     散列值的小写 16 进制字符串。
     */
    static hashFile(filePath, hashAlgorithm = HashAlgorithm.sha256, callback) {
        fs.readFile(filePath, (err, bufferData) => {
            if (err) {
                callback(err);
                return;
            }

            let hashValue = FileUtils.hashData(bufferData, hashAlgorithm);
            callback(null, hashValue);
        });
    }

    /**
     * 计算数据（Buffer）的哈希值(Hash)/散列值
     *
     * @param {*} bufferData
     * @param {*} hashAlgorithm HashAlgorithm 类型
     * @returns 返回散列值的小写 16 进制字符串。
     */
    static hashData(bufferData, hashAlgorithm = HashAlgorithm.sha256) {
        let hash;
        switch (hashAlgorithm) {
            case HashAlgorithm.sha256:
                hash = crypto.createHash('sha256');
                break;

            default:
                IllegalArgumentException('Unsupport hash algorithm.');
        }

        hash.update(bufferData);
        return hash.digest('hex');
    }

    /**
     * 以指定名称备份文件到指定目录。
     *
     * 示例：
     * FileUtils.backup('/path/to/source-file', '/new/path', 'backup-name-1.bak')
     *
     * 将会复制 source-file 到 '/new/path/backup-name-1.bak'
     * 如果目标文件已经存在，则自动累加末尾的数字，比如：
     * backup-name-2.bak, backup-name-3.bak
     *
     * @param {*} sourceFilePath
     * @param {*} targetDir
     * @param {*} targetFileName 备份目标文件名，需要包含扩展名，建议使用
     *     'name-1.bak' 这样格式的文件名，即
     *     “基本名称” + “-” + “初始数字1” + “.扩展名”
     * @param {*} callback callback(err, backupFilePath)
     */
    static backup(sourceFilePath, targetDir, targetFileName, callback) {
        FileUtils.findNewFileName(targetDir, targetFileName, (lastBackFileName) => {
            let backupFilePath = path.join(targetDir, lastBackFileName);

            fs.copyFile(sourceFilePath, backupFilePath, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, backupFilePath);
            });
        });
    }

    /**
     * 按条件复制文件：仅当目标文件不存在时才复制
     *
     * @param {*} sourceFilePath
     * @param {*} targetFilePath
     * @param {*} callback callback(err, isCopied?)
     */
    static copyFileWhenTargetFileAbsent(sourceFilePath, targetFilePath, callback) {

        let processCopy = () => {
            fs.copyFile(sourceFilePath, targetFilePath, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, true);
            });
        };

        FileUtils.exists(targetFilePath, (err, exists) => {
            if (err) {
                callback(err);
                return;
            }

            if (exists) {
                callback(null, false);
            } else {
                processCopy();
            }
        });
    }

    /**
     * 按条件重命名文件：仅当目标文件不存在时才重命名
     *
     * @param {*} sourceFilePath
     * @param {*} targetFilePath
     * @param {*} callback callback(err, isRenamed?)
     */
    static renameFileWhenTargetFileAbsent(sourceFilePath, targetFilePath, callback) {
        let processRename = () => {
            // https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback
            fs.rename(sourceFilePath, targetFilePath, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, true);
            });
        };

        FileUtils.exists(targetFilePath, (err, exists) => {
            if (err) {
                callback(err);
                return;
            }

            if (exists) {
                callback(null, false);
            } else {
                processRename();
            }
        });
    }

    /**
     * 删除指定的文件，如果目标文件不存在，也不产生错误。
     *
     * @param {*} filePath
     * @param {*} callback callback(err, isRemoved?)
     */
    static removeFileIgnoreNonExists(filePath, callback) {
        // https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback
        fs.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // 忽略目标文件不存在这种情况
                    callback(null, false);
                } else {
                    callback(err);
                    return;
                }
            }

            callback(null, true);
        });
    }

    /**
     * 判断指定的一组文件是否都存在。
     *
     * @param {*} filePaths
     * @param {*} callback callback(err, all-exists?, the-absent-file-path)
     */
    static existsAll(filePaths, callback) {

        let processCheckNext = (filePaths) => {
            if (filePaths.length === 0) {
                callback(null, true);
                return;
            }

            let filePath = filePaths.pop();

            FileUtils.exists(filePath, (err, exists) => {
                if (err) {
                    callback(err);
                    return;
                }

                if (!exists) {
                    // 有一个文件不存在，立即返回
                    callback(null, false, filePath);
                    return;
                }

                processCheckNext(filePaths);
            });
        };

        let cloneFilePaths = ObjectUtils.arrayClone(filePaths);
        processCheckNext(cloneFilePaths);
    }

    /**
     * 判断指定的一组文件是否至少存在其中的一个。
     *
     * @param {*} filePaths
     * @param {*} callback callback(err, exists-any?, the-first-exists-file-path).
     */
    static existsAny(filePaths, callback) {

        let processCheckNext = (filePaths) => {
            if (filePaths.length === 0) {
                callback(null, false);
                return;
            }

            let fullName = filePaths.pop();
            FileUtils.exists(fullName, (err, exists) => {
                if (err) {
                    callback(err);
                    return;
                }

                if (exists) {
                    // 有一个文件存在，立即返回
                    callback(null, true, fullName);
                    return;
                }

                processCheckNext(filePaths);
            });
        };

        let cloneFilePaths = ObjectUtils.arrayClone(filePaths);
        processCheckNext(cloneFilePaths);
    }

    /**
     * 判断指定的文件是否存在。
     *
     * @param {*} filePath
     * @param {*} callback callback(err, isExists?)
     */
    static exists(filePath, callback) {
        fs.access(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    callback(null, false);
                } else {
                    callback(err);
                }

                return;
            }

            callback(null, true);
        });
    }

    //     /**
    //      * 读取一个文本文件到一个字符串数组，数组中的每个元素为文本的每一行内容。
    //      *
    //      * @param {*} filePath 目标文件，必须是文本文件，且编码为 utf-8
    //      * @param {*} callback callback(err, lines) 当目标文件不存在时，
    //      *     lines 的值为 undefined。当文件内容为空时，lines 为空数组。
    //      */
    //     static readTextFileIntoLines(filePath, callback) {
    //         fs.readFile(filePath, 'utf-8', (err, lastTextContent) => {
    //             if (err) {
    //                 if (err.code === 'ENOENT') {
    //                     // 目标文件不存在，返回 undefined.
    //                     callback(null);
    //                 } else {
    //                     callback(err);
    //                 }
    //                 return;
    //             }
    //
    //             if (lastTextContent === '') {
    //                 // 目标文件内容为空，返回空数组
    //                 callback(null, []);
    //                 return;
    //             }
    //
    //             // 替换 '\r\n' 换行符（Windows 系统的应用所创建的文本文件
    //             // 通常是以这种方式换行）为 '\n'。
    //             lastTextContent = lastTextContent.replace(/\r\n/g, '\n');
    //             let lines = lastTextContent.split('\n');
    //             callback(null, lines);
    //         });
    //     }
    //
    //     /**
    //      * 将一个字符串数组写入到目标文本文件。
    //      *
    //      * 目标文件将会以 utf-8 编码，并且每次写入时都会覆盖已有的
    //      * 内容（假如有的话）。
    //      *
    //      * @param {*} filePath 目标文件
    //      * @param {*} lines
    //      * @param {*} callback callback(err)
    //      * @returns
    //      */
    //     static writeLinesToTextFile(filePath, lines, callback) {
    //         let textContent = lines.join('\n');
    //         fs.writeFile(filePath, textContent, 'utf-8', (err) => {
    //             if (err) {
    //                 callback(err);
    //                 return;
    //             }
    //
    //             callback();
    //         });
    //     }

    static formatFileSize(size, localeByteTitles = {}) {
        // 注意不要使用 Object.assign({}, defaultObject, userObject) 方法
        // 合并用户设置对象和默认值对象。
        // 因为 Object.assign 在合并 userObject 对象和 defaultObject 时，
        // 会把 userObject 当中同值为 undefined 属性一起覆盖 defaultObject，通常
        // 这不是我们期望的结果。
        // 比如：
        // defaultObject: {a: 123, b: 'foo'}
        // userObject: {a: 456, b: undefined}
        //
        // Object.assign({}, defaultObject, userObject) 的结果是:
        // {a: 456, b: undefined }
        //
        // 详细见 ObjectUtils.objectMerge() 方法的说明。

        let titles = ObjectUtils.objectMerge(localeByteTitles, defaultLocaleByteTitles);

        if (size >= GByteValue) {
            let length = size / GByteValue;
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
            return `${length.toFixed(1)} ${titles.gb}`;

        } else if (size >= MByteValue) {
            let length = size / MByteValue;
            return `${length.toFixed(1)} ${titles.mb}`;

        } else if (size >= KByteValue) {
            let length = size / KByteValue;
            return `${length.toFixed(1)} ${titles.kb}`;

        } else if (size > 1) {
            return `${size} ${titles.bytes}`;

        } else {
            return `${size} ${titles.byte}`;
        }
    }
}

module.exports = FileUtils;