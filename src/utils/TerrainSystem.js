import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

/**
 * Terrain System for generating and managing heightmap-based terrain
 * Provides utilities for elevation queries, terrain types, and more
 */
class TerrainSystem {
  constructor(options = {}) {
    this.size = options.size || 100;
    this.resolution = options.resolution || 128;
    this.maxHeight = options.maxHeight || 5;
    this.seed = options.seed || Math.random() * 1000;
    
    // Initialize noise generators with different seeds for variety
    this.noise = {
      elevation: new SimplexNoise(this.seed),
      roughness: new SimplexNoise(this.seed + 1),
      detail: new SimplexNoise(this.seed + 2),
      moisture: new SimplexNoise(this.seed + 3)
    };
    
    // Generate initial heightmap
    this.generateHeightmap();
    
    // Terrain types based on height and moisture
    this.terrainTypes = {
      WATER: 'water',
      BEACH: 'beach',
      GRASS: 'grass',
      FOREST: 'forest',
      MOUNTAIN: 'mountain',
      SNOW: 'snow'
    };
  }
  
  /**
   * Generate heightmap using layered noise functions
   */
  generateHeightmap() {
    const { resolution, size } = this;
    
    // Create height data array
    this.heightData = new Float32Array(resolution * resolution);
    
    // Generate height values using layered noise
    for (let z = 0; z < resolution; z++) {
      for (let x = 0; x < resolution; x++) {
        const worldX = (x / resolution) * size - size / 2;
        const worldZ = (z / resolution) * size - size / 2;
        
        // Calculate height at this position
        const height = this.calculateRawHeightAt(worldX, worldZ);
        
        // Store in heightmap
        this.heightData[z * resolution + x] = height;
      }
    }
  }
  
  /**
   * Calculate raw height at a world position using multiple noise layers
   */
  calculateRawHeightAt(x, z) {
    // Scale down coordinates for different noise frequencies
    const nx = x * 0.01;
    const nz = z * 0.01;
    
    // Base continent shape - large, smooth features
    const baseElevation = (this.noise.elevation.noise2D(nx * 0.5, nz * 0.5) + 1) * 0.5;
    
    // Hills and valleys - medium features
    const hills = (this.noise.roughness.noise2D(nx, nz) + 1) * 0.5 * 0.5;
    
    // Small details
    const details = this.noise.detail.noise2D(nx * 2, nz * 2) * 0.25;
    
    // Combine layers
    let height = baseElevation * this.maxHeight * 0.7;
    height += hills * this.maxHeight * 0.25;
    height += details * this.maxHeight * 0.05;
    
    // Add plateaus and flattened areas
    const flatteningThreshold = 0.6;
    if (baseElevation > flatteningThreshold) {
      const flatteningFactor = (baseElevation - flatteningThreshold) / (1 - flatteningThreshold);
      height = height * (1 - flatteningFactor * 0.4) + flatteningFactor * this.maxHeight * 0.7;
    }
    
    // Create water level by flattening lower areas
    const waterLevel = this.maxHeight * 0.25;
    if (height < waterLevel) {
      const waterFactor = 1 - (height / waterLevel);
      height = height * (1 - waterFactor * 0.5) + waterFactor * (waterLevel * 0.8);
    }
    
    return height;
  }
  
  /**
   * Get interpolated height at any world position
   */
  getHeightAt(x, z) {
    const { resolution, size } = this;
    
    // Convert world position to heightmap coordinates
    const hx = ((x + size / 2) / size) * (resolution - 1);
    const hz = ((z + size / 2) / size) * (resolution - 1);
    
    // Get grid cell indices
    const x0 = Math.floor(hx);
    const z0 = Math.floor(hz);
    const x1 = Math.min(x0 + 1, resolution - 1);
    const z1 = Math.min(z0 + 1, resolution - 1);
    
    // Calculate fractional parts for interpolation
    const fx = hx - x0;
    const fz = hz - z0;
    
    // Get height values at grid corners
    const h00 = this.heightData[z0 * resolution + x0] || 0;
    const h01 = this.heightData[z1 * resolution + x0] || 0;
    const h10 = this.heightData[z0 * resolution + x1] || 0;
    const h11 = this.heightData[z1 * resolution + x1] || 0;
    
    // Bilinear interpolation
    const hx0 = h00 * (1 - fx) + h10 * fx;
    const hx1 = h01 * (1 - fx) + h11 * fx;
    
    return hx0 * (1 - fz) + hx1 * fz;
  }
  
  /**
   * Get terrain type at position based on height and other factors
   */
  getTerrainTypeAt(x, z) {
    const height = this.getHeightAt(x, z);
    const moisture = this.getMoistureAt(x, z);
    
    const waterLevel = this.maxHeight * 0.25;
    const beachLevel = waterLevel + 0.2;
    const mountainLevel = this.maxHeight * 0.7;
    const snowLevel = this.maxHeight * 0.8;
    
    if (height < waterLevel) return this.terrainTypes.WATER;
    if (height < beachLevel) return this.terrainTypes.BEACH;
    if (height > snowLevel) return this.terrainTypes.SNOW;
    if (height > mountainLevel) return this.terrainTypes.MOUNTAIN;
    
    // Forests are grassy areas with high moisture
    return moisture > 0.6 ? this.terrainTypes.FOREST : this.terrainTypes.GRASS;
  }
  
  /**
   * Get moisture value at position (for determining vegetation)
   */
  getMoistureAt(x, z) {
    const nx = x * 0.02;
    const nz = z * 0.02;
    return (this.noise.moisture.noise2D(nx, nz) + 1) * 0.5;
  }
  
  /**
   * Get slope steepness at position (for path placement, building placement)
   */
  getSlopeAt(x, z, sampleDistance = 1) {
    const h = this.getHeightAt(x, z);
    const hN = this.getHeightAt(x, z - sampleDistance);
    const hS = this.getHeightAt(x, z + sampleDistance);
    const hE = this.getHeightAt(x + sampleDistance, z);
    const hW = this.getHeightAt(x - sampleDistance, z);
    
    const gradX = (hE - hW) / (2 * sampleDistance);
    const gradZ = (hS - hN) / (2 * sampleDistance);
    
    return Math.sqrt(gradX * gradX + gradZ * gradZ);
  }
  
  /**
   * Get normal vector at position (for lighting, placement)
   */
  getNormalAt(x, z, sampleDistance = 1) {
    const h = this.getHeightAt(x, z);
    const hN = this.getHeightAt(x, z - sampleDistance);
    const hS = this.getHeightAt(x, z + sampleDistance);
    const hE = this.getHeightAt(x + sampleDistance, z);
    const hW = this.getHeightAt(x - sampleDistance, z);
    
    const normal = new THREE.Vector3(hW - hE, 2 * sampleDistance, hN - hS).normalize();
    return normal;
  }
  
  /**
   * Create a mesh geometry from the heightmap
   */
  createTerrainGeometry() {
    const { resolution, size } = this;
    
    // Create plane geometry with subdivisions
    const geometry = new THREE.PlaneGeometry(
      size, 
      size, 
      resolution - 1, 
      resolution - 1
    );
    
    // Rotate to horizontal plane
    geometry.rotateX(-Math.PI / 2);
    
    // Apply heightmap to vertices
    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
      const x = Math.floor(j % resolution);
      const z = Math.floor(j / resolution);
      vertices[i + 1] = this.heightData[z * resolution + x];
    }
    
    // Update normals
    geometry.computeVertexNormals();
    
    return geometry;
  }
  
  /**
   * Find a flat area suitable for building placement
   */
  findBuildingLocation(minSize = 5, maxSlope = 0.1) {
    // Implementation will search for flat areas that meet criteria
    // This is a placeholder for the concept
    const attempts = 100;
    
    for (let i = 0; i < attempts; i++) {
      // Random position within terrain bounds
      const x = (Math.random() - 0.5) * this.size * 0.8;
      const z = (Math.random() - 0.5) * this.size * 0.8;
      
      // Check if area is flat enough
      const slope = this.getSlopeAt(x, z);
      const terrainType = this.getTerrainTypeAt(x, z);
      
      if (slope < maxSlope && 
          terrainType !== this.terrainTypes.WATER && 
          terrainType !== this.terrainTypes.BEACH) {
        
        // Check surrounding area is also suitable
        let suitable = true;
        
        // Sample multiple points in the area
        for (let dx = -minSize/2; dx <= minSize/2; dx += minSize/4) {
          for (let dz = -minSize/2; dz <= minSize/2; dz += minSize/4) {
            const sx = x + dx;
            const sz = z + dz;
            
            const localSlope = this.getSlopeAt(sx, sz);
            const localType = this.getTerrainTypeAt(sx, sz);
            
            if (localSlope > maxSlope || 
                localType === this.terrainTypes.WATER || 
                localType === this.terrainTypes.BEACH) {
              suitable = false;
              break;
            }
          }
          if (!suitable) break;
        }
        
        if (suitable) {
          return { x, z, height: this.getHeightAt(x, z) };
        }
      }
    }
    
    // Fallback - return a default location
    return { x: 0, z: 0, height: this.getHeightAt(0, 0) };
  }
}

export default TerrainSystem; 