import { PodcastStatusEnum } from 'src/common/enum/podcast-status.enum';
import { Podcast } from 'src/podcasts/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PodcastStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userUuid', referencedColumnName: 'id' })
  userUuid: string;

  @Column({ type: 'uuid' })
  @OneToOne(() => Podcast, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'podcastUuid', referencedColumnName: 'id' })
  podcastUuid: string;

  @Column({ type: 'int' })
  status: PodcastStatusEnum;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
