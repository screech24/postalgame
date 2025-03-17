import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const HUDContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const TopBar = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const LeftBar = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: 0.1s;
  opacity: 0;
`;

const Stat = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  color: var(--dark-color);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Compass = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 10px;
    background-color: var(--primary-color);
  }
  
  &:after {
    content: 'N';
    position: absolute;
    top: 22px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 700;
    color: var(--primary-color);
    font-size: 14px;
  }
`;

const CompassNeedle = styled.div`
  width: 4px;
  height: 60px;
  background: linear-gradient(to bottom, var(--primary-color) 0%, var(--primary-color) 50%, var(--error-color) 50%, var(--error-color) 100%);
  transform: rotate(${props => props.rotation}deg);
  transform-origin: center bottom;
  position: absolute;
  bottom: 50%;
`;

const MissionContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MissionTitle = styled.h3`
  margin: 0 0 10px 0;
  color: var(--primary-color);
  font-size: 16px;
`;

const MissionDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--dark-color);
`;

const Notification = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  animation: ${pulse} 2s infinite;
  border-left: 4px solid var(--accent-color);
`;

const NotificationText = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--dark-color);
  font-weight: 600;
`;

const MailCounter = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MailIcon = styled.div`
  color: var(--primary-color);
`;

const MailCount = styled.span`
  font-weight: 700;
  color: var(--dark-color);
`;

const GameHUD = () => {
  const [compassRotation, setCompassRotation] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  
  useEffect(() => {
    // Simulate compass rotation
    const interval = setInterval(() => {
      setCompassRotation(prev => (prev + 1) % 360);
    }, 100);
    
    // Hide notification after 5 seconds
    const notificationTimer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(notificationTimer);
    };
  }, []);
  
  return (
    <HUDContainer>
      <TopBar>
        <Stat>
          <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </Icon>
          10:30 AM
        </Stat>
        
        <Stat>
          <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
            </svg>
          </Icon>
          Level 1
        </Stat>
      </TopBar>
      
      <LeftBar>
        <MissionContainer>
          <MissionTitle>Current Delivery</MissionTitle>
          <MissionDescription>
            Deliver the package to Mrs. Tanaka's house in the eastern district.
          </MissionDescription>
        </MissionContainer>
        
        <MailCounter>
          <MailIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 4.5-8-4.5V6h16zm0 12H4V9.12l8 4.5 8-4.5V18z"/>
            </svg>
          </MailIcon>
          <MailCount>3/10</MailCount> Deliveries
        </MailCounter>
        
        {showNotification && (
          <Notification>
            <NotificationText>
              New delivery added to your route!
            </NotificationText>
          </Notification>
        )}
      </LeftBar>
      
      <BottomBar>
        <Compass>
          <CompassNeedle rotation={compassRotation} />
        </Compass>
      </BottomBar>
    </HUDContainer>
  );
};

export default GameHUD; 