"use strict";
exports.__esModule = true;
var multer_1 = require("multer");
var path_1 = require("path");
var crypto_1 = require("crypto");
var tmpFolder = path_1["default"].resolve(__dirname, '..', '..', 'tmp');
exports["default"] = {
    directory: tmpFolder,
    storage: multer_1["default"].diskStorage({
        destination: tmpFolder,
        filename: function (request, file, callback) {
            var fileHash = crypto_1["default"].randomBytes(10).toString('hex');
            var filename = fileHash + "-" + file.originalname;
            return callback(null, filename);
        }
    })
};
