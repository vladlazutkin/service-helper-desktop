export interface Range {
  id: string;
  start: number;
  stop: number;
}

export interface Dimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface VideoDimensions {
  height: number;
  width: number;
}

export interface SpotifyPlaylist {
  id: string;
  url: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  externalUrl: string;
  previewUrl: string;
  imageUrl: string;
  artistName: string;
}

export enum VideoStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
}

export enum VideoRangeStatus {
  RECOGNIZING = 'recognizing',
  RECOGNIZED = 'recognized',
}

interface VideoRange {
  range: Range;
  dimensions: Dimensions;
  progress: number;
  result: string[];
  status: VideoRangeStatus;
  spotifyTracks: SpotifyTrack[];
  playlistUrl: string;
}

export interface Video {
  _id: string;
  date: Date;
  youtubeUrl: string;
  url: string;
  status: VideoStatus;
  videoRanges: VideoRange[];
}
