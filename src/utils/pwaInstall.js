let deferredPrompt = null
let initialized = false

export function initPWAInstall(){

if(initialized) return
initialized = true

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault()
deferredPrompt = e

})

window.addEventListener("appinstalled",()=>{
deferredPrompt = null
})

}

export async function installPWA(){

if(!deferredPrompt) return false

deferredPrompt.prompt()

const result = await deferredPrompt.userChoice

deferredPrompt = null

return result?.outcome === "accepted"

}