import multer from 'multer';

const storage = multer.memoryStorage(); //used memory storage  so that we can directly upload file on cloud  service platform like -clodinary, no need to save locally.

const uploadFile = multer({ storage }).single("file");

export default uploadFile;