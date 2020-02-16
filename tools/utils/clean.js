/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
function clean(directory) {
  return Promise.all([
    cleanDir(`${directory}/*`, {
      nosort: true,
      dot: true,
      ignore: [`${directory}/.git`],
    }),
  ]);
}

export default clean;
