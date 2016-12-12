/* eslint-env jest */
import { parse } from '../../..';

const transform = (output) => output.entities.symbols.map((symbol) => symbol.text);

describe('cashtags', () => {

  it("Extract cashtags", () => {
    const actual = parse("Example cashtags: $TEST $Stock   $symbol");
    const expected = ["TEST","Stock","symbol"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract cashtags with . or _", () => {
    const actual = parse("Example cashtags: $TEST.T $test.tt $Stock_X $symbol_ab");
    const expected = ["TEST.T","test.tt","Stock_X","symbol_ab"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not extract cashtags if they contain numbers", () => {
    const actual = parse("$123 $test123 $TE123ST");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not extract cashtags with non-ASCII characters", () => {
    const actual = parse("$ストック $株");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not extract cashtags with punctuations", () => {
    const actual = parse("$ $. $- $@ $! $() $+");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not include trailing . or _", () => {
    const actual = parse("$TEST. $TEST_");
    const expected = ["TEST","TEST"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not extract cashtags if there is no space before $", () => {
    const actual = parse("$OK$NG$BAD text$NO .$NG $$NG");
    const expected = ["OK"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Do not extract too long cashtags", () => {
    const actual = parse("$CashtagMustBeLessThanSixCharacter");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

});