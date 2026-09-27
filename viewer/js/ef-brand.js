const panel = document.getElementById('panel');
const toggle = document.getElementById('panel-toggle');
toggle.addEventListener('click', () => panel.classList.toggle('collapsed'));
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
let failed = false;
function updateStatus() {
  if (status.classList.contains('ok') && !ready) {
    ready = true;
    buttons.forEach(button => { button.disabled = false; });
    if (parent !== window) parent.postMessage({ type: 'ef3d:ready' }, '*');
  } else if (!ready && status.classList.contains('err')) {
    failed = true;
    const notice = document.getElementById('ef-engine-error');
    notice.hidden = false;
    notice.querySelector('span').textContent = document.getElementById('status-text').textContent.includes('WebGL2')
      ? 'This browser cannot start WebGL2. Try Chrome or Edge with graphics acceleration enabled, then reload this page.'
      : 'The 3D engine could not start. Check your connection and reload this page.';
    document.querySelector('.ef-actions').hidden = true;
    if (parent !== window) parent.postMessage({ type: 'ef3d:error' }, '*');
  }
}
new MutationObserver(updateStatus).observe(status, { attributes: true, attributeFilter: ['class'] });
updateStatus();
window.addEventListener('message', event => {
  if (parent !== window && event.source === parent && event.data?.type === 'ef3d:probe' && (ready || failed)) {
    parent.postMessage({ type: ready ? 'ef3d:ready' : 'ef3d:error' }, event.origin);
  }
});
