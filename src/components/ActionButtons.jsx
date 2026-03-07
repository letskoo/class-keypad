export default function ActionButtons({ actions, onSelect }) {

  return (
    <div
      style={{
        display:"flex",
        gap:10,
        marginTop:30,
        justifyContent:"center"
      }}
    >
      {actions.map((a,i)=>(
        <button
          key={i}
          style={{
            padding:"14px 20px",
            fontSize:18
          }}
          onClick={()=>onSelect(a)}
        >
          {a}
        </button>
      ))}
    </div>
  );
}