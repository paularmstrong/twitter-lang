/* eslint-env jest */
import { parse } from '..';

it('hello', () => {
  const actual = parse('hello');
  const expected = {
    text: 'hello',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});

it('hello world', () => {
  const actual = parse('hello world');
  const expected = {
    text: 'hello world',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
