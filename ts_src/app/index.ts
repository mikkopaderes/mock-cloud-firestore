import IApp from './interface';
import IFirestore from '../firestore/interface';
import IFixtureManager from '../utils/fixture-manager/interface';
import Firestore from '../firestore';

export default class App implements IApp {
  constructor(private fixtureManager: IFixtureManager) { }

  public firestore(): IFirestore {
    return new Firestore(this.fixtureManager);
  }
}
