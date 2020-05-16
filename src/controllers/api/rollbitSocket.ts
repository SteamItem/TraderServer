import * as WebSocket from "ws";

export class RollbitSocket {
  private channels: Map<any, any>;
  private socket: WebSocket;
  private connected: boolean;
  private queue: any[];

  constructor() {
    this.channels = new Map();
    this.socket = null;
    this.connected = false;
    this.queue = [];
  }

  public listen (ch: string, listener) {
    var chs = this.channels.get(ch);
    if (chs == null) {
      chs = [];
      this.channels.set(ch, chs);
    }
    chs.push(listener);

    return function () {
      var idx = chs.indexOf(listener);
      if (idx < 0) return;
      chs.splice(idx, 1);
    }
  }
  public async connect(cookie: string) {
    var that = this;
    if (that.socket) return;
    const url = 'https://ws.rollbit.com/';
    const options: WebSocket.ClientOptions = {
      origin: 'https://www.rollbit.com',
      headers: {
        'Host': 'ws.rollbit.com',
        'Connection': 'Upgrade',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Upgrade': 'websocket',
        'Origin': 'https://www.rollbit.com',
        'Sec-WebSocket-Version': '13',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cookie': cookie
      }
    };
    that.socket = new WebSocket(url, "optionalProtocol", options);
    that.socket.onmessage = (ev: WebSocket.MessageEvent) => {
      const [ch, message, id] = JSON.parse(ev.data.toString());
      var listeners = that.channels.get(ch);
      if (listeners && listeners.length)
        listeners.forEach(l => l(message));
    }
    that.socket.onopen = () => {
      that.connected = true;
      while (that.queue.length) {
        that.socket.send(that.queue.shift());
      }
    }
    that.socket.onclose = () => {
      that.connected = false;
    }
  }
  public disconnect() {
    this.connected = false;
    this.socket.terminate();
    this.socket = null;
  }
  public send(ch: string, message: string, cookie: string, immediate = false) {
    if (this.socket == null) this.connect(cookie);
    var id = Math.random().toString(36);
    const payload = JSON.stringify([ch, message, id]);
    const isConnected = this.socket.readyState === 1;
    if (immediate && !isConnected) return;
    if (!isConnected) return this.queue.push(payload);
    this.socket.send(payload);
  }
}