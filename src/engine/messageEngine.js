export function getMessage(diff){

if(diff===0){
return "🏆 공동 1위입니다!"
}

if(diff===1){
return "🔥 1등까지 1점!"
}

if(diff<=3){
return "🔥 거의 따라잡았어요!"
}

if(diff<=5){
return "👏 조금만 더!"
}

return "⭐ 좋은 시작입니다!"

}