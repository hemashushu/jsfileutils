const path = require('path');

const assert = require('assert/strict');
const {ObjectUtils} = require('jsobjectutils');

const {FileInfo, FolderInfo, FileUtils, HashAlgorithm, PromiseFileUtils} = require('../index');

const testDir = __dirname;
const testResourceFolderName = 'resource';
const testResourceDir = path.join(testDir, testResourceFolderName);

describe('FileUtils Test', () => {
    it('Test isAbsoulteUrl()', ()=>{
        assert(FileUtils.isAbsoulteUrl('http://some.domain/path/to/page'));
        assert(FileUtils.isAbsoulteUrl('https://some.domain/path/to/page'));
        assert(FileUtils.isAbsoulteUrl('file:///path/to/file'));
        assert(!FileUtils.isAbsoulteUrl('some.domain/path/to/page'));
        assert(!FileUtils.isAbsoulteUrl('/path/to/page'));
    });

    describe('Test getFileInfo()', ()=>{
        it('Test get file info', (done) => {
            let test1FilePath = path.join(testResourceDir, 'test1.txt');
            FileUtils.getFileInfo(test1FilePath, (err, fileInfo) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                assert(fileInfo instanceof FileInfo);
                assert.equal(fileInfo.filePath, test1FilePath);
                assert.equal(fileInfo.size, 10);

                done();
            });
        });

        it('Test get folder info', (done) => {
            let dir1FilePath = path.join(testResourceDir, 'dir1');
            FileUtils.getFileInfo(dir1FilePath, (err, fileInfo) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                assert(fileInfo instanceof FolderInfo);
                assert.equal(fileInfo.filePath, dir1FilePath);

                done();
            });
        });
    });

    describe('Test list file info', ()=>{
        it('Test list()', (done) => {
            FileUtils.list(testResourceDir, (err, fileInfos) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                assert.equal(5, fileInfos.length);

                let names = fileInfos
                    .map(item => {
                        return path.basename(item.filePath)
                    })
                    .sort();

                assert(ObjectUtils.arrayEquals(names,
                    ['dir1', 'dir2', 'test1.txt', 'test2.txt', 'test3.md']))

                done();
            });
        });

        it('Test list() - another folder', (done) => {
            let dir1Path = path.join(testResourceDir, 'dir1');
            FileUtils.list(dir1Path, (err, fileInfos) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                assert.equal(3, fileInfos.length);

                let names = fileInfos
                    .map(item => {
                        return path.basename(item.filePath)
                    })
                    .sort();

                assert(ObjectUtils.arrayEquals(names,
                    ['dir3', 'test1-1.txt', 'test1-2.md']))

                done();
            });
        });
    });

    describe('Test list file info recursively', ()=>{
        it('Test list recursively - flat', (done) => {
            FileUtils.listRecursively(testResourceDir, (err, fileInfos) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                let baseDirLength = testResourceDir.length;
                let names = fileInfos
                    .map(item=>{
                        return item.filePath.substring(baseDirLength);
                    })
                    .sort();

                assert(ObjectUtils.arrayEquals(names, [
                    '/dir1',
                    '/dir1/dir3',
                    '/dir1/dir3/test1-1-1.txt',
                    '/dir1/dir3/test1-1-2.txt',
                    '/dir1/test1-1.txt',
                    '/dir1/test1-2.md',
                    '/dir2',
                    '/dir2/test2-1.txt',
                    '/test1.txt',
                    '/test2.txt',
                    '/test3.md']));

                done();
            });
        });

        it('Test list recursively - tree', (done) => {
            FileUtils.listRecursivelyInTree(testResourceDir, (err, fileInfo) => {
                if (err) {
                    fail(err.message);
                    return;
                }

                // the root folder
                assert(fileInfo instanceof FolderInfo);
                assert.equal(testResourceDir, fileInfo.filePath);

                // the 1st level files and folders
                let firstLevelFileInfos = fileInfo.children;
                assert.equal(5, firstLevelFileInfos.length);

                let names1 = firstLevelFileInfos
                    .map(item => {
                        return path.basename(item.filePath);
                    })
                    .sort();

                assert(ObjectUtils.arrayEquals(names1,
                    ['dir1', 'dir2', 'test1.txt', 'test2.txt', 'test3.md']));

                // the 2nd level files and folders
                let dir1FileInfo = firstLevelFileInfos
                    .find(item => {
                        return path.basename(item.filePath) === 'dir1';
                    });

                let secondLevelFileInfos = dir1FileInfo.children;
                assert.equal(3, secondLevelFileInfos.length);

                let names2 = secondLevelFileInfos
                    .map(item => {
                        return path.basename(item.filePath)
                    })
                    .sort();

                assert(ObjectUtils.arrayEquals(names2,
                    ['dir3', 'test1-1.txt', 'test1-2.md']))

                done();
            });
        });
    });
});
