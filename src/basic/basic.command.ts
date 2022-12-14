import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
  constructor(private readonly logger: Logger) {
    super();
  }

  async run(args: string[], options?: BasicCommandOptions): Promise<void> {
    const { boolean, number, string } = options;
    if (boolean) {
      this.runWithBoolean(args, options.boolean);
    }
    if (number) {
      this.runWithNumber(args, options.number);
    }
    if (string) {
      this.runWithString(args, options.string);
    }
    this.runWithNone(args);
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
    this.logger.log({ param, string: option });
  }

  private runWithNumber(param: string[], option: number): void {
    this.logger.log({ param, number: option });
  }

  private runWithBoolean(param: string[], option: boolean): void {
    this.logger.log({ param, boolean: option });
  }

  private runWithNone(param: string[]): void {
    this.logger.log({ param });
  }
}
