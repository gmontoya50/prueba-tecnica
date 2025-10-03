import { ReactNode } from 'react';
import { SortableItemData } from '../../../hooks/sorteable/types/types';

export interface ISortableContextValue {
  items: SortableItemData[];
  setItems: React.Dispatch<React.SetStateAction<SortableItemData[]>>;
  handleDragEnd: (event: any) => void;
}

export interface ISortableContextProps {
  children: ReactNode;
}
