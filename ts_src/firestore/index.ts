import ICollectionReference from './collection-reference/interface';
import IFirestore from './interface';
import IFixtureManager from '../utils/fixture-manager/interface';
import CollectionReference from './collection-reference';

export default class Firestore implements IFirestore {
  constructor(private fixtureManager: IFixtureManager) { }

  public collection(path: string): ICollectionReference {
    return new CollectionReference(path, this.fixtureManager);
  }
}
