import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Modal from '../Modal';
import { TrelloBoard, TrelloLabel } from '../../interfaces';
import { useDebounce } from '../../helpers/hooks/useDebounce';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ChromePicker } from 'react-color';
import InputLabel from '@mui/material/InputLabel';
import { usePrevious } from '../../helpers/hooks/usePrevious';
import LabelService from '../../services/trello/LabelsService';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  board: TrelloBoard;
  onUpdate: (board: Partial<TrelloBoard>) => void;
}

interface BoardSettingsSubmitForm {
  title: string;
}

const BoardSettingsModal = ({
  open,
  board,
  onUpdate,
  onClose,
}: CardModalProps) => {
  const [labels, setLabels] = useState<TrelloLabel[]>([]);
  const [activeLabel, setActiveLabel] = useState('');

  const { id: boardId } = useParams<{ id: string }>();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardSettingsSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const title = watch('title');

  const deferredTitle = useDebounce(title, 1000);
  const prevLabels = usePrevious(labels);

  const handleClick = (id: string) => {
    setActiveLabel(id);
  };

  const handleDeleteLabel = async (id: string) => {
    await LabelService.remove(id);
    LabelService.getListForBoard<TrelloLabel[]>(boardId!).then((data) =>
      setLabels(data)
    );
  };

  const onChangeColor = async (id: string, color: string) => {
    setLabels((prev) => prev.map((f) => (f._id === id ? { ...f, color } : f)));
  };

  const onChangeTitle = async (id: string, title: string) => {
    setLabels((prev) => prev.map((f) => (f._id === id ? { ...f, title } : f)));
  };

  const handleCreateLabel = async () => {
    await LabelService.create({
      boardId,
      title: 'new label',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
    LabelService.getListForBoard<TrelloLabel[]>(boardId!).then((data) =>
      setLabels(data)
    );
  };

  useEffect(() => {
    handleSubmit((data) => onUpdate({ title: data.title }))();
  }, [deferredTitle]);

  useEffect(() => {
    labels.forEach((label, index) => {
      const prevLabel = prevLabels[index];
      if (!prevLabel) {
        return;
      }

      const toUpdate: Record<string, any> = {};

      if (label.title !== prevLabel.title) {
        toUpdate.title = label.title;
      }
      if (label.color !== prevLabel.color) {
        toUpdate.color = label.color;
      }

      if (!Object.keys(toUpdate).length) {
        return;
      }

      LabelService.edit(label._id, toUpdate);
    });
  }, [labels]);

  useEffect(() => {
    LabelService.getListForBoard<TrelloLabel[]>(boardId!).then((data) =>
      setLabels(data)
    );
  }, []);

  useEffect(() => {
    setValue('title', board.title);
  }, []);

  return (
    <Modal
      modalProps={{
        width: '50%',
        maxWidth: '600px',
        minWidth: '400px',
        maxHeight: '70vh',
        overflow: 'auto',
      }}
      open={open}
      title="Board settings"
      onClose={onClose}
    >
      <Stack spacing={2} justifyContent="space-between">
        <InputLabel>Title</InputLabel>
        <TextField
          variant="outlined"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
        />
        <div>
          <Typography>Grid size: {board.gridStep}px</Typography>
          <Slider
            marks
            step={25}
            min={50}
            max={300}
            value={board.gridStep}
            sx={{ color: 'white' }}
            valueLabelDisplay="auto"
            onChange={(e, value) => onUpdate({ gridStep: value as number })}
          />
        </div>
        <InputLabel>Labels</InputLabel>
        <Stack useFlexGap flexWrap="wrap" direction="row" spacing={1}>
          {labels.map((l) =>
            l._id === activeLabel ? (
              <ClickAwayListener
                key={l._id}
                onClickAway={() => setActiveLabel('')}
              >
                <div style={{ position: 'relative' }}>
                  <TextField
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveLabel('');
                      }
                    }}
                    value={l.title}
                    variant="standard"
                    sx={{
                      backgroundColor: l.color,
                      borderRadius: '12px',
                      p: 1,
                    }}
                    onChange={(e) => onChangeTitle(l._id, e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        color: 'white',
                        fontSize: 14,
                      },
                    }}
                  />
                  {/*// @ts-ignore*/}
                  <div style={popover}>
                    <ChromePicker
                      color={l.color}
                      onChangeComplete={(data) =>
                        onChangeColor(l._id, data.hex)
                      }
                    />
                  </div>
                </div>
              </ClickAwayListener>
            ) : (
              <Chip
                key={l._id}
                label={l.title}
                sx={{ backgroundColor: l.color, py: 3, minWidth: '70px' }}
                onClick={() => handleClick(l._id)}
                onDelete={() => handleDeleteLabel(l._id)}
              />
            )
          )}
          <Button variant="contained" onClick={handleCreateLabel}>
            Add
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button sx={{ color: 'white' }} variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#954da4' }}
            onClick={onClose}
          >
            OK
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

const popover = {
  position: 'absolute',
  zIndex: 1,
  left: '100%',
  bottom: 0,
};

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
});

export default BoardSettingsModal;
