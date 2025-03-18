# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2024-07-15

### Fixed
- Fixed black colors issue in the world scene by enhancing lighting system
- Improved performance when moving camera around with mouse
- Fixed shader rendering issues that caused black materials

### Added
- Added dynamic performance monitoring to adjust quality based on framerate
- Added instancing for trees and houses to improve rendering efficiency

### Changed
- Optimized renderer settings for better performance
- Enhanced toon shaders for better Ghibli-style visuals
- Reduced texture sizes and polygon counts for better performance
- Simplified path generation algorithm

## [0.3.1] - 2024-03-17

### Fixed
- Fixed React version compatibility issues
- Fixed path generation with proper curve implementation

### Added
- Added water effects with transmission material
- Added post-processing effects for enhanced visuals

### Changed
- Improved toon shader implementation
- Enhanced procedural generation of environment elements

## [0.3.0] - 2024-03-15

### Added
- Implemented Ghibli-inspired 3D world
- Added procedurally generated trees, houses, and terrain
- Added in-game HUD with mission tracking and compass

## [0.2.0] - 2024-03-10

### Added
- Added settings page with game configuration options
- Added interactive home page with animated elements

## [0.1.0] - 2024-03-05

### Added
- Initial project setup with React, Three.js, and PWA capabilities
- Basic rendering pipeline with custom shaders
- Custom toon shader for cel-shaded rendering 