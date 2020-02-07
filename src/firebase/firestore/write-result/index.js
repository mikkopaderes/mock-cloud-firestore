export default class WriteResult {
  constructor(_writeTime) {
    this._writeTime = _writeTime;
  }

  get writeTime() {
    return this._writeTime;
  }

  isEqual(other) {
    this._writeTime.isEqual(other.writeTime);
  }
}
