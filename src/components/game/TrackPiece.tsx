
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
  const [meshRef] = useBox(() => ({
    type: 'Static',
    position: position || [0, 0, 0],
    rotation: rotation || [0, 0, 0],
    args: [2, 0.2, 5],
  }));

  return (
    <group>
      <mesh ref={meshRef} receiveShadow castShadow>
        <boxGeometry args={[2, 0.2, 5]} />
        <meshStandardMaterial color="#505050" />
      </mesh>
    </group>
  );
};
