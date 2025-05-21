import { useMemo, useCallback } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useZoom } from "@/hooks/use-zoom";

const Header = () => {
  const { zoom, setZoom } = useZoom();

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.25, 2));
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  }, [zoom]);

  const options: {
    title: string;
    subOptions: {
      title: string;
      keys?: string[];
      action?: () => void;
    }[];
  }[] = useMemo(
    () => [
      {
        title: "File",
        subOptions: [
          {
            title: "Open",
          },
          {
            title: "Save",
          },
          {
            title: "Save As",
          },
          {
            title: "Exit",
          },
        ],
      },
      {
        title: "Edit",
        subOptions: [
          {
            title: "Undo",
            keys: ["Ctrl", "Z"],
          },
          {
            title: "Redo",
            keys: ["Ctrl", "Y"],
          },
          {
            title: "Cut",
            keys: ["Ctrl", "X"],
          },
          {
            title: "Copy",
            keys: ["Ctrl", "C"],
          },
          {
            title: "Paste",
            keys: ["Ctrl", "P"],
          },
        ],
      },
      {
        title: "View",
        subOptions: [
          {
            title: "Zoom In",
            keys: ["Ctrl", "+"],
            action: handleZoomIn,
          },
          {
            title: "Zoom Out",
            keys: ["Ctrl", "-"],
            action: handleZoomOut,
          },
        ],
      },
    ],
    [handleZoomIn, handleZoomOut]
  );
  return (
    <nav className="flex gap-x-3 items-center border-b border-b-gray-200">
      {options.map((option) => {
        return (
          <DropdownMenu key={option.title}>
            <DropdownMenuTrigger className="hover:bg-gray-200 delay-100 transition-all p-1 text-sm rounded-sm cursor-pointer focus:border-none">
              {option.title}
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {option.subOptions.map((subOption) => {
                return (
                  <DropdownMenuItem
                    key={subOption.title}
                    className="cursor-pointer flex-row justify-between items-center"
                    onClick={subOption.action}
                  >
                    <p>{subOption.title}</p>

                    {subOption.keys && (
                      <p className="text-[10px] text-gray-700">
                        {subOption.keys.join("+")}
                      </p>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </nav>
  );
};

export default Header;
