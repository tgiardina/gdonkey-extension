import "reflect-metadata";
const globalAny: any = global;
globalAny.browser = {
  storage: {
    sync: {
      get: () => ({ token: "token" }),
    },
    onChanged: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  tabs: {
    onRemoved: {
      addListener: (...args: unknown[]) => {},
    },
  },
};
