
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car = ({ position }: { position: [number, number, number] }) => {
  console.log('Car: Component rendering', position);
  
  // Use refs for internal state
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Ensure position is valid
  const safePosition = position || [0, 0.5, 0];
  
  const [, api] = useBox(() => ({
    mass: 500,
    position: safePosition,
    args: [2, 1, 4],
    type: 'Dynamic',
    onCollide: (e) => {
      console.log('Car: Collision detected', e);
    }
  }));

  useFrame(() => {
    const { forward, backward, left, right } = getKeys();
    
    if (forward || backward || left || right) {
      console.log('Car: Movement detected', { forward, backward, left, right });
    }

    const force = 1000;
    const turn = 0.05;

    // Apply forces safely
    if (api) {
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

      // Update position and rotation via API
      api.position.subscribe((p) => {
        if (meshRef.current && p) {
          meshRef.current.position.set(p[0], p[1], p[2]);
        }
      });
      
      api.rotation.subscribe((r) => {
        if (meshRef.current && r) {
          meshRef.current.rotation.set(r[0], r[1], r[2]);
        }
      });
    }
  });

  return (
    <mesh ref={meshRef} castShadow position={safePosition}>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Helper function to track keyboard input
const keys: { [key: string]: boolean } = {};
const getKeys = () => ({
  forward: keys['ArrowUp'] || keys['w'] || false,
  backward: keys['ArrowDown'] || keys['s'] || false,
  left: keys['ArrowLeft'] || keys['a'] || false,
  right: keys['ArrowRight'] || keys['d'] || false,
});

window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

export default Car;
