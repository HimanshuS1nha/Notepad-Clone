import { create } from "zustand";

type UseZoomType = {
  zoom: number;
  setZoom: (zoom: number) => void;
};

export const useZoom = create<UseZoomType>((set) => ({
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}));
