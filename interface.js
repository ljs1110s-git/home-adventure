export const ABILITIES = [
 {role:'돌격형 · 추천',color:'#edb45f',basic:'가까운 적을 향해 쿠션 망치를 자동으로 휘두릅니다. 짧은 사거리 대신 한 방이 강합니다.',special:'거대한 쿠션을 내려쳐 넓은 범위를 강타하고, 4초 동안 무적이 됩니다.',tags:['광역 강타','4초 무적'],tip:'적에게 포위됐을 때 특수능력으로 탈출하세요.'},
 {role:'제어형',color:'#b5a2f5',basic:'사방으로 퍼지는 스피커 음파로 여러 적을 동시에 공격합니다.',special:'거대한 음파를 퍼뜨려 피해를 주고 일반 적을 3초, 최종보스를 1초 기절시킵니다.',tags:['전방위 음파','기절'],tip:'적이 많이 모였을 때 음파로 발을 묶으세요.'},
 {role:'관통형',color:'#94d3a8',basic:'적을 관통하고 돌아오는 슬리퍼를 던집니다. 돌아오는 길에도 공격할 수 있습니다.',special:'슬리퍼 12개를 사방으로 던져 주변 적을 관통합니다.',tags:['12방향','왕복 관통'],tip:'적과 거리를 유지하면 왕복 공격을 활용하기 좋습니다.'},
 {role:'연사형',color:'#e6c86b',basic:'가장 가까운 적을 향해 블록을 빠르게 연사합니다.',special:'주변 무작위 위치 30곳에 블록 폭격을 쏟아붓습니다.',tags:['30회 폭격','넓은 지역'],tip:'단일 대상을 노릴 땐 블록 연사, 무리를 상대할 땐 폭격을 쓰세요.'},
 {role:'회복형',color:'#eca8a0',basic:'주스 폭탄이 폭발하고 적을 느리게 하는 웅덩이가 남습니다. 무기 4레벨부터 웅덩이 위에서 회복합니다.',special:'주변 7곳에 주스 폭탄을 떨어뜨리고 커다란 충격파를 일으킵니다.',tags:['7연속 폭발','주스 웅덩이'],tip:'4레벨 이후에는 주스 웅덩이를 회복 구역으로 활용하세요.'},
 {role:'장판형',color:'#85dbd8',basic:'거품 솔이 무작위 위치를 강타하고 지속 피해를 주는 거품을 남깁니다.',special:'거품 솔 10개가 연속으로 떨어집니다. 주변에는 5초 동안 거품 지대가 유지됩니다.',tags:['10연속 강타','지속 피해'],tip:'거품 위로 적을 유도하면 피해를 더 줄 수 있습니다.'},
 {role:'회전형',color:'#c7a1e3',basic:'주위를 도는 소포가 접근하는 적을 계속 타격합니다.',special:'소포 12개를 사방으로 날리고 주변에 충격파를 일으켜 적을 밀쳐냅니다.',tags:['12개 소포','넉백'],tip:'회전하는 소포가 닿는 거리를 유지하세요.'},
 {role:'전장 정리형',color:'#e8a96d',basic:'초인종이 긴 준비 시간 뒤에 울려 일반 적을 제거하고 보스에게 큰 피해를 줍니다.',special:'일반 적을 한 번에 정리합니다. 중간보스 최대체력의 15%, 최종보스 최대체력의 10% 피해를 줍니다.',tags:['일반 적 제거','보스 비례 피해'],tip:'적이 화면을 가득 채울 때 사용하면 효과적입니다.'},
 {role:'방어형',color:'#87b9eb',basic:'냄비뚜껑이 피해를 막고 반격 폭발을 일으킵니다. 4·7·10레벨에 방패 수가 늘어납니다.',special:'6초 동안 무적이 되고 방패를 재충전합니다. 충격파 3개로 주변 적을 공격합니다.',tags:['6초 무적','방패 재충전'],tip:'위험한 공격을 특수능력으로 버티며 반격하세요.'},
 {role:'흡혈형',color:'#b7cc8a',basic:'바라보는 방향으로 주걱을 길게 찔러 관통 피해를 주고 체력을 흡수합니다.',special:'8방향으로 거대한 주걱을 연속 발사합니다. 적을 맞히면 체력을 흡수합니다.',tags:['8방향 관통','체력 흡수'],tip:'이동 방향을 조절해 주걱 끝을 적에게 맞추세요.'},
 {role:'시간 제어형',color:'#9eb9db',basic:'시곗바늘이 주위를 회전하며 닿는 적을 공격합니다.',special:'일반 적을 5초 동안 멈춥니다. 중간보스·최종보스는 2.5초 정지하며 충격파 피해도 받습니다.',tags:['일반 적 5초 정지','보스 2.5초 정지'],tip:'위험한 탄막 사이로 탈출할 시간을 만드세요.'},
 {role:'근접 지속형',color:'#e4bc74',basic:'털실 고리가 주위를 맴돌며 닿는 적에게 지속 피해를 줍니다.',special:'8초 동안 털실 고리를 강화하고 주변 적을 공격해 밀쳐냅니다.',tags:['8초 강화','주변 넉백'],tip:'다가오는 적을 고리 가장자리에서 상대하세요.'},
 {role:'함정형',color:'#dda6ce',basic:'발밑에 장난감 블록 함정을 설치합니다. 밟는 적에게 지속 피해를 줍니다.',special:'주변에 블록 함정 40개를 펼칩니다. 각 함정은 8초 동안 유지됩니다.',tags:['함정 40개','8초 유지'],tip:'함정을 놓으며 이동하고 적이 따라오게 만드세요.'}
];

export function createInterface({characters,strings,monsters,upgrades,chooseSkill,purchase,toggleQuality,closeShop,getState,select,start,goTitle,pause,resume,shop,settings}) {
 const variants=[
 {name:'초록 침입균',family:'세균',sprite:13,sheet:'characters',trait:'거실부터 등장하는 기본 추격형 세균'},
 {name:'그림자 세균',family:'세균',sprite:1,sheet:'monsters',trait:'가벼운 몸으로 빠르게 접근하는 세균'},
 {name:'붉은 갑충',family:'벌레',sprite:14,sheet:'characters',trait:'단단한 몸으로 밀고 들어오는 갑충'},
 {name:'청록 공벌레',family:'벌레',sprite:7,sheet:'monsters',trait:'체력이 높은 느린 근접형 벌레'},
 {name:'외계 정찰병',family:'외계인',sprite:15,sheet:'characters',trait:'간격을 벌리고 에너지탄을 발사하는 외계인'},
 ...monsters.map(m=>({...m,sheet:'monsters'})),
 {name:'거실 왕세균',family:'중간보스',sprite:0,sheet:'monsters',trait:'이동 경로를 예고한 뒤 돌진. 처치 후 세균이 출현'},
 {name:'딱정벌레 쌍둥이',family:'중간보스',sprite:4,sheet:'monsters',trait:'두 마리가 함께 등장해 돌진 경로를 만듭니다'},
 {name:'성운 정찰대장',family:'중간보스',sprite:14,sheet:'monsters',trait:'나선 탄막, 충격파, 포자 지대를 번갈아 사용'},
 {name:'마그마 거대병',family:'중간보스',sprite:15,sheet:'monsters',trait:'광역 강타와 충격파를 사용하고 부하를 소환'},
 {name:'외계인 대왕 UFO',family:'최종보스',sprite:15,sheet:'characters',trait:'체력에 따라 공격이 거세지는 3단계 보스. 탄막과 광역 폭격에 주의'}];
 const root=document.getElementById('home-interface');
 const sprite=(i,extra='')=>`<span class="atlas-portrait ${extra}" style="--sprite-x:${i%4/3*100}%;--sprite-y:${Math.floor(i/4)/3*100}%" aria-hidden="true"></span>`;
 root.innerHTML=`
 <section class="home-screen title-screen" data-screen="title">
  <div class="keyart"></div><div class="title-shade"></div><div class="air-motes"></div>
  <header class="game-header"><a class="wordmark" href="#" aria-label="우리집 대탐험 시작 화면">H<span>✦</span>ME <small>INVASION</small></a><span class="edition">CHAPTER 01 <b>집 안의 작은 전쟁</b></span></header>
  <main class="title-copy"><span class="eyebrow">작아진 우리. 거대해진 모험.</span><h1>우리집<br><em>대탐험</em><span>세균 · 벌레 · 외계인 침공편</span></h1><p>소파 아래부터 다락방까지.<br>우리 가족의 능력으로 몰려오는 적을 막아라.</p><button class="primary title-start" data-action="select">탐험대 꾸리기 <span>↗</span></button><button class="title-shop" data-action="shop"><span>◉</span> 코인 상점 <b>코인으로 영구 강화</b><strong data-wallet>0</strong></button><button class="text-button" data-action="guide">탐험가 · 몬스터 도감 <span>→</span></button></main>
  <footer class="title-footer"><span><i></i> 13명의 탐험가 · 5개의 방 · 한 번의 대모험</span><span>이동 <kbd>WASD</kbd> &nbsp;특수능력 <kbd>SPACE</kbd><b class="touch-note">터치 조작 지원</b></span></footer>
 </section>
 <section class="home-screen select-screen" data-screen="select" hidden>
  <header class="select-header"><button class="back-button" data-action="back" aria-label="시작 화면으로">←</button><div><span class="eyebrow">BUILD YOUR SQUAD</span><h1>함께 싸울 탐험가를 골라요</h1></div><button class="coin-pill" data-action="shop" aria-label="코인 상점 열기">◉ 코인 <strong id="home-coins" data-wallet>0</strong> <span>상점 ↗</span></button></header>
  <button class="economy-strip" data-action="shop"><span class="economy-symbol">◉</span><span><small>COIN WORKSHOP</small><strong>모은 코인으로 탐험대를 강화하세요</strong><em>공격력 · 체력 · 특수능력 · 부활 등 14종 영구 강화</em></span><span class="economy-cta"><b id="store-opportunity"></b>코인 상점 열기 →</span></button>
  <main class="selection-layout">
   <article class="hero-preview"><span class="preview-index" id="preview-index">01 / 13</span><div class="portrait-light"></div><div id="hero-portrait"></div><div class="hero-caption"><span class="role-label" id="hero-role"></span><h2 id="hero-name"></h2><span class="hero-ready">✦ 출동 준비 완료</span></div></article>
   <section class="roster-section"><div class="section-label"><h2>우리집 탐험대</h2><span>13 HEROES</span></div><div class="hero-roster" role="group" aria-label="탐험가 선택">${characters.map((c,i)=>`<button class="roster-card" data-hero="${i}" aria-pressed="false" aria-label="${strings.chars[c.id].name}">${sprite(i)}<span>${strings.chars[c.id].name}</span><b class="selected-check">✓</b></button>`).join('')}</div><p class="roster-hint">탐험가를 고르면 능력과 전투 방식을 확인할 수 있어요.</p></section>
   <section class="ability-panel"><div class="section-label"><h2>능력 브리핑</h2><button class="small-link" data-action="guide">전체 도감 ↗</button></div><article class="ability-card"><span class="ability-type">01 / 기본 무기 <b>자동 공격</b></span><h3 id="basic-name"></h3><p id="basic-desc"></p></article><article class="ability-card special-card"><span class="ability-type">02 / 특수능력 <b>게이지 100%</b></span><h3 id="special-name"></h3><p id="special-desc"></p><div id="ability-tags" class="ability-tags"></div></article><div class="tactic"><span>EXPLORER'S TIP</span><p id="hero-tip"></p></div><p class="charge-note">적을 공격해 게이지를 채우고 <kbd>SPACE</kbd> 또는 ⚡ 버튼으로 발동하세요.</p></section>
  </main>
  <footer class="selection-footer"><span class="asset-status" id="asset-status" role="status"></span><div class="footer-tools"><button data-action="shop">◉ 코인 상점 · 영구 강화</button><button data-action="settings">설정</button><button class="quality-inline" data-action="quality">화질 자동</button></div><button class="primary deploy-button" data-action="start"><span id="deploy-name"></span>와 탐험 시작 <span>→</span></button></footer>
 </section>
 <section class="home-screen shop-screen" data-screen="shop" hidden>
  <header class="select-header"><button class="back-button" data-action="close-shop" aria-label="상점에서 돌아가기">←</button><div><span class="eyebrow">COIN WORKSHOP</span><h1>코인 상점 · 탐험대 영구 강화</h1></div><span class="shop-wallet">보유 코인 <strong data-wallet>0</strong><small>◉</small></span></header>
  <div class="shop-intro"><div><h2>작은 코인이, 다음 모험의 큰 힘으로.</h2><p>강화는 모든 탐험가에게 적용되며 다음 탐험부터 유지됩니다.<br>적이 떨어뜨린 코인과 보스 보상을 모아 구매하세요.</p></div><div class="shop-save-note"><span>✦ 자동 저장</span>코인과 강화는 현재 브라우저에 저장됩니다.</div></div>
  <div class="shop-controls"><div class="shop-filters" role="group" aria-label="강화 분류"><button data-shop-filter="all" aria-pressed="true">전체 14</button><button data-shop-filter="attack" aria-pressed="false">공격</button><button data-shop-filter="survival" aria-pressed="false">생존</button><button data-shop-filter="growth" aria-pressed="false">수집 · 성장</button></div><p id="shop-summary"></p></div>
  <div id="shop-feedback" class="shop-feedback" role="status" aria-live="polite" hidden></div>
  <main class="upgrade-grid" id="upgrade-grid"></main>
  <footer class="shop-footer"><span>◉ 코인은 탐험 종료 또는 메뉴로 나갈 때 정산됩니다.</span><button class="primary" data-action="close-shop">준비 완료 · 돌아가기 →</button></footer>
 </section>
 <section class="home-screen result-screen" data-screen="result" hidden><div class="result-card"><span class="eyebrow">EXPEDITION REPORT</span><h1 id="result-title"></h1><p id="result-stats"></p><div class="payout"><span>이번 탐험 정산 코인</span><strong id="result-earned">+0</strong><small>보유 코인 <b data-wallet>0</b> ◉</small></div><p class="result-tip">모은 코인으로 강화하면 다음 탐험이 더 수월해져요.</p><button class="primary" data-action="shop">◉ 코인으로 강화하기 <span>→</span></button><button class="result-retry" data-action="select">탐험대 선택으로 →</button></div></section>
 <section class="home-screen skill-screen" data-screen="levelup" role="dialog" aria-modal="true" aria-labelledby="skill-title" hidden><div class="skill-panel"><span class="eyebrow">LEVEL UP · 전투 일시정지</span><h1 id="skill-title" tabindex="-1">어떤 기술을 강화할까요?</h1><p id="skill-queue"></p><div class="skill-grid" id="skill-grid"></div><p class="skill-footnote">하나를 선택하면 적용됩니다. 숫자 1 · 2 · 3으로도 선택할 수 있어요.</p></div></section>
 <button class="quality-toggle" hidden data-action="quality" title="렉이 심하면 저사양 모드를 사용하세요">화질 자동</button>
 <button class="battle-help" data-action="help" hidden>ⓘ 능력 안내</button>
 <dialog class="ability-dialog"><div class="dialog-head"><div><span class="eyebrow">FIELD GUIDE</span><h2>우리집 탐험 도감</h2></div><button class="close-dialog" aria-label="능력 도감 닫기">×</button></div><p class="dialog-intro">기본 무기는 자동으로 공격합니다. 특수능력은 적을 공격해 게이지를 100% 채운 뒤 사용할 수 있습니다.</p><div class="guide-tabs" role="tablist" aria-label="도감 분류"><button role="tab" id="tab-heroes" data-guide-tab="heroes" aria-selected="true" aria-controls="guide-heroes">탐험가 능력 · 13</button><button role="tab" id="tab-monsters" data-guide-tab="monsters" aria-selected="false" aria-controls="guide-monsters">침공 몬스터 · 26</button></div><div class="guide-list" id="guide-heroes" role="tabpanel" aria-labelledby="tab-heroes">${characters.map((c,i)=>`<article class="guide-entry" data-guide="${i}">${sprite(i)}<div><span class="role-label">${ABILITIES[i].role}</span><h3>${strings.chars[c.id].name}</h3><h4>${strings.chars[c.id].weapon} · 자동 공격</h4><p>${ABILITIES[i].basic}</p><h4>${strings.ultNames[c.id].replace('특수능력: ','')}</h4><p>${ABILITIES[i].special}</p></div></article>`).join('')}</div><div class="monster-guide" id="guide-monsters" role="tabpanel" aria-labelledby="tab-monsters" hidden><p class="monster-summary">일반 적 21종 · 중간보스 4종 · 최종보스 1종<br>거실 → 주방 → 욕실 → 아이방 → 다락방으로 갈수록 새로운 적이 등장합니다.</p><div class="monster-grid">${variants.map(m=>`<article class="monster-card"><span class="atlas-portrait" style="background-image:url('./assets/${m.sheet}-v2.png');--sprite-x:${m.sprite%4/3*100}%;--sprite-y:${Math.floor(m.sprite/4)/3*100}%"></span><small>${m.family}</small><h3>${m.name}</h3><p>${m.trait}</p></article>`).join('')}</div></div></dialog>`;
 let last='',selected=-1,coins=-1,loaded=-1,pausedByGuide=false,quality='',skillVersion=-1,skillPending=-1,resultKey='',shopKey='',activeCategory='all';
 const dialog=root.querySelector('dialog');
 const closeGuide=()=>{dialog.close();if(pausedByGuide){resume();document.getElementById('c')?.focus?.();pausedByGuide=false;}};
 root.querySelector('.close-dialog').addEventListener('click',closeGuide);
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeGuide();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)closeGuide();});
 document.addEventListener('keydown',e=>{if(getState().mode==='levelup'&&['Digit1','Digit2','Digit3'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){chooseSkill(Number(e.code.slice(-1))-1,getState().choiceRevision);sync();document.getElementById('c')?.focus?.();}return;}if(dialog.open){e.stopImmediatePropagation();if(e.key==='Escape'){e.preventDefault();closeGuide();}}else if(e.key==='Escape'&&getState().mode==='shop'){e.preventDefault();e.stopImmediatePropagation();closeShop();sync();}},true);
 root.addEventListener('click',e=>{
  const skill=e.target.closest('[data-skill-choice]');if(skill){if(chooseSkill(Number(skill.dataset.skillChoice),Number(skill.dataset.skillVersion))){sync();document.getElementById('c')?.focus?.();}return;}

  const filter=e.target.closest('[data-shop-filter]');if(filter){activeCategory=filter.dataset.shopFilter;shopKey='';sync();return;}
  const buy=e.target.closest('[data-buy]');if(buy){if(buy.disabled)return;const id=buy.dataset.buy;const outcome=purchase(id);const message=root.querySelector('#shop-feedback');message.textContent=outcome.message;message.hidden=false;message.dataset.success=String(outcome.ok);shopKey='';sync();root.querySelector(`[data-upgrade="${id}"]`)?.focus?.();return;}
  const tab=e.target.closest('[data-guide-tab]');
  if(tab){const category=tab.dataset.guideTab;root.querySelectorAll('[data-guide-tab]').forEach(el=>el.setAttribute('aria-selected',String(el===tab)));root.querySelector('#guide-heroes').hidden=category!=='heroes';root.querySelector('#guide-monsters').hidden=category!=='monsters';return;}
  const hero=e.target.closest('[data-hero]');if(hero){select(Number(hero.dataset.hero));return;}
  const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
  if(action==='quality'){toggleQuality();sync();if(getState().mode==='play')document.getElementById('c')?.focus?.();return;}
  if(action==='select')select(getState().index);
  if(action==='back')goTitle();
  if(action==='start'){start();sync();document.getElementById('c')?.focus?.();}
  if(action==='shop'){root.querySelector('#shop-feedback').hidden=true;shop();sync();}if(action==='close-shop'){closeShop();sync();}if(action==='settings')settings();
  if(action==='guide'||action==='help'){
   pausedByGuide=getState().mode==='play';if(pausedByGuide)pause();
   root.querySelector('#guide-heroes').hidden=false;root.querySelector('#guide-monsters').hidden=true;root.querySelectorAll('[data-guide-tab]').forEach(el=>el.setAttribute('aria-selected',String(el.dataset.guideTab==='heroes')));
   dialog.showModal();
   if(action==='help')root.querySelector(`[data-guide="${getState().heroIndex}"]`)?.scrollIntoView({block:'start'});
  }
 });
 root.querySelector('.wordmark').addEventListener('click',e=>{e.preventDefault();goTitle();});
 function renderShop(state){
  const unfinished=upgrades.filter(u=>(state.shopLevels[u.id]||0)<u.max);
  const available=unfinished.filter(u=>u.cost(state.shopLevels[u.id]||0)<=state.coins);
  const cheapest=unfinished.length?Math.min(...unfinished.map(u=>u.cost(state.shopLevels[u.id]||0))):0;
  root.querySelector('#shop-summary').textContent=available.length?`지금 구매 가능 ${available.length}종`:(unfinished.length?`다음 강화를 위해 ${Math.max(0,cheapest-state.coins).toLocaleString()} 코인을 더 모으세요`:'모든 영구 강화를 완료했어요!');
  root.querySelectorAll('[data-shop-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.shopFilter===activeCategory)));
  root.querySelector('#upgrade-grid').innerHTML=upgrades.filter(u=>activeCategory==='all'||u.category===activeCategory).map(u=>{
   const lv=state.shopLevels[u.id]||0,maxed=lv>=u.max,price=maxed?0:u.cost(lv),affordable=state.coins>=price;
   return `<article class="upgrade-card ${maxed?'maxed':affordable?'affordable':'locked'}" data-upgrade="${u.id}" tabindex="-1"><div class="upgrade-head"><span class="upgrade-art" style="--sprite-x:${u.icon%4/3*100}%;--sprite-y:${Math.floor(u.icon/4)/3*100}%" aria-hidden="true"></span><div><span class="upgrade-category">${{attack:'공격 강화',survival:'생존 강화',growth:'수집 · 성장'}[u.category]}</span><h2>${u.name}</h2></div><span class="upgrade-level">${maxed?'MAX':`Lv.${lv} / ${u.max}`}</span></div><p class="upgrade-desc">${u.desc}</p><div class="upgrade-steps" aria-label="강화 단계">${Array.from({length:u.max},(_,i)=>`<i class="${i<lv?'filled':''}"></i>`).join('')}</div><div class="upgrade-effect"><span><small>현재</small>${u.effect(lv)}</span>${maxed?'<b class="max-badge">최대 강화 완료</b>':`<b>→</b><span><small>다음 단계</small>${u.effect(lv+1)}</span>`}</div><button class="purchase-button" data-buy="${u.id}" ${maxed||!affordable?'disabled':''}>${maxed?'✓ 구매 완료':affordable?`◉ ${price.toLocaleString()} 코인으로 강화`:`◉ ${price.toLocaleString()} · ${(price-state.coins).toLocaleString()} 코인 부족`}</button><small class="upgrade-permanent">모든 탐험가 적용 · 영구 유지</small></article>`;
  }).join('');
 }
 function renderSkills(state){
  const weaponFrames={hammer:0,bolt:1,boomerang:2,milk:3,chalk:4,bag:5,brush:6,ddakji:7,alarm:8,shield:9,ruler:10,clock:11,garlic:12,tack:13};
  const passiveFrames={swift:2,amp:0,vital:15,magnet:14,bigger:5,bell:11,note:7};
  root.querySelector('#skill-grid').innerHTML=state.choices.map((c,i)=>{
   const weapon=c.k==='w'||c.k==='nw',passive=c.k==='p'||c.k==='np',fresh=c.k==='nw'||c.k==='np';
   const data=weapon?strings.weapons[c.id]:passive?strings.passives[c.id]:{name:strings.heal,desc:strings.healDesc};
   const frame=weapon?weaponFrames[c.id]:passive?passiveFrames[c.id]:15;
   const tag=c.k==='heal'?'즉시 회복':fresh?(weapon?'새 무기':'새 패시브'):'보유 기술 강화';
   const level=c.k==='heal'?'체력 +40':fresh?'Lv.1 획득':`Lv.${c.lv-1} → Lv.${c.lv}`;
   return `<button class="skill-card" data-skill-choice="${i}" data-skill-version="${state.choiceRevision}"><span class="skill-art" style="--sprite-x:${frame%4/3*100}%;--sprite-y:${Math.floor(frame/4)/3*100}%" aria-hidden="true"></span><span class="skill-copy"><small>${tag}</small><strong>${data.name}</strong><p>${data.desc}</p><span class="skill-upgrade">${level}</span>${weapon&&strings.evolveHint[c.id]?`<span class="skill-evolve">각성 조건 · ${strings.evolveHint[c.id]}</span>`:''}</span><span class="skill-number">${i+1}</span></button>`;
  }).join('');
 }
 function sync(){
  const state=getState(),mode=state.mode;
  if(mode!==last){root.querySelector('[data-screen="title"]').hidden=mode!=='title';root.querySelector('[data-screen="select"]').hidden=mode!=='select';root.querySelector('[data-screen="shop"]').hidden=mode!=='shop';root.querySelector('[data-screen="levelup"]').hidden=mode!=='levelup';root.querySelector('[data-screen="result"]').hidden=!['win','over'].includes(mode);root.querySelector('.battle-help').hidden=!['play','pause'].includes(mode);root.querySelector('.quality-toggle').hidden=!['play','pause'].includes(mode);last=mode;}
  if(state.quality!==quality){quality=state.quality;root.querySelectorAll('[data-action=quality]').forEach(el=>el.textContent=quality==='low'?'⚡ 저사양 모드':'화질 자동');document.documentElement.dataset.quality=quality;}
  if(mode==='levelup'){if(skillVersion!==state.choiceRevision){skillVersion=state.choiceRevision;renderSkills(state);}if(skillPending!==state.level+'|'+state.pendingLevels){skillPending=state.level+'|'+state.pendingLevels;root.querySelector('#skill-queue').textContent=`탐험가 Lv.${state.level} · 남은 기술 선택 ${state.pendingLevels}회`;}}
  if(state.assetsLoaded!==loaded){loaded=state.assetsLoaded;const ready=loaded===state.assetsTotal;root.querySelector('[data-action=start]').disabled=!ready;root.querySelector('#asset-status').hidden=ready;root.querySelector('#asset-status').textContent='그래픽 준비 중… '+loaded+'/'+state.assetsTotal;}
  if(state.coins!==coins){root.querySelectorAll('[data-wallet]').forEach(el=>el.textContent=state.coins.toLocaleString());coins=state.coins;}
  const key=state.coins+'|'+state.shopRevision;
  if(shopKey!==key){shopKey=key;renderShop(state);const affordable=upgrades.filter(u=>(state.shopLevels[u.id]||0)<u.max&&u.cost(state.shopLevels[u.id]||0)<=state.coins).length;const unfinished=upgrades.filter(u=>(state.shopLevels[u.id]||0)<u.max);const nextPrice=unfinished.length?Math.min(...unfinished.map(u=>u.cost(state.shopLevels[u.id]||0))):0;root.querySelector('#store-opportunity').textContent=affordable?`지금 ${affordable}종 구매 가능`:(unfinished.length?`${(nextPrice-state.coins).toLocaleString()} 코인 더 모으면 강화 가능`:'모든 강화 완료');}
  if((mode==='win'||mode==='over')&&resultKey!==mode+'|'+state.runTime+'|'+state.runEarned){resultKey=mode+'|'+state.runTime+'|'+state.runEarned;root.querySelector('#result-title').textContent=mode==='win'?'우리집을 지켰어요!':'이번 탐험은 여기까지';root.querySelector('#result-stats').textContent=`생존 ${Math.floor(state.runTime/60)}분 ${state.runTime%60}초 · 처치 ${state.kills}마리`;root.querySelector('#result-earned').textContent='+'+state.runEarned.toLocaleString();}

  if(state.index===selected)return;selected=state.index;
  const c=characters[selected],a=ABILITIES[selected],name=strings.chars[c.id].name;
  root.querySelector('.hero-preview').style.setProperty('--hero-accent',a.color);
  root.querySelector('#hero-portrait').innerHTML=sprite(selected,'large-portrait');
  for(const [id,value] of Object.entries({'preview-index':String(selected+1).padStart(2,'0')+' / 13','hero-role':a.role,'hero-name':name,'basic-name':strings.chars[c.id].weapon,'basic-desc':a.basic,'special-name':strings.ultNames[c.id].replace('특수능력: ',''),'special-desc':a.special,'hero-tip':a.tip,'deploy-name':name}))root.querySelector('#'+id).textContent=value;
  root.querySelector('#ability-tags').innerHTML=a.tags.map(t=>`<span>${t}</span>`).join('');
  root.querySelectorAll('[data-hero]').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===selected)));
 }
 return {sync};
}
