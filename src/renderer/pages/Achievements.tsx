import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useUser } from '../context/user.context';
import { Achievement } from '../interfaces';
import AchievementService from '../services/AchievementService';
import { getImg } from '../helpers/getImg';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import { array6 } from '../constants/skeletons';

const Achievements = () => {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }
    AchievementService.getList<Achievement[]>()
      .then((data) => setAchievements(data))
      .finally(() => setLoading(false));
  }, [user]);

  const render = (data: Achievement[]) => {
    return (
      <Grid
        container
        sx={{ pt: 2 }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}
      >
        {data.map((a) => (
          <Grid item xs={2} sm={4} md={4} key={a._id}>
            <Card
              sx={{
                backgroundColor:
                  a.current >= a.total ? 'rgba(218,0,255,0.1)' : 'initial',
              }}
            >
              <CardActionArea>
                <Stack sx={{ p: 3 }} alignItems="center">
                  <Avatar
                    sx={{ width: 96, height: 96 }}
                    src={getImg(a.avatar)}
                  />
                  <CardContent sx={{ width: '100%' }}>
                    <Typography
                      textAlign="center"
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {a.title}
                    </Typography>
                    <Typography
                      textAlign="center"
                      whiteSpace="break-spaces"
                      variant="body2"
                      color="text.secondary"
                    >
                      {a.description}
                    </Typography>
                    <LinearProgressWithLabel
                      value={(a.current / a.total) * 100}
                      title="Progress"
                      sx={{ height: '6px' }}
                      containerProps={{ mt: 2 }}
                      color="secondary"
                      additionalText={`(${a.current} of ${a.total})`}
                    />
                  </CardContent>
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          {array6.map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Skeleton variant="rounded" height={300} width="100%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Typography sx={{ mt: 4, textAlign: 'center' }} variant="h5">
        Progress
      </Typography>
      {render(
        achievements
          .filter((a) => a.current < a.total)
          .slice()
          .sort((a, b) => {
            return b.current / b.total - a.current / a.total;
          })
      )}

      <Typography sx={{ mt: 4, textAlign: 'center' }} variant="h5">
        Done
      </Typography>
      {render(achievements.filter((a) => a.current >= a.total))}
    </Container>
  );
};

export default Achievements;
