export default function KeypadPad({ onInput }) {
  const numbers = [
    1,2,3,
    4,5,6,
    7,8,9,
    "←",0
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,80px)",
        gap: 10,
        justifyContent: "center",
        marginTop: 20
      }}
    >
      {numbers.map((n,i)=>(
        <button
          key={i}
          style={{
            fontSize: 24,
            padding: 20
          }}
          onClick={()=>onInput(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
