/* eslint-env jest */
/* eslint-disable max-len */
import { parse } from '../../..';

const transform = (output) => output.entities.hashtags.reduce((state, { text, ...rest }) => [ ...state, { hashtag: text, ...rest } ], []);

describe('hashtags_with_indices', () => {
  it('Extract a hastag at the start', () => {
    const actual = parse('#hashtag here');
    const expected = [ { 'hashtag': 'hashtag', 'indices': [ 0, 8 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a hastag at the end', () => {
    const actual = parse('test a #hashtag');
    const expected = [ { 'hashtag': 'hashtag', 'indices': [ 7, 15 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a hastag in the middle', () => {
    const actual = parse('test a #hashtag in a string');
    const expected = [ { 'hashtag': 'hashtag', 'indices': [ 7, 15 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract only a valid hashtag', () => {
    const actual = parse('#123 a #hashtag in a string');
    const expected = [ { 'hashtag': 'hashtag', 'indices': [ 7, 15 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a hashtag in a string of multi-byte characters', () => {
    const actual = parse('会議中 #hashtag 会議中');
    const expected = [ { 'hashtag': 'hashtag', 'indices': [ 4, 12 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract multiple valid hashtags', () => {
    const actual = parse('One #two three #four');
    const expected = [ { 'hashtag': 'two', 'indices': [ 4, 8 ] }, { 'hashtag': 'four', 'indices': [ 15, 20 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a non-latin hashtag', () => {
    const actual = parse('Hashtags in #русский!');
    const expected = [ { 'hashtag': 'русский', 'indices': [ 12, 20 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract multiple non-latin hashtags', () => {
    const actual = parse('Hashtags in #中文, #日本語, #한국말, and #русский! Try it out!');
    const expected = [ { 'hashtag': '中文', 'indices': [ 12, 15 ] }, { 'hashtag': '日本語', 'indices': [ 17, 21 ] }, { 'hashtag': '한국말', 'indices': [ 23, 27 ] }, { 'hashtag': 'русский', 'indices': [ 33, 41 ] } ];
    expect(transform(actual)).toEqual(expected);
  });

/* eslint-enable max-len */
});
