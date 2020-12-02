export default class UndefinedPlayerError extends Error {
  constructor(public seat: number) {
    super(`Activated seat ${seat} has no associated player`);
  }
}
