import DataUriParser from 'datauri/parser.js';
import path from 'path';

const getDataurl = (file)=>{
const parser = new DataUriParser();

const extName = path.extname(file.originalname).toString();
return parser.format(extName, file.buffer);  // parser.format() method converts it to a base64 string with the appropriate extension.

}

export default getDataurl;