# Mail Messenger Game - Development Plan

## Current Version: 0.2.2 (Updated: 2025-03-17)

## Progress Update
We have successfully completed the initial technical foundation and visual style implementation of the Mail Messenger game. The current version (0.2.2) includes:

- ✅ Project setup with React, Three.js, and PWA capabilities
- ✅ Basic rendering pipeline with custom shaders
- ✅ Ghibli-inspired 3D world with procedurally generated elements
- ✅ Custom toon shader for cel-shaded rendering
- ✅ Interactive home page with animated elements
- ✅ Settings page with game configuration options
- ✅ In-game HUD with mission tracking and compass
- ✅ Procedurally generated trees, houses, and terrain
- ✅ Water effects with transmission material
- ✅ Post-processing effects for enhanced visuals
- ✅ Fixed React version compatibility issues

The next phase will focus on implementing core gameplay mechanics, including player movement, collision detection, and the delivery system.

## Project Overview
- **Game Title**: Mail Messenger (see alternative name suggestions below)
- **Concept**: First-person postal delivery game in a Ghibli-inspired world
- **Technology Stack**: React, Three.js, PWA
- **Art Style**: Studio Ghibli-inspired cel shading
- **Initial Transportation**: Rollerblades (with bikes, scooters, flying machines unlockable)

## Alternative Name Suggestions
- **Whispering Letters**
- **Swift Courier**
- **Parcel Pathways**
- **Skyward Delivery**
- **Spirited Post**
- **Enchanted Messenger**
- **Dreamscape Courier**
- **Gentle Deliveries**
- **Whisking Mail**
- **Breeze Carrier**

## Technical Architecture

### Frontend Framework
- **React**: For UI components and state management
- **Three.js**: For 3D rendering and game environment
- **React Three Fiber**: To integrate Three.js with React

### PWA Implementation
- **Service Workers**: For offline functionality
- **Web App Manifest**: For installable experience
- **Responsive Design**: To support various devices

### Asset Management
- **Programmatic Asset Creation**: Create 3D models, textures, and environments through code
- **Custom 3D Models**: Define geometry mathematically using Three.js primitives and meshes
- **Dynamic Shaders**: Use GLSL shaders to achieve Ghibli-style rendering
- **Code-based Textures**: Generate textures and patterns using JavaScript and WebGL

## Game Components

### 1. Core Game Engine
- **Game Loop**: Implement animation frame loop
- **Physics System**: Implement collision detection and movement physics
- **Camera Controls**: First-person camera with smooth transitions

### 2. World Creation
- **Hand-designed Town**: Create buildings, streets, and landmarks using Three.js geometry
- **District Types**: Downtown, residential, rural, magical areas
- **Environment System**: Day/night cycle, weather effects

### 3. Player Mechanics
- **Movement System**: 
  - Rollerblade physics (initial)
  - Bike mechanics
  - Scooter dynamics
  - Flying machine controls
  - Magical transportation

### 4. Delivery System
- **Mail Management**: Inventory system for packages
- **Navigation**: Map system with waypoints and directions
- **Task Completion**: Verification of successful deliveries
- **Special Conditions**: Time-sensitive, fragile packages

### 5. Progression System
- **Experience Points**: Track player progress
- **Unlockables**: New transportation methods, areas, abilities
- **Currency System**: For customization purchases

### 6. NPC System
- **Hand-crafted Characters**: Create distinct NPCs with unique characteristics
- **Dialogue Engine**: Simple conversation system
- **Side Quests**: Additional tasks from town residents

### 7. UI/UX
- **Heads-up Display**: Minimal display showing current task
- **Map Interface**: Interactive town map
- **Inventory Management**: Package tracking and details
- **Menu System**: Settings, progress, customization

### 8. Viral Features
- **Photo Mode**: Screenshot system with filters
- **Leaderboards**: Local storage for high scores
- **Custom Mail Creation**: Design and share custom mail

## Visual Style Implementation

### Ghibli-inspired Rendering
- **Custom Shaders**:
  - Cel/toon shading effect
  - Outline shader for characters and objects
  - Ambient occlusion for depth
- **Color Palette**: Vibrant, storybook-like colors
- **Lighting**: Soft, diffused lighting system

### Environment Design
- **Architecture**: Whimsical, European-inspired buildings created with Three.js geometry
- **Nature Elements**: Lush landscapes, magical flora using custom mesh creation
- **Weather Effects**: Rain, fog, sunshine with visual impact

## Development Phases

### Phase 1: Technical Foundation ✅
- ✅ Set up React project with Three.js integration
- ✅ Implement PWA capabilities
- ✅ Create basic rendering pipeline
- ✅ Develop asset creation system

### Phase 2: Core Gameplay 🔄
- 🔄 Implement player movement (rollerblades)
- 🔄 Create basic world geometry
- ⬜ Develop collision detection
- ⬜ Implement simple delivery system

### Phase 3: Game Systems ⬜
- ⬜ Add progression system
- ⬜ Implement additional transportation methods
- ⬜ Develop NPC system
- ⬜ Create day/night and weather cycles

### Phase 4: Visual Enhancements 🔄
- ✅ Refine Ghibli-inspired shaders
- ✅ Implement lighting system
- ✅ Add visual effects (particle systems, transitions)
- 🔄 Optimize performance

### Phase 5: Viral Features & Polish ⬜
- ⬜ Add photo mode
- ⬜ Implement leaderboards
- ⬜ Develop custom mail creation system
- ⬜ Final optimizations and polish

## Technical Considerations

### Asset Creation Strategy
- **Building Creation**: 
  - Use Three.js BoxGeometry, CylinderGeometry for basic structures
  - Combine primitives to create complex buildings
  - Apply custom materials and shaders for Ghibli-style appearance
  
- **Character Creation**:
  - Use simplified geometries for character models
  - Focus on distinctive silhouettes rather than details
  - Apply toon shaders for Ghibli-like appearance
  
- **Environment Elements**:
  - Create trees using cylinder and sphere combinations
  - Generate terrain using mathematical functions and displacement
  - Design water effects with custom shaders

### Performance Optimization
- **Level of Detail (LOD)**: Simplify geometry for distant objects
- **Frustum Culling**: Only render what's in the camera view
- **Shader Optimization**: Efficient GLSL code
- **Geometry Instancing**: Reuse geometry for similar objects

### Browser Compatibility
- Target modern browsers with WebGL support
- Implement fallbacks where possible
- Test across Chrome, Firefox, Safari, Edge

### Offline Functionality
- Cache core game assets in service worker
- Allow limited gameplay without internet connection
- Save progress locally

## Code Structure

```
src/
├── components/         # React components
│   ├── UI/             # User interface components
│   ├── Game/           # Game-specific components
│   └── Effects/        # Visual effects components
├── hooks/              # Custom React hooks
├── game/               # Game logic
│   ├── engine/         # Core game engine
│   ├── world/          # World creation
│   ├── player/         # Player mechanics
│   ├── npc/            # NPC system
│   ├── delivery/       # Delivery mechanics
│   └── progression/    # Progression system
├── shaders/            # GLSL shader code
│   ├── toon/           # Cel-shading implementation
│   ├── outline/        # Outline effect
│   └── environment/    # Environmental effects
├── utils/              # Utility functions
├── assets/             # Code-generated assets
├── App.js              # Main application component
├── index.js            # Entry point
└── serviceWorker.js    # PWA service worker
```

## Code-based Asset Creation

### Building Creation Example
```javascript
function createGhibliBuilding(width, height, depth, colorPalette) {
  // Create main structure
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  const buildingMaterial = new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(colorPalette.base) },
      lightDirection: { value: new THREE.Vector3(0.5, 1, 0.8) }
    },
    vertexShader: toonVertexShader,
    fragmentShader: toonFragmentShader
  });
  
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  
  // Add roof
  const roofGeometry = new THREE.ConeGeometry(width * 0.7, height * 0.3, 4);
  const roofMaterial = new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(colorPalette.roof) },
      lightDirection: { value: new THREE.Vector3(0.5, 1, 0.8) }
    },
    vertexShader: toonVertexShader,
    fragmentShader: toonFragmentShader
  });
  
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = height / 2 + height * 0.15;
  roof.rotation.y = Math.PI / 4;
  
  // Create windows
  const windows = createWindows(width, height, depth, colorPalette.window);
  
  // Group all elements
  const buildingGroup = new THREE.Group();
  buildingGroup.add(building);
  buildingGroup.add(roof);
  buildingGroup.add(windows);
  
  return buildingGroup;
}
```

### Toon Shader Example
```glsl
// Vertex shader
const toonVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
const toonFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 lightDirection;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 light = normalize(lightDirection);
    
    float intensity = dot(normal, light);
    
    // Toon shading steps
    if (intensity > 0.95) intensity = 1.0;
    else if (intensity > 0.5) intensity = 0.7;
    else if (intensity > 0.25) intensity = 0.5;
    else intensity = 0.3;
    
    gl_FragColor = vec4(baseColor * intensity, 1.0);
  }
`;
```

## Testing Strategy

### Performance Testing
- FPS monitoring across different devices
- Memory usage optimization
- Load time benchmarking

### Gameplay Testing
- Core mechanics verification
- Edge case handling
- User experience assessment

### Browser Compatibility
- Cross-browser testing
- Mobile device testing
- PWA installation testing

## Deployment Strategy

### Development Environment
- Local development with hot reloading
- Version control with Git

### Staging
- Deployment to testing environment
- Performance and compatibility assessment

### Production
- Deployment to production hosting
- CDN integration for improved performance
- Analytics integration for user behavior tracking

## Resources

### Three.js Documentation
- Core Three.js concepts and implementations
- Shader programming guides

### React Three Fiber Resources
- Integration patterns
- Performance optimization techniques

### Ghibli Art Style References
- Color palette guides
- Animation principles
- Environmental design inspiration

## Timeline (Updated)

### Week 1-2: Foundation ✅
- ✅ Project setup and architecture
- ✅ Basic Three.js implementation
- ✅ Asset creation system development

### Week 3-4: Core Gameplay 🔄 (Current Focus)
- 🔄 Player movement implementation
- 🔄 World creation system
- ⬜ Basic delivery mechanics

### Week 5-6: Game Systems ⬜
- ⬜ Progression implementation
- ⬜ Transportation methods
- ⬜ NPC system

### Week 7-8: Polish & Optimization 🔄
- ✅ Shader development
- ✅ Lighting system
- ✅ Environment design
- 🔄 Performance optimization

### Week 9-10: Viral Features ⬜
- ⬜ Photo mode
- ⬜ Leaderboards
- ⬜ Final optimizations
- ⬜ PWA implementation

## Next Steps
1. Complete player movement system with rollerblade physics
2. Implement collision detection for buildings and environment
3. Develop the basic delivery system with package management
4. Create a simple navigation system with waypoints
5. Implement task completion verification
6. Continue optimizing performance for mobile devices

## Conclusion

This plan outlines the development approach for creating a Ghibli-inspired postal delivery game using React, Three.js, and PWA technologies. By following this structured approach and focusing on code-based asset creation, we can create an engaging and visually stunning game without relying on external assets while maintaining the charming Studio Ghibli aesthetic.

We have successfully completed the initial technical foundation and visual style implementation. The next phase will focus on core gameplay mechanics to make the game fully interactive and engaging.
