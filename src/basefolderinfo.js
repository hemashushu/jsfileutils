const AbstractBaseFileInfo = require('./abstractbasefileinfo');

class BaseFolderInfo extends AbstractBaseFileInfo {
    constructor(name, creationTime) {
        super(name, creationTime);
    }
}

module.exports = BaseFolderInfo;