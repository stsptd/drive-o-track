
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
  const [, api] = useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args: [2, 0.2, 5],
  }));

  return (
    <group>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2, 0.2, 5]} />
        <meshStandardMaterial color="#505050" />
      </mesh>
    </group>
  );
};
