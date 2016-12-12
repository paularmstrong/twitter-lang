/* eslint-env jest */
import { parse } from '../../..';

describe('hashtags_from_astral', () => {

  it("Extract hashtag with letter from astral plane (U+20021)", () => {
    const actual = parse("#𠀡");
    const expected = ["𠀡"];
    expect(actual).toEqual(expected);
  });

  it("Extract hashtag with letter plus marker from astral plane (U+16f04 U+16f51)", () => {
    const actual = parse("#𖼄𖽑");
    const expected = ["𖼄𖽑"];
    expect(actual).toEqual(expected);
  });

  it("Extract hashtag with letter plus number from astral plane (U+104a0)", () => {
    const actual = parse("#A𐒠");
    const expected = ["A𐒠"];
    expect(actual).toEqual(expected);
  });

});