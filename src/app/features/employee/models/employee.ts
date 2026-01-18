import { BaseEntity } from './base-entity';

export interface Employee extends BaseEntity {
  name: string;
  code: string;
}
