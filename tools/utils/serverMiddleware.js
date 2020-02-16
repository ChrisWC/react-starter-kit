import path from 'path';
import express from 'express';

export function serverMiddleware(serverPath) {
  const server = express();

  let initialized = false;
  async function load(deleteCache) {
    if (initialized) return;

    initialized = true;
    if (deleteCache) {
      console.log("DELETE CACHE")
      delete require.cache[require.resolve(serverPath)];
    }
    console.log("APP", serverPath)
    let app = require(serverPath).default;
    initialized = false;
    return app;
  }

  let instance = null;
  async function reload(deleteCache = false) {
    console.log("RELOAD QQQ")
    instance = null;
    let app = await load(deleteCache);
    server.use((req, res) => {
      app.handle(req, res);
    })
    instance = app;

    console.log(instance)
  }

  function update(fromUpdate = false) {
    const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
    if (!instance) return;
    if (!instance.hot) {
      throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
    }
    if (instance.hot.status() !== 'idle') {
      console.log("IDLE")
      return Promise.resolve();
    }
    return instance.hot
      .check(true)
      .then(updatedModules => {
        if (!updatedModules) {
          if (fromUpdate) {
            console.info(`${hmrPrefix}Update applied.`);
          }
          return;
        }
        if (updatedModules.length === 0) {
          console.info(`${hmrPrefix}Nothing hot updated.`);
        } else {
          console.info(`${hmrPrefix}Updated modules:`);
          updatedModules.forEach(moduleId =>
            console.info(`${hmrPrefix} - ${moduleId}`),
          );
          update(true);
        }
      })
      .catch(error => {
        console.log("ERROR", error)
        if (['abort', 'fail'].includes(instance.hot.status())) {
          console.log("RELOAD")
          reload(true);
          console.warn(`${hmrPrefix}App has been reloaded.`);
        }
      })
      // .then(reload);
  }

  function getInstance() {
    return instance;
  }

  return [getInstance, server, reload, update];
}
