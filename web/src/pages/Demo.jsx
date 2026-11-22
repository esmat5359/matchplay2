import { useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_VIDEO_URL } from "../config.js";
import { useTitle } from "../lib/hooks.js";
import { Button, SectionTitle, Tilt } from "../components/UI.jsx";
import { OrbitSpinner } from "../components/Spinners.jsx";

function youtubeId(u) {
  const m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/.exec(u);
  return m?.[1];
}

export default function Demo() {
  useTitle("Demo");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const yt = youtubeId(DEMO_VIDEO_URL);
  return (
    <>
      <div className="page-head" style={{ textAlign: "center" }}><span className="eyebrow">Demo</span><h1>See a round from start to payout</h1><p style={{ margin: "0 auto" }}>Press play for a walkthrough: create a round, enter, run the matches, read the verdicts and claim.</p></div>
      <div className="video-box">
        {!playing ? (
          <button className="video-poster" style={{ backgroundImage: "url(./img/hero.webp)", backgroundSize: "cover", backgroundPosition: "center" }} onClick={() => setPlaying(true)} aria-label="Play the demo video"><span className="play" /></button>
        ) : yt ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`} title="Matchplay demo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : failed ? (
          <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#fff", padding: 24, textAlign: "center" }}>
            <div><OrbitSpinner size={90} /><p style={{ marginTop: 16 }}>The demo video file was not found.<br />Put <code>matchplay-demo.mp4</code> in <code>public/demo/</code> or set <code>VITE_DEMO_VIDEO_URL</code>.</p></div>
          </div>
        ) : (
          <video src={DEMO_VIDEO_URL} controls autoPlay playsInline onError={() => setFailed(true)} />
        )}
      </div>
      <section className="section">
        <SectionTitle title="The walkthrough, step by step" />
        <div className="grid g3">
          {[["1 · Connect", "Pick a wallet from the list (EIP-6963). If it is on another network, switch to GenLayer Studionet with one click."], ["2 · Create", "Write the mission, attach the prize, choose the bar and the time windows. Inputs are checked against the contract before any GEN is sent."], ["3 · Enter", "Entrants pay the bond and submit a pitch with an evidence link. The tripwire is previewed live with would_steer()."], ["4 · Judge", "Anyone presses “Run next match”. The judge reads each match twice with the entries swapped."], ["5 · Finalize", "When every match is played or time is up, anyone finalizes. Money is credited by the books."], ["6 · Claim", "Entrants and the host claim their credit. The ledger page shows that the books balance."]].map(([t, d]) => (
            <Tilt key={t} className="card feature"><h3>{t}</h3><p>{d}</p></Tilt>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 28 }}><Button as={Link} to="/rounds" size="lg">Try it on Studionet</Button></p>
      </section>
    </>
  );
}
