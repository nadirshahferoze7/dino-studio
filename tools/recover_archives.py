"""Recover and verify original archive bytes from Git. Run from any directory."""
import argparse, hashlib, json, pathlib, shutil, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('--out',type=pathlib.Path,default=ROOT/'recovered')
p.add_argument('--verify-only',action='store_true')
args=p.parse_args()
def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
pending=[]
for a in json.loads((ROOT/'docs/archive_manifest.json').read_text())['archives']:
    r=a.get('repository')
    if not r:
        pending.append(a['filename']); continue
    parts=r.get('parts') or [{'path':r['path'],'bytes':r['bytes']}]
    h=hashlib.sha256()
    if not args.verify_only:
        args.out.mkdir(parents=True,exist_ok=True)
        dst=args.out/a['filename']
        out=dst.with_suffix('.zip.tmp').open('wb')
    else: out=None
    try:
        for part in parts:
            src=ROOT/part['path']
            assert src.stat().st_size==part['bytes'],src
            if 'sha256' in part: assert sha(src)==part['sha256'],src
            with src.open('rb') as f:
                for b in iter(lambda:f.read(1024*1024),b''):
                    h.update(b)
                    if out: out.write(b)
        assert h.hexdigest()==a['sha256'],a['filename']
    finally:
        if out: out.close()
    if not args.verify_only:
        tmp=dst.with_suffix('.zip.tmp')
        with zipfile.ZipFile(tmp) as z: assert z.testzip() is None,dst
        tmp.replace(dst)
    print('VERIFIED',a['filename'])
if pending:
    print('NOT YET IN GIT:',*pending,sep='\n')
    raise SystemExit(2)
