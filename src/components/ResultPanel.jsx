import { getStreak } from "../engine/analyticsEngine"
import BossPanel from "./BossPanel"
import TeamMissionPanel from "./TeamMissionPanel"
import { checkRival } from "../engine/rivalEngine"

export default function ResultPanel({ top5 = [], result, onConfirm, boss, mission, rival }) {

  if (result && result.student) {

    const streak = getStreak(result.student?.name || "")

    let streakText = null

    if (streak >= 10) streakText = "10연속 참여!"
    else if (streak >= 5) streakText = "5연속 참여!"
    else if (streak >= 3) streakText = "3연속 참여!"

    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "120px" }}>
          {result.student?.character}
        </div>

        <div style={{ fontSize: "48px", fontWeight: "800" }}>
          {result.student?.name}
        </div>

        {streakText && (
          <div style={{ fontSize: "24px", color: "#ff6b00" }}>
            {streakText}
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "26px" }}>
          {result.action} +1
        </div>

        {result.bonus > 0 && (
          <div>
            {result.bonusType} +{result.bonus}
          </div>
        )}

        <div>점수 {result.score}</div>
        <div>Lv {result.level}</div>

        <button
          onClick={() => onConfirm && onConfirm()}
          style={{
            marginTop: "20px",
            padding: "16px 40px"
          }}
        >
          확인
        </button>
      </div>
    )
  }

  if (boss) return <BossPanel boss={boss} />

  if (mission) {
    return (
      <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
        <TeamMissionPanel mission={mission} />
      </div>
    )
  }

  if (rival) {

    const rivalResult = checkRival(rival.student)
    let need = rivalResult?.need || 0

    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h2>라이벌 미션</h2>
        <div>목표 : {rival.student?.name}</div>
        <div>필요 : {need}</div>
      </div>
    )
  }

  const MIN_ROWS = 20
  const rows = [...top5]

  while (rows.length < MIN_ROWS) {
    rows.push(null)
  }

  const colWidths = ["10%", "50%", "12%", "10%", "18%"]

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "24px 20px",
      boxSizing: "border-box"
    }}>

      {/* 🔥 텍스트 영역 (간격 2배 증가) */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{
          fontSize: "25px",
          color: "#d9d9d9",
          letterSpacing: "1px"
        }}>
          랭킹배틀 TOP 1 ~ {top5.length}
        </div>

        <div style={{
          fontSize: "26px",
          fontWeight: "800",
          marginTop: "8px"
        }}>
          반드시 내가 1등을 하고 말테야!
        </div>
      </div>

      <table style={{
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        borderTop: "3px solid rgba(255,255,255,0.6)",
        borderBottom: "1px solid rgba(255,255,255,0.3)"
      }}>
        <colgroup>
          {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>
        <thead>
          <tr>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>순위</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>이름</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>점수</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>레벨</th>
            <th style={{ padding: "12px 8px", textAlign: "center" }}>등락</th>
          </tr>
        </thead>
      </table>

      <div style={{
        flex: 1,
        overflowY: "auto"
      }}>
        <table style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "separate",
          borderSpacing: "0 6px"
        }}>
          <colgroup>
            {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
          </colgroup>

          <tbody>
            {rows.map((s, i) => {

              let diff = s?.rankDiff || 0
              let diffText = ""
              let diffColor = "#aaa"

              if (diff > 0) {
                diffText = `▲${diff}`
                diffColor = "#ff6b6b"
              } else if (diff < 0) {
                diffText = `▼${Math.abs(diff)}`
                diffColor = "#4a7cff"
              }

              const isBox = i % 2 === 1

              return (
                <tr
                  key={i}
                  style={{
                    height: "52px",
                    background: isBox ? "rgba(255,255,255,0.08)" : "transparent",
                    borderRadius: "8px"
                  }}
                >
                  <td style={{ textAlign: "center" }}>
                    {s ? i + 1 : ""}
                  </td>

                  <td style={{ textAlign: "center", fontWeight: "500" }}>
                    {s ? `${s.character} ${s.name}` : ""}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {s?.scoreTotal ?? ""}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {s?.level ?? ""}
                  </td>

                  <td style={{ textAlign: "center", color: diffColor }}>
                    {diffText}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        height: "3px",
        background: "rgba(255,255,255,0.6)",
        marginTop: "4px"
      }} />

    </div>
  )
}