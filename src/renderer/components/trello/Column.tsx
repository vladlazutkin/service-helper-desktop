import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useDrag, useDrop } from 'react-dnd';
import { TrelloColumn, TrelloItem } from '../../interfaces';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ColumnsService from '../../services/trello/ColumnsService';

interface ColumnProps {
  isOver?: boolean;
  children: React.ReactNode;
  index: number;
  column: TrelloColumn;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onCardAdd: (title: string, columnId: string) => Promise<void>;
  onRemove: (columnId: string) => Promise<void>;
}

interface CardSubmitForm {
  cardTitle: string;
}

const Column = ({
  isOver,
  children,
  index,
  moveColumn,
  column,
  onCardAdd,
  onRemove,
}: ColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(false);
  const [title, setTitle] = useState(column.title);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [, drop] = useDrop({
    accept: 'column',
    hover(item: TrelloItem & { index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoveredRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoveredRect.right - hoveredRect.left) / 2;
      const mousePosition = monitor.getClientOffset()!;

      const hoverClientX = mousePosition.x - hoveredRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      moveColumn(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const onAddCard = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleSubmit(async (data) => {
        await onCardAdd(data.cardTitle, column._id);
        setValue('cardTitle', '');
      })();
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { ...column, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const onKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActive(false);
    }
  };

  return (
    <Stack
      ref={ref}
      spacing={1}
      className="column"
      sx={{
        backgroundColor: isOver ? '#798f91' : '#c0c0c0',
        opacity: isDragging ? 0 : 1,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {active ? (
          <ClickAwayListener onClickAway={() => setActive(false)}>
            <TextField
              autoFocus
              sx={{ border: '2px solid black' }}
              InputProps={{
                style: {
                  color: 'black',
                  height: '36px',
                  outline: 'none',
                },
              }}
              onKeyDown={onKeyDown}
              value={title}
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <Typography
            onClick={() => setActive(true)}
            sx={{
              width: '100%',
              ml: '10px',
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {title}
          </Typography>
        )}
        <IconButton sx={{ color: 'black' }} onClick={handleClick}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => onRemove(column._id)}>Remove</MenuItem>
        </Menu>
      </Stack>
      {children}
      <TextField
        InputProps={{
          style: {
            color: 'black',
            height: '40px',
          },
        }}
        sx={{
          minWidth: '200px',
          backgroundColor: 'white',
          outline: 'none',
        }}
        error={!!errors.cardTitle}
        helperText={errors.cardTitle?.message}
        {...register('cardTitle')}
        onKeyDown={onAddCard}
        placeholder="Add card"
      />
    </Stack>
  );
};

const validationSchema = yup.object({
  cardTitle: yup.string().required('Title is required'),
});

export default Column;
