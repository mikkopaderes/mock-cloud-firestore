import ICollectionReference from './interface';
import IFixtureManager from '../../utils/fixture-manager/interface';
import IQuerySnapshot from '../query-snapshot/interface';

export default class CollectionReference implements ICollectionReference {
  private filters: string[] = [];

  constructor(private path: string, private fixtureManager: IFixtureManager) { }

  public async get(): Promise<IQuerySnapshot> {
    return this.fixtureManager.query(this.path, this.filters);
  }
}
