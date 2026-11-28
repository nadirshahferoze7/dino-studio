"""Deterministic Kokoro style-vector interpolation, not mixed audio or pitch effects."""
from pathlib import Path
import numpy as np
import json,sys,hashlib
P=Path(__file__).resolve().parents[1]; spec=json.loads((P/'spec.json').read_text());model=Path(sys.argv[1] if len(sys.argv)>1 else P/'production/model');root=model/'voices';records=[]
for voice,recipe in spec['voiceRecipes'].items():
 if len(recipe)==1:continue
 sources=[(name,np.frombuffer((root/(name+'.bin')).read_bytes(),dtype='<f4').copy(),np.float32(weight)) for name,weight in recipe.items()]
 assert abs(sum(float(w) for _,_,w in sources)-1)<1e-6 and len({a.shape for _,a,_ in sources})==1
 result=np.zeros_like(sources[0][1])
 for name,a,weight in sources:result+=a*weight
 assert np.isfinite(result).all();b=result.astype('<f4').tobytes();target=root/(voice+'.bin')
 if target.exists():assert target.read_bytes()==b,'Existing embedding mismatch'
 else:target.write_bytes(b)
 records.append({'voice':voice,'recipe':recipe,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'sources':[{'voice':name,'sha256':hashlib.sha256((root/(name+'.bin')).read_bytes()).hexdigest()} for name,_,_ in sources]})
(P/'production/blend-lock.json').write_text(json.dumps({'method':'Weighted float32 interpolation at every token-length embedding; upstream Kokoro pipeline also supports mean blending. Re-synthesize each line; no waveform mixing.','upstreamReference':'https://github.com/hexgrad/kokoro/blob/main/kokoro/pipeline.py','variants':records},indent=2));print('Verified',len(records),'style blends')
