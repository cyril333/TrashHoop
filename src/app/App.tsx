import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ScoreProvider } from "./contexts/ScoreContext";

export default function App() {
  return (
    <ScoreProvider>
      <RouterProvider router={router} />
    </ScoreProvider>
  );
}