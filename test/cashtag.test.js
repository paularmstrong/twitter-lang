/* eslint-env jest */
import { parse } from '..';

it('Single cashtag', () => {
  const actual = parse('$TWTR');
  const expected = {
    text: '$TWTR',
    entities: {
      hashtags: [],
      symbols: [ { text: 'TWTR', indices: [ 0, 5 ] } ],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});

it('Multiple cashtags', () => {
  const actual = parse('$TWTR $tsla');
  const expected = {
    text: '$TWTR $tsla',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'TWTR', indices: [ 0, 5 ] },
        { text: 'tsla', indices: [ 6, 11 ] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});

it('Non-cashtag text', () => {
  const actual = parse('This is not a $ cashtag');
  const expected = {
    text: 'This is not a $ cashtag',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
