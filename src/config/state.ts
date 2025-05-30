export class ApplicationState {
  private static runningPort: string = '4000';

  static setPort(port: string) {
    this.runningPort = port;
  }

  static getPort(): string {
    return this.runningPort;
  }
}
