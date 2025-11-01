"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  CheckIcon,
  XIcon,
  GripVerticalIcon,
} from "lucide-react";
import type { TripBackpackItem } from "@/lib/trips-service/types";
import {
  addTripBackpackItemAction,
  updateTripBackpackItemAction,
  deleteTripBackpackItemAction,
  reorderTripBackpackItemsAction,
  togglePackedAction,
} from "./actions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  tripId: string;
  initialItems: TripBackpackItem[];
};

type SortableItemProps = {
  item: TripBackpackItem;
  isEditing: boolean;
  editingText: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdateItem: (id: string, text: string) => void;
  onDeleteItem: (id: string) => void;
  onEditTextChange: (text: string) => void;
  onTogglePacked: (id: string, packed: boolean) => void;
};

function SortableItem({
  item,
  isEditing,
  editingText,
  onStartEdit,
  onCancelEdit,
  onUpdateItem,
  onDeleteItem,
  onEditTextChange,
  onTogglePacked,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
    >
      {!isEditing && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVerticalIcon className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {!isEditing && (
        <Checkbox
          checked={item.packed}
          onCheckedChange={(checked) =>
            onTogglePacked(item.id, checked === true)
          }
        />
      )}

      {isEditing ? (
        <>
          <Input
            value={editingText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdateItem(item.id, editingText);
              } else if (e.key === "Escape") {
                onCancelEdit();
              }
            }}
            className="flex-1"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onUpdateItem(item.id, editingText)}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onCancelEdit}>
            <XIcon className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          <span
            className={`flex-1 ${
              item.packed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {item.item}
          </span>
          <Button size="icon" variant="ghost" onClick={onStartEdit}>
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeleteItem(item.id)}
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}

export function TripBackpackItems({ tripId, initialItems }: Props) {
  const [items, setItems] = useState<TripBackpackItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleAddItem() {
    const text = newItemText.trim();
    if (!text) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: TripBackpackItem = {
      id: tempId,
      tripId,
      item: text,
      order: items.length,
      packed: false,
    };
    setItems((prev) => [...prev, optimisticItem]);
    setNewItemText("");

    try {
      const res = await addTripBackpackItemAction({ tripId, item: text });
      if (res?.serverError) throw new Error(res.serverError);
      if (res?.data) {
        setItems((prev) =>
          prev.map((item) => (item.id === tempId ? res.data! : item))
        );
      }
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      console.error("Failed to add item:", err);
    }
  }

  async function handleUpdateItem(itemId: string, newText: string) {
    const text = newText.trim();
    if (!text) return;

    const oldItems = items;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, item: text } : item))
    );
    setEditingId(null);

    try {
      const res = await updateTripBackpackItemAction({ id: itemId, item: text });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      setItems(oldItems);
      console.error("Failed to update item:", err);
    }
  }

  async function handleDeleteItem(itemId: string) {
    const oldItems = items;
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      const res = await deleteTripBackpackItemAction({ id: itemId });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      setItems(oldItems);
      console.error("Failed to delete item:", err);
    }
  }

  async function handleTogglePacked(itemId: string, packed: boolean) {
    const oldItems = items;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, packed } : item))
    );

    try {
      const res = await togglePackedAction({ id: itemId, packed });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      setItems(oldItems);
      console.error("Failed to toggle packed:", err);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldItems = items;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    setItems(reorderedItems);

    try {
      const res = await reorderTripBackpackItemsAction({
        tripId,
        items: reorderedItems.map((item) => ({ id: item.id, order: item.order })),
      });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      setItems(oldItems);
      console.error("Failed to reorder items:", err);
    }
  }

  function startEditing(item: TripBackpackItem) {
    setEditingId(item.id);
    setEditingText(item.item);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingText("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Packing List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No items yet. Add your first item below!
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      isEditing={editingId === item.id}
                      editingText={editingText}
                      onStartEdit={() => startEditing(item)}
                      onCancelEdit={cancelEditing}
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
                      onEditTextChange={setEditingText}
                      onTogglePacked={handleTogglePacked}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Add a new item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem();
                }
              }}
            />
            <Button onClick={handleAddItem} size="icon">
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
