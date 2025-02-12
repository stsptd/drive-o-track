
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car = ({ position }: { position: [number, number, number] }) => {
  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 500,
    position,
    args: [2, 1, 4],
    type: 'Dynamic',
  }));

  const velocity = useRef([0, 0, 0]);

  useFrame((state) => {
    const { forward, backward, left, right } = getKeys();
    const force = 1000;
    const turn = 0.05;

    if (forward) {
      api.applyLocalForce([0, 0, -force], [0, 0, 0]);
    }
    if (backward) {
      api.applyLocalForce([0, 0, force], [0, 0, 0]);
    }
    if (left && ref.current) {
      ref.current.rotation.y += turn;
    }
    if (right && ref.current) {
      ref.current.rotation.y -= turn;
    }

    api.velocity.subscribe((v) => (velocity.current = v));
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Helper function to track keyboard input
const keys: { [key: string]: boolean } = {};
const getKeys = () => ({
  forward: keys['ArrowUp'] || keys['w'],
  backward: keys['ArrowDown'] || keys['s'],
  left: keys['ArrowLeft'] || keys['a'],
  right: keys['ArrowRight'] || keys['d'],
});

window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

export default Car;
