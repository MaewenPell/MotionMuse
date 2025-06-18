import { CanActivateFn } from '@angular/router';

export const ApiGuard: CanActivateFn = (route, state) => {
  return true;
};
