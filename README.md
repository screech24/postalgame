# Mail Messenger Game

A Studio Ghibli-inspired postal delivery game built with React, Three.js, and PWA capabilities.

## Current Version: 0.4.0

## About

Mail Messenger is a first-person postal delivery game set in a charming, Ghibli-inspired world. You play as a mail carrier tasked with delivering packages across a whimsical town, using rollerblades initially, with opportunities to unlock bikes, scooters, and even magical flying machines as you progress.

The game features:
- Ghibli-inspired cel-shaded visuals
- Procedurally generated environments with varying terrain
- District-based world organization (residential, commercial, rural, park)
- Path network system for natural roads and connections
- Delivery quests and navigation systems
- Character progression and unlockables

## Recent Updates

### Version 0.4.0 (2024-07-16)
- Implemented advanced terrain with hills, valleys, and plateaus
- Added path network system for meaningful roads connecting key locations
- Introduced district system for distinct areas with unique characteristics
- Enhanced environment with multiple tree types, rocks, plants, and decorations
- Optimized rendering with distance-based culling for better performance

### Version 0.3.3 (2024-07-15)
- Fixed critical runtime error when loading the game
- Improved instanced rendering implementation for trees
- Enhanced animation system stability

### Version 0.3.2 (2024-07-15)
- Fixed black colors issue in the world scene
- Improved performance when moving camera around
- Enhanced lighting system for better visuals
- Added instancing for trees and houses for better performance
- Implemented dynamic quality adjustment based on framerate

## Development

This project is built with:
- React for UI components
- Three.js for 3D rendering
- React Three Fiber to integrate Three.js with React
- Custom shaders for Ghibli-style rendering
- PWA capabilities for offline functionality

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Roadmap

See the [development plan](development-plan.md) for detailed information about the project's roadmap and progress.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the artistic style of Studio Ghibli
- Built with Three.js and React
- Special thanks to the React Three Fiber community 