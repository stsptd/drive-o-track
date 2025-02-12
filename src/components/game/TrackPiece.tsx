
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

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

  const [meshRef] = useBox(() => {
    console.log('TrackPiece: Creating physics body', { position, rotation });
    return {
      type: 'Static' as const,
      position: position || [0, 0, 0],
      rotation: rotation || [0, 0, 0],
      args: [2, 0.2, 5],
    };
  });

  return (
    <group>
      <mesh ref={meshRef as any} receiveShadow castShadow>
        <boxGeometry args={[2, 0.2, 5]} />
        <meshStandardMaterial color="#505050" />
      </mesh>
    </group>
  );
};
