export default class AlreadyPublishedError extends Error {
  constructor(public resource: string, public id: number) {
    super(`Resource ${resource} ${id} has already been published.`);
  }
}
