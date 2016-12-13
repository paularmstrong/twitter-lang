/* eslint-env jest */
/* eslint-disable max-len */
import { parse } from '../../..';

const transform = (output) => output.entities.user_mentions.map((mention) => ({ list_slug: '', ...mention }));

describe('mentions_or_lists_with_indices', () => {
  it('Extract a mention', () => {
    const actual = parse('@username yo!');
    const expected = [ { 'screen_name': 'username', 'list_slug': '', 'indices': [ 0, 9 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a list', () => {
    const actual = parse('@username/list-name is a great list!');
    const expected = [ { 'screen_name': 'username', 'list_slug': '/list-name', 'indices': [ 0, 19 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a mention and list', () => {
    const actual = parse('Hey @username, check out out @otheruser/list_name-01!');
    const expected = [ { 'screen_name': 'username', 'list_slug': '', 'indices': [ 4, 13 ] }, { 'screen_name': 'otheruser', 'list_slug': '/list_name-01', 'indices': [ 29, 52 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a list in the middle of a Japanese tweet', () => {
    const actual = parse('の@username/list_name-01に到着を待っている');
    const expected = [ { 'screen_name': 'username', 'list_slug': '/list_name-01', 'indices': [ 1, 23 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract a list with slug that starts with a number', () => {
    const actual = parse('@username/7list-name is a great list!');
    const expected = [ { 'screen_name': 'username', 'list_slug': '', 'indices': [ 0, 9 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

/* eslint-enable max-len */
});
