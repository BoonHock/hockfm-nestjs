import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryColumn({ type: 'uuid' })
  @OneToOne(() => Playlist, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'playlistUuid', referencedColumnName: 'id' })
  playlistUuid: string;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;
}
