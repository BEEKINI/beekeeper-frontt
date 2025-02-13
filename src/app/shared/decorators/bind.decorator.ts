export const bind = <T extends Function>(
  target: unknown,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> => {
  return {
    get(this): T {
      const value = descriptor.value!.bind(this) as T;
      Object.defineProperty(this, propertyKey, {
        value,
      });
      return value;
    },
  };
};
