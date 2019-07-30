#!/usr/bin/node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var JSONEditor = /** @class */ (function () {
    function JSONEditor(jsonPath) {
        this.jsonPath = isJsonPath(jsonPath) ? jsonPath : jsonPath + ".json";
        this.readJson();
    }
    JSONEditor.prototype.readJson = function () {
        var jsonPath = this.jsonPath;
        var jsonString = fs_1.default.readFileSync(jsonPath, { encoding: 'utf-8' });
        this.jsonData = JSON.parse(jsonString);
    };
    JSONEditor.prototype.set = function (key, value) {
        this.jsonData = setNestingObject(this.jsonData, key, value);
    };
    JSONEditor.prototype.get = function (key) {
        return getNestingObject(this.jsonData, key);
    };
    JSONEditor.prototype.save = function () {
        fs_1.default.writeFileSync(this.jsonPath, JSON.stringify(this.jsonData));
    };
    return JSONEditor;
}());
exports.default = JSONEditor;
function isJsonPath(filePath) {
    return /\.json$/.test(filePath);
}
function getNestingObject(obj, keys) {
    return keys
        ? keys.split('.').reduce(function (acc, curKey) {
            if (!acc) {
                return undefined;
            }
            return acc[curKey];
        }, obj)
        : obj;
}
function setNestingObject(obj, keys, value) {
    var curObj = Object.assign({}, obj);
    var changedObj = curObj;
    var keyArr = keys.split('.');
    var isLegal = true;
    for (var i = 0; i < keyArr.length - 1; i++) {
        var curKey = keyArr[i];
        curObj = curObj[curKey];
        if (curObj === null || typeof curObj !== 'object') {
            console.log(curObj);
            isLegal = false;
            break;
        }
    }
    if (!isLegal) {
        console.error('illegal key');
        return obj;
    }
    curObj[keyArr[keyArr.length - 1]] = value;
    return changedObj;
}
