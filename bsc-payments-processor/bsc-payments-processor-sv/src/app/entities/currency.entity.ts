// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, length: 20 })
  symbol: string;

  @Column({ nullable: false })
  decimals: number;

  @Column({ nullable: false, length: 100 })
  contract: string;

  @Column({ nullable: false })
  url: string;

  @OneToMany(() => Transaction, transaction => transaction.currency)
  transactions: Transaction[];
}
