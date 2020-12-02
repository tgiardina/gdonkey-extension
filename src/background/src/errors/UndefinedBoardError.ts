export default class UndefinedBoardError extends Error {
  constructor() {
    super(`No board exists`);
  }
}
