import { ReactNode } from "react";
import type { Screen } from "@/hooks/useGameState";

interface GameRouterProps {
  screen: Screen;
  screens: Record<Screen, ReactNode>;
}

export const GameRouter = ({ screen, screens }: GameRouterProps) => {
  return <>{screens[screen]}</>;
};
