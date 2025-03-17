import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const LoadingLogo = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const LoadingProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background-color: white;
  border-radius: 2px;
  animation: loading 2s infinite ease-in-out;
  
  @keyframes loading {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
`;

const LoadingText = styled.div`
  margin-top: 15px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const LoadingScreen = () => {
  return (
    <LoadingContainer>
      <LoadingLogo>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8ecae6" width="80" height="80">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 4.5-8-4.5V6h16zm0 12H4V9.12l8 4.5 8-4.5V18z"/>
        </svg>
      </LoadingLogo>
      <LoadingBar>
        <LoadingProgress />
      </LoadingBar>
      <LoadingText>Loading Mail Messenger...</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen; 