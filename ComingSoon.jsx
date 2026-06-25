import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function ComingSoon({ title, blurb }) {
  return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 28px"}}>
        <div style={{textAlign:"center",maxWidth:520,borderTop:`2px solid ${C.ink}`,paddingTop:32}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:".12em",marginBottom:14}}>Coming Soon</div>
          <h1 style={{fontFamily:SERIF,fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:C.ink,marginBottom:14,letterSpacing:"-.01em"}}>{title}</h1>
          <p style={{fontFamily:SERIF,fontStyle:"italic",fontSize:16,color:C.muted,lineHeight:1.7,marginBottom:28}}>{blurb}</p>
          <Link to="/" style={{fontFamily:SANS,fontSize:13,fontWeight:700,background:C.ink,color:C.bg,padding:"12px 28px",display:"inline-block"}}>
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
