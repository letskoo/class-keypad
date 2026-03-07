import {readExcel} from "../excel/excelReader"
import {setClassData} from "../engine/classData"
import {saveSettings} from "../utils/settings"
import {selectClassFolder} from "../utils/fileSystem"

export default function ExcelUpload({onLoaded}){

async function connectFolder(){

try{

await selectClassFolder()

alert("데이터 폴더 연결 완료")

}catch(e){

console.log("folder connect fail",e)

alert("폴더 선택 취소")

}

}

async function upload(e){

try{

const file = e.target.files?.[0]

if(!file) return

const data = await readExcel(file)

if(!data || !data.students || !data.headers){

alert("엑셀 형식 오류")
return

}

/* 학생 데이터 저장 */

setClassData(data)

/* 버튼 항목 저장 */

const actions=data.headers.slice(1)

saveSettings({
actions
})

/* 대시보드에 항목 전달 */

if(onLoaded){
onLoaded(data)
}

alert("학생 데이터 업로드 완료")

}catch(e){

console.log("excel upload fail",e)

alert("엑셀 읽기 실패")

}

}

return(

<div>

<button onClick={connectFolder}>
데이터 폴더 연결
</button>

<br/><br/>

<input
type="file"
accept=".xlsx"
onChange={upload}
/>

</div>

)

}