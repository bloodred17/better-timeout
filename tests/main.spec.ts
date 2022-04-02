import { CallbackArgs } from '../dist/simple-timeout';
import { Timeout } from '../src/main';

describe('Timeout instance', () => {
  let defaultTimeout: Timeout;

  // Act before assertions
  beforeAll(async () => {
    defaultTimeout = new Timeout(5000, {
      timeoutMessage: 'Test timeout',
      callbackFn: (args) => {
        console.log('Callback is called with message: ' + args.timeoutMessage);
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
    const result: CallbackArgs = await timeout.subscribe();
    expect(result.timeoutMessage).toBe('TIMEOUT');
    expect(result.status).toBe('triggered');
  });

  it('should be able to clear timeout before it is triggered', async () => {
    const timeout = new Timeout(2000);
    expect(timeout.status).toBe('set');
    timeout.clear();
    expect(timeout.status).toBe('cleared');
  });

  it('should triggered the timeout', async () => {
    const timeout = new Timeout(2000);
    expect(timeout.status).toBe('set');
    await timeout.subscribe();
    timeout.clear();
    expect(timeout.status).toBe('triggered');
  });

  it('should clear out the subscription if cleared', () => {
    const timeout = new Timeout(2000, {
      nullSubscription: true
    });
    expect(timeout.status).toBe('set');
    timeout.clear();
    expect(timeout.status).toBe('cleared');
    expect(timeout.subscribe()).toBe(null);
  });

  it('should trigger the callback when timed out', async () => {
    const timeoutMessage = 'Timed Out!';
    const timeout = new Timeout(2000, {
      timeoutMessage,
      callbackFn: (args) => {
        expect(args.timeoutMessage).toBe(timeoutMessage);
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
