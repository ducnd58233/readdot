"use client";

import { useState } from "react";
import { FileText, Trash2, MessageSquare, Edit3, Save, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Highlight, HighlightColor } from "@/types";
import { cn } from "@/lib/utils";

interface HighlightSidebarProps {
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onHighlightClick: (highlight: Highlight) => void;
  selectedColor: HighlightColor;
  onColorChange: (color: HighlightColor) => void;
}

const COLORS: { value: HighlightColor; name: string }[] = [
  { value: "#FFEB3B", name: "Yellow" },
  { value: "#4CAF50", name: "Green" },
  { value: "#2196F3", name: "Blue" },
  { value: "#FF5722", name: "Orange" },
  { value: "#9C27B0", name: "Purple" },
];

export function HighlightSidebar({
  highlights,
  onDeleteHighlight,
  onUpdateNote,
  onHighlightClick,
  selectedColor,
  onColorChange,
}: HighlightSidebarProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartEditNote = (highlight: Highlight) => {
    setEditingNoteId(highlight.id);
    setNoteText(highlight.note || "");
  };

  const handleSaveNote = (highlightId: string) => {
    onUpdateNote(highlightId, noteText.trim());
    setEditingNoteId(null);
    setNoteText("");
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setNoteText("");
  };

  return (
    <Card className="w-80 h-full rounded-none border-l border-t-0 border-r-0 border-b-0">
      <CardHeader className="pb-4">
        <CardTitle>Highlights</CardTitle>
        <CardDescription>
          {highlights.length} highlight{highlights.length !== 1 ? "s" : ""}{" "}
          saved
        </CardDescription>
      </CardHeader>

      <Separator />

      {/* Color Picker */}
      <CardContent className="pt-4 pb-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Highlight Color</label>
          <div className="flex gap-2">
            {COLORS.map(({ value, name }) => (
              <Button
                key={value}
                variant="outline"
                size="icon"
                onClick={() => onColorChange(value)}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-all hover:scale-110",
                  selectedColor === value &&
                    "ring-2 ring-offset-2 ring-primary scale-110"
                )}
                style={{ backgroundColor: value }}
                title={name}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <Separator />

      {/* Highlights List */}
      <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
        {highlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No highlights yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Select text in the PDF to create highlights
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="p-4 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* Highlighted Text - Clickable */}
                    <div
                      onClick={() => onHighlightClick(highlight)}
                      className="text-sm p-2 rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: highlight.color,
                        opacity: 0.4,
                      }}
                      title="Click to scroll to this highlight"
                    >
                      <p className="text-foreground line-clamp-3 font-medium">
                        {highlight.text}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-secondary/80"
                        onClick={() => onHighlightClick(highlight)}
                        title="Click to jump to page"
                      >
                        Page {highlight.pageNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(highlight.timestamp)}
                      </span>
                    </div>

                    {/* Note Section */}
                    {editingNoteId === highlight.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a note or comment..."
                          className="min-h-[80px] text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNote(highlight.id)}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : highlight.note ? (
                      <div
                        className="p-2 bg-blue-50 dark:bg-blue-950 border-l-2 border-blue-400 rounded text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => handleStartEditNote(highlight)}
                        title="Click to edit note"
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="flex-1 text-foreground">
                            {highlight.note}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEditNote(highlight)}
                        className="h-7 text-xs"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Add note
                      </Button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteHighlight(highlight.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete highlight</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}

HighlightSidebar.displayName = "HighlightSidebar";

export default HighlightSidebar;
