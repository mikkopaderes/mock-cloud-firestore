export default class WriteResult {
  constructor(){
    // noop
  }

  get writeTime() {
    return {
      _seconds: new Date().getTime(),
      _nanoseconds: 0
    }
  }
}
