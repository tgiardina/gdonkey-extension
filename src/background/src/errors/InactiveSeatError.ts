export default class InactiveSeatError extends Error {
  constructor(public seat: number) {
    super(`Attempted to use inactive seat ${seat}`);
  }
}
