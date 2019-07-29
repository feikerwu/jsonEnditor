import JSONEditor from '../src';
import fs from 'fs';

const testJson = {
  a: {
    b: 1
  },
  c: [
    {
      d: 2
    },
    {
      e: 3
    }
  ]
};

const jsonPath = './test/test.json';
fs.writeFileSync(jsonPath, JSON.stringify(testJson));

const testJsonEditor = new JSONEditor(jsonPath);

test('function get should be ok', () => {
  expect(testJsonEditor.get('a.b')).toBe(1);
  expect(testJsonEditor.get('c.1.e')).toBe(3);
  expect(testJsonEditor.get('a')).toEqual({ b: 1 });
});

test('function set should be ok', () => {
  testJsonEditor.set('a.b', 2);
  expect(testJsonEditor.get('a.b')).toBe(2);
  testJsonEditor.set('c.1.e', 4);
  expect(testJsonEditor.get('c.1.e')).toBe(4);
  testJsonEditor.set('a', { t: 3 });
  expect(testJsonEditor.get('a')).toEqual({ t: 3 });
});

test('function save should be ok', () => {
  const curJson = JSON.stringify(testJsonEditor.get());
  testJsonEditor.save();
  expect(fs.readFileSync(jsonPath, { encoding: 'utf-8' })).toEqual(curJson);
});
