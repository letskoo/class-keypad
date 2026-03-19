import {getStudents} from "./classData"

export function getTeacherRecommendations(){

const students=getStudents()

if(!students.length) return []

const sorted=[...students].sort((a,b)=>a.scoreTotal-b.scoreTotal)

const low=sorted.slice(0,5)

return low.map(s=>({

name:s.name,
reason:"참여가 적어 격려 필요"

}))

}