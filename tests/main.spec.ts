import { Timeout } from '../src/main';

describe('Timeout instance', () => {
  let defaultTimeout: Timeout;

  // Act before assertions
  beforeAll(async () => {
    defaultTimeout = new Timeout(5000, {
      timeoutMessage: 'Test timeout',
      callbackFn: (timeoutMessage: string) => {
        console.log('Callback is called with message: ' + timeoutMessage);
      }
    });
  });

  // // Teardown (cleanup) after assertions
  afterAll(() => {
    console.log(defaultTimeout.status);
  });

  // Assert if setTimeout was called properly
  it('should switch default timeout status to \'set\'', () => {
    expect(defaultTimeout.status).toBe('set');
  });

  it('should resolve after a set duration with default option', async () => {
    const timeout = new Timeout(2000);
    const result = await timeout.onResolve();
    expect(result).toBe('TIMEOUT');
  });

  it('should clear timeout before it is triggered', () => {
    const timeout = new Timeout(2000);
    expect(timeout.status).toBe('set');
    timeout.clear();
    expect(timeout.status).toBe('cleared');
  });

  it('should trigger the callback when timed out', async () => {
    const timeoutMessage = 'Timed Out!';
    const timeout = new Timeout(2000, {
      timeoutMessage,
      callbackFn: (message: string) => {
        expect(message).toBe(timeoutMessage);
      }
    });
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(3000);
    await expect(timeout.status).toBe('triggered');
  });

  it('should trigger the callback when cleared', () => {
    const timeout = new Timeout(2000);
    timeout.clear(() => {
      expect(timeout.status).toBe('cleared');
    });
  });
});
