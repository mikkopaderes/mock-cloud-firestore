import IFixtureManager from './interface';
import IQuerySnapshot from '../../firestore/query-snapshot/interface';
import QuerySnapshot from '../../firestore/query-snapshot';

export default class FixtureManager implements IFixtureManager {
  constructor(private data: Record<string, unknown>) { }

  public createRecord(path: string, record: Record<string, unknown>): void { }
  public updateRecord(path: string, record: Record<string, unknown>): void { }
  public deleteRecord(path: string): void { }

  public findRecord(path: string): Record<string, unknown> {
    return {};
  }

  public query(path: string, filters: string[]): IQuerySnapshot {
    return new QuerySnapshot([]);
  }
}
