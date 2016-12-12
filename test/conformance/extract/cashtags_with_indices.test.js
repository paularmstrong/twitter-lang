/* eslint-env jest */
import { parse } from '../../..';

const transform = (output) => output.entities.symbols.reduce((state, { text, ...rest }) => [...state, { cashtag: text, ...rest }], []);

describe('cashtags_with_indices', () => {

  it("Extract cashtags", () => {
    const actual = parse("Example: $TEST $symbol test");
    const expected = [{"cashtag":"TEST","indices":[9,14]},{"cashtag":"symbol","indices":[15,22]}];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract cashtags with . or _", () => {
    const actual = parse("Example: $TEST.T test $symbol_ab end");
    const expected = [{"cashtag":"TEST.T","indices":[9,16]},{"cashtag":"symbol_ab","indices":[22,32]}];
    expect(transform(actual)).toEqual(expected);
  });

});