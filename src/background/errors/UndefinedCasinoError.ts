export default class UndefinedCasinoError extends Error {
  constructor() {
    super(`Attempted to start game without casino`);
  }
}
