/* eslint-env jest */
import { parse } from '../../..';

const transform = output => output.entities.user_mentions.filter(({ indices }) => indices[0] == 0).map(mention => mention.screen_name)[0] || null;

it("Extract reply at the begining of a tweet", () => {
  const actual = parse("@username reply");
  const expected = "username";

  expect(transform(actual)).toEqual(expected);
});

it("Extract reply preceded by only a space", () => {
  const actual = parse(" @username reply");
  const expected = "username";

  expect(transform(actual)).toEqual(expected);
});

it("Extract reply preceded by only a full-width space (U+3000)", () => {
  const actual = parse("　@username reply");
  const expected = "username";

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by text", () => {
  const actual = parse("a @username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by .", () => {
  const actual = parse(".@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by /", () => {
  const actual = parse("/@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by _", () => {
  const actual = parse("_@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by -", () => {
  const actual = parse("-@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by +", () => {
  const actual = parse("+@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by #", () => {
  const actual = parse("#@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by !", () => {
  const actual = parse("!@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when preceded by @", () => {
  const actual = parse("@@username mention, not a reply");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT Extract reply when followed by URL", () => {
  const actual = parse("@http://twitter.com");
  const expected = null;

  expect(transform(actual)).toEqual(expected);
});
