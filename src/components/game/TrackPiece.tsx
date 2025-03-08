
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

// Define a proper type for the physics body
type PhysicsApi = {
  position: {
    subscribe: (callback: (value: [number, number, number]) => void) => () => void;
  };
  rotation: {
    subscribe: (callback: (value: [number, number, number]) => void) => () => void;
  };
};

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
  
  // Ensure position and rotation are valid arrays
  const safePosition = position || [0, 0, 0];
  const safeRotation = rotation || [0, 0, 0];
  
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a physics body
  const [physicsRef, api] = useBox<THREE.Group>(() => ({
    type: 'Static',
    position: safePosition,
    rotation: safeRotation,
    args: [2, 0.2, 5],
    onCollide: (e) => {
      console.log('TrackPiece: Collision detected', e);
    }
  }));

  // Sync physics body position/rotation with the visual mesh
  useEffect(() => {
    // Type assertion to access the physics API
    const physicsApi = api as unknown as PhysicsApi;
    
    const unsubPosition = physicsApi.position.subscribe((p) => {
      if (meshRef.current) {
        meshRef.current.position.set(p[0], p[1], p[2]);
      }
    });
    
    const unsubRotation = physicsApi.rotation.subscribe((r) => {
      if (meshRef.current) {
        meshRef.current.rotation.set(r[0], r[1], r[2]);
      }
    });

    return () => {
      unsubPosition();
      unsubRotation();
    };
  }, [api]);

  return (
    <>
      {/* Visual representation */}
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
      
      {/* This connects to the physics body but is invisible */}
      <group ref={physicsRef} />
    </>
  );
};
