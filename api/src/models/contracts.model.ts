import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { Network } from './network.model';

@Entity({ name: 'contracts' })
export class Contracts {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  abi: string;

  @ManyToMany(() => Network)
  @JoinTable()
  networks: Network[];
}
