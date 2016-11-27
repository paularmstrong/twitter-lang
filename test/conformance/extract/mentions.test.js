/* eslint-env jest */
import { parse } from '../../..';

const transform = output => output.entities.user_mentions.map(mention => mention.screen_name);

it("Extract mention at the begining of a tweet", () => {
  const actual = parse("@username reply");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention at the end of a tweet", () => {
  const actual = parse("mention @username");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention in the middle of a tweet", () => {
  const actual = parse("mention @username in the middle");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention of username with underscore", () => {
  const actual = parse("mention @user_name");
  const expected = ["user_name"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention of all numeric username", () => {
  const actual = parse("mention @12345");
  const expected = ["12345"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention or multiple usernames", () => {
  const actual = parse("mention @username1 @username2");
  const expected = ["username1","username2"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mention in the middle of a Japanese tweet", () => {
  const actual = parse("の@usernameに到着を待っている");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username ending in @", () => {
  const actual = parse("Current Status: @_@ (cc: @username)");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username followed by accented latin characters", () => {
  const actual = parse("@aliceìnheiro something something");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("Extract lone metion but not @user@user (too close to an email)", () => {
  const actual = parse("@username email me @test@example.com");
  const expected = ["username"];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract 'http' in '@http://' as username", () => {
  const actual = parse("@http://twitter.com");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mentions before newline", () => {
  const actual = parse("@username\n@mention");
  const expected = ["username","mention"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mentions after 'RT'", () => {
  const actual = parse("RT@username RT:@mention RT @test");
  const expected = ["username","mention","test"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mentions after 'rt'", () => {
  const actual = parse("rt@username rt:@mention rt @test");
  const expected = ["username","mention","test"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mentions after 'Rt'", () => {
  const actual = parse("Rt@username Rt:@mention Rt @test");
  const expected = ["username","mention","test"];

  expect(transform(actual)).toEqual(expected);
});

it("Extract mentions after 'rT'", () => {
  const actual = parse("rT@username rT:@mention rT @test");
  const expected = ["username","mention","test"];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by !", () => {
  const actual = parse("f!@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by @", () => {
  const actual = parse("f@@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by #", () => {
  const actual = parse("f#@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by $", () => {
  const actual = parse("f$@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by %", () => {
  const actual = parse("f%@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by &", () => {
  const actual = parse("f&@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});

it("DO NOT extract username preceded by *", () => {
  const actual = parse("f*@kn");
  const expected = [];

  expect(transform(actual)).toEqual(expected);
});
