import * as Nano from 'nano';

export class BaseCouchModel {
  _id: string;
  _rev: string;

  constructor() {
    this._id = undefined;
    this._rev = undefined;
  }

  processAPIResponse(response: Nano.DocumentInsertResponse) {
    if (response.ok === true) {
      this._id = response.id;
      this._rev = response.rev;
    }
  }
}
