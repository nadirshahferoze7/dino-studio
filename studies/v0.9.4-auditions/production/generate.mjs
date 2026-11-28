// Production only. Never imported by the review page.
import {Worker} from 'node:worker_threads';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), root=path.resolve(import.meta.dirname,'..');
const runtime=process.env.DINO_RUNTIME||import.meta.dirname;
const model=path.resolve(process.env.DINO_MODEL||path.join(runtime,'model'));
const pkg=path.dirname(require.resolve('@met4citizen/headtts/package.json'));
const spec=JSON.parse(fs.readFileSync(path.join(root,'spec.json')));
const argv=process.argv.slice(2), first=argv.includes('--first');
const jobs=spec.voices.flatMap(voice=>spec.lines.map(([intention,text],line)=>({voice,intention,text,line,key:`${voice}-${line+1}`}))).filter((_,i)=>!first||i===0);
const hash=b=>createHash('sha256').update(b).digest('hex');
const w=new Worker(path.join(pkg,'modules/worker-tts.mjs'));
const settings={transformersModule:'@huggingface/transformers',model,device:'cpu',dtype:'fp32',styleDim:256,frameRate:40,audioSampleRate:24000,languages:['en-us'],dictionaryPath:path.join(pkg,'dictionaries'),voicePath:path.join(model,'voices'),voices:spec.voices,deltaStart:-10,deltaEnd:0,trace:0};
let current;
function next(){current=jobs.shift();if(!current){w.terminate();return}const p=path.join(root,'timing',current.key+'.json');if(fs.existsSync(p)&&fs.existsSync(path.join(root,'audio',current.key+'.wav'))){console.log('Retained',current.key);next();return}console.log('Synthesize',current.key);w.postMessage({type:'synthesize',id:current.key,data:{input:current.text,voice:current.voice,language:'en-us',speed:1,audioEncoding:'wav'}})}
w.on('error',e=>{console.error(e);process.exit(1)});
w.on('message',m=>{if(m.type==='ready')next();else if(m.type==='error'){console.error(m);process.exit(1)}else if(m.type==='audio'){
 const d=m.data, wav=Buffer.from(d.audio);delete d.audio;
 if(wav.toString('ascii',0,4)!=='RIFF'||wav.length<48044||!d.visemes?.length)throw Error('Invalid synthesis');
 const durationMs=(wav.length-44)/48;
 const cues=d.visemes.map((id,i)=>({id,phoneme:d.phonemes[i],start:d.vtimes[i],duration:d.vdurations[i],pose:spec.poseMap[id]??0}));
 if(cues.some(c=>!Number.isFinite(c.start)||!Number.isFinite(c.duration)||c.start<0||c.duration<0||c.start+c.duration>durationMs+1))throw Error('Timing outside WAV');
 fs.mkdirSync(path.join(root,'audio'),{recursive:true});fs.mkdirSync(path.join(root,'timing'),{recursive:true});
 fs.writeFileSync(path.join(root,'audio',current.key+'.wav'),wav);
 fs.writeFileSync(path.join(root,'timing',current.key+'.json'),JSON.stringify({...current,model:spec.model,modelRevision:spec.modelRevision,engine:'HeadTTS 1.3.0',speed:1,sampleRate:24000,durationMs,wavSha256:hash(wav),timingSource:'Kokoro predicted token durations via HeadTTS; no acoustic forced alignment',cues,raw:d},null,2));
 console.log('Saved',current.key,wav.length,cues.length);next();
}});
w.postMessage({type:'connect',data:settings});
