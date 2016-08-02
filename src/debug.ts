import { isatty } from 'tty';
import readlineSync from 'readline-sync';

const DELIMITER = ', ';
const SPACE = ' ';

export let debug = (...args: string[]) => {
  let fd = (<{ fd: number }> <any> process.stdout).fd;
  if (!isatty(fd)) {
    console.log(`\nERROR: not a tty (process.stdout.fd === ${ fd })\n`);
    process.exit(0);
  }

  process.stdout.write(args.join(DELIMITER) + SPACE);
  readlineSync.prompt();
};
