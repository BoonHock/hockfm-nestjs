import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateChannelDto } from 'src/channels/dto/createChannel.dto';
import { ParsehubAstro } from 'src/models/parsehubAstro';
import { ParsehubBfm } from 'src/models/parsehubBfm';
import { ParsehubPlaylist, ParsehubProcess } from 'src/models/parsehubProcess';
import { CreatePlaylistDto } from 'src/playlists/dto/createPlaylist.dto';
import { PlaylistsService } from 'src/playlists/playlists.service';
import { CreatePodcastDto } from 'src/podcasts/dto/createPodcast.dto';
import { PodcastStatus } from 'src/podcasts/podcast-status.enum';
import { PodcastsService } from 'src/podcasts/podcasts.service';

@Injectable()
export class WebhookService {
  constructor(
    private channelService: ChannelsService,
    private playlistService: PlaylistsService,
    private podcastService: PodcastsService,
    private readonly httpService: HttpService,
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

  async getParsehubData(runToken: string) {
    const { data: parsehubResponse } = await firstValueFrom(
      this.httpService.get(
        `https://www.parsehub.com/api/v2/runs/${runToken}/data?api_key=taaKjPYhn_oY`,
      ),
    );

    const parsehubProcess: ParsehubProcess[] = [];

    if (parsehubResponse.channel === 'BFM') {
      const parsehubBfm = parsehubResponse as ParsehubBfm;
      const obj: ParsehubProcess = {
        name: parsehubBfm.channel,
        playlist: [],
      };
      parsehubBfm.programme.forEach((programme) => {
        programme.playlist.forEach((playlist) => {
          if (playlist.item) {
            obj.playlist.push({
              title: playlist.title,
              description: playlist.description,
              item: playlist.item?.filter((item) => item.url && item.title),
            });
          }
        });
      });
      parsehubProcess.push(obj);
    } else {
      const parsehubAstro = parsehubResponse as ParsehubAstro;
      parsehubAstro.channel.forEach((channel) => {
        const obj: ParsehubProcess = {
          name: channel.name,
          playlist: [],
        };

        channel.playlist.forEach((playlist) => {
          if (playlist.title === 'Hitz Morning Crew Rewinds') {
            console.log(playlist);
          }
          if (playlist.item) {
            obj.playlist.push({
              title: playlist.title,
              description: playlist.description,
              item: playlist.item
                ?.filter((item) => item.url && item.title)
                .map((item) => {
                  if (item.date) {
                    var dateParts = item.date.split('-');
                    item.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                  }
                  return item;
                }),
            });
          }
        });

        parsehubProcess.push(obj);
      });
    }

    let test: any;

    parsehubProcess.forEach((process) => {
      test = this.loadParsehubDataIntoDb(process);
    });
    return test;
  }

  async loadParsehubDataIntoDb(parsehubProcess: ParsehubProcess) {
    let channel = await this.channelService.getChannelByName(
      parsehubProcess.name,
    );
    if (!channel) {
      channel = await this.channelService.createChannel({
        channelId: 0, // legacy reason. previously sent by php side
        name: parsehubProcess.name,
        created_timestamp: new Date(),
      });
    }

    parsehubProcess.playlist.forEach(async (playlist) => {
      if (!playlist.item) {
        return;
      }

      let playlistDb = await this.playlistService.getPlaylistByNameAndChannelId(
        playlist.title,
        channel.id,
      );

      if (!playlistDb) {
        playlistDb = await this.playlistService.createPlaylist({
          playlistId: 0, // legacy reason. previously sent by php side
          title: playlist.title,
          description: playlist.description ?? '',
          channelId: 0, // legacy reason. previously sent by php side
          created_timestamp: new Date(),
          channelUuid: channel.id,
        });
      }

      const createPodcastDto: CreatePodcastDto[] = [];
      playlist.item.forEach((item) => {
        const obj: CreatePodcastDto = {
          playlistUuid: playlistDb.id,
          playlistId: 0, // legacy reason. previously sent by php side
          podcastId: 0, // legacy reason. previously sent by php side
          title: item.title,
          description: item.description ?? '',
          url: item.url,
          date: item.date ? new Date(item.date) : new Date(),
          is_real_date: item.date ? true : false,
          status: PodcastStatus.NONE,
          created_timestamp: new Date(),
        };
        createPodcastDto.push(obj);
      });

      await this.processPodcasts(createPodcastDto);
    });
    return 'ok';
  }

  private async processChannels(createChannelDtos: CreateChannelDto[]) {
    await this.channelService.createChannels(createChannelDtos);
  }

  private async processPlaylists(createPlaylistDtos: CreatePlaylistDto[]) {
    await this.playlistService.createPlaylists(createPlaylistDtos);
  }

  private async processPodcasts(createPodcastDtos: CreatePodcastDto[]) {
    await this.podcastService.createPodcasts(createPodcastDtos);
  }
}
