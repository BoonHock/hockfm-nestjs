import { Channel } from 'src/channels/channel.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['playlistId'], { unique: true })
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'playlistId' })
  playlistId: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  play_order: number;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;

  @Column()
  channelId: number;

  @ManyToOne(() => Channel, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'channelId', referencedColumnName: 'channelId' })
  channel: number;

  @OneToOne(() => Subscription, (subscription) => subscription.playlistId)
  subscription: Subscription;
}
