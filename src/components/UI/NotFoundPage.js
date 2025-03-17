import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl);
  text-align: center;
`;

const NotFoundTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
`;

const HomeButton = styled(Link)`
  background-color: white;
  color: var(--primary-color);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 700;
  font-size: 1.1rem;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--light-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundText>
        Oops! It seems like this letter got lost in transit. 
        Let's get you back to the post office.
      </NotFoundText>
      <HomeButton to="/">Return to Home</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage; 