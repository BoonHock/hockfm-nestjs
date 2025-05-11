import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userUuid', referencedColumnName: 'id' })
  userUuid: string;

  @Column({ type: 'uuid' })
  @OneToOne(() => Playlist, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'playlistUuid', referencedColumnName: 'id' })
  playlistUuid: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
