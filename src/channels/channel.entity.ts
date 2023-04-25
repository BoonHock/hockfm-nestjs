import { Playlist } from 'src/playlists/playlist.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['channelId'], { unique: true })
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  channelId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;

  @OneToMany(() => Playlist, (playlist) => playlist.channel)
  playlist: Playlist[];
}
