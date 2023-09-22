import { Column, ObjectId, ObjectIdColumn } from 'typeorm';

export class BaseModel {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: string;
}
