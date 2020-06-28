import ICollectionReference from './collection-reference/interface';

export default interface IFirestore {
  collection(path: string): ICollectionReference,
}
