import IApp from './app/interface';
import IFirebase from './interface';
import IFirestore from './firestore/interface';
import App from './app';
import FixtureManager from './utils/fixture-manager';

export default class MockFirebase implements IFirebase {
  private app: IApp;

  constructor(data: Record<string, unknown>) {
    const fixtureManager = new FixtureManager(data);

    this.app = new App(fixtureManager);
  }

  public initializeApp(): IApp {
    return this.app;
  }

  public firestore(): IFirestore {
    return this.app.firestore();
  }
}
