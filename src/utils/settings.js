export function loadSettings(){

const s = localStorage.getItem("classSettings")

if(!s){

const defaultSettings = {
actions:[],
password:"0000",
encourageDays:5
}

localStorage.setItem("classSettings",JSON.stringify(defaultSettings))

return defaultSettings

}

return JSON.parse(s)

}

export function saveSettings(settings){

const current = loadSettings()

const merged = {
...current,
...settings
}

localStorage.setItem("classSettings",JSON.stringify(merged))

}