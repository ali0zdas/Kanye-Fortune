// e2e/harness/browserMock.ts
// Comprehensive headless browser environment mocks for Web Audio, SpeechSynthesis, DOM, Storage, and Network

export interface AudioParamCall {
  method: string;
  args: number[];
  timestamp: number;
}

export class MockAudioParam {
  value: number;
  calls: AudioParamCall[] = [];

  constructor(defaultValue: number = 0) {
    this.value = defaultValue;
  }

  setValueAtTime(val: number, time: number) {
    this.value = val;
    this.calls.push({ method: 'setValueAtTime', args: [val, time], timestamp: Date.now() });
    return this;
  }

  exponentialRampToValueAtTime(val: number, time: number) {
    this.value = val;
    this.calls.push({ method: 'exponentialRampToValueAtTime', args: [val, time], timestamp: Date.now() });
    return this;
  }

  linearRampToValueAtTime(val: number, time: number) {
    this.value = val;
    this.calls.push({ method: 'linearRampToValueAtTime', args: [val, time], timestamp: Date.now() });
    return this;
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number) {
    this.value = target;
    this.calls.push({ method: 'setTargetAtTime', args: [target, startTime, timeConstant], timestamp: Date.now() });
    return this;
  }
}

export class MockAudioNode {
  connectedTo: MockAudioNode[] = [];

  connect(destination: MockAudioNode) {
    this.connectedTo.push(destination);
    return destination;
  }

  disconnect() {
    this.connectedTo = [];
  }
}

export class MockOscillatorNode extends MockAudioNode {
  type: OscillatorType = 'sine';
  frequency: MockAudioParam = new MockAudioParam(440);
  started: boolean = false;
  stopped: boolean = false;
  startTime: number | null = null;
  stopTime: number | null = null;

  start(time?: number) {
    this.started = true;
    this.startTime = time ?? 0;
  }

  stop(time?: number) {
    this.stopped = true;
    this.stopTime = time ?? 0;
  }
}

export class MockGainNode extends MockAudioNode {
  gain: MockAudioParam = new MockAudioParam(1);
}

export class MockBiquadFilterNode extends MockAudioNode {
  type: BiquadFilterType = 'lowpass';
  frequency: MockAudioParam = new MockAudioParam(350);
  Q: MockAudioParam = new MockAudioParam(1);
}

export class MockAudioBuffer {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  channels: Float32Array[];

  constructor(channels: number, length: number, sampleRate: number) {
    this.numberOfChannels = channels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.channels = Array.from({ length: channels }, () => new Float32Array(length));
  }

  getChannelData(channel: number): Float32Array {
    return this.channels[channel] || new Float32Array(this.length);
  }
}

export class MockAudioBufferSourceNode extends MockAudioNode {
  buffer: MockAudioBuffer | null = null;
  started: boolean = false;
  stopped: boolean = false;
  startTime: number | null = null;
  stopTime: number | null = null;

  start(time?: number) {
    this.started = true;
    this.startTime = time ?? 0;
  }

  stop(time?: number) {
    this.stopped = true;
    this.stopTime = time ?? 0;
  }
}

export class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime: number = 0;
  sampleRate: number = 44100;
  destination: MockAudioNode = new MockAudioNode();
  createdNodes: MockAudioNode[] = [];

  createOscillator(): MockOscillatorNode {
    const node = new MockOscillatorNode();
    this.createdNodes.push(node);
    return node;
  }

  createGain(): MockGainNode {
    const node = new MockGainNode();
    this.createdNodes.push(node);
    return node;
  }

  createBiquadFilter(): MockBiquadFilterNode {
    const node = new MockBiquadFilterNode();
    this.createdNodes.push(node);
    return node;
  }

  createBuffer(channels: number, length: number, sampleRate: number): MockAudioBuffer {
    return new MockAudioBuffer(channels, length, sampleRate);
  }

  createBufferSource(): MockAudioBufferSourceNode {
    const node = new MockAudioBufferSourceNode();
    this.createdNodes.push(node);
    return node;
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }

  async close(): Promise<void> {
    this.state = 'closed';
  }
}

export class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = 'en-US';
  pitch: number = 1.0;
  rate: number = 1.0;
  volume: number = 1.0;
  voice: SpeechSynthesisVoice | null = null;

  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((err: { error: string }) => void) | null = null;

  constructor(text: string = '') {
    this.text = text;
  }
}

export class MockSpeechSynthesis {
  speaking: boolean = false;
  paused: boolean = false;
  pending: boolean = false;
  currentUtterance: MockSpeechSynthesisUtterance | null = null;
  onvoiceschanged: (() => void) | null = null;

  private voices: SpeechSynthesisVoice[] = [
    { voiceURI: 'en-US-David', name: 'Microsoft David Desktop', lang: 'en-US', localService: true, default: true },
    { voiceURI: 'en-US-Guy', name: 'Microsoft Guy Online (Natural)', lang: 'en-US', localService: false, default: false },
    { voiceURI: 'en-US-Google', name: 'Google US English', lang: 'en-US', localService: false, default: false }
  ] as unknown as SpeechSynthesisVoice[];

  getVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  speak(utterance: MockSpeechSynthesisUtterance) {
    this.currentUtterance = utterance;
    this.speaking = true;
    if (utterance.onstart) utterance.onstart();
  }

  cancel() {
    if (this.currentUtterance && this.currentUtterance.onerror) {
      this.currentUtterance.onerror({ error: 'canceled' });
    }
    this.speaking = false;
    this.currentUtterance = null;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}

export class MockLocalStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

export class MockClipboard {
  private clipboardText: string = '';

  async writeText(text: string): Promise<void> {
    this.clipboardText = text;
  }

  async readText(): Promise<string> {
    return this.clipboardText;
  }
}

export class MockElement {
  tagName: string;
  attributes: Map<string, string> = new Map();
  dataset: Record<string, string> = {};
  style: Record<string, string> = {};
  classList: Set<string> = new Set();
  children: MockElement[] = [];
  parentElement: MockElement | null = null;
  textContent: string = '';
  innerHTML: string = '';

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this.dataset[key] = value;
    }
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      delete this.dataset[key];
    }
  }

  appendChild(child: MockElement) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  querySelector(selector: string): MockElement | null {
    const results = this.querySelectorAll(selector);
    return results[0] ?? null;
  }

  querySelectorAll(selector: string): MockElement[] {
    const matches: MockElement[] = [];
    const check = (el: MockElement) => {
      let isMatch = false;
      if (selector.startsWith('.')) {
        isMatch = el.classList.has(selector.slice(1));
      } else if (selector.startsWith('#')) {
        isMatch = el.getAttribute('id') === selector.slice(1);
      } else if (selector.startsWith('[')) {
        const attr = selector.slice(1, -1);
        if (attr.includes('=')) {
          const [k, v] = attr.split('=').map(s => s.replace(/['"]/g, ''));
          isMatch = el.getAttribute(k) === v;
        } else {
          isMatch = el.hasAttribute(attr);
        }
      } else {
        isMatch = el.tagName === selector.toUpperCase();
      }
      if (isMatch) matches.push(el);
      el.children.forEach(check);
    };

    this.children.forEach(check);
    return matches;
  }
}

export class MockDocument {
  documentElement: MockElement = new MockElement('html');
  body: MockElement = new MockElement('body');
  fonts: { ready: Promise<void> } = { ready: Promise.resolve() };

  constructor() {
    this.documentElement.appendChild(this.body);
  }

  createElement(tagName: string): MockElement {
    return new MockElement(tagName);
  }

  querySelector(selector: string): MockElement | null {
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector: string): MockElement[] {
    return this.documentElement.querySelectorAll(selector);
  }
}

export interface NetworkConfig {
  mode: 'online' | 'offline' | 'timeout' | 'error500';
  mockQuote?: string;
  delayMs?: number;
}

export class HeadlessEnvironment {
  audioContext: MockAudioContext | null = null;
  speechSynthesis: MockSpeechSynthesis = new MockSpeechSynthesis();
  localStorage: MockLocalStorage = new MockLocalStorage();
  clipboard: MockClipboard = new MockClipboard();
  document: MockDocument = new MockDocument();
  network: NetworkConfig = { mode: 'online', mockQuote: 'We are here to complete the revolution.' };

  setupGlobals() {
    const self = this;

    const defineGlobal = (name: string, value: unknown) => {
      try {
        Object.defineProperty(globalThis, name, {
          value,
          configurable: true,
          writable: true,
          enumerable: true
        });
      } catch {
        (globalThis as Record<string, unknown>)[name] = value;
      }
    };

    // Web Audio API
    const AudioCtxClass = class extends MockAudioContext {
      constructor() {
        super();
        self.audioContext = this;
      }
    };
    defineGlobal('AudioContext', AudioCtxClass);
    defineGlobal('webkitAudioContext', AudioCtxClass);

    // Speech API
    defineGlobal('speechSynthesis', this.speechSynthesis);
    defineGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);

    // Storage
    defineGlobal('localStorage', this.localStorage);

    // Navigator
    const mockNav = {
      onLine: this.network.mode !== 'offline',
      clipboard: this.clipboard,
      userAgent: 'Mozilla/5.0 Headless E2E KanyeFortune',
      canShare: (data?: { files?: unknown[] }) => Boolean(data),
      share: async () => {}
    };
    defineGlobal('navigator', mockNav);

    // Document & Window
    defineGlobal('document', this.document);
    defineGlobal('window', globalThis);

    // Fetch Interceptor
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as URL).toString();

      if (url.includes('api.kanye.rest')) {
        if (self.network.mode === 'offline') {
          throw new TypeError('Failed to fetch');
        }
        if (self.network.mode === 'timeout') {
          return new Promise((_, reject) => {
            if (init?.signal) {
              init.signal.addEventListener('abort', () => {
                const abortErr = new Error('The operation was aborted');
                abortErr.name = 'AbortError';
                reject(abortErr);
              });
            }
          });
        }
        if (self.network.mode === 'error500') {
          return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (self.network.delayMs && self.network.delayMs > 0) {
          await new Promise(r => setTimeout(r, self.network.delayMs));
        }

        if (url.endsWith('/quotes')) {
          return new Response(JSON.stringify([
            'We are here to complete the revolution.',
            'Believe in your flyness... conquer your shyness.',
            'Everything you do in life stems from either fear or love.'
          ]), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        if (url.endsWith('/text')) {
          return new Response(self.network.mockQuote || 'We are here to complete the revolution.', {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
          });
        }

        return new Response(JSON.stringify({
          quote: self.network.mockQuote || 'We are here to complete the revolution.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return originalFetch(input, init);
    };
  }

  reset() {
    this.network = { mode: 'online', mockQuote: 'We are here to complete the revolution.' };
    this.localStorage.clear();
    this.document = new MockDocument();
    (globalThis as unknown as { document: MockDocument }).document = this.document;
    if (this.audioContext) {
      this.audioContext.createdNodes = [];
    }
  }
}

export const env = new HeadlessEnvironment();
