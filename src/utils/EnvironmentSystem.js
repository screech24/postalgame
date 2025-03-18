import * as THREE from 'three';

/**
 * Environment System for managing natural elements in the world
 * Handles generation and placement of trees, plants, rocks, etc.
 */
class EnvironmentSystem {
  constructor(terrainSystem, districtManager, options = {}) {
    this.terrainSystem = terrainSystem;
    this.districtManager = districtManager;
    this.options = {
      treeDensity: options.treeDensity || 0.5,
      rockDensity: options.rockDensity || 0.3,
      plantDensity: options.plantDensity || 0.6,
      decorationDensity: options.decorationDensity || 0.4,
      gridSize: options.gridSize || 5,
      ...options
    };
    
    // Store environment elements
    this.trees = [];
    this.rocks = [];
    this.plants = [];
    this.decorations = [];
    
    // Define tree types with their properties
    this.treeTypes = {
      pine: {
        trunkColor: '#8B4513',
        leavesColor: '#2d6a4f',
        trunkHeight: { min: 2, max: 4 },
        trunkRadius: { min: 0.15, max: 0.3 },
        leavesRadius: { min: 1.2, max: 2 },
        shape: 'cone'
      },
      oak: {
        trunkColor: '#8B4513',
        leavesColor: '#40916c',
        trunkHeight: { min: 1.5, max: 3 },
        trunkRadius: { min: 0.2, max: 0.4 },
        leavesRadius: { min: 1.5, max: 2.5 },
        shape: 'sphere'
      },
      maple: {
        trunkColor: '#A0522D',
        leavesColor: '#d8f3dc',
        trunkHeight: { min: 2, max: 3.5 },
        trunkRadius: { min: 0.15, max: 0.3 },
        leavesRadius: { min: 1.8, max: 2.8 },
        shape: 'sphere'
      },
      cherry: {
        trunkColor: '#A0522D',
        leavesColor: '#ffcfd2',
        trunkHeight: { min: 1.8, max: 2.8 },
        trunkRadius: { min: 0.15, max: 0.25 },
        leavesRadius: { min: 1.5, max: 2.2 },
        shape: 'sphere'
      },
      willow: {
        trunkColor: '#8B4513',
        leavesColor: '#95d5b2',
        trunkHeight: { min: 3, max: 4.5 },
        trunkRadius: { min: 0.2, max: 0.4 },
        leavesRadius: { min: 2, max: 3 },
        shape: 'weeping'
      },
      decorative: {
        trunkColor: '#8B4513',
        leavesColor: '#ff70a6',
        trunkHeight: { min: 1.5, max: 2.5 },
        trunkRadius: { min: 0.1, max: 0.2 },
        leavesRadius: { min: 1, max: 1.8 },
        shape: 'sphere'
      }
    };
    
    // Define rock types
    this.rockTypes = [
      {
        color: '#808080', // Gray
        size: { min: 0.3, max: 1.2 },
        shape: 'angular'
      },
      {
        color: '#A9A9A9', // Dark gray
        size: { min: 0.2, max: 0.9 },
        shape: 'smooth'
      },
      {
        color: '#D3D3D3', // Light gray
        size: { min: 0.4, max: 1.5 },
        shape: 'angular'
      },
      {
        color: '#A52A2A', // Brown
        size: { min: 0.3, max: 1.0 },
        shape: 'smooth'
      }
    ];
    
    // Define plant types
    this.plantTypes = [
      {
        type: 'flower',
        color: '#FF6347', // Red flower
        size: { min: 0.2, max: 0.4 },
        shape: 'flower'
      },
      {
        type: 'flower',
        color: '#FFD700', // Yellow flower
        size: { min: 0.2, max: 0.4 },
        shape: 'flower'
      },
      {
        type: 'bush',
        color: '#228B22', // Forest green
        size: { min: 0.5, max: 1.0 },
        shape: 'bush'
      },
      {
        type: 'grass',
        color: '#7CFC00', // Lawn green
        size: { min: 0.1, max: 0.3 },
        shape: 'grass'
      }
    ];
    
    // Define decoration types
    this.decorationTypes = {
      mailbox: {
        color: '#1E88E5', // Blue
        size: 0.5,
        shape: 'mailbox'
      },
      bench: {
        color: '#8B4513', // Wood
        size: 1.2,
        shape: 'bench'
      },
      lamppost: {
        color: '#212121', // Dark
        size: 2.0,
        shape: 'lamppost'
      },
      well: {
        color: '#795548', // Brown
        size: 1.0,
        shape: 'well'
      },
      fence: {
        color: '#A1887F', // Light brown
        size: 0.8,
        shape: 'fence'
      },
      sign: {
        color: '#FFEB3B', // Yellow
        size: 0.7,
        shape: 'sign'
      }
    };
  }
  
  /**
   * Generate environment elements throughout the world
   */
  generateEnvironment() {
    const size = this.terrainSystem.size;
    const gridSize = this.options.gridSize;
    
    // Clear previous elements
    this.trees = [];
    this.rocks = [];
    this.plants = [];
    this.decorations = [];
    
    // Use grid-based approach for efficient distribution
    for (let x = -size/2; x < size/2; x += gridSize) {
      for (let z = -size/2; z < size/2; z += gridSize) {
        // Add random offset within grid cell
        const offsetX = (Math.random() - 0.5) * gridSize * 0.8;
        const offsetZ = (Math.random() - 0.5) * gridSize * 0.8;
        
        const position = new THREE.Vector3(
          x + offsetX, 
          0, 
          z + offsetZ
        );
        
        // Get height at this position
        position.y = this.terrainSystem.getHeightAt(position.x, position.z);
        
        // Try to place environmental elements
        this.tryPlaceTree(position);
        this.tryPlaceRock(position);
        this.tryPlacePlant(position);
        this.tryPlaceDecoration(position);
      }
    }
    
    return {
      trees: this.trees,
      rocks: this.rocks,
      plants: this.plants,
      decorations: this.decorations
    };
  }
  
  /**
   * Try to place a tree at a position
   */
  tryPlaceTree(position) {
    // Skip if underwater
    if (this.terrainSystem.getTerrainTypeAt(position.x, position.z) === 'water') {
      return false;
    }
    
    // Check if we should place a tree here
    const shouldPlace = this.districtManager ? 
      this.districtManager.shouldPlaceTreeAt(position) : 
      Math.random() < this.options.treeDensity;
    
    if (!shouldPlace) {
      return false;
    }
    
    // Get tree type for this location
    const treeType = this.getTreeType(position);
    const treeProps = this.treeTypes[treeType];
    
    // Generate random properties for this tree
    const trunkHeight = this.randomRange(treeProps.trunkHeight);
    const trunkRadius = this.randomRange(treeProps.trunkRadius);
    const leavesRadius = this.randomRange(treeProps.leavesRadius);
    
    // Add some subtle variation to colors
    const trunkColor = this.varyColor(treeProps.trunkColor, 10);
    const leavesColor = this.varyColor(treeProps.leavesColor, 10);
    
    // Create tree object
    const tree = {
      position: position.clone(),
      type: treeType,
      trunkHeight,
      trunkRadius,
      leavesRadius,
      trunkColor,
      leavesColor,
      shape: treeProps.shape,
      animationOffset: Math.random()
    };
    
    this.trees.push(tree);
    return true;
  }
  
  /**
   * Try to place a rock at a position
   */
  tryPlaceRock(position) {
    // Skip if underwater or in water
    const terrainType = this.terrainSystem.getTerrainTypeAt(position.x, position.z);
    if (terrainType === 'water' || terrainType === 'beach') {
      return false;
    }
    
    // Mountains have more rocks
    let density = this.options.rockDensity;
    if (terrainType === 'mountain') {
      density *= 3;
    }
    
    // Check if we should place a rock here
    if (Math.random() > density) {
      return false;
    }
    
    // Pick a random rock type
    const rockType = this.rockTypes[Math.floor(Math.random() * this.rockTypes.length)];
    
    // Generate random properties for this rock
    const size = this.randomRange(rockType.size);
    const color = this.varyColor(rockType.color, 20);
    
    // Create rock object
    const rock = {
      position: position.clone(),
      size,
      color,
      shape: rockType.shape,
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI
      )
    };
    
    this.rocks.push(rock);
    return true;
  }
  
  /**
   * Try to place a plant at a position
   */
  tryPlacePlant(position) {
    // Skip if underwater
    const terrainType = this.terrainSystem.getTerrainTypeAt(position.x, position.z);
    if (terrainType === 'water') {
      return false;
    }
    
    // Different density by terrain type
    let density = this.options.plantDensity;
    if (terrainType === 'forest' || terrainType === 'grass') {
      density *= 2;
    } else if (terrainType === 'mountain' || terrainType === 'beach') {
      density *= 0.5;
    }
    
    // Check if we should place a plant here
    if (Math.random() > density) {
      return false;
    }
    
    // Pick a random plant type
    const plantType = this.plantTypes[Math.floor(Math.random() * this.plantTypes.length)];
    
    // Generate random properties for this plant
    const size = this.randomRange(plantType.size);
    const color = this.varyColor(plantType.color, 20);
    
    // Create plant object
    const plant = {
      position: position.clone(),
      type: plantType.type,
      size,
      color,
      shape: plantType.shape,
      rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0)
    };
    
    this.plants.push(plant);
    return true;
  }
  
  /**
   * Try to place a decoration at a position
   */
  tryPlaceDecoration(position) {
    // Skip if underwater
    if (this.terrainSystem.getTerrainTypeAt(position.x, position.z) === 'water') {
      return false;
    }
    
    // Check district influence
    if (!this.districtManager) {
      return false;
    }
    
    // Get decoration parameters
    const params = this.districtManager.getDecorationParametersAt(position);
    if (!params) {
      return false;
    }
    
    // Check slope
    const slope = this.terrainSystem.getSlopeAt(position.x, position.z);
    if (slope > 0.2) { // Too steep for decorations
      return false;
    }
    
    // Get decoration type information
    const decorationType = this.decorationTypes[params.type];
    if (!decorationType) {
      return false;
    }
    
    // Random density check
    if (Math.random() > this.options.decorationDensity) {
      return false;
    }
    
    // Create decoration object
    const decoration = {
      position: position.clone(),
      type: params.type,
      size: decorationType.size * params.scale,
      color: this.varyColor(decorationType.color, 10),
      shape: decorationType.shape,
      rotation: new THREE.Euler(0, params.rotation, 0)
    };
    
    this.decorations.push(decoration);
    return true;
  }
  
  /**
   * Get a tree type for the given position
   */
  getTreeType(position) {
    // If we have a district manager, use its tree type determination
    if (this.districtManager) {
      return this.districtManager.getTreeTypeAt(position);
    }
    
    // Otherwise pick one randomly
    const treeTypes = Object.keys(this.treeTypes);
    return treeTypes[Math.floor(Math.random() * treeTypes.length)];
  }
  
  /**
   * Get a random value in a range
   */
  randomRange(range) {
    return range.min + Math.random() * (range.max - range.min);
  }
  
  /**
   * Vary a color by a certain amount to add subtle variation
   */
  varyColor(baseColor, amount = 10) {
    // Convert hex to rgb
    const r = parseInt(baseColor.substr(1, 2), 16);
    const g = parseInt(baseColor.substr(3, 2), 16);
    const b = parseInt(baseColor.substr(5, 2), 16);
    
    // Add random variation
    const variance = amount;
    const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variance * 2));
    const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variance * 2));
    const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variance * 2));
    
    // Convert back to hex
    return '#' + 
      Math.floor(newR).toString(16).padStart(2, '0') +
      Math.floor(newG).toString(16).padStart(2, '0') +
      Math.floor(newB).toString(16).padStart(2, '0');
  }
  
  /**
   * Create a tree mesh based on a tree object
   */
  createTreeMesh(tree) {
    const group = new THREE.Group();
    
    // Create trunk
    const trunkGeometry = new THREE.CylinderGeometry(
      tree.trunkRadius, tree.trunkRadius * 1.2, 
      tree.trunkHeight, 8
    );
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
      color: tree.trunkColor,
      roughness: 0.8
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(0, tree.trunkHeight / 2, 0);
    group.add(trunk);
    
    // Create leaves based on shape
    let leavesGeometry;
    
    switch (tree.shape) {
      case 'cone':
        leavesGeometry = new THREE.ConeGeometry(
          tree.leavesRadius, tree.leavesRadius * 2, 8
        );
        break;
      case 'weeping':
        // Special case for weeping willow - use a modified sphere
        leavesGeometry = new THREE.SphereGeometry(
          tree.leavesRadius, 8, 8, 
          0, Math.PI * 2, 0, Math.PI * 0.6
        );
        break;
      case 'sphere':
      default:
        leavesGeometry = new THREE.SphereGeometry(
          tree.leavesRadius, 8, 8
        );
        break;
    }
    
    const leavesMaterial = new THREE.MeshStandardMaterial({ 
      color: tree.leavesColor,
      roughness: 0.7
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    
    // Position leaves based on shape
    if (tree.shape === 'weeping') {
      leaves.position.set(0, tree.trunkHeight - tree.leavesRadius * 0.5, 0);
      leaves.scale.set(1, 1.2, 1);
    } else if (tree.shape === 'cone') {
      leaves.position.set(0, tree.trunkHeight + tree.leavesRadius, 0);
    } else {
      leaves.position.set(0, tree.trunkHeight, 0);
    }
    
    group.add(leaves);
    
    // Position the tree at its location
    group.position.copy(tree.position);
    
    return group;
  }
  
  /**
   * Create a rock mesh based on a rock object
   */
  createRockMesh(rock) {
    let geometry;
    
    if (rock.shape === 'angular') {
      // Create an angular rock using a modified dodecahedron
      geometry = new THREE.DodecahedronGeometry(rock.size, 0);
      
      // Randomly scale vertices to make it more irregular
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        
        const scale = 0.8 + Math.random() * 0.4;
        
        posAttr.setXYZ(i, x * scale, y * scale, z * scale);
      }
      
      geometry.computeVertexNormals();
    } else {
      // Create a smooth rock using a sphere
      geometry = new THREE.SphereGeometry(rock.size, 6, 6);
      
      // Flatten it slightly
      geometry.scale(1, 0.7, 1);
    }
    
    const material = new THREE.MeshStandardMaterial({ 
      color: rock.color,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(rock.position);
    mesh.rotation.copy(rock.rotation);
    
    return mesh;
  }
  
  /**
   * Create a plant mesh based on a plant object
   */
  createPlantMesh(plant) {
    const group = new THREE.Group();
    
    switch (plant.shape) {
      case 'flower':
        // Create a flower with stem and petals
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, plant.size, 4);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: '#228B22' });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = plant.size / 2;
        group.add(stem);
        
        // Create petals
        const petalCount = 5;
        const petalSize = plant.size * 0.3;
        const petalGeometry = new THREE.CircleGeometry(petalSize, 5);
        const petalMaterial = new THREE.MeshStandardMaterial({ 
          color: plant.color,
          side: THREE.DoubleSide
        });
        
        for (let i = 0; i < petalCount; i++) {
          const petal = new THREE.Mesh(petalGeometry, petalMaterial);
          petal.position.y = plant.size;
          petal.rotation.x = Math.PI / 2;
          petal.rotation.y = (i / petalCount) * Math.PI * 2;
          petal.position.x = Math.sin(petal.rotation.y) * petalSize * 0.7;
          petal.position.z = Math.cos(petal.rotation.y) * petalSize * 0.7;
          group.add(petal);
        }
        
        // Center circle
        const centerGeometry = new THREE.CircleGeometry(petalSize * 0.4, 8);
        const centerMaterial = new THREE.MeshStandardMaterial({ 
          color: '#FFD700',
          side: THREE.DoubleSide
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = plant.size + 0.01;
        center.rotation.x = Math.PI / 2;
        group.add(center);
        break;
        
      case 'bush':
        // Create a bush with multiple spheres
        const segments = 4;
        const bushMaterial = new THREE.MeshStandardMaterial({ color: plant.color });
        
        for (let i = 0; i < 5; i++) {
          const radius = plant.size * (0.6 + Math.random() * 0.4);
          const bushGeometry = new THREE.SphereGeometry(radius, segments, segments);
          const bush = new THREE.Mesh(bushGeometry, bushMaterial);
          
          bush.position.set(
            (Math.random() - 0.5) * plant.size * 0.8,
            plant.size * (0.5 + Math.random() * 0.5),
            (Math.random() - 0.5) * plant.size * 0.8
          );
          
          bush.scale.y = 0.7 + Math.random() * 0.3;
          group.add(bush);
        }
        break;
        
      case 'grass':
        // Create grass blades
        const bladeCount = 7;
        const bladeMaterial = new THREE.MeshStandardMaterial({ 
          color: plant.color,
          side: THREE.DoubleSide
        });
        
        for (let i = 0; i < bladeCount; i++) {
          const height = plant.size * (0.8 + Math.random() * 0.4);
          const width = plant.size * 0.15;
          
          const bladeGeometry = new THREE.PlaneGeometry(width, height);
          const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
          
          blade.position.set(
            (Math.random() - 0.5) * plant.size * 0.8,
            height / 2,
            (Math.random() - 0.5) * plant.size * 0.8
          );
          
          blade.rotation.y = Math.random() * Math.PI;
          blade.rotation.x = (Math.random() - 0.5) * 0.2;
          group.add(blade);
        }
        break;
    }
    
    group.position.copy(plant.position);
    group.rotation.y = plant.rotation.y;
    
    return group;
  }
  
  /**
   * Create a decoration mesh based on a decoration object
   */
  createDecorationMesh(decoration) {
    const group = new THREE.Group();
    
    switch (decoration.shape) {
      case 'mailbox':
        // Create a mailbox (post with box on top)
        const postGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        const postMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.y = 0.4;
        group.add(post);
        
        const boxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: decoration.color });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.y = 0.9;
        group.add(box);
        break;
        
      case 'bench':
        // Create a simple bench
        const seatGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.4);
        const seatMaterial = new THREE.MeshStandardMaterial({ color: decoration.color });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = 0.35;
        group.add(seat);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        const legMaterial = new THREE.MeshStandardMaterial({ color: decoration.color });
        
        const leg1 = new THREE.Mesh(legGeometry, legMaterial);
        leg1.position.set(0.5, 0.15, 0.1);
        group.add(leg1);
        
        const leg2 = new THREE.Mesh(legGeometry, legMaterial);
        leg2.position.set(0.5, 0.15, -0.1);
        group.add(leg2);
        
        const leg3 = new THREE.Mesh(legGeometry, legMaterial);
        leg3.position.set(-0.5, 0.15, 0.1);
        group.add(leg3);
        
        const leg4 = new THREE.Mesh(legGeometry, legMaterial);
        leg4.position.set(-0.5, 0.15, -0.1);
        group.add(leg4);
        
        // Backrest
        const backGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.1);
        const back = new THREE.Mesh(backGeometry, seatMaterial);
        back.position.set(0, 0.55, -0.15);
        group.add(back);
        break;
        
      case 'lamppost':
        // Create a lamppost
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: '#212121' });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 1;
        group.add(pole);
        
        // Lamp head
        const headGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: decoration.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2;
        group.add(head);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMaterial = new THREE.MeshStandardMaterial({ 
          color: '#FFFF99',
          emissive: '#FFFFCC',
          emissiveIntensity: 0.5
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 1.9;
        group.add(light);
        break;
        
      default:
        // Default box representation for other types
        const defaultGeometry = new THREE.BoxGeometry(
          decoration.size, decoration.size, decoration.size
        );
        const defaultMaterial = new THREE.MeshStandardMaterial({ color: decoration.color });
        const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
        defaultMesh.position.y = decoration.size / 2;
        group.add(defaultMesh);
        break;
    }
    
    group.position.copy(decoration.position);
    group.rotation.y = decoration.rotation.y;
    
    return group;
  }
}

export default EnvironmentSystem; 