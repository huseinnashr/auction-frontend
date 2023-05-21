export const supressMasonryErr = () => {
  window.addEventListener('error', e => {
    if (e.message === 'ResizeObserver loop limit exceeded') {
      const resizeObserverErrDiv = document.getElementById(
        'webpack-dev-server-client-overlay-div'
      );
      const resizeObserverErr = document.getElementById(
        'webpack-dev-server-client-overlay'
      );
      if (resizeObserverErr) {
        resizeObserverErr.setAttribute('style', 'display: none');
      }
      if (resizeObserverErrDiv) {
        resizeObserverErrDiv.setAttribute('style', 'display: none');
      }
    }
  });
}