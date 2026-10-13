(() => {
 const preview = document.querySelector('.therapy-entry-preview');
 if (!preview) return;
 const update = () => preview.classList.toggle('is-truncated', preview.scrollHeight > preview.clientHeight + 1);
 const observer = new ResizeObserver(update);
 observer.observe(preview);
 observer.observe(preview.querySelector('p'));
 document.fonts.ready.then(update);
 update();
})();
