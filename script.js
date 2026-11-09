'use strict';
const $=id=>document.getElementById(id), total=20;
const img=n=>`assets/graphics/${n}.jpg`, music=n=>`assets/music/music${n}.mp3`, speech=n=>`assets/speech/speech${n}.mp3`;
const store=(k,v)=>{try{localStorage.setItem('drawingbook_'+k,JSON.stringify(v))}catch(e){}},load=(k,d)=>{try{return JSON.parse(localStorage.getItem('drawingbook_'+k))??d}catch(e){return d}};
let page=Math.min(19,Math.max(0,load('page',0))), muted=load('muted',false),musicOn=load('musicOn',true),volume=load('volume',75),reading=false,themeOn=false,showText=true,quizAnswers={};
const audio=$('musicAudio'),voice=$('speechAudio'),theme=$('themeAudio');
const guides=[
'封面：觀察故事主角的服飾、面具與動物，猜猜故事會發生什麼事。',
'金黃色的田野裡，有哪些植物和動物？',
'夜晚的樹下，大家正在討論什麼事情呢？',
'森林裡發生了什麼事？觀察人物的表情。',
'村落裡有許多人聚集，看看他們的服飾與面具。',
'主角拿著工具往森林前進，他想做什麼？',
'大家正在進行什麼活動？仔細觀察畫面。',
'主角帶著許多青蛙，其他人的反應如何？',
'看一看主角手上的食物，他的心情是什麼？',
'主角坐在火堆旁，這張圖有哪些動物？',
'主角被大家圍住了，你覺得發生什麼事？',
'主角和另一位人物交換物品，猜猜他們在說什麼。',
'主角看起來很沮喪，旁邊的人想說什麼？',
'家人們聚在一起，主角正在想什麼？',
'主角向大家說明事情，畫面裡出現哪些動物？',
'森林裡有一隻奔跑的動物，主角正在做什麼？',
'主角在森林裡遇見了誰？你看到幾隻動物？',
'大家圍著火堆，仔細觀察這一幕。',
'主角與小女孩握著手，其他人的表情如何？',
'最後一頁：山林與飛鳥讓你想到什麼？說說故事的感想。'];
const features={0:[['故事封面','從封面觀察主角、服飾和面具。',.75,.48]],1:[['田野','觀察田野中的農作物。',.65,.47]],3:[['森林動物','森林中出現了野生動物。',.3,.83]],4:[['文化面具','觀察人物佩戴的面具與服飾。',.69,.52]],7:[['青蛙','看看畫面中出現多少隻青蛙。',.55,.43]],8:[['主角','主角的表情透露了什麼心情？',.73,.45]],15:[['山林動物','這隻動物正往哪個方向跑？',.52,.55]],18:[['主角與女孩','他們正在進行什麼互動？',.54,.55]],19:[['飛鳥','觀察最後一頁的山林景色。',.31,.6]]};
function status(t){$('status').textContent=t}
function stopTheme(){theme.pause();themeOn=false;$('themeBtn').textContent='♪ 播放主題曲'}
function setVolumes(){audio.volume=muted||!musicOn?0:volume/100*(reading?.24:1);voice.muted=muted;theme.muted=muted;$('musicVolume').value=volume;$('volumeValue').textContent=volume+'%';$('mute').textContent=muted?'♫ 取消靜音':'◖ 靜音';$('muteTop').textContent=muted?'♫ 取消靜音':'♫ 靜音';$('musicToggle').textContent=musicOn?'♫ 音樂開':'♫ 音樂關'}
function safePlay(el){return el.play().catch(()=>status('請點擊播放按鈕以啟用聲音'))}
function stopVoice(){voice.pause();voice.currentTime=0;reading=false;$('readLabel').textContent='▶ 朗讀';setVolumes()}
function playMusic(){audio.src=music(page);audio.loop=true;setVolumes();if(musicOn&&!muted)safePlay(audio)}
function playVoice(restart=false){stopTheme();if(reading&&!restart){voice.pause();reading=false;$('readLabel').textContent='▶ 繼續';setVolumes();return}if(voice.src.endsWith(`speech${page}.mp3`)&&!restart&&voice.currentTime>0){reading=true;$('readLabel').textContent='Ⅱ 暫停';setVolumes();safePlay(voice);return}voice.src=speech(page);voice.playbackRate=Number($('speed').value);reading=true;$('readLabel').textContent='Ⅱ 暫停';setVolumes();safePlay(voice);status(`正在朗讀第 ${page+1} 頁`)}
function show(section){['home','reader','contents','quiz'].forEach(id=>$(id).hidden=id!==section);window.scrollTo({top:0,behavior:'instant'})}
function renderHotspots(){const h=$('hotspots');h.replaceChildren();$('characterTip').hidden=true;for(const [name,desc,x,y] of features[page]||[]){let b=document.createElement('button');b.className='hotspot';b.textContent='✦';b.style.left=x*100+'%';b.style.top=y*100+'%';b.setAttribute('aria-label','探索：'+name);b.onclick=()=>{$('tipTitle').textContent=name;$('tipText').textContent=desc;$('characterTip').hidden=false};h.append(b)}}
function go(n,{autoplay=false}={}){if(n<0||n>=total)return;stopVoice();stopTheme();page=n;store('page',page);$('pageImage').src=img(page);$('pageImage').alt=`繪本第 ${page+1} 頁`;$('zoomImage').src=img(page);$('pageCount').textContent=`第 ${page+1} / ${total} 頁`;$('pageJump').value=page;$('progressFill').style.width=(page+1)/total*100+'%';$('progressText').textContent=`閱讀進度 ${Math.round((page+1)/total*100)}%`;$('prev').disabled=page===0;$('next').disabled=page===19;$('endQuiz').hidden=page!==19;$('guideText').textContent=guides[page];$('pageNote').value=load('note_'+page,'');$('noteState').textContent='只儲存在此裝置';renderHotspots();playMusic();status(`第 ${page+1} 頁已載入`);if(autoplay)playVoice(true)}
function reader(n=page){show('reader');go(n)}
for(let i=0;i<total;i++){let o=document.createElement('option');o.value=i;o.textContent=`第 ${i+1} 頁`; $('pageJump').append(o);let b=document.createElement('button');b.className='thumb';b.innerHTML=`<img src="${img(i)}" loading="lazy" alt="第 ${i+1} 頁縮圖"><span>第 ${i+1} 頁</span>`;b.onclick=()=>reader(i);$('thumbGrid').append(b)}
$('startBtn').onclick=()=>reader(0);$('resumeBtn').hidden=!load('page',0);$('resumeBtn').onclick=()=>reader(page);$('homeBtn').onclick=()=>{stopVoice();audio.pause();show('home')};$('contentsBtn').onclick=()=>{stopVoice();audio.pause();show('contents')};$('quizBtn').onclick=()=>openQuiz();document.querySelectorAll('.backReader').forEach(b=>b.onclick=()=>reader(page));$('prev').onclick=()=>go(page-1);$('next').onclick=()=>go(page+1);$('pageJump').onchange=e=>go(Number(e.target.value));$('read').onclick=()=>playVoice();$('replay').onclick=()=>playVoice(true);$('musicToggle').onclick=()=>{musicOn=!musicOn;store('musicOn',musicOn);if(musicOn&&!muted)safePlay(audio);else audio.pause();setVolumes()};function toggleMute(){muted=!muted;store('muted',muted);setVolumes();if(muted)audio.pause();else if(musicOn&&!$('reader').hidden)safePlay(audio)}$('mute').onclick=toggleMute;$('muteTop').onclick=toggleMute;$('musicVolume').oninput=e=>{volume=Number(e.target.value);store('volume',volume);setVolumes()};$('speed').onchange=e=>{voice.playbackRate=Number(e.target.value)};$('themeBtn').onclick=()=>{if(themeOn){stopTheme();return}audio.pause();stopVoice();themeOn=true;$('themeBtn').textContent='Ⅱ 暫停主題曲';safePlay(theme)};theme.onended=stopTheme;
voice.onended=()=>{reading=false;$('readLabel').textContent='▶ 朗讀';setVolumes();if($('autoTurn').checked&&page<19){go(page+1,{autoplay:$('autoRead').checked})}else status('朗讀完成')};
$('textToggle').onclick=()=>{showText=!showText;$('captionArea').hidden=!showText;$('textToggle').textContent=showText?'隱藏文字':'顯示文字'};$('pageNote').oninput=e=>{store('note_'+page,e.target.value);$('noteState').textContent='已自動儲存於此裝置'};$('clearNote').onclick=()=>{$('pageNote').value='';store('note_'+page,'');$('noteState').textContent='已清除'};$('closeTip').onclick=()=>{$('characterTip').hidden=true};
$('zoomBtn').onclick=()=>{$('zoomImage').src=img(page);$('zoomOverlay').hidden=false};$('closeZoom').onclick=()=>{$('zoomOverlay').hidden=true};$('zoomOverlay').onclick=e=>{if(e.target===$('zoomOverlay'))$('zoomOverlay').hidden=true};$('fullBtn').onclick=()=>{if(!document.fullscreenElement){$('imageWrap').requestFullscreen?.().catch(()=>{$('zoomOverlay').hidden=false})}else document.exitFullscreen?.()};
let touchX=null;const wrap=$('imageWrap');wrap.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});wrap.addEventListener('touchend',e=>{if(touchX===null)return;const d=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(d)>65)go(page+(d<0?1:-1))},{passive:true});document.addEventListener('keydown',e=>{if(['TEXTAREA','INPUT','SELECT'].includes(document.activeElement.tagName))return;if(e.key==='Escape')$('zoomOverlay').hidden=true;if(!$('reader').hidden){if(e.key==='ArrowRight')go(page+1);if(e.key==='ArrowLeft')go(page-1)}});
const questions=[['封面上可以看到什麼？',['太空船','穿著傳統服飾的人物','高樓大廈'],1],['故事裡的田野主要呈現什麼顏色？',['金黃色','紫色','粉紅色'],0],['故事中出現了哪一種動物？',['企鵝','長頸鹿','青蛙'],2],['故事畫面中可以看到哪種文化元素？',['面具與圖騰','紅綠燈','電腦螢幕'],0],['最後一頁的背景主要是什麼？',['城市街道','山林與飛鳥','海底世界'],1]];
function openQuiz(){stopVoice();audio.pause();show('quiz');quizAnswers={};$('quizResult').hidden=true;const root=$('quizBody');root.replaceChildren();questions.forEach(([q,opts],i)=>{let box=document.createElement('div');box.className='question';let h=document.createElement('h3');h.textContent=`${i+1}. ${q}`;box.append(h);let choices=document.createElement('div');choices.className='options';opts.forEach((v,j)=>{let b=document.createElement('button');b.className='choice';b.textContent=v;b.onclick=()=>{quizAnswers[i]=j;choices.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')};choices.append(b)});box.append(choices);root.append(box)});let submit=document.createElement('button');submit.className='primary';submit.textContent='送出答案，查看成績';submit.onclick=()=>{if(Object.keys(quizAnswers).length<5){alert('請先回答全部五題');return}let score=questions.filter((q,i)=>quizAnswers[i]===q[2]).length;let r=$('quizResult');r.hidden=false;r.replaceChildren();let h=document.createElement('h2');h.textContent=`答對 ${score} / 5 題`;let p=document.createElement('p');p.textContent=score===5?'太棒了！你已經仔細觀察每一頁！':'可以回到繪本，再找找圖片裡的線索。';let b=document.createElement('button');b.className='primary';b.textContent='再挑戰一次';b.onclick=openQuiz;r.append(h,p,b);r.scrollIntoView({behavior:'smooth'});store('best',Math.max(score,load('best',0)))};root.append(submit)}
$('endQuiz').onclick=openQuiz;$('debug').onclick=()=>{let p=$('debugPanel');p.hidden=!p.hidden;p.textContent=JSON.stringify({page:page+1,total,muted,musicOn,volume,reading,musicSrc:audio.currentSrc,speechSrc:voice.currentSrc,notesSaved:true},null,2)};
setVolumes();$('resumeBtn').hidden=load('page',0)===0;show('home');
