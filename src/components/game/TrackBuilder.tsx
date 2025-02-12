
import { useState } from 'react';
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

  const [planeRef] = usePlane(() => {
    console.log('TrackBuilder: Creating plane physics body');
    return {
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, 0, 0],
      type: 'Static' as const,
    };
  });

  const handlePlaceTrack = (event: { button: number; point: THREE.Vector3 }) => {
    console.log('TrackBuilder: Handle place track called', event);
    if (event.button === 0 && event.point) {
      const newPiece = {
        position: [event.point.x, 0.1, event.point.z] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        type: 'straight'
      };
      
      setPieces(currentPieces => {
        console.log('TrackBuilder: Adding new piece', newPiece);
        return [...currentPieces, newPiece];
      });
    }
  };

  return (
    <group>
      <mesh ref={planeRef as any} receiveShadow onClick={handlePlaceTrack}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
      {pieces.map((piece, index) => {
        console.log('TrackBuilder: Rendering piece', index, piece);
        return <TrackPiece key={index} {...piece} />;
      })}
    </group>
  );
};

export default TrackBuilder;
