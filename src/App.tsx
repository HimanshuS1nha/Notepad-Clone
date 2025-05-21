import Header from "@/components/header";

import { useZoom } from "./hooks/use-zoom";

const App = () => {
  const zoom = useZoom((state) => state.zoom);
  return (
    <main
      className="p-1 flex flex-col gap-y-1"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
    >
      <Header />
    </main>
  );
};

export default App;
