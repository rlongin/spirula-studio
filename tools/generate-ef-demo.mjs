import { mkdirSync, writeFileSync } from 'node:fs';

const vertices = [], faces = [];
for (const [radius, height, color] of [[1.7, 0, [174, 143, 250]], [1.35, .62, [110, 127, 232]], [.95, 1.13, [116, 204, 226]]]) {
  const start = vertices.length, around = 32, tube = 8;
  for (let i = 0; i < around; i++) {
    const a = i * 2 * Math.PI / around;
    for (let j = 0; j < tube; j++) {
      const b = j * 2 * Math.PI / tube;
      vertices.push([(radius + .14 * Math.cos(b)) * Math.cos(a), (radius + .14 * Math.cos(b)) * Math.sin(a), height + .14 * Math.sin(b), ...color.map(c => Math.round(c * (.78 + .22 * Math.cos(a))))]);
    }
  }
  for (let i = 0; i < around; i++) for (let j = 0; j < tube; j++) {
    const a = start + i * tube + j, b = start + ((i + 1) % around) * tube + j;
    const c = start + ((i + 1) % around) * tube + (j + 1) % tube, d = start + i * tube + (j + 1) % tube;
    faces.push([a, b, c], [a, c, d]);
  }
}
const start = vertices.length;
for (const xyz of [[0, 0, 1.9], [.43, 0, .65], [0, .43, .65], [-.43, 0, .65], [0, -.43, .65], [0, 0, -.5]]) vertices.push([...xyz, 196, 178, 255]);
for (let i = 0; i < 4; i++) faces.push([start, start + 1 + i, start + 1 + (i + 1) % 4], [start + 5, start + 1 + (i + 1) % 4, start + 1 + i]);
const header = `ply\nformat ascii 1.0\ncomment EF Ventures procedural demo - GPL-3.0\nelement vertex ${vertices.length}\nproperty float x\nproperty float y\nproperty float z\nproperty uchar red\nproperty uchar green\nproperty uchar blue\nelement face ${faces.length}\nproperty list uchar int vertex_indices\nend_header\n`;
const target = new URL('../viewer/demo/ef-orbit.ply', import.meta.url);
mkdirSync(new URL('../viewer/demo/', import.meta.url), { recursive: true });
writeFileSync(target, header + vertices.map(v => v.slice(0, 3).map(x => x.toFixed(4)).concat(v.slice(3)).join(' ')).join('\n') + '\n' + faces.map(f => '3 ' + f.join(' ')).join('\n') + '\n');
