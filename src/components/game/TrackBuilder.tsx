
import { useState, useRef } from 'react';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import { TrackPiece } from './TrackPiece';

const TrackBuilder = () => {
  console.log('TrackBuilder: Component rendering');
  
  const [pieces, setPieces] = useState<Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    type: string;
  }>>([]);
  
  const planeRef = useRef<THREE.Mesh>(null);

  const [physicsRef] = usePlane(() => {
    console.log('TrackBuilder: Creating plane physics body');
    return {
      rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      position: [0, 0, 0] as [number, number, number],
      type: 'Static' as const,
      // Use a callback for the ref to avoid undefined issues
      onCollide: (e) => {
        if (e && e.contact) {
          console.log('TrackBuilder: Plane collision detected');
        }
        return true; // Ensure callback returns a value
      }
    };
  });

  const handlePlaceTrack = (event: { button: number; point: THREE.Vector3 }) => {
    console.log('TrackBuilder: Handle place track called', event);
    if (event.button === 0 && event.point) {
      const newPiece = {
        position: [
          event.point.x || 0, 
          0.1, 
          event.point.z || 0
        ] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        type: 'straight'
      };
      
      setPieces(currentPieces => {
        console.log('TrackBuilder: Adding new piece', newPiece);
        return [...currentPieces, newPiece];
      });
    }
  };

  // Sync physics ref with mesh ref if both exist
  if (physicsRef && planeRef.current) {
    planeRef.current.rotation.x = -Math.PI / 2;
    planeRef.current.position.set(0, 0, 0);
  }

  return (
    <group>
      <mesh 
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow 
        onClick={handlePlaceTrack}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
      
      {pieces.map((piece, index) => {
        console.log('TrackBuilder: Rendering piece', index, piece);
        return (
          <TrackPiece 
            key={index} 
            position={piece.position} 
            rotation={piece.rotation} 
            type={piece.type} 
          />
        );
      })}
    </group>
  );
};

export default TrackBuilder;
