import { Playlist } from 'src/playlists/playlist.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PodcastStatus } from './podcast-status.enum';

@Entity()
export class Podcast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // legacy column. previously used by php. perhaps drop all legacy columns in the future
  @Column({ type: 'int' })
  podcastId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // @Column({ type: 'varchar', length: 255, unique: true, collation: 'utf8_unicode_ci' }) // mysql
  @Column({ type: 'varchar', length: 255, unique: true })
  url: string;

  @Column({ type: 'date' })
  date: Date;

  // @Column({ type: 'tinyint' }) // mysql
  @Column({ type: 'boolean' })
  is_real_date: boolean;

  // @Column({ type: 'int' }) // mysql
  @Column({ type: 'int' })
  status: PodcastStatus;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;

  @Column()
  playlistId: number;

  @Column({ type: 'uuid', nullable: true })
  playlistUuid: string;

  @ManyToOne(() => Playlist, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'playlistUuid', referencedColumnName: 'id' })
  playlist: Playlist;
  // @JoinColumn({ name: 'playlistId', referencedColumnName: 'playlistId' })
  // playlist: Playlist;
}
