/* eslint-env jest */
import { parse } from '..';

it('with @username', () => {
  const actual = parse('hello @username');
  const expected = {
    text: 'hello @username',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'username', indices: [6, 15] }]
    }
  };

  expect(actual).toEqual(expected);
});

it('with all tag types', () => {
  const actual = parse('Hello @world, I love #hashtags and $twtr!');
  const expected = {
    text: 'Hello @world, I love #hashtags and $twtr!',
    entities: {
      hashtags: [{ text: 'hashtags', indices: [21, 30] }],
      symbols: [{ text: 'twtr', indices: [35, 40] }],
      urls: [],
      user_mentions: [{ screen_name: 'world', indices: [6, 12] }]
    }
  };

  expect(actual).toEqual(expected);
});
