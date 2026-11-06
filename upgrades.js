// The store UI and combat engine share these prices and level limits.
export const UPGRADE_CATALOG = [
 {id:'power',name:'힘 기르기',category:'attack',icon:0,max:5,cost:l=>80+l*95,desc:'모든 무기의 피해가 강화됩니다.',effect:l=>'피해 +'+l*8+'%'},
 {id:'rapid',name:'연사 훈련',category:'attack',icon:1,max:5,cost:l=>80+l*95,desc:'기본 무기의 공격 간격이 짧아집니다.',effect:l=>'공격 간격 −'+l*6+'%'},
 {id:'proj',name:'장난감통 확장',category:'attack',icon:4,max:2,cost:l=>250+l*450,desc:'슬리퍼·블록·주스 투사체 수가 늘어납니다.',effect:l=>'추가 투사체 +'+l},
 {id:'ultcd',name:'특수능력 특훈',category:'attack',icon:11,max:3,cost:l=>150+l*190,desc:'적을 공격할 때 특수능력 게이지가 더 빨리 찹니다.',effect:l=>'게이지 획득 +'+l*10+'%'},
 {id:'wslot',name:'수납장 확장',category:'attack',icon:5,max:2,cost:l=>600+l*900,desc:'한 번의 탐험에서 장착할 수 있는 무기 수가 늘어납니다.',effect:l=>'무기 슬롯 '+(4+l)+'개'},
 {id:'hp',name:'체력 단련',category:'survival',icon:15,max:5,cost:l=>60+l*75,desc:'모든 탐험가의 시작 최대 체력이 높아집니다.',effect:l=>'기본 체력 '+(100+l*20)},
 {id:'armor',name:'두꺼운 패딩',category:'survival',icon:9,max:4,cost:l=>100+l*130,desc:'적의 접촉·탄막으로 받는 피해를 줄입니다.',effect:l=>'받는 피해 −'+l*5+'%'},
 {id:'spd',name:'달리기 연습',category:'survival',icon:2,max:5,cost:l=>60+l*75,desc:'이동 속도가 빨라져 적을 피하기 쉬워집니다.',effect:l=>'이동 속도 +'+l*5+'%'},
 {id:'revive',name:'응급 간식',category:'survival',icon:15,max:1,cost:l=>800,desc:'구매 후 매 탐험마다 한 번, 체력 60%로 자동 부활합니다.',effect:l=>l?'매 탐험 1회 부활':'부활 없음'},
 {id:'coin',name:'용돈 협상',category:'growth',icon:5,max:3,cost:l=>120+l*160,desc:'탐험 종료 시 모은 코인에 추가 보너스를 받습니다.',effect:l=>'정산 코인 +'+l*20+'%'},
 {id:'magnetR',name:'긴 팔 뻗기',category:'growth',icon:14,max:3,cost:l=>90+l*120,desc:'멀리 있는 코인·경험치를 끌어오는 범위가 넓어집니다.',effect:l=>'획득 범위 +'+l*15+'%'},
 {id:'xp',name:'탐험 복습',category:'growth',icon:7,max:3,cost:l=>120+l*160,desc:'경험치를 더 얻어 탐험 중 레벨이 빨리 오릅니다.',effect:l=>'경험치 +'+l*8+'%'},
 {id:'luck',name:'네잎클로버',category:'growth',icon:14,max:3,cost:l=>130+l*170,desc:'적이 회복·자석·코인 등의 아이템을 떨어뜨릴 확률이 높아집니다.',effect:l=>'아이템 드롭 +'+l*25+'%'},
 {id:'pslot',name:'탐험가방 확장',category:'growth',icon:5,max:2,cost:l=>500+l*700,desc:'탐험에서 장착할 수 있는 패시브 수가 늘어납니다.',effect:l=>'패시브 슬롯 '+(4+l)+'개'}
];
