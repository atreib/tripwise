"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Trash2Icon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import type { BackpackItem } from "@/lib/backpack-service/types";
import { addItemAction, updateItemAction, deleteItemAction } from "../actions";

type Props = {
  backpackId: string;
  initialItems: BackpackItem[];
};

export function BackpackItems({ backpackId, initialItems }: Props) {
  const [items, setItems] = useState<BackpackItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  async function handleAddItem() {
    const text = newItemText.trim();
    if (!text) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: BackpackItem = {
      id: tempId,
      backpackId,
      item: text,
    };
    setItems((prev) => [...prev, optimisticItem]);
    setNewItemText("");

    try {
      const res = await addItemAction({ backpackId, item: text });
      if (res?.serverError) throw new Error(res.serverError);
      if (res?.data) {
        // Replace optimistic item with real one
        setItems((prev) =>
          prev.map((item) => (item.id === tempId ? res.data! : item))
        );
      }
    } catch (err) {
      // Rollback on error
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      console.error("Failed to add item:", err);
    }
  }

  async function handleUpdateItem(itemId: string, newText: string) {
    const text = newText.trim();
    if (!text) return;

    // Optimistic update
    const oldItems = items;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, item: text } : item))
    );
    setEditingId(null);

    try {
      const res = await updateItemAction({ id: itemId, item: text });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      // Rollback on error
      setItems(oldItems);
      console.error("Failed to update item:", err);
    }
  }

  async function handleDeleteItem(itemId: string) {
    // Optimistic update
    const oldItems = items;
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      const res = await deleteItemAction({ id: itemId });
      if (res?.serverError) throw new Error(res.serverError);
    } catch (err) {
      // Rollback on error
      setItems(oldItems);
      console.error("Failed to delete item:", err);
    }
  }

  function startEditing(item: BackpackItem) {
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
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new item */}
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

          {/* Items list */}
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No items yet. Add your first item above!
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  {editingId === item.id ? (
                    <>
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateItem(item.id, editingText);
                          } else if (e.key === "Escape") {
                            cancelEditing();
                          }
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleUpdateItem(item.id, editingText)}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{item.item}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(item)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
