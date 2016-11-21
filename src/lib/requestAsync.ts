import { get } from 'request';
import { isXMLFilename } from './isXMLFilename';
import { bufferToString } from './bufferToString';

const REPLACEMENT_CHAR_REGEX = /\uFFFD/;

export async function requestAsync(uri: string) {
    return new Promise<string>((resolve, reject) => {
        get(uri, { encoding: null }, (err, res, buffer) => {
            if (err) {
                reject(err.message);
            } else if (res.statusCode !== 200) {
                reject(res.statusCode);
            } else {
                let cache = bufferToString(buffer, isXMLFilename(uri));
                if (REPLACEMENT_CHAR_REGEX.test(cache)) {
                    reject('corrupted body');
                } else {
                    resolve(cache);
                }
            }
        });
    });
};
