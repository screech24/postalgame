import * as THREE from 'three';

/**
 * District Manager for organizing the world into different areas
 * Manages district boundaries, types, and district-specific rules
 */
class DistrictManager {
  constructor(terrainSystem, options = {}) {
    this.terrainSystem = terrainSystem;
    this.options = {
      districtCount: options.districtCount || 4,
      ...options
    };
    
    // Define district types and their characteristics
    this.districtTypes = {
      RESIDENTIAL: {
        id: 'residential',
        name: 'Residential District',
        color: new THREE.Color('#4daf7c'),
        buildingDensity: 0.7,
        buildingHeight: { min: 1.5, max: 3 },
        treeDensity: 0.4,
        decorationDensity: 0.5,
        roofStyle: 'pitched',
        primaryColor: '#f6bd60', // Warm pastel
        secondaryColor: '#f7ede2', // Light pastel
        description: 'A peaceful neighborhood with homes and gardens'
      },
      COMMERCIAL: {
        id: 'commercial',
        name: 'Commercial District',
        color: new THREE.Color('#84a59d'),
        buildingDensity: 0.9,
        buildingHeight: { min: 3, max: 5 },
        treeDensity: 0.2,
        decorationDensity: 0.8,
        roofStyle: 'flat',
        primaryColor: '#f28482', // Reddish 
        secondaryColor: '#f5cac3', // Light red
        description: 'Busy area with shops and businesses'
      },
      RURAL: {
        id: 'rural',
        name: 'Rural District',
        color: new THREE.Color('#f6d186'),
        buildingDensity: 0.3,
        buildingHeight: { min: 1, max: 2 },
        treeDensity: 0.6,
        decorationDensity: 0.3,
        roofStyle: 'pitched',
        primaryColor: '#b5838d', // Muted purple
        secondaryColor: '#e5989b', // Light purple
        description: 'Countryside with farms and wide open spaces'
      },
      PARK: {
        id: 'park',
        name: 'Park District',
        color: new THREE.Color('#42a5f5'),
        buildingDensity: 0.1,
        buildingHeight: { min: 1, max: 1.5 },
        treeDensity: 0.8,
        decorationDensity: 0.6,
        roofStyle: 'pitched',
        primaryColor: '#caffbf', // Bright green 
        secondaryColor: '#9bf6ff', // Cyan
        description: 'Natural area with trees, ponds, and walking paths'
      }
    };
    
    // Districts contain position and radius information
    this.districts = [];
    
    // Initialize with some default districts
    if (options.autoInitialize !== false) {
      this.initializeDefaultDistricts();
    }
  }
  
  /**
   * Initialize default districts
   */
  initializeDefaultDistricts() {
    const { size } = this.terrainSystem;
    const districtCount = this.options.districtCount;
    const districtTypes = Object.values(this.districtTypes);
    
    // Create central district (post office)
    this.createDistrict({
      type: this.districtTypes.COMMERCIAL,
      center: new THREE.Vector3(0, 0, 0),
      radius: size * 0.1,
      importance: 1.0
    });
    
    // Create surrounding districts
    for (let i = 0; i < districtCount; i++) {
      const angle = (i / districtCount) * Math.PI * 2;
      const distance = size * 0.25;
      
      // Calculate district center - add some randomness
      const center = new THREE.Vector3(
        Math.cos(angle) * distance * (0.8 + Math.random() * 0.4),
        0,
        Math.sin(angle) * distance * (0.8 + Math.random() * 0.4)
      );
      
      // Get height at this position
      center.y = this.terrainSystem.getHeightAt(center.x, center.z);
      
      // Choose district type
      const districtType = districtTypes[i % districtTypes.length];
      
      // Create the district
      this.createDistrict({
        type: districtType,
        center: center,
        radius: size * (0.1 + Math.random() * 0.05), // Varying sizes
        importance: 0.7 + Math.random() * 0.3
      });
    }
  }
  
  /**
   * Create a new district
   */
  createDistrict(options) {
    const district = {
      id: `district_${this.districts.length}`,
      type: options.type,
      center: options.center.clone(),
      radius: options.radius,
      importance: options.importance || 0.5,
      buildings: [],
      decorations: []
    };
    
    this.districts.push(district);
    return district;
  }
  
  /**
   * Get district at a specific position
   */
  getDistrictAt(position) {
    // Check if position is inside any district
    for (const district of this.districts) {
      const distanceToCenter = new THREE.Vector2(
        position.x - district.center.x,
        position.z - district.center.z
      ).length();
      
      if (distanceToCenter <= district.radius) {
        return district;
      }
    }
    
    // Default to the nearest district
    return this.getNearestDistrict(position);
  }
  
  /**
   * Get the nearest district to a position
   */
  getNearestDistrict(position) {
    let nearestDistrict = null;
    let nearestDistance = Infinity;
    
    for (const district of this.districts) {
      const distanceToCenter = new THREE.Vector2(
        position.x - district.center.x,
        position.z - district.center.z
      ).length();
      
      if (distanceToCenter < nearestDistance) {
        nearestDistance = distanceToCenter;
        nearestDistrict = district;
      }
    }
    
    return nearestDistrict;
  }
  
  /**
   * Get the influence of a district at a position (for blending)
   * Returns a value between 0 and 1
   */
  getDistrictInfluence(district, position) {
    const distanceToCenter = new THREE.Vector2(
      position.x - district.center.x,
      position.z - district.center.z
    ).length();
    
    // If inside the district, influence is 1
    if (distanceToCenter <= district.radius) {
      return 1;
    }
    
    // Fade influence with distance
    const fadeDistance = district.radius * 0.5;
    const maxDistance = district.radius + fadeDistance;
    
    if (distanceToCenter >= maxDistance) {
      return 0;
    }
    
    // Linear falloff
    return 1 - ((distanceToCenter - district.radius) / fadeDistance);
  }
  
  /**
   * Get building parameters for a specific position
   * This factors in district type and terrain features
   */
  getBuildingParametersAt(position) {
    const district = this.getDistrictAt(position);
    
    if (!district) {
      return null;
    }
    
    const { type } = district;
    
    // Base parameters from district type
    const params = {
      height: THREE.MathUtils.lerp(
        type.buildingHeight.min,
        type.buildingHeight.max,
        Math.random()
      ),
      width: 2 + Math.random() * 1.5,
      depth: 2 + Math.random() * 1.5,
      roofHeight: 1 + Math.random() * 0.5,
      roofStyle: type.roofStyle,
      primaryColor: type.primaryColor,
      secondaryColor: type.secondaryColor,
      windows: 0.3 + Math.random() * 0.5, // Window probability
      district: district.id
    };
    
    // Modify based on distance from district center
    const distanceToCenter = new THREE.Vector2(
      position.x - district.center.x,
      position.z - district.center.z
    ).length();
    
    const distanceRatio = Math.min(distanceToCenter / district.radius, 1);
    
    // Buildings get smaller toward the edge of districts
    params.height *= (1 - distanceRatio * 0.3);
    
    // Add some subtle randomness to make buildings look more natural
    params.height *= 0.9 + Math.random() * 0.2;
    params.width *= 0.9 + Math.random() * 0.2;
    params.depth *= 0.9 + Math.random() * 0.2;
    
    return params;
  }
  
  /**
   * Determine if a building should be placed at a position
   */
  shouldPlaceBuildingAt(position) {
    const district = this.getDistrictAt(position);
    
    if (!district) {
      return false;
    }
    
    // Check terrain type
    const terrainType = this.terrainSystem.getTerrainTypeAt(position.x, position.z);
    if (terrainType === this.terrainSystem.terrainTypes.WATER ||
        terrainType === this.terrainSystem.terrainTypes.BEACH) {
      return false;
    }
    
    // Check slope
    const slope = this.terrainSystem.getSlopeAt(position.x, position.z);
    if (slope > 0.3) { // Too steep for buildings
      return false;
    }
    
    // Check building density for this district
    const { buildingDensity } = district.type;
    
    // Use some noise to determine building placement
    const noise = simplex2(position.x * 0.05, position.z * 0.05);
    const threshold = 1 - buildingDensity;
    
    return noise > threshold;
  }
  
  /**
   * Get decoration parameters for a position
   */
  getDecorationParametersAt(position) {
    const district = this.getDistrictAt(position);
    
    if (!district) {
      return null;
    }
    
    // Different decorations based on district type
    const decorationTypes = this.getDecorationTypesForDistrict(district.type);
    const decorationType = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];
    
    return {
      type: decorationType,
      scale: 0.8 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      district: district.id
    };
  }
  
  /**
   * Get decoration types appropriate for a district
   */
  getDecorationTypesForDistrict(districtType) {
    // Different decoration types based on district
    const decorations = {
      'residential': ['mailbox', 'garden', 'bench', 'lamppost', 'flower'],
      'commercial': ['sign', 'trash', 'lamppost', 'bench'],
      'rural': ['fence', 'well', 'hay', 'rock'],
      'park': ['bench', 'flower', 'bush', 'rock', 'lamppost']
    };
    
    return decorations[districtType.id] || ['rock', 'bush'];
  }
  
  /**
   * Determine if a tree should be placed at this position
   */
  shouldPlaceTreeAt(position) {
    const district = this.getDistrictAt(position);
    
    if (!district) {
      return false;
    }
    
    // Check terrain type
    const terrainType = this.terrainSystem.getTerrainTypeAt(position.x, position.z);
    if (terrainType === this.terrainSystem.terrainTypes.WATER) {
      return false;
    }
    
    // Tree density varies by district
    const { treeDensity } = district.type;
    
    // Use noise for natural clustering
    const noise = simplex2(position.x * 0.1, position.z * 0.1);
    const threshold = 1 - treeDensity;
    
    return noise > threshold;
  }
  
  /**
   * Get tree type for a position
   */
  getTreeTypeAt(position) {
    const district = this.getDistrictAt(position);
    
    if (!district) {
      return 'pine';
    }
    
    // Different tree types by district
    const treeTypes = {
      'residential': ['oak', 'maple', 'cherry'],
      'commercial': ['oak', 'decorative'],
      'rural': ['pine', 'oak', 'maple'],
      'park': ['oak', 'maple', 'pine', 'cherry', 'willow']
    };
    
    const availableTypes = treeTypes[district.type.id] || ['pine', 'oak'];
    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }
  
  /**
   * Helper function for simplex noise (placeholder)
   */
  simplex2(x, z) {
    // Placeholder for noise function
    // In real implementation, use a proper noise library
    return ((Math.sin(x * 13.74 + z * 8.51) + Math.cos(x * 7.23 - z * 11.32)) + 2) / 4;
  }
}

export default DistrictManager; 