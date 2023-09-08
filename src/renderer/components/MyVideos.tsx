import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Video } from '../interfaces';
import { formatTime } from '../helpers/formatTime';
import VideoService from '../services/VideoService';
import { useTheme } from '@mui/material';

interface MyVideosProps {
  onPick: (id: string) => void;
}

const MyVideos = ({ onPick }: MyVideosProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const theme = useTheme();

  const handleRemove = async (id: string) => {
    setLoadingDelete(true);
    await VideoService.remove(id);

    VideoService.getList<Video[]>().then((data) => {
      setVideos(data);
      setLoadingDelete(false);
    });
  };

  useEffect(() => {
    VideoService.getList<Video[]>().then((data) => {
      setVideos(data);
    });
  }, []);

  if (!videos.length) {
    return null;
  }

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="h1" variant="h5">
          Your videos
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {videos.map((video, index) => (
          <Card
            sx={{ backgroundColor: theme.palette.secondary.main }}
            key={video._id}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  justifyContent="space-between"
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <TextField fullWidth value={video.youtubeUrl} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="contained"
                      onClick={() => onPick(video._id)}
                    >
                      Pick
                    </Button>
                    <LoadingButton
                      loading={loadingDelete}
                      variant="contained"
                      color="error"
                      onClick={() => handleRemove(video._id)}
                    >
                      Delete
                    </LoadingButton>
                  </Stack>
                </Stack>
                <Typography component="h1" variant="h5">
                  Recognize progress
                </Typography>
                <Stack direction="row" spacing={2}>
                  {video.videoRanges.map((range) => (
                    <Card
                      sx={{ cursor: 'pointer' }}
                      variant="outlined"
                      key={range.range.id}
                    >
                      <CardContent>
                        <Stack>
                          <Typography>
                            {`Range: ${formatTime(range.range.start)} - 
                    ${formatTime(range.range.stop)}`}
                          </Typography>
                          <Typography>Progress: {range.progress}%</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
            {index !== videos.length - 1 && <Divider />}
          </Card>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default MyVideos;
