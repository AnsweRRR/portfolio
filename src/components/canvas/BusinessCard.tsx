import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import CanvasLoader from '../Loader';
import * as THREE from 'three';

const Card = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/business_card/scene.gltf');

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const rotation = Math.sin(time * 0.5) * (Math.PI / 12);
    
    meshRef.current.rotation.y = rotation + Math.PI + 1;
  });

  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      scale={0.007}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
};

const BusinessCard = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 60,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Card />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
};

export default BusinessCard; 