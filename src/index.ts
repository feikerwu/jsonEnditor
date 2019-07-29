#!/usr/bin/node

import fs from 'fs';

export default class JSONEditor {
  jsonPath: string;
  jsonData: object;

  constructor(jsonPath: string) {
    this.jsonPath = isJsonPath(jsonPath) ? jsonPath : `${jsonPath}.json`;
    this.readJson();
  }

  readJson(): void {
    const { jsonPath } = this;
    const jsonString = fs.readFileSync(jsonPath, { encoding: 'utf-8' });
    this.jsonData = JSON.parse(jsonString);
  }

  set<T>(key: string, value: T): void {
    this.jsonData = setNestingObject(this.jsonData, key, value);
  }

  get(key?: string): any {
    return getNestingObject(this.jsonData, key);
  }

  save(): void {
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.jsonData));
  }
}

function isJsonPath(filePath: string): boolean {
  return /\.json$/.test(filePath);
}

function getNestingObject(obj: object, keys: string | undefined): any {
  return keys
    ? keys.split('.').reduce((acc, curKey) => {
        if (!acc) {
          return undefined;
        }

        return acc[curKey];
      }, obj)
    : obj;
}

function setNestingObject(obj: object, keys: string, value): object {
  let curObj = Object.assign({}, obj);
  let changedObj = curObj;

  const keyArr: Array<string> = keys.split('.');
  let isLegal: boolean = true;

  for (let i = 0; i < keyArr.length - 1; i++) {
    let curKey = keyArr[i];
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
