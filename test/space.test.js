/* eslint-env jest */
import { parse } from '..';

it('\\u0020', () => {
  const actual = parse('$twtr\u0020$twtr');
  const expected = {
    text: '$twtr\u0020$twtr',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'twtr', indices: [0, 5] },
        { text: 'twtr', indices: [6, 11] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});

it('\\u00A0', () => {
  const actual = parse('$twtr\u00A0$twtr');
  const expected = {
    text: '$twtr\u00A0$twtr',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'twtr', indices: [0, 5] },
        { text: 'twtr', indices: [6, 11] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
