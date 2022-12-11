import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  private logger = new Logger('RedisIoAdapter');
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => this.logger.error(err));
    subClient.on('error', (err) => this.logger.error(err));

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    port = parseInt(process.env.WS_PORT);
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
