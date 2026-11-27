import ctypes as C, ctypes.util, json, wave, pathlib, hashlib, subprocess, math
from PIL import Image
import numpy as np
P=pathlib.Path(__file__).resolve().parent
LINE="Hello! I'm Dino. Ready for an adventure?"
VOICES={'A':('en-us+m3',65,151),'B':('en-us+m4',77,175),'C':('en-us+f2',53,135)}
class ID(C.Union):
    _fields_=[('number',C.c_int),('name',C.c_char_p),('string',C.c_char*8)]
class Event(C.Structure):
    _fields_=[('type',C.c_int),('unique_identifier',C.c_uint),('text_position',C.c_int),('length',C.c_int),('audio_position',C.c_int),('sample',C.c_int),('user_data',C.c_void_p),('id',ID)]
lib=C.CDLL(ctypes.util.find_library('espeak'))
lib.espeak_Initialize.argtypes=[C.c_int,C.c_int,C.c_char_p,C.c_int]
rate=lib.espeak_Initialize(2,0,None,1)
assert rate>0
lib.espeak_SetVoiceByName.argtypes=[C.c_char_p]
lib.espeak_SetParameter.argtypes=[C.c_int,C.c_int,C.c_int]
CALL=C.CFUNCTYPE(C.c_int,C.POINTER(C.c_short),C.c_int,C.POINTER(Event))
lib.espeak_SetSynthCallback.argtypes=[CALL]
lib.espeak_Synth.argtypes=[C.c_void_p,C.c_size_t,C.c_uint,C.c_int,C.c_uint,C.c_uint,C.POINTER(C.c_uint),C.c_void_p]
manifest={'line':LINE,'engine':'eSpeak 1.48.15 local formant synthesis','sample_rate':rate,'voices':{},'status':'audition only; synthetic voice, approximate viseme mapping'}
for key,(voice,pitch,speed) in VOICES.items():
    pcm=[]; events=[]
    @CALL
    def cb(wav,n,ev):
        if wav and n: pcm.append(C.string_at(wav,n*2))
        if ev:
            i=0
            while ev[i].type:
                e=ev[i]
                if e.type==7: events.append({'ms':e.audio_position,'phoneme':bytes(e.id.string).decode('ascii','replace')})
                i+=1
        return 0
    lib.espeak_SetSynthCallback(cb)
    assert lib.espeak_SetVoiceByName(voice.encode())==0
    for param,value in [(1,speed),(2,100),(3,pitch),(4,45)]:assert lib.espeak_SetParameter(param,value,0)==0
    b=LINE.encode()+b'\0'; assert lib.espeak_Synth(b,len(b),0,1,0,1,None,None)==0
    data=b''.join(pcm); assert data and events
    samples=np.frombuffer(data,dtype='<i2'); assert np.max(np.abs(samples.astype(np.int32)))>1000
    wavpath=P/f'DINO_voice_{key}.wav'
    with wave.open(str(wavpath),'wb') as w:w.setparams((1,2,rate,0,'NONE','not compressed'));w.writeframes(data)
    mp3=P/f'DINO_voice_{key}.mp3'; subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wavpath),'-af','loudnorm=I=-18:TP=-2:LRA=7','-codec:a','libmp3lame','-b:a','96k',str(mp3)],check=True)
    manifest['voices'][key]={'voice':voice,'pitch':pitch,'speed':speed,'duration':len(samples)/rate,'peak':int(np.max(np.abs(samples.astype(np.int32)))),'events':events,'wav_sha256':hashlib.sha256(wavpath.read_bytes()).hexdigest(),'mp3_sha256':hashlib.sha256(mp3.read_bytes()).hexdigest()}
lib.espeak_Terminate()
print(json.dumps(manifest,indent=2))
(P/'DINO_v0.9.2_voice_manifest.json').write_text(json.dumps(manifest,indent=2))