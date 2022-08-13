"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@nouns/sdk");
const node_libpng_1 = require("node-libpng");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const DESTINATION = path.join(__dirname, './output/image-data.json');
const encode = () => __awaiter(void 0, void 0, void 0, function* () {
    const encoder = new sdk_1.PNGCollectionEncoder();
    const folders = ['backgrounds', 'basecolors', 'mathletters', 'visors', 'flair', 'accessories'];
    for (const folder of folders) {
        const folderpath = path.join(__dirname, './images', folder);
        const files = yield fs_1.promises.readdir(folderpath);
        for (const file of files) {
            const image = yield (0, node_libpng_1.readPngFile)(path.join(folderpath, file));
            encoder.encodeImage(file.replace(/\.png$/, ''), image, folder);
        }
    }
    yield encoder.writeToFile('encoder-output.txt');
});
encode();
