
import { useState, useRef } from 'react';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import { TrackPiece } from './TrackPiece';
import { Group } from 'three';

const TrackBuilder = () => {
  console.log('TrackBuilder: Component rendering');
  
  const [pieces, setPieces] = useState<Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    type: string;
  }>>([
    // Add a default piece to ensure something is visible
    {
      position: [0, 0.1, 0],
      rotation: [0, 0, 0],
      type: 'straight'
    }
  ]);
  
  // Create a ref for the plane physics body
  const groupRef = useRef<Group>(null);
  
  // Create a ground plane with physics
  // Important: Don't directly attach the ref to the physics object
  const [ref, planeApi] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static'
  }));

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

  return (
    <group>
      {/* Use a separate mesh for the visual representation, independent from the physics body */}
      <mesh 
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow 
        onClick={handlePlaceTrack}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
      
      {/* This is a group for the physics body - we use the ref from usePlane here */}
      <group ref={ref} />
      
      {pieces.map((piece, index) => (
        <TrackPiece 
          key={index} 
          position={piece.position} 
          rotation={piece.rotation} 
          type={piece.type} 
        />
      ))}
    </group>
  );
};

export default TrackBuilder;
