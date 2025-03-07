
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { useRef } from 'react';

// Define an interface for the physics body reference
interface PhysicsBodyRef {
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export const TrackPiece = ({
  position,
  rotation,
  type,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  type: string;
}) => {
  console.log('TrackPiece: Rendering with props', { position, rotation, type });
  
  // Ensure position and rotation are valid arrays before passing to physics
  const safePosition = position || [0, 0, 0];
  const safeRotation = rotation || [0, 0, 0];
  
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a simpler configuration for the physics body
  const [physicsRef] = useBox(() => ({
    type: 'Static',
    position: safePosition,
    rotation: safeRotation,
    args: [2, 0.2, 5],
    onCollide: (e) => {
      console.log('TrackPiece: Collision detected', e);
    }
  }));

  return (
    <mesh 
      ref={meshRef}
      position={safePosition} 
      rotation={safeRotation}
      receiveShadow 
      castShadow
    >
      <boxGeometry args={[2, 0.2, 5]} />
      <meshStandardMaterial color="#505050" />
    </mesh>
  );
};
