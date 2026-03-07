let deferredPrompt = null

export function initPWAInstall(){

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault()

deferredPrompt = e

})

}

export async function installPWA(){

if(!deferredPrompt) return false

deferredPrompt.prompt()

const result = await deferredPrompt.userChoice

deferredPrompt = null

return result.outcome === "accepted"

}