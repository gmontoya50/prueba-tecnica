// src/context/sortable/SortableItemsContext.tsx
import React, { createContext, useContext } from 'react';
import { SortableItemData } from '../../hooks/sorteable/types/types';
import { useSortable } from '../../hooks/sorteable/useSortable';


export interface SortableProviderProps {
  children: React.ReactNode;
  items: SortableItemData[]; // items actuales
  onReorder: (orderedIds: string[]) => void; // qué hacer con el nuevo orden
}

export interface ISortableContextValue {
  items: SortableItemData[];
  setItems: React.Dispatch<React.SetStateAction<SortableItemData[]>>;
  handleDragEnd: (event: import('@dnd-kit/core').DragEndEvent) => void;
}

const SortableItemsContext = createContext<ISortableContextValue | null>(null);

export const SortableItemsProvider = ({ children, items, onReorder }: SortableProviderProps) => {
  const value = useSortable({ items, onReorder });

  return <SortableItemsContext.Provider value={value}>{children}</SortableItemsContext.Provider>;
};

export const useSortableItems = (): ISortableContextValue => {
  const ctx = useContext(SortableItemsContext);
  if (!ctx) throw new Error('useSortableItems debe usarse dentro de <SortableItemsProvider>');
  return ctx;
};
