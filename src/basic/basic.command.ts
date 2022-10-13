import { Inject } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  async run(args: string[], options?: BasicCommandOptions): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(args, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(args, options.number);
    } else if (options?.string) {
      this.runWithString(args, options.string);
    } else {
      this.runWithNone(args);
    }
  }

  @Option({
    flags: '-n, --number <number>',
    description: 'A basic number parser',
  })
  public parseNumber(val: string): Number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  public parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  public parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  private runWithString(param: string[], option: string): void {
    this.logger.info({ param, string: option });
  }

  private runWithNumber(param: string[], option: number): void {
    this.logger.info({ param, number: option });
  }

  private runWithBoolean(param: string[], option: boolean): void {
    this.logger.info({ param, boolean: option });
  }

  private runWithNone(param: string[]): void {
    this.logger.info({ param });
  }
}
