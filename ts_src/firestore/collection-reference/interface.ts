import IQuerySnapshot from '../query-snapshot/interface';

export default interface ICollectionReference {
  get(): Promise<IQuerySnapshot>;
}
