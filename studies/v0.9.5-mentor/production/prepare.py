"""Download pinned open weights into a production runtime, verifying every byte hash."""
import pathlib,json,hashlib,subprocess,sys
p=pathlib.Path(__file__).resolve().parent; lock=json.loads((p/'model-lock.json').read_text());out=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else p/'model')
for f in lock['files']:
 target=out/f['path'];target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists() or hashlib.sha256(target.read_bytes()).hexdigest()!=f['sha256']:
  temp=target.with_suffix(target.suffix+'.part');url=f"https://huggingface.co/{lock['repository']}/resolve/{lock['revision']}/{f['path']}"
  subprocess.run(['curl','--fail','-L','--retry','2',url,'-o',str(temp)],check=True)
  assert temp.stat().st_size==f['bytes'] and hashlib.sha256(temp.read_bytes()).hexdigest()==f['sha256'];temp.replace(target)
 print('Verified',f['path'],f['bytes'])
