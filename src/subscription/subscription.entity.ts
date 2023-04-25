import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryColumn({ type: 'int' })
  @OneToOne(() => Playlist, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'playlistId', referencedColumnName: 'playlistId' })
  playlistId: number;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;
}
