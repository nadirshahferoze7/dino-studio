from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib,sys
r=Path(sys.argv[1]);m=np.load(r/'landmark-experiment.npz')['frames']; W,H=640,576
im=Image.new('RGBA',(W*7,H*8))
for i,a in enumerate(m):im.paste(Image.fromarray(a),(i%7*W,i//7*H))
im.save(r/'motion.webp',quality=84,method=4,exact=True)
p=r/'manifest.json';d=json.loads(p.read_text());d['version']='v0.7.2';d['source']['file']='sources/rest-anchors.png';d['flowPairs']=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,3],[3,2],[2,1],[1,0]];d['flowExperimentStatus']='rejected for duplicated features; only contact evidence and reproducible script retained';d['motion']={'path':'motion.webp','columns':7,'frames':56,'pairs':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2],[2,1],[1,0]],'framesPerPair':7,'seconds':[.78,.95,1.10,1.20,1.20,1.05,.95,.78],'holds':[.6,.08,.72,.30,2.5,.25,.42,.08,.65],'method':'landmark-guided whole-image thin plate spline plus signed-distance silhouette blend','status':'experimental, visually approximate; not accepted as final'};d['anchorAtlas']={'path':'anchors.webp','columns':3,'frames':6};d['notes']='New native source: six complete original 3D-style rendered pose candidates, not approved canon. Registration by estimated hip anchor and fixed floor; near-native uniform scale 0.98–1.03. Runtime only displays full frames. No layered parts.';p.write_text(json.dumps(d,indent=2)+'\n')
