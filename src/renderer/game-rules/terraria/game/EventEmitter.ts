class EventEmitter {
  _events: Record<string, ((data: any) => void)[]> = {};
  dispatch(event: string, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback: any) => callback(data));
  }
  subscribe(event: string, callback: (data: any) => any) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  }
  unsubscribe(event: string) {
    if (!this._events[event]) return;
    delete this._events[event];
  }

  unsubscribeFromAll() {
    this._events = {};
  }
}

export default new EventEmitter();
