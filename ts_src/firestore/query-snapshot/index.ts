import IQuerySnapshot from './interface';

export default class QuerySnapshot implements IQuerySnapshot {
  constructor(private queryDocumentSnapshots: Record<string, unknown>[]) { }

  public get docs(): Record<string, unknown>[] {
    return this.queryDocumentSnapshots;
  }

  public get empty(): boolean {
    return this.docs.length === 0;
  }

  public get size(): number {
    return this.docs.length;
  }

  public forEach(callback: (result: Record<string, unknown>) => void): void {
    this.docs.forEach(callback);
  }
}
