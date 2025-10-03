// hooks/sortable/useSortable.ts (ojo al nombre del archivo/carpeta)
import { useCallback, useState } from 'react';
import { DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { IUseSortable, SortableItemData, UseSortableOptions } from './types/types';

export const useSortable = ({
  items: initialItems,
  onReorder,
}: UseSortableOptions): IUseSortable => {
  const [items, setItems] = useState<SortableItemData[]>(initialItems);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(items, oldIndex, newIndex);
      setItems(reordered);
      onReorder(reordered.map((i) => i.id));
    },
    [items, onReorder]
  );

  return { sensors, handleDragEnd, items, setItems };
};
