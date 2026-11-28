// Production only: the review page never imports this model worker.
import {Worker} from 'node:worker_threads';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../v0.9.5-mentor/production/package.json',import.meta.url)), root=path.resolve(import.meta.dirname,'..');
const model=path.resolve(process.env.DINO_MODEL||path.join(import.meta.dirname,'model'));
const pkg=path.dirname(require.resolve('@met4citizen/headtts/package.json'));
const spec=JSON.parse(fs.readFileSync(path.join(root,'spec.json')));
const first=process.argv.includes('--first');
const jobs=spec.voices.flatMap(voice=>spec.lines.map(([intention,text],line)=>({voice,intention,text,line,key:`${voice}-${line+1}`}))).filter((_,i)=>!first||i===0);
const hash=b=>createHash('sha256').update(b).digest('hex');
function wav(pcm){const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(pcm.length+36,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(24000,24);header.writeUInt32LE(48000,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);return Buffer.concat([header,pcm])}
const w=new Worker(path.join(pkg,'modules/worker-tts.mjs'));
const settings={transformersModule:'@huggingface/transformers',model,device:'cpu',dtype:'fp32',styleDim:256,frameRate:40,audioSampleRate:24000,languages:['en-us'],dictionaryPath:path.join(pkg,'dictionaries'),voicePath:path.join(model,'voices'),voices:spec.voices,deltaStart:-10,deltaEnd:0,trace:0};
let current;
function next(){
 current=jobs.shift();if(!current){w.terminate();return}
 const jp=path.join(root,'timing',current.key+'.json'),wp=path.join(root,'audio',current.key+'.wav');
 if(fs.existsSync(jp)||fs.existsSync(wp)){
  if(!fs.existsSync(jp)||!fs.existsSync(wp))throw Error('Incomplete existing take; preserve and reconcile '+current.key);
  const m=JSON.parse(fs.readFileSync(jp));
  if(m.wavSha256!==hash(fs.readFileSync(wp))||m.text!==current.text||m.voice!==current.voice||m.modelRevision!==spec.modelRevision)throw Error('Existing take mismatch; do not overwrite '+current.key);
  console.log('Retained',current.key);next();return;
 }
 console.log('Synthesize',current.key);w.postMessage({type:'synthesize',id:current.key,data:{input:current.text.replaceAll('’',"'"),voice:current.voice,language:'en-us',speed:1,audioEncoding:'pcm'}});
}
w.on('error',e=>{console.error(e);process.exit(1)});
w.on('message',m=>{
 if(m.type==='ready')next();else if(m.type==='error'){console.error(m);process.exit(1)}else if(m.type==='audio'){
  const d=m.data, pcm=Buffer.from(d.audio);delete d.audio;
  if(pcm.length<48000||pcm.length%2||!d.visemes?.length)throw Error('Invalid PCM synthesis');
  const durationMs=pcm.length/48;
  const cues=d.visemes.map((id,i)=>({id,phoneme:d.phonemes[i],start:d.vtimes[i],duration:d.vdurations[i],pose:spec.poseMap[id]??0}));
  if(cues.some(c=>!Number.isFinite(c.start)||!Number.isFinite(c.duration)||c.start<0||c.duration<0||c.start+c.duration>durationMs+1))throw Error('Timing outside PCM');
  const b=wav(pcm);for(const dir of ['audio','timing'])fs.mkdirSync(path.join(root,dir),{recursive:true});
  fs.writeFileSync(path.join(root,'audio',current.key+'.wav'),b);
  fs.writeFileSync(path.join(root,'timing',current.key+'.json'),JSON.stringify({...current,label:spec.voiceLabels[current.voice],recipe:spec.voiceRecipes[current.voice],engineInput:current.text.replaceAll('’',"'"),model:spec.model,modelRevision:spec.modelRevision,engine:'HeadTTS 1.3.0',speed:1,sampleRate:24000,durationMs,wavSha256:hash(b),pcmSha256:hash(pcm),container:'Standard RIFF header around unchanged engine PCM; avoids upstream WAV header bug',timingSource:'Kokoro predicted token durations via HeadTTS; no acoustic forced alignment',cues,raw:d},null,2));
  console.log('Saved',current.key,b.length,cues.length);next();
 }
});
w.postMessage({type:'connect',data:settings});
