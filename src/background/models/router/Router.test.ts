import Router from "./";

class Counter {
  constructor(private n: number) {}

  public incr() {
    return this.n++;
  }
}

describe("Router", () => {
  let router: Router<Counter>;

  beforeEach(() => {
    router = new Router([
      {
        urls: ["a/*"],
        init: () => new Counter(0),
      },
      {
        urls: ["b/*"],
        init: () => new Counter(100),
      },
    ]);
  });

  describe("connect", () => {
    it("should connect to appropriate route", () => {
      const count = router.connect(0, "b/test").incr();
      expect(count).toEqual(100);
    });

    it("should not connect if no route url matches", () => {
      const route = router.connect(0, "c/test");
      expect(route).toEqual(undefined);
    });

    it("should not ovewrite tab", () => {
      let count = router.connect(0, "a/test").incr();
      expect(count).toEqual(0);
      count = router.connect(0, "a/test").incr();
      expect(count).toEqual(1);
    });

    it("should overwrite tab", () => {
      router.connect(0, "a/test").incr();
      const count = router.connect(0, "b/test").incr();
      expect(count).toEqual(100);
    });
  });

  describe("disconnect", () => {
    it("should disconnect", () => {
      router.connect(0, "a/");
      router.disconnect(0);
      // Accessing private variable to check memory usage.
      expect(router["tabs"][0]).toBeUndefined();
    });
  });
});
