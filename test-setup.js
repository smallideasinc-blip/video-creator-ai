#!/usr/bin/env node
// TEST SETUP SCRIPT
// Validates that all components are working correctly

const http = require('http');
const { spawn } = require('child_process');

let serverProcess;
const results = [];

function test(name, fn) {
  return fn()
    .then(() => {
      results.push({ name, status: '✅ PASS' });
      console.log(`✅ ${name}`);
    })
    .catch(err => {
      results.push({ name, status: '❌ FAIL: ' + err.message });
      console.log(`❌ ${name}: ${err.message}`);
    });
}

function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400 && res.statusCode !== 503) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Video Creator AI - Setup Tests\n');

  // Start server
  console.log('📌 Starting server...');
  serverProcess = spawn('node', ['server.js'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to start
  await new Promise(r => setTimeout(r, 3000));

  // Run tests
  await test('Server responds to /api/stats', () =>
    apiRequest('GET', '/api/stats')
      .then(res => {
        if (!res.data.status) throw new Error('Missing status field');
        if (typeof res.data.engines !== 'number') throw new Error('Missing engines count');
      })
  );

  await test('API Key configuration check', () =>
    apiRequest('GET', '/api/stats')
      .then(res => {
        if (!res.data.apiKeyConfigured) {
          throw new Error('API Key not configured in .env (add CLAUDE_API_KEY)');
        }
      })
  );

  await test('Platforms endpoint works', () =>
    apiRequest('GET', '/api/platforms')
      .then(res => {
        if (!Array.isArray(res.data.platforms)) throw new Error('Platforms not an array');
      })
  );

  await test('Publications endpoint works', () =>
    apiRequest('GET', '/api/publications')
      .then(res => {
        if (!Array.isArray(res.data.history)) throw new Error('History not an array');
      })
  );

  await test('Scripts endpoint works', () =>
    apiRequest('GET', '/api/scripts')
      .then(res => {
        if (!Array.isArray(res.data.scripts)) throw new Error('Scripts not an array');
      })
  );

  await test('Analyze trends endpoint accessible', () =>
    apiRequest('POST', '/api/analyze', {})
      .then(res => {
        // May fail if not configured, but should respond
        if (res.status === 503) throw new Error('API Key required');
      })
  );

  // Stop server
  console.log('\n📌 Stopping server...');
  serverProcess.kill();
  await new Promise(r => setTimeout(r, 500));

  // Print results
  console.log('\n📊 Test Summary:\n');
  results.forEach(r => console.log(`  ${r.status} ${r.name}`));

  const passed = results.filter(r => r.status.startsWith('✅')).length;
  const total = results.length;
  console.log(`\n${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your setup is ready.');
    console.log('\n📝 Next steps:');
    console.log('   1. Add your Claude API key to .env (see SETUP-API-KEY.md)');
    console.log('   2. Run: npm start');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. Click "Générer Script" to generate your first script!\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
