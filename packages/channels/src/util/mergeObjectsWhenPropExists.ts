// todo:both params should be of type Record<string, unknown> but this fails elsewhere. no idea why
export const mergeObjectsWhenPropExists = (target: any, source: any) => {
  return Object.keys(source).reduce(
    (accumulator, sourceKey) => {
      if (source[sourceKey] !== undefined && source[sourceKey] !== null) {
        accumulator[sourceKey] = source[sourceKey];
      }
      return accumulator;
    },
    { ...target }
  );
};
