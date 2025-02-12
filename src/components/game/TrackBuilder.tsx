
import { useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import { TrackPiece } from './TrackPiece';

const TrackBuilder = () => {
  const [pieces, setPieces] = useState<Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    type: string;
  }>>([]);

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
  }));

  const { raycaster, camera, scene } = useThree();

  const handlePlaceTrack = (event: any) => {
    if (event.button === 0) {
      const pos = event.point.toArray();
      setPieces([
        ...pieces,
        {
          position: [pos[0], 0.1, pos[2]],
          rotation: [0, 0, 0],
          type: 'straight',
        },
      ]);
    }
  };

  return (
    <>
      <mesh ref={ref} receiveShadow onClick={handlePlaceTrack}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
      {pieces.map((piece, index) => (
        <TrackPiece key={index} {...piece} />
      ))}
    </>
  );
};

export default TrackBuilder;
