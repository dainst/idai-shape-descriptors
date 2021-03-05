import { TestFunction } from '../index';
test('TestFunction', () => {
  expect(TestFunction('Carl')).toBe('Hello Carl');
});