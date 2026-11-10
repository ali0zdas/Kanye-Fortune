#!/usr/bin/env node
// e2e/harness/run_e2e.js
// Main entrypoint for Kanye Fortune E2E test suite

import { env } from './browserMock.ts';
import { registry } from './runner.ts';

// Parse command-line arguments
const args = process.argv.slice(2);
let tierFilter;
let nameFilter;
let verbose = false;

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    tierFilter = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--filter=')) {
    nameFilter = arg.split('=')[1];
  } else if (arg === '--verbose' || arg === '-v') {
    verbose = true;
  }
}

// 1. Setup Headless Virtual Browser Environment
env.setupGlobals();

// 2. Load all 4 Tier Test Suites
async function main() {
  try {
    await import('../tier1_feature_coverage.spec.ts');
    await import('../tier2_boundary_corner.spec.ts');
    await import('../tier3_pairwise.spec.ts');
    await import('../tier4_real_world.spec.ts');

    const result = await registry.run({
      tierFilter,
      nameFilter,
      verbose
    });

    if (!result.success) {
      process.exit(1);
    }
  } catch (err) {
    console.error('\nFatal Error in Test Harness:', err);
    process.exit(1);
  }
}

main();
