uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
uniform float time;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Normalized direction from bottom to top
  float h = normalize(vPosition).y;
  
  // Apply gradient with soft transition
  float t = max(0.0, min(1.0, (h - offset) * exponent));
  vec3 skyColor = mix(bottomColor, topColor, t);
  
  // Add subtle noise for texture
  float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233) * time)) * 43758.5453);
  noise = noise * 0.02 - 0.01; // Scale down for subtle effect
  
  // Add clouds (simplified)
  float cloudDensity = 0.0;
  if (h > 0.3) {
    // Simple cloud pattern
    float cloudPattern = sin(vUv.x * 10.0 + time * 0.1) * sin(vUv.y * 10.0 + time * 0.05) * 0.5 + 0.5;
    cloudDensity = smoothstep(0.5, 0.6, cloudPattern) * smoothstep(0.9, 0.4, h);
  }
  
  // Mix sky with clouds
  vec3 cloudColor = vec3(1.0, 1.0, 1.0);
  skyColor = mix(skyColor, cloudColor, cloudDensity);
  
  // Apply noise
  skyColor += vec3(noise);
  
  gl_FragColor = vec4(skyColor, 1.0);
} 