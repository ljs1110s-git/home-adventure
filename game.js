import { STR } from "./strings.js";
import { createInterface } from "./interface.js?v=3";
import { MONSTERS } from "./monsters.js";
import { UPGRADE_CATALOG } from "./upgrades.js?v=3";

/* ===== canvas ===== */
const canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");
let W = innerWidth, H = innerHeight;
const DPR_CAP = 2;
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", resize); addEventListener("orientationchange", resize); resize();
const TOUCH = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

/* ===== math ===== */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const d2=(ax,ay,bx,by)=>{const dx=ax-bx,dy=ay-by;return dx*dx+dy*dy;};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const TAU=Math.PI*2;

/* ===== assets ===== */
const IMG_SRC={hero_base:"hero_base.svg",hero_hanui:"hero_hanui.svg",hero_ara:"hero_ara.svg",hero_seungwoo:"hero_seungwoo.svg",hero_hayeon:"hero_hayeon.svg",hero_saebom:"hero_saebom.svg",hero_chaea:"hero_chaea.svg",hero_soeun:"hero_soeun.svg",hero_siyeon:"hero_siyeon.svg",hero_seoa:"hero_seoa.svg",hero_hyojin:"hero_hyojin.svg",hero_jimin:"hero_jimin.svg",hero_hyeonjeong:"hero_hyeonjeong.svg",
mon_slime:"home_mon_slime.svg",mon_pencil:"home_mon_pencil.svg",mon_ghost:"home_mon_ghost.svg",mon_milk:"home_mon_milk.svg",mon_paper:"home_mon_paper.svg",mini_eraser:"home_mini_eraser.svg",mini_pencil:"home_mini_pencil.svg",mini_marker:"home_mini_marker.svg",mini_milk:"home_mini_milk.svg",
boss_broom:"home_boss_broom.svg",bg0:"home_bg0.svg",bg1:"home_bg1.svg",bg2:"home_bg2.svg",bg3:"home_bg3.svg",bg4:"home_bg4.svg",fx_wave:"fx_wave.png",fx_slash:"fx_slash.png",fx_boom:"fx_boom.png",fx_splash:"fx_splash.png",fx_hammer:"home_icon_hammer.svg",fx_nagring:"fx_nagring.png",fx_homework:"home_icon_bag.svg",fx_eproj:"fx_eproj.png",fx_brush:"home_icon_brush.svg",fx_foam:"fx_foam.png",icon_brush:"home_icon_brush.svg",fx_ddakji:"fx_ddakji.png",icon_ddakji:"home_icon_ddakji.svg",icon_alarm:"home_icon_alarm.svg",fx_shieldp:"home_icon_shield.svg",icon_shield:"home_icon_shield.svg",fx_ruler:"home_icon_ruler.svg",icon_ruler:"home_icon_ruler.svg",icon_bigger:"icon_bigger.png",icon_bell:"icon_bell.png",icon_note:"icon_note.png",fx_clockhand:"fx_clockhand.png",icon_clock:"home_icon_clock.svg",fx_aura:"fx_aura.png",icon_garlic:"home_icon_garlic.svg",fx_tack:"home_icon_tack.svg",icon_tack:"home_icon_tack.svg",fx_nova:"fx_nova.png",fx_shockring:"fx_shockring.png",fx_inkring:"fx_inkring.png",fx_milkburst:"fx_milkburst.png",fx_bonk:"fx_bonk.png",fx_foamburst:"fx_foamburst.png",fx_sparkle:"fx_sparkle.png",fx_healfx:"fx_healfx.png",fx_dust:"fx_dust.png",fx_zap:"fx_zap.png",fx_candyring:"fx_candyring.png",fx_swoosh:"fx_swoosh.png",fx_note:"fx_note.png",fx_chalkp:"home_icon_chalk.svg",fx_bagfx:"home_icon_bag.svg",
icon_hammer:"home_icon_hammer.svg",icon_bolt:"home_icon_bolt.svg",icon_boomerang:"home_icon_boomerang.svg",icon_milk:"home_icon_milk.svg",icon_chalk:"home_icon_chalk.svg",icon_bag:"home_icon_bag.svg",
icon_swift:"icon_swift.png",icon_amp:"icon_amp.png",icon_vital:"icon_vital.png",icon_magnet:"icon_magnet.png",
item_gem:"item_gem.png",item_heal:"item_heal.png",item_magnet:"item_magnet.png",item_chest:"item_chest.png"};
const IMG={};
for(const k in IMG_SRC){const im=new Image();im.src="./assets/"+IMG_SRC[k];IMG[k]=im;}

/* Premium shared atlases. Source rectangles are selected at draw time. */
const ART={};
for(const [key,file] of Object.entries({characters:'characters-v2.png',monsters:'monsters-v2.png',weapons:'weapons-v2.png',floor:'floor-v2.png',props:'props-v2.png'})){const im=new Image();im.src='./assets/'+file;ART[key]=im;}
function atlasFrame(sheet,index,hero=false,cols=4,rows=4){return {sheet,index,cols,rows,isHero:hero,get complete(){return sheet.complete;},get naturalWidth(){return sheet.naturalWidth?256:0;},naturalHeight:256};}
const HERO_KEYS=['hero_base','hero_hanui','hero_ara','hero_seungwoo','hero_hayeon','hero_saebom','hero_chaea','hero_soeun','hero_siyeon','hero_seoa','hero_hyojin','hero_jimin','hero_hyeonjeong'];
HERO_KEYS.forEach((key,i)=>IMG[key]=atlasFrame(ART.characters,i,true));
for(const [key,index] of Object.entries({mon_slime:13,mon_ghost:13,mon_pencil:14,mon_milk:14,mon_paper:15,mini_eraser:13,mini_pencil:14,mini_marker:15,mini_milk:15,boss_broom:15}))IMG[key]=atlasFrame(ART.characters,index);
IMG.mon_ghost=atlasFrame(ART.monsters,1);IMG.mon_milk=atlasFrame(ART.monsters,7);
IMG.mini_eraser=atlasFrame(ART.monsters,0);IMG.mini_pencil=atlasFrame(ART.monsters,4);IMG.mini_marker=atlasFrame(ART.monsters,14);IMG.mini_milk=atlasFrame(ART.monsters,15);
const WEAPON_FRAMES={hammer:0,bolt:1,boomerang:2,milk:3,chalk:4,bag:5,brush:6,ddakji:7,alarm:8,shield:9,ruler:10,clock:11,garlic:12,tack:13};
for(const [key,index] of Object.entries(WEAPON_FRAMES))IMG['icon_'+key]=atlasFrame(ART.weapons,index);
for(const [key,index] of Object.entries({fx_hammer:0,fx_brush:6,fx_ruler:10,fx_shieldp:9,fx_tack:13,fx_chalkp:4,fx_bagfx:5,item_gem:14,item_heal:15,fx_eproj:14,fx_homework:14}))IMG[key]=atlasFrame(ART.weapons,index);
{const im=new Image();im.src='./assets/vfx-aura.svg';IMG.fx_aura=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_wave=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_nova=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_shockring=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_inkring=im;}
{const im=new Image();im.src='./assets/vfx-burst.svg';IMG.fx_milkburst=im;}
{const im=new Image();im.src='./assets/vfx-burst.svg';IMG.fx_boom=im;}
{const im=new Image();im.src='./assets/vfx-burst.svg';IMG.fx_bonk=im;}
{const im=new Image();im.src='./assets/vfx-foam.svg';IMG.fx_foamburst=im;}
{const im=new Image();im.src='./assets/vfx-burst.svg';IMG.fx_sparkle=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_healfx=im;}
{const im=new Image();im.src='./assets/vfx-foam.svg';IMG.fx_dust=im;}
{const im=new Image();im.src='./assets/vfx-burst.svg';IMG.fx_zap=im;}
{const im=new Image();im.src='./assets/vfx-wave.svg';IMG.fx_candyring=im;}
{const im=new Image();im.src='./assets/vfx-swoosh.svg';IMG.fx_swoosh=im;}
{const im=new Image();im.src='./assets/vfx-swoosh.svg';IMG.fx_slash=im;}
{const im=new Image();im.src='./assets/vfx-foam.svg';IMG.fx_foam=im;}
{const im=new Image();im.src='./assets/vfx-splash.svg';IMG.fx_splash=im;}
{const im=new Image();im.src='./assets/vfx-clockhand.svg';IMG.fx_clockhand=im;}
function paintImage(im,...args){
 if(!im||!im.complete||!im.naturalWidth)return;
 if(im.sheet){const sw=im.sheet.naturalWidth/im.cols,sh=im.sheet.naturalHeight/im.rows;ctx.drawImage(im.sheet,(im.index%im.cols)*sw,Math.floor(im.index/im.cols)*sh,sw,sh,...args);}
 else ctx.drawImage(im,...args);
}

/* ===== audio ===== */
let AC=false,bgmEl=null,bgmName="";
const SFX={swing:"sfx_swing.mp3",pop:"sfx_pop.mp3",levelup:"sfx_levelup.mp3",hurt:"sfx_hurt.mp3"};
function ensureAudio(){if(!AC){AC=true;playBgm("bgm_dungeon");}}
function playBgm(n){if(!AC||!setOpt("bgm")||bgmName===n)return;if(bgmEl)bgmEl.pause();bgmEl=new Audio("./assets/"+n+".m4a");bgmEl.loop=true;bgmEl.volume=.45;bgmEl.play().catch(()=>{});bgmName=n;}
function sfx(n){if(!AC||!setOpt("sfx"))return;const a=new Audio("./assets/"+SFX[n]);a.volume=.35;a.play().catch(()=>{});}

/* ===== meta (localStorage) ===== */
const META_KEY="home_adventure_meta_v1";
function loadMeta(){try{const m=JSON.parse(localStorage.getItem(META_KEY))||{};m.coins=m.coins||0;m.shop=m.shop||{};return m;}catch(e){return{coins:0,shop:{}};}}
let META=loadMeta();
function setOpt(k){return !META.set||META.set[k]===undefined?true:!!META.set[k];}
function toggleOpt(k){META.set=META.set||{};META.set[k]=setOpt(k)?0:1;saveMeta();}
function saveMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(META));}catch(e){}}
const shopLv=id=>META.shop[id]||0;
const SHOP=UPGRADE_CATALOG;
let shopRevision=0,shopReturnMode='select';
function purchaseUpgrade(id){
 if(G.mode!=='shop')return {ok:false,message:'탐험을 마친 뒤 상점에서 강화할 수 있어요.'};
 const item=SHOP.find(s=>s.id===id);if(!item)return {ok:false,message:'강화 항목을 찾을 수 없어요.'};
 const lv=shopLv(id);if(lv>=item.max)return {ok:false,message:'이미 최대 단계까지 강화했어요.'};
 const price=item.cost(lv);if(META.coins<price)return {ok:false,message:(price-META.coins).toLocaleString()+' 코인이 더 필요해요.'};
 META.coins-=price;META.shop[id]=lv+1;shopRevision++;saveMeta();ensureAudio();sfx('levelup');
 return {ok:true,message:item.name+' Lv.'+(lv+1)+' 구매 완료! 다음 탐험부터 적용됩니다.'};
}

/* ===== data ===== */
const CHARACTERS=[
{id:"yuchan",img:"hero_base",face:1,weapon:"hammer"},
{id:"hanui",img:"hero_hanui",face:1,weapon:"bolt"},
{id:"ara",img:"hero_ara",face:1,weapon:"boomerang"},
{id:"seungwoo",img:"hero_seungwoo",face:1,weapon:"chalk"},
{id:"hayeon",img:"hero_hayeon",face:1,weapon:"milk"},
{id:"saebom",img:"hero_saebom",face:1,weapon:"brush"},
{id:"chaea",img:"hero_chaea",face:1,weapon:"bag"},
{id:"soeun",img:"hero_soeun",face:1,weapon:"alarm"},
{id:"siyeon",img:"hero_siyeon",face:1,weapon:"shield"},
{id:"seoa",img:"hero_seoa",face:1,weapon:"ruler"},
{id:"hyojin",img:"hero_hyojin",face:1,weapon:"clock"},
{id:"jimin",img:"hero_jimin",face:1,weapon:"garlic"},
{id:"hyeonjeong",img:"hero_hyeonjeong",face:1,weapon:"tack"}];

/* weapon identity: hammer=short range/high dmg, bolt=AoE rings/low dmg, boomerang=pierce/mid,
   milk=long cd/huge AoE+slow, chalk=rapid/low dmg sniper, bag=orbit contact */
const WCOLORS={
hammer:["#c96f2f","#d4832f","#df972f","#e9ab2f","#f2bf2f","#fad32f","#ffe72f","#ffd700","#ff9d2f","#ff5d2f"],
bolt:["#3fd4c0","#3fc0dc","#3fa4ec","#4f8ef5","#6a7ef9","#8a6efc","#aa5efe","#c94eff","#e93eff","#ff2ef0"],
boomerang:["#9fd43f","#8fdb4a","#7fe255","#6fe960","#5ff06b","#4ff77f","#3ffd93","#2fffa7","#1fffbb","#00ffd0"],
milk:["#f5f5f5","#f8e9ee","#fbdde7","#fdd1e0","#ffc5d9","#ffb9d2","#ffadcb","#ffa1c4","#ff95bd","#ff89b6"],
chalk:["#ffffff","#fff7d1","#ffefa3","#ffe775","#ffdf47","#ffd719","#ffc400","#ffae00","#ff9800","#ff8200"],
bag:["#a5713f","#ad7a4f","#b5835f","#bd8c6f","#c5957f","#cd9e8f","#d5a79f","#dd90bf","#e579df","#ee62ff"],
ddakji:["#4f8ef5","#4a7ef0","#5a6eeb","#7a5ee6","#9a4ee1","#ba3edc","#da2ed7","#f01ec0","#ff9d1e","#ffd700"],
brush:["#7fe8d8","#6fe2e2","#5fdcec","#4fd6f6","#3fd0ff","#2fbaff","#1fa4ff","#0f8eff","#4f7eff","#8a6eff"],
alarm:["#ff6b6b","#ff5f5f","#ff5353","#ff4747","#ff3b3b","#ff2f2f","#ff2323","#ff1717","#ff0b0b","#ff0000"],
shield:["#7fd8e8","#74d2e4","#69cce0","#5ec6dc","#53c0d8","#48bad4","#3db4d0","#32aecc","#27a8c8","#1ca2c4"],
ruler:["#c9a06a","#c69a60","#c39456","#c08e4c","#bd8842","#ba8238","#b77c2e","#b47624","#b1701a","#ae6a10"],
clock:["#4f6ef5","#4a64f0","#455aeb","#4050e6","#3b46e1","#363cdc","#3132d7","#2c28d2","#271ecd","#ffd700"],
garlic:["#e8e4b0","#e6dfa5","#e4da9a","#e2d58f","#e0d084","#decb79","#dcc66e","#dac163","#d8bc58","#d6b74d"],
tack:["#c0c8d8","#bcc2d0","#b8bcc8","#b4b6c0","#b0b0b8","#acaab0","#a8a4a8","#a49ea0","#a09898","#ff4d4d"]};
const EVOLVE_PAIR={hammer:"vital",bolt:"amp",boomerang:"swift",milk:"magnet",chalk:"amp",bag:"vital",brush:"amp",ddakji:"swift",alarm:"bell",shield:"bigger",ruler:"vital",clock:"bell",garlic:"vital",tack:"swift"};
const WEAPON_IDS=["hammer","bolt","boomerang","milk","chalk","bag","brush","ddakji","alarm","shield","ruler","clock","garlic","tack"];
const PASSIVE_IDS=["swift","amp","vital","magnet","bigger","bell","note"];
const ULT_CD={yuchan:42,hanui:50,ara:38,seungwoo:32,hayeon:48,saebom:55,chaea:44,soeun:60,siyeon:50,seoa:40,hyojin:48,jimin:44,hyeonjeong:42};

const STAGES=[
{bg:"bg0",miniAt:70,mini:"slime",mons:["slime","ghost"],hpm:1,dmgm:1,spm:1},
{bg:"bg1",miniAt:75,mini:"pencil",mons:["slime","ghost","pencil","milk"],hpm:2.2,dmgm:1.4,spm:1.07},
{bg:"bg2",miniAt:80,mini:"marker",mons:["slime","ghost","pencil","paper","milk"],hpm:4,dmgm:1.9,spm:1.14},
{bg:"bg3",miniAt:85,mini:"milkgolem",mons:["slime","pencil","milk","paper"],hpm:6.5,dmgm:2.4,spm:1.2},
{bg:"bg4",bossAt:45,mons:["slime","ghost","pencil","milk","paper"],hpm:10,dmgm:3,spm:1.28}];

const MON_DEF={
slime:{img:"mon_slime",hp:18,spd:65,dmg:8,size:56,xp:1},
ghost:{img:"mon_ghost",hp:12,spd:96,dmg:6,size:52,xp:1},
pencil:{img:"mon_pencil",hp:32,spd:76,dmg:12,size:60,xp:2},
milk:{img:"mon_milk",hp:58,spd:50,dmg:14,size:68,xp:3},
paper:{img:"mon_paper",hp:26,spd:72,dmg:10,size:56,xp:2,ranged:true}};

for(const d of MONSTERS){IMG['invader_'+d.id]=atlasFrame(ART.monsters,d.sprite);MON_DEF[d.id]={...d,img:'invader_'+d.id};}
const ROOM_INVADERS=[
 ['slime','ghost','spike','amoeba','trislime','pencil'],
 ['slime','spore','rhino','wasp','spider','pillbug','pencil','milk'],
 ['spike','amoeba','spore','mantis','centipede','moth','scorpion','paper','soldier'],
 ['trislime','spider','pillbug','mantis','centipede','drone','soldier','octopus','milk'],
 ['slime','spike','rhino','wasp','moth','scorpion','soldier','drone','octopus','crabmech','paper']
];
STAGES.forEach((st,i)=>st.mons=ROOM_INVADERS[i]);

const MINI_DEF={
slime:{img:"mini_eraser",hp:1200,dmg:17,spd:78,size:132,pat:"rush"},
pencil:{img:"mini_pencil",hp:2400,dmg:24,spd:80,size:140,pat:"dash"},
marker:{img:"mini_marker",hp:3900,dmg:28,spd:64,size:146,pat:"spin"},
milkgolem:{img:"mini_milk",hp:6300,dmg:32,spd:56,size:158,pat:"slam"}};

/* ===== game state ===== */
const G={mode:"title",t:0,runT:0,stage:0,stageT:0,rng:mulberry32(7),
hero:null,mons:[],projs:[],eprojs:[],gems:[],items:[],fx:[],nums:[],parts:[],pools:[],zones:[],
kills:0,coins:0,spawnCd:0,boss:null,mini:null,miniSpawned:false,gateOpen:false,
banner:null,shake:0,flash:null,cam:{x:0,y:0},choices:[],charIdx:0,shopIdx:0,banked:false,
chestShow:null,slowAll:0};

function heroMaxHp(h){return 100+20*shopLv("hp")+(h.passives.vital||0)*20;}
function heroSpd(h){return 205*(1+.05*shopLv("spd"))*(1+.08*(h.passives.swift||0));}
function dmgMult(h){return (1+.08*shopLv("power"))*(1+.1*(h.passives.amp||0));}
function cdMult(){return 1-.06*shopLv("rapid");}
function pickR(h){return 90*(1+.15*shopLv("magnetR"))*(1+.3*(h.passives.magnet||0));}
function sizeMult(h){return 1+.08*(h.passives.bigger||0);}
function xpMult(){return 1+.08*shopLv("xp");}
function armorMult(){return 1-.05*shopLv("armor");}
function bonusProj(){return shopLv("proj");}
function luckMult(){return 1+.25*shopLv("luck");}
function ultCdFor(h){return ULT_CD[h.char.id]*(1-.1*shopLv("ultcd"));}

/* ===== run ===== */
function startRun(ci){
const ch=CHARACTERS[ci];
G.hero={x:0,y:0,char:ch,facing:1,hp:0,lv:1,xp:0,xpNext:8,weapons:{},passives:{},evolved:{},
timers:{},slowT:0,hurtT:0,regen:0,ultCd:8,ultMax:1,revived:false,orbitA:0};
G.hero.weapons[ch.weapon]=1;
G.hero.hp=heroMaxHp(G.hero);
G.mons.length=0;G.projs.length=0;G.eprojs.length=0;G.gems.length=0;G.items.length=0;
G.fx.length=0;G.nums.length=0;G.parts.length=0;G.pools.length=0;G.zones.length=0;
G.kills=0;G.coins=0;G.bankGain=0;G.runT=0;G.stage=0;G.stageT=0;G.spawnCd=1;G.boss=null;G.mini=null;G.bossDead=false;G.pendingAdvance=false;
G.miniSpawned=false;G.banked=false;G.chestShow=null;G.slowAll=0;G.banner={t:2.5,txt:STR.stageEnter(1)};
G.mode="play";playBgm("bgm_dungeon");
}
function bankCoins(){if(G.banked)return;G.banked=true;G.bankGain=Math.round(G.coins*(1+.2*shopLv("coin")));META.coins+=G.bankGain;saveMeta();}

/* ===== xp / levelup ===== */
function gainXp(h,v){h.xp+=v*xpMult()*(1+.1*(h.passives.note||0));while(h.xp>=h.xpNext){h.xp-=h.xpNext;h.lv++;h.xpNext=Math.round(6+h.lv*3+h.lv*h.lv*.35);openLevelUp();}}
function openLevelUp(){
const h=G.hero,opts=[];
for(const w of WEAPON_IDS){const lv=h.weapons[w]||0;
 if(lv>0&&lv<10&&!h.evolved[w])opts.push({k:"w",id:w,lv:lv+1});
 else if(lv===0&&Object.keys(h.weapons).length<4+shopLv("wslot"))opts.push({k:"nw",id:w});}
for(const p of PASSIVE_IDS){const lv=h.passives[p]||0;
 if(lv>0&&lv<3)opts.push({k:"p",id:p,lv:lv+1});
 else if(lv===0&&Object.keys(h.passives).length<4+shopLv("pslot"))opts.push({k:"np",id:p});}
opts.push({k:"heal"});
G.choices=[];
for(let i=0;i<3&&opts.length;i++){const j=(G.rng()*opts.length)|0;G.choices.push(opts.splice(j,1)[0]);}
G.mode="levelup";sfx("levelup");
}
function applyChoice(c){
const h=G.hero;
if(c.k==="w")h.weapons[c.id]=c.lv;
else if(c.k==="nw")h.weapons[c.id]=1;
else if(c.k==="p")h.passives[c.id]=c.lv;
else if(c.k==="np")h.passives[c.id]=1;
else if(c.k==="heal")h.hp=Math.min(heroMaxHp(h),h.hp+40);
checkEvolve(h);G.mode="play";
}
function checkEvolve(h){
for(const w in h.weapons){if(h.weapons[w]>=7&&!h.evolved[w]&&(h.passives[EVOLVE_PAIR[w]]||0)>0){
 h.evolved[w]=true;G.flash={t:1.2,c:"#ffd700"};G.shake=18;G.fx.push({kind:"img",img:"fx_sparkle",x:h.x,y:h.y,r:260,t:.9,dur:.9});
 G.banner={t:3,txt:STR.evolveBanner+" — "+STR.evolved[w].name+"!"};
 for(let i=0;i<60;i++)G.parts.push({x:h.x,y:h.y,vx:Math.cos(i/60*TAU)*(120+G.rng()*220),vy:Math.sin(i/60*TAU)*(120+G.rng()*220),t:1.2,c:"#ffd700",r:4+G.rng()*5});
 sfx("levelup");}}
}

/* ===== lucky chest ===== */
function openChest(){
const h=G.hero,r=G.rng(),owned=Object.keys(h.weapons);
let reward;
if(r<.4&&owned.length){const w=owned[(G.rng()*owned.length)|0];
 if((h.weapons[w]||0)<10){h.weapons[w]++;reward={icon:"icon_"+w,txt:STR.chestUp(STR.weapons[w].name,h.weapons[w])};}
 else reward={icon:"item_gem",txt:STR.chestXp};
 if(!reward.gem)checkEvolve(h);}
else if(r<.55){h.hp=heroMaxHp(h);reward={icon:"item_heal",txt:STR.chestHeal};}
else if(r<.75){const pool=PASSIVE_IDS.filter(p=>(h.passives[p]||0)<3);
 if(pool.length){const p=pool[(G.rng()*pool.length)|0];h.passives[p]=(h.passives[p]||0)+1;checkEvolve(h);reward={icon:"icon_"+p,txt:STR.chestUp(STR.passives[p].name,h.passives[p])};}
 else {G.coins+=40;reward={icon:"item_chest",txt:STR.chestCoin};}}
else if(r<.9&&owned.length){const w=owned[(G.rng()*owned.length)|0];h.weapons[w]=Math.min(10,(h.weapons[w]||0)+2);checkEvolve(h);reward={icon:"icon_"+w,txt:STR.chestBig(STR.weapons[w].name,h.weapons[w])};}
else {G.coins+=40;reward={icon:"item_chest",txt:STR.chestCoin};}
if(reward.txt===STR.chestXp)gainXp(h,20);
G.chestShow={t:2.2,reward:reward};G.flash={t:.7,c:"#ffd700"};sfx("levelup");G.mode="chest";
}
function advanceStage(){
if(G.stage<STAGES.length-1){G.stage++;G.stageT=0;G.miniSpawned=false;
 G.banner={t:3,txt:STR.stageEnter(G.stage+1)};
 G.flash={t:.6,c:"#8ecfff"};}
}

/* ===== combat helpers ===== */
function nearestMon(x,y,maxD){let best=null,bd=maxD*maxD;
for(let i=0;i<G.mons.length;i++){const m=G.mons[i];const dd=d2(x,y,m.x,m.y);if(dd<bd){bd=dd;best=m;}}
if(G.boss){const dd=d2(x,y,G.boss.x,G.boss.y);if(dd<bd)best=G.boss;}
if(G.mini){const dd=d2(x,y,G.mini.x,G.mini.y);if(dd<bd&&dd<maxD*maxD)best=G.mini;}
return best;}
function pushNum(x,y,v,c){if(!setOpt("dmg"))return;if(G.nums.length>40)return;G.nums.push({x:x,y:y,v:Math.round(v),t:.7,c:c||"#fff"});}
function burst(x,y,c,n,sp){const cap=Math.min(n,160-G.parts.length);for(let i=0;i<cap;i++){const a=G.rng()*TAU,s=(sp||140)*(0.4+G.rng());G.parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.5+G.rng()*.4,c:c,r:2+G.rng()*4});}}
function hitMon(m,dmg,opt){
if(m.hp<=0)return;
m.hp-=dmg;m.flash=.1;
if(G.hero)G.hero.ultG=Math.min(100,(G.hero.ultG||0)+.4*(1+.1*shopLv("ultcd")));pushNum(m.x,m.y-m.size*.5,dmg,opt&&opt.c);
if(opt&&opt.stun)m.stunT=Math.max(m.stunT||0,opt.stun);
if(opt&&opt.kb&&!m.type){const dx=m.x-G.hero.x,dy=m.y-G.hero.y,dd=Math.hypot(dx,dy)||1;m.x+=dx/dd*opt.kb;m.y+=dy/dd*opt.kb;}
if(m.hp<=0)killMon(m);}
function boomfx(x,y,r,c,img){G.fx.push({kind:"boom",x:x,y:y,r:r,t:.35,c:c,img:img});burst(x,y,c,14,220);G.shake=Math.max(G.shake,5);}
function sectorHit(x,y,ang,r,half,dmg,col,kb){
let shCnt=0;
const targets=G.mons.slice();if(G.boss)targets.push(G.boss);if(G.mini)targets.push(G.mini);
for(const m of targets){if(d2(x,y,m.x,m.y)>(r+m.size*.4)*(r+m.size*.4))continue;
let da=Math.atan2(m.y-y,m.x-x)-ang;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
if(Math.abs(da)<=half)(shCnt++,hitMon)(m,dmg,{c:col,kb:kb});}return shCnt;}
function circleHit(x,y,r,dmg,col,stun){
const targets=G.mons.slice();if(G.boss)targets.push(G.boss);if(G.mini)targets.push(G.mini);
for(const m of targets)if(d2(x,y,m.x,m.y)<(r+m.size*.4)*(r+m.size*.4))hitMon(m,dmg,{c:col,stun:stun});}

/* ===== weapons ===== */
function wcol(w,lv){return WCOLORS[w][clamp(lv-1,0,9)];}
function fireWeapon(w,lv,h,dm){
const col=wcol(w,lv),ev=h.evolved[w],sm=sizeMult(h);
if(w==="hammer"){
 if(ev){const tgt=nearestMon(h.x,h.y,540);
  for(let i=0;i<2;i++){const tx=tgt?tgt.x+(G.rng()-.5)*120:h.x+(G.rng()-.5)*420,ty=tgt?tgt.y+(G.rng()-.5)*120:h.y+(G.rng()-.5)*420;
   G.projs.push({kind:"slam",x:tx,y:ty,delay:.15+i*.24,fall:.34,r:148*sm,dmg:(46*Math.pow(1.16,lv-1))*dm,col:"#ffd700",hImg:true,shock:true});}
  sfx("swing");}
 else{const tgt=nearestMon(h.x,h.y,420),base=tgt?Math.atan2(tgt.y-h.y,tgt.x-h.x):(h.facing>0?0:Math.PI);
  const swings=1+(lv>=4?1:0)+(lv>=8?1:0);
  const dmg=(46*Math.pow(1.22,lv-1))*dm,r=(70+lv*19)*sm;
  for(let i=0;i<swings;i++)G.projs.push({kind:"swing",x:0,y:0,a:base+i*(TAU/swings),r:r,dmg:dmg,delay:i*.14,t:.26,col:col,did:false,lv:lv});
  sfx("swing");}}
else if(w==="brush"){
 const n=1+(lv>=3?1:0)+(lv>=6?1:0)+(ev?1:0);
 const dmgB=(95*Math.pow(1.25,lv-1))*dm*(ev?1.45:1),rB=(85+lv*11)*(ev?1.2:1)*sm;
 for(let i=0;i<n;i++){
  const aB=G.rng()*TAU,dB=90+G.rng()*Math.min(W,H)*.42;
  const tx=h.x+Math.cos(aB)*dB,ty=h.y+Math.sin(aB)*dB;
  G.projs.push({kind:"slam",x:tx,y:ty,delay:i*.15,fall:.4,r:rB,dmg:dmgB,col:wcol(w,lv),img:"fx_brush",bImg:true,evB:!!ev,foam:{r:rB*.8,t:2.2+lv*.45,dps:(8+lv*2)*dm}});}}
else if(w==="ddakji"){
 const tgt=nearestMon(h.x,h.y,520);
 if(tgt){const nD=1+(lv>=4?1:0)+(ev?1:0)+(bonusProj()>0?1:0);
  const bounces=3+(lv>=3?1:0)+(lv>=5?1:0)+(lv>=7?1:0)+(ev?4:0);
  const dmgD=(20+lv*3.5)*dm*(ev?1.5:1);
  for(let i=0;i<nD;i++)G.projs.push({kind:"ddak",x:h.x,y:h.y,tgt:tgt,spd:520+lv*20,dmg:dmgD,mult:1,left:bounces,hit:new Set(),lv:lv,ev:!!ev,delay:i*.18});}}
else if(w==="alarm"){
 G.projs.push({kind:"alarm",t:0,warn:2.2,x:h.x,y:h.y,bossPct:(.08+lv*.012)*(ev?1.4:1),evA:!!ev,lv:lv});
 G.banner={t:1.6,txt:STR.alarmWarn};sfx("hurt");}
else if(w==="tack"){
 const nT=1+(lv>=4?1:0)+(lv>=7?1:0)+(lv>=10?1:0)+(ev?1:0);
 const aF=(h.aimA!==undefined)?h.aimA:(h.facing>0?0:Math.PI);
 for(let i=0;i<nT;i++){const off=(i-(nT-1)/2)*40,px=h.x+Math.cos(aF)*70-Math.sin(aF)*off,py=h.y+Math.sin(aF)*70+Math.cos(aF)*off;
  G.pools.push({x:px,y:py,r:(13+lv*2.8)*sm*(ev?1.5:1),t:(9+lv*2.8)*(ev?1.3:1),dps:(24+lv*5)*dm*(ev?1.6:1),tack:true,drop:.32,drop0:.32});}
 sfx("pop");}
else if(w==="ruler"){
 const a0=(h.aimA!==undefined)?h.aimA:(h.facing>0?0:Math.PI);
 const swingsR=ev?3:1,rR=(150+lv*16)*sm,dmgR=(30+lv*4.5)*dm*(ev?1.2:1);
 for(let i=0;i<swingsR;i++)G.projs.push({kind:"rul",x:0,y:0,a:a0,r:rR,dmg:dmgR,delay:i*.13,t:.22,col:wcol(w,lv),did:false,lv:lv,ls:(0.10+lv*.012)*(ev?2:1)});
 sfx("swing");}
else if(w==="bolt"){
 const rings=(ev?3:1+(lv>=4?1:0)+(lv>=8?1:0));
 const dmg=(9+lv*2)*dm*(ev?1.5:1),maxR=((150+lv*26)+(ev?160:0))*sm;
 for(let i=0;i<rings;i++)G.projs.push({kind:"ring",x:h.x,y:h.y,r:10,maxR:maxR,spd:340+lv*15,dmg:dmg,delay:i*.22,col:ev?"#b45eff":col,hit:new Set(),stun:ev?.6:0,fxImg:ev?"fx_nova":null,lv:lv});}
else if(w==="boomerang"){
 const n=(1+(lv>=3?1:0)+(lv>=6?1:0)+(lv>=9?1:0)+bonusProj())+(ev?2:0);
 const tgt=nearestMon(h.x,h.y,600),base=tgt?Math.atan2(tgt.y-h.y,tgt.x-h.x):G.rng()*TAU;
 const dmg=(16+lv*3)*dm*(ev?1.6:1),dist=(300+lv*26)*sm,spd=430+lv*20,sz=(26+lv*3.4)*(ev?1.45:1)*sm;
 for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.3;
  G.projs.push({kind:"boom",x:h.x,y:h.y,a:a,d:0,dist:dist,spd:spd,dmg:dmg,sz:sz,ret:false,col:ev?"#00ffd0":col,hit:new Set(),rot:0});}}
else if(w==="milk"){
 const n=1+(lv>=5?1:0)+(lv>=8?1:0)+(bonusProj()>1?1:0);
 const dmg=(45+lv*8)*dm*(ev?1.4:1),rad=(80+lv*11)*(ev?1.25:1)*sm;
 for(let i=0;i<n;i++){const tgt=nearestMon(h.x,h.y,520);
  const tx=tgt?tgt.x+(G.rng()-.5)*80:h.x+(G.rng()-.5)*500,ty=tgt?tgt.y+(G.rng()-.5)*80:h.y+(G.rng()-.5)*500;
  G.projs.push({kind:"bomb",x:h.x,y:h.y,sx:h.x,sy:h.y,tx:tx,ty:ty,t:0,ft:.65+i*.15,rad:rad,dmg:dmg,col:col,ev:!!ev,healP:lv>=4});}}
else if(w==="chalk"){
 const n=(ev?3:1+(lv>=4?1:0)+(lv>=7?1:0))+bonusProj();
 const tgt=nearestMon(h.x,h.y,560),base=tgt?Math.atan2(tgt.y-h.y,tgt.x-h.x):(h.facing>0?0:Math.PI);
 const dmg=(8+lv*1.6)*dm*(ev?1.45:1);
 for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.14;
  G.projs.push({kind:"chalk",x:h.x,y:h.y,vx:Math.cos(a)*(640+lv*18),vy:Math.sin(a)*(640+lv*18),t:.9,dmg:dmg,col:ev?"#ff8ab0":col,pierce:ev?2:0,hit:new Set(),lv:lv,ev:!!ev});}}
}
function weaponCd(w,lv,ev){
const base={hammer:2.2,bolt:3.6,boomerang:2.9,milk:4.6,chalk:.85,bag:0,brush:4.4,ddakji:3.1,alarm:30,shield:0,ruler:1.8,clock:0,garlic:0,tack:3.4}[w];
return base*cdMult()*(1-lv*.02)*(ev?1.05:1)*(1-.06*((G.hero&&G.hero.passives.bell)||0));}

/* ===== ultimates ===== */
function fireUlt(){
const h=G.hero,dm=dmgMult(h),id=h.char.id;
G.banner={t:2,txt:STR.ultNames[id]};G.flash={t:.5,c:"#b45eff"};G.shake=14;sfx("levelup");
if(id==="yuchan"){h.invulnT=4;
 G.projs.push({kind:"slam",x:h.x,y:h.y,delay:.25,fall:.85,r:400,dmg:520*dm,col:"#ffd700",hImg:true,giant:true,shock:true});}
else if(id==="hanui"){G.projs.push({kind:"ring",x:h.x,y:h.y,r:10,maxR:900,spd:520,dmg:120*dm,delay:0,col:"#b45eff",hit:new Set(),stun:3,fxImg:"fx_nova"});
 burst(h.x,h.y,"#b45eff",40,320);}
else if(id==="ara"){for(let i=0;i<12;i++){const a=i/12*TAU;
 G.projs.push({kind:"boom",x:h.x,y:h.y,a:a,d:0,dist:520,spd:460,dmg:60*dm,sz:72,ret:false,col:"#00ffd0",hit:new Set(),rot:0});}}
else if(id==="hayeon"){for(let i=0;i<7;i++){const a=i/7*TAU,dd=130+G.rng()*220;const tx=h.x+Math.cos(a)*dd,ty=h.y+Math.sin(a)*dd;
 G.projs.push({kind:"slam",x:tx,y:ty,delay:.14*i,r:170,dmg:85*dm,col:"#f4f9ff",img:"icon_milk",milkPool:true});}
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:10,maxR:520,spd:430,dmg:55*dm,delay:0,col:"#f4f9ff",hit:new Set()});}
else if(id==="saebom"){for(let i=0;i<10;i++){const a=G.rng()*TAU,dd=G.rng()*520;
  G.projs.push({kind:"slam",x:h.x+Math.cos(a)*dd,y:h.y+Math.sin(a)*dd,delay:.12*i,fall:.4,r:170,dmg:150*dm,col:"#3fd0ff",img:"fx_brush",bImg:true,foam:{r:150,t:4,dps:14*dm}});}
 G.pools.push({x:h.x,y:h.y,r:260,t:5,dps:12*dm,foam:true});}
else if(id==="chaea"){for(let i=0;i<12;i++){const a=i/12*TAU;
  G.projs.push({kind:"boom",x:h.x,y:h.y,a:a,d:0,dist:500,spd:430,dmg:75*dm,sz:92,ret:false,col:"#ee62ff",hit:new Set(),rot:0,bagFx:true});}
 circleHit(h.x,h.y,400,50*dm,"#ee62ff",1.5);burst(h.x,h.y,"#ee62ff",30,300);
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:30,maxR:460,spd:640,dmg:0,delay:0,col:"#ee62ff",hit:new Set(),fxImg:"fx_candyring"});}
else if(id==="soeun"){G.flash={t:.7,c:"#ffffff"};G.shake=26;
 for(let j=G.mons.length-1;j>=0;j--){const m2=G.mons[j];if(m2.hp>0)hitMon(m2,m2.twin?m2.maxHp*.15:999999,{c:"#ff5d5d"});}
 if(G.mini)hitMon(G.mini,G.mini.maxHp*.15,{c:"#ff5d5d"});
 if(G.boss)hitMon(G.boss,G.boss.maxHp*.10,{c:"#ff5d5d"});
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:30,maxR:Math.max(W,H),spd:1500,dmg:0,delay:0,col:"#ff5d5d",hit:new Set(),nagFx:true});
 G.pools.push({x:h.x,y:h.y,r:560,t:4});}
else if(id==="siyeon"){h.invulnT=6;h.shieldCh=h.shieldMax||1;
 for(let q=0;q<3;q++)G.projs.push({kind:"ring",x:h.x,y:h.y,r:40+q*50,maxR:520+q*120,spd:560+q*120,dmg:44*dm,delay:q*.22,col:"#7fd8e8",hit:new Set(),stun:1,fxImg:"fx_shockring"});
 burst(h.x,h.y,"#7fd8e8",30,300);}
else if(id==="seoa"){for(let i=0;i<8;i++){const a2=i/8*TAU;
 G.projs.push({kind:"rul",x:0,y:0,a:a2,r:280,dmg:62*dm,delay:i*.09,t:.22,col:"#c9a06a",did:false,lv:9,ls:.3});}}
else if(id==="hyojin"){G.flash={t:.6,c:"#9fc3ff"};G.shake=16;
 for(let j=0;j<G.mons.length;j++)G.mons[j].stunT=Math.max(G.mons[j].stunT||0,5);
 if(G.mini)G.mini.stunT=Math.max(G.mini.stunT||0,2.5);
 if(G.boss)G.boss.stunT=Math.max(G.boss.stunT||0,2.5);
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:20,maxR:700,spd:560,dmg:70*dm,delay:0,col:"#4f6ef5",hit:new Set(),fxImg:"fx_nova"});
 G.banner={t:2,txt:STR.timeStop};}
else if(id==="jimin"){h.gBoostT=8;
 for(let j=0;j<G.mons.length;j++){const m2=G.mons[j];if(m2.hp<=0)continue;
  if(d2(m2.x,m2.y,h.x,h.y)<420*420)hitMon(m2,85*dm,{c:"#e0d084",kb:80,stun:.8});}
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:30,maxR:460,spd:600,dmg:0,delay:0,col:"#e0d084",hit:new Set(),fxImg:"fx_shockring"});
 burst(h.x,h.y,"#e0d084",30,300);}
else if(id==="hyeonjeong"){for(let i=0;i<40;i++){const a2=G.rng()*TAU,dd2=60+G.rng()*Math.min(W,H)*.45;
 G.pools.push({x:h.x+Math.cos(a2)*dd2,y:h.y+Math.sin(a2)*dd2,r:30,t:8,dps:26*dm,tack:true});}
 G.flash={t:.4,c:"#ff4d4d"};burst(h.x,h.y,"#ff4d4d",26,280);}
else {for(let i=0;i<30;i++){const a=G.rng()*TAU,dd=G.rng()*450;
 G.projs.push({kind:"slam",x:h.x+Math.cos(a)*dd,y:h.y+Math.sin(a)*dd,delay:.05*i,r:90,dmg:60*dm,col:"#fff7d1",img:"icon_chalk"});}}
}

/* ===== update: play ===== */
function updatePlay(dt){
const h=G.hero;
if(!setOpt("shake"))G.shake=0;
if(G.cutT>0){G.cutT-=dt;if(G.cutT<=0){G.cutT=0;fireUlt();}return;}
G.runT+=dt;G.stageT+=dt;
/* move */
let mx=0,my=0;
if(held.has("left"))mx-=1;if(held.has("right"))mx+=1;if(held.has("up"))my-=1;if(held.has("down"))my+=1;
if(joy.on){mx=joy.dx/60;my=joy.dy/60;}
const mm=Math.hypot(mx,my);
if(mm>0.01){mx/=Math.max(1,mm);my/=Math.max(1,mm);
 const spd=heroSpd(h)*(h.slowT>0?.55:1)*(G.slowAll>0?.7:1);
 h.x+=mx*spd*dt;h.y+=my*spd*dt;
 h.walkT=(h.walkT||0)+dt*spd*.0085;h.moving=true;h.aimA=Math.atan2(my,mx);
 h.dustT=(h.dustT||0)-dt;
 if(h.dustT<=0){h.dustT=.22;G.fx.push({kind:"img",img:"fx_dust",x:h.x-mx*18,y:h.y+34,r:34,t:.4,dur:.4});}
 if(Math.abs(mx)>.15)h.facing=mx>0?1:-1;}else{h.moving=false;}
if(h.slowT>0)h.slowT-=dt;if(G.slowAll>0)G.slowAll-=dt;if(h.hurtT>0)h.hurtT-=dt;
h.hp=Math.min(heroMaxHp(h),h.hp+(h.passives.vital||0)*.6*dt);
if(h.ultCd>0)h.ultCd-=dt;if(h.invulnT>0)h.invulnT-=dt;
for(let pi=0;pi<G.pools.length;pi++){const pl=G.pools[pi];
 if(pl.heal&&d2(h.x,h.y,pl.x,pl.y)<pl.r*pl.r){h.hp=Math.min(heroMaxHp(h),h.hp+7*dt);break;}}
if(pressed.has("ult")&&(h.ultG||0)>=100&&!G.cutT){h.ultG=0;G.cutT=1.15;}
/* weapons */
const dm=dmgMult(h);
for(const w in h.weapons){if(w==="bag"||w==="shield"||w==="clock"||w==="garlic")continue;
 if(h.disabled&&h.disabled[w])continue;
 h.timers[w]=(h.timers[w]||0)-dt;
 if(h.timers[w]<=0){h.timers[w]=weaponCd(w,h.weapons[w],h.evolved[w]);fireWeapon(w,h.weapons[w],h,dm);}}
if(h.weapons.clock&&!(h.disabled&&h.disabled.clock)){const lvC=h.weapons.clock,evC=h.evolved.clock;
 h.clockA=(h.clockA||0)+dt*(0.9+lvC*.12)*(evC?1.3:1);
 const LC=(140+lvC*14)*sizeMult(h),dmC=(10+lvC*2)*dmgMult(h)*(evC?1.5:1);
 for(let j=0;j<G.mons.length;j++){const m2=G.mons[j];if(m2.hp<=0)continue;
  const dxC=m2.x-h.x,dyC=m2.y-h.y,ddC=Math.hypot(dxC,dyC);
  if(ddC>LC+m2.size*.3)continue;
  const aM=Math.atan2(dyC,dxC);
  let d1=Math.abs(((aM-h.clockA)%TAU+TAU)%TAU);if(d1>Math.PI)d1=TAU-d1;
  let hit2=d1<.13+m2.size*.25/Math.max(40,ddC);
  if(!hit2&&evC){let d2a=Math.abs(((aM+h.clockA*1.6)%TAU+TAU)%TAU);if(d2a>Math.PI)d2a=TAU-d2a;hit2=d2a<.13+m2.size*.25/Math.max(40,ddC);}
  if(hit2&&(m2.clkT||0)<=0){m2.clkT=.4;hitMon(m2,dmC,{c:wcol("clock",lvC)});}
  if(m2.clkT>0)m2.clkT-=dt;}
 if(evC){h.freezeT=(h.freezeT||8)-dt;
  if(h.freezeT<=0){h.freezeT=8;G.flash={t:.4,c:"#9fc3ff"};
   for(let j=0;j<G.mons.length;j++)G.mons[j].stunT=Math.max(G.mons[j].stunT||0,1.3);
   if(G.mini)G.mini.stunT=Math.max(G.mini.stunT||0,1.3);
   G.banner={t:1.2,txt:STR.timeStop};}}}
if(h.weapons.garlic&&!(h.disabled&&h.disabled.garlic)){const lvG=h.weapons.garlic,evG=h.evolved.garlic;
 if(h.gBoostT>0)h.gBoostT-=dt;
 const gB=h.gBoostT>0?2.1:1;
 const RG=(80+lvG*11)*sizeMult(h)*(evG?1.3:1)*gB,dmG=(5+lvG*1.6)*dmgMult(h)*(evG?1.6:1)*gB;
 for(let j=0;j<G.mons.length;j++){const m2=G.mons[j];if(m2.hp<=0)continue;
  if(d2(m2.x,m2.y,h.x,h.y)<RG*RG){
   if((m2.gT||0)<=0){m2.gT=.5;hitMon(m2,dmG,{c:"#e0d084",kb:evG?14:5});}}
  if(m2.gT>0)m2.gT-=dt;}
 h.garlicR=RG;}
else h.garlicR=0;
if(h.weapons.shield&&!(h.disabled&&h.disabled.shield)){const lvS=h.weapons.shield,evS=h.evolved.shield;
 h.shieldMax=(1+(lvS>=4?1:0)+(lvS>=7?1:0)+(lvS>=10?1:0))+(evS?1:0);
 if(h.shieldCh===undefined)h.shieldCh=h.shieldMax;
 if(h.shieldCh<h.shieldMax){h.shieldT=(h.shieldT||0)-dt;
  if(h.shieldT<=0){h.shieldCh++;h.shieldT=Math.max(4,11-lvS*.6)*(evS?.6:1);}}
 h.shieldLv=lvS;h.shieldEv=evS;}
if(h.weapons.bag&&!(h.disabled&&h.disabled.bag)){const lv=h.weapons.bag,ev=h.evolved.bag;
 const n=(ev?7:2+(lv>=2?1:0)+(lv>=3?1:0)+(lv>=5?1:0)+(lv>=7?1:0)+(lv>=9?1:0));
 h.orbitA+=dt*(1.7+lv*.28)*(ev?1.35:1);
 const baseR=70+lv*15,R=ev?baseR*(1.15+.4*Math.sin(G.runT*2)):baseR;
 const bd=(12+lv*2)*dm*(ev?1.5:1);
 h.bags={n:n,R:R,col:wcol("bag",lv),ev:ev,lv:lv};
 const targets=G.mons;
 for(let i=0;i<n;i++){const a=h.orbitA+i/n*TAU,bx=h.x+Math.cos(a)*R,by=h.y+Math.sin(a)*R;
  for(let j=0;j<targets.length;j++){const m=targets[j];
   if((m.bagT||0)>0)continue;
   if(d2(bx,by,m.x,m.y)<(30+m.size*.4)*(30+m.size*.4)){m.bagT=.4;hitMon(m,bd,{c:h.bags.col,kb:14});}}
  if(G.mini&&(G.mini.bagT||0)<=0&&d2(bx,by,G.mini.x,G.mini.y)<(30+G.mini.size*.4)*(30+G.mini.size*.4)){G.mini.bagT=.4;hitMon(G.mini,bd,{});}
  if(G.boss&&(G.boss.bagT||0)<=0&&d2(bx,by,G.boss.x,G.boss.y)<(30+G.boss.size*.4)*(30+G.boss.size*.4)){G.boss.bagT=.4;hitMon(G.boss,bd,{});}}}
else h.bags=null;
updateProjs(dt,h);
updateMons(dt,h);
updatePickups(dt,h);
updateFx(dt);
/* stage flow */
const st=STAGES[G.stage];
if(st.mini&&!G.miniSpawned&&G.stageT>=st.miniAt)spawnMini(st.mini);
if(G.stage===STAGES.length-1&&!G.boss&&!G.bossDead&&G.stageT>=st.bossAt)spawnBoss();
/* camera */
G.cam.x=h.x-W/2;G.cam.y=h.y-H/2;
if(h.hp<=0){
 if(shopLv("revive")&&!h.revived){h.revived=true;h.hp=heroMaxHp(h)*.6;G.flash={t:.8,c:"#ffd700"};G.banner={t:2,txt:STR.revived};circleHit(h.x,h.y,300,400,"#ffd700");}
 else{bankCoins();G.mode="over";sfx("hurt");}}
}

/* ===== projectiles ===== */
function updateProjs(dt,h){
let wi=0;
for(let i=0;i<G.projs.length;i++){const p=G.projs[i];let alive=true;
if(p.delay>0){p.delay-=dt;if(p.kind==="swing"||p.kind==="slam"){G.projs[wi++]=p;continue;}G.projs[wi++]=p;continue;}
if(p.kind==="swing"){
 if(!p.did){p.did=true;sectorHit(h.x,h.y,p.a,p.r,1.05,p.dmg,p.col,36);}
 p.t-=dt;if(p.t<=0)alive=false;}
else if(p.kind==="ring"){
 p.r+=p.spd*dt;
 if(p.enemy){if(Math.abs(Math.hypot(h.x-p.x,h.y-p.y)-p.r)<38)hurtHero(p.edmg||20);if(p.r<p.maxR)G.projs[wi++]=p;continue;}
 const targets=G.mons;
 for(let j=0;j<targets.length;j++){const m=targets[j];
  if(p.hit.has(m))continue;
  const dd=Math.hypot(m.x-p.x,m.y-p.y);
  if(Math.abs(dd-p.r)<44){p.hit.add(m);hitMon(m,p.dmg,{c:p.col,stun:p.stun});}}
 if(G.mini&&!p.hit.has(G.mini)&&Math.abs(Math.hypot(G.mini.x-p.x,G.mini.y-p.y)-p.r)<60){p.hit.add(G.mini);hitMon(G.mini,p.dmg,{});}
 if(G.boss&&!p.hit.has(G.boss)&&Math.abs(Math.hypot(G.boss.x-p.x,G.boss.y-p.y)-p.r)<70){p.hit.add(G.boss);hitMon(G.boss,p.dmg,{stun:p.stun>1?1:0});}
 if(p.r>=p.maxR)alive=false;}
else if(p.kind==="boom"){
 p.rot+=dt*10;
 if(!p.x0){p.x0=h.x;p.y0=h.y;p.x=h.x;p.y=h.y;}
 if(!p.ret){p.d+=p.spd*dt;
  p.x=p.x0+Math.cos(p.a)*p.d;p.y=p.y0+Math.sin(p.a)*p.d;
  if(p.d>=p.dist){p.ret=true;p.hit.clear();}}
 else{const rdx=h.x-p.x,rdy=h.y-p.y,rdd=Math.hypot(rdx,rdy)||1;
  p.x+=rdx/rdd*p.spd*1.25*dt;p.y+=rdy/rdd*p.spd*1.25*dt;
  if(rdd<42)alive=false;}
 const targets=G.mons;
 for(let j=0;j<targets.length;j++){const m=targets[j];
  if(p.hit.has(m))continue;
  if(d2(p.x,p.y,m.x,m.y)<(p.sz*.6+m.size*.4)*(p.sz*.6+m.size*.4)){p.hit.add(m);hitMon(m,p.dmg,{c:p.col});}}
 if(G.mini&&!p.hit.has(G.mini)&&d2(p.x,p.y,G.mini.x,G.mini.y)<(p.sz*.6+G.mini.size*.4)*(p.sz*.6+G.mini.size*.4)){p.hit.add(G.mini);hitMon(G.mini,p.dmg,{});}
 if(G.boss&&!p.hit.has(G.boss)&&d2(p.x,p.y,G.boss.x,G.boss.y)<(p.sz*.6+G.boss.size*.4)*(p.sz*.6+G.boss.size*.4)){p.hit.add(G.boss);hitMon(G.boss,p.dmg,{});}}
else if(p.kind==="bomb"){
 p.t+=dt;const k=Math.min(1,p.t/p.ft);
 p.x=p.sx+(p.tx-p.sx)*k;p.y=p.sy+(p.ty-p.sy)*k-Math.sin(k*Math.PI)*120;
 if(k>=1){alive=false;
  circleHit(p.tx,p.ty,p.rad,p.dmg,p.col);boomfx(p.tx,p.ty,p.rad,"#fff","fx_milkburst");
  G.pools.push({x:p.tx,y:p.ty,r:p.rad*.9,t:4,heal:p.healP});
  if(p.ev)G.projs.push({kind:"slam",x:p.tx,y:p.ty,delay:.35,r:p.rad*1.1,dmg:p.dmg*.7,col:"#ff89b6",img:"icon_milk"});}}
else if(p.kind==="chalk"){
 p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;
 const targets=G.mons;
 for(let j=0;j<targets.length&&alive;j++){const m=targets[j];
  if(p.hit.has(m))continue;
  if(d2(p.x,p.y,m.x,m.y)<(14+m.size*.4)*(14+m.size*.4)){p.hit.add(m);hitMon(m,p.dmg,{c:p.col});
   if(p.pierce>0)p.pierce--;else alive=false;}}
 if(alive&&G.mini&&!p.hit.has(G.mini)&&d2(p.x,p.y,G.mini.x,G.mini.y)<(14+G.mini.size*.4)*(14+G.mini.size*.4)){p.hit.add(G.mini);hitMon(G.mini,p.dmg,{});if(p.pierce>0)p.pierce--;else alive=false;}
 if(alive&&G.boss&&!p.hit.has(G.boss)&&d2(p.x,p.y,G.boss.x,G.boss.y)<(14+G.boss.size*.4)*(14+G.boss.size*.4)){p.hit.add(G.boss);hitMon(G.boss,p.dmg,{});if(p.pierce>0)p.pierce--;else alive=false;}
 if(p.t<=0)alive=false;}
else if(p.kind==="alarm"){p.t+=dt;p.fl=(p.fl||0)-dt;
 if(p.fl<=0){p.fl=.4;G.flash={t:.22,c:"#ff3b3b"};}
 if(p.t>=p.warn){alive=false;G.flash={t:.6,c:"#ffffff"};G.shake=24;sfx("levelup");
  for(let j=G.mons.length-1;j>=0;j--){const m2=G.mons[j];if(m2.hp>0)hitMon(m2,m2.twin?m2.maxHp*p.bossPct:999999,{c:"#ff5d5d"});}
  if(G.mini)hitMon(G.mini,G.mini.maxHp*p.bossPct,{c:"#ff5d5d"});
  if(G.boss)hitMon(G.boss,G.boss.maxHp*p.bossPct*.7,{c:"#ff5d5d"});
  G.projs.push({kind:"ring",x:G.hero.x,y:G.hero.y,r:30,maxR:Math.max(W,H),spd:1500,dmg:0,delay:0,col:"#ff5d5d",hit:new Set(),nagFx:true});
  if(p.evA)G.pools.push({x:G.hero.x,y:G.hero.y,r:540,t:4});}}
else if(p.kind==="rul"){
 if(!p.did&&p.t<=.13){p.did=true;const cnt=sectorHit(h.x,h.y,p.a,p.r,.17,p.dmg,p.col,28);
  if(cnt>0){const heal=p.dmg*p.ls*Math.min(cnt,6);h.hp=Math.min(heroMaxHp(h),h.hp+heal);pushNum(h.x,h.y-50,Math.round(heal),"#7dff9a");}}
 p.t-=dt;if(p.t<=0)alive=false;}
else if(p.kind==="ddak"){
 if(!p.tgt||p.tgt.hp<=0||p.hit.has(p.tgt)){
  let best=null,bd=340*340;
  for(let j=0;j<G.mons.length;j++){const m2=G.mons[j];if(p.hit.has(m2)||m2.hp<=0)continue;const dd2=d2(p.x,p.y,m2.x,m2.y);if(dd2<bd){bd=dd2;best=m2;}}
  if(!best&&G.mini&&!p.hit.has(G.mini))best=G.mini;
  if(!best&&G.boss&&!p.hit.has(G.boss))best=G.boss;
  p.tgt=best;
  if(!p.tgt)alive=false;}
 if(alive&&p.tgt){const dx2=p.tgt.x-p.x,dy2=p.tgt.y-p.y,dd2=Math.hypot(dx2,dy2)||1;
  p.x+=dx2/dd2*p.spd*dt;p.y+=dy2/dd2*p.spd*dt;p.rot=(p.rot||0)+dt*14;
  if(dd2<30+p.tgt.size*.3){hitMon(p.tgt,p.dmg*p.mult,{c:p.ev?"#ffd700":"#4f8ef5"});G.fx.push({kind:"img",img:"fx_zap",x:p.x,y:p.y,r:74,t:.28,dur:.28});p.hit.add(p.tgt);p.mult*=(p.ev?1.3:1.15);p.left--;burst(p.x,p.y,p.ev?"#ffd700":"#4f8ef5",5,160);
   if(p.left<=0)alive=false;}}}
else if(p.kind==="slam"){
 p.t=(p.t||0)+dt;
 if(!p.boomed&&p.t>=(p.fall||.28)){p.boomed=true;
  circleHit(p.x,p.y,p.r,p.dmg,p.col);boomfx(p.x,p.y,p.r,p.col,(p.hImg||p.giant)?"fx_bonk":(p.bImg?"fx_foamburst":(p.milkPool?"fx_milkburst":null)));
  if(p.shock)G.projs.push({kind:"ring",x:p.x,y:p.y,r:p.r*.4,maxR:p.r*2.2,spd:520,dmg:p.dmg*.35,delay:0,col:"#ffd700",hit:new Set(),fxImg:"fx_shockring"});
  if(p.giant){G.shake=26;G.flash={t:.4,c:"#ffd700"};for(let q=0;q<2;q++)G.projs.push({kind:"ring",x:p.x,y:p.y,r:40+q*60,maxR:p.r*(2.6+q*.9),spd:600+q*140,dmg:p.dmg*.3,delay:q*.12,col:"#ffd700",hit:new Set(),fxImg:"fx_shockring"});}
  if(p.milkPool)G.pools.push({x:p.x,y:p.y,r:p.r*.85,t:5});
  if(p.foam){G.pools.push({x:p.x,y:p.y,r:p.foam.r,t:p.foam.t,dps:p.foam.dps,foam:true});burst(p.x,p.y,"#3fd0ff",14,260);}}
 if(p.t>=(p.fall||.28)+.3)alive=false;}
if(alive)G.projs[wi++]=p;}
G.projs.length=wi;
/* enemy projectiles */
wi=0;
for(let i=0;i<G.eprojs.length;i++){const p=G.eprojs[i];let alive=true;
p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;p.rot=(p.rot||0)+dt*6;
if(d2(p.x,p.y,h.x,h.y)<30*30){alive=false;hurtHero(p.dmg);}
if(p.t<=0)alive=false;
if(alive)G.eprojs[wi++]=p;}
G.eprojs.length=wi;
}
function hurtHero(dmg){const h=G.hero;if(h.hurtT>0||h.invulnT>0)return;
if((h.shieldCh||0)>0){h.shieldCh--;
 if(h.shieldT===undefined||h.shieldT<=0)h.shieldT=Math.max(4,11-(h.shieldLv||1)*.6)*(h.shieldEv?.6:1);
 burst(h.x,h.y,"#7fd8e8",22,300);G.shake=Math.max(G.shake,9);
 const br=(150+(h.shieldLv||1)*13)*sizeMult(h),bd=(50+(h.shieldLv||1)*8)*dmgMult(h)*(h.shieldEv?1.6:1);
 for(let j=0;j<G.mons.length;j++){const m2=G.mons[j];if(m2.hp<=0)continue;
  if(d2(m2.x,m2.y,h.x,h.y)<br*br)hitMon(m2,bd,{c:"#7fd8e8",kb:90,stun:h.shieldEv?1:.4});}
 if(G.mini&&d2(G.mini.x,G.mini.y,h.x,h.y)<br*br)hitMon(G.mini,bd,{c:"#7fd8e8"});
 G.projs.push({kind:"ring",x:h.x,y:h.y,r:30,maxR:br*1.4,spd:620,dmg:0,delay:0,col:"#7fd8e8",hit:new Set(),fxImg:"fx_shockring"});
 h.hurtT=.4;sfx("hurt");return;}
h.hp-=dmg*armorMult();h.hurtT=.75;G.shake=Math.max(G.shake,6);sfx("hurt");}

/* ===== monsters ===== */
const MAX_MONS=400;
function spawnMon(kind,x,y,hpMul){
if(G.mons.length>=MAX_MONS)return;
const stg=STAGES[G.stage],d=MON_DEF[kind],sc=(1+G.runT/60*.18)*(stg.hpm||1);
G.mons.push({kind:kind,img:d.img,x:x,y:y,hp:d.hp*sc*(hpMul||1),maxHp:d.hp*sc*(hpMul||1),
spd:d.spd*(stg.spm||1),dmg:Math.round(d.dmg*(stg.dmgm||1)),size:d.size,xp:d.xp,ranged:d.ranged,ai:d.ai,shots:d.shots||1,shootCd:d.shootCd||3,phase:G.rng()*TAU,chargeCd:3+G.rng()*2,shootT:1+G.rng()*2,
flash:0,stunT:0,bagT:0,slowT:0});}
function spawnEdge(kind){
const a=G.rng()*TAU,R=Math.hypot(W,H)*.6+80;
spawnMon(kind,G.hero.x+Math.cos(a)*R,G.hero.y+Math.sin(a)*R);}
function updateMons(dt,h){
/* spawner */
G.spawnCd-=dt;
const st=STAGES[G.stage];
const interval=Math.max(.12,.8-G.runT*.004-G.stage*.08);
if(G.spawnCd<=0){G.spawnCd=interval;
 let kk=st.mons[(G.rng()*st.mons.length)|0];
 if(MON_DEF[kk].ranged&&(G.rng()<.45||G.mons.filter(m=>m.ranged).length>=20))kk=st.mons[0];
 spawnEdge(kk);}
let wi=0;
for(let i=0;i<G.mons.length;i++){const m=G.mons[i];let alive=m.hp>0;
if(alive){
 if(m.flash>0)m.flash-=dt;if(m.bagT>0)m.bagT-=dt;
 if(m.twin){
  if(m.stunT>0){m.stunT-=dt;}
  else if(m.dashing){m.x+=m.dashing.vx*dt;m.y+=m.dashing.vy*dt;m.dashing.t-=dt;
   if(d2(m.x,m.y,h.x,h.y)<(m.size*.45+26)*(m.size*.45+26))hurtHero(m.dashing.dmg);
   if(m.dashing.t<=0)m.dashing=null;}
  else{const dx2=h.x-m.x,dy2=h.y-m.y,dd2=Math.hypot(dx2,dy2)||1;
   m.x+=dx2/dd2*m.spd*dt;m.y+=dy2/dd2*m.spd*dt;
   if(dd2<(m.size*.4+26))hurtHero(m.dmg);
   if(!(h.hurtT>0||h.invulnT>0)){const minD=m.size*.42+26,ddc=Math.hypot(m.x-h.x,m.y-h.y);
    if(ddc<minD&&ddc>0){m.x=h.x+(m.x-h.x)/ddc*minD;m.y=h.y+(m.y-h.y)/ddc*minD;}}
   m.patT-=dt;
   if(m.patT<=0){m.patT=3.2;const aT=Math.atan2(dy2,dx2);
    G.zones.push({shape:"dash",x:m.x,y:m.y,a:aT,len:800,t:0,dur:.7,dmg:m.dmg+6,src:m});}}
  G.mons[wi++]=m;continue;}
 if(m.stunT>0){m.stunT-=dt;}
 else{
  let sp=m.spd*(G.slowAll>0?.5:1);
  let dpsSum=0,inPool=false;
  for(let k=0;k<G.pools.length;k++){const pl=G.pools[k];if(pl.drop>0)continue;if(d2(m.x,m.y,pl.x,pl.y)<pl.r*pl.r){inPool=true;if(pl.dps)dpsSum+=pl.dps;}}
  if(inPool)sp*=.5;
  if(dpsSum>0){m.dotT=(m.dotT||0)-dt;if(m.dotT<=0){m.dotT=.28;hitMon(m,dpsSum*.28,{c:"#7fe8d8"});}}
  const dx=h.x-m.x,dy=h.y-m.y,dd=Math.hypot(dx,dy)||1;
  if(m.ranged){
   if(dd>340){m.x+=dx/dd*sp*dt;m.y+=dy/dd*sp*dt;}
   else if(dd<220){m.x-=dx/dd*sp*.8*dt;m.y-=dy/dd*sp*.8*dt;}
   m.shootT-=dt;
   if(m.shootT<=0&&dd<560){m.shootT=m.shootCd+G.rng()*.8;
    const a=Math.atan2(dy,dx);
    for(let q=0;q<m.shots;q++){const aa=a+(q-(m.shots-1)/2)*.22;G.eprojs.push({x:m.x,y:m.y,vx:Math.cos(aa)*230,vy:Math.sin(aa)*230,t:3.2,dmg:m.dmg});}}}
  else if(m.ai==='dash'){
   m.chargeCd-=dt;
   if(m.chargeCd<=0&&!m.windup&&!m.chargeT){m.windup=.65;m.chargeA=Math.atan2(dy,dx);G.fx.push({kind:'warn',x:m.x,y:m.y,r:m.size*.7,t:.65,c:'#ffbc70'});}
   if(m.windup>0){m.windup-=dt;if(m.windup<=0){m.windup=0;m.chargeT=.42;m.chargeCd=4.5;}}
   else if(m.chargeT>0){m.chargeT=Math.max(0,m.chargeT-dt);m.x+=Math.cos(m.chargeA)*410*dt;m.y+=Math.sin(m.chargeA)*410*dt;}
   else{m.x+=dx/dd*sp*dt;m.y+=dy/dd*sp*dt;}
  }else if(m.ai==='weave'){const sway=Math.sin(G.runT*4+m.phase)*.7;m.x+=(dx/dd-dy/dd*sway)*sp*dt;m.y+=(dy/dd+dx/dd*sway)*sp*dt;}
  else{m.x+=dx/dd*sp*dt;m.y+=dy/dd*sp*dt;}
  if(dd<(26+m.size*.35))hurtHero(m.dmg);
  if(!(h.hurtT>0||h.invulnT>0)){const minD=26+m.size*.36,dxc=m.x-h.x,dyc=m.y-h.y,ddc=Math.hypot(dxc,dyc);
   if(ddc<minD&&ddc>0){m.x=h.x+dxc/ddc*minD;m.y=h.y+dyc/ddc*minD;}}}
 if(d2(m.x,m.y,h.x,h.y)>1800*1800){alive=false;}}
if(alive)G.mons[wi++]=m;}
G.mons.length=wi;
/* separation */
{const cell=76,grid=new Map();
 for(let i2=0;i2<G.mons.length;i2++){const m2=G.mons[i2];
  const key=Math.floor(m2.x/cell)+","+Math.floor(m2.y/cell);
  let arr=grid.get(key);if(!arr){arr=[];grid.set(key,arr);}arr.push(m2);}
 for(const[key,arr]of grid){const parts2=key.split(",");const gx=+parts2[0],gy=+parts2[1];
  for(let a2=0;a2<arr.length;a2++){const A=arr[a2];
   for(let ni=0;ni<5;ni++){const ox=[0,0,1,1,1][ni],oy=[0,1,-1,0,1][ni];
    const nb=(ox===0&&oy===0)?arr:grid.get((gx+ox)+","+(gy+oy));if(!nb)continue;
    for(let b2=(ox===0&&oy===0)?a2+1:0;b2<nb.length;b2++){const B=nb[b2];
     const rr=(A.size+B.size)*.27,dx3=B.x-A.x,dy3=B.y-A.y,dd3=dx3*dx3+dy3*dy3;
     if(dd3<rr*rr&&dd3>.01){const d3=Math.sqrt(dd3),push=(rr-d3)*.5,ux=dx3/d3,uy=dy3/d3;
      A.x-=ux*push;A.y-=uy*push;B.x+=ux*push;B.y+=uy*push;}}}}}}
updateMini(dt,h);
updateBoss(dt,h);
/* pools decay */
wi=0;for(let i=0;i<G.pools.length;i++){const p=G.pools[i];if(p.drop>0){p.drop-=dt;if(p.drop<=0)boomfx(p.x,p.y,p.r*1.4,"#d8cfc4","fx_dust");}else p.t-=dt;if(p.t>0)G.pools[wi++]=p;}G.pools.length=wi;
/* zones (telegraphs) */
wi=0;
for(let i=0;i<G.zones.length;i++){const z=G.zones[i];z.t+=dt;let alive=true;
if(z.t>=z.dur){alive=false;
 if(z.shape==="circle"){boomfx(z.x,z.y,z.r,"#ff5d5d",z.ink?"fx_inkring":null);if(d2(z.x,z.y,h.x,h.y)<z.r*z.r)hurtHero(z.dmg);
  if(z.ink)G.pools.push({x:z.x,y:z.y,r:z.r*.9,t:4});}
 else if(z.shape==="dash"){
  const b=(z.src&&z.src.hp>0)?z.src:(G.boss||G.mini);if(b){b.dashing={vx:Math.cos(z.a)*900,vy:Math.sin(z.a)*900,t:.5,dmg:z.dmg};}}}
if(alive)G.zones[wi++]=z;}
G.zones.length=wi;
}
function killMon(m){
if(m.type==="mini"){miniDie(m);return;}
if(m.type==="boss"){bossDie();return;}
m.hp=-1;G.kills++;
if(m.ai==='brood'){for(let q=0;q<2;q++)spawnMon('slime',m.x+(q?20:-20),m.y,0.6);}
burst(m.x,m.y,"#9fe855",6,140);sfx("pop");
/* drops */
dropGem(m.x,m.y,m.xp);
const lk=luckMult();
const r=G.rng();
if(r<.05*lk)G.items.push({type:"coin",x:m.x+8,y:m.y+8,bob:G.rng()*TAU});
else if(r<.058*lk)G.items.push({type:"heal",x:m.x,y:m.y,bob:G.rng()*TAU});
else if(r<.062*lk)G.items.push({type:"mag",x:m.x,y:m.y,bob:G.rng()*TAU});
}
function dropGem(x,y,v){
if(G.gems.length>240){let best=null,bd=1e18;
 for(let i=0;i<G.gems.length;i++){const g=G.gems[i];const dd=d2(x,y,g.x,g.y);if(dd<bd){bd=dd;best=g;}}
 if(best){best.v+=v;best.big=true;return;}}
G.gems.push({x:x,y:y,v:v,pull:false,bob:G.rng()*TAU,big:v>=3});}
/* ===== pickups ===== */
function updatePickups(dt,h){
const pr=pickR(h);
let wi=0;
for(let i=0;i<G.gems.length;i++){const g=G.gems[i];let alive=true;
g.bob+=dt*4;
const dd=d2(g.x,g.y,h.x,h.y);
if(g.pull||dd<pr*pr){const d=Math.sqrt(dd)||1;const sp=520+ (g.pull?300:0);
 g.x+=(h.x-g.x)/d*sp*dt;g.y+=(h.y-g.y)/d*sp*dt;}
if(dd<34*34){alive=false;gainXp(h,g.v);}
if(alive)G.gems[wi++]=g;}
G.gems.length=wi;
wi=0;
for(let i=0;i<G.items.length;i++){const it=G.items[i];let alive=true;
it.bob+=dt*3;
const dd=d2(it.x,it.y,h.x,h.y);
if(it.type!=="chest"&&dd<pr*pr){const d=Math.sqrt(dd)||1;it.x+=(h.x-it.x)/d*420*dt;it.y+=(h.y-it.y)/d*420*dt;}
if(dd<40*40){alive=false;
 if(it.type==="coin")G.coins+=2;
 else if(it.type==="heal"){h.hp=Math.min(heroMaxHp(h),h.hp+30);pushNum(h.x,h.y-40,30,"#7dff9a");G.fx.push({kind:"img",img:"fx_healfx",x:h.x,y:h.y-30,r:110,t:.6,dur:.6});sfx("pop");}
 else if(it.type==="mag"){for(let j=0;j<G.gems.length;j++)G.gems[j].pull=true;G.flash={t:.4,c:"#6ab8ff"};sfx("pop");}
 else if(it.type==="chest"){G.pendingAdvance=it.adv;G.fx.push({kind:"img",img:"fx_sparkle",x:it.x,y:it.y,r:170,t:.7,dur:.7});openChest();}}
if(alive)G.items[wi++]=it;}
G.items.length=wi;
}
function updateFx(dt){
let wi=0;for(let i=0;i<G.fx.length;i++){const f=G.fx[i];f.t-=dt;if(f.t>0)G.fx[wi++]=f;}G.fx.length=wi;
wi=0;for(let i=0;i<G.parts.length;i++){const p=G.parts[i];p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.t>0)G.parts[wi++]=p;}G.parts.length=wi;
wi=0;for(let i=0;i<G.nums.length;i++){const n=G.nums[i];n.t-=dt;n.y-=40*dt;if(n.t>0)G.nums[wi++]=n;}G.nums.length=wi;
if(G.banner){G.banner.t-=dt;if(G.banner.t<=0)G.banner=null;}
if(G.flash){G.flash.t-=dt;if(G.flash.t<=0)G.flash=null;}
if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30);
}

/* ===== minibosses ===== */
function spawnMini(kind){
G.miniSpawned=true;
const d=MINI_DEF[kind],sc=1+G.stage*1.25;
const a=G.rng()*TAU;
G.mini={type:"mini",kind:kind,img:d.img,x:G.hero.x+Math.cos(a)*600,y:G.hero.y+Math.sin(a)*600,
hp:d.hp*sc,maxHp:d.hp*sc,dmg:d.dmg,spd:d.spd,size:d.size,pat:d.pat,patT:2,stunT:0,bagT:0,flash:0,dashing:null};
if(kind==="pencil"){G.mons.push({kind:"ptwin",img:"mini_pencil",x:G.mini.x+170,y:G.mini.y+130,hp:d.hp*sc*.7,maxHp:d.hp*sc*.7,spd:d.spd,dmg:d.dmg-4,size:d.size*.9,xp:20,flash:0,stunT:0,bagT:0,slowT:0,patT:2.4,twin:true});}
G.banner={t:3,txt:STR.miniWarn(STR.miniNames[kind])};G.shake=10;sfx("hurt");}
function updateMini(dt,h){
const m=G.mini;if(!m)return;
if(m.flash>0)m.flash-=dt;if(m.bagT>0)m.bagT-=dt;
if(m.stunT>0){m.stunT-=dt;return;}
if(m.dashing){m.x+=m.dashing.vx*dt;m.y+=m.dashing.vy*dt;m.dashing.t-=dt;
 if(d2(m.x,m.y,h.x,h.y)<(m.size*.45+26)*(m.size*.45+26))hurtHero(m.dashing.dmg);
 if(m.dashing.t<=0)m.dashing=null;return;}
const dx=h.x-m.x,dy=h.y-m.y,dd=Math.hypot(dx,dy)||1;
m.x+=dx/dd*m.spd*dt;m.y+=dy/dd*m.spd*dt;
if(dd<(m.size*.4+26))hurtHero(m.dmg);
if(!(h.hurtT>0||h.invulnT>0)){const minD=m.size*.42+26,dxc=m.x-h.x,dyc=m.y-h.y,ddc=Math.hypot(dxc,dyc);
 if(ddc<minD&&ddc>0){m.x=h.x+dxc/ddc*minD;m.y=h.y+dyc/ddc*minD;}}
m.patT-=dt;
if(m.patT<=0){m.patT=m.pat==="rush"?2.9:m.kind==="milkgolem"?2.3:1.9;m.seq=(m.seq||0)+1;
 const pk=m.pat==="rush"?"dash":m.pat==="dash"?["dash","xdash","dash","xdash"][m.seq%4]:m.pat==="spin"?["spiral","rings","inkzone","spiral"][m.seq%4]:["slam","summon","slam","slam"][m.seq%4];
 if(pk==="jump"){m.dashing={vx:dx/dd*880,vy:dy/dd*880,t:.45,dmg:m.dmg+6};G.fx.push({kind:"warn",x:m.x,y:m.y,r:m.size,t:.3,c:"#ff5d5d"});}
 else if(pk==="dash"){const a=Math.atan2(dy,dx);
  G.zones.push({shape:"dash",x:m.x,y:m.y,a:a,len:900,t:0,dur:.7,dmg:m.dmg+8});
  if(G.stage>=2)G.zones.push({shape:"dash",x:m.x,y:m.y,a:a+.6,len:900,t:.3,dur:1,dmg:m.dmg+8});}
 else if(pk==="volley"){const b0=Math.atan2(dy,dx),n=5+G.stage*2;
  for(let i=0;i<n;i++){const a2=b0+(i-(n-1)/2)*.2;
   G.eprojs.push({x:m.x,y:m.y,vx:Math.cos(a2)*305,vy:Math.sin(a2)*305,t:3,dmg:Math.max(8,m.dmg-6)});}}
 else if(pk==="spiral"){const n=12+G.stage*4,b0=G.rng()*TAU;
  for(let i=0;i<n;i++){const a2=b0+i/n*TAU;
   G.eprojs.push({x:m.x,y:m.y,vx:Math.cos(a2)*238,vy:Math.sin(a2)*238,t:3.4,dmg:Math.max(8,m.dmg-8)});}}
 else if(pk==="bigjump"){m.bigJump=true;m.dashing={vx:dx/dd*1050,vy:dy/dd*1050,t:.5,dmg:m.dmg+10};G.fx.push({kind:"warn",x:m.x,y:m.y,r:m.size*1.3,t:.4,c:"#ff5d5d"});}
 else if(pk==="xdash"){const a=Math.atan2(dy,dx);
  G.zones.push({shape:"dash",x:m.x,y:m.y,a:a-.45,len:900,t:0,dur:.7,dmg:m.dmg+8});
  G.zones.push({shape:"dash",x:m.x,y:m.y,a:a+.45,len:900,t:.25,dur:.95,dmg:m.dmg+8});}
 else if(pk==="inkzone"){for(let q=0;q<3;q++)G.zones.push({shape:"circle",x:h.x+(G.rng()-.5)*280,y:h.y+(G.rng()-.5)*280,r:105,t:0,dur:.9+q*.15,dmg:m.dmg+6,ink:true});}
 else if(pk==="summon"){for(let q=0;q<3;q++)spawnMon("milk",m.x+(G.rng()-.5)*180,m.y+(G.rng()-.5)*180,2.5);G.banner={t:1.2,txt:STR.miniSummon};}
 else if(pk==="rings"){for(let q=0;q<2;q++)G.projs.push({kind:"ring",x:m.x,y:m.y,r:10,maxR:540,spd:275+q*55,dmg:0,delay:q*.4,col:"#c9b8ff",hit:new Set(),enemy:true,edmg:Math.max(10,m.dmg-6),nagFx:true});}
 else if(pk==="slam"){
  G.zones.push({shape:"circle",x:h.x,y:h.y,r:150,t:0,dur:1,dmg:m.dmg+10});
  G.projs.push({kind:"ring",x:m.x,y:m.y,r:10,maxR:500,spd:300,dmg:0,delay:0,col:"#c9b8ff",hit:new Set(),enemy:true,edmg:Math.max(10,m.dmg-8),fxImg:"fx_inkring"});}}
if(m.hp<=0)miniDie(m);}
function miniDie(m){
G.mini=null;G.kills++;G.shake=14;G.flash={t:.5,c:"#ffd700"};
burst(m.x,m.y,"#ffd700",40,300);sfx("levelup");
G.banner={t:2.5,txt:STR.stageClear};
for(let i=0;i<4;i++)G.items.push({type:"coin",x:m.x+(G.rng()-.5)*100,y:m.y+(G.rng()-.5)*100,bob:G.rng()*TAU});
G.items.push({type:"chest",x:m.x,y:m.y,bob:0,adv:true});
if(m.kind==="slime")for(let i=0;i<4;i++)spawnMon("slime",m.x+(G.rng()-.5)*120,m.y+(G.rng()-.5)*120,2);}
/* ===== final boss ===== */
function spawnBoss(){
const a=G.rng()*TAU;
G.boss={type:"boss",img:"boss_broom",x:G.hero.x+Math.cos(a)*700,y:G.hero.y+Math.sin(a)*700,
hp:30000,maxHp:30000,dmg:36,spd:64,size:200,atkT:3,stunT:0,bagT:0,flash:0,dashing:null,phase:1,minionT:10};
G.banner={t:3.5,txt:STR.bossWarn};G.shake=20;playBgm("bgm_boss");}
function updateBoss(dt,h){
const b=G.boss;if(!b)return;
if(b.flash>0)b.flash-=dt;if(b.bagT>0)b.bagT-=dt;
const hpr=b.hp/b.maxHp;
b.phase=hpr<.3?3:hpr<.6?2:1;
if(b.stunT>0){b.stunT-=dt;return;}
if(b.dashing){b.x+=b.dashing.vx*dt;b.y+=b.dashing.vy*dt;b.dashing.t-=dt;
 if(d2(b.x,b.y,h.x,h.y)<(b.size*.45+26)*(b.size*.45+26))hurtHero(b.dashing.dmg);
 if(b.dashing.t<=0)b.dashing=null;return;}
const dx=h.x-b.x,dy=h.y-b.y,dd=Math.hypot(dx,dy)||1;
const sp=b.spd*(b.phase===3?1.5:1);
b.x+=dx/dd*sp*dt;b.y+=dy/dd*sp*dt;
if(dd<(b.size*.4+26))hurtHero(b.dmg);
if(!(h.hurtT>0||h.invulnT>0)){const minD=b.size*.42+26,dxc=b.x-h.x,dyc=b.y-h.y,ddc=Math.hypot(dxc,dyc);
 if(ddc<minD&&ddc>0){b.x=h.x+dxc/ddc*minD;b.y=h.y+dyc/ddc*minD;}}
b.minionT-=dt;
if(b.minionT<=0){b.minionT=b.phase===3?8:12;for(let i=0;i<3+b.phase;i++)spawnEdge("ghost");}
b.atkT-=dt;
if(b.atkT<=0){b.atkT=b.phase===3?1.9:b.phase===2?2.9:4.2;
 b.seq=(b.seq||0)+1;
 const pool=b.phase===1?["nag","volley","spiral","volley"]:b.phase===2?["nag","dash","volley","homework","spiral","gym"]:["rain","spiral","dash","dash","nag","homework","spiral","volley"];
 const atk=pool[b.seq%pool.length];
 if(atk==="nag"){const n=b.phase===3?5:3;
  for(let i=0;i<n;i++)G.projs.push({kind:"ring",x:b.x,y:b.y,r:10,maxR:680,spd:280+i*45,dmg:0,delay:i*.42,col:"#ff9d9d",hit:new Set(),enemy:true,edmg:24,nagFx:true});
  G.banner={t:1.2,txt:STR.bossNag};}
 else if(atk==="volley"){const n=b.phase===3?18:11,base=Math.atan2(dy,dx);
  for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.15;
   G.eprojs.push({x:b.x,y:b.y,vx:Math.cos(a)*345,vy:Math.sin(a)*345,t:3.2,dmg:20});}}
 else if(atk==="dash"){const a=Math.atan2(dy,dx);
  G.zones.push({shape:"dash",x:b.x,y:b.y,a:a,len:1100,t:0,dur:.8,dmg:35});
  if(b.phase===3)G.zones.push({shape:"dash",x:b.x,y:b.y,a:a+.5,len:1100,t:.4,dur:1.2,dmg:35});}
 else if(atk==="homework"){const n=b.phase===3?9:6;
  for(let i=0;i<n;i++)G.zones.push({shape:"circle",x:h.x+(G.rng()-.5)*560,y:h.y+(G.rng()-.5)*560,r:112,t:0,dur:1+i*.07,dmg:34,hw:true});
  G.banner={t:1.2,txt:STR.bossHomework};}
 else if(atk==="gym"){G.slowAll=3.5;G.flash={t:.5,c:"#5d8dff"};G.banner={t:2,txt:STR.bossGym};}
 else if(atk==="spiral"){const n=b.phase===3?30:22,b0=(b.seq*.7)%TAU;
  for(let i=0;i<n;i++){const a2=b0+i/n*TAU;
   G.eprojs.push({x:b.x,y:b.y,vx:Math.cos(a2)*265,vy:Math.sin(a2)*265,t:3.6,dmg:22});}
  if(b.phase===3)for(let i=0;i<n;i++){const a2=-b0-i/n*TAU;
   G.eprojs.push({x:b.x,y:b.y,vx:Math.cos(a2)*205,vy:Math.sin(a2)*205,t:4,dmg:22});}
  G.banner={t:1,txt:STR.bossSpiral};}
 else if(atk==="rain"){for(let i=0;i<16;i++)G.zones.push({shape:"circle",x:h.x+(G.rng()-.5)*900,y:h.y+(G.rng()-.5)*900,r:100,t:0,dur:.75+i*.05,dmg:36,hw:true});
  G.banner={t:1.2,txt:STR.bossRain};}}
if(b.hp<=0)bossDie();}
function bossDie(){
const b=G.boss;G.boss=null;G.bossDead=true;
G.shake=30;G.flash={t:1.5,c:"#ffd700"};
burst(b.x,b.y,"#ffd700",80,400);burst(b.x,b.y,"#ff5d5d",60,300);
for(let i=0;i<10;i++)G.items.push({type:"coin",x:b.x+(G.rng()-.5)*200,y:b.y+(G.rng()-.5)*200,bob:G.rng()*TAU});
bankCoins();G.mode="win";sfx("levelup");}

/* ===== render ===== */
const TILE_W=1280,TILE_H=720;
function roundPanel(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function drawRoomProps(stage){
ctx.save();
const prop=atlasFrame(ART.props,stage,false,2,3),plant=atlasFrame(ART.props,5,false,2,3);
paintImage(prop,65,12,355,285);paintImage(plant,1015,480,170,220);
ctx.globalAlpha=.11;ctx.fillStyle=['#b8b39a','#9cae9e','#8aabba','#a9a2c4','#ba9e88'][stage];ctx.beginPath();ctx.ellipse(650,400,220,135,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
ctx.strokeStyle='#cdd4bd17';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(650,400,208,123,0,0,TAU);ctx.stroke();ctx.restore();
}
const ROOM_CACHE=[];
function roomTexture(stage){
 if(ROOM_CACHE[stage])return ROOM_CACHE[stage];
 if(!ART.floor.complete||!ART.floor.naturalWidth||!ART.props.complete||!ART.props.naturalWidth)return null;
 const tile=document.createElement('canvas');tile.width=TILE_W;tile.height=TILE_H;
 const original=ctx;ctx=tile.getContext('2d');
 try{paintImage(ART.floor,0,0,TILE_W,TILE_H);ctx.fillStyle=['#082c3333','#24352d22','#163e5738','#342c4b33','#40271933'][stage];ctx.fillRect(0,0,TILE_W,TILE_H);drawRoomProps(stage);}
 finally{ctx=original;}
 return ROOM_CACHE[stage]=tile;
}
function drawBg(){
const cx=G.cam.x,cy=G.cam.y,texture=roomTexture(G.stage);
const x0=Math.floor(cx/TILE_W),x1=Math.floor((cx+W)/TILE_W);
const y0=Math.floor(cy/TILE_H),y1=Math.floor((cy+H)/TILE_H);
for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
 if(texture)ctx.drawImage(texture,tx*TILE_W-cx,ty*TILE_H-cy,TILE_W,TILE_H);
 else{ctx.fillStyle='#574b40';ctx.fillRect(tx*TILE_W-cx,ty*TILE_H-cy,TILE_W,TILE_H);}
}
}
function drawAtmosphere(h){
 const x=h.x-G.cam.x,y=h.y-G.cam.y;
 let glow=ctx.createRadialGradient(x,y,50,x,y,Math.max(W,H)*.7);glow.addColorStop(0,'#071b2100');glow.addColorStop(.5,'#09151e10');glow.addColorStop(1,'#030b195e');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(let q=0;q<22;q++){const xx=((q*173.7+G.t*5-G.cam.x*.12)%W+W)%W,yy=((q*q*91.3-G.t*9-G.cam.y*.12)%H+H)%H;ctx.globalAlpha=.18+.18*Math.sin(G.t+q);ctx.fillStyle=q%3?'#f2d19a':'#8ad9c9';ctx.beginPath();ctx.arc(xx,yy,q%3===0?1.7:1,0,TAU);ctx.fill();}
 ctx.restore();
}
function visible(x,y,m){return x>G.cam.x-m&&x<G.cam.x+W+m&&y>G.cam.y-m&&y<G.cam.y+H+m;}
function drawSpriteEx(img,x,y,size,flip,rot,sy){
if(!img.complete||!img.naturalWidth)return;
const w=size*(img.naturalWidth/img.naturalHeight),hh=size;
ctx.save();ctx.translate(x-G.cam.x,y-G.cam.y);ctx.rotate(rot||0);
ctx.scale(flip?-1:1,sy||1);
paintImage(img,-w/2,-hh/2,w,hh);ctx.restore();}
function drawSprite(img,x,y,size,flip){
if(!img.complete||!img.naturalWidth)return;
const w=size*(img.naturalWidth/img.naturalHeight),h=size;
ctx.save();ctx.translate(x-G.cam.x,y-G.cam.y);
if(flip)ctx.scale(-1,1);
paintImage(img,-w/2,-h/2,w,h);ctx.restore();}
function render(){
HOME_UI.sync();
ctx.clearRect(0,0,W,H);
if(G.mode==="title"){renderTitle();return;}
if(G.mode==="select"){renderSelect();return;}
if(G.mode==="settings"){btn.zones=[];renderSettings();return;}
if(G.mode==="shop"){ctx.fillStyle='#102026';ctx.fillRect(0,0,W,H);return;}
const h=G.hero;if(!h)return;
if(G.shake>0){ctx.save();ctx.translate((G.rng()-.5)*G.shake,(G.rng()-.5)*G.shake);}
drawBg();
/* pools */
for(const p of G.pools){if(!visible(p.x,p.y,200))continue;
 const sim=p.tack&&IMG.fx_tack&&IMG.fx_tack.naturalWidth?IMG.fx_tack:(p.foam&&IMG.fx_foam&&IMG.fx_foam.naturalWidth?IMG.fx_foam:IMG.fx_splash);
 if(sim.complete&&sim.naturalWidth){let rr=p.r,dyP=0;
  if(p.drop>0){const kD=1-p.drop/(p.drop0||.32);rr=p.r*(.5+.5*kD);dyP=-(1-kD)*52;ctx.globalAlpha=.35+.65*kD;}
  else ctx.globalAlpha=.85*Math.min(1,p.t);
  paintImage(sim,p.x-G.cam.x-rr,p.y-G.cam.y-rr*.62+dyP,rr*2,rr*1.24);ctx.globalAlpha=1;}
 else{ctx.globalAlpha=.35*Math.min(1,p.t);ctx.fillStyle="#f5f0ff";
  ctx.beginPath();ctx.ellipse(p.x-G.cam.x,p.y-G.cam.y,p.r,p.r*.6,0,0,TAU);ctx.fill();ctx.globalAlpha=1;}}
/* telegraph zones */
for(const z of G.zones){const k=z.t/z.dur,pl=.35+.3*Math.sin(G.runT*12);
 ctx.globalAlpha=pl;
 if(z.shape==="circle"){ctx.fillStyle="#ff3b3b";
  ctx.beginPath();ctx.arc(z.x-G.cam.x,z.y-G.cam.y,z.r,0,TAU);ctx.fill();
  ctx.globalAlpha=.9;ctx.strokeStyle="#ff8080";ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(z.x-G.cam.x,z.y-G.cam.y,z.r*k,0,TAU);ctx.stroke();
  if(z.hw){const im=IMG.fx_homework;
   if(im&&im.complete&&im.naturalWidth){ctx.globalAlpha=1;const s=z.r*1.05;
    paintImage(im,z.x-G.cam.x-s/2,z.y-G.cam.y-s/2-(1-k)*420,s,s);}}}
 else if(z.shape==="dash"){ctx.save();ctx.translate(z.x-G.cam.x,z.y-G.cam.y);ctx.rotate(z.a);
  ctx.fillStyle="#ff3b3b";ctx.fillRect(0,-60,z.len,120);
  ctx.globalAlpha=.9;ctx.fillStyle="#ff8080";ctx.fillRect(0,-60,z.len*k,120);ctx.restore();}
 ctx.globalAlpha=1;}
/* gems / items */
for(const g of G.gems){if(!visible(g.x,g.y,60))continue;
 const yy=g.y-G.cam.y+Math.sin(g.bob)*4,xx=g.x-G.cam.x,s=g.big?34:24;
 const im=IMG.item_gem;
 if(im.complete&&im.naturalWidth)paintImage(im,xx-s/2,yy-s/2,s,s);
 else{ctx.fillStyle="#4dff88";ctx.fillRect(xx-6,yy-6,12,12);}}
for(const it of G.items){if(!visible(it.x,it.y,80))continue;
 const yy=it.y-G.cam.y+Math.sin(it.bob)*5,xx=it.x-G.cam.x;
 if(it.type==="coin"){ctx.fillStyle="#ffd23f";ctx.beginPath();ctx.arc(xx,yy,10,0,TAU);ctx.fill();
  ctx.fillStyle="#b8860b";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText("₩",xx,yy+4);}
 else{const im=it.type==="heal"?IMG.item_heal:it.type==="mag"?IMG.item_magnet:IMG.item_chest;
  const s=it.type==="chest"?64+Math.sin(it.bob*2)*6:40;
  if(it.type==="chest"){ctx.globalAlpha=.5;ctx.fillStyle="#ffd700";ctx.beginPath();ctx.arc(xx,yy,s*.8,0,TAU);ctx.fill();ctx.globalAlpha=1;}
  if(im.complete&&im.naturalWidth)paintImage(im,xx-s/2,yy-s/2,s,s);
  else{ctx.fillStyle="#fff";ctx.fillRect(xx-10,yy-10,20,20);}}}
/* monsters */
for(const m of G.mons){if(!visible(m.x,m.y,120))continue;
 ctx.globalAlpha=.25;ctx.fillStyle="#000";
 ctx.beginPath();ctx.ellipse(m.x-G.cam.x,m.y-G.cam.y+m.size*.4,m.size*.32,m.size*.12,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
 drawSpriteEx(IMG[m.img],m.x,m.y-Math.abs(Math.sin(G.runT*7+(m.x+m.y)*.02))*3,m.size,m.x>G.hero.x,Math.sin(G.runT*7+(m.x+m.y)*.02)*.08,1);
 if(m.flash>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.55;drawSpriteEx(IMG[m.img],m.x,m.y,m.size*1.03,m.x>G.hero.x,0,1);ctx.restore();ctx.globalAlpha=1;}
 if(m.hp<m.maxHp&&m.hp>0){const x=m.x-G.cam.x,y=m.y-G.cam.y+m.size*.52;roundPanel(x-17,y,34,3,2,'#09151c');roundPanel(x-17,y,34*Math.max(0,m.hp/m.maxHp),3,2,m.ranged?'#b6a3e6':'#b4d698');}
 if(m.windup>0){ctx.save();ctx.strokeStyle='#ffd18c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(m.x-G.cam.x,m.y-G.cam.y,m.size*.55,0,TAU);ctx.stroke();ctx.globalAlpha=.6;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(m.x-G.cam.x,m.y-G.cam.y);ctx.lineTo(m.x-G.cam.x+Math.cos(m.chargeA)*175,m.y-G.cam.y+Math.sin(m.chargeA)*175);ctx.stroke();ctx.restore();}
 if(m.stunT>0){ctx.fillStyle="#ffe75d";ctx.font="16px sans-serif";ctx.textAlign="center";ctx.fillText("★",m.x-G.cam.x,m.y-G.cam.y-m.size*.6);}}
if(G.mini)drawBigMon(G.mini,"#c9b8ff");
if(G.boss)drawBigMon(G.boss,G.boss.phase===3?"#ff5d5d":"#ffd700");
/* hero */
ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle='#a1e4cf';ctx.lineWidth=2;
ctx.beginPath();ctx.ellipse(h.x-G.cam.x,h.y-G.cam.y+35,31,12,0,0,TAU);ctx.stroke();ctx.restore();
if(h.garlicR>0){const gim=IMG.fx_aura;
 if(gim&&gim.complete&&gim.naturalWidth){ctx.save();ctx.globalAlpha=.85+.1*Math.sin(G.runT*4);
  ctx.translate(h.x-G.cam.x,h.y-G.cam.y);ctx.rotate(G.runT*2.6);
  const gs=h.garlicR*2;paintImage(gim,-gs/2,-gs/2,gs,gs);ctx.restore();ctx.globalAlpha=1;}}
ctx.globalAlpha=.3;ctx.fillStyle="#000";
ctx.beginPath();ctx.ellipse(h.x-G.cam.x,h.y-G.cam.y+40,26,10,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
if(h.hurtT>0)ctx.globalAlpha=.45;
{const ph=(h.walkT||0)*9,wob=h.moving?Math.sin(ph):0;
 const hop=h.moving?Math.abs(Math.sin(ph))*5:0;
 drawSpriteEx(IMG[h.char.img],h.x,h.y-hop,96,h.facing!==(h.char.face||1),wob*.06,1-(h.moving?Math.abs(Math.cos(ph))*.03:0));
 if(h.invulnT>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.35+.25*Math.sin(G.runT*12);drawSpriteEx(IMG[h.char.img],h.x,h.y-hop,100,h.facing!==(h.char.face||1),0,1);ctx.restore();ctx.globalAlpha=1;}
 if(h.weapons&&h.weapons.shield){const simS=IMG.fx_shieldp;
  if(simS&&simS.complete&&simS.naturalWidth){const nSh=h.shieldMax||1,ch=h.shieldCh||0;
   const shh=48+(h.weapons.shield||1)*2,shw=shh*(simS.naturalWidth/simS.naturalHeight);
   for(let q=0;q<nSh;q++){const angS=(q-(nSh-1)/2)*.5;
    ctx.save();ctx.translate(h.x-G.cam.x,h.y-G.cam.y-hop*.5);
    ctx.scale(h.facing>0?1:-1,1);ctx.rotate(angS);ctx.translate(40,0);ctx.rotate(Math.PI/2);
    ctx.globalAlpha=q<ch?.95:.18;
    paintImage(simS,-shw/2,-shh/2,shw,shh);
    if(q<ch){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(simS,-shw/2,-shh/2,shw,shh);}
    ctx.restore();}
   ctx.globalAlpha=1;}}}
ctx.globalAlpha=1;
/* bags orbit */
if(h.bags){for(let i=0;i<h.bags.n;i++){const a=h.orbitA+i/h.bags.n*TAU;
 const bx=h.x+Math.cos(a)*h.bags.R-G.cam.x,by=h.y+Math.sin(a)*h.bags.R-G.cam.y;
 
 const im=IMG.fx_bagfx&&IMG.fx_bagfx.naturalWidth?IMG.fx_bagfx:IMG.icon_bag;
 if(im.complete&&im.naturalWidth){const bs=30+(h.bags.lv||1)*4.5;
  ctx.save();ctx.translate(bx,by);ctx.rotate(h.orbitA*2);paintImage(im,-bs/2,-bs/2,bs,bs);
  if((h.bags.lv||0)>=6||h.bags.ev){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(im,-bs/2,-bs/2,bs,bs);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}
  ctx.restore();}}}
if(h.weapons&&h.weapons.clock&&!(h.disabled&&h.disabled.clock)){const cim=IMG.fx_clockhand;
 if(cim&&cim.complete&&cim.naturalWidth){const lvC2=h.weapons.clock,LC2=(140+lvC2*14)*sizeMult(h);
  const wC=Math.max(12,LC2*.11);
  ctx.save();ctx.translate(h.x-G.cam.x,h.y-G.cam.y);ctx.rotate((h.clockA||0)+Math.PI/2);
  paintImage(cim,-wC/2,-LC2,wC,LC2);
  if(h.evolved.clock){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(cim,-wC/2,-LC2,wC,LC2);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}
  ctx.restore();
  if(h.evolved.clock){ctx.save();ctx.translate(h.x-G.cam.x,h.y-G.cam.y);ctx.rotate(-(h.clockA||0)*1.6+Math.PI/2);
   ctx.globalAlpha=.85;paintImage(cim,-wC*.4,-LC2*.75,wC*.8,LC2*.75);ctx.restore();ctx.globalAlpha=1;}}}
renderProjs(h);
/* particles / nums */
for(const p of G.parts){ctx.globalAlpha=Math.min(1,p.t*2);ctx.fillStyle=p.c;
 ctx.beginPath();ctx.arc(p.x-G.cam.x,p.y-G.cam.y,Math.max(.5,p.r*.6),0,TAU);ctx.fill();
ctx.globalAlpha*=.4;ctx.strokeStyle=p.c;ctx.lineWidth=Math.max(1,p.r*.3);ctx.beginPath();ctx.moveTo(p.x-G.cam.x,p.y-G.cam.y);ctx.lineTo(p.x-G.cam.x-p.vx*.025,p.y-G.cam.y-p.vy*.025);ctx.stroke();}
ctx.globalAlpha=1;
for(const n of G.nums){ctx.globalAlpha=Math.min(1,n.t*2);ctx.fillStyle=n.c;
 ctx.font="bold 16px sans-serif";ctx.textAlign="center";ctx.fillText(n.v,n.x-G.cam.x,n.y-G.cam.y);}
ctx.globalAlpha=1;
if(G.shake>0)ctx.restore();
if(G.flash){ctx.globalAlpha=Math.min(.55,G.flash.t);ctx.fillStyle=G.flash.c;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
drawAtmosphere(h);
renderHud(h);
if(G.cutT>0){
 ctx.fillStyle="rgba(10,8,30,.78)";ctx.fillRect(0,H*.30,W,H*.40);
 ctx.strokeStyle="#ffd700";ctx.lineWidth=4;ctx.strokeRect(-4,H*.30,W+8,H*.40);
 const cim=IMG[h.char.img];
 const kIn=Math.min(1,(1.15-G.cutT)/.18);
 if(cim.complete&&cim.naturalWidth){const ph2=Math.min(H*.34,W*.25),pw=ph2*(cim.naturalWidth/cim.naturalHeight);
  ctx.globalAlpha=kIn;paintImage(cim,W*.16-pw/2-(1-kIn)*120,H*.33,pw,ph2);ctx.globalAlpha=1;}
 ctx.textAlign="left";ctx.fillStyle="#ffd700";ctx.font="bold "+Math.min(28,W*.045)+"px sans-serif";
 ctx.fillText(STR.chars[h.char.id].name,W*.30,H*.42,W*.65);
 ctx.fillStyle="#fff";ctx.font="bold "+Math.min(36,W*.046)+"px sans-serif";
 ctx.fillText(STR.ultLines[h.char.id]||"",W*.30,H*.51,W*.65);
 ctx.fillStyle="#c9a5ff";ctx.font="bold "+Math.min(22,W*.04)+"px sans-serif";
 ctx.fillText(STR.ultNames[h.char.id],W*.30,H*.585,W*.65);}
if(G.mode==="levelup")renderLevelUp();
if(G.mode==="chest")renderChest();
if(G.mode==="pause")renderPause();
if(G.mode==="over"||G.mode==="win")renderEnd();
}
function drawBigMon(m,auraC){
if(!visible(m.x,m.y,300))return;
if(m.type==='boss'){
 ctx.save();const x=m.x-G.cam.x,y=m.y-G.cam.y;ctx.translate(x,y);
 const aura=ctx.createRadialGradient(0,30,10,0,30,m.size*.8);aura.addColorStop(0,'#70f2d93b');aura.addColorStop(1,'#70f2d900');ctx.fillStyle=aura;ctx.fillRect(-m.size,-m.size,m.size*2,m.size*2);
 ctx.strokeStyle=m.phase===3?'#ff9d7d99':'#93ebd199';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,m.size*.4,m.size*.62,m.size*.18,0,0,TAU);ctx.stroke();ctx.restore();
}
ctx.globalAlpha=.25;ctx.fillStyle="#000";
ctx.beginPath();ctx.ellipse(m.x-G.cam.x,m.y-G.cam.y+m.size*.4,m.size*.34,m.size*.13,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
drawSpriteEx(IMG[m.img],m.x,m.y-Math.abs(Math.sin(G.runT*7+(m.x+m.y)*.02))*3,m.size,m.x>G.hero.x,Math.sin(G.runT*7+(m.x+m.y)*.02)*.08,1);
if(m.flash>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.55;drawSpriteEx(IMG[m.img],m.x,m.y,m.size*1.03,m.x>G.hero.x,0,1);ctx.restore();ctx.globalAlpha=1;}
if(m.type==='boss'){
 ctx.save();const x=m.x-G.cam.x,y=m.y-G.cam.y+m.size*.25;
 const g=ctx.createLinearGradient(x,y-30,x,y+30);g.addColorStop(0,'#aebbd0');g.addColorStop(.45,'#5e6a98');g.addColorStop(1,'#2b3858');
 ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,m.size*.66,m.size*.18,0,0,TAU);ctx.fill();ctx.strokeStyle='#c8e3e277';ctx.lineWidth=2;ctx.stroke();
 for(let q=0;q<5;q++){ctx.fillStyle=m.phase===3?'#ffc16b':'#9be9d5';ctx.beginPath();ctx.ellipse(x+(q-2)*m.size*.23,y+m.size*.04+Math.cos((q-2)*.5)*9,6,4,0,0,TAU);ctx.fill();}
 ctx.restore();
}else{ctx.fillStyle='#edd49e';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('♛',m.x-G.cam.x,m.y-G.cam.y-m.size*.52);}
const bw=m.size,bx=m.x-G.cam.x-bw/2,by=m.y-G.cam.y-m.size*.62;
ctx.fillStyle="#222";ctx.fillRect(bx,by,bw,8);
ctx.fillStyle=m.type==="boss"?"#ff4d4d":"#c9b8ff";ctx.fillRect(bx,by,bw*Math.max(0,m.hp/m.maxHp),8);}

function renderProjs(h){
for(const p of G.projs){
if(p.delay>0&&p.kind!=="slam")continue;
if(p.kind==="swing"){
 const k=1-p.t/.26,ang=p.a-1.05+k*2.1;
 ctx.save();ctx.translate(h.x-G.cam.x,h.y-G.cam.y);ctx.rotate(ang);
 const slm=IMG.fx_swoosh&&IMG.fx_swoosh.naturalWidth?IMG.fx_swoosh:IMG.fx_slash;
 if(slm.complete&&slm.naturalWidth){const ss=p.r*.95;
  ctx.globalAlpha=.4*Math.min(1,p.t*6);
  paintImage(slm,p.r*.62-ss/2,-ss/2,ss,ss);ctx.globalAlpha=1;}
 const hm=IMG.fx_hammer;
 if(hm&&hm.complete&&hm.naturalWidth){ctx.rotate(Math.PI/2);
  const len=p.r*.98,w2=len*(hm.naturalWidth/hm.naturalHeight);
  paintImage(hm,-w2/2,-len,w2,len);
  if((p.lv||0)>=6){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.28+.1*Math.sin(G.runT*10);paintImage(hm,-w2/2,-len,w2,len);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 ctx.restore();}
else if(p.kind==="ring"){if(!visible(p.x,p.y,p.r+60))continue;
 const wim=(p.fxImg&&IMG[p.fxImg]&&IMG[p.fxImg].naturalWidth)?IMG[p.fxImg]:(p.nagFx&&IMG.fx_nagring&&IMG.fx_nagring.naturalWidth?IMG.fx_nagring:IMG.fx_wave);
 if(wim.complete&&wim.naturalWidth){ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);
  if(p.enemy&&!p.nagFx&&!p.fxImg)ctx.filter="hue-rotate(150deg) saturate(1.5)";
  ctx.globalAlpha=Math.max(.3,1-p.r/((p.maxR||600)*1.15));ctx.rotate((p.r*.003)%TAU);
  const s=p.r*2.05;paintImage(wim,-s/2,-s/2,s,s);
  if(!p.enemy&&(p.maxR||0)>=330){ctx.globalAlpha=.35;ctx.rotate(.5);const s3=s*.72;paintImage(wim,-s3/2,-s3/2,s3,s3);}
  ctx.restore();ctx.globalAlpha=1;}
 else{ctx.globalAlpha=.8;ctx.strokeStyle=p.col;ctx.lineWidth=8;
  ctx.beginPath();ctx.arc(p.x-G.cam.x,p.y-G.cam.y,p.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
else if(p.kind==="boom"){if(!visible(p.x,p.y,100))continue;
 ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);ctx.rotate(p.rot);
 const im=p.bagFx&&IMG.fx_bagfx&&IMG.fx_bagfx.naturalWidth?IMG.fx_bagfx:(IMG.fx_note&&IMG.fx_note.naturalWidth?IMG.fx_note:IMG.icon_boomerang);
 if(im.complete&&im.naturalWidth){const s2=p.sz*1.35;paintImage(im,-s2/2,-s2/2,s2,s2);
  if(p.sz>=50){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(im,-s2/2,-s2/2,s2,s2);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 ctx.restore();}
else if(p.kind==="bomb"){if(!visible(p.x,p.y,80))continue;
 ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);ctx.rotate(G.runT*7%TAU);
 const im=IMG.icon_milk;
 if(im.complete&&im.naturalWidth){const bs2=26+p.rad*.14;paintImage(im,-bs2/2,-bs2/2,bs2,bs2);
  if(p.rad>=170||p.ev){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(im,-bs2/2,-bs2/2,bs2,bs2);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 ctx.restore();}
else if(p.kind==="chalk"){if(!visible(p.x,p.y,60))continue;
 ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);ctx.rotate(Math.atan2(p.vy,p.vx));
 const im=IMG.fx_chalkp;
 if(im&&im.complete&&im.naturalWidth){const s2=38+(p.lv||1)*5;paintImage(im,-s2*.62,-s2/2,s2,s2);
  if((p.lv||0)>=6||p.ev){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=p.ev?.55:.35;paintImage(im,-s2*.62,-s2/2,s2,s2);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 else{ctx.fillStyle=p.col;ctx.fillRect(-14,-4,28,8);}
 ctx.restore();ctx.globalAlpha=1;}
else if(p.kind==="rul"){
 const k=1-p.t/.22,ext=Math.sin(Math.min(1,k)*Math.PI);
 ctx.save();ctx.translate(h.x-G.cam.x,h.y-G.cam.y);ctx.rotate(p.a);
 const rmI=IMG.fx_ruler;
 if(rmI&&rmI.complete&&rmI.naturalWidth){ctx.rotate(Math.PI/2);
  const lenD=p.r*.3+ext*(p.r*.7),w2=Math.max(14,lenD*.13);
  const tipY=-lenD;
  paintImage(rmI,-w2/2,tipY,w2,lenD);
  if(ext>.6){ctx.globalAlpha=.45*ext;ctx.strokeStyle=p.col;ctx.lineWidth=5;
   ctx.beginPath();ctx.moveTo(-10,tipY+18);ctx.lineTo(0,tipY-14);ctx.lineTo(10,tipY+18);ctx.stroke();ctx.globalAlpha=1;}
  if((p.lv||0)>=6){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.3;paintImage(rmI,-w2/2,tipY,w2,lenD);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 ctx.restore();}
else if(p.kind==="ddak"){if(!visible(p.x,p.y,60))continue;
 ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);ctx.rotate(p.rot||0);
 const imD=IMG.fx_ddakji,ds=26+(p.lv||1)*3.2;
 if(imD&&imD.complete&&imD.naturalWidth){paintImage(imD,-ds/2,-ds/2,ds,ds);
  if(p.ev||(p.lv||0)>=6){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.35;paintImage(imD,-ds/2,-ds/2,ds,ds);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}}
 else{ctx.fillStyle="#4f8ef5";ctx.fillRect(-ds/2,-ds/2,ds,ds);}
 ctx.restore();}
else if(p.kind==="slam"){if(!visible(p.x,p.y,p.r+140))continue;
 const fall=p.fall||.28;
 if(p.delay>0){ctx.globalAlpha=.22;ctx.fillStyle="#000";
  ctx.beginPath();ctx.ellipse(p.x-G.cam.x,p.y-G.cam.y,p.r*.5,p.r*.2,0,0,TAU);ctx.fill();ctx.globalAlpha=1;continue;}
 const k=Math.min(1,(p.t||0)/fall);
 if(!p.boomed){
  ctx.globalAlpha=.22+k*.2;ctx.fillStyle="#000";
  ctx.beginPath();ctx.ellipse(p.x-G.cam.x,p.y-G.cam.y,p.r*(.3+k*.35),p.r*(.12+k*.14),0,0,TAU);ctx.fill();ctx.globalAlpha=1;
  const im=IMG[p.hImg?"fx_hammer":(p.img||"fx_hammer")];
  if(im&&im.complete&&im.naturalWidth){
   const s=p.giant?p.r*1.7:(p.hImg?p.r*1.25:(p.bImg?p.r*1.3:96));
   const w2=s*(im.naturalWidth/im.naturalHeight);
   ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y-(1-k)*(p.giant?820:340));
   ctx.rotate(Math.PI+Math.sin(k*9)*.06);
   paintImage(im,-w2/2,-s*.05,w2,s);
   if(p.evB||p.giant){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.35;paintImage(im,-w2/2,-s*.05,w2,s);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}
   ctx.restore();}}
}}
for(const p of G.eprojs){if(!visible(p.x,p.y,60))continue;
 ctx.save();ctx.translate(p.x-G.cam.x,p.y-G.cam.y);ctx.rotate((p.rot||0)*2+Math.atan2(p.vy,p.vx));
 const im=IMG.fx_eproj;
 if(im&&im.complete&&im.naturalWidth){ctx.globalAlpha=.5+.3*Math.sin(G.runT*14);ctx.strokeStyle="#ff5d5d";ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,0,27,0,TAU);ctx.stroke();ctx.globalAlpha=1;
  paintImage(im,-29,-29,58,58);
  ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.35;paintImage(im,-29,-29,58,58);ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;}
 else{ctx.fillStyle="#f0ead6";ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-12,-9);ctx.lineTo(-6,0);ctx.lineTo(-12,9);ctx.closePath();ctx.fill();}
 ctx.restore();}
for(const f of G.fx){
 if(f.kind==="img"){const iim=IMG[f.img],k2=1-f.t/(f.dur||.4);
  if(iim&&iim.complete&&iim.naturalWidth){ctx.globalAlpha=Math.max(0,1-k2*k2);
   const s2=f.r*(0.7+k2*.8);paintImage(iim,f.x-G.cam.x-s2/2,f.y-G.cam.y-s2/2,s2,s2);ctx.globalAlpha=1;}}
 else if(f.kind==="boom"){const bim=(f.img&&IMG[f.img]&&IMG[f.img].naturalWidth)?IMG[f.img]:IMG.fx_boom,k=1-f.t/.35;
  if(bim.complete&&bim.naturalWidth){ctx.save();ctx.translate(f.x-G.cam.x,f.y-G.cam.y);
   ctx.globalAlpha=Math.min(1,f.t*4);ctx.rotate((f.x+f.y)%6.28);
   const s=f.r*(1.1+k*1.1);paintImage(bim,-s/2,-s/2,s,s);ctx.restore();ctx.globalAlpha=1;}}
 else if(f.kind==="warn"){ctx.globalAlpha=.5;ctx.strokeStyle=f.c;ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(f.x-G.cam.x,f.y-G.cam.y,f.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
}
/* ===== HUD ===== */
function renderHud(h){
const compact=W<600,bw=Math.min(260,W*.37),tc=compact?W*.62:W/2;
roundPanel(12,12,bw+22,86,14,'#10232de8','#d4c39422');
ctx.textAlign='left';ctx.fillStyle='#dae6da';ctx.font='bold 12px sans-serif';ctx.fillText(STR.chars[h.char.id].name,23,32,bw);
roundPanel(23,43,bw,8,4,'#07161f');
const hp=clamp(h.hp/heroMaxHp(h),0,1);if(hp>0)roundPanel(23,43,bw*hp,8,4,hp<.25?'#f1a68b':'#9dcdb4');
roundPanel(23,57,bw,4,2,'#07161f');const xp=clamp(h.xp/h.xpNext,0,1);if(xp>0)roundPanel(23,57,bw*xp,4,2,'#b8a3dd');
ctx.font='10px sans-serif';ctx.fillStyle='#95b2ac';ctx.fillText('Lv.'+h.lv+'   처치 '+G.kills,23,82);ctx.textAlign='right';ctx.fillStyle='#e9cb96';ctx.fillText('● '+G.coins,23+bw,82);
const t=Math.floor(G.runT);ctx.textAlign='center';ctx.fillStyle='#f0e3c8';ctx.font='bold '+(compact?21:27)+'px sans-serif';
ctx.fillText(String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'),tc,40);
ctx.font='10px sans-serif';ctx.fillStyle='#b6c9be';ctx.fillText('AREA 0'+(G.stage+1)+' · '+STR.themes[G.stage],tc,60);
const st=STAGES[G.stage];let goal='';
if(G.stage<4)goal=G.mini?STR.goalKill:(G.miniSpawned?'':STR.goalWait(Math.max(0,Math.ceil(st.miniAt-G.stageT))));
else goal=G.boss?STR.goalBoss:STR.goalWait(Math.max(0,Math.ceil(st.bossAt-G.stageT)));
ctx.fillStyle='#b9c4b4';ctx.font='10px sans-serif';ctx.fillText(goal,tc,79,compact?W*.29:380);
/* weapons icons + lv colors */
let ix=16,iy=H-56;
G.wIcons=[];
for(const w in h.weapons){const lv=h.weapons[w],ev=h.evolved[w],off=h.disabled&&h.disabled[w];
 G.wIcons.push({x:ix-3,y:iy-3,id:w});
 ctx.globalAlpha=off?.28:.9;
 ctx.fillStyle=ev?"#ffd700":wcol(w,lv);
 ctx.fillRect(ix-3,iy-3,46,46);ctx.globalAlpha=off?.35:1;
 const im=IMG["icon_"+w];if(im&&im.complete&&im.naturalWidth)paintImage(im,ix,iy,40,40);
 ctx.globalAlpha=1;
 ctx.fillStyle=off?"#888":"#fff";ctx.font="bold 12px sans-serif";ctx.textAlign="center";
 ctx.fillText(off?"OFF":(ev?"EV":lv),ix+20,iy+54);ix+=56;}
for(const p in h.passives){const im=IMG["icon_"+p];
 if(im&&im.complete&&im.naturalWidth)paintImage(im,ix,iy+4,32,32);
 ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";
 ctx.fillText(h.passives[p],ix+16,iy+50);ix+=42;}
/* ult button */
const ux=W-86,uy=H-96,ur=52;
const pct=Math.min(1,(h.ultG||0)/100),rdy=pct>=1;
ctx.globalAlpha=.85;
ctx.fillStyle=rdy?"#7b3ff2":"#333a4d";
ctx.beginPath();ctx.arc(ux,uy,ur,0,TAU);ctx.fill();ctx.globalAlpha=1;
if(!rdy&&pct>0){ctx.fillStyle="rgba(123,63,242,.45)";
 ctx.beginPath();ctx.moveTo(ux,uy);
 ctx.arc(ux,uy,ur,-Math.PI/2,-Math.PI/2+TAU*pct);ctx.closePath();ctx.fill();}
ctx.strokeStyle=rdy?"#ffd700":"#222";ctx.lineWidth=4;
ctx.beginPath();ctx.arc(ux,uy,ur,0,TAU);ctx.stroke();
ctx.fillStyle="#fff";ctx.font="bold 30px sans-serif";ctx.textAlign="center";ctx.fillText("⚡",ux,uy+10);
ctx.font="bold 11px sans-serif";
ctx.fillText(rdy?(TOUCH?STR.ultTap:'SPACE'):Math.floor(pct*100)+'%',ux,uy+ur+16);
ctx.fillStyle='#ecd8b4';ctx.font='bold 10px sans-serif';ctx.fillText(STR.ultNames[h.char.id].replace('특수능력: ',''),ux,uy-ur-14,145);
if(rdy){ctx.globalAlpha=.4+.3*Math.sin(G.runT*8);ctx.strokeStyle="#ffd700";ctx.lineWidth=7;
 ctx.beginPath();ctx.arc(ux,uy,ur+8,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
/* pause btn */
ctx.globalAlpha=.6;ctx.fillStyle="#26304a";ctx.beginPath();ctx.arc(W-56,64,26,0,TAU);ctx.fill();ctx.globalAlpha=1;
ctx.fillStyle="#fff";ctx.font="bold 16px sans-serif";ctx.fillText("II",W-56,70);
/* joystick */
if(TOUCH&&joy.on){ctx.globalAlpha=.25;ctx.fillStyle="#fff";
 ctx.beginPath();ctx.arc(joy.ax,joy.ay,60,0,TAU);ctx.fill();
 ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(joy.ax+joy.dx,joy.ay+joy.dy,28,0,TAU);ctx.fill();ctx.globalAlpha=1;}
/* banner */
if(G.banner){ctx.globalAlpha=Math.min(1,G.banner.t);
 ctx.fillStyle="#ffd700";ctx.font="bold 30px sans-serif";ctx.textAlign="center";
 ctx.fillText(G.banner.txt,W/2,H*.3);ctx.globalAlpha=1;}
/* boss hp big bar */
if(G.boss){ctx.fillStyle="rgba(0,0,0,.6)";ctx.fillRect(W*.2,H-28,W*.6,14);
 ctx.fillStyle="#ff4d4d";ctx.fillRect(W*.2,H-28,W*.6*Math.max(0,G.boss.hp/G.boss.maxHp),14);
 ctx.fillStyle="#fff";ctx.font="bold 12px sans-serif";ctx.textAlign="center";
 ctx.fillText(STR.bossName,W/2,H-32);}
}

/* ===== menus ===== */
function panel(x,y,w,hh){roundPanel(x,y,w,hh,18,'#12262ef2','#e8ca8d44');}
function renderTitle(){ctx.fillStyle='#0d1d23';ctx.fillRect(0,0,W,H);}
function selectLayout(){
 const cols=W<600?3:W<1000?5:7,rows=Math.ceil(CHARACTERS.length/cols),gap=8;
 const top=88,bottom=H-124, cw=Math.min(146,(W-24-gap*(cols-1))/cols);
 const ch=Math.max(35,Math.min(168,(bottom-top-gap*(rows-1))/rows));
 return {cols,cw,ch,gap,x0:(W-(cols*cw+(cols-1)*gap))/2,y0:top};
}
function renderSelect(){ctx.fillStyle='#0d1d23';ctx.fillRect(0,0,W,H);}
function renderSettings(){
ctx.fillStyle="#0d1020";ctx.fillRect(0,0,W,H);
ctx.fillStyle="#fff";ctx.font="bold 30px sans-serif";ctx.textAlign="center";ctx.fillText(STR.settingsTitle,W/2,80);
const opts=[["bgm",STR.setBgm],["sfx",STR.setSfx],["dmg",STR.setDmg],["shake",STR.setShake]];
const rw=Math.min(480,W-60),x0=W/2-rw/2;
for(let i=0;i<opts.length;i++){const y=140+i*74;
 ctx.fillStyle="#181f38";ctx.fillRect(x0,y,rw,58);
 ctx.strokeStyle="#3a4a7a";ctx.lineWidth=2;ctx.strokeRect(x0,y,rw,58);
 ctx.fillStyle="#fff";ctx.font="bold 19px sans-serif";ctx.textAlign="left";
 ctx.fillText(opts[i][1],x0+22,y+36);
 const on=setOpt(opts[i][0]);
 ctx.fillStyle=on?"#2a6a4f":"#6a2a2a";ctx.fillRect(x0+rw-110,y+10,92,38);
 ctx.strokeStyle="#fff";ctx.strokeRect(x0+rw-110,y+10,92,38);
 ctx.fillStyle="#fff";ctx.font="bold 16px sans-serif";ctx.textAlign="center";
 ctx.fillText(on?STR.optOn:STR.optOff,x0+rw-64,y+35);}
btn(W/2-90,140+opts.length*74+20,180,52,STR.back,"#4a4a6a");}
function btn(x,y,w,hh,txt,c){
const g=ctx.createLinearGradient(x,y,x,y+hh);g.addColorStop(0,c);g.addColorStop(1,'#1a2a35');
roundPanel(x,y,w,hh,12,g,'#dcc48d88');
ctx.fillStyle='#f8efdd';ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.fillText(txt,x+w/2,y+hh/2+5,w-16);
(btn.zones=btn.zones||[]).push({x,y,w,h:hh,txt});
}
function renderLevelUp(){
ctx.fillStyle="rgba(5,8,18,.75)";ctx.fillRect(0,0,W,H);
ctx.fillStyle="#ffd700";ctx.font="bold 28px sans-serif";ctx.textAlign="center";
ctx.fillText(STR.levelUp,W/2,H*.2);
const n=G.choices.length,cw=Math.min(240,(W-60)/n-14),chh=Math.min(300,H*.45);
const x0=W/2-(n*(cw+14))/2;
for(let i=0;i<n;i++){const c=G.choices[i],x=x0+i*(cw+14),y=H*.28;
 c._x=x;c._y=y;c._w=cw;c._h=chh;
 ctx.fillStyle="#1c2848";ctx.fillRect(x,y,cw,chh);
 ctx.strokeStyle="#ffd700";ctx.lineWidth=2;ctx.strokeRect(x,y,cw,chh);
 let icon,name,desc,tag;
 if(c.k==="w"){icon="icon_"+c.id;name=STR.weapons[c.id].name+" Lv"+c.lv;desc=STR.weapons[c.id].desc;tag=STR.upgrade;}
 else if(c.k==="nw"){icon="icon_"+c.id;name=STR.weapons[c.id].name;desc=STR.weapons[c.id].desc;tag=STR.newWeapon;}
 else if(c.k==="p"){icon="icon_"+c.id;name=STR.passives[c.id].name+" Lv"+c.lv;desc=STR.passives[c.id].desc;tag=STR.upgrade;}
 else if(c.k==="np"){icon="icon_"+c.id;name=STR.passives[c.id].name;desc=STR.passives[c.id].desc;tag=STR.newPassive;}
 else{icon="item_heal";name=STR.heal;desc=STR.healDesc;tag="";}
 ctx.fillStyle="#8fd4ff";ctx.font="bold 12px sans-serif";ctx.fillText(tag,x+cw/2,y+24);
 const im=IMG[icon];if(im&&im.complete&&im.naturalWidth)paintImage(im,x+cw/2-36,y+38,72,72);
 if(c.k==="w"||c.k==="nw"){ctx.fillStyle=wcol(c.id,c.lv||1);ctx.fillRect(x+cw/2-36,y+116,72,6);}
 ctx.fillStyle="#fff";ctx.font="bold 16px sans-serif";ctx.fillText(name,x+cw/2,y+146);
 ctx.fillStyle="#9fb3d8";ctx.font="12px sans-serif";
 wrapText(desc,x+cw/2,y+170,cw-24,16);
 if((c.k==="w"||c.k==="nw")&&STR.evolveHint[c.id]){ctx.fillStyle="#ffd77a";ctx.font="11px sans-serif";
  wrapText(STR.evolveHint[c.id],x+cw/2,y+chh-40,cw-20,14);}
 ctx.fillStyle="#66739a";ctx.font="bold 14px sans-serif";ctx.fillText(""+(i+1),x+cw/2,y+chh-12);}}
function wrapText(txt,cx,y,maxW,lh){
const words=(txt||"").split(" ");let line="",yy=y;
for(const wd of words){const t=line?line+" "+wd:wd;
 if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,cx,yy);line=wd;yy+=lh;}
 else line=t;}
if(line)ctx.fillText(line,cx,yy);}
function renderChest(){
ctx.fillStyle="rgba(5,8,18,.7)";ctx.fillRect(0,0,W,H);
const cs=G.chestShow;if(!cs)return;
const k=Math.min(1,(2.2-cs.t)*2);
ctx.fillStyle="#ffd700";ctx.font="bold 32px sans-serif";ctx.textAlign="center";
ctx.fillText(STR.chestGet,W/2,H*.3);
const im=IMG[cs.reward.icon];
if(im&&im.complete&&im.naturalWidth){const s=100+Math.sin(G.t*6)*8;
 paintImage(im,W/2-s/2,H*.38,s,s);}
ctx.globalAlpha=k;ctx.fillStyle="#fff";ctx.font="bold 22px sans-serif";
ctx.fillText(cs.reward.txt,W/2,H*.62);ctx.globalAlpha=1;
for(let i=0;i<10;i++){const a=G.t*2+i/10*TAU;
 ctx.globalAlpha=.5;ctx.fillStyle="#ffd700";
 ctx.fillRect(W/2+Math.cos(a)*130-3,H*.45+Math.sin(a)*80-3,6,6);ctx.globalAlpha=1;}}
function renderPause(){
ctx.fillStyle="rgba(5,8,18,.8)";ctx.fillRect(0,0,W,H);
ctx.fillStyle="#fff";ctx.font="bold 32px sans-serif";ctx.textAlign="center";
ctx.fillText(STR.paused,W/2,H*.32);
btn(W/2-100,H*.42,200,52,STR.resume,"#7b3ff2");
btn(W/2-100,H*.42+70,200,52,STR.quit,"#8a3a3a");}
function renderEnd(){
ctx.fillStyle="rgba(5,8,18,.85)";ctx.fillRect(0,0,W,H);
const win=G.mode==="win";
ctx.fillStyle=win?"#ffd700":"#ff6a6a";ctx.font="bold 44px sans-serif";ctx.textAlign="center";
ctx.fillText(win?STR.win:STR.over,W/2,H*.34);
ctx.fillStyle="#cfd8ef";ctx.font="17px sans-serif";
if(win)ctx.fillText(STR.winSub,W/2,H*.42);
const t=Math.floor(G.runT);
ctx.fillText(STR.stats(String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0"),G.hero.lv,G.kills),W/2,H*.5);
ctx.fillStyle="#ffd23f";ctx.font="bold 19px sans-serif";
ctx.fillText(STR.coinGain(Math.round(G.coins*(1+.2*shopLv("coin")))),W/2,H*.57);
ctx.fillStyle="#8fd4ff";ctx.font="bold 18px sans-serif";
ctx.globalAlpha=.6+.4*Math.sin(G.t*4);ctx.fillText(STR.retry,W/2,H*.68);ctx.globalAlpha=1;}

/* ===== ui taps ===== */
function uiTap(x,y){
if(G.mode==="play"){uiTouch(x,y);return;}
if(G.mode==="title"){G.mode="select";return;}
if(G.mode==="select"){
 const zones=btn.zones||[];
 for(const z of zones){if(x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h){
  if(z.txt===STR.startRun){startRun(G.charIdx);return;}
  if(z.txt===STR.shopBtn){G.mode="shop";return;}
  if(z.txt===STR.settingsBtn){G.mode="settings";return;}}}
 const {cols,cw,ch,gap,x0,y0}=selectLayout();
 for(let i=0;i<CHARACTERS.length;i++){const cx=x0+(i%cols)*(cw+gap),cy=y0+Math.floor(i/cols)*(ch+gap);
 if(x>=cx&&x<=cx+cw&&y>=cy&&y<=cy+ch){G.charIdx=i;return;}}
 return;}
if(G.mode==="settings"){
 const opts=["bgm","sfx","dmg","shake"];
 const rw=Math.min(480,W-60),x0=W/2-rw/2;
 for(let i=0;i<opts.length;i++){const y2=140+i*74;
  if(x>=x0&&x<=x0+rw&&y>=y2&&y<=y2+58){
   toggleOpt(opts[i]);
   if(opts[i]==="bgm"){if(!setOpt("bgm")){if(bgmEl)bgmEl.pause();bgmName=null;}else{playBgm("bgm_dungeon");}}
   sfx("pop");return;}}
 const zones=btn.zones||[];
 for(const z of zones)if(x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h&&z.txt===STR.back){G.mode="select";return;}
 return;}
if(G.mode==="shop")return;
if(G.mode==="levelup"){
 for(const c of G.choices)if(c._x!==undefined&&x>=c._x&&x<=c._x+c._w&&y>=c._y&&y<=c._y+c._h){applyChoice(c);return;}
 return;}
if(G.mode==="pause"){
 const zones=btn.zones||[];
 for(const z of zones){if(x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h){
  if(z.txt===STR.resume){G.mode="play";return;}
  if(z.txt===STR.quit){bankCoins();G.mode="select";playBgm("bgm_dungeon");return;}}}
 return;}
if(G.mode==="over"||G.mode==="win"){G.mode="select";playBgm("bgm_dungeon");return;}
if(G.mode==="play"&&!TOUCH){/* desktop click = nothing */}
}
canvas.addEventListener("mousedown",e=>{ensureAudio();uiTap(e.clientX,e.clientY);});
addEventListener("keydown",e=>{
if(e.target?.closest?.("button,dialog,a,input,select,textarea"))return;
if(e.code==="Escape"){
 if(G.mode==="play")G.mode="pause";
 else if(G.mode==="pause")G.mode="play";
 else if(G.mode==="shop")G.mode=shopReturnMode;
 else if(G.mode==="settings")G.mode="select";
 return;}
if(e.code==="Space"||e.code==="Enter"){
 if(G.mode==="title")G.mode="select";
 else if(G.mode==="select")startRun(G.charIdx);
 else if(G.mode==="over"||G.mode==="win"){G.mode="select";playBgm("bgm_dungeon");}}
if(G.mode==="select"){
 if(e.code==="ArrowLeft"||e.code==="KeyA")G.charIdx=(G.charIdx+CHARACTERS.length-1)%CHARACTERS.length;
 if(e.code==="ArrowRight"||e.code==="KeyD")G.charIdx=(G.charIdx+1)%CHARACTERS.length;}
if(G.mode==="levelup"){
 const i={Digit1:0,Digit2:1,Digit3:2}[e.code];
 if(i!==undefined&&G.choices[i])applyChoice(G.choices[i]);}
});
/* ===== loop ===== */
const STEP=1/60;
let acc=0,last=performance.now();
addEventListener("blur",()=>{if(G.mode==="play")G.mode="pause";});
function frame(now){
requestAnimationFrame(frame);
let dt=(now-last)/1000;last=now;
if(dt>.25)dt=.25;
G.t+=dt;
btn.zones=[];
if(G.mode==="play"){acc+=dt;
 let steps=0;
 while(acc>=STEP&&steps<4){updatePlay(STEP);pressed.clear();acc-=STEP;steps++;}
 if(steps===4)acc=0;}
else if(G.mode==="chest"){
 G.chestShow.t-=dt;
 if(G.chestShow.t<=0){G.chestShow=null;G.mode="play";
  if(G.pendingAdvance){G.pendingAdvance=false;advanceStage();}}
 pressed.clear();}
else pressed.clear();
padCommands();
render();
}
requestAnimationFrame(frame);

/* ===== input ===== */
const BIND={KeyW:"up",KeyS:"down",KeyA:"left",KeyD:"right",ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Space:"ult"};
const PAD={0:"ult",12:"up",13:"down",14:"left",15:"right"};
const held=new Set(),pressed=new Set();
addEventListener("keydown",e=>{
if(e.target?.closest?.("button,dialog,a,input,select,textarea"))return;const c=BIND[e.code];
if(c){if(!held.has(c))pressed.add(c);held.add(c);e.preventDefault();ensureAudio();}});
addEventListener("keyup",e=>{const c=BIND[e.code];if(c)held.delete(c);});
let padPrev=new Set();
function padCommands(){const out=new Set();
for(const gp of navigator.getGamepads?.()??[])if(gp){
 gp.buttons.forEach((b,i)=>{if(b.pressed&&PAD[i]!==undefined)out.add(PAD[i]);});
 if(gp.axes.length>1){if(Math.abs(gp.axes[0])>.4)out.add(gp.axes[0]<0?"left":"right");
  if(Math.abs(gp.axes[1])>.4)out.add(gp.axes[1]<0?"up":"down");}}
for(const c of out){if(!padPrev.has(c))pressed.add(c);if(c==="up"||c==="down"||c==="left"||c==="right")held.add(c);}
for(const c of ["up","down","left","right"])if(padPrev.has(c)&&!out.has(c))held.delete(c);
padPrev=out;return out;}
/* touch: dynamic joystick (left) + buttons (right) */
const joy={on:false,id:-1,ax:0,ay:0,dx:0,dy:0};
function uiTouch(x,y){
if(G.mode!=="play")return false;
if(d2(x,y,W-86,H-96)<64*64){pressed.add("ult");return true;}
for(const ic of (G.wIcons||[])){if(x>=ic.x&&x<=ic.x+46&&y>=ic.y-4&&y<=ic.y+62){const hh=G.hero;hh.disabled=hh.disabled||{};hh.disabled[ic.id]=!hh.disabled[ic.id];return true;}}
if(d2(x,y,W-56,64)<40*40){G.mode="pause";return true;}
return false;}
canvas.addEventListener("touchstart",e=>{ensureAudio();
for(const t of e.changedTouches){const x=t.clientX,y=t.clientY;
 if(uiTouch(x,y))continue;
 if(G.mode!=="play"){uiTap(x,y);continue;}
 if(x<W*.6&&!joy.on){joy.on=true;joy.id=t.identifier;joy.ax=x;joy.ay=y;joy.dx=0;joy.dy=0;}}
e.preventDefault();},{passive:false});
canvas.addEventListener("touchmove",e=>{
for(const t of e.changedTouches)if(joy.on&&t.identifier===joy.id){
 joy.dx=t.clientX-joy.ax;joy.dy=t.clientY-joy.ay;
 const m=Math.hypot(joy.dx,joy.dy);if(m>60){joy.dx*=60/m;joy.dy*=60/m;}}
e.preventDefault();},{passive:false});
canvas.addEventListener("touchend",e=>{
for(const t of e.changedTouches)if(joy.on&&t.identifier===joy.id){joy.on=false;joy.dx=joy.dy=0;}
e.preventDefault();},{passive:false});
canvas.addEventListener("touchcancel",e=>{joy.on=false;joy.dx=joy.dy=0;},{passive:false});

const HOME_UI=createInterface({characters:CHARACTERS,strings:STR,monsters:MONSTERS,upgrades:SHOP,purchase:purchaseUpgrade,closeShop:()=>G.mode=shopReturnMode,
 getState:()=>({mode:G.mode,index:G.charIdx,coins:META.coins,shopLevels:META.shop,shopRevision,runEarned:G.bankGain||0,kills:G.kills,runTime:Math.floor(G.runT),heroIndex:G.hero?CHARACTERS.indexOf(G.hero.char):G.charIdx,assetsLoaded:Object.values(ART).filter(im=>im.complete&&im.naturalWidth).length,assetsTotal:Object.keys(ART).length}),
 select:i=>{G.charIdx=i;G.mode='select';},start:()=>{ensureAudio();startRun(G.charIdx);},goTitle:()=>G.mode='title',
 pause:()=>{if(G.mode==='play')G.mode='pause';},resume:()=>{if(G.mode==='pause')G.mode='play';},shop:()=>{if(G.mode!=='shop')shopReturnMode=G.mode;G.mode='shop';},settings:()=>G.mode='settings'});
HOME_UI.sync();
