// Static playback only; no AI engine/model dependency.
const $=id=>document.getElementById(id),audios=[$('audio-a'),$('audio-b')],videos=[$('video-a'),$('video-b')],all=[...audios,...videos];let run=null,metadata;
const labels=['A · current voice','B · Michael-led candidate'];
function status(s){$('status').textContent=s}
function reset(){run=null;$('compare').textContent='Play the opening: A → B'}
function stop(except){for(const m of all)if(m!==except)m.pause()}
for(const m of all){m.addEventListener('play',()=>{if(run&&m!==audios[run.index])reset();stop(m);status(m===audios[0]||m===videos[0]?labels[0]:labels[1])});m.addEventListener('error',()=>{reset();status('Media could not load. Try reloading or use the WAV master.');});}
async function opening(index,token){if(run?.token!==token)return;run.index=index;const a=audios[index];stop(a);a.currentTime=0;status('Opening comparison · '+labels[index]);try{await a.play()}catch{reset();status('Tap the audio play control to continue.')}}
for(const [i,a] of audios.entries())a.addEventListener('timeupdate',()=>{if(!run||run.index!==i||a.currentTime<metadata[i].chapters[0].end+.05)return;const token=run.token;a.pause();if(i===0)opening(1,token);else{reset();status('Comparison complete · replay either voice or watch the full performances.')}});
try{metadata=await Promise.all(['../v0.9.6-kindness/performance.json','performance.json'].map(async p=>{const r=await fetch(p);if(!r.ok)throw Error('Timing unavailable');return r.json()}));$('compare').disabled=false;status('Ready · saved recordings only')}catch{status('Opening comparison unavailable; the audio and video players still work.')}
$('compare').onclick=()=>{if(run){stop();reset();status('Comparison stopped');return}const token={};run={index:0,token};$('compare').textContent='Stop comparison';opening(0,token)};
