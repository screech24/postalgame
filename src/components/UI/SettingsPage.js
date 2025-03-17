import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--light-color);
  color: var(--dark-color);
`;

const Header = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
`;

const BackButton = styled(Link)`
  background-color: white;
  color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--light-color);
    transform: translateY(-2px);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
`;

const SettingGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
`;

const SettingDescription = styled.p`
  margin-bottom: var(--spacing-sm);
  color: #666;
  font-size: 0.9rem;
`;

const Slider = styled.input`
  width: 100%;
  margin: var(--spacing-sm) 0;
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  border: 1px solid #ddd;
  background-color: white;
  font-family: var(--font-family);
`;

const Checkbox = styled.input`
  margin-right: var(--spacing-sm);
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--success-color);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  
  &:hover {
    background-color: #45a87d;
  }
`;

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    graphics: 'medium',
    soundVolume: 80,
    musicVolume: 60,
    showFPS: false,
    invertY: false,
    mouseSensitivity: 50,
    language: 'english',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default settings
    const defaultSettings = {
      graphics: 'medium',
      soundVolume: 80,
      musicVolume: 60,
      showFPS: false,
      invertY: false,
      mouseSensitivity: 50,
      language: 'english',
    };
    setSettings(defaultSettings);
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
        <BackButton to="/">Back to Home</BackButton>
      </Header>
      
      <Content>
        <Section>
          <SectionTitle>Graphics</SectionTitle>
          <SettingGroup>
            <SettingLabel htmlFor="graphics">Quality</SettingLabel>
            <SettingDescription>Higher quality settings may affect performance</SettingDescription>
            <Select 
              id="graphics" 
              name="graphics" 
              value={settings.graphics} 
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </Select>
          </SettingGroup>
          
          <SettingGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                name="showFPS" 
                checked={settings.showFPS} 
                onChange={handleChange} 
              />
              Show FPS Counter
            </CheckboxLabel>
          </SettingGroup>
        </Section>
        
        <Section>
          <SectionTitle>Audio</SectionTitle>
          <SettingGroup>
            <SettingLabel htmlFor="soundVolume">Sound Effects Volume: {settings.soundVolume}%</SettingLabel>
            <Slider 
              type="range" 
              id="soundVolume" 
              name="soundVolume" 
              min="0" 
              max="100" 
              value={settings.soundVolume} 
              onChange={handleChange} 
            />
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel htmlFor="musicVolume">Music Volume: {settings.musicVolume}%</SettingLabel>
            <Slider 
              type="range" 
              id="musicVolume" 
              name="musicVolume" 
              min="0" 
              max="100" 
              value={settings.musicVolume} 
              onChange={handleChange} 
            />
          </SettingGroup>
        </Section>
        
        <Section>
          <SectionTitle>Controls</SectionTitle>
          <SettingGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                name="invertY" 
                checked={settings.invertY} 
                onChange={handleChange} 
              />
              Invert Y-Axis
            </CheckboxLabel>
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel htmlFor="mouseSensitivity">Mouse Sensitivity: {settings.mouseSensitivity}%</SettingLabel>
            <Slider 
              type="range" 
              id="mouseSensitivity" 
              name="mouseSensitivity" 
              min="1" 
              max="100" 
              value={settings.mouseSensitivity} 
              onChange={handleChange} 
            />
          </SettingGroup>
        </Section>
        
        <Section>
          <SectionTitle>Language</SectionTitle>
          <SettingGroup>
            <SettingLabel htmlFor="language">Select Language</SettingLabel>
            <Select 
              id="language" 
              name="language" 
              value={settings.language} 
              onChange={handleChange}
            >
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="japanese">Japanese</option>
            </Select>
          </SettingGroup>
        </Section>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button onClick={handleReset}>Reset to Default</Button>
          <SaveButton onClick={handleSave}>Save Settings</SaveButton>
        </div>
      </Content>
    </SettingsContainer>
  );
};

export default SettingsPage; 