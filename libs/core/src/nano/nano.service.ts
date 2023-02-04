import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Nano from 'nano';
import { BaseCouchModel } from '../utils/base/couch-model/base-couch-model';

@Injectable()
export class NanoService {
  private db: Nano.DatabaseScope;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  /**
   * Initialize CouchDB connection
   */
  public async initialize() {
    const dbUrl = this.configService.get('COUCH_DB_URL');
    this.db = Nano(dbUrl).db;
  }

  /**
   * Create DB If needed
   */
  public async createDBIfNeeded(dbName: string) {
    try {
      return await this.db.get(dbName);
    } catch (error) {}

    try {
      return await this.db.create(dbName);
    } catch (error) {}

    return false;
  }

  /**
   * Insert record
   */
  public async insert(dbName: string, data: BaseCouchModel) {
    const documentScope = this.db.use(dbName);
    const { _id, ...params } = data;

    try {
      const getResponse = await documentScope.get(_id);
      params._rev = getResponse._rev;
    } catch (error) {}

    try {
      const insertResponse = await documentScope.insert(params, _id);
      data.processAPIResponse(insertResponse);
    } catch (error) {
      return false;
    }

    return true;
  }

  /**
   * Delete record or empty DB
   */
  public async delete(dbName: string, _id: string) {
    const documentScope = this.db.use(dbName);
    let _rev: string;

    if (_id) {
      try {
        const getResponse = await documentScope.get(_id);
        _rev = getResponse._rev;
      } catch (error) {
        return false;
      }

      try {
        await documentScope.destroy(_id, _rev);
      } catch (error) {
        return false;
      }
    } else {
      try {
        await this.db.destroy(dbName);
      } catch (error) {
        return false;
      }

      try {
        await this.db.create(dbName);
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
