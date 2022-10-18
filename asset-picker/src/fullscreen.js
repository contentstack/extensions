(() => {
  function resizeCallback(entries) {
    const postRobot = window.postRobot;
    postRobot.sendToParent('frameResized', {
      height: entries[0].target.clientHeight + 40
    })
  }
  const resizeObserver = new ResizeObserver(resizeCallback);
  window.onload = () => {
    resizeObserver.observe(document.body);
  };

  window.onunload = () => {
    resizeObserver.disconnect();
  };
})();