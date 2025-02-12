
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Suspense, useState } from 'react';
import TrackBuilder from './TrackBuilder';
import Car from './Car';
import LoadingScreen from './LoadingScreen';
import GameUI from './GameUI';
import { Button } from '@/components/ui/button';

const Game = () => {
  const [isBuilding, setIsBuilding] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="w-full h-screen relative bg-neutral-950">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Physics>
            {isBuilding ? (
              <TrackBuilder />
            ) : (
              hasStarted && <Car position={[0, 0.5, 0]} />
            )}
          </Physics>
          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      <GameUI isBuilding={isBuilding}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <Button
            onClick={() => setIsBuilding(!isBuilding)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          >
            {isBuilding ? 'Test Drive' : 'Edit Track'}
          </Button>
          {!isBuilding && (
            <Button
              onClick={() => setHasStarted(true)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
              disabled={hasStarted}
            >
              Start Race
            </Button>
          )}
        </div>
      </GameUI>
    </div>
  );
};

export default Game;
