import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const cloudFloat = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100vw); }
`;

// Styled Components
const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #8ecae6 0%, #c4e3f3 100%);
`;

const Sky = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Cloud = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  
  &:before, &:after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
  
  &:nth-child(1) {
    width: 120px;
    height: 120px;
    top: 15%;
    left: -120px;
    animation: ${cloudFloat} 60s linear infinite;
    
    &:before {
      width: 80px;
      height: 80px;
      top: -30px;
      left: 40px;
    }
    
    &:after {
      width: 60px;
      height: 60px;
      top: 20px;
      left: 80px;
    }
  }
  
  &:nth-child(2) {
    width: 100px;
    height: 100px;
    top: 30%;
    left: -100px;
    animation: ${cloudFloat} 45s linear infinite;
    animation-delay: 10s;
    
    &:before {
      width: 70px;
      height: 70px;
      top: -20px;
      left: 30px;
    }
    
    &:after {
      width: 50px;
      height: 50px;
      top: 15px;
      left: 65px;
    }
  }
  
  &:nth-child(3) {
    width: 80px;
    height: 80px;
    top: 10%;
    left: -80px;
    animation: ${cloudFloat} 50s linear infinite;
    animation-delay: 5s;
    
    &:before {
      width: 60px;
      height: 60px;
      top: -15px;
      left: 25px;
    }
    
    &:after {
      width: 40px;
      height: 40px;
      top: 10px;
      left: 55px;
    }
  }
`;

const Hills = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: #57cc99;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  transform: scaleX(1.5);
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 120%;
    height: 100%;
    background: #38a3a5;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    z-index: -1;
  }
`;

const Trees = styled.div`
  position: absolute;
  bottom: 20%;
  left: 10%;
  z-index: 2;
  
  &:before, &:after {
    content: '';
    position: absolute;
    background: #2a9d8f;
    border-radius: 50%;
  }
  
  &:before {
    width: 60px;
    height: 60px;
    bottom: 0;
    left: 0;
  }
  
  &:after {
    width: 80px;
    height: 80px;
    bottom: 0;
    left: 50px;
  }
`;

const Trees2 = styled(Trees)`
  left: 70%;
  
  &:before {
    width: 70px;
    height: 70px;
  }
  
  &:after {
    width: 90px;
    height: 90px;
    left: 60px;
  }
`;

const House = styled.div`
  position: absolute;
  bottom: 25%;
  right: 20%;
  z-index: 2;
  width: 100px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 10px;
  
  &:before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
    width: 100%;
    height: 50px;
    background: #ffb703;
    clip-path: polygon(0 100%, 50% 0, 100% 100%);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -20px;
    width: 140px;
    height: 10px;
    background: #023047;
    border-radius: 5px;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: var(--spacing-xl);
  text-align: center;
`;

const Logo = styled.div`
  margin-bottom: var(--spacing-xl);
  animation: ${float} 6s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: var(--spacing-lg);
  animation: ${fadeIn} 1s ease-out forwards;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin-bottom: var(--spacing-xl);
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.4s;
  opacity: 0;
`;

const Button = styled(Link)`
  background-color: white;
  color: var(--primary-color);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  font-weight: 700;
  font-size: 1.2rem;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MailIcon = styled.div`
  width: 150px;
  height: 150px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const Version = styled.div`
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  color: white;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const HomePage = () => {
  const [version, setVersion] = useState('0.2.0');
  
  useEffect(() => {
    // Check if there's a saved game
    const hasSavedGame = localStorage.getItem('gameProgress') !== null;
    
    // You could load the version from a config file or API
    // For now, we'll just use the hardcoded version
  }, []);
  
  return (
    <HomeContainer>
      <Sky>
        <Cloud />
        <Cloud />
        <Cloud />
      </Sky>
      
      <Hills />
      <Trees />
      <Trees2 />
      <House />
      
      <ContentContainer>
        <Logo>
          <MailIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8ecae6" width="100" height="100">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 4.5-8-4.5V6h16zm0 12H4V9.12l8 4.5 8-4.5V18z"/>
            </svg>
          </MailIcon>
        </Logo>
        
        <Title>Mail Messenger</Title>
        <Subtitle>
          Deliver letters and packages across a charming Ghibli-inspired world.
          Lace up your rollerblades and embark on a postal adventure!
        </Subtitle>
        
        <ButtonContainer>
          <Button to="/game">Start Game</Button>
          <SecondaryButton to="/settings">Settings</SecondaryButton>
        </ButtonContainer>
      </ContentContainer>
      
      <Version>v{version}</Version>
    </HomeContainer>
  );
};

export default HomePage; 