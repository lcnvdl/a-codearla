// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from '.';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryColumn({ length: 100 })
  id: string;

  @Column({ nullable: false })
  balance: number;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];
}
