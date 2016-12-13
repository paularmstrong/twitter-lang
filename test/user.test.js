/* eslint-env jest */
import { parse } from '..';

it('Single user using at-sign', () => {
  const actual = parse('@username');
  const expected = {
    text: '@username',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [ { screen_name: 'username', indices: [ 0, 9 ] } ]
    }
  };

  expect(actual).toEqual(expected);
});

it('Single user using alternative at-sign', () => {
  const actual = parse('＠twitter');
  const expected = {
    text: '＠twitter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [ { screen_name: 'twitter', indices: [ 0, 8 ] } ]
    }
  };

  expect(actual).toEqual(expected);
});

it('Multiple users', () => {
  const actual = parse('@username ＠twitter');
  const expected = {
    text: '@username ＠twitter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [
        { screen_name: 'username', indices: [ 0, 9 ] },
        { screen_name: 'twitter', indices: [ 10, 18 ] }
      ]
    }
  };

  expect(actual).toEqual(expected);
});

it('Non-user text', () => {
  const actual = parse('this is not a @ user');
  const expected = {
    text: 'this is not a @ user',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
