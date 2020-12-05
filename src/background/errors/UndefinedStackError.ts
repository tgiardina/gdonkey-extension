export default class UndefinedStackError extends Error {
  constructor(public seat: number) {
    super(`Activated seat ${seat} has no associated stack.`);
  }
}
