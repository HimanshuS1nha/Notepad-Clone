import { create } from "zustand";

type UseEditorType = {
  presentText: string;
  pastTexts: string[];
  futureTexts: string[];
  setText: (text: string) => void;
  undo: () => void;
  redo: () => void;
  filePath: string | null;
  setFilePath: (filePath: string | null) => void;
};

export const useEditor = create<UseEditorType>((set, get) => ({
  presentText: "",
  pastTexts: [],
  futureTexts: [],
  setText: (text) => {
    set((prev) => ({
      pastTexts: [...prev.pastTexts, prev.presentText],
      presentText: text,
    }));
  },
  undo: () => {
    const { pastTexts, presentText, futureTexts } = get();

    if (pastTexts.length === 0) {
      return;
    }

    const previousText = pastTexts[pastTexts.length - 1];

    set({
      presentText: previousText,
      pastTexts: pastTexts.slice(0, -1),
      futureTexts: [presentText, ...futureTexts],
    });
  },
  redo: () => {
    const { pastTexts, presentText, futureTexts } = get();

    if (futureTexts.length === 0) {
      return;
    }

    const nextText = futureTexts[0];

    set({
      presentText: nextText,
      futureTexts: futureTexts.slice(1),
      pastTexts: [...pastTexts, presentText],
    });
  },
  filePath: null,
  setFilePath: (filePath) => set({ filePath }),
}));
