export default class Entity {
  protected _id?: number;

  get id(): number | undefined {
    return this._id;
  }
}
