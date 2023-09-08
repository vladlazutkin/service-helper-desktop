import React, { KeyboardEvent, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import DropWrapper from './DropWrapper';
import Column from './Column';
import TrelloCard from './TrelloCard';
import { TrelloBoard, TrelloColumn, TrelloItem } from '../../interfaces';
import BoardsService from '../../services/trello/BoardsService';
import ColumnsService from '../../services/trello/ColumnsService';
import CardsService from '../../services/trello/CardsService';
import { useParams } from 'react-router-dom';
import BoardSettingsModal from './BoardSettingsModal';
import useModal from '../../helpers/hooks/useModal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { usePrevious } from '../../helpers/hooks/usePrevious';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ReactComponent as Logo } from '../../assets/images/vectors/create-trello-board.svg';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

interface ColumnSubmitForm {
  title: string;
}

const ColumnView = () => {
  const [columns, setColumns] = useState<TrelloColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [board, setBoard] = useState<TrelloBoard | null>(null);

  const { id: boardId } = useParams<{ id: string }>();

  const prevBoard = usePrevious(board);

  const [openSettings, handleOpenSettings, handleCloseSettings] = useModal();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ColumnSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const load = async () => {
    BoardsService.getById<TrelloBoard>(boardId!).then(async (board) => {
      setBoard(board);
      const { columns } = board;
      setColumns(
        columns
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((c) => ({ ...c, loading: true }))
      );
      setLoading(false);
      await Promise.all(
        columns.map(async (col) => {
          const data = await ColumnsService.getById<TrelloColumn>(col._id);

          setColumns((prev) =>
            prev.map((c) =>
              c._id === col._id
                ? {
                    ...data,
                    cards: data.cards
                      .slice()
                      .sort((a, b) => a.position - b.position),
                    loading: false,
                  }
                : c
            )
          );
        })
      );
    });
  };

  const onDrop = (item: TrelloItem, columnId: string) => {
    if (item.column._id === columnId) {
      return;
    }

    CardsService.edit(item._id, { boardId, columnId });
    const prevCol = columns.find((c) => c._id === item.column._id)!;
    const newCol = columns.find((c) => c._id === columnId)!;
    prevCol.cards = prevCol.cards.filter((c) => c._id !== item._id);
    item.column = newCol;
    newCol.cards = [...newCol.cards, item];
    setColumns((prev) =>
      prev.map((c) =>
        c._id === prevCol._id ? prevCol : c._id === newCol._id ? newCol : c
      )
    );
  };

  const moveItem = (
    dragIndex: number,
    hoverIndex: number,
    columnId: string
  ) => {
    const items = columns.find((c) => c._id === columnId)?.cards ?? [];
    const item = items[dragIndex];
    const newItems = items.filter((i, idx) => idx !== dragIndex);
    newItems.splice(hoverIndex, 0, item);
    setColumns((prevState) =>
      prevState.map((c) => (c._id === columnId ? { ...c, cards: newItems } : c))
    );
  };

  const handleRemoveColumn = async (columnId: string) => {
    await ColumnsService.remove(columnId);
    setColumns((prev) => prev.filter((c) => c._id !== columnId));
  };

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const item = columns[dragIndex];
    setColumns((prevState) => {
      const newItems = prevState.filter((i, idx) => idx !== dragIndex);
      newItems.splice(hoverIndex, 0, item);
      return [...newItems];
    });
  };

  const handleAddColumn = async () => {
    setLoadingAdd(true);
    await handleSubmit(async (data) => {
      await ColumnsService.create({ boardId, title: data.title });
      setValue('title', '');
      load();
    })();
    setLoadingAdd(false);
  };

  const onAddColumn = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    }
  };

  const onCardAdd = async (title: string, columnId: string) => {
    const data = await CardsService.create<TrelloItem>({
      boardId,
      title,
      columnId,
    });

    const column = columns.find((c) => c._id === columnId)!;
    data.column = column;
    column.cards = [...column.cards, data];
    setColumns((prev) => prev.map((c) => (c._id === column._id ? column : c)));
  };

  const onRemoveCard = async (cardId: string) => {
    await CardsService.remove(cardId);
    load();
  };

  const onUpdateCard = async (id: string, partial: Partial<TrelloItem>) => {
    const columnIndex = columns.findIndex((c) =>
      c.cards.find((c) => c._id === id)
    );
    const prevItem = columns[columnIndex]?.cards.find((c) => c._id === id)!;

    const toUpdate: Record<string, any> = {};
    Object.keys(partial).forEach((keyName) => {
      const key = keyName as keyof TrelloItem;
      if (partial[key] === undefined) {
        return;
      }
      if (prevItem[key] !== partial[key]) {
        if (
          key === 'labels' &&
          prevItem.labels.length === partial.labels?.length
        ) {
          return;
        }
        if (key === 'column') {
          if (prevItem.column._id === partial.column?._id) {
            return;
          }
          return (toUpdate.columnId = partial.column?._id);
        }
        toUpdate[key] = partial[key];
      }
    });

    if (!Object.keys(toUpdate).length) {
      return;
    }

    await CardsService.edit(id, toUpdate).then(() => {
      // enqueueSnackbar('Card updated', {
      //   variant: 'success',
      // });
    });
    // .finally(load);
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  useEffect(() => {
    columns.forEach((column, columnIndex) => {
      if (column.position !== columnIndex) {
        ColumnsService.edit(column._id, { position: columnIndex });
      }
      column.cards.forEach((card, cardIndex) => {
        if (card.position !== cardIndex) {
          CardsService.edit(card._id, { boardId, position: cardIndex });
        }
      });
    });
  }, [columns]);

  useEffect(() => {
    if (!prevBoard || !board) {
      return;
    }
    const toUpdate: Record<string, any> = {};
    if (board.title !== prevBoard.title) {
      toUpdate.title = board.title;
    }
    if (board.gridStep !== prevBoard.gridStep) {
      toUpdate.title = board.gridStep;
    }
    if (!Object.keys(toUpdate).length) {
      return;
    }
    BoardsService.edit(boardId!, toUpdate).then(() => {
      // enqueueSnackbar('Board updated', {
      //   variant: 'success',
      // });
    });
  }, [board]);

  return (
    <Box
      sx={{
        px: '20px',
        pb: '20px',
        overflow: 'auto',
        height: 'calc(100vh - 180px)',
      }}
    >
      {!!board && (
        <Button sx={{ mb: 3 }} variant="contained" onClick={handleOpenSettings}>
          Board settings
        </Button>
      )}
      {!columns.length && !loading && (
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography fontWeight="bold" variant="h5" textAlign="center">
            No columns here. Create a new one
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              error={!!errors.title}
              disabled={loadingAdd}
              sx={{ width: '250px' }}
              helperText={errors.title?.message}
              {...register('title')}
              onKeyDown={onAddColumn}
              placeholder="Column name"
            />
            <LoadingButton
              loading={loadingAdd}
              onClick={handleAddColumn}
              variant="contained"
            >
              Create
            </LoadingButton>
          </Stack>
        </Stack>
      )}
      <Stack direction="row" spacing={3}>
        {loading && (
          <>
            <Skeleton
              variant="rounded"
              sx={{ minWidth: '300px' }}
              width={300}
              height={500}
            />
            <Skeleton
              variant="rounded"
              sx={{ minWidth: '300px' }}
              width={300}
              height={500}
            />
            <Skeleton
              variant="rounded"
              sx={{ minWidth: '300px' }}
              width={300}
              height={500}
            />
          </>
        )}
        {columns.map((col, index) => (
          <Stack key={col.title}>
            <DropWrapper onDrop={onDrop} columnId={col._id}>
              <Column
                onCardAdd={onCardAdd}
                column={col}
                moveColumn={moveColumn}
                onRemove={handleRemoveColumn}
                index={index}
              >
                {col.loading && (
                  <>
                    <Skeleton
                      variant="rounded"
                      sx={{ backgroundColor: '#f5f5f5' }}
                      height={70}
                    />
                    <Skeleton
                      variant="rounded"
                      sx={{ backgroundColor: '#f5f5f5' }}
                      height={70}
                    />
                  </>
                )}
                {col.cards.map((item, idx) => (
                  <TrelloCard
                    key={item._id}
                    item={item}
                    columns={columns}
                    index={idx}
                    moveItem={moveItem}
                    column={col}
                    onRemove={() => onRemoveCard(item._id)}
                    onUpdate={(partial) => onUpdateCard(item._id, partial)}
                  />
                ))}
              </Column>
            </DropWrapper>
          </Stack>
        ))}
        {!loading && !!columns.length && (
          <TextField
            sx={{ minWidth: '200px' }}
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register('title')}
            onKeyDown={onAddColumn}
            placeholder="Add colunn"
          />
        )}
      </Stack>
      {!!board && (
        <BoardSettingsModal
          board={board}
          open={openSettings}
          onClose={handleCloseSettings}
          onUpdate={(partial) =>
            setBoard((prev) => ({ ...(prev as TrelloBoard), ...partial }))
          }
        />
      )}
    </Box>
  );
};

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
});

export default ColumnView;
