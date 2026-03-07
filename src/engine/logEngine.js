export function writeLog(student,action){

const now = new Date()

const date =
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")

const month =
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")

let logs = JSON.parse(localStorage.getItem("classLogs") || "[]")

/* 이미 오늘 기록이 있는지 확인 */

const alreadyToday = logs.some(l =>
l.student === student.name &&
l.date === date
)

/* 로그 생성 */

const log = {
date,
month,
student:student.name,
action,
point:1
}

logs.push(log)

/* 자동 출석 기록 생성 */

if(!alreadyToday){

logs.push({
date,
month,
student:student.name,
action:"AUTO_ATTENDANCE",
point:0
})

}

localStorage.setItem("classLogs",JSON.stringify(logs))

}