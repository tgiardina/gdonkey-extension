import { Controller, Curator, Librarian } from "./";

describe("Controller", () => {
  it("should document user", () => {
    const librarian = <Librarian>(<unknown>{ documentUser: jest.fn() });
    const controller = new Controller(<Curator>{}, librarian);
    controller.identifyUser(0);
    expect(librarian.documentUser).toHaveBeenCalledTimes(1);
    expect(librarian.documentUser).toHaveBeenCalledWith(0);
  });

  it("should document missed blind", () => {
    const librarian = <Librarian>(<unknown>{ documentMissedBlind: jest.fn() });
    const controller = new Controller(<Curator>{}, librarian);
    controller.activateMissedBlind(0);
    expect(librarian.documentMissedBlind).toHaveBeenCalledTimes(1);
    expect(librarian.documentMissedBlind).toHaveBeenCalledWith(0);
  });

  it("shouldn't arrange game if hasn't seen a start yet", async () => {
    const controller = new Controller(<Curator>{}, <Librarian>{});
    await controller.arrangeGame(); // This will throw if controller attempts to create game.
  });
});
