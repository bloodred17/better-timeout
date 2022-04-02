export type Status = 'unset' | 'set' | 'cleared' | 'triggered';

export interface CallbackArgs {
  status: Status,
  timeoutMessage: string
}

export type Callback<T> = (arg: CallbackArgs) => T | Promise<T>;

export interface TimeoutOptions<T> {
  callbackFn?: Callback<T>,
  timeoutMessage?: string,
}

export class Timeout<T = void> {
  private _status: Status = 'unset';
  private timeout: NodeJS.Timeout;
  private readonly wrapper: Promise<CallbackArgs>;
  private readonly _timeoutOptions: TimeoutOptions<any> = {
    timeoutMessage: 'TIMEOUT',
    callbackFn: undefined,
  };

  constructor(timeMs: number, timeoutOptions?: TimeoutOptions<T>) {
    if (timeoutOptions) {
      this._timeoutOptions = { ...this._timeoutOptions, ...timeoutOptions };
    }
    this.wrapper = this.timeoutSetter(timeMs);

    if (this._timeoutOptions?.callbackFn) {
      this.wrapper
        .then((args: CallbackArgs) => this._timeoutOptions?.callbackFn(args))
        .catch((e) => console.log(e));
    }
  }

  get status(): string {
    return this._status;
  }

  private timeoutSetter(timeMs: number): Promise<CallbackArgs> {
    return new Promise<CallbackArgs>((resolve) => {
      if (this._status === 'unset') {
        this.timeout = setTimeout(() => {
          if (this._status === 'set') {
            this._status = 'triggered';
            const args: CallbackArgs = {
              status: this._status,
              timeoutMessage: this._timeoutOptions.timeoutMessage,
            }
            resolve(args);
          }
        }, timeMs);
        this._status = 'set';
      }
    });
  }

  clear<T>(onClear?: (arg: { status: string, timeoutMessage: string }) => T | Promise<T>) {
    if (this._status === 'set') {
      clearTimeout(this.timeout);
      this._status = 'cleared';
      if (onClear) {
        onClear({
          status: this.status,
          timeoutMessage: this._timeoutOptions.timeoutMessage
        });
      }
    }
  }

  subscribe(): Promise<CallbackArgs> {
    return this.wrapper;
  }
}
