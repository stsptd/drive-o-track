
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car = ({ position }: { position: [number, number, number] }) => {
  console.log('Car: Component rendering', position);
  
  const rotationRef = useRef(0);
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  
  const [meshRef, api] = useBox(() => {
    console.log('Car: Creating physics body');
    return {
      mass: 500,
      position,
      args: [2, 1, 4],
      type: 'Dynamic' as const,
    };
  });

  useFrame(() => {
    const { forward, backward, left, right } = getKeys();
    
    if (forward || backward || left || right) {
      console.log('Car: Movement detected', { forward, backward, left, right });
    }

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
      console.log('Car: Velocity update', v);
      if (Array.isArray(v) && v.length === 3) {
        velocityRef.current = v as [number, number, number];
      }
    });
  });

  return (
    <group>
      <mesh ref={meshRef as any} castShadow>
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
