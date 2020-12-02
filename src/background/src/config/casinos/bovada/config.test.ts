import { config } from "./";

describe("config.parser", () => {
  it("should correctly parse", () => {
    const parsed = config.parser(`36|{"seat":8,"pid":"CO_CURRENT_PLAYER"}`);
    expect(parsed).toEqual({ seat: 8, pid: "CO_CURRENT_PLAYER" });
  });
});
