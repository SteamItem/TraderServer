import io from 'socket.io-client';
import { IDuelbitsOnAuth, IDuelbitsOnUserUpdate, IDuelbitsUserBase, IDuelbitsWithdrawResponse } from '../interfaces/duelbits';

export class DuelbitsSocket {
  private socket: SocketIOClient.Socket;
  private token: string;
  private user: IDuelbitsUserBase;

  private get connected(): boolean {
    return this.socket && this.socket.connected;
  }

  constructor(_token: string) {
    this.token = _token
  }

  public async connect(): Promise<SocketIOClient.Socket> {
    if (this.connected) return this.socket;
    this.socket = io.connect('https://ws.duelbits.com', {transports: ['websocket'], upgrade: false});
    this.registerEmitters();
    return this.socket;
  }

  public disconnect(): SocketIOClient.Socket {
    if (!this.connected) return this.socket;
    return this.socket.disconnect();
  }

  public withdraw(id: string, callback: (e: Error, t: IDuelbitsWithdrawResponse) => void): void {
    const withdrawRequest = {tradeUrl: this.user.tradeUrl, id}
    this.socket.emit('p2p:join', withdrawRequest, callback);
  }

  public onAuth(data: IDuelbitsOnAuth): void {
    console.debug(data);
  }

  public onUserUpdate(data: IDuelbitsOnUserUpdate): void {
    console.debug(data);
  }

  private registerEmitters() {
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', this.token, (data: IDuelbitsOnAuth) => {
        this.user = data;
        this.onAuth(data);
      });
    });
    this.socket.on('user:update', (data: IDuelbitsOnUserUpdate) => {
      this.user = data;
      this.onUserUpdate(data);
    });
  }
}