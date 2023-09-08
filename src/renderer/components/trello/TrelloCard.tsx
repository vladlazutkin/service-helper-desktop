import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TrelloColumn, TrelloItem } from '../../interfaces';
import useModal from '../../helpers/hooks/useModal';
import CardModal from './CardModal';

interface TrelloCardProps {
  item: TrelloItem;
  index: number;
  column: TrelloColumn;
  columns: TrelloColumn[];
  onRemove: () => void;
  onUpdate: (partial: Partial<TrelloItem>) => void;
  moveItem: (dragIndex: number, hoverIndex: number, columnId: string) => void;
}

const TrelloCard = ({
  item,
  index,
  moveItem,
  column,
  columns,
  onRemove,
  onUpdate,
}: TrelloCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [open, handleOpen, handleClose] = useModal();

  const [, drop] = useDrop({
    accept: 'card',
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
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const mousePosition = monitor.getClientOffset()!;

      const hoverClientY = mousePosition.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveItem(dragIndex, hoverIndex, column._id);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <>
      <Stack
        onClick={handleOpen}
        ref={ref}
        sx={{ opacity: isDragging ? 0 : 1 }}
        className="item"
      >
        <Box
          sx={{
            backgroundColor: column.color,
            width: '40px',
            height: '10px',
            borderRadius: '5px',
          }}
        />
        <Typography fontSize={18} color="black">
          {item.title}
        </Typography>
      </Stack>

      <span style={{ marginTop: '0' }}>
        <CardModal
          onRemove={() => {
            onRemove();
            handleClose();
          }}
          onUpdate={onUpdate}
          columns={columns}
          open={open}
          onClose={handleClose}
          item={item}
        />
      </span>
    </>
  );
};

export default TrelloCard;
