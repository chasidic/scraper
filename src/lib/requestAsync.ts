import { get } from 'request';
import { isXMLFilename } from './isXMLFilename';
import { bufferToString } from './bufferToString';

const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
};

export async function requestAsync(uri: string) {
    return new Promise<string>((resolve, reject) => {
        get(uri, { encoding: null, headers }, (err, res, buffer) => {
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
