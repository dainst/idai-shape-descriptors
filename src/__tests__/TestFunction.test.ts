import { TestFunction } from '../index';
test('My Greeter', () => {
  expect(TestFunction('Carl')).toBe('Hello Carl');
});