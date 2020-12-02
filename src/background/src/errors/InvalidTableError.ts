export default class InvalidTableError extends Error {
  constructor(public casinoId: number, public bigBlind: number) {
    super(
      `Casino number ${casinoId} does not have a table with ${bigBlind} big blinds.`
    );
  }
}
