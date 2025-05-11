import { PodcastStatusEnum } from "src/common/enum/podcast-status.enum";

export interface PodcastOutput {
  id: string;
  title: string;
  description: string;
  url: string;
  date: Date;
  status: PodcastStatusEnum;
  playlist: {
    title: string;
    channel: {
      name: string;
    };
  };
}
