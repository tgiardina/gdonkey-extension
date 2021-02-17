import "reflect-metadata";

interface Global {
  browser: {
    storage: {
      sync: {    
        get(): { token: string },
      },
      onChanged: {
        addListener(): void,
        removeListener(): void,
      }
    }
    tabs: {
      onRemoved: {
        addListener(): void,
      }
    }    
  },
}

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
      addListener: () => {/* Dummy */},
    },
  },
}
