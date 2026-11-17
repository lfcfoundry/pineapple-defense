export function schedule(id){
 if(!Number.isInteger(id)||id<1||id>12)throw Error('Primary session ID must be 1–12');
 const first=id%2?['F0','N0']:['N0','F0'];const second=[1,0,0,1][(id-1)%4]?['N0','N1']:['N1','N0'];
 const main=[...first,...second].flatMap((condition,b)=>[{stage:b<2?1:2,block:b+1,condition,preset:'A',kind:'practice',practiceCap:60},...[1,2,3].map(slot=>({stage:b<2?1:2,block:b+1,condition,preset:'A',kind:'scored',slot})),{stage:b<2?1:2,block:b+1,condition,preset:'A',kind:'rating',lockPrimary:b===1}]);
 return [...main,{kind:'understanding',condition:'N1',preset:'B'},{kind:'transfer',condition:'N1',preset:'B',slot:1},{kind:'transfer-feedback',condition:'N1',preset:'B'},{kind:'transfer',condition:'N1',preset:'B',slot:2},{kind:'replay-choice'},{kind:'optional-round',condition:'N0',preset:'A'},...(id%2?first.map(condition=>({kind:'recovery',condition,preset:'A'})):[]),{kind:'complete'}];
}
export const questions=[
 'Does the landing point move if a penguin walks away?',
 'Can a penguin move before it lands?',
 'Does crossing a penguin in the air always count?',
 'What if a penguin is on the support point when it lands?',
 'What makes the cart move and what happens when it meets a walking penguin?'
];
export const scripts={F0:'Flick up toward a penguin. A harder flick throws farther. Cart parked.',N0:'Press where it should land, move to correct if needed, lift to throw. Penguins keep moving. Cart parked.',N1:'Press where it should land, move to correct if needed, lift to throw. Penguins keep moving. Hit the support to release the cart.'};
export function errorRate(codes){const known=codes.filter(c=>(c.intent==='launch'&&['accepted','early','invalid-gesture','wrong-actor','wrong-endpoint'].includes(c.code))||c.code==='accidental');if(!known.length)return null;return known.filter(c=>c.code!=='accepted').length/known.length;}
export const p95=values=>values.length?[...values].sort((a,b)=>a-b)[Math.ceil(.95*values.length)-1]:null;
