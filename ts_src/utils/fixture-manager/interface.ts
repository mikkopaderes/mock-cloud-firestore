import IQuerySnapshot from '../../firestore/query-snapshot/interface';

export default interface IFixtureManager {
  createRecord(path: string, record: Record<string, unknown>): void;
  updateRecord(path: string, record: Record<string, unknown>): void;
  deleteRecord(path: string): void;
  findRecord(path: string): Record<string, unknown>;
  query(path: string, filters: string[]): IQuerySnapshot;
}
