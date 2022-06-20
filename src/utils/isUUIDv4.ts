import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const isUUIDV4 = (id: string): boolean => {
  return uuidValidate(id) && uuidVersion(id) === 4;
};
