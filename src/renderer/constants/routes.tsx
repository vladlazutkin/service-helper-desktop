import React from 'react';
import { RoutesPath } from './route-paths';
import { RouteObject, USER_ROLE } from '../interfaces';
import Terraria from '../pages/games/Terraria';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/Profile';
import Skins from '../pages/Skins';
import Achievements from '../pages/Achievements';
import Notes from '../pages/Notes';
import RecognizeImage from '../pages/recognize/RecognizeImage';
import RecognizeVideo from '../pages/recognize/RecognizeVideo';
import DownloadYoutubeVideo from '../pages/download/DownloadYoutubeVideo';
import DownloadImageFromClipboard from '../pages/download/DownloadImageFromClipboard';
import DownloadYoutubeAudio from '../pages/download/DownloadYoutubeAudio';
import DownloadYoutubeVideosFromChannel from '../pages/download/DownloadYoutubeVideosFromChannel';
import DownloadTikTokVideo from '../pages/download/DownloadTikTokVideo';
import Boards from '../pages/trello/Boards';
import AudioTune from '../pages/AudioTune';
import ImageSlider from '../pages/ImageSlider';
import Trello from '../pages/trello/Trello';
import Chess from '../pages/games/Chess';
import Sapper from '../pages/games/Sapper';
import Call from '../pages/games/Call';
import Arkanoid from '../pages/games/Arkanoid';
import Cubello from '../pages/games/Cubello';
import Cubchik from '../pages/games/Cubchik';
import Checkers from '../pages/games/Checkers';
import AdminPanel from '../pages/admin/AdminPanel';
import Games from '../pages/games/Games';

export const routes: RouteObject[] = [
  {
    path: RoutesPath.LOGIN,
    role: null,
    page: <Login />,
  },
  {
    path: RoutesPath.REGISTER,
    role: null,
    page: <Register />,
  },
  {
    path: RoutesPath.PROFILE,
    role: USER_ROLE.USER,
    page: <Profile />,
  },
  {
    path: RoutesPath.SETTINGS,
    role: USER_ROLE.USER,
    page: <Settings />,
  },
  {
    path: RoutesPath.SKINS,
    role: USER_ROLE.USER,
    page: <Skins />,
  },
  {
    path: RoutesPath.ACHIEVEMENTS,
    role: USER_ROLE.USER,
    page: <Achievements />,
  },
  {
    path: RoutesPath.NOTES,
    role: USER_ROLE.USER,
    page: <Notes />,
  },
  {
    path: RoutesPath.RECOGNIZE_IMAGE,
    role: USER_ROLE.USER,
    page: <RecognizeImage />,
  },
  {
    path: RoutesPath.RECOGNIZE_VIDEO,
    role: USER_ROLE.USER,
    page: <RecognizeVideo />,
  },
  {
    path: RoutesPath.RECOGNIZE_VIDEO_BY_ID,
    role: USER_ROLE.USER,
    page: <RecognizeVideo />,
  },
  {
    path: RoutesPath.DOWNLOAD_YOUTUBE_VIDEO,
    role: USER_ROLE.USER,
    page: <DownloadYoutubeVideo />,
  },
  {
    path: RoutesPath.DOWNLOAD_IMAGE_FROM_CLIPBOARD,
    role: USER_ROLE.USER,
    page: <DownloadImageFromClipboard />,
  },
  {
    path: RoutesPath.DOWNLOAD_YOUTUBE_AUDIO,
    role: USER_ROLE.USER,
    page: <DownloadYoutubeAudio />,
  },
  {
    path: RoutesPath.DOWNLOAD_YOUTUBE_VIDEOS_FROM_PLAYLIST,
    role: USER_ROLE.USER,
    page: <DownloadYoutubeVideosFromChannel />,
  },
  {
    path: RoutesPath.DOWNLOAD_TIK_TOK_VIDEO,
    role: USER_ROLE.USER,
    page: <DownloadTikTokVideo />,
  },
  {
    path: RoutesPath.BOARDS,
    role: USER_ROLE.USER,
    page: <Boards />,
  },
  {
    path: RoutesPath.AUDIO_TUNE,
    role: USER_ROLE.USER,
    page: <AudioTune />,
  },
  {
    path: RoutesPath.IMAGES,
    role: USER_ROLE.USER,
    page: <ImageSlider />,
  },
  {
    path: RoutesPath.BOARD_BY_ID,
    role: USER_ROLE.USER,
    page: <Trello />,
  },
  {
    path: RoutesPath.GAMES,
    role: USER_ROLE.USER,
    page: <Games />,
  },
  {
    path: RoutesPath.GAMES_CHESS,
    role: USER_ROLE.USER,
    page: <Chess />,
  },
  {
    path: RoutesPath.GAMES_SAPPER,
    role: USER_ROLE.USER,
    page: <Sapper />,
  },
  {
    path: RoutesPath.GAMES_CALL,
    role: USER_ROLE.USER,
    page: <Call />,
  },
  {
    path: RoutesPath.GAMES_ARKANOID,
    role: USER_ROLE.USER,
    page: <Arkanoid />,
  },
  {
    path: RoutesPath.GAMES_CUBELLO,
    role: USER_ROLE.USER,
    page: <Cubello />,
  },
  {
    path: RoutesPath.GAMES_CUBCHIK,
    role: USER_ROLE.USER,
    page: <Cubchik />,
  },
  {
    path: RoutesPath.GAMES_CHESS_BY_ID,
    role: USER_ROLE.USER,
    page: <Chess />,
  },
  {
    path: RoutesPath.GAMES_TERRARIA,
    role: USER_ROLE.USER,
    page: <Terraria />,
  },
  {
    path: RoutesPath.GAMES_CHECKERS,
    role: USER_ROLE.USER,
    page: <Checkers />,
  },
  {
    path: RoutesPath.ADMIN_PANEL,
    role: USER_ROLE.ADMIN,
    page: <AdminPanel />,
  },
];
