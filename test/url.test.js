/* eslint-env jest */
import { parse } from '..';

it('Single URL', () => {
  const actual = parse('http://twitter.com');
  const expected = {
    text: 'http://twitter.com',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [ { url: 'http://twitter.com', indices: [ 0, 18 ] } ],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});

it('Multiple URLs', () => {
  const actual = parse('http://twitter.com/ https://google.com');
  const expected = {
    text: 'http://twitter.com/ https://google.com',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [
        { url: 'http://twitter.com/', indices: [ 0, 19 ] },
        { url: 'https://google.com', indices: [ 20, 38 ] }
      ],
      user_mentions: []
    }
  };

  expect(actual).toEqual(expected);
});
