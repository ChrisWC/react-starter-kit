/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import webpackConfig from './webpack.config';
import run, { format } from './run';
import clean from './clean';

import { serverMiddleware } from './utils/serverMiddleware';

const isDebug = !process.argv.includes('--release');

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it is your case (use true or interval in milliseconds)
  // poll: true,
  // Decrease CPU or memory usage in some file systems
  // ignored: /node_modules/,
};

function createCompilationPromise(name, compiler, config) {
  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap(name, stats => {
      if (stats.hasErrors()) {
        reject(new Error('Compilation failed!'));
      } else {
        resolve(stats);
      }
    });
  });
}

function configureWebpack() {
  // Configure client-side hot module replacement
  const clientConfig = webpackConfig.find(config => config.name === 'client');
  clientConfig.entry.client = ['./tools/lib/webpackHotDevClient']
    .concat(clientConfig.entry.client)
    .sort((a, b) => b.includes('polyfill') - a.includes('polyfill'));
  clientConfig.output.filename = clientConfig.output.filename.replace(
    'chunkhash',
    'hash',
  );
  clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace(
    'chunkhash',
    'hash',
  );
  clientConfig.module.rules = clientConfig.module.rules.filter(
    x => x.loader !== 'null-loader',
  );
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Configure server-side hot module replacement
  const serverConfig = webpackConfig.find(config => config.name === 'server');
  serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  serverConfig.output.hotUpdateChunkFilename =
    'updates/[id].[hash].hot-update.js';
  serverConfig.module.rules = serverConfig.module.rules.filter(
    x => x.loader !== 'null-loader',
  );
  serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const publicPath = clientConfig.output.publicPath;

  return {publicPath};
}

function bundle(webpackModule, name) {
  const compiler = webpackModule.compilers.find(
    compiler => compiler.name === name
  );

  const promise = createCompilationPromise(
    name,
    compiler
  );

  return [compiler, promise];
}
/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start(port, serverPath, options) {
  const [getInstance, middleware, reload, update] = serverMiddleware(serverPath);
  const {publicPath} = configureWebpack();

  // Configure compilation
  await run(clean);

  const webpackModule = webpack(webpackConfig);

  const [clientCompiler, clientPromise] = bundle(
    webpackModule,
    'client'
  );

  const [serverCompiler, serverPromise] = bundle(
    webpackModule,
    'server'
  )

  middleware.use(errorOverlayMiddleware());
  middleware.use(express.static(path.resolve(__dirname, '../public')));

  // https://github.com/webpack/webpack-dev-middleware
  const dm =  webpackDevMiddleware(clientCompiler, {
      publicPath,
      logLevel: 'silent',
      watchOptions,
    });

  // https://github.com/glenjamin/webpack-hot-middleware
  const hm = webpackHotMiddleware(clientCompiler, { log: false });

  middleware.use(dm);
  middleware.use(hm);

  serverCompiler.watch(watchOptions, (error, stats) => {
    console.log("HMMM")
    if (getInstance() && !error && !stats.hasErrors()) {
      update();
    }
  });

  // Wait until both client-side and server-side bundles are ready
  await clientPromise;
  await serverPromise;
  await reload();

  // Launch the development server with Browsersync and HMR
  await new Promise((resolve, reject) =>
    browserSync.create().init(
      {
        // https://www.browsersync.io/docs/options
        server: 'build/server.js',
        middleware: [middleware],
        open: !process.argv.includes('--silent'),
        ...(isDebug ? {} : { notify: false, ui: false }),
        ...(port ? { port } : null),
      },
      (error, bs) => (error ? reject(error) : resolve(bs)),
    ),
  );
}

export default start;
