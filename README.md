# Mail Messenger

A first-person postal delivery game in a Ghibli-inspired world, built with React, Three.js, and PWA technologies.

**Current Version:** 0.2.2

## Features

- 🎮 First-person gameplay with rollerblade movement
- 🏙️ Explore a hand-crafted Ghibli-inspired town
- 📦 Deliver mail and packages to town residents
- 🚲 Unlock new transportation methods (bikes, scooters, flying machines)
- 🌈 Beautiful cel-shaded visuals inspired by Studio Ghibli
- 📱 Progressive Web App for cross-platform play

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/screech24/postalgame.git
cd postalgame

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm start
```

This will start the development server at http://localhost:3000.

### Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Technical Details

- **Frontend Framework**: React
- **3D Rendering**: Three.js with React Three Fiber
- **Styling**: Styled Components
- **Routing**: React Router
- **PWA Support**: Service Workers with Workbox

## Project Structure

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
└── assets/             # Code-generated assets
```

## License

MIT

## Acknowledgements

- Inspired by the beautiful worlds of Studio Ghibli
- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- Shader techniques adapted from various Three.js community resources 