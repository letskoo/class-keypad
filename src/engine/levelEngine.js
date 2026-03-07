export function getLevel(score){

if(score >= 80) return 5
if(score >= 50) return 4
if(score >= 25) return 3
if(score >= 10) return 2

return 1

}

export function getLevelName(level){

const names = [
"",
"새싹",
"성장",
"도전자",
"강자",
"챔피언"
]

return names[level]

}

export function getNextLevelScore(level){

const table = [0,10,25,50,80]

return table[level] || 999

}

export function getLevelProgress(score){

const levels = [0,10,25,50,80]

let level = 1

for(let i=1;i<levels.length;i++){

if(score >= levels[i]) level = i

}

const current = levels[level]
const next = levels[level+1] || current

const progress = (score-current)/(next-current)

return Math.min(progress,1)

}