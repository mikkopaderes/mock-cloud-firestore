export default class WriteResult {
  get writeTime() {
    return {
      _seconds: new Date().getTime(),
      _nanoseconds: 0,
    };
  }
}
