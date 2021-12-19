import { selectFromObject, setObjectByKey } from '../src/utils/';

describe('selectFromObject', () => {
  describe('by string', () => {
    test('Select valid value', () => {
      const obj = { a: { b: { c: 'value' } } };
      const res = selectFromObject(obj, 'a.b.c');
      expect(res).toEqual('value');
    });
    test('Return undefined when path does not exist', () => {
      const obj = { a: { b: { c: 'value' } } };
      const res = selectFromObject(obj, 'b.a.c');
      expect(res).toEqual(undefined);
    });
    test('Allow selecting by number index', () => {
      const obj = { a: [{ b: { c: 'value' } }] };
      const res = selectFromObject(obj, 'a[0].b.c');
      expect(res).toEqual(obj.a[0].b.c);
    });
  });

  describe('by array', () => {
    test('Select valid value', () => {
      const obj = { a: { b: { c: 'value' } } };
      const res = selectFromObject(obj, ['a', 'b', 'c']);
      expect(res).toEqual('value');
    });
    test('Select valid value with number', () => {
      const obj = { a: [{ b: { c: 'value' } }] };
      const res = selectFromObject(obj, ['a', 0, 'b', 'c']);
      expect(res).toEqual('value');
    });
    test('Return undefined when path does not exist', () => {
      const obj = { a: { b: { c: 'value' } } };
      const res = selectFromObject(obj, ['x', 'y', 'z']);
      expect(res).toEqual(undefined);
    });
    test('Select root with empty array', () => {
      const obj = { a: { b: { c: 'value' } } };
      const res = selectFromObject(obj, []);
      expect(res).toEqual(obj);
    });
  });
});

describe('setObjectByKey', () => {
  describe('by string', () => {
    test('Select valid value', () => {
      const obj = { a: { b: { c: 'value' } } };
      setObjectByKey(obj, 'a.b.c', 'newValue');
      expect(obj).toEqual({ a: { b: { c: 'newValue' } } });
    });
  });

  describe('by array', () => {
    test('Select valid value', () => {
      const obj = { a: { b: { c: 'value' } } };
      setObjectByKey(obj, ['a', 'b', 'c'], 'newValue');
      expect(obj).toEqual({ a: { b: { c: 'newValue' } } });
    });
  });
});
