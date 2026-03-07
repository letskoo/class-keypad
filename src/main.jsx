import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {checkMonthReset} from "./utils/monthGuard"
import {initPWAInstall} from "./utils/pwaInstall"

/* 월 변경 체크 */

checkMonthReset()

/* PWA 설치 초기화 */

initPWAInstall()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)