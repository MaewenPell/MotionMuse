import { Injectable, inject } from '@angular/core';
import { ConnectionBase } from 'src/app/types/access-token';
import { Errors } from 'src/app/types/enums/errors.enums';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private connectionService = inject(ConnectionService);

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get(key: string): ConnectionBase | Errors {
    const connectionBaseStorage = localStorage.getItem(key);
    if (!connectionBaseStorage) {
      return Errors.NO_CONNECTION_BASE;
    } else {
      const connectionBase: ConnectionBase = JSON.parse(connectionBaseStorage);
      const isTokenViable = this.connectionService.isTokenStillAvailable(
        connectionBase.expires_at
      );

      if (isTokenViable) {
        return connectionBase;
      } else {
        return Errors.TOKEN_EXPIRED;
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
