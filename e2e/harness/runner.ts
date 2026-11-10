// e2e/harness/runner.ts
// Test runner engine, lifecycle management, and colorized reporting

export interface TestCase {
  id: string;
  name: string;
  suitePath: string[];
  tier: number;
  fn: () => void | Promise<void>;
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  durationMs: number;
  error?: Error;
}

export interface TestSuite {
  name: string;
  parent?: TestSuite;
  tier: number;
  beforeAllFns: (() => void | Promise<void>)[];
  afterAllFns: (() => void | Promise<void>)[];
  beforeEachFns: (() => void | Promise<void>)[];
  afterEachFns: (() => void | Promise<void>)[];
  tests: TestCase[];
  subSuites: TestSuite[];
}

export interface RunnerOptions {
  tierFilter?: number;
  nameFilter?: string;
  verbose?: boolean;
}

export interface TierSummary {
  tier: number;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
}

class TestRegistry {
  private currentTier: number = 1;
  private rootSuite: TestSuite = {
    name: 'ROOT',
    tier: 1,
    beforeAllFns: [],
    afterAllFns: [],
    beforeEachFns: [],
    afterEachFns: [],
    tests: [],
    subSuites: []
  };
  private suiteStack: TestSuite[] = [this.rootSuite];

  setTier(tier: number) {
    this.currentTier = tier;
    if (this.currentSuite) {
      this.currentSuite.tier = tier;
    }
  }

  get currentSuite(): TestSuite {
    return this.suiteStack[this.suiteStack.length - 1];
  }

  describe(name: string, fn: () => void | Promise<void>) {
    const suite: TestSuite = {
      name,
      parent: this.currentSuite,
      tier: this.currentTier,
      beforeAllFns: [],
      afterAllFns: [],
      beforeEachFns: [],
      afterEachFns: [],
      tests: [],
      subSuites: []
    };
    this.currentSuite.subSuites.push(suite);
    this.suiteStack.push(suite);
    try {
      const res = fn();
      if (res && typeof (res as Promise<void>).then === 'function') {
        // Asynchronous describe not recommended, but handled
      }
    } finally {
      this.suiteStack.pop();
    }
  }

  test(name: string, fn: () => void | Promise<void>) {
    const suitePath = this.suiteStack.map(s => s.name).slice(1);
    const testCase: TestCase = {
      id: `${suitePath.join(' > ')} > ${name}`,
      name,
      suitePath,
      tier: this.currentSuite.tier || this.currentTier,
      fn,
      status: 'pending',
      durationMs: 0
    };
    this.currentSuite.tests.push(testCase);
  }

  it(name: string, fn: () => void | Promise<void>) {
    this.test(name, fn);
  }

  beforeEach(fn: () => void | Promise<void>) {
    this.currentSuite.beforeEachFns.push(fn);
  }

  afterEach(fn: () => void | Promise<void>) {
    this.currentSuite.afterEachFns.push(fn);
  }

  beforeAll(fn: () => void | Promise<void>) {
    this.currentSuite.beforeAllFns.push(fn);
  }

  afterAll(fn: () => void | Promise<void>) {
    this.currentSuite.afterAllFns.push(fn);
  }

  collectAllTests(): TestCase[] {
    const list: TestCase[] = [];
    const traverse = (suite: TestSuite) => {
      list.push(...suite.tests);
      suite.subSuites.forEach(traverse);
    };
    traverse(this.rootSuite);
    return list;
  }

  async run(options: RunnerOptions = {}): Promise<{ success: boolean; summaries: TierSummary[]; grandTotal: TierSummary }> {
    const chalk = {
      bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
      dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
      green: (s: string) => `\x1b[32m${s}\x1b[0m`,
      red: (s: string) => `\x1b[31m${s}\x1b[0m`,
      yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
      cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
      magenta: (s: string) => `\x1b[35m${s}\x1b[0m`,
      gray: (s: string) => `\x1b[90m${s}\x1b[0m`
    };

    console.log(chalk.bold(chalk.magenta('\n========================================================================')));
    console.log(chalk.bold(chalk.cyan('        KANYE FORTUNE (ORACLE OF YE) — HEADLESS E2E TEST RUNNER')));
    console.log(chalk.bold(chalk.magenta('========================================================================\n')));

    const tierNames: Record<number, string> = {
      1: 'Tier 1: Feature Coverage (28x5)',
      2: 'Tier 2: Boundary & Corner Cases',
      3: 'Tier 3: Cross-Feature Interactions',
      4: 'Tier 4: Real-World User Scenarios'
    };

    const summaries: Map<number, TierSummary> = new Map([
      [1, { tier: 1, name: tierNames[1], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 }],
      [2, { tier: 2, name: tierNames[2], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 }],
      [3, { tier: 3, name: tierNames[3], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 }],
      [4, { tier: 4, name: tierNames[4], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 }]
    ]);

    const runSuite = async (suite: TestSuite, activeBeforeEach: (() => void | Promise<void>)[] = [], activeAfterEach: (() => void | Promise<void>)[] = []) => {
      const currentBeforeEach = [...activeBeforeEach, ...suite.beforeEachFns];
      const currentAfterEach = [...suite.afterEachFns, ...activeAfterEach];

      // Run beforeAll
      for (const fn of suite.beforeAllFns) {
        await fn();
      }

      if (suite.name !== 'ROOT' && suite.tests.length > 0) {
        console.log(chalk.bold(chalk.cyan(`\n● [Tier ${suite.tier}] ${suite.suitePath ? suite.suitePath.join(' › ') + ' › ' : ''}${suite.name}`)));
      }

      // Run tests
      for (const t of suite.tests) {
        const summary = summaries.get(t.tier) || {
          tier: t.tier,
          name: `Tier ${t.tier}`,
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          durationMs: 0
        };
        summary.total++;

        // Filters
        if (options.tierFilter && t.tier !== options.tierFilter) {
          t.status = 'skipped';
          summary.skipped++;
          continue;
        }

        if (options.nameFilter && !t.id.toLowerCase().includes(options.nameFilter.toLowerCase())) {
          t.status = 'skipped';
          summary.skipped++;
          continue;
        }

        const start = performance.now();
        let testError: Error | undefined;

        try {
          for (const bf of currentBeforeEach) await bf();
          await t.fn();
          for (const af of currentAfterEach) await af();
          t.status = 'passed';
          summary.passed++;
        } catch (err) {
          t.status = 'failed';
          testError = err instanceof Error ? err : new Error(String(err));
          t.error = testError;
          summary.failed++;
        }

        const duration = Math.round(performance.now() - start);
        t.durationMs = duration;
        summary.durationMs += duration;

        if (t.status === 'passed') {
          console.log(`  ${chalk.green('✔')} ${chalk.gray(t.name)} ${chalk.dim(`(${duration}ms)`)}`);
        } else if (t.status === 'failed') {
          console.log(`  ${chalk.red('✖')} ${chalk.bold(chalk.red(t.name))} ${chalk.red(`(${duration}ms)`)}`);
          console.log(chalk.red(`    Error: ${testError?.message}`));
          if (options.verbose && testError?.stack) {
            console.log(chalk.dim(testError.stack.split('\n').slice(1, 5).join('\n')));
          }
        }
      }

      // Run subSuites
      for (const sub of suite.subSuites) {
        await runSuite(sub, currentBeforeEach, currentAfterEach);
      }

      // Run afterAll
      for (const fn of suite.afterAllFns) {
        await fn();
      }
    };

    const overallStart = performance.now();
    await runSuite(this.rootSuite);
    const totalDuration = Math.round(performance.now() - overallStart);

    // Print summary
    console.log(chalk.bold(chalk.magenta('\n------------------------------------------------------------------------')));
    console.log(chalk.bold('                       TIER SUMMARY BREAKDOWN'));
    console.log(chalk.bold(chalk.magenta('------------------------------------------------------------------------')));

    let grandPassed = 0;
    let grandFailed = 0;
    let grandTotal = 0;
    let grandSkipped = 0;

    const summaryList = Array.from(summaries.values());
    for (const s of summaryList) {
      grandPassed += s.passed;
      grandFailed += s.failed;
      grandTotal += s.total;
      grandSkipped += s.skipped;

      const statusColor = s.failed > 0 ? chalk.red : chalk.green;
      console.log(
        ` ${chalk.bold(s.name.padEnd(38))} ` +
        `Total: ${String(s.total).padStart(3)} | ` +
        `Passed: ${chalk.green(String(s.passed).padStart(3))} | ` +
        `Failed: ${s.failed > 0 ? chalk.red(String(s.failed).padStart(3)) : chalk.dim('  0')} | ` +
        `Time: ${s.durationMs}ms`
      );
    }

    const grandSummary: TierSummary = {
      tier: 0,
      name: 'GRAND TOTAL',
      total: grandTotal,
      passed: grandPassed,
      failed: grandFailed,
      skipped: grandSkipped,
      durationMs: totalDuration
    };

    console.log(chalk.bold(chalk.magenta('------------------------------------------------------------------------')));
    console.log(
      chalk.bold(
        ` ${'GRAND TOTAL'.padEnd(38)} ` +
        `Total: ${String(grandTotal).padStart(3)} | ` +
        `Passed: ${chalk.green(String(grandPassed).padStart(3))} | ` +
        `Failed: ${grandFailed > 0 ? chalk.red(String(grandFailed).padStart(3)) : chalk.green('  0')} | ` +
        `Time: ${totalDuration}ms`
      )
    );
    console.log(chalk.bold(chalk.magenta('========================================================================\n')));

    const success = grandFailed === 0 && grandPassed > 0;
    if (success) {
      console.log(chalk.bold(chalk.green('✅ ALL E2E TEST TIERS PASSED PERFECTLY!\n')));
    } else {
      console.log(chalk.bold(chalk.red(`❌ ${grandFailed} TEST(S) FAILED. CHECK DETAILS ABOVE.\n`)));
    }

    return {
      success,
      summaries: summaryList,
      grandTotal: grandSummary
    };
  }
}

export const registry = new TestRegistry();

export const describe = registry.describe.bind(registry);
export const it = registry.it.bind(registry);
export const test = registry.test.bind(registry);
export const beforeEach = registry.beforeEach.bind(registry);
export const afterEach = registry.afterEach.bind(registry);
export const beforeAll = registry.beforeAll.bind(registry);
export const afterAll = registry.afterAll.bind(registry);
export const setTier = registry.setTier.bind(registry);
