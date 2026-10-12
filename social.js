(() => {
  const dialogs = [...document.querySelectorAll('.product-dialog')];
  let opener = null;
  let previousHash = '';
  const open = (dialog, trigger) => {
    if (!dialog || dialog.open) return;
    dialogs.forEach(other => { if (other.open) other.close(); });
    opener = trigger || document.activeElement;
    previousHash = /^#(?:product|purchase)-/.test(location.hash) ? '#collection' : location.hash;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    history.replaceState(null, '', '#' + dialog.id);
  };
  document.querySelectorAll('.product-open').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      open(document.getElementById(trigger.getAttribute('aria-controls')), trigger);
    });
  });
  dialogs.forEach(dialog => {
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    let beganOnBackdrop = false;
    dialog.addEventListener('pointerdown', event => { beganOnBackdrop = event.target === dialog && outside(event, dialog); });
    dialog.addEventListener('click', event => { if (beganOnBackdrop && event.target === dialog && outside(event, dialog)) dialog.close(); });
    dialog.addEventListener('close', () => {
      if (dialogs.some(other => other.open)) return;
      document.body.classList.remove('dialog-open');
      if (location.hash === '#' + dialog.id || location.hash === '#purchase-' + dialog.id.split('-')[1]) {
        history.replaceState(null, '', location.pathname + location.search + previousHash);
      }
      if (opener && opener.isConnected && opener !== document.body) opener.focus({preventScroll:true});
    });
  });
  function outside(event, dialog) {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  }
  function openHash() {
    const match = location.hash.match(/^#(?:product|purchase)-(\d)$/);
    if (match) open(document.getElementById('product-' + match[1]), document.querySelector('[aria-controls="product-' + match[1] + '"]'));
  }
  window.addEventListener('hashchange', () => {
    if (/^#(?:product|purchase)-/.test(location.hash)) openHash();
    else dialogs.forEach(dialog => { if (dialog.open) dialog.close(); });
  });
  openHash();
})();
