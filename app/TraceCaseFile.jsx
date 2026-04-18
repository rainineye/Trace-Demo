import React, { useState, useMemo, useRef, useEffect } from "react";

// ============================================================================
// DATA
// ============================================================================

const TIMELINE = [
  { tag: "t0",  label: "Hersh",       date: "2023-02-08", desc: "Hersh report; WH denial", n_evidence: 2,
    distribution: {C1:0.10789,C2:0.10852,C3:0.10852,C4:0.10796,C5:0.10852,C6:0.10852,C_unknown:0.10852,C_insufficient:0.24153},
    raw_scores:  {C1:-0.0088,C2:0,C3:0,C4:-0.0079,C5:0,C6:0,C_unknown:0,C_insufficient:1.2} },
  { tag: "t1",  label: "NYT",         date: "2023-03-07", desc: "NYT pro-Ukrainian group", n_evidence: 3,
    distribution: {C1:0.10643,C2:0.11456,C3:0.11594,C4:0.10649,C5:0.10705,C6:0.10705,C_unknown:0.10705,C_insufficient:0.23542},
    raw_scores:  {C1:-0.0088,C2:0.1018,C3:0.1196,C4:-0.0079,C5:0,C6:0,C_unknown:0,C_insufficient:1.1821} },
  { tag: "t2",  label: "Andromeda",   date: "2023-04-15", desc: "Andromeda forensic; Kiesewetter skepticism", n_evidence: 5,
    distribution: {C1:0.08640,C2:0.13367,C3:0.14436,C4:0.10441,C5:0.10496,C6:0.10496,C_unknown:0.10496,C_insufficient:0.21629},
    raw_scores:  {C1:-0.2917,C2:0.3627,C3:0.4781,C4:-0.0079,C5:0,C6:0,C_unknown:0,C_insufficient:1.0846} },
  { tag: "t3",  label: "CIA leak",    date: "2023-06-01", desc: "WaPo leaked docs (CIA June warning)", n_evidence: 6,
    distribution: {C1:0.08385,C2:0.14228,C3:0.14591,C4:0.10132,C5:0.10186,C6:0.10186,C_unknown:0.10186,C_insufficient:0.22106},
    raw_scores:  {C1:-0.2917,C2:0.5013,C3:0.5391,C4:-0.0079,C5:0,C6:0,C_unknown:0,C_insufficient:1.1622} },
  { tag: "t4",  label: "Chervinsky",  date: "2023-11-01", desc: "Chervinsky named (WaPo + Spiegel)", n_evidence: 7,
    distribution: {C1:0.08326,C2:0.14472,C3:0.14821,C4:0.10061,C5:0.10114,C6:0.10114,C_unknown:0.10114,C_insufficient:0.21978},
    raw_scores:  {C1:-0.2917,C2:0.5375,C3:0.5733,C4:-0.0079,C5:0,C6:0,C_unknown:0,C_insufficient:1.1642} },
  { tag: "t5",  label: "SE / DK close", date: "2024-02-26", desc: "Sweden & Denmark close investigations", n_evidence: 9,
    distribution: {C1:0.07244,C2:0.12591,C3:0.12895,C4:0.08753,C5:0.08799,C6:0.08799,C_unknown:0.10989,C_insufficient:0.29929},
    raw_scores:  {C1:-0.2917,C2:0.5375,C3:0.5733,C4:-0.0079,C5:0,C6:0,C_unknown:0.3333,C_insufficient:1.8362} },
  { tag: "t6",  label: "Embassy car", date: "2024-07-17", desc: "Germany warrant; embassy car exit; Berlin refuses answer", n_evidence: 12,
    distribution: {C1:0.07812,C2:0.20698,C3:0.13598,C4:0.08870,C5:0.08962,C6:0.08962,C_unknown:0.10588,C_insufficient:0.20509},
    raw_scores:  {C1:-0.2060,C2:1.2555,C3:0.6253,C4:-0.0156,C5:0,C6:0,C_unknown:0.25,C_insufficient:1.2417} },
  { tag: "t7",  label: "Zaluzhnyi",   date: "2024-08-14", desc: "WSJ: Zaluzhnyi knowledge narrative", n_evidence: 13,
    distribution: {C1:0.07965,C2:0.22075,C3:0.13098,C4:0.09043,C5:0.09138,C6:0.09138,C_unknown:0.10657,C_insufficient:0.18886},
    raw_scores:  {C1:-0.2060,C2:1.3231,C3:0.5401,C4:-0.0156,C5:0,C6:0,C_unknown:0.2308,C_insufficient:1.089} },
  { tag: "t8",  label: "Kearsarge",   date: "2024-10-15", desc: "Kearsarge UUV capability reopening", n_evidence: 14,
    distribution: {C1:0.08454,C2:0.21998,C3:0.13052,C4:0.08961,C5:0.09106,C6:0.09106,C_unknown:0.10504,C_insufficient:0.18820},
    raw_scores:  {C1:-0.1115,C2:1.3231,C3:0.5401,C4:-0.0241,C5:0,C6:0,C_unknown:0.2143,C_insufficient:1.089} },
  { tag: "t9",  label: "IT arrest",   date: "2025-08-21", desc: "Serhii K. arrested in Italy", n_evidence: 15,
    distribution: {C1:0.07897,C2:0.25437,C3:0.14579,C4:0.08371,C5:0.08507,C6:0.08507,C_unknown:0.09720,C_insufficient:0.16982},
    raw_scores:  {C1:-0.1115,C2:1.6431,C3:0.8081,C4:-0.0241,C5:0,C6:0,C_unknown:0.2,C_insufficient:1.037} },
  { tag: "t10", label: "PL refuses",  date: "2025-10-17", desc: "Poland refuses extradition", n_evidence: 16,
    distribution: {C1:0.07978,C2:0.28741,C3:0.13667,C4:0.08456,C5:0.08593,C6:0.08593,C_unknown:0.09737,C_insufficient:0.14234},
    raw_scores:  {C1:-0.1115,C2:1.8111,C3:0.6961,C4:-0.0241,C5:0,C6:0,C_unknown:0.1875,C_insufficient:0.757} },
  { tag: "t11", label: "Today",       date: "2026-04-18", desc: "Present (today)", n_evidence: 16,
    distribution: {C1:0.07978,C2:0.28741,C3:0.13667,C4:0.08456,C5:0.08593,C6:0.08593,C_unknown:0.09737,C_insufficient:0.14234},
    raw_scores:  {C1:-0.1115,C2:1.8111,C3:0.6961,C4:-0.0241,C5:0,C6:0,C_unknown:0.1875,C_insufficient:0.757} },
];

const CANDIDATES = {
  C2: {label:"Ukrainian state-directed", tier:"T2", op:"covert"},
  C3: {label:"Ukrainian independent",    tier:"T3/T4", op:"direct"},
  C_insufficient:{label:"Evidence cannot distinguish", tier:"—", op:"—", meta:true},
  C_unknown:     {label:"Outside enumerated candidates", tier:"—", op:"—", meta:true},
  C1: {label:"US state",                 tier:"T1", op:"covert"},
  C4: {label:"Russian self-sabotage",    tier:"T1", op:"false_flag"},
  C5: {label:"UK state",                 tier:"T1", op:"covert"},
  C6: {label:"Other actor",              tier:"—",  op:"—"},
};

// Human-readable labels for UI surfaces. Technical codes (C1..C6) are preserved
// internally for evidence edges and spec references; CAND_READABLE is what
// readers see in the distribution panel, graph nodes, and understanding body.
const CAND_READABLE = {
  C2: "Ukraine — state-directed",
  C3: "Ukraine — independent",
  C1: "United States",
  C4: "Russia — self-sabotage",
  C5: "United Kingdom",
  C6: "Other actor",
  C_insufficient: "Inconclusive",
  C_unknown: "Outside candidate set",
};

const CAND_ORDER = ["C2","C3","C_insufficient","C_unknown","C1","C4","C5","C6"];

const EVIDENCE = [
  { id:"E1",  label:"Hersh Substack report",                published:"2023-02-08",
    source_type:"testimony", credibility:0.35, cluster:"single_source",
    edges:[{to:"C1",pol:+1,mod:"testimonial",s:0.29},{to:"C4",pol:-1,mod:"testimonial",s:0.15}],
    detail:"Seymour Hersh report alleging US Navy placed charges during BALTOPS 22. Single anonymous source. Neither corroborated nor technically refuted." },
  { id:"E2",  label:"White House denial",                   published:"2023-02-08",
    source_type:"official_statement", credibility:0.50, cluster:null,
    edges:[{to:"C1",pol:-1,mod:"testimonial",s:0.32}],
    detail:"Official US denial issued same day as Hersh publication. Weight bounded by obvious interest of issuing party." },
  { id:"E3",  label:"NYT pro-Ukrainian group report",       published:"2023-03-07",
    source_type:"testimony", credibility:0.55, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.55},{to:"C3",pol:+1,mod:"testimonial",s:0.60}],
    detail:"NYT attributes act to a pro-Ukrainian group, sourced to US officials familiar with intelligence. First major re-direction of attribution frame." },
  { id:"E6",  label:"Die Zeit / ARD / SZ: Andromeda forensic", published:"2023-04-01",
    source_type:"forensic", credibility:0.75, cluster:null,
    edges:[{to:"C1",pol:-1,mod:"correlational",s:0.50},{to:"C2",pol:+1,mod:"causal",s:0.70},{to:"C3",pol:+1,mod:"causal",s:0.80}],
    detail:"Yacht Andromeda linked forensically to dive operation. Strongest causal-modality evidence in dossier. Points to Ukrainian operators; cannot by itself distinguish state vs independent." },
  { id:"E7",  label:"Kiesewetter: 'evidence too thin'",     published:"2023-04-15",
    source_type:"derived_analysis", credibility:0.60, cluster:null,
    edges:[{to:"C2",pol:-1,mod:"correlational",s:0.20},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Bundestag intelligence committee member Kiesewetter challenges Andromeda narrative. Primarily a Layer-4 meta edge against E6." },
  { id:"E5",  label:"WaPo leaked docs / CIA June warning",  published:"2023-06-01",
    source_type:"documentary", credibility:0.70, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"correlational",s:0.55},{to:"C3",pol:+1,mod:"correlational",s:0.40}],
    detail:"Discord leaks reveal CIA warning Germany in June 2022 of Ukrainian plan. Supports Ukrainian attribution; ambiguous on state-direction." },
  { id:"E4",  label:"WaPo + Spiegel: Chervinsky named",     published:"2023-11-01",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.55},{to:"C3",pol:+1,mod:"testimonial",s:0.50}],
    detail:"Roman Chervinsky (Ukrainian colonel) named as coordinator. Ukraine denies. Increases specificity of Ukrainian attribution." },
  { id:"E8",  label:"Sweden closes investigation",          published:"2024-02-07",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Sweden's prosecution authority closes investigation without naming perpetrator, citing jurisdictional limits. v0.3 inconclusive pattern." },
  { id:"E9",  label:"Denmark closes investigation",         published:"2024-02-26",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Denmark follows Sweden. Two inconclusive-statement edges temporarily push C_insufficient to 30%." },
  { id:"E10", label:"Germany: EU arrest warrant, Volodymyr Z.", published:"2024-06-20",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.45},{to:"C3",pol:+1,mod:"causal",s:0.55}],
    detail:"German Federal Prosecutor issues EU arrest warrant for Ukrainian diver Volodymyr Z." },
  { id:"E12", label:"Z. exits Poland on embassy diplomatic plates", published:"2024-07-06",
    source_type:"open_source_intelligence", credibility:0.70, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.70},{to:"C3",pol:-1,mod:"causal",s:0.40}],
    detail:"Volodymyr Z. departs Poland in a vehicle carrying Ukrainian embassy diplomatic plates. Strongest single signal of state backing; largest single-step shift in C2 distribution." },
  { id:"E15", label:"Berlin refuses US-intel-involvement question", published:"2024-07-17",
    source_type:"official_statement", credibility:0.70, cluster:null,
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.175}],
    detail:"German government declines to confirm or deny US intelligence involvement in response to AfD question. Dual-frame divergence under v0.3 §2.4; strength halved." },
  { id:"E11", label:"WSJ: Zaluzhnyi knowledge narrative",   published:"2024-08-14",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.65},{to:"C3",pol:-1,mod:"testimonial",s:0.30}],
    detail:"WSJ: former Commander-in-Chief Zaluzhnyi had knowledge of plan. Pushes C2 up, C3 down — narrows state-direction hypothesis." },
  { id:"E16", label:"Weltwoche: USS Kearsarge UUV capability", published:"2024-10-15",
    source_type:"open_source_intelligence", credibility:0.45, cluster:null,
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.30}],
    detail:"Reopens technical feasibility of US-state hypothesis. Low credibility source; maintains C1 above shrinkage floor." },
  { id:"E13", label:"Italian arrest of Serhii K.",          published:"2025-08-21",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.55},{to:"C3",pol:+1,mod:"causal",s:0.50}],
    detail:"Italian authorities arrest alleged coordinator. Pushes both C2 and C3 up simultaneously; does not by itself adjudicate between them." },
  { id:"E14", label:"Poland refuses extradition",           published:"2025-10-17",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"correlational",s:0.30},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Polish government declines extradition request. Indirect political-protection signal favors state-direction over independent operation." },
];

const UNDERSTANDING = {
  t0:  { head:"A single anonymous allegation, and the denial it provoked.",
         body:"Only the Hersh allegation and its official denial are on the graph. Distribution is near-flat across enumerated candidates; C_insufficient dominates at 24%. Nothing has yet narrowed the space — this is the correct shape when a claim has entered Trace but no evidence-triangulation has begun." },
  t1:  { head:"Attention pivots from US to Ukrainian actors — still on single-sourced reporting.",
         body:"NYT's 'pro-Ukrainian group' framing introduces positive edges to both C2 and C3. They edge ahead of C1 for the first time, but all three live in the 10–12% band. Too early to distinguish state-directed from independent." },
  t2:  { head:"First physical-evidence lead — immediately contested by a senior intelligence reviewer.",
         body:"Andromeda forensic is the first causal (not merely testimonial) edge in the graph. C2 and C3 decouple from C1: 13–14% vs 9%. Kiesewetter skepticism clips the forensic's weight slightly. The Ukrainian-operator thesis has evidentiary weight; state-vs-independent remains undecided." },
  t3:  { head:"Three independent reports now point the same direction — all through leaked Western intelligence.",
         body:"CIA-June-warning leak supports Ukrainian attribution but joins the western_intel_leaks cluster with NYT. v0.3 cluster dampening prevents correlated sources from compounding; C2/C3 barely move despite one more evidence node." },
  t4:  { head:"A name surfaces — but from the same chain of leaks.",
         body:"Chervinsky named. Same cluster dampening applies. Distribution shape essentially unchanged from t3 — the graph correctly refuses to update aggressively on correlated reporting." },
  t5:  { head:"Two of the three investigating states close their files without naming anyone.",
         body:"Sweden and Denmark close their investigations without attribution. Under v0.3 inconclusive_statement pattern, both contribute positive edges to C_insufficient, which jumps to 30%. The graph reads this honestly as 'formal state apparatus has stopped trying to resolve this.'" },
  t6:  { head:"Germany identifies a suspect. That suspect leaves Europe under Ukrainian diplomatic protection.",
         body:"Germany issues warrant; Volodymyr Z. exits Poland in an embassy diplomatic-plate vehicle; Berlin refuses to answer on US involvement. The embassy car is a causal-modality edge strongly favoring C2 and negatively weighting C3. C2 jumps from 15% to 21% — the largest single-step change so far. C3 stalls." },
  t7:  { head:"For the first time, the reporting points to Ukrainian military command — not freelance operators.",
         body:"WSJ report of Zaluzhnyi knowledge. Direct positive edge to C2, direct negative edge to C3. For the first time the state-directed hypothesis clearly separates from the independent-operators hypothesis." },
  t8:  { head:"A thin counter-signal keeps the US-capability hypothesis technically alive.",
         body:"Weltwoche Kearsarge UUV story. Low credibility (0.45) but non-zero. Prevents C1 from collapsing to shrinkage floor. The distribution correctly keeps a live but low-weight US-state hypothesis." },
  t9:  { head:"A named coordinator is in custody — but no trial yet, and no statement from the accused.",
         body:"Serhii K. detained in Italy. Positive causal edge to C2 (0.55) and C3 (0.50). Ambiguous on the state-vs-independent axis but strengthens Ukrainian attribution overall. C2 rises to 25%." },
  t10: { head:"A NATO ally refuses extradition of the accused — political protection, inferred rather than proven.",
         body:"Poland refuses extradition. Correlational signal of political protection; under CMEG dynamics, pushes C2 up and C3 down. C2 reaches 28.7% — the highest weighting to date. Still far below the 85% promotion threshold." },
  t11: { head:"Ukrainian state-direction is the strongest single hypothesis — and no investigating state has officially said so.",
         body:"C2 at 28.7% is the highest-weighted candidate but sits far below T_promote (0.85). Five of R5's promotion gates fail simultaneously: max weight, residual weight, open challenge window, C_insufficient above 5%, and no external empirical anchor for any T1/T2 candidate. The protocol reports this state transparently rather than forcing a binary verdict — which is, structurally, the point." },
};

const CLAIM_TITLE = "Who bombed the Nord Stream?";
const CLAIM_META  = "Form 2 · contested attribution · adjudication_mode = distributional";

// ============================================================================
// STYLING TOKENS
// ============================================================================

const colors = {
  paper:      "#FAF8F3",
  paperDeep:  "#F2EEE4",
  paperGlass: "rgba(250, 248, 243, 0.88)",
  ink:        "#1A1A1A",
  inkSoft:    "#4A4A4A",
  inkMute:    "#8A8A8A",
  rule:       "#D9D4C7",
  ruleSoft:   "#E8E4D8",
  primary:    "#A03A2C",
  primarySoft:"#C87769",
  secondary:  "#1C3A5E",
  secondarySoft:"#6B8AAE",
  warn:       "#B8902E",
  muted:      "#B7B0A0",
};

// ============================================================================
// UTILITIES
// ============================================================================

function Rule({ className = "" }) {
  return <div className={className} style={{ height: 1, background: colors.rule }} />;
}

function Tag({ children, tone = "default" }) {
  const tones = {
    default: { bg: colors.paperDeep, fg: colors.inkSoft, bd: colors.rule },
    primary: { bg: "#F4E4E0", fg: colors.primary, bd: colors.primarySoft },
    secondary:{ bg: "#E4ECF4", fg: colors.secondary, bd: colors.secondarySoft },
    mute:    { bg: "transparent", fg: colors.inkMute, bd: colors.rule },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 2,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      display:"inline-block",
    }}>{children}</span>
  );
}

function candColor(c) {
  if (c === "C2") return colors.primary;
  if (c === "C3") return colors.secondary;
  if (c === "C_insufficient") return "#7A7A7A";
  if (c === "C_unknown") return "#A89F8A";
  if (c === "C1") return "#5A5A5A";
  return "#CEC7B5";
}

// Minimalist visual identifier for each candidate. Country flags rendered as
// simplified rectangles; meta-candidates use an abstract geometric mark.
// Returns an SVG element sized w x h; works inside both HTML and SVG contexts.
function CandIcon({ cand, w = 16, h = 11 }) {
  const strokeColor = "rgba(26, 26, 26, 0.25)";
  const strokeWidth = 0.6;

  switch (cand) {
    case "C1": // United States — simplified: red/white stripes + blue canton
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#FAF8F3"/>
          {[1, 3, 5, 7, 9].map((y, i) => (
            <rect key={i} x="0" y={y} width="16" height="1" fill="#B22234"/>
          ))}
          <rect x="0" y="0" width="7" height="6" fill="#3C3B6E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C2": // Ukraine — state-directed
    case "C3": // Ukraine — independent
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="5.5" fill="#0057B7"/>
          <rect x="0" y="5.5" width="16" height="5.5" fill="#FFD700"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C4": // Russia — white/blue/red horizontal
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="3.67" fill="#FAF8F3"/>
          <rect x="0" y="3.67" width="16" height="3.67" fill="#0039A6"/>
          <rect x="0" y="7.33" width="16" height="3.67" fill="#D52B1E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C5": // United Kingdom — simplified union jack
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#012169"/>
          <path d="M0,0 L16,11 M16,0 L0,11" stroke="#FAF8F3" strokeWidth="1.5"/>
          <path d="M0,0 L16,11 M16,0 L0,11" stroke="#C8102E" strokeWidth="0.9"/>
          <path d="M8,0 L8,11 M0,5.5 L16,5.5" stroke="#FAF8F3" strokeWidth="2.5"/>
          <path d="M8,0 L8,11 M0,5.5 L16,5.5" stroke="#C8102E" strokeWidth="1.2"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C6": // Other actor — abstract dot
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <circle cx="8" cy="5.5" r="2.2" fill="none" stroke={colors.inkMute} strokeWidth="1"/>
          <circle cx="8" cy="5.5" r="0.6" fill={colors.inkMute}/>
        </svg>
      );
    case "C_unknown": // Outside candidate set — question mark
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <text x="8" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
                fontSize="9" fontWeight="600" fill={colors.inkMute}>?</text>
        </svg>
      );
    case "C_insufficient": // Inconclusive — em-dash
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <line x1="3" y1="5.5" x2="13" y2="5.5" stroke={colors.inkMute} strokeWidth="1.3"/>
        </svg>
      );
    default:
      return <svg width={w} height={h} style={{ flexShrink: 0 }} />;
  }
}

// ============================================================================
// FULLSCREEN GRAPH
// ============================================================================

function FullscreenGraph({
  activeEvidence, distribution,
  selectedEv, setSelectedEv,
  hoverCand, setHoverCand,
  hoverEv, setHoverEv,
  width, height,
  playing,
}) {
  const LEFT_X = width * 0.22;
  // When playing, pull candidates leftward so the right-side panel doesn't sit on top of them
  const RIGHT_X = playing ? width * 0.62 : width * 0.75;
  const TOP = height * 0.09;
  const BOT = height * 0.86;

  // Accurate text measurement — Instrument Sans is proportional, so character-count
  // estimates produce inconsistent spacing. Use an offscreen canvas to measure real px.
  const measureText = useMemo(() => {
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const cache = new Map();
    return (text, fontSize, fontFamily = "Instrument Sans, sans-serif", fontWeight = 400) => {
      if (!ctx) return text.length * 6.8 + 4; // SSR fallback
      const key = `${fontWeight}|${fontSize}|${fontFamily}|${text}`;
      if (cache.has(key)) return cache.get(key);
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const w = ctx.measureText(text).width;
      cache.set(key, w);
      return w;
    };
  }, []);

  const candsSorted = [...CAND_ORDER].sort((a,b)=> (distribution[b]||0) - (distribution[a]||0));
  const candY = {};
  candsSorted.forEach((c,i)=>{
    candY[c] = TOP + (BOT - TOP) * (i / (candsSorted.length - 1));
  });

  const evs = activeEvidence;
  const evY = {};
  if (evs.length > 0) {
    evs.forEach((e,i)=>{
      evY[e.id] = TOP + (BOT - TOP) * (i / Math.max(1, evs.length - 1));
    });
  }

  const selectedEvObj = EVIDENCE.find(e=>e.id===selectedEv);
  const selectedSupports = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)>0).map(e=>e.to)) : null;
  const selectedOpposes  = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)<0).map(e=>e.to)) : null;
  const focusEv = selectedEv || hoverEv;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width:"100%", height:"100%", display:"block" }}>
      {/* Column headers */}
      <text x={LEFT_X} y={height * 0.055}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11"
            letterSpacing="1.4"
            fill={colors.inkMute}
            textAnchor="start">
        EVIDENCE · {evs.length} ADMITTED
      </text>

      {/* Evidence dots (before edges so lines visually emerge from them) */}
      {evs.map((ev) => {
        const y = evY[ev.id];
        const isSel = selectedEv === ev.id;
        const isHov = hoverEv === ev.id;
        const isFocusByEv = focusEv === ev.id;
        const isFocusByCand = hoverCand && ev.edges.some(e => e.to === hoverCand);
        const isFocus = isFocusByEv || isFocusByCand;
        const anyFocus = focusEv || hoverCand;
        const dim = anyFocus && !isFocus;
        const cluster = ev.cluster === "western_intel_leaks";
        return (
          <g key={`ev-dot-${ev.id}`}
             style={{ opacity: dim ? 0.3 : 1, transition:"opacity 0.3s" }}>
            {cluster && (
              <circle cx={LEFT_X} cy={y} r={12}
                      fill="none" stroke={colors.warn}
                      strokeWidth="0.9" strokeDasharray="2,2"
                      opacity={0.7}/>
            )}
            <circle cx={LEFT_X} cy={y}
                    r={isSel ? 8 : isHov ? 7 : 5}
                    fill={isSel ? colors.ink : colors.paper}
                    stroke={colors.ink}
                    strokeWidth={isFocus ? 2 : 1}
                    style={{ transition:"all 0.2s" }}/>
          </g>
        );
      })}

      {/* Edges — each edge starts at its own evidence label's right edge + a small
          consistent padding. Uses accurate canvas-measured width of Instrument Sans
          (proportional font) so the spacing reads uniform regardless of label content. */}
      {evs.map((ev) => {
        const labelText = ev.label.length > 44 ? ev.label.slice(0,42)+"…" : ev.label;
        const mainLabelWidth = measureText(labelText, 13, "Instrument Sans, sans-serif", 400);
        const edgeStartX = LEFT_X + 18 + mainLabelWidth + 12;
        return ev.edges.map((edge, i) => {
          if (!(edge.to in candY)) return null;
          const y1 = evY[ev.id], y2 = candY[edge.to];
          const x1 = edgeStartX, x2 = RIGHT_X;
          const pol = edge.pol || 0;
          const isFocusEv = focusEv === ev.id;
          const isHoverCand = hoverCand === edge.to;
          const anyFocus = focusEv || hoverCand;
          const inFocus = isFocusEv || isHoverCand;
          const dim = anyFocus && !inFocus;

          let stroke = colors.inkMute, strokeW = 0.7, dash = "";
          if (pol > 0) {
            stroke = edge.to === "C2" ? colors.primary
                   : edge.to === "C3" ? colors.secondary
                   : colors.ink;
            strokeW = 0.8 + edge.s * 2.4;
            dash = "";
          } else if (pol < 0) {
            stroke = colors.inkMute;
            strokeW = 0.6 + edge.s * 1.6;
            dash = "3,3";
          }

          const dx = x2 - x1;
          const cx1 = x1 + dx * 0.38;
          const cx2 = x2 - dx * 0.38;
          const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
          return (
            <path key={`${ev.id}-${i}`} d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={inFocus ? strokeW + 1.2 : strokeW}
              strokeDasharray={dash}
              opacity={dim ? 0.08 : (inFocus ? 0.95 : 0.42)}
              style={{ transition:"opacity 0.3s, stroke-width 0.2s" }}
            />
          );
        });
      })}

      {/* Evidence labels (after edges, always on top; also the hit-target group for hover/click) */}
      {evs.map((ev) => {
        const y = evY[ev.id];
        const isSel = selectedEv === ev.id;
        // Evidence can be focused either via hoverEv/selectedEv (its own focus)
        // or via hoverCand (reverse-trace: evidence supports the hovered candidate)
        const isFocusByEv = focusEv === ev.id;
        const isFocusByCand = hoverCand && ev.edges.some(e => e.to === hoverCand);
        const isFocus = isFocusByEv || isFocusByCand;
        const anyFocus = focusEv || hoverCand;
        const dim = anyFocus && !isFocus;
        const labelText = ev.label.length > 44 ? ev.label.slice(0,42)+"…" : ev.label;
        const metaText = `${ev.published} · cred ${ev.credibility.toFixed(2)}`;
        // Accurate measured widths for halo backgrounds (focus font size = 14)
        const evIdWidth = measureText(ev.id, 12, "JetBrains Mono, monospace", 600) + 6;
        const mainLabelWidth = measureText(labelText, 14, "Instrument Sans, sans-serif", 500) + 8;
        const metaLabelWidth = measureText(metaText, 10, "JetBrains Mono, monospace", 400) + 6;
        return (
          <g key={`ev-label-${ev.id}`}
             onMouseEnter={()=>setHoverEv(ev.id)}
             onMouseLeave={()=>setHoverEv(null)}
             onMouseDown={(e)=>{ e.stopPropagation(); setSelectedEv(isSel ? null : ev.id); }}
             style={{ cursor:"pointer", opacity: dim ? 0.4 : 1, transition:"opacity 0.3s" }}>
            {/* Evidence ID (e.g. "E12") — halo only when focused */}
            {isFocus && (
              <rect x={LEFT_X - 20 - evIdWidth} y={y - 8}
                    width={evIdWidth} height={16}
                    fill={colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X - 20} y={y + 4}
                  textAnchor="end"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize={isFocus ? 12 : 11}
                  fill={isFocus ? colors.ink : colors.inkSoft}
                  fontWeight={isFocus ? 600 : 400}
                  letterSpacing="0.3"
                  style={{ transition:"all 0.15s" }}>{ev.id}</text>
            {/* Main label — halo only when focused */}
            {isFocus && (
              <rect x={LEFT_X + 14} y={y - 9}
                    width={mainLabelWidth} height={18}
                    fill={colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X + 18} y={y + 4}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={isFocus ? 14 : 13}
                  fill={isFocus ? colors.ink : colors.inkSoft}
                  fontWeight={isFocus ? 500 : 400}
                  style={{ transition:"all 0.15s" }}>
              {labelText}
            </text>
            {/* Meta (date + credibility) — halo only when focused */}
            {isFocus && (
              <rect x={LEFT_X + 14} y={y + 9}
                    width={metaLabelWidth} height={13}
                    fill={colors.paper} opacity={0.9}/>
            )}
            <text x={LEFT_X + 18} y={y + 19}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="10"
                  fill={colors.inkMute}
                  letterSpacing="0.3"
                  opacity={isFocus ? 1 : 0.75}>
              {ev.published} · cred {ev.credibility.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Candidate nodes (circles, then labels on top) */}
      {candsSorted.map((c) => {
        const y = candY[c];
        const v = distribution[c] || 0;
        const isHover = hoverCand === c;
        const isSupported = selectedSupports?.has(c);
        const isOpposed   = selectedOpposes?.has(c);
        const cc = candColor(c);
        const fill = isSupported ? cc : colors.paper;
        const radius = 6 + v * Math.min(width, height) * 0.05;
        const dim = (focusEv && !isSupported && !isOpposed)
                 || (hoverCand && hoverCand !== c);
        const candText = CAND_READABLE[c] || CANDIDATES[c].label;
        const pctText = `${(v*100).toFixed(1)}%`;

        return (
          <g key={c}
             onMouseEnter={()=>setHoverCand(c)}
             onMouseLeave={()=>setHoverCand(null)}
             style={{ cursor:"default", opacity: dim ? 0.35 : 1, transition:"opacity 0.3s" }}>
            <circle cx={RIGHT_X} cy={y} r={radius}
                    fill={fill}
                    stroke={cc}
                    strokeWidth={isHover ? 2.4 : 1.2}
                    strokeDasharray={isOpposed ? "3,2" : ""}
                    opacity={isHover ? 1 : 0.92}
                    style={{ transition:"all 0.4s cubic-bezier(.2,.7,.2,1)" }}/>
            {/* Flag/icon positioned just before the C-code label */}
            <g transform={`translate(${RIGHT_X + radius + 14}, ${y - 14})`}>
              <CandIcon cand={c} w={16} h={11} />
            </g>
            <text x={RIGHT_X + radius + 14 + 22} y={y - 5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="11"
                  fill={colors.inkSoft}
                  letterSpacing="0.6">{c}</text>
            <text x={RIGHT_X + radius + 14} y={y + 12}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={v > 0.15 ? 15 : 13.5}
                  fill={colors.ink}
                  fontWeight={v > 0.15 ? 500 : 400}>
              {candText}
            </text>
            <text x={RIGHT_X + radius + 14} y={y + 30}
                  fontFamily="'Fraunces', serif"
                  fontSize="17"
                  fontStyle="italic"
                  fill={cc}
                  fontVariantNumeric="tabular-nums">
              {pctText}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// OVERLAY TIMELINE
// ============================================================================

function TimelineBar({ idx, setIdx }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hoverTick, setHoverTick] = useState(null);

  const onMove = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    const frac = x / r.width;
    const n = Math.round(frac * (TIMELINE.length - 1));
    setIdx(n);
  };
  useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    const mv = (e) => onMove(e.clientX);
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  const pct = (idx / (TIMELINE.length - 1)) * 100;
  const hoverTP = hoverTick != null ? TIMELINE[hoverTick] : null;
  const hoverPct = hoverTick != null ? (hoverTick / (TIMELINE.length - 1)) * 100 : null;

  return (
    <div
      ref={trackRef}
      onMouseDown={(e)=>{ setDragging(true); onMove(e.clientX); }}
      style={{
        position:"relative", height: 42, cursor:"pointer",
        width:"100%", userSelect:"none",
      }}
    >
      <div style={{ position:"absolute", top: 21, left: 0, right: 0, height: 1, background: colors.rule }} />
      <div style={{
        position:"absolute", top: 21, left: 0, width: `${pct}%`, height: 1,
        background: colors.ink, transition: dragging ? "none" : "width 0.4s",
      }} />
      {TIMELINE.map((t, i) => {
        const x = (i / (TIMELINE.length - 1)) * 100;
        const active = i <= idx;
        const current = i === idx;
        return (
          <div key={t.tag}
               onMouseEnter={()=>setHoverTick(i)}
               onMouseLeave={()=>setHoverTick(null)}
               onMouseDown={(e)=>{ e.stopPropagation(); setIdx(i); }}
               style={{
                 position:"absolute", left: `${x}%`, top: 0, height: 42,
                 transform:"translateX(-50%)", cursor:"pointer",
                 display:"flex", flexDirection:"column", alignItems:"center",
               }}>
            <div style={{
              fontFamily:"'Instrument Sans', sans-serif",
              fontSize: current ? 11.5 : 10.5,
              color: current ? colors.primary
                    : hoverTick === i ? colors.ink
                    : (active ? colors.inkSoft : colors.muted),
              letterSpacing: 0.1,
              marginBottom: 8,
              fontWeight: (current || hoverTick === i) ? 600 : 400,
              whiteSpace: "nowrap",
              transition:"all 0.15s",
              lineHeight: 1,
            }}>{t.label}</div>
            <div style={{
              width: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
              height: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
              borderRadius: "50%",
              background: current ? colors.primary : (active ? colors.ink : colors.muted),
              border: current ? `2px solid ${colors.paper}` : "none",
              boxShadow: current ? `0 0 0 1px ${colors.primary}` : "none",
              marginTop: current ? -2 : 0,
              transition:"all 0.15s",
            }} />
            {/* date label under dot, only for current */}
            {current && (
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.primary, letterSpacing: 0.4,
                marginTop: 4, whiteSpace:"nowrap",
                fontWeight: 500,
                lineHeight: 1,
              }}>
                {t.date}
              </div>
            )}
          </div>
        );
      })}

      {/* Hover tooltip — shows full event description above the hovered tick */}
      {hoverTP && hoverTick !== idx && (
        <div style={{
          position:"absolute",
          left: `${hoverPct}%`,
          bottom: "calc(100% + 10px)",
          transform: hoverPct > 88 ? "translateX(-88%)"
                   : hoverPct < 12 ? "translateX(-12%)"
                   : "translateX(-50%)",
          zIndex: 20, pointerEvents:"none",
          maxWidth: 280,
          padding: "7px 12px",
          background: "rgba(250, 248, 243, 0.88)",
          backdropFilter:"blur(18px) saturate(160%)",
          WebkitBackdropFilter:"blur(18px) saturate(160%)",
          border: `1px solid rgba(217, 212, 199, 0.9)`,
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(26, 26, 26, 0.08), 0 2px 6px rgba(26, 26, 26, 0.04)",
          animation: "fadeIn 0.15s ease-out",
        }}>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
            color: colors.ink, lineHeight: 1.4, fontWeight: 400,
          }}>
            {hoverTP.desc}
          </div>
          {/* tooltip pointer — points down to the tick node below */}
          <div style={{
            position:"absolute", top:"100%",
            left: hoverPct > 88 ? "88%" : hoverPct < 12 ? "12%" : "50%",
            transform:"translateX(-50%)",
            width: 0, height: 0,
            borderLeft:"5px solid transparent",
            borderRight:"5px solid transparent",
            borderTop:"5px solid rgba(217, 212, 199, 0.9)",
          }}/>
          <div style={{
            position:"absolute", top:"100%",
            left: hoverPct > 88 ? "88%" : hoverPct < 12 ? "12%" : "50%",
            transform:"translateX(-50%) translateY(-1px)",
            width: 0, height: 0,
            borderLeft:"4px solid transparent",
            borderRight:"4px solid transparent",
            borderTop:"4px solid rgba(250, 248, 243, 0.88)",
          }}/>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DISTRIBUTION OVERLAY (glass panel, bottom-right of graph area)
// ============================================================================

// ============================================================================
// DISTRIBUTION OVERLAY (draggable, translucent, with understanding head)
// ============================================================================

function DistributionOverlay({ distribution, hoverCand, setHoverCand, idx, playing, onPlayToggle }) {
  const ordered = CAND_ORDER.map(k => ({ k, v: distribution[k] || 0 }));
  const tp = TIMELINE[idx];
  const u = UNDERSTANDING[tp.tag] || { head: "—" };

  // Drag state
  const [pos, setPos] = useState({ top: 20, right: 20, left: null });
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startTop: 0, startLeft: 0 });

  const onHeaderMouseDown = (e) => {
    e.preventDefault();
    // e.currentTarget is the panel itself (handler moved from header to outer container)
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    dragStart.current = {
      x: e.clientX, y: e.clientY,
      startLeft: rect.left - parentRect.left,
      startTop: rect.top - parentRect.top,
    };
    setPos({ top: rect.top - parentRect.top, left: rect.left - parentRect.left, right: null });
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const mv = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPos(p => ({
        top: Math.max(4, dragStart.current.startTop + dy),
        left: Math.max(4, dragStart.current.startLeft + dx),
        right: null,
      }));
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  const positionStyle = pos.right != null
    ? { top: pos.top, right: pos.right }
    : { top: pos.top, left: pos.left };

  return (
    <div
      onMouseDown={onHeaderMouseDown}
      style={{
        position:"absolute", ...positionStyle, zIndex: 8,
        background: "rgba(250, 248, 243, 0.55)",
        backdropFilter:"blur(18px) saturate(140%)",
        WebkitBackdropFilter:"blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.8)`, borderRadius: 3,
        width: 300,
        boxShadow: dragging
          ? "0 16px 40px rgba(26,26,26,0.10), 0 3px 8px rgba(26,26,26,0.05)"
          : "0 12px 32px rgba(26,26,26,0.06), 0 2px 6px rgba(26,26,26,0.03)",
        transition: dragging ? "none" : "box-shadow 0.2s",
        userSelect: dragging ? "none" : "auto",
        cursor: dragging ? "grabbing" : "grab",
    }}>
      {/* Header row */}
      <div style={{
        padding: "9px 14px 8px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        gap: 8,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
            lineHeight: 1,
          }}>
            Current Understanding
          </div>
          {/* Play / pause — square CTA right next to the title */}
          {onPlayToggle && (
            <button
              onMouseDown={(e)=>{ e.stopPropagation(); }}
              onClick={(e)=>{ e.stopPropagation(); onPlayToggle(); }}
              style={{
                width: 20, height: 20, borderRadius: 3,
                border: playing ? `1px solid ${colors.ink}` : `1px solid ${colors.rule}`,
                background: playing ? colors.ink : "transparent",
                cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s",
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e)=>{
                if (!playing) {
                  e.currentTarget.style.background = colors.paperDeep;
                  e.currentTarget.style.borderColor = colors.inkSoft;
                }
              }}
              onMouseLeave={(e)=>{
                if (!playing) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = colors.rule;
                }
              }}
              aria-label={playing ? "Pause timeline" : "Play timeline"}
              title={playing ? "Pause timeline" : "Play timeline"}
            >
              {playing ? (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <rect x="1" y="1" width="2" height="7" fill={colors.paper}/>
                  <rect x="5" y="1" width="2" height="7" fill={colors.paper}/>
                </svg>
              ) : (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <path d="M1.5 1 L7 4.5 L1.5 8 Z" fill={colors.inkSoft}/>
                </svg>
              )}
            </button>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 10.5,
            color: colors.primary, letterSpacing: 0.2,
            fontWeight: 500,
          }}>
            {tp.label}
          </div>
          {/* collapse toggle */}
          <button
            onMouseDown={(e)=>{ e.stopPropagation(); }}
            onClick={(e)=>{ e.stopPropagation(); setCollapsed(!collapsed); }}
            style={{
              background:"transparent", border:"none", padding: 2,
              cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              opacity: 0.6,
              transition:"opacity 0.15s, transform 0.2s",
              transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
            onMouseEnter={(e)=>{ e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.opacity = 0.6; }}
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke={colors.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Understanding head — always visible, even when collapsed */}
      <div style={{
        padding: collapsed ? "12px 14px 12px" : "14px 14px 14px",
        fontFamily:"'Fraunces', serif",
        fontSize: 15.5, lineHeight: 1.25,
        color: colors.ink, letterSpacing: -0.1,
        fontStyle:"italic",
        borderTop: `1px solid ${colors.ruleSoft}`,
        borderBottom: collapsed ? "none" : `1px solid ${colors.ruleSoft}`,
      }}>
        {u.head}
      </div>

      {/* Distribution & candidates (hidden when collapsed) */}
      {!collapsed && (
        <div style={{ padding: "12px 14px 12px" }}>
          {/* Distribution bar */}
          <div style={{ display:"flex", height: 7, borderRadius: 1, overflow:"hidden", marginBottom: 12, background: "rgba(242, 238, 228, 0.6)" }}>
            {ordered.map(({k, v}) => (
              <div key={k}
                   onMouseEnter={()=>setHoverCand(k)}
                   onMouseLeave={()=>setHoverCand(null)}
                   style={{
                     width: `${v*100}%`,
                     background: candColor(k),
                     opacity: hoverCand && hoverCand !== k ? 0.25 : 1,
                     borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
                     transition:"width 0.5s cubic-bezier(.2,.7,.2,1), opacity 0.2s",
                   }}/>
            ))}
          </div>

          {/* Top candidates — human-readable labels only, no C-codes */}
          <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
            {ordered.slice(0, 4).map(({k, v}) => (
              <div key={k}
                   onMouseEnter={()=>setHoverCand(k)}
                   onMouseLeave={()=>setHoverCand(null)}
                   style={{
                     display:"grid", gridTemplateColumns: "9px 16px 1fr auto", gap: 10,
                     alignItems:"center", cursor:"default",
                     opacity: hoverCand && hoverCand !== k ? 0.4 : 1, transition:"opacity 0.2s",
                   }}>
                <div style={{ width: 7, height: 7, background: candColor(k) }}/>
                <CandIcon cand={k} w={16} h={11} />
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                  color: colors.ink, fontWeight: k === "C2" ? 500 : 400,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                }}>
                  {CAND_READABLE[k]}
                </div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 14.5, fontStyle:"italic",
                  color: k === "C2" ? colors.primary : colors.ink,
                  fontVariantNumeric:"tabular-nums",
                }}>
                  {(v*100).toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55, marginLeft: 1 }}>%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EVIDENCE DRAWER (slides from right)
// ============================================================================

function EvidenceDrawer({ ev, onClose }) {
  if (!ev) return null;

  // Find cluster siblings
  const clusterLabels = {
    western_intel_leaks: "Western intelligence leaks",
    single_source: "Single-source claim",
  };
  const clusterExplanations = {
    western_intel_leaks: "Reports from multiple Western outlets (NYT, WaPo, WSJ, Spiegel) citing anonymous officials \"familiar with intelligence.\" Likely share a common origin in a single intelligence ecosystem — so Trace treats them as correlated, not independent. Their combined weight is dampened to prevent double-counting the same story retold.",
    single_source: "An allegation resting on a single anonymous source, not corroborated by any independent reporting.",
  };
  const siblings = ev.cluster
    ? EVIDENCE.filter(e => e.cluster === ev.cluster && e.id !== ev.id)
    : [];
  const clusterLabel = ev.cluster ? (clusterLabels[ev.cluster] || ev.cluster) : null;
  const clusterExplain = ev.cluster ? clusterExplanations[ev.cluster] : null;

  return (
    <div style={{
      position:"absolute", top: 0, right: 0, bottom: 0,
      width: 440, maxWidth: "44vw",
      background: colors.paper,
      borderLeft: `1px solid ${colors.rule}`,
      boxShadow: "-20px 0 48px rgba(26,26,26,0.05)",
      padding: "48px 36px 40px",
      overflowY:"auto", zIndex: 20,
      animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)",
    }}>
      <button onClick={onClose}
        style={{ position:"absolute", top: 48, right: 36, background:"transparent", border:"none",
                 fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute,
                 letterSpacing: 0.8, cursor:"pointer", textTransform:"uppercase",
                 padding: "4px 6px" }}>close ×</button>

      <div style={{ display:"flex", alignItems:"baseline", gap: 10 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 14, color: colors.ink, fontWeight: 600 }}>{ev.id}</div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute, letterSpacing: 0.5 }}>{ev.published}</div>
      </div>
      <div style={{ fontFamily:"'Fraunces', serif", fontSize: 26, lineHeight: 1.2, color: colors.ink, marginTop: 8, letterSpacing: -0.3 }}>
        {ev.label}
      </div>

      <div style={{ marginTop: 18, display:"flex", gap: 6, flexWrap:"wrap" }}>
        <Tag tone="default">{ev.source_type}</Tag>
        <Tag tone="mute">credibility {ev.credibility.toFixed(2)}</Tag>
      </div>

      <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: colors.inkSoft, marginTop: 22 }}>
        {ev.detail}
      </div>

      {/* CLUSTER section — only when this evidence belongs to a cluster */}
      {ev.cluster && (
        <div style={{
          marginTop: 26, padding: "16px 18px",
          background: colors.paperDeep,
          border: `1px solid ${colors.ruleSoft}`,
          borderLeft: `3px solid ${colors.warn}`,
          borderRadius: 2,
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap: 8, marginBottom: 10,
          }}>
            {/* Dashed ring matching the graph's cluster marker */}
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="5.5" fill="none" stroke={colors.warn}
                      strokeWidth="1" strokeDasharray="2,2"/>
            </svg>
            <div style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            }}>
              Correlated source cluster
            </div>
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
            color: colors.ink, marginBottom: 10, lineHeight: 1.3,
            letterSpacing: -0.1,
          }}>
            {clusterLabel}
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: colors.inkSoft, lineHeight: 1.55, marginBottom: siblings.length > 0 ? 14 : 0,
          }}>
            {clusterExplain}
          </div>

          {siblings.length > 0 && (
            <>
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.inkMute, letterSpacing: 0.6, textTransform:"uppercase",
                marginBottom: 6,
              }}>
                Others in this cluster ({siblings.length})
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap: 4 }}>
                {siblings.map((s) => (
                  <div key={s.id} style={{
                    display:"grid", gridTemplateColumns:"32px 1fr 70px",
                    gap: 8, alignItems:"baseline",
                    fontSize: 11.5,
                  }}>
                    <span style={{
                      fontFamily:"'JetBrains Mono', monospace",
                      color: colors.inkMute, letterSpacing: 0.3,
                    }}>{s.id}</span>
                    <span style={{
                      fontFamily:"'Instrument Sans', sans-serif",
                      color: colors.ink,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                    }}>{s.label}</span>
                    <span style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: colors.inkMute, textAlign:"right",
                    }}>{s.published}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 12 }}>
          Edges · {ev.edges.length}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 8 }}>
          {ev.edges.map((e,i)=> {
            const polSym = e.pol > 0 ? "+" : e.pol < 0 ? "−" : "0";
            const polColor = e.pol > 0
              ? (e.to === "C2" ? colors.primary : (e.to === "C3" ? colors.secondary : colors.ink))
              : (e.pol < 0 ? colors.inkMute : colors.muted);
            return (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"22px 56px 1fr 50px",
                alignItems:"center", gap: 10,
                padding:"8px 0", borderBottom:`1px solid ${colors.ruleSoft}`,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
              }}>
                <span style={{ color: polColor, fontSize: 17, fontWeight: 700 }}>{polSym}</span>
                <span style={{ color: colors.inkSoft }}>{e.to}</span>
                <div>
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5, color: colors.ink, lineHeight: 1.3 }}>
                    {CAND_READABLE[e.to] || CANDIDATES[e.to]?.label}
                  </div>
                  <div style={{ color: colors.inkMute, fontSize: 9.5, marginTop: 2, letterSpacing: 0.3 }}>{e.mod}</div>
                </div>
                <span style={{ color: colors.ink, textAlign:"right", fontVariantNumeric:"tabular-nums",
                               fontFamily:"'Fraunces', serif", fontSize: 14, fontStyle:"italic" }}>{e.s.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MASTHEAD + TIMELINE OVERLAY
// ============================================================================

function Masthead({ activeEvidenceCount, currentLabel, currentDate, isFullscreen, onToggleFullscreen }) {
  return (
    <div style={{
      borderBottom: `1px solid ${colors.rule}`,
      background: colors.paper,
      padding: "18px 32px 22px",
    }}>
      {/* Top row: Trace + meta on left, fullscreen button on right */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap: 24, flexWrap:"wrap",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap: 18, flexWrap:"wrap" }}>
          <div style={{
            fontFamily:"'Fraunces', serif", fontWeight: 600, fontSize: 22,
            letterSpacing: -0.3, color: colors.ink,
            lineHeight: 1,
          }}>Trace</div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
            lineHeight: 1,
          }}>
            Case file 001 · v0.3 · {activeEvidenceCount}/16
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
            color: colors.inkSoft, letterSpacing: 0.1,
            lineHeight: 1,
            fontWeight: 500,
          }}>
            {currentLabel}
          </div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.6,
            lineHeight: 1,
          }}>
            {currentDate}
          </div>
        </div>

        <button onClick={onToggleFullscreen}
          style={{
            background: isFullscreen ? colors.ink : "transparent",
            color: isFullscreen ? colors.paper : colors.inkSoft,
            border: `1px solid ${isFullscreen ? colors.ink : colors.rule}`,
            padding: "6px 11px", borderRadius: 2,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: 1, textTransform: "uppercase",
            cursor: "pointer",
            display:"flex", alignItems:"center", gap: 7,
            transition: "all 0.2s",
            flexShrink: 0,
            whiteSpace:"nowrap",
          }}
          onMouseEnter={(e)=>{
            if (!isFullscreen) {
              e.currentTarget.style.color = colors.ink;
              e.currentTarget.style.borderColor = colors.ink;
            }
          }}
          onMouseLeave={(e)=>{
            if (!isFullscreen) {
              e.currentTarget.style.color = colors.inkSoft;
              e.currentTarget.style.borderColor = colors.rule;
            }
          }}
        >
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
            <path d={isFullscreen
              ? "M1 4 L1 1 L4 1 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"
              : "M4 1 L1 1 L1 4 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"}
              stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {isFullscreen ? "exit" : "fullscreen"}
        </button>
      </div>

      {/* Bottom row: claim title with editorial decoration */}
      <div style={{ marginTop: 18, display:"flex", alignItems:"stretch", gap: 14 }}>
        {/* accent bar — editorial pull-quote marker, stretches full height of eyebrow + title */}
        <div style={{
          width: 3,
          background: colors.primary,
          flexShrink: 0,
        }}/>
        <div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.primary, letterSpacing: 1.4,
            textTransform:"uppercase", fontWeight: 500,
            marginBottom: 6,
          }}>
            Under investigation
          </div>
          <h1 style={{
            fontFamily:"'Fraunces', serif",
            fontSize: "clamp(22px, 2.4vw, 30px)",
            fontWeight: 400, fontStyle:"italic",
            color: colors.ink,
            letterSpacing: -0.5,
            lineHeight: 1.2,
            margin: 0,
            maxWidth: "calc(100vw - 130px)",
            textWrap: "balance",
          }}>
            Who attacked the Nord Stream pipelines on 26 September 2022?
          </h1>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE OVERLAY (floats at bottom of graph area)
// ============================================================================

function TimelineOverlay({ idx, setIdx }) {
  return (
    <div style={{
      position:"absolute", left: 20, right: 20, bottom: 8, zIndex: 9,
      pointerEvents:"none",
    }}>
      <div style={{
        pointerEvents:"auto",
        width: "100%",
        padding: "8px 54px 10px",
        background: "rgba(250, 248, 243, 0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.8)`,
        borderRadius: 3,
        boxShadow: "0 12px 32px rgba(26, 26, 26, 0.06), 0 2px 6px rgba(26, 26, 26, 0.03)",
      }}>
        <TimelineBar idx={idx} setIdx={setIdx} />
      </div>
    </div>
  );
}

// ============================================================================
// ATTRIBUTION READOUT (replaces PromotionGate + RawScoresView)
// Explains in plain language: why 28.7% can't be read as 28.7% confidence,
// and why the claim cannot be promoted despite being the strongest hypothesis.
// ============================================================================

function AttributionReadout({ distribution, raw_scores }) {
  // Top candidate
  const enumerated = CAND_ORDER.filter(k => !["C_insufficient","C_unknown"].includes(k))
    .map(k => ({ k, v: distribution[k] || 0 }));
  const max = enumerated.reduce((a,b)=> b.v > a.v ? b : a, {k:"",v:0});
  const otherSum = enumerated.filter(x => x.k !== max.k).reduce((s,x)=> s+x.v, 0);
  const insuffW = distribution.C_insufficient || 0;

  // For the two-view comparison, we show top 4 candidates in both softmax & raw
  const topK = ["C2", "C3", "C_insufficient", "C1"];
  const rawVals = topK.map(k => ({
    k,
    soft: (distribution[k] || 0) * 100,
    raw: raw_scores[k] || 0,
    label: CAND_READABLE[k],
  }));
  const maxRaw = Math.max(...rawVals.map(r => Math.abs(r.raw)), 0.5);

  // Human-readable promotion gates (no R5 codes)
  const gates = [
    {
      title: "The leading hypothesis must dominate.",
      rule: "Strongest candidate ≥ 85%",
      current: `Currently ${(max.v*100).toFixed(1)}%`,
      gap: `${((0.85 - max.v)*100).toFixed(1)} points short of threshold`,
      pass: max.v >= 0.85,
      explain: "Trace won't declare an attribution winner until the evidence concentrates on a single candidate. One hypothesis at 29% leaves too much weight spread across alternatives.",
    },
    {
      title: "Remaining alternatives must be narrow.",
      rule: "Non-leading candidates total ≤ 15%",
      current: `Currently ${(otherSum*100).toFixed(1)}%`,
      gap: `${((otherSum - 0.15)*100).toFixed(1)} points above threshold`,
      pass: otherSum <= 0.15,
      explain: "Even if a leader emerged, other plausible attackers (including independent Ukrainian operators and the US) still hold non-trivial weight. They have to be actively ruled out.",
    },
    {
      title: "Recent evidence must survive challenges.",
      rule: "Challenge windows all elapsed",
      current: "4 of 16 edges still open",
      gap: "Earliest closes in 47 days",
      pass: false,
      explain: "Each evidence node enters the graph with a challenge window during which its weight can be contested by other stakers. Recent arrivals — including the Italian arrest — haven't closed yet.",
    },
    {
      title: "Genuine uncertainty must be small.",
      rule: "Inconclusive-candidate weight ≤ 5%",
      current: `Currently ${(insuffW*100).toFixed(1)}%`,
      gap: `${((insuffW - 0.05)*100).toFixed(1)} points above threshold`,
      pass: insuffW <= 0.05,
      explain: "Sweden and Denmark closed their investigations without attribution. Those official statements keep an 'evidence cannot distinguish' weight alive in the system.",
    },
    {
      title: "State-actor claims need an external anchor.",
      rule: "Official attribution required",
      current: "None issued",
      gap: "No investigating state has named a state actor",
      pass: false,
      explain: "When the leading hypothesis names a sovereign actor (T1 or T2 tier), Trace requires at least one official investigation to formally anchor it. No such anchor exists: Germany has warrants but no verdict; Sweden and Denmark closed without naming.",
    },
  ];

  const passing = gates.filter(g=>g.pass).length;

  return (
    <div style={{ padding: "48px 56px 56px", background: colors.paper }}>
      <Rule />

      {/* SECTION HEADER */}
      <div style={{ marginTop: 36, marginBottom: 44, maxWidth: 1100 }}>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 14,
        }}>
          Reading the distribution
        </div>
        <div style={{
          fontFamily:"'Fraunces', serif", fontSize: 38, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: -0.6, color: colors.ink,
        }}>
          Why the strongest hypothesis sits at <span style={{ color: colors.primary, fontStyle:"italic" }}>28.7%</span> — and why that number doesn't mean what it looks like.
        </div>
      </div>

      {/* TWO-PANEL VIEW COMPARISON */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap: 48,
        marginBottom: 64,
      }}>
        {/* Left: softmax */}
        <div style={{
          padding: 28, border: `1px solid ${colors.rule}`, borderRadius: 2,
          background: colors.paper,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 6,
          }}>
            what the display shows
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 21, fontStyle:"italic",
            lineHeight: 1.3, color: colors.ink, letterSpacing: -0.15,
            marginBottom: 20,
          }}>
            Percentages after softmax normalization
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap: 9 }}>
            {rawVals.map(({k, soft, label}) => (
              <div key={k} style={{
                display:"grid", gridTemplateColumns:"1fr 56px",
                alignItems:"center", gap: 12,
              }}>
                <div>
                  <div style={{
                    fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                    color: colors.ink, marginBottom: 5,
                  }}>
                    {label}
                  </div>
                  <div style={{
                    height: 4, background: colors.paperDeep, borderRadius: 1,
                    overflow:"hidden",
                  }}>
                    <div style={{
                      width: `${soft}%`, height: "100%",
                      background: candColor(k),
                      transition:"width 0.5s cubic-bezier(.2,.7,.2,1)",
                    }}/>
                  </div>
                </div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                  color: k === "C2" ? colors.primary : colors.ink,
                  fontVariantNumeric:"tabular-nums", textAlign:"right",
                }}>
                  {soft.toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55 }}>%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 22, paddingTop: 18,
            borderTop: `1px solid ${colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            lineHeight: 1.55, color: colors.inkSoft,
          }}>
            Softmax spreads weight across <em>all</em> candidates, including ones with no supporting evidence. It's a display convention, not a probability.
          </div>
        </div>

        {/* Right: raw */}
        <div style={{
          padding: 28, border: `1px solid ${colors.ink}`, borderRadius: 2,
          background: colors.paper,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.primary, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 6,
          }}>
            what the evidence actually says
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 21, fontStyle:"italic",
            lineHeight: 1.3, color: colors.ink, letterSpacing: -0.15,
            marginBottom: 20,
          }}>
            Raw evidence score, before normalization
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap: 9 }}>
            {rawVals.map(({k, raw, label}) => {
              const pos = raw >= 0;
              const w = (Math.abs(raw) / maxRaw) * 50;
              return (
                <div key={k} style={{
                  display:"grid", gridTemplateColumns:"1fr 56px",
                  alignItems:"center", gap: 12,
                }}>
                  <div>
                    <div style={{
                      fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                      color: colors.ink, marginBottom: 5,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      position:"relative", height: 4, background: colors.paperDeep,
                      borderRadius: 1,
                    }}>
                      {/* center axis */}
                      <div style={{
                        position:"absolute", left:"50%", top: -2, bottom: -2,
                        width: 1, background: colors.inkMute, opacity: 0.4,
                      }}/>
                      <div style={{
                        position:"absolute",
                        left: pos ? "50%" : `${50 - w}%`,
                        width: `${w}%`, height: "100%",
                        background: pos
                          ? (k === "C2" ? colors.primary
                            : k === "C3" ? colors.secondary
                            : k === "C_insufficient" ? "#7A7A7A"
                            : colors.inkSoft)
                          : colors.muted,
                        transition:"all 0.5s cubic-bezier(.2,.7,.2,1)",
                      }}/>
                    </div>
                  </div>
                  <div style={{
                    fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                    color: k === "C2" ? colors.primary : colors.ink,
                    fontVariantNumeric:"tabular-nums", textAlign:"right",
                  }}>
                    {raw >= 0 ? "+" : ""}{raw.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 22, paddingTop: 18,
            borderTop: `1px solid ${colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            lineHeight: 1.55, color: colors.inkSoft,
          }}>
            Raw scores sum each evidence node's contribution directly. Ukraine — state-directed scores <strong style={{ color: colors.primary }}>+1.81</strong>, dominating every other candidate. The evidence is far more concentrated than 28.7% suggests.
          </div>
        </div>
      </div>

      {/* PROMOTION GATES */}
      <div style={{
        marginTop: 32, display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72,
      }}>
        <div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 14,
          }}>
            Five conditions gate promotion
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.15, color: colors.ink, letterSpacing: -0.4,
          }}>
            Even as the leading hypothesis, the Ukrainian state-directed claim cannot be promoted to settled fact.
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
            color: colors.inkMute, marginTop: 18, lineHeight: 1.5,
          }}>
            All five conditions must clear for Trace to close a claim. Currently {passing} of 5 pass.
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap: 18 }}>
          {gates.map((g, i) => (
            <div key={i} style={{
              display:"grid", gridTemplateColumns: "28px 1fr",
              gap: 20, paddingBottom: 20,
              borderBottom: i < gates.length - 1 ? `1px solid ${colors.ruleSoft}` : "none",
            }}>
              {/* pass/fail indicator */}
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${g.pass ? colors.ink : colors.primary}`,
                background: g.pass ? colors.ink : "transparent",
                marginTop: 4,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {g.pass ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5 L4 7 L8 3" stroke={colors.paper} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <div style={{ width: 8, height: 1.5, background: colors.primary }}/>
                )}
              </div>

              <div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 19,
                  color: colors.ink, lineHeight: 1.3, letterSpacing: -0.1,
                }}>
                  {g.title}
                </div>
                <div style={{
                  display:"flex", gap: 14, flexWrap:"wrap",
                  marginTop: 6, alignItems:"baseline",
                }}>
                  <span style={{
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    color: colors.inkMute, letterSpacing: 0.5,
                  }}>
                    {g.rule}
                  </span>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.rule }}>·</span>
                  <span style={{
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    color: g.pass ? colors.ink : colors.primary, letterSpacing: 0.5,
                  }}>
                    {g.current}
                  </span>
                  {!g.pass && g.gap && (
                    <>
                      <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.rule }}>·</span>
                      <span style={{
                        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                        color: colors.inkMute, letterSpacing: 0.4,
                      }}>
                        {g.gap}
                      </span>
                    </>
                  )}
                </div>
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5,
                  color: colors.inkSoft, marginTop: 10, lineHeight: 1.6,
                }}>
                  {g.explain}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXTERNAL COMPARISON (Grok sanity check)
// ============================================================================

const COMPARISON_POINTS = [
  {
    q: "Who physically carried out the attack?",
    grokKey: "A group of Ukrainian citizens — seven people.",
    grok: "Including a captain, coordinator, demolitions expert, and four divers. Serhii K. (arrested in Italy, August 2025) identified as coordinator; Volodymyr Z. as one of the divers.",
    traceKey: "Ukrainian operators. Every attribution lead points the same way.",
    trace: "The Andromeda forensic work, the German arrest warrant, the Italian arrest of Serhii K., NYT's pro-Ukrainian group reporting, the Chervinsky and Zaluzhnyi stories — none of this points at Russia, the US, or the UK. Alternative perpetrators never cross 9% weight.",
    consistency: "consistent",
  },
  {
    q: "Was this directed by the Ukrainian state?",
    grokKey: "Likely, but officially denied.",
    grok: "German court documents assume the operation 'most likely originated with Ukrainian state authorities.' Ukraine officially denies any government involvement. Some reports implicate former commander Zaluzhnyi; Zelensky's role contested.",
    traceKey: "Leading hypothesis — but at 28.7%, below the threshold to settle.",
    trace: "Two events pulled this above the independent-operators scenario: Volodymyr Z. leaving Poland in an embassy diplomatic-plate car, and Poland later refusing to extradite him. Both read as state protection. But 29% isn't where Trace closes a case — independent-operator and inconclusive scenarios still hold meaningful weight.",
    consistency: "consistent",
  },
  {
    q: "Why is this still unresolved?",
    grokKey: "Intelligence politics, blocked extradition, and plausible deniability.",
    grok: "Investigation is highly sensitive — intelligence sharing, alliance politics, Poland blocking extradition, no party publicly claiming responsibility, plausible-deniability layers throughout.",
    traceKey: "No authority has issued a formal verdict, and the evidence isn't concentrated enough to stand in for one.",
    trace: "Sweden and Denmark have closed their investigations without naming anyone. Germany has issued warrants but no court verdict. The Italian arrest hasn't yet produced a trial or a statement from the accused. Poland is shielding Volodymyr Z. from extradition. Without a judicial finding — and with evidence still spread across multiple scenarios — Trace holds the claim open.",
    consistency: "consistent",
  },
];

const GROK_ZH = `**目前没有官方最终定论**谁是"北溪管道爆炸"的唯一责任方，但德国调查**强烈指向一个由乌克兰公民组成的小组**实施了破坏行动。事件发生在2022年9月26日，波罗的海海底的北溪1号和2号管道发生多次剧烈爆炸，导致三条管道受损，大量天然气泄漏。丹麦、瑞典和德国均确认这是**人为破坏（sabotage），而非事故**。

## 德国调查的主要发现（截至2026年最新进展）

- 嫌疑人全部为乌克兰籍，共7人组成的小组。
- 核心协调人被确认为49岁的乌克兰公民谢尔盖·K（Serhii K.），2025年8月在意大利被捕。
- 另一名关键嫌疑人是乌克兰潜水教练 Volodymyr Z.，波兰法院拒绝引渡。
- 小组据称从德国罗斯托克港口租用帆船"Andromeda"，携带爆炸物前往丹麦博恩霍尔姆岛附近海域实施行动。

## 乌克兰官方立场

乌克兰方面一再否认任何官方参与。有些报道称行动可能由前乌克兰武装部队总司令扎卢日内推动，或是"亲乌克兰团体/次国家行为者"所为。

## 为什么还没彻底查清

- 调查高度敏感，涉及情报、国家利益和盟友关系。
- 波兰拒绝引渡、情报共享有限，导致进展缓慢。
- 没有国家或组织公开认责，真相可能涉及多层"可否认性"（plausible deniability）。

## 结论

根据目前最可靠的德国司法调查证据，执行者是一个乌克兰籍小组，但是否由乌克兰政府高层直接授权、是否有外部支持，仍无公开确凿定论。`;

const GROK_EN = `There is **no official, final conclusion** on who is solely responsible for the Nord Stream pipeline explosions, but the German investigation **strongly points to a group of Ukrainian citizens** as the perpetrators of the sabotage. The incident occurred on September 26, 2022, when the Nord Stream 1 and 2 pipelines on the Baltic seabed suffered multiple violent explosions, damaging three of the pipelines and causing massive gas leaks. Denmark, Sweden, and Germany have all confirmed this was **deliberate sabotage, not an accident**.

## Key findings of the German investigation (as of 2026)

- All suspects are Ukrainian nationals, forming a group of seven.
- The lead coordinator has been identified as Serhii K., a 49-year-old Ukrainian citizen arrested in Italy in August 2025.
- Another key suspect is Volodymyr Z., a Ukrainian diving instructor whose extradition was refused by a Polish court.
- The group allegedly rented the sailing yacht "Andromeda" from the port of Rostock, Germany, and carried explosives to waters near the Danish island of Bornholm to carry out the operation.

## Ukraine's official position

Ukraine has repeatedly denied any official involvement. Some reports suggest the operation may have been pushed forward by former Commander-in-Chief of the Ukrainian Armed Forces Valery Zaluzhnyi, or carried out by a "pro-Ukrainian group / sub-state actors."

## Why it remains unresolved

- The investigation is highly sensitive, involving intelligence, national interests, and alliance relationships.
- Poland's refusal to extradite and limited intelligence sharing have slowed progress.
- No state or organization has publicly claimed responsibility, and the truth likely involves multiple layers of "plausible deniability."

## Bottom line

Based on the most reliable German judicial evidence to date, the executors were a Ukrainian group — but whether the operation was directly authorized by senior Ukrainian leadership, or whether external support was involved, remains without public, conclusive proof.`;

function ConsistencyBadge({ level }) {
  const map = {
    consistent: { label: "consistent", color: colors.ink, bg: colors.paperDeep },
    partial:    { label: "partial",    color: colors.warn, bg: "#F4ECD8" },
    divergent:  { label: "divergent",  color: colors.primary, bg: "#F4E4E0" },
  };
  const s = map[level];
  return (
    <span style={{
      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
      letterSpacing: 1, textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 2,
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}33`,
    }}>
      ● {s.label}
    </span>
  );
}

function ExternalComparison() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  return (
    <div style={{ padding: "32px 56px 56px", background: colors.paper }}>
      <Rule />

      <div style={{ marginTop: 32, display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72 }}>
        <div>
          <div style={{
            display:"flex", alignItems:"center", gap: 10, marginBottom: 20,
          }}>
            {/* Grok wordmark */}
            <div style={{
              display:"flex", alignItems:"center", gap: 8,
              padding: "5px 10px",
              border: `1px solid ${colors.rule}`,
              borderRadius: 2,
              background: colors.paperDeep,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20 L14 4 L18 4 L8 20 Z" fill={colors.ink}/>
                <path d="M14 12 L20 12 L20 20 L16 20 L16 16 L14 16 Z" fill={colors.ink}/>
              </svg>
              <span style={{
                fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                color: colors.ink, fontWeight: 600, letterSpacing: 0.5,
              }}>Grok</span>
            </div>
            <span style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
            }}>
              comparison · xAI
            </span>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 14 }}>
            Sanity check
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.4, color: colors.ink }}>
            Does the protocol produce the same answer as a prose summary?
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5, color: colors.inkSoft, marginTop: 20, lineHeight: 1.6 }}>
            The two systems agree on <em>what happened</em>. Where they differ is <em>how uncertainty is reported</em> — one narrates and hedges, the other names the gates that block promotion.
          </div>

          {/* Toggle button for Grok's full response — panel itself opens in the right column */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={()=>setOpen(!open)}
              style={{
                background: open ? colors.ink : "transparent",
                border: `1px solid ${open ? colors.ink : colors.rule}`,
                padding: "10px 16px",
                borderRadius: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: open ? colors.paper : colors.inkSoft,
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e)=>{ if (!open) e.currentTarget.style.background = colors.paperDeep; }}
              onMouseLeave={(e)=>{ if (!open) e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{
                transition: "transform 0.25s cubic-bezier(.2,.7,.2,1)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}>
                <path d="M1 5.5 L9 5.5 M6 2 L9.5 5.5 L6 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {open ? "hide full response" : "view Grok's full response"}
            </button>
          </div>
        </div>

        {/* Right column: cards + full response panel coexist;
            panel slides in from the left when open, slides back out when closed */}
        <div style={{ position:"relative", overflow:"hidden", alignSelf:"start", minHeight: 300 }}>
          {/* Cards layer — always mounted, fades slightly when panel is open */}
          <div style={{
            display:"flex", flexDirection:"column", gap: 20,
            opacity: open ? 0 : 1,
            transition: "opacity 0.25s ease-out",
            pointerEvents: open ? "none" : "auto",
          }}>
            {COMPARISON_POINTS.map((p, i) => (
              <div key={i} style={{
                border: `1px solid ${colors.ruleSoft}`,
                borderRadius: 2,
                background: colors.paper,
                padding: "22px 24px",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap: 16, marginBottom: 18 }}>
                  <div style={{
                    fontFamily:"'Fraunces', serif", fontSize: 19, lineHeight: 1.3,
                    color: colors.ink, letterSpacing: -0.1, flex: 1,
                  }}>
                    {p.q}
                  </div>
                  <ConsistencyBadge level={p.consistency} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 28 }}>
                  <div>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: colors.inkMute, letterSpacing: 0.9,
                      textTransform:"uppercase", marginBottom: 10,
                      display:"flex", alignItems:"center", gap: 6,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius:"50%", background: colors.inkMute, display:"inline-block" }}/>
                      Grok · unstructured
                    </div>
                    <div style={{
                      fontFamily:"'Fraunces', serif", fontStyle:"italic",
                      fontSize: 17.5, lineHeight: 1.5, color: colors.ink,
                      letterSpacing: -0.15, marginBottom: 12,
                    }}>
                      <span style={{
                        backgroundImage: "linear-gradient(180deg, transparent 62%, rgba(232, 200, 92, 0.42) 62%, rgba(232, 200, 92, 0.42) 94%, transparent 94%)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                        padding: "0 2px",
                      }}>
                        {p.grokKey}
                      </span>
                    </div>
                    <div style={{
                      fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
                      color: colors.inkSoft, lineHeight: 1.6,
                    }}>
                      {p.grok}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: colors.primary, letterSpacing: 0.9,
                      textTransform:"uppercase", marginBottom: 10,
                      display:"flex", alignItems:"center", gap: 6,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius:"50%", background: colors.primary, display:"inline-block" }}/>
                      Trace · v0.3
                    </div>
                    <div style={{
                      fontFamily:"'Fraunces', serif", fontStyle:"italic",
                      fontSize: 17.5, lineHeight: 1.5, color: colors.ink,
                      letterSpacing: -0.15, marginBottom: 12,
                    }}>
                      {p.traceKey}
                    </div>
                    <div style={{
                      fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
                      color: colors.inkSoft, lineHeight: 1.6,
                    }}>
                      {p.trace}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Grok response panel — slides in from the left */}
          <div style={{
            position:"absolute", top: 0, left: 0, right: 0,
            padding: "28px 32px",
            background: colors.paperDeep,
            border: `1px solid ${colors.rule}`,
            borderRadius: 2,
            transform: open ? "translateX(0)" : "translateX(-105%)",
            opacity: open ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(.2,.7,.2,1), opacity 0.25s ease-out",
            pointerEvents: open ? "auto" : "none",
            boxShadow: open
              ? "0 12px 36px rgba(26, 26, 26, 0.08), 0 2px 8px rgba(26, 26, 26, 0.04)"
              : "none",
          }}>
            <div style={{
              display:"flex", alignItems:"flex-start", justifyContent:"space-between",
              gap: 16, marginBottom: 22,
              paddingBottom: 18, borderBottom: `1px solid ${colors.ruleSoft}`,
            }}>
              <div>
                {/* Brand eyebrow */}
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
                  marginBottom: 10,
                }}>
                  Grok (xAI)
                </div>
                {/* Query — the focal content of this header block */}
                <div style={{
                  fontFamily:"'Fraunces', serif", fontStyle:"italic",
                  fontSize: 17, color: colors.ink, letterSpacing: -0.1,
                  lineHeight: 1.3,
                  marginBottom: 8,
                }}>
                  "Who bombed the Nord Stream?"
                </div>
                {/* Retrieval footer */}
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                  color: colors.inkMute, letterSpacing: 0.5,
                }}>
                  Retrieved April 2026
                </div>
              </div>
              {/* Compact language toggle */}
              <div style={{
                display:"inline-flex", flexShrink: 0,
                border: `1px solid ${colors.rule}`, borderRadius: 2,
                background: colors.paper, padding: 1,
              }}>
                {[
                  { key: "en", label: "EN" },
                  { key: "zh", label: "中文" },
                ].map(opt => (
                  <button key={opt.key}
                    onClick={()=>setLang(opt.key)}
                    style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                      letterSpacing: 0.6, textTransform:"uppercase",
                      padding: "4px 10px", borderRadius: 1,
                      border: "none",
                      cursor: "pointer",
                      background: lang === opt.key ? colors.ink : "transparent",
                      color: lang === opt.key ? colors.paper : colors.inkMute,
                      transition:"all 0.15s",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <GrokMarkdown text={lang === "en" ? GROK_EN : GROK_ZH} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lightweight Grok markdown renderer — handles ## h2, - bullets, paragraphs.
function GrokMarkdown({ text }) {
  // Parse into blocks
  const lines = text.split("\n");
  const blocks = [];
  let currentBullets = [];
  let currentParagraph = [];

  const flushBullets = () => {
    if (currentBullets.length) {
      blocks.push({ type: "list", items: currentBullets });
      currentBullets = [];
    }
  };
  const flushParagraph = () => {
    if (currentParagraph.length) {
      blocks.push({ type: "p", text: currentParagraph.join(" ") });
      currentParagraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushParagraph(); flushBullets();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      currentBullets.push(line.slice(2));
    } else if (line === "") {
      flushParagraph(); flushBullets();
    } else {
      flushBullets();
      currentParagraph.push(line);
    }
  }
  flushParagraph(); flushBullets();

  // Parse inline **bold** segments into an array of {text, bold}
  const parseInline = (str) => {
    const parts = [];
    const re = /\*\*(.+?)\*\*/g;
    let last = 0;
    let m;
    while ((m = re.exec(str)) !== null) {
      if (m.index > last) parts.push({ text: str.slice(last, m.index), bold: false });
      parts.push({ text: m[1], bold: true });
      last = m.index + m[0].length;
    }
    if (last < str.length) parts.push({ text: str.slice(last), bold: false });
    return parts;
  };

  const renderInline = (str) => parseInline(str).map((seg, k) =>
    seg.bold
      ? <strong key={k} style={{ fontWeight: 700, color: colors.ink }}>{seg.text}</strong>
      : <React.Fragment key={k}>{seg.text}</React.Fragment>
  );

  return (
    <div style={{ fontFamily:"'Fraunces', serif", color: colors.ink }}>
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h3 key={i} style={{
              fontFamily:"'Fraunces', serif",
              fontSize: 17, fontWeight: 500,
              color: colors.ink, letterSpacing: -0.15,
              margin: i === 0 ? "0 0 12px" : "26px 0 12px",
              lineHeight: 1.3,
            }}>
              {renderInline(b.text)}
            </h3>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={i} style={{
              listStyle: "none", padding: 0,
              margin: "0 0 14px",
              display:"flex", flexDirection:"column", gap: 8,
            }}>
              {b.items.map((item, j) => (
                <li key={j} style={{
                  display:"flex", gap: 12,
                  fontSize: 14.5, lineHeight: 1.65,
                  color: colors.inkSoft,
                }}>
                  <span style={{
                    flexShrink: 0,
                    color: colors.inkMute,
                    marginTop: 1,
                  }}>—</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        const isLead = i === 0 && b.type === "p";
        return (
          <p key={i} style={{
            fontSize: 14.5,
            lineHeight: 1.7,
            color: isLead ? colors.ink : colors.inkSoft,
            fontWeight: 400,
            margin: isLead ? "0 0 22px" : "0 0 14px",
            paddingBottom: isLead ? 22 : 0,
            borderBottom: isLead ? `1px solid ${colors.ruleSoft}` : "none",
          }}>
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}

// ============================================================================
// LIMITS SECTION
// ============================================================================

function LimitsSection() {
  const items = [
    { k:"L1", t:"Magic numbers remain.", d:"The shrinkage factor (0.3) and evidence threshold (0.1) are now stakeable parameters rather than constants, but still have no first-principles derivation. Consolidation, not elimination." },
    { k:"L2", t:"Cluster declaration is an attack surface.", d:"Malicious under- or over-declaration of source_cluster_id can bias aggregation. Mitigated by making cluster declaration itself stakeable — not eliminated." },
    { k:"L3", t:"Cross-MAS outputs are not directly comparable.", d:"Modality weights are MAS-bound. A distribution produced under MAS_default cannot be numerically averaged with one from MAS_historical without an explicit normalizer." },
    { k:"L4", t:"Aggregation correctness cannot be verified against ground truth.", d:"For contested claims, no oracle exists. Trace does not claim truth; Trace claims transparent, staked, auditable evidence structure. A philosophical boundary, not a fixable defect." },
  ];
  return (
    <div style={{ padding: "56px 56px 96px", background: colors.paper }}>
      <Rule />
      <div style={{ marginTop: 44, display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 14 }}>
            Acknowledged limits
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.4, color: colors.ink }}>
            What this display cannot tell you.
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 16, color: colors.inkMute, marginTop: 20, lineHeight: 1.5 }}>
            Per spec v0.3 Part VII — these are boundaries, not bugs.
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
          {items.map(item => (
            <div key={item.k} style={{
              display:"grid", gridTemplateColumns:"54px 1fr", gap: 22,
              paddingBottom: 20, borderBottom:`1px solid ${colors.ruleSoft}`,
            }}>
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 11, color: colors.inkMute,
                letterSpacing: 0.8, paddingTop: 4,
              }}>v0.3–{item.k}</div>
              <div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 20, color: colors.ink, lineHeight: 1.3 }}>{item.t}</div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14, color: colors.inkSoft, marginTop: 6, lineHeight: 1.6 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 72, paddingTop: 24, borderTop:`1px solid ${colors.rule}`,
                    display:"flex", justifyContent:"space-between", alignItems:"baseline",
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute, letterSpacing: 0.6, flexWrap:"wrap", gap: 12 }}>
        <span>Trace protocol specification v0.3 · end-to-end pressure test April 2026</span>
        <span>Case file 001 · Nord Stream attribution</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export default function TraceCaseFile() {
  const [idx, setIdx] = useState(TIMELINE.length - 1);
  const [selectedEv, setSelectedEv] = useState(null);
  const [hoverCand, setHoverCand] = useState(null);
  const [hoverEv, setHoverEv] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panKeyHeld, setPanKeyHeld] = useState(false);
  const panStart = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  const canPan = fullscreen && zoom > 1;
  const panReady = canPan && panKeyHeld;

  // Track Space / Cmd / Ctrl for pan affordance
  useEffect(() => {
    if (!canPan) { setPanKeyHeld(false); return; }
    const isPanKey = (e) => e.code === "Space" || e.metaKey || e.ctrlKey;
    const onDown = (e) => {
      if (isPanKey(e)) {
        // Prevent Space from scrolling the page while pan-ready
        if (e.code === "Space") e.preventDefault();
        setPanKeyHeld(true);
      }
    };
    const onUp = (e) => {
      // Release when key lifts or modifier dropped
      if (e.code === "Space" || e.key === "Meta" || e.key === "Control") {
        setPanKeyHeld(false);
      }
    };
    const onBlur = () => setPanKeyHeld(false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [canPan]);

  const onPanMouseDown = (e) => {
    if (!panReady) return;
    panStart.current = {
      x: e.clientX, y: e.clientY,
      originX: pan.x, originY: pan.y,
    };
    setPanning(true);
  };

  useEffect(() => {
    if (!panning) return;
    const onMove = (e) => {
      setPan({
        x: panStart.current.originX + (e.clientX - panStart.current.x),
        y: panStart.current.originY + (e.clientY - panStart.current.y),
      });
    };
    const onUp = () => setPanning(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [panning]);

  // Reset pan when zoom returns to 1 or fullscreen exits
  useEffect(() => {
    if (zoom === 1 || !fullscreen) setPan({ x: 0, y: 0 });
  }, [zoom, fullscreen]);

  const tp = TIMELINE[idx];
  const cutoffDate = tp.date;

  const activeEvidence = useMemo(() =>
    EVIDENCE.filter(e => e.published <= cutoffDate)
      .sort((a,b) => a.published.localeCompare(b.published)),
    [cutoffDate]);

  useEffect(() => {
    if (selectedEv && !activeEvidence.find(e => e.id === selectedEv)) setSelectedEv(null);
  }, [activeEvidence, selectedEv]);

  // Escape exits fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  // Reset zoom when leaving fullscreen
  useEffect(() => {
    if (!fullscreen) setZoom(1);
  }, [fullscreen]);

  // Auto-advance timeline when playing
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setIdx(prev => {
        if (prev >= TIMELINE.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, [playing]);

  const onPlayToggle = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (idx >= TIMELINE.length - 1) setIdx(0);
      setPlaying(true);
    }
  };

  // Wrap setIdx so any manual user interaction stops playback
  const setIdxUser = (newIdx) => {
    if (playing) setPlaying(false);
    if (typeof newIdx === "function") setIdx(newIdx);
    else setIdx(newIdx);
  };

  const selectedEvObj = EVIDENCE.find(e => e.id === selectedEv);

  const stageW = 1400, stageH = 880;

  return (
    <div style={{
      fontFamily: "'Instrument Sans', sans-serif",
      background: colors.paper,
      color: colors.ink,
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { margin: 0; background: ${colors.paper}; }
        * { box-sizing: border-box; }
        @keyframes slideInRight {
          from { transform: translateX(28px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* MASTHEAD — full-width row (hidden in fullscreen) */}
      {!fullscreen && (
        <Masthead
          activeEvidenceCount={activeEvidence.length}
          currentLabel={tp.label}
          currentDate={tp.date}
          isFullscreen={fullscreen}
          onToggleFullscreen={()=>setFullscreen(true)}
        />
      )}

      {/* GRAPH STAGE */}
      <div style={{
        position: fullscreen ? "fixed" : "relative",
        inset: fullscreen ? 0 : "auto",
        width: "100%",
        height: fullscreen ? "100vh" : "calc(100vh - 132px)",
        minHeight: fullscreen ? "100vh" : 560,
        background: colors.paper,
        overflow:"hidden",
        zIndex: fullscreen ? 100 : 1,
      }}>
        <div
          onMouseDown={onPanMouseDown}
          style={{
            position:"absolute", inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: panning ? "none" : "transform 0.2s cubic-bezier(.2,.7,.2,1)",
            cursor: panning ? "grabbing" : (panReady ? "grab" : "default"),
          }}>
          <FullscreenGraph
            activeEvidence={activeEvidence}
            distribution={tp.distribution}
            selectedEv={selectedEv}
            setSelectedEv={setSelectedEv}
            hoverCand={hoverCand}
            setHoverCand={setHoverCand}
            hoverEv={hoverEv}
            setHoverEv={setHoverEv}
            width={stageW}
            height={stageH}
            playing={playing}
          />
        </div>

        {/* Distribution — top right corner */}
        <DistributionOverlay
          distribution={tp.distribution}
          hoverCand={hoverCand}
          setHoverCand={setHoverCand}
          idx={idx}
          playing={playing}
          onPlayToggle={onPlayToggle}
        />

        {/* Legend — top-left, no chrome (shifted down in fullscreen to avoid zoom control) */}
        <div style={{
          position:"absolute", top: fullscreen ? 62 : 22, left: 24, zIndex: 6,
          display:"flex", flexDirection:"column", gap: 8,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5, color: colors.inkMute,
          letterSpacing: 0.5, pointerEvents:"none",
        }}>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="22" height="6" style={{ flexShrink: 0 }}>
              <line x1="0" y1="3" x2="22" y2="3" stroke={colors.primary} strokeWidth="2"/>
            </svg>
            supports
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="22" height="6" style={{ flexShrink: 0 }}>
              <line x1="0" y1="3" x2="22" y2="3" stroke={colors.inkMute} strokeWidth="1.4" strokeDasharray="3,3"/>
            </svg>
            opposes
          </span>
          <span
            title="Evidence sharing a common origin (e.g. a single intelligence ecosystem). Combined weight is dampened so correlated reports aren't counted as independent."
            style={{ display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", cursor:"help" }}>
            <svg width="22" height="14" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="7" r="5.5" fill="none" stroke={colors.warn} strokeWidth="0.9" strokeDasharray="2,2"/>
            </svg>
            correlated source
          </span>
        </div>

        {/* Timeline overlay — bottom of graph area */}
        <TimelineOverlay idx={idx} setIdx={setIdxUser} />

        {/* Zoom controls — only in fullscreen, top-left corner */}
        {fullscreen && (
          <div style={{
            position:"absolute", top: 20, left: 20, zIndex: 15,
            display:"flex", alignItems:"stretch",
            background: "rgba(250, 248, 243, 0.72)",
            backdropFilter:"blur(14px) saturate(140%)",
            WebkitBackdropFilter:"blur(14px) saturate(140%)",
            border: `1px solid rgba(217, 212, 199, 0.9)`,
            borderRadius: 2,
            overflow:"hidden",
          }}>
            <button
              onClick={()=>setZoom(z => Math.max(0.7, +(z - 0.1).toFixed(2)))}
              disabled={zoom <= 0.7}
              title="Zoom out"
              style={{
                width: 30, height: 28,
                border:"none", background:"transparent",
                cursor: zoom <= 0.7 ? "default" : "pointer",
                color: zoom <= 0.7 ? colors.muted : colors.inkSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding: 0, transition:"color 0.15s",
              }}
              onMouseEnter={(e)=>{ if (zoom > 0.7) e.currentTarget.style.color = colors.ink; }}
              onMouseLeave={(e)=>{ if (zoom > 0.7) e.currentTarget.style.color = colors.inkSoft; }}
            >
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect x="0" y="0" width="10" height="2" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={()=>setZoom(1)}
              title="Reset zoom"
              style={{
                padding: "0 10px", height: 28,
                border:"none",
                borderLeft: `1px solid ${colors.rule}`,
                borderRight: `1px solid ${colors.rule}`,
                background:"transparent",
                cursor:"pointer",
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                color: colors.inkSoft, letterSpacing: 0.4,
                fontVariantNumeric:"tabular-nums",
                transition:"color 0.15s",
                minWidth: 46,
              }}
              onMouseEnter={(e)=>{ e.currentTarget.style.color = colors.ink; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.color = colors.inkSoft; }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={()=>setZoom(z => Math.min(1.6, +(z + 0.1).toFixed(2)))}
              disabled={zoom >= 1.6}
              title="Zoom in"
              style={{
                width: 30, height: 28,
                border:"none", background:"transparent",
                cursor: zoom >= 1.6 ? "default" : "pointer",
                color: zoom >= 1.6 ? colors.muted : colors.inkSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding: 0, transition:"color 0.15s",
              }}
              onMouseEnter={(e)=>{ if (zoom < 1.6) e.currentTarget.style.color = colors.ink; }}
              onMouseLeave={(e)=>{ if (zoom < 1.6) e.currentTarget.style.color = colors.inkSoft; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="0" y="4" width="10" height="2" fill="currentColor"/>
                <rect x="4" y="0" width="2" height="10" fill="currentColor"/>
              </svg>
            </button>
          </div>
        )}

        {/* Pan affordance hint — only when zoomed in, subtly invites the gesture */}
        {fullscreen && zoom > 1 && (
          <div style={{
            position:"absolute", top: 22, left: 154, zIndex: 15,
            display:"flex", alignItems:"center", gap: 6,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: panReady ? colors.primary : colors.inkMute,
            letterSpacing: 0.5, textTransform:"uppercase",
            pointerEvents:"none",
            transition:"color 0.15s, opacity 0.2s",
            opacity: panning ? 0.4 : 1,
          }}>
            <span style={{
              display:"inline-flex", alignItems:"center",
              padding: "2px 6px",
              border: `1px solid ${panReady ? colors.primary : colors.rule}`,
              borderRadius: 2,
              fontSize: 8.5,
              lineHeight: 1,
              transition:"border-color 0.15s",
            }}>⌘</span>
            <span style={{ fontSize: 8.5 }}>or</span>
            <span style={{
              display:"inline-flex", alignItems:"center",
              padding: "2px 8px",
              border: `1px solid ${panReady ? colors.primary : colors.rule}`,
              borderRadius: 2,
              fontSize: 8.5,
              lineHeight: 1,
              transition:"border-color 0.15s",
            }}>space</span>
            <span style={{ marginLeft: 2 }}>{panReady ? "drag to pan" : "hold to pan"}</span>
          </div>
        )}

        {/* Fullscreen exit — floating top right (only when in fullscreen), mirrors masthead button position */}
        {fullscreen && (
          <button onClick={()=>setFullscreen(false)}
            style={{
              position:"absolute", top: 20, right: 20, zIndex: 15,
              background: "rgba(250, 248, 243, 0.72)",
              backdropFilter:"blur(14px)",
              WebkitBackdropFilter:"blur(14px)",
              color: colors.ink,
              border: `1px solid ${colors.rule}`,
              padding: "8px 14px", borderRadius: 2,
              fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: 1, textTransform: "uppercase",
              cursor: "pointer",
              display:"flex", alignItems:"center", gap: 8,
              transition:"all 0.2s",
            }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 4 L1 1 L4 1 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"
                    stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            exit · esc
          </button>
        )}

        {/* Evidence drawer */}
        <EvidenceDrawer ev={selectedEvObj} onClose={()=>setSelectedEv(null)} />
      </div>

      {/* Everything below the graph is hidden in fullscreen */}
      {!fullscreen && (
        <>
          {/* SANITY CHECK (Grok comparison) — now the first analysis section */}
          <ExternalComparison />

          {/* ATTRIBUTION READOUT — explains distribution + promotion gates */}
          <AttributionReadout distribution={tp.distribution} raw_scores={tp.raw_scores} />

          {/* LIMITS */}
          <LimitsSection />
        </>
      )}
    </div>
  );
}
