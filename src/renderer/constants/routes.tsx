import React from 'react';
import { RoutesPath } from './route-paths';
import { RouteObject, USER_ROLE } from '../interfaces';
import Terraria from '../pages/games/Terraria';
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Settings = React.lazy(() => import('../pages/settings/Settings'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Skins = React.lazy(() => import('../pages/Skins'));
const Achievements = React.lazy(() => import('../pages/Achievements'));
const Notes = React.lazy(() => import('../pages/Notes'));
const RecognizeImage = React.lazy(
  () => import('../pages/recognize/RecognizeImage')
);
const RecognizeVideo = React.lazy(
  () => import('../pages/recognize/RecognizeVideo')
);
const DownloadYoutubeVideo = React.lazy(
  () => import('../pages/download/DownloadYoutubeVideo')
);
const DownloadImageFromClipboard = React.lazy(
  () => import('../pages/download/DownloadImageFromClipboard')
);
const DownloadYoutubeAudio = React.lazy(
  () => import('../pages/download/DownloadYoutubeAudio')
);
const DownloadYoutubeVideosFromChannel = React.lazy(
  () => import('../pages/download/DownloadYoutubeVideosFromChannel')
);
const DownloadTikTokVideo = React.lazy(
  () => import('../pages/download/DownloadTikTokVideo')
);
const Boards = React.lazy(() => import('../pages/trello/Boards'));
const AudioTune = React.lazy(() => import('../pages/AudioTune'));
const ImageSlider = React.lazy(() => import('../pages/ImageSlider'));
const Trello = React.lazy(() => import('../pages/trello/Trello'));
const Chess = React.lazy(() => import('../pages/games/Chess'));
const Sapper = React.lazy(() => import('../pages/games/Sapper'));
const Call = React.lazy(() => import('../pages/games/Call'));
const Arkanoid = React.lazy(() => import('../pages/games/Arkanoid'));
const Cubello = React.lazy(() => import('../pages/games/Cubello'));
const Cubchik = React.lazy(() => import('../pages/games/Cubchik'));
const Checkers = React.lazy(() => import('../pages/games/Checkers'));
const AdminPanel = React.lazy(() => import('../pages/admin/AdminPanel'));
const Games = React.lazy(() => import('../pages/games/Games'));

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
