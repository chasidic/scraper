declare module 'readline-sync' {
  let a: { prompt(): void };
  export default a;
}

declare module 'iconv' {
  export class Iconv {
    writable: boolean;

    constructor(fromEncoding: string, toEncoding: string);
    convert(input: string | Buffer, encoding?: string): Buffer;
    write(input: string | Buffer, encoding?: string): boolean;
    end(input?: string | Buffer, encoding?: string): void;

    // copy from NodeJS.WritableStream for compatibility
    write(buffer: Buffer|string, cb?: Function): boolean;
    write(str: string, encoding?: string, cb?: Function): boolean;
    end(): void;
    end(buffer: Buffer, cb?: Function): void;
    end(str: string, cb?: Function): void;
    end(str: string, encoding?: string, cb?: Function): void;

    // copy from stream.Stream
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
  }
}
