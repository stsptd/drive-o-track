
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Suspense, useState } from 'react';
import TrackBuilder from './TrackBuilder';
import Car from './Car';
import LoadingScreen from './LoadingScreen';
import GameUI from './GameUI';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from './ErrorBoundary';

const Game = () => {
  const [isBuilding, setIsBuilding] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const handleModeToggle = () => {
    setIsBuilding(!isBuilding);
    toast({
      title: isBuilding ? "Test Drive Mode" : "Edit Track Mode",
      description: isBuilding ? "Drive around your track!" : "Build your racing track",
    });
  };

  const handleStartRace = () => {
    setHasStarted(true);
    toast({
      title: "Race Started!",
      description: "Use arrow keys or WASD to drive",
    });
  };

  return (
    <div className="w-full h-screen relative bg-neutral-950">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas 
            shadows 
            camera={{ position: [0, 5, 10], fov: 50 }}
            gl={{ alpha: false }} // Disable alpha for better performance
          >
            <color attach="background" args={['#202020']} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
            />
            <Environment preset="sunset" />
            <fog attach="fog" args={['#202020', 5, 30]} />
            
            <Physics 
              defaultContactMaterial={{ 
                friction: 0.2,
                restitution: 0.1
              }}
            >
              {isBuilding ? (
                <TrackBuilder />
              ) : (
                hasStarted && <Car position={[0, 0.5, 0]} />
              )}
            </Physics>
            <OrbitControls
              makeDefault
              enableDamping={false}
              maxPolarAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>

      <GameUI isBuilding={isBuilding}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <Button
            onClick={handleModeToggle}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          >
            {isBuilding ? 'Test Drive' : 'Edit Track'}
          </Button>
          {!isBuilding && (
            <Button
              onClick={handleStartRace}
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
