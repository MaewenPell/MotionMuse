import { Injectable, inject } from '@angular/core';
import { ConnectionBase } from 'src/app/types/access-token';
import { Errors } from 'src/app/types/enums/errors.enums';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private utilsService = inject(UtilsService);

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get(key: string): {
    connectionbase: ConnectionBase | null;
    errors: Errors | null;
  } {
    const connectionBaseStorage = localStorage.getItem(key);
    if (!connectionBaseStorage) {
      return { connectionbase: null, errors: Errors.NO_CONNECTION_BASE };
    } else {
      const connectionBase: ConnectionBase = JSON.parse(connectionBaseStorage);
      const isTokenViable = this.utilsService.isTokenStillAvailable(
        connectionBase.expires_at
      );

      if (isTokenViable) {
        return { connectionbase: connectionBase, errors: null };
      } else {
        return { connectionbase: connectionBase, errors: Errors.TOKEN_EXPIRED };
      }
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
