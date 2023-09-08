import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../../components/Modal';
import RangeRow from '../../components/RangeRow';
import SpotifyItems from '../../components/SpotifyItems';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import {
  SpotifyTrack,
  Range,
  VideoDimensions,
  Dimensions,
  VideoRangeStatus,
  Video,
  SpotifyPlaylist,
} from '../../interfaces';
import useModal from '../../helpers/hooks/useModal';
import { useSocket } from '../../context/socket.context';
import { RoutesPath } from '../../constants/route-paths';
import Slider from '../../components/Slider';
import MyVideos from '../../components/MyVideos';
import SpotifyService from '../../services/SpotifyService';
import VideoService from '../../services/VideoService';
import AuthService from '../../services/AuthService';
import { ReactComponent as Logo } from '../../assets/images/vectors/youtube-link-upload.svg';
import 'cropperjs/dist/cropper.css';

const languages = ['ru', 'eng', 'eng+ru'];

const RecognizeVideo = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const [link, setLink] = useState<string>(
    'https://www.youtube.com/watch?v=U9svKUcAZdw&t=169s&ab_channel=PatrickMusic'
  );
  const [url, setUrl] = useState<string>('');
  const [duration, setDuration] = React.useState(0);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});
  const [image, setImage] = useState('');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [recognizeProgress, setRecognizeProgress] = useState<
    Record<string, number>
  >({});
  const [spotifySearchProgress, setSpotifySearchProgress] = useState<
    Record<string, number>
  >({});

  const [loadingBegin, setLoadingBegin] = useState(false);
  const [loadingRecognize, setLoadingRecognize] = useState(false);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = useState(false);

  const [language, setLanguage] = React.useState('eng+ru');
  const [values, setValues] = React.useState<number[]>([]);
  const [activeHandleIndex, setActiveHandleIndex] = React.useState(-1);
  const [activeRange, setActiveRange] = useState('');
  const [ranges, setRanges] = useState<Range[]>([]);
  const [rangeId, setRangeId] = useState<string>('');

  const [recognizeResponse, setRecognizeResponse] = useState<
    Record<string, string[]>
  >({});
  const [spotifySearchResponse, setSpotifySearchResponse] = useState<
    Record<string, SpotifyTrack[]>
  >({});
  const [selectedResult, setSelectedResult] = useState<string[]>([]);
  const [selectedSpotifySearchResult, setSelectedSpotifySearchResult] =
    useState<SpotifyTrack[]>([]);

  const [playlistName, setPlaylistName] = useState<string>('name');

  const socket = useSocket();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [recognizeOpen, handleOpenRecognize, handleCloseRecognize] = useModal();
  const [spotifyOpen, handleOpenSpotify, handleCloseSpotify] = useModal();

  const onChangeValues = (newValues: number[]) => {
    const changedIndex = newValues.findIndex(
      (value, index) => value !== values[index]
    );
    setValues(newValues);
    setActiveHandleIndex(changedIndex);
    if (videoRef.current && changedIndex > -1) {
      videoRef.current.currentTime = Math.round(newValues[changedIndex]);
    }
  };

  // const { getTrackProps, handles } = useRanger({
  //   values,
  //   onChange: onChangeValues,
  //   min: 0,
  //   max: duration,
  //   stepSize: 1,
  // });

  const videoRef = useRef<HTMLVideoElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setDimensions((prev) => ({
      ...prev,
      [activeRange]: cropper!.getCropBoxData(),
    }));
  };

  const handleCreateSpotifyPlaylist = async () => {
    setLoadingCreatePlaylist(true);
    try {
      const data = await SpotifyService.createPlaylist<SpotifyPlaylist>({
        name: playlistName,
        tracks: selectedSpotifySearchResult.map((t) => t.id),
        rangeId,
      });
      enqueueSnackbar('Playlist created', {
        variant: 'success',
        action: (
          <Link color="#fff" target="_blank" href={data.url}>
            View on spotify
          </Link>
        ),
      });
    } catch (e) {
      console.log(e);
    }
    handleCloseSpotify();
    setLoadingCreatePlaylist(false);
  };

  const handleRecognize = async () => {
    setLoadingRecognize(true);
    setRecognizeProgress({});
    setRecognizeResponse({});
    setSpotifySearchResponse({});

    const dataObj = ranges.map((range) => {
      return {
        range,
        dimensions: dimensions[range.id] ?? null,
      };
    });
    try {
      ranges.forEach((range) =>
        socket.on(`video-recognize-progress-${videoId}-${range.id}`, (data) => {
          setRecognizeProgress((prev) => ({
            ...prev,
            [range.id]: data.progress,
          }));
        })
      );
      const data = await VideoService.youtubeRecognize<
        { id: string; response: string[] }[]
      >({ id: videoId || 'ddd', data: dataObj, language });
      setRecognizeResponse(
        data.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.response }), {})
      );
    } catch (e) {
      console.log(e);
    }
    setLoadingRecognize(false);
    enqueueSnackbar('Recognize completed', { variant: 'success' });
  };

  const handleBegin = async () => {
    setLoadingBegin(true);
    try {
      const data = await VideoService.youtubeCreateInfo<Video>({ link });
      setUrl(data.youtubeUrl);
      navigate(RoutesPath.RECOGNIZE_VIDEO_BY_ID.replace(':videoId', data._id));
      socket.on(`video-upload-progress-${data._id}`, (data) => {
        setUploadProgress(data.progress);
        if (data.progress === 100) {
          enqueueSnackbar('Download completed', { variant: 'success' });
        }
      });
    } catch (e) {
      console.log(e);
    }
    setLoadingBegin(false);
  };

  const handleSearchSpotifyTracks = async () => {
    try {
      socket.on(`spotify-search-progress-${videoId}-${rangeId}`, (data) => {
        setSpotifySearchProgress((prev) => ({
          ...prev,
          [rangeId]: data.progress,
        }));
      });
      const data = await SpotifyService.search<SpotifyTrack[]>({
        search: selectedResult,
        rangeId,
        videoId,
      });
      enqueueSnackbar('Spotify tracks loaded', { variant: 'success' });
      handleCloseRecognize();
      setSpotifySearchResponse((prev) => ({ ...prev, [rangeId]: data }));
    } catch (e: any) {
      if (e.response.status === 401) {
        const data = await AuthService.loginSpotify<{ url: string }>();
        const key: string | number = enqueueSnackbar(
          'You need to login to spotify to use this feature',
          {
            variant: 'error',
            autoHideDuration: null,
            SnackbarProps: {
              onClick: () => closeSnackbar(key),
            },
            action: (
              <Link color="#fff" target="_blank" href={data.url}>
                Login
              </Link>
            ),
          }
        );
      }
      console.log({ e });
    }
  };

  const handlePlayStop = () => {
    if (videoRef.current?.paused) {
      return videoRef.current.play();
    }
    videoRef.current?.pause();
  };

  const handleAddFragment = () => {
    setValues((prev) => [
      ...prev,
      Math.round(Math.random() * duration),
      Math.round(Math.random() * duration),
    ]);
  };

  const handleChangeActiveRange = (id: string) => () => {
    if (activeRange) {
      setActiveRange('');
    }
    if (activeRange !== id) {
      setTimeout(() => {
        setActiveRange(() => id);
      });
    }
  };

  const handleOpenRecognizeResults = (id: string) => () => {
    setSelectedResult(recognizeResponse[id]);
    setRangeId(id);
    handleOpenRecognize();
  };

  const handleOpenSpotifyResults = (id: string) => () => {
    setSelectedSpotifySearchResult(spotifySearchResponse[id]);
    setRangeId(id);
    handleOpenSpotify();
  };

  const handleChangeRange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        return;
      }
      const time = e.target.value
        .split(':')
        .reduce((acc, time) => 60 * acc + +time, 0);
      setActiveHandleIndex(index);
      setValues((prev) => prev.map((el, i) => (index === i ? time : el)));
      if (videoRef.current) {
        videoRef.current.currentTime = Math.round(time);
      }
    };

  const removeRange = (id: string) => () => {
    const fragment = ranges.find((r) => r.id === id);
    setValues((prev) =>
      prev.filter(
        (value) => value !== fragment?.start && value !== fragment?.stop
      )
    );
    setActiveRange('');
    setDimensions(({ [id]: _, ...rest }) => rest);
  };

  useEffect(() => {
    const newRanges = values
      .slice()
      .sort((a, b) => a - b)
      .reduce((acc: Range[], cur, index) => {
        const prevIndex = Math.floor(index / 2);
        if (index % 2 === 0) {
          return [
            ...acc,
            {
              id: ranges[prevIndex]?.id ?? uuidv4(),
              start: cur,
              stop: 0,
            },
          ];
        }
        const last = acc[acc.length - 1];
        last.stop = cur;
        return acc;
      }, []);

    setRanges(newRanges);
  }, [values]);

  useEffect(() => {
    if (!activeRange) {
      return;
    }
    const prevCrop = dimensions[activeRange];
    if (!prevCrop) {
      return;
    }
    const cropper = cropperRef.current?.cropper;

    setTimeout(() => {
      cropper?.setData(prevCrop);
      cropper?.setCropBoxData(prevCrop);
      cropper?.setCanvasData(prevCrop);
    });
  }, [activeRange]);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.onloadedmetadata = () => {
      const createEmptyImage = (videoDimensions: VideoDimensions) => {
        const canvas = document.createElement('canvas');
        canvas.width = videoDimensions.width;
        canvas.height = videoDimensions.height;

        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, videoDimensions.width, videoDimensions.height);

        setImage(canvas.toDataURL());
      };

      const duration = videoRef.current?.duration ?? 0;
      setDuration(duration);
      createEmptyImage({
        width: videoRef.current?.videoWidth!,
        height: videoRef.current?.videoHeight!,
      });
    };
    videoRef.current.ontimeupdate = () => {
      if (activeHandleIndex > -1) {
        setValues((prev) =>
          prev.map((el, index) =>
            index === activeHandleIndex ? videoRef.current?.currentTime! : el
          )
        );
      }
    };
  }, [url, activeHandleIndex]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected successfully');
    });
  }, [socket]);

  useEffect(() => {
    if (!videoId) {
      setLink('');
      setUrl('');
      return setValues([]);
    }
    const loadVideoData = async () => {
      try {
        const { url, videoRanges, youtubeUrl } =
          await VideoService.getById<Video>(videoId);
        if (!videoRanges.length) {
          setLink(youtubeUrl);
          return setUrl(url);
        }

        const ranges = videoRanges.map((r) => r.range);
        const recognizeData = videoRanges.reduce((acc, cur) => {
          if (cur.status === VideoRangeStatus.RECOGNIZED && cur.result.length) {
            return { ...acc, [cur.range.id]: cur.result };
          }
          return acc;
        }, {});
        const spotifySearchData = videoRanges.reduce((acc, cur) => {
          if (
            cur.status === VideoRangeStatus.RECOGNIZED &&
            cur.spotifyTracks.length
          ) {
            return { ...acc, [cur.range.id]: cur.spotifyTracks };
          }
          return acc;
        }, {});
        const dimensions = videoRanges.reduce(
          (acc, cur) => ({ ...acc, [cur.range.id]: cur.dimensions }),
          {}
        );
        const values = ranges.reduce(
          (acc: number[], cur) => [...acc, cur.start, cur.stop],
          []
        );

        setUrl(url);
        setLink(youtubeUrl);
        setRanges(ranges);
        setDimensions(dimensions);
        setRecognizeResponse(recognizeData);
        setSpotifySearchResponse(spotifySearchData);

        setTimeout(() => {
          setValues(values);
        }, 1000);

        videoRanges.forEach(({ range, status }) => {
          if (status !== VideoRangeStatus.RECOGNIZED) {
            socket.on(
              `video-recognize-progress-${videoId}-${range.id}`,
              (data) => {
                setRecognizeProgress((prev) => ({
                  ...prev,
                  [range.id]: data.progress,
                }));
              }
            );
          }
        });
      } catch (e: any) {
        if (e.response.status === 404) {
          enqueueSnackbar('Video not found', { variant: 'error' });
          navigate(RoutesPath.RECOGNIZE_VIDEO);
        }
      }
    };
    loadVideoData();
  }, [videoId]);

  return (
    <Container>
      <Stack spacing={2} direction="column" alignItems="flex-start">
        <MyVideos
          onPick={(id) =>
            navigate(RoutesPath.RECOGNIZE_VIDEO_BY_ID.replace(':videoId', id))
          }
        />
        {!url && (
          <Stack alignSelf="center" alignItems="center" spacing={3}>
            <Logo
              width="30vw"
              style={{ minWidth: '350px', maxWidth: '600px' }}
            />
            <Typography fontWeight="bold" variant="h5">
              Paste YouTube link here
            </Typography>
            <Stack width="100%" direction="row" spacing={1}>
              <TextField
                fullWidth
                label="Your link"
                variant="filled"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <LoadingButton
                disabled={!link}
                loading={loadingBegin}
                variant="contained"
                component="label"
                onClick={handleBegin}
              >
                Begin
              </LoadingButton>
            </Stack>
            {uploadProgress > 0 && (
              <LinearProgressWithLabel
                sx={{ width: '100%' }}
                color="info"
                title={`Upload progress ${
                  uploadProgress === 100 ? '- done!' : ''
                }`}
                value={uploadProgress}
              />
            )}
          </Stack>
        )}

        {!!url && (
          <div style={{ width: '100%' }}>
            {!!activeRange && (
              <Cropper
                style={{ position: 'absolute', zIndex: 1 }}
                ref={cropperRef}
                src={image}
                crop={onCrop}
                viewMode={0}
                minCropBoxHeight={30}
                minCropBoxWidth={50}
                background={false}
                zoomable={false}
              />
            )}
            <video
              onClick={handlePlayStop}
              onError={() => {
                enqueueSnackbar('Video not found', { variant: 'error' });
                navigate(RoutesPath.RECOGNIZE_VIDEO);
              }}
              ref={videoRef}
              src={url}
            />
            {!!ranges.length ? (
              <Slider
                min={0}
                step={1}
                max={duration}
                value={values}
                onChange={onChangeValues}
              />
            ) : (
              <div />
            )}

            {!!ranges.length && (
              <Stack style={{ marginTop: '30px' }} spacing={2}>
                {ranges.map((range, index) => (
                  <RangeRow
                    key={range.id}
                    index={index}
                    range={range}
                    activeRange={activeRange}
                    recognizeProgress={recognizeProgress[range.id]}
                    hasRecognizeResponse={!!recognizeResponse[range.id]}
                    hasSpotifySearchResponse={!!spotifySearchResponse[range.id]}
                    removeRange={removeRange}
                    handleChangeRange={handleChangeRange}
                    handleChangeActiveRange={handleChangeActiveRange}
                    handleOpenSpotifyResults={handleOpenSpotifyResults}
                    handleOpenRecognizeResults={handleOpenRecognizeResults}
                  />
                ))}
              </Stack>
            )}
            <Button
              variant="contained"
              component="label"
              sx={{ mt: '20px' }}
              onClick={handleAddFragment}
            >
              Add fragment
            </Button>
          </div>
        )}
        {!!url && !!ranges.length && (
          <div style={{ width: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <LoadingButton
                loading={loadingRecognize}
                variant="contained"
                component="label"
                onClick={handleRecognize}
              >
                Recognize
              </LoadingButton>
              <FormControl>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </div>
        )}
      </Stack>

      <Modal
        title="Recognize results"
        open={recognizeOpen}
        onClose={handleCloseRecognize}
      >
        <div style={{ overflow: 'auto', maxHeight: '70vh' }}>
          {selectedResult.map((str, index) => (
            <Typography key={index} variant="h6" component="h2">
              {index + 1}. {str}
            </Typography>
          ))}
        </div>
        <Stack direction="row" spacing={2} sx={{ mt: '10px' }}>
          <Button
            sx={{ minWidth: 'fit-content' }}
            variant="contained"
            component="label"
            onClick={handleSearchSpotifyTracks}
          >
            Get spotify tracks
          </Button>
          {!!spotifySearchProgress[rangeId] && (
            <LinearProgressWithLabel
              color="info"
              title={`Search progress ${
                spotifySearchProgress[rangeId] === 100 ? '- done!' : ''
              }`}
              value={spotifySearchProgress[rangeId]}
            />
          )}
        </Stack>
      </Modal>
      <Modal
        title="Spotify search results"
        open={spotifyOpen}
        onClose={handleCloseSpotify}
      >
        <div style={{ overflow: 'auto', maxHeight: '70vh' }}>
          <SpotifyItems
            onTracksUpdate={(tracks) => setSelectedSpotifySearchResult(tracks)}
            tracks={selectedSpotifySearchResult}
          />
        </div>
        <Stack
          sx={{ mt: '20px' }}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Playlist name"
            variant="filled"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <LoadingButton
            loading={loadingCreatePlaylist}
            variant="contained"
            component="label"
            onClick={handleCreateSpotifyPlaylist}
          >
            Create spotify playlist
          </LoadingButton>
        </Stack>
      </Modal>
    </Container>
  );
};

export default RecognizeVideo;
