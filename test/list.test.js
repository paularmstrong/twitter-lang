/* eslint-env jest */
import { parse } from '..';

it('Single list using at-sign', () => {
  const actual = parse('@username/list-slug');
  const expected = {
    text: '@username/list-slug',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'username', list_slug: '/list-slug', indices: [0, 19] }]
    }
  };

  expect(actual).toEqual(expected);
});

it('Single list using alternative at-sign', () => {
  const actual = parse('＠twitter/tweeps');
  const expected = {
    text: '＠twitter/tweeps',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'twitter', list_slug: '/tweeps', indices: [0, 15] }]
    }
  };

  expect(actual).toEqual(expected);
});

it('Multiple lists', () => {
  const actual = parse('@username/list-slug ＠twitter/tweeps');
  const expected = {
    text: '@username/list-slug ＠twitter/tweeps',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [
        { screen_name: 'username', list_slug: '/list-slug', indices: [0, 19] },
        { screen_name: 'twitter', list_slug: '/tweeps', indices: [20, 35] }
      ]
    }
  };

  expect(actual).toEqual(expected);
});

it('Non-list text', () => {
  const actual = parse('This is not a @ user/list');
  const expected = {
    text: 'This is not a @ user/list',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
