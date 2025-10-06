"use client";

import { FileText, Trash2 } from "lucide-react";
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
import { Highlight, HighlightColor } from "@/types";
import { cn } from "@/lib/utils";

interface HighlightSidebarProps {
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
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
  selectedColor,
  onColorChange,
}: HighlightSidebarProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
                    <div
                      className="text-sm p-2 rounded-md border"
                      style={{
                        backgroundColor: highlight.color,
                        opacity: 0.4,
                      }}
                    >
                      <p className="text-foreground line-clamp-3 font-medium">
                        {highlight.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Page {highlight.pageNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(highlight.timestamp)}
                      </span>
                    </div>
                  </div>

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
