import { post } from 'request';

const source = 'NODE';
const headers = { 'content-type': 'application/x-www-form-urlencoded' };
const url = 'http://127.0.0.1:9666/flashgot';

interface IJDownloaderForm {
    urls: string;
    source: string;
    fnames?: string;
    package?: string;
}

export interface IJDownloaderOptions {
    uri: string | string[];
    pattern?: string;
    packageName?: string;
}

export async function jdownloader({
    uri,
    pattern = null,
    packageName = null,
}: IJDownloaderOptions) {

    const urls = typeof uri === 'string' ? uri : uri.join(',');
    let form: IJDownloaderForm = { urls, source };
    if (pattern != null) form.fnames = pattern;
    if (packageName != null) form.package = packageName;

    return new Promise<number>((resolve, reject) => {
        post({ headers, url, form }, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.statusCode);
            }
        });
    });
}
