"""Baut dist/udate_<version>.zip mit dem Quellcode (ohne node_modules, Builds, .env)."""
import json, os, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'node_modules', 'dist', '.next', 'coverage', 'generated', '.git', 'uploads-dev', '.turbo'}
SKIP_FILES = {'.env'}

version = json.load(open(os.path.join(ROOT, 'package.json')))['version']
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
out = os.path.join(ROOT, 'dist', f'udate_{version}.zip')
n = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
        for f in sorted(files):
            if f in SKIP_FILES or f.endswith('.log'):
                continue
            p = os.path.join(base, f)
            z.write(p, os.path.join('udate', os.path.relpath(p, ROOT)))
            n += 1
print(f'{out} ({n} Dateien)')
