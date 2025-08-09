#!/usr/bin/env node

/**
 * Smoke Test Suite
 * 
 * This script runs comprehensive smoke tests to validate that the payments service
 * is working correctly in a production-like environment.
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

class SmokeTest {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    this.timeout = parseInt(process.env.SMOKE_TEST_TIMEOUT) || 30000;
    this.serverProcess = null;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const responseData = body ? JSON.parse(body) : {};
            resolve({ status: res.statusCode, data: responseData, headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, data: body, headers: res.headers });
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async startServer() {
    console.log('🚀 Starting payments service...');
    
    const serverPath = path.join(__dirname, '../../payments/index.js');
    this.serverProcess = spawn('node', [serverPath], {
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'test' }
    });

    this.serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    // Wait for server to start
    let retries = 0;
    const maxRetries = 30;
    
    while (retries < maxRetries) {
      try {
        await this.makeRequest({ hostname: 'localhost', port: 5000, path: '/health', method: 'GET' });
        console.log('✅ Server started successfully');
        return;
      } catch (error) {
        retries++;
        await this.delay(1000);
      }
    }
    
    throw new Error('Server failed to start within timeout period');
  }

  async stopServer() {
    if (this.serverProcess) {
      console.log('🛑 Stopping payments service...');
      this.serverProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      await new Promise((resolve) => {
        this.serverProcess.on('exit', resolve);
        setTimeout(() => {
          this.serverProcess.kill('SIGKILL');
          resolve();
        }, 5000);
      });
    }
  }

  async testHealthEndpoint() {
    console.log('🏥 Testing health endpoint...');
    
    const response = await this.makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    });

    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }

    if (!response.data.status || response.data.status !== 'healthy') {
      throw new Error(`Health check returned invalid status: ${JSON.stringify(response.data)}`);
    }

    console.log('✅ Health endpoint passed');
    return true;
  }

  async testCreateSession() {
    console.log('💳 Testing create checkout session...');
    
    const testData = {
      amount: 1000,
      currency: 'usd'
    };

    const response = await this.makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/payments/create-session',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testData);

    if (response.status !== 200) {
      throw new Error(`Create session failed with status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    if (!response.data.sessionId) {
      throw new Error(`Create session response missing sessionId: ${JSON.stringify(response.data)}`);
    }

    console.log('✅ Create session endpoint passed');
    return true;
  }

  async testWebhookEndpoint() {
    console.log('🔗 Testing webhook endpoint...');
    
    const testData = {
      type: 'test.event',
      data: { test: true }
    };

    const response = await this.makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/payments/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testData);

    // Webhook should accept POST requests (even if they fail validation)
    if (response.status >= 500) {
      throw new Error(`Webhook endpoint server error: ${response.status}`);
    }

    console.log('✅ Webhook endpoint accessible');
    return true;
  }

  async runAllTests() {
    const startTime = Date.now();
    console.log('🎬 Starting smoke tests...\n');

    try {
      // Build the project first
      console.log('🔨 Building project...');
      await new Promise((resolve, reject) => {
        const buildProcess = spawn('npm', ['run', 'build'], { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../..')
        });
        
        buildProcess.on('exit', (code) => {
          if (code === 0) {
            console.log('✅ Build completed\n');
            resolve();
          } else {
            reject(new Error(`Build failed with exit code ${code}`));
          }
        });
      });

      // Start the server
      await this.startServer();
      
      // Run tests
      await this.testHealthEndpoint();
      await this.testCreateSession();
      await this.testWebhookEndpoint();
      
      const duration = Date.now() - startTime;
      console.log(`\n🎉 All smoke tests passed! (${duration}ms)`);
      
      return true;
    } catch (error) {
      console.error(`\n❌ Smoke tests failed: ${error.message}`);
      return false;
    } finally {
      await this.stopServer();
    }
  }
}

// Run smoke tests if this script is executed directly
if (require.main === module) {
  const smokeTest = new SmokeTest();
  
  smokeTest.runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SmokeTest;