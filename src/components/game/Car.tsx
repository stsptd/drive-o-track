
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
  
  const [physicsRef, api] = useBox(() => {
    console.log('Car: Creating physics body with position', safePosition);
    return {
      mass: 500,
      position: safePosition,
      args: [2, 1, 4],
      type: 'Dynamic' as const,
      onCollide: (e) => {
        if (e && e.contact) {
          console.log('Car: Collision detected');
        }
        return true; // Ensure callback returns a value
      }
    };
  });

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

      // Safely subscribe to velocity updates
      api.velocity.subscribe((v) => {
        if (v && Array.isArray(v) && v.length === 3) {
          console.log('Car: Velocity update', v);
          velocityRef.current = [v[0] || 0, v[1] || 0, v[2] || 0];
          return velocityRef.current; // Ensure we always return a value
        }
        return velocityRef.current; // Return previous value if new one is invalid
      });
    }
    
    // Sync mesh with physics if both refs exist
    if (physicsRef && meshRef.current) {
      // Instead of accessing properties directly, we check if they exist on the physicsRef
      if ('position' in physicsRef && 'quaternion' in physicsRef) {
        // Now we can safely access position and quaternion
        meshRef.current.position.set(
          physicsRef.position.x,
          physicsRef.position.y,
          physicsRef.position.z
        );
        meshRef.current.quaternion.set(
          physicsRef.quaternion.x,
          physicsRef.quaternion.y,
          physicsRef.quaternion.z,
          physicsRef.quaternion.w
        );
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow position={safePosition}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
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
