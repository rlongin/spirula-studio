const panel = document.getElementById('panel');
const toggle = document.getElementById('panel-toggle');
const buttons = ['ef-open', 'ef-browse', 'ef-demo'].map(id => document.getElementById(id));
if (matchMedia('(max-width: 820px)').matches) panel.classList.add('collapsed');
const syncPanel = () => toggle.setAttribute('aria-expanded', String(!panel.classList.contains('collapsed')));
new MutationObserver(syncPanel).observe(panel, { attributes: true, attributeFilter: ['class'] });
syncPanel();

for (const id of ['ef-open', 'ef-browse']) {
  const button = document.getElementById(id);
  button.addEventListener('pointerup', event => event.stopPropagation());
  button.addEventListener('click', () => document.getElementById('file-input').click());
}
const demo = document.getElementById('ef-demo');
demo.addEventListener('pointerup', event => event.stopPropagation());
demo.addEventListener('click', async () => {
  demo.disabled = true;
  try {
    const response = await fetch(new URL('../demo/ef-orbit.ply', import.meta.url));
    if (!response.ok) throw Error('Demo unavailable');
    await window.__viewer.load([new File([await response.blob()], 'EF Orbit.ply')]);
  } catch {
    document.getElementById('status-text').textContent = 'Demo could not load. Choose a model file to try again.';
  } finally { demo.disabled = false; }
});

const status = document.getElementById('status-dot');
let ready = false;
function updateStatus() {
  if (status.classList.contains('ok') && !ready) {
    ready = true;
    buttons.forEach(button => { button.disabled = false; });
    if (parent !== window) parent.postMessage({ type: 'ef3d:ready' }, '*');
  } else if (!ready && status.classList.contains('err')) {
    if (parent !== window) parent.postMessage({ type: 'ef3d:error' }, '*');
  }
}
new MutationObserver(updateStatus).observe(status, { attributes: true, attributeFilter: ['class'] });
updateStatus();
window.addEventListener('message', event => {
  if (parent !== window && event.source === parent && event.data?.type === 'ef3d:probe' && ready) {
    parent.postMessage({ type: 'ef3d:ready' }, event.origin);
  }
});
