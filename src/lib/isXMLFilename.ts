import { extname } from 'path';

export const isXMLFilename = (uri: string) => extname(uri) === '.xml';
