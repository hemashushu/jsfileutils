const path = require('path');

const assert = require('assert/strict');
const { ObjectUtils } = require('jsobjectutils');

const { FileInfo, FolderInfo, FileUtils, HashAlgorithm, PromiseFileUtils } = require('../index');

const testDir = __dirname;
const testResourceFolderName = 'resource';
const testResourceDir = path.join(testDir, testResourceFolderName);

describe('Promise FileUtils Test', () => {
    describe('Test list file info', () => {
        it('Test list()', async () => {
            await PromiseFileUtils.list(testResourceDir)
                .then(fileInfos => {
                    assert.equal(5, fileInfos.length);

                    let names = fileInfos
                        .map(item => {
                            return path.basename(item.filePath)
                        })
                        .sort();

                    assert(ObjectUtils.arrayEquals(names,
                        ['dir1', 'dir2', 'test1.txt', 'test2.txt', 'test3.md']))
                });
        });

        it('Test listRecursively()', async () => {
            await PromiseFileUtils.listRecursively(testResourceDir)
                .then(fileInfos => {

                    let baseDirLength = testResourceDir.length;
                    let names = fileInfos
                        .map(item => {
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
                });
        });
    });
});