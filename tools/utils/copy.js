/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import { writeFile, copyFile, makeDir, copyDir } from './lib/fs';
import pkg from '../package.json';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy(buildDirectory) {
  await makeDir(buildDirectory);
  await Promise.all([
    writeFile(
      `${buildDirectory}/package.json`,
      JSON.stringify(
        {
          private: true,
          engines: pkg.engines,
          dependencies: pkg.dependencies,
          scripts: {
            start: 'node server.js',
          },
        },
        null,
        2,
      ),
    ),
    copyFile('LICENSE.txt', 'build/LICENSE.txt'),
    copyFile('yarn.lock', 'build/yarn.lock'),
    copyDir('public', `${buildDirectory}/public`),
  ]);
}

export default copy;
