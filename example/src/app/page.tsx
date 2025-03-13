'use client'


import { useEffect, useState } from "react";
import { FFC_Controller } from "@/logics/FFCController";
// import { LivekitController } from "@/logics/LivekitController";

export default function Home() {
  const [status, setStatus] = useState<string>("")
  const [local, setLocal] = useState<string>("")

  const [rtc, setRtc] = useState<FFC_Controller | null>(null);

  useEffect(() => {
    const rtc = new FFC_Controller();
    rtc.on("status", (arg) => {
      setStatus(arg)
    })
    rtc.on("local_join", (args) => {
      setLocal(JSON.stringify(args))
      
    })
    setRtc(rtc)
  },[])


  return (
    <div style={{width:'100%', height:'100%', display:'flex', padding:'16px', flexDirection:'column'}}>
      <h1>{status}</h1>
      <div style={{width:'200px', height:'200px'}}>{local}</div>
     {rtc ? <button onClick={async () => {
      await rtc.connect(``,
      ``, {local: {
        camera: {
          enabled: undefined,
          muted: undefined
        },
        microphone: {
          enabled: undefined,
          muted: undefined
        }
      }, remotes:{}})

     }}>connect</button> : null}
    </div>
  );
}
