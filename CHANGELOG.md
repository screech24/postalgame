# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-03-17

### Fixed
- Resolved compatibility issues between React 19 and React Three Fiber ecosystem
- Fixed module resolution errors with @react-three/fiber and @react-three/drei
- Ensured proper installation of dependencies with clean node_modules

## [0.3.0] - 2025-03-17

### Changed
- Updated Node.js from v18.17.0 to v22.14.0
- Updated npm from v9.6.7 to v10.9.2
- Updated React from v18.2.0 to v19.0.0
- Updated React DOM from v18.2.0 to v19.0.0
- Updated React Router DOM from v6.22.0 to v7.3.0
- Updated Three.js from v0.160.0 to v0.174.0
- Updated @react-three/fiber from v8.13.0 to v9.1.0
- Updated @react-three/drei from v9.80.0 to v10.0.4
- Updated all other dependencies to their latest versions

## [0.2.3] - 2025-03-17

### Fixed
- Fixed "curve.add is not a function" error in GameWorld.js by correctly implementing the curve creation logic
- Improved path generation code with proper CurvePath implementation
- Added comments for future path geometry enhancements

## [0.2.2] - 2025-03-17

### Fixed
- Fixed "Cannot read properties of undefined (reading 'ReactCurrentOwner')" error by downgrading React from v19 to v18.2.0
- Downgraded React Router DOM from v7.3.0 to v6.22.0 for compatibility with React 18

## [0.2.1] - 2025-03-17

### Added
- Updated development plan with progress tracking
- Added next steps section to development plan
- Marked completed features with checkmarks

### Changed
- Reorganized timeline to reflect current progress
- Updated phase status indicators

## [0.2.0] - 2025-03-17

### Added
- Ghibli-inspired 3D world with procedurally generated elements
- Custom toon shader for cel-shaded rendering
- Interactive home page with animated elements
- Settings page with game configuration options
- In-game HUD with mission tracking and compass
- Procedurally generated trees, houses, and terrain
- Water effects with transmission material
- Post-processing effects for enhanced visuals

## [0.1.0] - 2025-03-17

### Added
- Initial project setup with React, Three.js, and PWA capabilities
- Project structure following the development plan
- Basic configuration files (webpack, babel, etc.)
- PWA manifest and service worker setup
- README and documentation 