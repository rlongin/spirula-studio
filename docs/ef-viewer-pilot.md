# EF 3D Studio viewer pilot

The `ef/nexus-viewer` branch keeps the original Spirula trainer and WASM intact and adds an EF Ventures theme to the standalone viewer. `master` remains the upstream baseline. GPL source, build files, author credits and license links are available from the viewer's About page.

Serve the repository root as a static site and open `/viewer/`. For a GitHub Pages branch deployment, use `ef/nexus-viewer` and `/(root)`; the repository's existing `.nojekyll` preserves static files. The preview is a public tool shell containing no member data. The private Nexus route embeds it from a separate origin and sends no account token, profile, filename or file contents to it. Files chosen in the viewer stay in that browser.

Nexus route: `/platform/3d-studio`, on its separate feature branch. No Experience tile or production navigation is added in this pilot. Keep the viewer origin separate from Nexus; do not copy its code into the Nexus application bundle.

Validation: open the viewer, load the procedural demo, rotate/zoom, load a local model, open/close the mobile panel, and check the About/source links. Unsupported WebGL2 or a failed engine load must show an error. The parent recognizes readiness only from this iframe and its configured origin; an iframe load event alone is not success.

The native trainer, cloud GPU jobs, account storage, uploads and shared libraries are outside this pilot. Rollback is removing the Nexus route and stopping this new static preview deployment; it has no connection to StarNet, Ollama or the desktop runtime.
