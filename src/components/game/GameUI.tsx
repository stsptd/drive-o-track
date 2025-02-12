
import { ReactNode } from 'react';

const GameUI = ({
  children,
  isBuilding,
}: {
  children: ReactNode;
  isBuilding: boolean;
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-white/80 text-xl font-medium backdrop-blur-md bg-white/10 px-4 py-2 rounded-full">
          {isBuilding ? 'Track Builder' : 'Test Drive'}
        </h1>
      </div>
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
};

export default GameUI;
