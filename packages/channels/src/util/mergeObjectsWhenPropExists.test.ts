import { mergeObjectsWhenPropExists } from './mergeObjectsWhenPropExists';

describe('mergeObjectsWhenPropExists', () => {
  it('overwrites target prop value with that of source', () => {
    expect(
      mergeObjectsWhenPropExists({ prop1: true }, { prop1: false })
    ).toMatchObject({
      prop1: false,
    });
  });
  it("keeps target prop when it doesn't exist in source", () => {
    expect(mergeObjectsWhenPropExists({ prop1: true }, {})).toMatchObject({
      prop1: true,
    });
  });
  it("keeps target prop value when it's undefined or null source", () => {
    expect(
      mergeObjectsWhenPropExists({ prop1: true }, { prop1: undefined })
    ).toMatchObject({
      prop1: true,
    });
    expect(
      mergeObjectsWhenPropExists({ prop1: true }, { prop1: null })
    ).toMatchObject({
      prop1: true,
    });
  });

  it('Adds props to target from source', () => {
    expect(
      mergeObjectsWhenPropExists({ prop1: true }, { prop2: false })
    ).toMatchObject({
      prop1: true,
      prop2: false,
    });
    expect(mergeObjectsWhenPropExists({}, { prop2: false })).toMatchObject({
      prop2: false,
    });
  });
});
