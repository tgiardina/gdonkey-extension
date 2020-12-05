export default class InvalidSeatError extends Error {
  constructor(public seat: number) {
    super(`Seat ${seat} must be between 0 and 8`);
  }
}
