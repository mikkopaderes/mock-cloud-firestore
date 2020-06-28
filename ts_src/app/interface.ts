import IFirestore from '../firestore/interface';

export default interface IApp {
  firestore(): IFirestore,
}
