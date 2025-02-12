
import { useState } from 'react';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import { TrackPiece } from './TrackPiece';

const TrackBuilder = () => {
  const [pieces, setPieces] = useState<Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    type: string;
  }>>([]);

  const [planeRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
  }));

  const handlePlaceTrack = (event: { button: number; point: THREE.Vector3 }) => {
    if (event.button === 0 && event.point) {
      const newPiece = {
        position: [event.point.x, 0.1, event.point.z],
        rotation: [0, 0, 0],
        type: 'straight',
      } as const;
      
      setPieces((currentPieces) => [...currentPieces, newPiece]);
    }
  };

  return (
    <group>
      <mesh ref={planeRef} receiveShadow onClick={handlePlaceTrack}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
      {pieces.map((piece, index) => (
        <TrackPiece key={index} {...piece} />
      ))}
    </group>
  );
};

export default TrackBuilder;
