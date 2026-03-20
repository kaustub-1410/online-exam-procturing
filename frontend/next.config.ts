import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    const projectRoot = process.cwd();
    const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
    
    // Force specific node_modules and solve casing
    config.resolve.modules = [nodeModulesPath, 'node_modules'];
    
    // Prevent multiple Three.js instances
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': path.resolve(nodeModulesPath, 'three'),
    };
    
    return config;
  },
};

export default nextConfig;
