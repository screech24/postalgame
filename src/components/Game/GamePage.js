import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useGLTF, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Outline, Bloom, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import EnhancedGameWorld from './EnhancedGameWorld';
import GameHUD from './GameHUD';
import LoadingScreen from '../UI/LoadingScreen';

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  z-index: 100;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const GamePage = () => {
  const [dpr, setDpr] = useState(1.5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <GameContainer>
      {loading ? (
        <LoadingScreen message="Generating Ghibli world..." />
      ) : (
        <>
          <BackButton to="/">Back to Home</BackButton>
          <GameHUD />
          
          <CanvasContainer>
            <Canvas
              shadows
              camera={{ position: [0, 5, 15], fov: 75, near: 0.1, far: 1000 }}
              dpr={dpr}
            >
              <PerformanceMonitor 
                onIncline={() => setDpr(Math.min(2, dpr + 0.5))} 
                onDecline={() => setDpr(Math.max(1, dpr - 0.5))}
              >
                <Suspense fallback={null}>
                  {/* Environment */}
                  <Sky 
                    distance={450000} 
                    sunPosition={[0, 1, 0]} 
                    inclination={0.6} 
                    azimuth={0.25} 
                  />
                  <Environment preset="sunset" />
                  
                  {/* Game World */}
                  <EnhancedGameWorld />
                  
                  {/* Simplified Post-processing effects for better performance */}
                  <EffectComposer multisampling={0} resolutionScale={0.8}>
                    <Outline 
                      blendFunction={BlendFunction.NORMAL}
                      edgeStrength={2.5}
                      pulseSpeed={0}
                      visibleEdgeColor={0x000000}
                      hiddenEdgeColor={0x000000}
                      width={512} // Reduced from 1024
                      height={512} // Reduced from 1024
                    />
                    <Bloom 
                      intensity={0.2} 
                      luminanceThreshold={0.8} 
                      luminanceSmoothing={0.9}
                      mipmapBlur // Use mipmap blur for better performance
                    />
                  </EffectComposer>
                  
                  {/* Optimized Controls */}
                  <OrbitControls 
                    enablePan={false} 
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2 - 0.1} 
                    minPolarAngle={0.2}
                    enableDamping={true} // Add damping for smoother camera movement
                    dampingFactor={0.1} // Lower damping factor for better performance
                    rotateSpeed={0.7} // Adjust rotation speed
                    zoomSpeed={0.8} // Adjust zoom speed
                  />
                </Suspense>
              </PerformanceMonitor>
            </Canvas>
          </CanvasContainer>
        </>
      )}
    </GameContainer>
  );
};

export default GamePage; 