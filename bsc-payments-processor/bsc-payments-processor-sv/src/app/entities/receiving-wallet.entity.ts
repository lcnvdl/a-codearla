// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReceivingWallet extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  lastBlock: string;
}
