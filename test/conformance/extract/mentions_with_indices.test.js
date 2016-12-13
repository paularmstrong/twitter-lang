/* eslint-env jest */
/* eslint-disable max-len */
import { parse } from '../../..';

const transform = (output) => output.entities.user_mentions;

describe('mentions_with_indices', () => {
  it('Extract a mention at the start', () => {
    const actual = parse('@username yo!');
    const expected = [ { 'screen_name': 'username', 'indices': [ 0, 9 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a mention that has the same thing mentioned at the start', () => {
    const actual = parse('username @username');
    const expected = [ { 'screen_name': 'username', 'indices': [ 9, 18 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a mention in the middle of a Japanese tweet', () => {
    const actual = parse('の@usernameに到着を待っている');
    const expected = [ { 'screen_name': 'username', 'indices': [ 1, 10 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

/* eslint-enable max-len */
});
