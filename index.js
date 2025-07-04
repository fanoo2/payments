
// Root entry point for Fanno Payments API
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Fanno Payments API...');

// Change to the SDK directory and run the build process
const sdkPath = path.join(__dirname, 'payments', 'src', 'sdk');

console.log('📦 Installing dependencies...');
const install = spawn('npm', ['install'], { 
  cwd: sdkPath, 
  stdio: 'inherit' 
});

install.on('close', (code) => {
  if (code === 0) {
    console.log('🔨 Building TypeScript...');
    const build = spawn('npm', ['run', 'build'], { 
      cwd: sdkPath, 
      stdio: 'inherit' 
    });
    
    build.on('close', (buildCode) => {
      if (buildCode === 0) {
        console.log('✅ Build complete! Running SDK...');
        // The SDK exports types and functions, so we'll just demonstrate it's working
        console.log('SDK is ready to use. Import from: ./payments/src/sdk/dist/');
      } else {
        console.error('❌ Build failed');
        process.exit(1);
      }
    });
  } else {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
});
