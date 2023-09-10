import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import MissedVideoCallIcon from '@mui/icons-material/MissedVideoCall';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import SpeakerIcon from '@mui/icons-material/Speaker';
import DownloadIcon from '@mui/icons-material/Download';
import { RoutesPath } from './route-paths';
import { DrawerRoute } from '../interfaces';
import i18n from 'renderer/i18n';

export const createDrawerRoutes = (): DrawerRoute[] => [
  {
    icon: ImageSearchIcon,
    path: RoutesPath.RECOGNIZE,
    title: i18n.t('drawer.recognize'),
    children: [
      {
        icon: ImageSearchIcon,
        path: RoutesPath.RECOGNIZE_IMAGE,
        title: i18n.t('drawer.imageRecognize'),
      },
      {
        icon: MissedVideoCallIcon,
        path: RoutesPath.RECOGNIZE_VIDEO,
        title: i18n.t('drawer.videoRecognize'),
      },
    ],
  },
  {
    icon: AudiotrackIcon,
    path: RoutesPath.AUDIO_TUNE,
    title: i18n.t('drawer.audioTune'),
  },
  {
    icon: DownloadIcon,
    path: RoutesPath.DOWNLOAD,
    title: i18n.t('drawer.download'),
    children: [
      {
        icon: YouTubeIcon,
        path: RoutesPath.DOWNLOAD_IMAGE_FROM_CLIPBOARD,
        title: i18n.t('drawer.fromClipboard'),
      },
      {
        icon: YouTubeIcon,
        path: RoutesPath.DOWNLOAD_YOUTUBE_VIDEO,
        title: i18n.t('drawer.youtube'),
      },
      {
        icon: SpeakerIcon,
        path: RoutesPath.DOWNLOAD_YOUTUBE_AUDIO,
        title: i18n.t('drawer.youtubeAudio'),
      },
      {
        icon: YouTubeIcon,
        path: RoutesPath.DOWNLOAD_YOUTUBE_VIDEOS_FROM_PLAYLIST,
        title: i18n.t('drawer.ytFromPlaylist'),
      },
      {
        icon: InstallMobileIcon,
        path: RoutesPath.DOWNLOAD_TIK_TOK_VIDEO,
        title: i18n.t('drawer.tikTok'),
      },
    ],
  },
  {
    icon: SpeakerNotesIcon,
    path: RoutesPath.NOTES,
    title: i18n.t('drawer.notes'),
  },
  {
    icon: ChecklistRtlIcon,
    path: RoutesPath.BOARDS,
    title: i18n.t('drawer.trelloBoards'),
  },
  {
    icon: PermMediaIcon,
    path: RoutesPath.IMAGES,
    title: i18n.t('drawer.imageSlider'),
  },
  {
    icon: VideogameAssetIcon,
    path: RoutesPath.GAMES,
    title: i18n.t('drawer.games'),
  },
  {
    icon: VideogameAssetIcon,
    path: RoutesPath.DESKTOP_MANAGEMENT,
    title: i18n.t('drawer.desktopManagement'),
  },
];
