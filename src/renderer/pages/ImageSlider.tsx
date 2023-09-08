import React, { useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { ImageSearchResult } from '../interfaces';
import { isMobile } from '../helpers/isMobile';
import { useDebounce } from '../helpers/hooks/useDebounce';
import ImagesService from '../services/ImagesService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PER_PAGE = 10;

const ImageSlider = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [query, setQuery] = useState<string>('car');
  const [page, setPage] = useState(1);

  const sliderRef = useRef<Slider>(null);

  const debouncedQuery = useDebounce(query, 500);

  const settings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    adaptiveHeight: true,
    slidesToScroll: 1,
    arrows: !isMobile(),
    beforeChange: (_, next) => {
      if (next === result.length - 1) {
        ImagesService.search<ImageSearchResult>({
          query: query,
          page: (page + 1).toString(),
          per_page: PER_PAGE.toString(),
        }).then((data) => {
          setResult((prev) => [
            ...prev,
            ...data.results.map((img) => img.urls.regular),
          ]);
        });
        setPage(page + 1);
      }
    },
  };

  useEffect(() => {
    if (!debouncedQuery) {
      setTotal(0);
      return setResult([]);
    }
    setLoading(true);
    ImagesService.search<ImageSearchResult>({
      query: debouncedQuery,
      per_page: PER_PAGE.toString(),
    })
      .then((data) => {
        setResult(data.results.map((img) => img.urls.regular));
        setTotal(data.total);
        sliderRef.current?.slickGoTo(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <Container>
      <TextField
        fullWidth
        label="Searh"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: total ? (
            <InputAdornment position="start">
              <Typography>Total: {total}</Typography>
            </InputAdornment>
          ) : null,
        }}
      />
      <Stack sx={{ mt: 2 }} alignItems={loading ? 'center' : 'initial'}>
        {!loading && (
          <Slider ref={sliderRef} {...settings}>
            {result.map((img, index) => (
              <div data-index={index} key={img}>
                <img className="slider-image" src={img} alt="photo" />
              </div>
            ))}
          </Slider>
        )}
      </Stack>
    </Container>
  );
};

export default ImageSlider;
