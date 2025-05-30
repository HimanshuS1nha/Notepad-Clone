import { useMemo, useCallback, useEffect } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "react-hot-toast";
import { exit } from "@tauri-apps/plugin-process";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useZoom } from "@/hooks/use-zoom";
import { useEditor } from "@/hooks/use-editor";

const Header = () => {
  const { zoom, setZoom } = useZoom();

  const presentText = useEditor((state) => state.presentText);
  const setText = useEditor((state) => state.setText);
  const undo = useEditor((state) => state.undo);
  const redo = useEditor((state) => state.redo);
  const filePath = useEditor((state) => state.filePath);
  const setFilePath = useEditor((state) => state.setFilePath);

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.25, 2));
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  }, [zoom]);

  const handleOpenFile = useCallback(async () => {
    try {
      const newFilePath = await open({
        multiple: false,
        filters: [
          {
            name: "Text Files",
            extensions: ["txt", "md"],
          },
        ],
      });

      if (newFilePath) {
        const contents = await readTextFile(newFilePath);
        setFilePath(newFilePath);
        setText(contents);
      }
    } catch {
      toast.error("Some error occured. while opening file");
    }
  }, []);

  const handleSaveAs = useCallback(async () => {
    const filePath = await save({
      defaultPath: `${presentText.split(" ").slice(0, 3).join(" ")}.txt`,
      filters: [
        {
          name: "Text Files",
          extensions: ["txt"],
        },
      ],
    });

    if (filePath) {
      await writeTextFile(filePath, presentText);
      setFilePath(filePath);
      toast.success("File saved successfully");
    }
  }, [presentText]);

  const handleSave = useCallback(async () => {
    if (filePath) {
      await writeTextFile(filePath, presentText);
      toast.success("File saved successfully");
    } else {
      await handleSaveAs();
    }
  }, [filePath, handleSaveAs, presentText]);

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
            action: handleOpenFile,
          },
          {
            title: "Save",
            action: handleSave,
          },
          {
            title: "Save As",
            action: handleSaveAs,
          },
          {
            title: "Exit",
            action: async () => {
              await exit(0);
            },
          },
        ],
      },
      {
        title: "Edit",
        subOptions: [
          {
            title: "Undo",
            keys: ["Ctrl", "Z"],
            action: undo,
          },
          {
            title: "Redo",
            keys: ["Ctrl", "Y"],
            action: redo,
          },
          {
            title: "Cut",
            keys: ["Ctrl", "X"],
            action: async () => {
              await navigator.clipboard.writeText(presentText);
              setText("");
            },
          },
          {
            title: "Copy",
            keys: ["Ctrl", "C"],
            action: async () => {
              await navigator.clipboard.writeText(presentText);
            },
          },
          {
            title: "Paste",
            keys: ["Ctrl", "P"],
            action: async () => {
              const clipboardText = await navigator.clipboard.readText();
              setText(presentText + clipboardText);
            },
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
    [
      handleZoomIn,
      handleZoomOut,
      presentText,
      handleOpenFile,
      handleSave,
      handleSaveAs,
    ]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === "+") {
          handleZoomIn();
        } else if (e.key === "-") {
          handleZoomOut();
        } else if (e.key === "o") {
          handleOpenFile();
        } else if (e.key === "s") {
          handleSave();
        }
      }
    },
    [handleZoomIn, handleZoomOut, handleOpenFile, handleSave]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
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
