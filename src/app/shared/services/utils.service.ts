import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  snakeCaseToCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );
  }

  camelCaseToSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, group => `_${group.toLowerCase()}`)
      .replace(/^_/, '');
  }
}
