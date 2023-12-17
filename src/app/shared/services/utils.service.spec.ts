import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert snake case to camel case', () => {
    const snakeCaseString = 'hello_world';
    const expectedCamelCaseString = 'helloWorld';
    const result = service.snakeCaseToCamelCase(snakeCaseString);
    expect(result).toEqual(expectedCamelCaseString);
  });

  it('should transform snake_case strings to camelCase', () => {
    const athleteKeys = [
      'id',
      'username',
      'resource_state',
      'firstname',
      'lastname',
      'bio',
      'city',
      'state',
      'country',
      'sex',
      'premium',
      'summit',
      'created_at',
      'updated_at',
      'badge_type_id',
      'weight',
      'profile_medium',
      'profile',
      'friend',
      'follower',
    ];

    const connectionBaseKeys = [
      'id',
      'token_type',
      'expires_at',
      'expires_in',
      'refresh_token',
      'access_token',
      'athlete',
    ];

    const expectedAthleteKeys = [
      'id',
      'username',
      'resourceState',
      'firstname',
      'lastname',
      'bio',
      'city',
      'state',
      'country',
      'sex',
      'premium',
      'summit',
      'createdAt',
      'updatedAt',
      'badgeTypeId',
      'weight',
      'profileMedium',
      'profile',
      'friend',
      'follower',
    ];

    const expectedConnectionBaseKeys = [
      'id',
      'tokenType',
      'expiresAt',
      'expiresIn',
      'refreshToken',
      'accessToken',
      'athlete',
    ];

    athleteKeys.forEach((key, index) => {
      expect(service.snakeCaseToCamelCase(key)).toEqual(
        expectedAthleteKeys[index]
      );
    });

    connectionBaseKeys.forEach((key, index) => {
      expect(service.snakeCaseToCamelCase(key)).toEqual(
        expectedConnectionBaseKeys[index]
      );
    });
  });

  it('should transform camelCase strings to snake_case', () => {
    const athleteKeys = [
      'id',
      'username',
      'resourceState',
      'firstname',
      'lastname',
      'bio',
      'city',
      'state',
      'country',
      'sex',
      'premium',
      'summit',
      'createdAt',
      'updatedAt',
      'badgeTypeId',
      'weight',
      'profileMedium',
      'profile',
      'friend',
      'follower',
    ];

    const connectionBaseKeys = [
      'id',
      'tokenType',
      'expiresAt',
      'expiresIn',
      'refreshToken',
      'accessToken',
      'athlete',
    ];

    const expectedAthleteKeys = [
      'id',
      'username',
      'resource_state',
      'firstname',
      'lastname',
      'bio',
      'city',
      'state',
      'country',
      'sex',
      'premium',
      'summit',
      'created_at',
      'updated_at',
      'badge_type_id',
      'weight',
      'profile_medium',
      'profile',
      'friend',
      'follower',
    ];

    const expectedConnectionBaseKeys = [
      'id',
      'token_type',
      'expires_at',
      'expires_in',
      'refresh_token',
      'access_token',
      'athlete',
    ];

    athleteKeys.forEach((key, index) => {
      expect(service.camelCaseToSnakeCase(key)).toEqual(
        expectedAthleteKeys[index]
      );
    });

    connectionBaseKeys.forEach((key, index) => {
      expect(service.camelCaseToSnakeCase(key)).toEqual(
        expectedConnectionBaseKeys[index]
      );
    });
  });
});
