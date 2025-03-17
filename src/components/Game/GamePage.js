import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useGLTF } from '@react-three/drei';
import { EffectComposer, Outline, Bloom, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import GameWorld from './GameWorld';
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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <GameContainer>
      <BackButton to="/">Back to Home</BackButton>
      
      <CanvasContainer>
        <Canvas
          shadows
          camera={{ position: [0, 2, 10], fov: 60 }}
          gl={{ antialias: true }}
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
            <GameWorld />
            
            {/* Post-processing effects for Ghibli style */}
            <EffectComposer>
              <Outline 
                blendFunction={BlendFunction.NORMAL}
                edgeStrength={2.5}
                pulseSpeed={0}
                visibleEdgeColor={0x000000}
                hiddenEdgeColor={0x000000}
                width={1024}
                height={1024}
              />
              <Bloom 
                intensity={0.2} 
                luminanceThreshold={0.8} 
                luminanceSmoothing={0.9} 
              />
              <ToneMapping 
                blendFunction={BlendFunction.NORMAL} 
                adaptive={true} 
                resolution={256} 
                middleGrey={0.6} 
                maxLuminance={16.0} 
                averageLuminance={1.0} 
                adaptationRate={1.0} 
              />
            </EffectComposer>
            
            {/* Controls */}
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              maxPolarAngle={Math.PI / 2 - 0.1} 
              minPolarAngle={0.2}
            />
          </Suspense>
        </Canvas>
      </CanvasContainer>
      
      {/* HUD overlay */}
      <GameHUD />
    </GameContainer>
  );
};

export default GamePage; 