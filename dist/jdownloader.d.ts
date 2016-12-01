export interface IJDownloaderOptions {
    uri: string | string[];
    pattern?: string;
    packageName?: string;
}
export declare function jdownloader({uri, pattern, packageName}: IJDownloaderOptions): Promise<number>;
