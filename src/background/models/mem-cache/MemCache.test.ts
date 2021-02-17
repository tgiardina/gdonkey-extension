import MemCache from ".";

interface cookie {
  token: string | null;
}

let listener: () => { /* Dummy */ };
const storage = {
  sync: {
    get: function (): cookie {
      return { token: null };
    },
  },
  onChanged: {
    addListener: jest.fn((fn) => (listener = fn)),
    removeListener: jest.fn(),
  },
};
const cache = new MemCache(<any>storage, "token");

describe("MemCache", () => {
  describe("token doesn't exist", () => {
    it("should init w/o error", async () => {
      await cache.init();
    });

    it("should read undefined", () => {
      expect(cache.read()).toBeUndefined();
    });
  });

  describe("token exists", () => {
    beforeAll(() => {
      storage.sync.get = () => ({ token: "token" });
    });

    it("should read undefined before init", () => {
      expect(cache.read()).toEqual(undefined);
    });

    it("should add listener on init", async () => {
      await cache.init();
      expect(storage.onChanged.addListener).toHaveBeenCalledTimes(1);
    });

    it("should read correct value", () => {
      expect(cache.read()).toEqual("token");
    });

    it("should read new token when onChanged is triggered", async () => {
      storage.sync.get = () => ({ token: "new" });
      await listener();
      expect(cache.read()).toEqual("new");
    });

    it("should read undefined when stored token is deleted", async () => {
      storage.sync.get = () => ({ token: null });
      await listener();
      expect(cache.read()).toBeUndefined();
    });

    it("should delete", () => {
      cache.delete();
      expect(storage.onChanged.removeListener).toHaveBeenCalledTimes(1);
      expect(storage.onChanged.removeListener).toHaveBeenCalledWith(listener);
    });
  });
});
