export default class InvalidCasinoError extends Error {
  constructor(public casinoName: string) {
    super(`Casino ${casinoName} does not exist.`);
  }
}
