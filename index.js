/* global document:true Raven:true fetch:true window:true */
/* eslint-disable no-console */

// View logs at https://sentry.io/spyscape/foo/
Raven
  .config('https://69efd013394848208f5da9dbae1809c8@sentry.io/290667')
  .install();

function fetchNoCatchHandler() {
  fetch('http://fooscape.bar');
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
}

function init() {
  setEventListners();
}

window.onunhandledrejection = function rejHandler(evt) {
  Raven.captureException(evt.reason);
};

document.addEventListener('DOMContentLoaded', init);
