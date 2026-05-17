export { minify, prettify } from './json';
export { minify as minifyHTML, prettify as prettifyHTML } from './html';
export { minify as minifyCSS, prettify as prettifyCSS } from './css';
export { minify as minifyJS, prettify as prettifyJS } from './js';
export { encode as htmlEntitiesEncode, decode as htmlEntitiesDecode } from './htmlEntities';
export { encode as base64Encode, decode as base64Decode } from './base64';
export { encode as urlEncode, decode as urlDecode } from './urlCodec';
export { hexToRgb, rgbToHex } from './colors';
export { generateLoremIpsum } from './loremIpsum';