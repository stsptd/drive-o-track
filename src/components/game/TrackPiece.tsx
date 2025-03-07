
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { useRef } from 'react';

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
  
  const [physicsRef] = useBox(() => {
    console.log('TrackPiece: Creating physics body', { safePosition, safeRotation });
    return {
      type: 'Static' as const,
      position: safePosition,
      rotation: safeRotation,
      args: [2, 0.2, 5],
      onCollide: (e) => {
        if (e && e.contact) {
          console.log('TrackPiece: Collision detected');
        }
        return true; // Ensure callback returns a value
      }
    };
  });

  // Apply physics ref to mesh ref on update
  if (physicsRef && meshRef.current) {
    meshRef.current.position.copy(physicsRef.position);
    meshRef.current.rotation.set(safeRotation[0], safeRotation[1], safeRotation[2]);
  }

  return (
    <group>
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
    </group>
  );
};
