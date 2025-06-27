import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

interface PaperTabletProps {
  isMobile: boolean;
}

const PaperTablet: React.FC<PaperTabletProps> = ({ isMobile }) => {
  const paperTablet = useGLTF("./models/paper_tablet/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={3} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.2}
        penumbra={1}
        intensity={35000}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight intensity={3} />
      <primitive
        object={paperTablet.scene}
        scale={isMobile ? 12.0 : 18.0}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2 - 0.3, 0]}
      />
    </mesh>
  );
};

const PaperTabletCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [15, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={20}
        />
        <PaperTablet isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default PaperTabletCanvas; 