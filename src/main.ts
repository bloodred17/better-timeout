export type Callback = (timeoutMessage: string) => void | Promise<void>;

export interface TimeoutOptions {
  callbackFn?: Callback,
  timeoutMessage?: string,
}

export class Timeout {
  private _status: 'unset' | 'set' | 'cleared' | 'triggered' = 'unset';
  private timeout: NodeJS.Timeout;
  private readonly wrapper: Promise<string>;
  private _timeoutOptions: TimeoutOptions;

  constructor(timeMs: number, timeoutOptions?: TimeoutOptions) {
    if (timeoutOptions) {
      this._timeoutOptions = timeoutOptions;
    }
    this._timeoutOptions = {};
    this._timeoutOptions.timeoutMessage = this._timeoutOptions?.timeoutMessage || 'TIMEOUT';

    this.wrapper = this.timeoutSetter(timeMs);

    if (this._timeoutOptions?.callbackFn) {
      this.wrapper
        .then((timeoutMessage: string) => {
          console.log(timeoutMessage);
          return timeoutMessage;
        })
        .then((timeoutMessage: string) => this._timeoutOptions?.callbackFn(timeoutMessage))
        .catch((e) => console.log(e));
    }
  }

  get status(): string {
    return this._status;
  }

  private timeoutSetter(timeMs: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.timeout = setTimeout(() => {
        this._status = 'triggered';
        resolve(this._timeoutOptions?.timeoutMessage);
      }, timeMs);
      this._status = 'set';
    });
  }

  clear(onClear?: () => void) {
    if (this._status === 'set') {
      clearTimeout(this.timeout);
      this._status = 'cleared';
      if (onClear) {
        onClear();
      }
    }
  }

  onResolve(): Promise<string> {
    if (this._status === 'set') {
      return this.wrapper;
    } else {
      throw new Error('onResolve cannot be used before the timeout status is "set"');
    }
  }
}
