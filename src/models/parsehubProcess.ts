export interface ParsehubProcess {
  name: string;
  playlist: ParsehubPlaylist[];
}

export interface ParsehubPlaylist {
  title: string;
  description?: string;
  item?: ParsehubItem[];
}

export interface ParsehubItem {
  date?: string;
  title?: string;
  description?: string;
  url?: string;
}
