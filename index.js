/* global document:true Raven:true fetch:true window:true */
/* eslint-disable no-console */

// View logs at https://sentry.io/spyscape/foo/
Raven
  .config('https://69efd013394848208f5da9dbae1809c8@sentry.io/290667')
  .install();

function rejPromWith(param) {
  console.log('rejectPromiseWith: ', param);
  Promise.reject(param);
}

function fetchCatchHandler() {
  console.log('fetchCatchHandler');
  fetch('https://fooscape.bar')
    .catch((err) => {
      throw err;
    });
}

function fetchNoCatchHandler() {
  console.log('fetchNoCatchHandler');
  fetch('https://fooscape.bar');
}

function codeErrorHandler() {
  console.log('codeErrorHandler');
  // eslint-disable-next-line
  const bar = foo.baz.biz; // trigger out of bounds error
}

function manualErrorHandler() {
  console.log('manualErrorHandler');
  throw new Error('Custom Error!!');
}

function setEventListners() {
  const manualErrorBtn = document.getElementById('manual-error-btn');
  manualErrorBtn.addEventListener('click', manualErrorHandler);

  const codeErrorBtn = document.getElementById('code-error-btn');
  codeErrorBtn.addEventListener('click', codeErrorHandler);

  const fetchErrorBtn = document.getElementById('fetch-no-catch-btn');
  fetchErrorBtn.addEventListener('click', fetchNoCatchHandler);

  const fetchCatchBtn = document.getElementById('fetch-catch-btn');
  fetchCatchBtn.addEventListener('click', fetchCatchHandler);

  const rejPromiseBtnErr = document.getElementById('rej-prom-btn-error');
  rejPromiseBtnErr.addEventListener('click', () => rejPromWith(new Error('Promise rejected with Error')));

  const rejPromiseBtnObj = document.getElementById('rej-prom-btn-obj');
  rejPromiseBtnObj.addEventListener('click', () => rejPromWith({ msg: 'Promise rejected with an obj lit' }));

  const rejPromiseBtnStr = document.getElementById('rej-prom-btn-str');
  rejPromiseBtnStr.addEventListener('click', () => rejPromWith('Promise rejected with a string'));

  const rejPromiseBtnNull = document.getElementById('rej-prom-btn-null');
  rejPromiseBtnNull.addEventListener('click', () => rejPromWith(null));
}

function init() {
  console.log('0.0.1');
  setEventListners();
}

window.onunhandledrejection = function rejPromHandler(rejEvent) {
  if (rejEvent.reason instanceof Error) {
    console.log('rejEvent.reason is Error');
    Raven.captureException(rejEvent.reason);
    return undefined;
  }

  if (typeof rejEvent.reason === 'object') {
    console.log('rejEvent.reason is object');
    Raven.captureException(JSON.stringify(rejEvent.reason));
    return undefined;
  }

  Raven.captureException(rejEvent.reason);
  return undefined;
};

document.addEventListener('DOMContentLoaded', init);
