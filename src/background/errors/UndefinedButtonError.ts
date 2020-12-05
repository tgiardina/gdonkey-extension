export default class UndefinedButtonError extends Error {
  constructor() {
    super(`Attempted to start game without button`);
  }
}
