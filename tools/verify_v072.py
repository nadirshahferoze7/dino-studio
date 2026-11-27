"""Re-run recovered v0.7.2 QA without overwriting original evidence or validation.
CHROME_BIN=/path/to/chrome python tools/verify_v072.py [output-directory]
Dependencies: Python, Pillow, NumPy, OpenCV, Playwright, Chromium/Chrome, FFmpeg.
"""
import os, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
release=ROOT/'releases/v0.7.2'
out=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else release/'evidence/recovery-recheck').resolve()
source=(release/'test_render.py').read_text()
source=source.replace("executable_path='/usr/bin/chromium'", 'executable_path='+repr(os.environ.get('CHROME_BIN','/usr/bin/chromium')))
source=source.replace("(root/'validation.json').write_text", "(out/'validation.json').write_text")
sys.argv=[str(release/'test_render.py'),str(out)]
exec(compile(source,str(release/'test_render.py'),'exec'),{'__file__':str(release/'test_render.py'),'__name__':'__main__'})
