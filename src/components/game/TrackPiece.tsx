
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
  const [ref] = useBox<THREE.Mesh>(() => ({
    type: 'Static',
    position,
    rotation,
    args: [2, 0.2, 5],
  }));

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[2, 0.2, 5]} />
      <meshStandardMaterial color="#505050" />
    </mesh>
  );
};
