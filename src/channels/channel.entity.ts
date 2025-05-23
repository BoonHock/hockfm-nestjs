import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;

  @OneToMany(() => Playlist, (playlist) => playlist.channel)
  playlist: Playlist[];
}
