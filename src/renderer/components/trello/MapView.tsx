import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CardModal from './CardModal';
import { TrelloBoard, TrelloItem } from '../../interfaces';
import BoardSettingsModal from './BoardSettingsModal';
import Loader from '../Loader';
import useModal from '../../helpers/hooks/useModal';
import { useDebounce } from '../../helpers/hooks/useDebounce';
import { usePrevious } from '../../helpers/hooks/usePrevious';
import BoardsService from '../../services/trello/BoardsService';
import CardsService from '../../services/trello/CardsService';

const roundToGridSize = (cord: number, gridSize: number) => {
  return Math.round(cord / gridSize) * gridSize || gridSize;
};

interface Params {
  gridStep: number;
  onSelect: (id: string) => void;
  onMoveCard: (id: string, coordinates: { x: number; y: number }) => void;
  onSelectId: (id: string) => void;
  onSelectAllId: (ids: string[]) => void;
  onJoinFromThisToOther: (id: string) => void;
  onJoinFromOtherToThis: (id: string) => void;
  onUnJoinOther: (id: string) => void;
}

const build = (
  el: SVGSVGElement,
  data: TrelloItem[],
  selectedIds: string[],
  menuRef: HTMLDivElement,
  params: Params
) => {
  const {
    gridStep,
    onSelectId,
    onSelect,
    onMoveCard,
    onSelectAllId,
    onUnJoinOther,
    onJoinFromThisToOther,
    onJoinFromOtherToThis,
  } = params;

  const svg = d3.select(el);
  const g = svg.append('g');

  const copy: TrelloItem[] = JSON.parse(JSON.stringify(data));

  const WIDTH = el.getBoundingClientRect().width;
  const HEIGHT = el.getBoundingClientRect().height;

  const createDiv = (title: string, handler: () => void) => {
    const div = document.createElement('div');
    div.innerHTML = title;
    div.onclick = handler;
    div.className = 'menu-item';
    return div;
  };

  const renderGrid = (width: number, height: number) => {
    for (let row = 0; row < height * 5; row += gridStep) {
      g.append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', row)
        .attr('x2', width * 5)
        .attr('y2', row);
    }
    for (let column = 0; column < width * 5; column += gridStep) {
      g.append('line')
        .classed('grid-line', true)
        .attr('x1', column)
        .attr('y1', 0)
        .attr('x2', column)
        .attr('y2', height * 5);
    }
  };

  const renderArrows = () => {
    g.selectAll('defs').remove();
    g.selectAll('path').remove();

    copy.forEach((el) => {
      el.to?.forEach((to) => {
        const c = copy.find((c) => c._id === to);
        if (c) {
          const markerBoxWidth = 20;
          const markerBoxHeight = 20;
          const refX = markerBoxWidth / 2;
          const refY = markerBoxHeight / 2;
          const markerWidth = markerBoxWidth / 2;
          const arrowPoints = [
            [0, 0],
            [0, 20],
            [20, 10],
          ];

          const circles = [
            { x: el.coordinates.x, y: el.coordinates.y, r: 30 },
            { x: c.coordinates.x, y: c.coordinates.y, r: 30 },
          ];

          const [circle1, circle2] = circles;

          const linkSource = {
            x: circle1.x,
            y: circle1.y,
          };

          let link;
          let linkTarget;
          let linkFn = 'linkVertical';
          if (Math.abs(circle1.x - circle2.x) < gridStep) {
            if (circle1.y > circle2.y) {
              linkTarget = {
                x: circle2.x,
                y: circle2.y + circle1.r + markerWidth,
              };
            } else {
              linkTarget = {
                x: circle2.x,
                y: circle2.y - circle1.r - markerWidth,
              };
            }
          } else if (circle1.x > circle2.x) {
            linkTarget = {
              x: circle2.x + circle2.r + markerWidth,
              y: circle2.y,
            };
            linkFn = 'linkHorizontal';
          } else {
            linkTarget = {
              x: circle2.x - circle2.r - markerWidth,
              y: circle2.y,
            };
            linkFn = 'linkHorizontal';
          }

          // @ts-ignore
          link = d3[linkFn]()
            .x((d: any) => d.x)
            .y((d: any) => d.y)({
            source: linkSource,
            target: linkTarget,
          });

          g.append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            // @ts-ignore
            .attr('d', d3.line()(arrowPoints))
            .attr('stroke', 'black');

          g.append('path')
            .attr('d', link)
            .attr('marker-end', 'url(#arrow)')
            .attr('stroke', 'black')
            .attr('fill', 'none');
        }
      });
    });
  };

  const renderCircles = () => {
    d3.selectAll('circle').remove();

    copy.forEach((el) => {
      const newCx = roundToGridSize(el.coordinates.x, gridStep);
      const newCy = roundToGridSize(el.coordinates.y, gridStep);

      onMoveCard(el._id, { x: newCx, y: newCy });

      g.append('circle')
        .attr('cx', newCx)
        .attr('cy', newCy)
        .attr('r', 30)
        .attr('id', `c${el._id}`)
        .style('stroke-width', 3)
        .style('stroke', () =>
          selectedIds.includes(el._id) ? 'red' : 'transparent'
        )
        .style('fill', 'yellow')
        .on('click', function () {
          onSelect(el._id);
        })
        .on('contextmenu', function (e) {
          e.preventDefault();

          d3.select(menuRef)
            .style('left', e.clientX + 'px')
            .style('top', e.clientY + 'px')
            .style('display', 'block');

          const openDiv = createDiv('Open', () => {
            onSelect(el._id);
          });
          const selectDiv = createDiv(
            selectedIds.includes(el._id) ? 'Unselect' : 'Select',
            () => {
              onSelectId(el._id);
            }
          );

          menuRef.appendChild(openDiv);
          menuRef.appendChild(selectDiv);

          if (selectedIds.length > 1 && selectedIds.includes(el._id)) {
            const joinFromOtherDiv = createDiv(
              'Join from other to this',
              () => {
                onJoinFromOtherToThis(el._id);
              }
            );
            const joinFromThisToOtherDiv = createDiv(
              'Join from this to other',
              () => {
                onJoinFromThisToOther(el._id);
              }
            );

            menuRef.appendChild(joinFromOtherDiv);
            menuRef.appendChild(joinFromThisToOtherDiv);
          }

          if (el.to?.length) {
            const clearToOtherDiv = createDiv('Unjoin other', () => {
              onUnJoinOther(el._id);
            });
            menuRef.appendChild(clearToOtherDiv);
          }

          const selectAllDiv = createDiv(
            data.length !== selectedIds.length ? 'Select all' : 'Deselect All',
            () => {
              if (data.length !== selectedIds.length) {
                onSelectAllId(data.map((c) => c._id));
              } else {
                onSelectAllId([]);
              }
            }
          );
          menuRef.appendChild(selectAllDiv);

          const { bottom, top } = menuRef.getBoundingClientRect();
          if (bottom > window.innerHeight - 20) {
            const diff = bottom - window.innerHeight + 20;
            d3.select(menuRef).style('top', top - diff + 'px');
          }

          document.body.onclick = () => {
            menuRef.innerHTML = '';
            menuRef.style.display = 'none';
            document.body.onclick = () => {};
          };
        });

      const dragHandler = d3
        .drag()
        .on('drag', function (event) {
          d3.select(this).attr('cx', event.x).attr('cy', event.y);
          const indx = copy.findIndex((c) => c._id === el._id);
          copy[indx].coordinates.x = event.x;
          copy[indx].coordinates.y = event.y;
          renderArrows();
        })
        .on('end', function () {
          const thisEl = d3.select(this);

          const newCx = roundToGridSize(+thisEl.attr('cx'), gridStep);
          const newCy = roundToGridSize(+thisEl.attr('cy'), gridStep);

          onMoveCard(el._id, { x: newCx, y: newCy });

          const indx = copy.findIndex((c) => c._id === el._id);
          copy[indx].coordinates.x = newCx;
          copy[indx].coordinates.y = newCy;

          thisEl
            .transition()
            .duration(100)
            .attr('cx', newCx)
            .attr('cy', newCy)
            .on('end', () => {
              renderArrows();
              renderCircles();
            });
        });

      dragHandler(g.select(`#c${el._id}`));
    });
  };

  const handleZoom = (e: any) => g.attr('transform', e.transform);

  const zoom = d3
    .zoom()
    .scaleExtent([0.2, 3])
    .translateExtent([
      [0, 0],
      [WIDTH * 5, HEIGHT * 5],
    ])
    .on('zoom', handleZoom);

  // @ts-ignore
  svg.call(zoom);

  renderGrid(WIDTH, HEIGHT);
  renderArrows();
  renderCircles();

  svg.on('contextmenu', (e) => {
    if (e.target.tagName === 'circle') {
      return;
    }
    e.preventDefault();

    d3.select(menuRef)
      .style('left', e.clientX + 'px')
      .style('top', e.clientY + 'px')
      .style('display', 'block');

    const selectDiv = createDiv(
      data.length !== selectedIds.length ? 'Select all' : 'Deselect All',
      () => {
        if (data.length !== selectedIds.length) {
          onSelectAllId(data.map((c) => c._id));
        } else {
          onSelectAllId([]);
        }
      }
    );
    menuRef.appendChild(selectDiv);

    const { bottom, top } = menuRef.getBoundingClientRect();
    if (bottom > window.innerHeight - 20) {
      const diff = bottom - window.innerHeight + 20;
      d3.select(menuRef).style('top', top - diff + 'px');
    }

    document.body.onclick = () => {
      menuRef.innerHTML = '';
      menuRef.style.display = 'none';
      document.body.onclick = () => {};
    };
  });
};

const MapView = () => {
  const ref = useRef<SVGSVGElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<TrelloBoard | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [cards, setCards] = useState<TrelloItem[]>([]);
  const [updatedCards, setUpdatesCards] = useState<TrelloItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const { id: boardId } = useParams<{ id: string }>();
  const [open, handleOpen, handleClose] = useModal();
  const [openSettings, handleOpenSettings, handleCloseSettings] = useModal();

  const gridStep = useDebounce(board?.gridStep, 1000);
  const prevCards = usePrevious(updatedCards);
  const prevBoard = usePrevious(board);

  useEffect(() => {
    if (!gridStep || !ref.current || loading || !menuRef.current) {
      return;
    }
    build(ref.current, cards, selectedIds, menuRef.current, {
      gridStep,
      onSelect: (id) => setSelected(id),
      onMoveCard: (id, coordinates) => {
        setUpdatesCards((prev) =>
          prev.map((el) =>
            el._id === id
              ? { ...el, coordinates, prevCoordinates: el.coordinates }
              : el
          )
        );
      },
      onSelectId: (id: string) =>
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        ),
      onSelectAllId: (ids) => setSelectedIds(ids),
      onJoinFromOtherToThis: (id) => {
        setCards((prev) =>
          prev.map((c) =>
            c._id === id || !selectedIds.includes(c._id)
              ? c
              : { ...c, to: [id] }
          )
        );
        setUpdatesCards((prev) =>
          prev.map((c) =>
            c._id === id || !selectedIds.includes(c._id)
              ? c
              : { ...c, to: [id] }
          )
        );
      },
      onJoinFromThisToOther: (id) => {
        setCards((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, to: selectedIds.filter((i) => i !== id) } : c
          )
        );
        setUpdatesCards((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, to: selectedIds.filter((i) => i !== id) } : c
          )
        );
      },
      onUnJoinOther: (id) => {
        setCards((prev) =>
          prev.map((c) => (c._id === id ? { ...c, to: [] } : c))
        );
        setUpdatesCards((prev) =>
          prev.map((c) => (c._id === id ? { ...c, to: [] } : c))
        );
      },
    });

    return () => {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();
    };
  }, [gridStep, cards, loading, selectedIds]);

  const handleRemove = async () => {
    await CardsService.remove(selectedItem?._id!);
    setCards(updatedCards.filter((c) => c._id !== selectedItem?._id!));
    handleClose();
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const board = await BoardsService.getById<TrelloBoard>(boardId!);
      setBoard(board);

      const data = await CardsService.getByBoardId<TrelloItem[]>(boardId!);
      setCards(data);
      setUpdatesCards(
        data.map((c) => ({ ...c, prevCoordinates: c.coordinates }))
      );
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!prevBoard || !board) {
      return;
    }
    const toUpdate: Record<string, any> = {};
    if (board.title !== prevBoard.title) {
      toUpdate.title = board.title;
    }
    if (board.gridStep !== prevBoard.gridStep) {
      toUpdate.gridStep = board.gridStep;
    }
    if (!Object.keys(toUpdate).length) {
      return;
    }
    BoardsService.edit(boardId!, toUpdate);
  }, [board]);

  useEffect(() => {
    updatedCards.forEach((c, index) => {
      const prevCard = prevCards[index]!;
      if (!prevCard) {
        return;
      }

      const toUpdate: Record<string, any> = {};
      if (c.title !== prevCard.title) {
        toUpdate.title = c.title;
      }
      if (c.description !== prevCard.description) {
        toUpdate.description = c.description;
      }
      if (
        c.coordinates.x !== prevCard.coordinates.x ||
        c.coordinates.y !== prevCard.coordinates.y
      ) {
        toUpdate.coordinates = c.coordinates;
      }
      if (c.column._id !== prevCard.column._id) {
        toUpdate.columnId = c.column._id;
      }
      if (c.labels.length !== prevCard.labels.length) {
        toUpdate.labels = c.labels;
      }
      if (c.to?.length !== prevCard.to?.length) {
        toUpdate.to = c.to;
      }

      if (!Object.keys(toUpdate).length) {
        return;
      }

      CardsService.edit(c._id, toUpdate);
    });
  }, [updatedCards]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    handleOpen();
  }, [selected]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
    }
  }, [open]);

  const selectedItem = updatedCards.find((c) => c._id === selected);

  if (loading) {
    return (
      <Stack
        sx={{ height: 'calc(100vh - 200px)' }}
        alignItems="center"
        justifyContent="center"
      >
        <Loader />
      </Stack>
    );
  }

  return (
    <Box className="svg" sx={{ ml: 3 }}>
      <Stack
        spacing={1}
        sx={{
          display: 'none',
          p: 1,
          position: 'absolute',
          backgroundColor: '#494949',
        }}
        ref={menuRef}
      ></Stack>
      {!!board && (
        <Button sx={{ mb: 3 }} variant="contained" onClick={handleOpenSettings}>
          Board settings
        </Button>
      )}
      <svg ref={ref}></svg>
      {!!selectedItem && !!board && (
        <CardModal
          columns={board.columns}
          onRemove={handleRemove}
          onUpdate={(partial) => {
            setUpdatesCards((prev) =>
              prev.map((el) =>
                el._id === selectedItem._id ? { ...el, ...partial } : el
              )
            );
          }}
          open={open}
          onClose={handleClose}
          item={selectedItem}
        />
      )}
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

export default MapView;
