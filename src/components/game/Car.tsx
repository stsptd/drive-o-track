
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car = ({ position }: { position: [number, number, number] }) => {
  const rotationRef = useRef(0);
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  
  const [meshRef, api] = useBox(() => ({
    mass: 500,
    position,
    args: [2, 1, 4],
    type: 'Dynamic',
    onCollide: (e) => {
      if (e && e.contact) {
        // Handle collision
      }
    }
  }));

  useFrame(() => {
    const { forward, backward, left, right } = getKeys();
    const force = 1000;
    const turn = 0.05;

    if (forward) {
      api.applyLocalForce([0, 0, -force], [0, 0, 0]);
    }
    if (backward) {
      api.applyLocalForce([0, 0, force], [0, 0, 0]);
    }
    if (left) {
      rotationRef.current += turn;
      api.rotation.set(0, rotationRef.current, 0);
    }
    if (right) {
      rotationRef.current -= turn;
      api.rotation.set(0, rotationRef.current, 0);
    }

    api.velocity.subscribe((v) => {
      if (Array.isArray(v) && v.length === 3) {
        velocityRef.current = v as [number, number, number];
      }
    });
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
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
