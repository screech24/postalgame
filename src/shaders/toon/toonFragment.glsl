uniform vec3 baseColor;
uniform vec3 lightDirection;
uniform float steps;
uniform float outlineThickness;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 light = normalize(lightDirection);
  
  // Calculate diffuse lighting
  float intensity = dot(normal, light);
  
  // Cel shading with steps
  float numSteps = steps;
  intensity = ceil(intensity * numSteps) / numSteps;
  
  // Apply soft edge between steps
  float softEdge = 0.05;
  intensity = smoothstep(intensity - softEdge, intensity + softEdge, intensity);
  
  // Add ambient light to avoid completely dark areas
  float ambient = 0.5;
  intensity = max(intensity, ambient);
  
  // Apply color with increased brightness
  vec3 finalColor = baseColor * intensity * 1.2;
  
  // Add rim lighting for Ghibli-like effect
  float rimAmount = 0.8;
  vec3 viewDirection = normalize(-vPosition);
  float rimDot = 1.0 - max(0.0, dot(viewDirection, normal));
  float rimIntensity = smoothstep(0.5, 1.0, rimDot) * rimAmount;
  finalColor += vec3(1.0) * rimIntensity;
  
  // Add slight color boost to ensure color visibility
  finalColor = mix(finalColor, baseColor, 0.15);
  
  // Ensure colors don't get clamped too early
  finalColor = clamp(finalColor, vec3(0.1), vec3(1.0));
  
  gl_FragColor = vec4(finalColor, 1.0);
} 