import { ParsehubPlaylist } from './parsehubProcess';

export interface ParsehubBfm {
  channel: string;
  programme: ParsehubBfmProgramme[];
}

export interface ParsehubBfmProgramme {
  playlist: ParsehubPlaylist[];
}
