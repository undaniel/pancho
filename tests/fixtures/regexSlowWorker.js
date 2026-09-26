'use strict';
const { parentPort } = require('worker_threads');

// Test fixture: simulates a heavy regex evaluation so cancellation can be observed.
parentPort.on('message', () => {
  const until = Date.now() + 300;
  while (Date.now() < until) {
    // busy loop
  }
  parentPort.postMessage({ matches: [] });
});
