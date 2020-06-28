import IApp from './app/interface';
import IFirestore from './firestore/interface';

export default interface IFirebase {
  initializeApp(): IApp,
  firestore(): IFirestore,
}
