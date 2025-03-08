
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

const Car = ({ position }: { position: [number, number, number] }) => {
  console.log('Car: Component rendering', position);
  
  // Use refs for internal state
  const rotationRef = useRef<number>(0);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Ensure position is valid
  const safePosition = position || [0, 0.5, 0];
  
  const [physicsRef] = useBox(() => ({
    mass: 500,
    position: safePosition,
    args: [2, 1, 4],
    type: 'Dynamic',
    onCollide: (e) => {
      console.log('Car: Collision detected', e);
    }
  }));

  // Sync physics body with mesh
  useEffect(() => {
    if (physicsRef) {
      physicsRef.position.subscribe((p) => {
        if (meshRef.current) {
          meshRef.current.position.set(p[0], p[1], p[2]);
        }
      });
      
      physicsRef.rotation.subscribe((r) => {
        if (meshRef.current) {
          meshRef.current.rotation.set(r[0], r[1], r[2]);
        }
      });
    }
  }, [physicsRef]);

  useFrame(() => {
    const { forward, backward, left, right } = getKeys();
    
    // Only log when keys are pressed to reduce console spam
    if (forward || backward || left || right) {
      console.log('Car: Movement detected', { forward, backward, left, right });
    }

    const force = 1000;
    const turn = 0.05;

    // Apply forces safely
    if (physicsRef) {
      if (forward) {
        physicsRef.applyLocalForce([0, 0, -force], [0, 0, 0]);
      }
      if (backward) {
        physicsRef.applyLocalForce([0, 0, force], [0, 0, 0]);
      }
      if (left) {
        rotationRef.current += turn;
        physicsRef.rotation.set(0, rotationRef.current, 0);
      }
      if (right) {
        rotationRef.current -= turn;
        physicsRef.rotation.set(0, rotationRef.current, 0);
      }
    }
  });

  return (
    <>
      {/* Visual mesh */}
      <mesh ref={meshRef} castShadow position={safePosition}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Physics body (invisible) */}
      <group ref={physicsRef} />
    </>
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
