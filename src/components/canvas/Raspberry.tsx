import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const RaspberryModelContent = () => {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/raspberry_pi/scene.gltf');

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={scene} scale={0.01} rotation={[0, Math.PI / 2, 0]} />;
}

const Raspberry = () => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 1.5, 4], fov: 35 }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      <RaspberryModelContent />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

export default Raspberry;