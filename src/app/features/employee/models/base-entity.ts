export interface BaseEntity {
  id: number;
  createdBy: string;
  createdDate: Date;
  updatedDate?: Date | null;
}
