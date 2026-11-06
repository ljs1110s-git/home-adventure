// Each entry has a distinct sprite and combat profile. Original five remain as variants.
export const MONSTERS = [
 {id:'spike',name:'가시 왕세균',family:'세균',sprite:0,hp:25,spd:64,dmg:9,size:65,xp:2,ai:'chase',trait:'가까이 붙어 공격하는 가시 세균'},
 {id:'amoeba',name:'보랏빛 아메바',family:'세균',sprite:1,hp:22,spd:85,dmg:7,size:61,xp:2,ai:'weave',trait:'좌우로 흔들리며 접근하는 젤리 몸체'},
 {id:'spore',name:'포자 버섯',family:'세균',sprite:2,hp:36,spd:44,dmg:8,size:65,xp:3,ranged:true,shots:3,shootCd:4.5,trait:'거리를 유지하며 포자 탄환 3개 발사'},
 {id:'trislime',name:'세눈 슬라임',family:'세균',sprite:3,hp:48,spd:43,dmg:10,size:72,xp:3,ai:'brood',trait:'쓰러지면 작은 초록 세균 2마리로 분열'},
 {id:'rhino',name:'화산 장수풍뎅이',family:'벌레',sprite:4,hp:66,spd:47,dmg:15,size:79,xp:4,ai:'dash',trait:'몸을 웅크린 뒤 고정된 방향으로 돌진'},
 {id:'wasp',name:'황금 독침벌',family:'벌레',sprite:5,hp:20,spd:106,dmg:10,size:60,xp:2,ai:'weave',trait:'빠른 비행으로 좌우를 오가며 추격'},
 {id:'spider',name:'자수정 거미',family:'벌레',sprite:6,hp:28,spd:112,dmg:10,size:65,xp:2,ai:'chase',trait:'넓은 다리를 움직이며 빠르게 추격'},
 {id:'pillbug',name:'강철 공벌레',family:'벌레',sprite:7,hp:85,spd:39,dmg:13,size:72,xp:4,ai:'chase',trait:'느리지만 체력이 높은 중장갑 벌레'},
 {id:'mantis',name:'벚꽃 사마귀',family:'벌레',sprite:8,hp:38,spd:76,dmg:14,size:73,xp:3,ai:'dash',trait:'예고 표시 후 날카롭게 돌진'},
 {id:'centipede',name:'불꽃 지네',family:'벌레',sprite:9,hp:47,spd:70,dmg:12,size:76,xp:3,ai:'weave',trait:'긴 몸을 흔들며 지그재그로 접근'},
 {id:'moth',name:'푸른 달나방',family:'벌레',sprite:10,hp:26,spd:63,dmg:8,size:73,xp:3,ranged:true,shots:3,shootCd:4.8,trait:'날개를 펼쳐 부채꼴 탄막 발사'},
 {id:'scorpion',name:'비취 전갈',family:'벌레',sprite:11,hp:60,spd:48,dmg:13,size:75,xp:4,ranged:true,shots:1,shootCd:3.3,trait:'사거리를 벌리며 독침 탄환 발사'},
 {id:'soldier',name:'외계 돌격병',family:'외계인',sprite:12,hp:39,spd:69,dmg:10,size:70,xp:3,ranged:true,shots:1,shootCd:3.1,trait:'거리를 유지하며 에너지탄 발사'},
 {id:'drone',name:'펄스 정찰 드론',family:'외계인',sprite:13,hp:23,spd:105,dmg:9,size:59,xp:2,ai:'weave',trait:'빠르게 선회하며 접근하는 소형 드론'},
 {id:'octopus',name:'성운 문어',family:'외계인',sprite:14,hp:53,spd:42,dmg:10,size:78,xp:4,ranged:true,shots:5,shootCd:5.3,trait:'천천히 이동하며 5방향 에너지탄 발사'},
 {id:'crabmech',name:'마그마 집게 메카',family:'외계인',sprite:15,hp:95,spd:36,dmg:18,size:85,xp:5,ai:'dash',trait:'높은 체력과 묵직한 예고 돌진'},
];
