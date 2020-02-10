import * as commander from 'commander';

import cp from 'child_process';
import run from './run';
import copy from './copy';
import bundle from './bundle';
import render from './render';
import pkg from '../package.json';
import clean from './clean';
import start from './start';

const program = new commander.Command();

export function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
function timer() {
  const start = new Date();

  console.info(
    `[${format(start)}] Starting '${task.name}${
      options ? ` (${options})` : ''
    }'...`,
  );

  let isStopped = false;
  let duration = 0;
  const getTime = () => {
    if (!isStopped) {
      const end = new Date();
      duration = end.getTime() - start.getTime();
      console.info(
        `[${format(end)}] Finished '${task.name}${
          options ? ` (${options})` : ''
        }' after ${time} ms`,
      );
    }
  };

  const stop = () => {
    isStopped = true;
  };

  return () => {
    return {
      isStopped,
      getTime,
      stop,
    };
  };
}

// TODO replace run
program
  .command('clean')
  .description('clears out build directory')
  .action(() => {
    run(clean);
  });

program
  .command('run')
  .description('runs a command')
  .action(() => {});

program
  .command('copy')
  .option('-w --watch', 'watches files')
  .description('copies static files')
  .action(options => {
    const shouldWatch = options.watch;
    run(copy, options);
  });

program
  .command('bundle')
  .description('bundles project')
  .action(options => {});

program
  .command('build')
  .option('-s --static', 'render statically')
  .option('-d --docker', 'with docker')
  .description('builds a project')
  .action(async options => {
    await run(clean);
    await run(copy);
    await run(bundle);

    if (options.static) {
      await run(render);
    }

    if (options.docker) {
      cp.spawnSync('docker', ['build', '-t', pkg.name, '.'], {
        stdio: 'inherit',
      });
    }
  });

// TODO extract to a more performant way
let server;

program
  .command('start [port]')
  .option('-s, --silent', 'run quietly')
  .option('-c, --context', 'context/root')
  .action(async (port, options) => {
    if (server) return server;

    console.log('running', port, 'is silent ', options.silent);
    server = await start(port, options);
  });

program.parse(process.argv);

if (!(program.args && program.args.length)) program.help();
