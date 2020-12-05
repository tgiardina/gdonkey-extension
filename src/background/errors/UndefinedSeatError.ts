export default class UndefinedSeatError extends Error {
  constructor(public seat: number) {
    super(`Activated seat ${seat} is undefined.`);
  }
}
