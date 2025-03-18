import * as THREE from 'three';

/**
 * Path Network System for creating and managing roads, paths and routes
 * Handles path generation, finding routes between locations, and path mesh creation
 */
class PathNetwork {
  constructor(terrainSystem, options = {}) {
    this.terrainSystem = terrainSystem;
    this.options = {
      pathWidth: options.pathWidth || 2,
      mainRoadWidth: options.mainRoadWidth || 3.5,
      nodeSpacing: options.nodeSpacing || 5,
      ...options
    };
    
    // Key locations in the world
    this.locations = {};
    
    // Path nodes and connections
    this.nodes = [];
    this.connections = [];
    
    // Initialize with default town layout
    if (options.autoInitialize !== false) {
      this.initializeDefaultTownLayout();
    }
  }
  
  /**
   * Initialize a default town layout with post office in the center
   */
  initializeDefaultTownLayout() {
    // First find a suitable flat location for the post office
    const center = this.terrainSystem.findBuildingLocation(10, 0.08);
    
    // Add post office as central location
    this.addLocation('postOffice', {
      position: new THREE.Vector3(center.x, center.height, center.z),
      type: 'important',
      name: 'Post Office'
    });
    
    // Generate town districts around this center
    this.generateTownDistricts(center);
    
    // Create main roads from post office to districts
    this.createMainRoads();
    
    // Add smaller connecting paths
    this.createSecondaryPaths();
  }
  
  /**
   * Generate districts around town center
   */
  generateTownDistricts(center) {
    const districtTypes = ['residential', 'commercial', 'park', 'rural'];
    const districtCount = 4;
    const districtRadius = this.terrainSystem.size * 0.25;
    
    for (let i = 0; i < districtCount; i++) {
      const angle = (i / districtCount) * Math.PI * 2;
      const distanceFromCenter = districtRadius;
      
      // Calculate district center
      const x = center.x + Math.cos(angle) * distanceFromCenter;
      const z = center.z + Math.sin(angle) * distanceFromCenter;
      
      // Find a good location near this point
      const districtCenter = this.terrainSystem.findBuildingLocation(15, 0.1);
      
      // Add district center as a location
      const districtType = districtTypes[i % districtTypes.length];
      this.addLocation(`district_${districtType}`, {
        position: new THREE.Vector3(districtCenter.x, districtCenter.height, districtCenter.z),
        type: 'district',
        districtType: districtType,
        name: `${this.capitalizeFirstLetter(districtType)} District`
      });
    }
  }
  
  /**
   * Add a new location to the network
   */
  addLocation(id, locationData) {
    this.locations[id] = locationData;
    
    // Add a node at this location
    const node = {
      id: `node_${id}`,
      position: locationData.position.clone(),
      type: 'location',
      location: id
    };
    
    this.nodes.push(node);
    return node;
  }
  
  /**
   * Create main roads connecting post office to districts
   */
  createMainRoads() {
    const postOfficeNode = this.nodes.find(node => node.id === 'node_postOffice');
    
    if (!postOfficeNode) return;
    
    // Connect post office to each district
    Object.keys(this.locations).forEach(locationId => {
      if (locationId === 'postOffice') return;
      
      const locationNode = this.nodes.find(node => node.id === `node_${locationId}`);
      if (!locationNode) return;
      
      // Create a path between post office and district
      this.createPath(postOfficeNode, locationNode, {
        type: 'mainRoad',
        width: this.options.mainRoadWidth,
        subdivisions: 8
      });
    });
  }
  
  /**
   * Create additional secondary paths
   */
  createSecondaryPaths() {
    // Connect districts to each other to form a ring road
    const districtNodes = this.nodes.filter(node => node.id.includes('district'));
    
    if (districtNodes.length < 2) return;
    
    // Connect each district to the next one
    for (let i = 0; i < districtNodes.length; i++) {
      const currentNode = districtNodes[i];
      const nextNode = districtNodes[(i + 1) % districtNodes.length];
      
      this.createPath(currentNode, nextNode, {
        type: 'secondaryRoad',
        width: this.options.pathWidth,
        subdivisions: 6
      });
    }
    
    // TODO: Add more complex path network with smaller paths
  }
  
  /**
   * Create a path between two nodes
   */
  createPath(startNode, endNode, options = {}) {
    const { type = 'path', width = 2, subdivisions = 5 } = options;
    
    // Generate a bezier curve between nodes that follows terrain
    const pathPoints = this.generatePathPoints(startNode, endNode, subdivisions);
    
    // Create path connection
    const pathId = `path_${startNode.id}_${endNode.id}`;
    const path = {
      id: pathId,
      type,
      width,
      nodes: [startNode.id, endNode.id],
      points: pathPoints
    };
    
    this.connections.push(path);
    
    // Add intermediate nodes along path for more complex networks
    this.addIntermediateNodes(path);
    
    return path;
  }
  
  /**
   * Generate points along a path, following terrain contours
   */
  generatePathPoints(startNode, endNode, subdivisions) {
    const points = [];
    
    // Get start and end positions
    const start = startNode.position;
    const end = endNode.position;
    
    // Calculate distance and direction
    const direction = new THREE.Vector3().subVectors(end, start);
    const distance = direction.length();
    
    // Create a slightly curved path using a quadratic bezier curve
    // Find a control point perpendicular to the path
    const perpendicularDir = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
    const curveMagnitude = distance * 0.2; // How curved the path is
    
    // Offset the control point perpendicular to the path
    // Add some randomness to make paths more natural
    const randomOffset = (Math.random() - 0.5) * 2;
    const controlPoint = new THREE.Vector3()
      .addVectors(
        start,
        new THREE.Vector3()
          .addVectors(
            direction.clone().multiplyScalar(0.5),
            perpendicularDir.clone().multiplyScalar(curveMagnitude * randomOffset)
          )
      );
    
    // Create the bezier curve
    const curve = new THREE.QuadraticBezierCurve3(
      start.clone(),
      controlPoint,
      end.clone()
    );
    
    // Sample points along the curve
    const pointCount = subdivisions + 2; // Start, end + subdivisions
    
    for (let i = 0; i < pointCount; i++) {
      const t = i / (pointCount - 1);
      const point = curve.getPoint(t);
      
      // Adjust height to follow terrain with slight smoothing
      point.y = this.terrainSystem.getHeightAt(point.x, point.z) + 0.1; // Slightly above terrain
      
      points.push(point);
    }
    
    return points;
  }
  
  /**
   * Add intermediate nodes along a path
   */
  addIntermediateNodes(path) {
    const { points } = path;
    
    // Add a node at the midpoint of each path segment
    for (let i = 1; i < points.length - 1; i += 2) {
      const point = points[i];
      
      // Create a new node
      const node = {
        id: `node_path_${path.id}_${i}`,
        position: point.clone(),
        type: 'junction'
      };
      
      this.nodes.push(node);
    }
  }
  
  /**
   * Create geometry for all paths in the network
   */
  createPathsGeometry() {
    const geometries = [];
    
    // Create geometry for each path
    this.connections.forEach(path => {
      const geometry = this.createPathGeometry(path);
      geometries.push(geometry);
    });
    
    // Combine all geometries
    const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    
    return mergedGeometry;
  }
  
  /**
   * Create geometry for a single path
   */
  createPathGeometry(path) {
    const { points, width } = path;
    
    // Create a geometry for this path
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(
      curve,
      Math.max(points.length * 3, 12), // Segments - more for longer paths
      width / 2,
      8,
      false
    );
    
    return geometry;
  }
  
  /**
   * Get the nearest path point to a given position
   */
  getNearestPathPoint(position) {
    let nearestDistance = Infinity;
    let nearestPoint = null;
    let nearestPathId = null;
    
    // Check all paths
    this.connections.forEach(path => {
      path.points.forEach(point => {
        const distance = position.distanceTo(point);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = point;
          nearestPathId = path.id;
        }
      });
    });
    
    return { point: nearestPoint, distance: nearestDistance, pathId: nearestPathId };
  }
  
  /**
   * Find route between two locations
   */
  findRoute(startLocationId, endLocationId) {
    // Placeholder for path finding algorithm
    // A more sophisticated implementation would use A* or Dijkstra
    
    const startNode = this.nodes.find(node => node.id === `node_${startLocationId}`);
    const endNode = this.nodes.find(node => node.id === `node_${endLocationId}`);
    
    if (!startNode || !endNode) return null;
    
    // For now, just return a direct path between these locations
    return this.createPath(startNode, endNode, { type: 'route' });
  }
  
  /**
   * Helper function to capitalize first letter of a string
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export default PathNetwork; 