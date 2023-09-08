import React from 'react';
import { useDrop } from 'react-dnd';
import { TrelloItem } from '../../interfaces';

interface DropWrapperProps {
  columnId: string;
  children: React.ReactNode;
  onDrop: (item: TrelloItem, name: string) => void;
}

const DropWrapper = ({ onDrop, columnId, children }: DropWrapperProps) => {
  const [{ isOver }, drop] = useDrop<TrelloItem, void, { isOver: boolean }>({
    accept: 'card',
    drop: (item) => {
      onDrop(item, columnId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop}>{React.cloneElement(children as any, { isOver })}</div>
  );
};

export default DropWrapper;
