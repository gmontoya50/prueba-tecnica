// types/useSortable.ts
import type { DragEndEvent, SensorDescriptor, SensorOptions } from '@dnd-kit/core';

export interface SortableItemData {
  id: string;
  text: string;
}

export interface IUseSortable {
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  items: SortableItemData[];
  setItems: React.Dispatch<React.SetStateAction<SortableItemData[]>>;
}
export interface UseSortableOptions {
  items: SortableItemData[];
  onReorder: (orderedIds: string[]) => void;
}
