import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class SubscriptionList {
  @PrimaryColumn()
  @OneToOne(() => Playlist, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'playlist', referencedColumnName: 'id' })
  playlist: number;

  @Column({ type: 'timestamp' })
  created_timestamp: Date;
}
