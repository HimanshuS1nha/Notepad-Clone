import { useRef, useEffect } from "react";

import Header from "@/components/header";

import { useZoom } from "./hooks/use-zoom";
import { useEditor } from "./hooks/use-editor";

import { debounce } from "./helpers/debounce";

const App = () => {
  const zoom = useZoom((state) => state.zoom);

  const presentText = useEditor((state) => state.presentText);
  const setText = useEditor((state) => state.setText);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedUpdate = useRef(
    debounce((value: string) => {
      setText(value);
    }, 500)
  ).current;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = presentText;
    }
  }, [presentText]);
  return (
    <main
      className="p-1 flex flex-col gap-y-1"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
    >
      <Header />

      <textarea
        className="min-w-[98dvw] min-h-[92dvh] border-none focus-visible:border-none focus-visible:ring-0 shadow-none resize-none text-sm outline-none"
        autoFocus
        draggable={false}
        onChange={(e) => debouncedUpdate(e.target.value)}
        ref={textAreaRef}
      />
    </main>
  );
};

export default App;
