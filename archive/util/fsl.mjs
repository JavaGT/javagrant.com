// This is half-assed and shouldn't be used


import path from 'path';
// this is a drop in replacement for fs/promises which uses LevelDB as the backend
import { Level } from "level";

export default class fsl {
    #db;
    constructor(db) {
        this.#db = new Level(db);
    }

    async readFile(filepath) {
        const data = await this.#db.get(filepath);
        if (data === undefined) {
            throw new Error(`ENOENT: no such file or directory, open '${filepath}'`);
        }
        if (typeof data === 'string') {
            return data;
        }
        data.toString = () => data;
        return data;
    }

    async writeFile(file, data) {
        return this.#db.put(file, data);
    }

    async unlink(file) {
        return this.#db.del(file);
    }

    async readdir(pathname, options = {}) {
        const includeSubdirectories = options.includeSubdirectories || false;
        // use path utils to normalize the path
        console.log('readdir1', pathname);
        pathname = path.normalize(pathname);
        // handle . and ..
        const pathParts = pathname.split(path.sep);
        if (pathParts[pathParts.length - 1] === '') {
            pathParts.pop();
        }
        if (pathParts[pathParts.length - 1] === '.') {
            pathParts.pop();
        }
        pathname = pathParts.join(path.sep);
        console.log('readdir2', pathname);

        return new Promise(async (resolve, reject) => {
            let keys = [];
            let iterator = this.#db.keys({ gte: pathname, lte: pathname + '\xff' });
            for await (const key of iterator) {
                // check not in subdirectory
                if (key.startsWith(pathname) && key !== pathname) {
                    let keyParts = key.split(path.sep);
                    if (keyParts.length === pathParts.length + 1) {
                        keys.push(key);
                    }
                }
            }
            resolve(keys);
        })
    }

    async mkdir(path) {
        // noop
    }

    async rmdir(path) {
        let keys = await this.readdir(path);
        for (let key of keys) {
            await this.unlink(key);
        }
    }

    // async glob(pattern) {
    //     let keys = [];
    //     for await (const key of this.#db.keys()) {
    //         // glob matching
    //         if (key.match(pattern)) {
    //             keys.push(key);
    //         }
    //     }
    //     return keys;
    // }

    async numberOfFiles() {
        let count = 0;
        for await (const key of this.#db.createKeyStream()) {
            count++;
        }
        return count;
    }
}