export function sortStudentsForRanking(students=[]){

return [...students].sort((a,b)=>{

const scoreDiff = (b.scoreTotal || 0) - (a.scoreTotal || 0)
if(scoreDiff !== 0) return scoreDiff

return String(a.name || "").localeCompare(String(b.name || ""), "ko")

})

}

export function getRankByScore(students=[], studentName=""){

const target = students.find(s=>s.name===studentName)

if(!target) return 0

const higherCount = students.filter(s=>(s.scoreTotal || 0) > (target.scoreTotal || 0)).length

return higherCount + 1

}

export function getChampionName(students=[]){

const sorted = sortStudentsForRanking(students)

return sorted[0]?.name || null

}

export function getTopScore(students=[]){

const sorted = sortStudentsForRanking(students)

return sorted[0]?.scoreTotal || 0

}

export function getScoreDiffFromTop(students=[], studentName=""){

const target = students.find(s=>s.name===studentName)

if(!target) return 0

const topScore = getTopScore(students)

const diff = topScore - (target.scoreTotal || 0)

return diff < 0 ? 0 : diff

}