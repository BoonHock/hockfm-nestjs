import { Injectable } from '@nestjs/common';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateChannelDto } from 'src/channels/dto/createChannel.dto';
import { CreatePlaylistDto } from 'src/playlists/dto/createPlaylist.dto';
import { PlaylistsService } from 'src/playlists/playlists.service';
import { CreatePodcastDto } from 'src/podcasts/dto/createPodcast.dto';
import { PodcastsService } from 'src/podcasts/podcasts.service';

@Injectable()
export class WebhookService {
  constructor(
    private channelService: ChannelsService,
    private playlistService: PlaylistsService,
    private podcastService: PodcastsService,
  ) {}
  async addNewChannels(createChannelDto: CreateChannelDto[]) {
    await this.processChannels(createChannelDto);
  }

  async addNewPlaylists(createPlaylistDto: CreatePlaylistDto[]) {
    await this.processPlaylists(createPlaylistDto);
  }

  async addNewPodcasts(createPodcastDto: CreatePodcastDto[]) {
    await this.processPodcasts(createPodcastDto);
  }

  private async processChannels(createChannelDtos: CreateChannelDto[]) {
    console.log('process');
    await this.channelService.createChannels(createChannelDtos);
  }

  private async processPlaylists(createPlaylistDtos: CreatePlaylistDto[]) {
    await this.playlistService.createPlaylists(createPlaylistDtos);
  }

  private async processPodcasts(createPodcastDtos: CreatePodcastDto[]) {
    await this.podcastService.createPodcasts(createPodcastDtos);
  }
}
