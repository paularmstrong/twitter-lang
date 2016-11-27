# twitter-lang

A formal grammar defining tweet text.

This is a work in progress – it is *not* ready for use. It currently passes 170/206 (83%) of the [twitter-text conformance tests](https://github.com/twitter/twitter-text/tree/2143a72d3da6bca49dc2f6d5c2df7d539d191cab/conformance).

## Example

```javascript
import { parse } from 'twitter-lang';
import test from 'ava';

test(t => {
  const tweet = parse('Hello @world, I love #hashtags and $twtr! https://twitter.com');
  const expected = {
    text: 'Hello @world, I love #hashtags and $twtr! https://twitter.com',
    entities: {
      hashtags: [
        { text: 'hashtags', indices: [21, 30] }
      ],
      symbols: [
        { text: 'twtr', indices: [35, 40] }
      ],
      urls: [
        { url: 'https://twitter.com', indices: [42, 61] }
      ],
      user_mentions: [
        { screen_name: 'world', indices: [6, 12] }
      ]
    }
  };

  t.same(tweet, expected);
});
```
