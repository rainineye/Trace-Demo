"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

// ############################################################################
// V0.3 STANDALONE EXPERIENCE
// ----------------------------------------------------------------------------
// This is the stable, shipped v0.3 case file — the Nord Stream exhibit as it
// existed before the v0.4 Pearl-level protocol work began. All identifiers in
// this block are namespace-prefixed with V03_ to avoid collision with the
// v0.4 tree below. Do not modify this tree to share code with v0.4; they are
// intentionally separate experiences.
// ############################################################################

// ============================================================================
// DATA
// ============================================================================

const V03_TIMELINE = [
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

// Turning points — moments where evidence genuinely reshaped the distribution.
// Three lines of reasoning must clear for a timepoint to qualify:
//   (1) Leader changed OR lead margin widened by ≥5 points at the category level
//   (2) The shift was driven by new evidence, not pure re-weighting
//   (3) The shift persisted — not reversed by the next timepoint
// Nord Stream is a "contested" case: turning points mark moments where the
// distribution structurally shifted even though no single candidate ever
// dominated. Unlike COVID (which has a clear frontrunner), here the turning
// points include the moment uncertainty itself was formalized (t5).
const TURNING_POINTS = {
  t2: { reason: "First causal-modality evidence",
        detail: "Andromeda forensic — yacht linked to dive operation. Both Ukrainian sub-hypotheses rise; US hypothesis falls below 10%.",
        delta: "+4.76" },
  t5: { reason: "Investigating states give up",
        detail: "Sweden and Denmark close without naming. C_insufficient jumps ~8 pts — the system formally registers that the question has stalled.",
        delta: "+7.95" },
  t6: { reason: "State-direction separates from independent",
        detail: "Embassy diplomatic plates at the border. Largest single-step shift in the case — C2 jumps +8 pts while C3 stalls, splitting the two Ukrainian hypotheses.",
        delta: "+8.11" },
};

const V03_CANDIDATES = {
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
// internally for evidence edges and spec references; V03_CAND_READABLE is what
// readers see in the distribution panel, graph nodes, and understanding body.
const V03_CAND_READABLE = {
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

const V03_EVIDENCE = [
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

  // ------ SILENCE EDGES (v0.3.1 extension) ------

  { id:"S1", label:"US intelligence silence on own involvement (post-denial)",
    published:"2023-04-01", source_type:"inconclusive_statement", credibility:0.55, cluster:null,
    silence:true, silence_type:"political_cost",
    edges:[{to:"C1",pol:+1,mod:"silence",s:0.15,silence_type:"political_cost"}],
    detail:"After the White House's February 2023 denial (E2), US intelligence agencies have not produced a public attribution assessment — unusual for an attack on critical European infrastructure. No DOE, FBI, or CIA report naming any party. The silence is bounded by political cost: a formal US denial already exists, and any further IC product would either contradict the WH line or confirm it with new evidence. Counter-suppression logic: this sustained silence is a weak positive signal for C1 — if the US had no involvement to conceal, a fuller exoneration narrative would likely have emerged." },

  { id:"S2", label:"Russian self-sabotage investigated and set aside",
    published:"2023-06-01", source_type:"inconclusive_statement", credibility:0.70, cluster:null,
    silence:true, silence_type:"investigated_excluded",
    edges:[{to:"C4",pol:-1,mod:"silence",s:0.25,silence_type:"investigated_excluded"}],
    detail:"Early 2022-2023 speculation considered Russian self-sabotage (false-flag attack on own infrastructure) as a live hypothesis. By mid-2023, German, Swedish, and Danish investigations had quietly dropped it: forensic findings (E6 Andromeda) pointed elsewhere, and no supporting evidence of Russian operations emerged. Unlike an affirmative exclusion, this was silent abandonment — the hypothesis simply stopped appearing in official assessments. Carries genuine negative weight: the question was asked, investigated, and set aside." },

  { id:"S3", label:"NATO political silence on Ukrainian state attribution",
    published:"2024-08-01", source_type:"inconclusive_statement", credibility:0.55, cluster:null,
    silence:true, silence_type:"political_cost",
    edges:[{to:"C2",pol:+1,mod:"silence",s:0.15,silence_type:"political_cost"}],
    detail:"Despite Germany's judicial process identifying Ukrainian operators, no NATO member state has publicly named Ukraine as responsible at the state level. Poland refuses extradition (E14); other allies stay quiet. The silence has clear political cost: formal NATO attribution of the attack to Ukraine would destabilize alliance cohesion during an active war. Counter-suppression logic: when silence is politically motivated rather than evidentially driven, the suppression itself is information — weak positive signal for C2." },
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
  t5:  { head:"Formal investigation narrows to one country. The rest of the case will now flow through journalism, leaks, and a single German prosecution.",
         body:"Sweden and Denmark close their files citing jurisdictional limits — no perpetrator named. Under v0.3 inconclusive_statement pattern, both contribute positive edges to C_insufficient, which jumps to 30%. What the graph registers is not a dead end but a narrowing: two of the three investigating states have ceded the question, and whatever comes next will bypass the formal prosecutorial channel that a reader might have expected to resolve this." },
  t6:  { head:"Germany identifies a suspect. That suspect leaves Europe under Ukrainian diplomatic protection.",
         body:"Germany issues warrant; Volodymyr Z. exits Poland in an embassy diplomatic-plate vehicle; Berlin refuses to answer on US involvement. The embassy car is a causal-modality edge strongly favoring C2 and negatively weighting C3. C2 jumps from 15% to 21% — the largest single-step change so far. C3 stalls." },
  t7:  { head:"For the first time, the reporting points to Ukrainian military command — not freelance operators.",
         body:"WSJ report of Zaluzhnyi knowledge. Direct positive edge to C2, direct negative edge to C3. For the first time the state-directed hypothesis clearly separates from the independent-operators hypothesis." },
  t8:  { head:"A late technical reminder: US Navy capability was never ruled out, only displaced as attention moved to Ukrainian operators.",
         body:"Weltwoche's reporting on the Kearsarge's UUV capability is low-credibility (0.45) but introduces something the graph did not previously have: an explicit acknowledgement that the means existed on the US side. Most of the case's forward momentum has pushed the Ukrainian hypotheses, but no piece of evidence to date has physically excluded US involvement — only made it the less-discussed option. This edge marks that distinction." },
  t9:  { head:"A named coordinator is in custody — but no trial yet, and no statement from the accused.",
         body:"Serhii K. detained in Italy. Positive causal edge to C2 (0.55) and C3 (0.50). Ambiguous on the state-vs-independent axis but strengthens Ukrainian attribution overall. C2 rises to 25%." },
  t10: { head:"A NATO ally refuses extradition of the accused — political protection, inferred rather than proven.",
         body:"Poland refuses extradition. Correlational signal of political protection; under CMEG dynamics, pushes C2 up and C3 down. C2 reaches 28.7% — the highest weighting to date. Still far below the 85% promotion threshold." },
  t11: { head:"Ukrainian state-direction now has named suspects and a specific forensic chain — but no courtroom to bind them together.",
         body:"The case has reached unusual specificity on one particular hypothesis: a named coordinator (Serhii K.) in Italian custody, a named diver (Volodymyr Z.) protected by Poland, a named former commander-in-chief (Zaluzhnyi) connected by leaked reporting, a yacht and a route. And yet no single judicial body can close the loop — Sweden and Denmark have declined, Germany's warrant has not become a verdict, Poland blocks extradition, Italy has not tried its prisoner. The 28.7% on C2 reflects that compression: the evidence has narrowed to a single hypothesis within Ukrainian attribution, but not produced the one proceeding that could convert named suspicion into finding." },
};

const CLAIM_TITLE = "Who bombed the Nord Stream?";
const CLAIM_META  = "Form 2 · contested attribution · adjudication_mode = distributional";

// ============================================================================
// STYLING TOKENS
// ============================================================================

const V03_colors = {
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

function V03_Rule({ className = "" }) {
  return <div className={className} style={{ height: 1, background: V03_colors.rule }} />;
}

function V03_Tag({ children, tone = "default" }) {
  const tones = {
    default: { bg: V03_colors.paperDeep, fg: V03_colors.inkSoft, bd: V03_colors.rule },
    primary: { bg: "#F4E4E0", fg: V03_colors.primary, bd: V03_colors.primarySoft },
    secondary:{ bg: "#E4ECF4", fg: V03_colors.secondary, bd: V03_colors.secondarySoft },
    mute:    { bg: "transparent", fg: V03_colors.inkMute, bd: V03_colors.rule },
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

function v03_candColor(c) {
  if (c === "C2") return V03_colors.primary;
  if (c === "C3") return V03_colors.secondary;
  if (c === "C_insufficient") return "#7A7A7A";
  if (c === "C_unknown") return "#A89F8A";
  if (c === "C1") return "#5A5A5A";
  return "#CEC7B5";
}

// Minimalist visual identifier for each candidate. Country flags rendered as
// simplified rectangles; meta-candidates use an abstract geometric mark.
// Returns an SVG element sized w x h; works inside both HTML and SVG contexts.
function V03_CandIcon({ cand, w = 16, h = 11 }) {
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
          <circle cx="8" cy="5.5" r="2.2" fill="none" stroke={V03_colors.inkMute} strokeWidth="1"/>
          <circle cx="8" cy="5.5" r="0.6" fill={V03_colors.inkMute}/>
        </svg>
      );
    case "C_unknown": // Outside candidate set — question mark
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <text x="8" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
                fontSize="9" fontWeight="600" fill={V03_colors.inkMute}>?</text>
        </svg>
      );
    case "C_insufficient": // Inconclusive — em-dash
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <line x1="3" y1="5.5" x2="13" y2="5.5" stroke={V03_colors.inkMute} strokeWidth="1.3"/>
        </svg>
      );
    default:
      return <svg width={w} height={h} style={{ flexShrink: 0 }} />;
  }
}

// ============================================================================
// FULLSCREEN GRAPH
// ============================================================================

function V03_FullscreenGraph({
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

  const selectedEvObj = V03_EVIDENCE.find(e=>e.id===selectedEv);
  const selectedSupports = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)>0).map(e=>e.to)) : null;
  const selectedOpposes  = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)<0).map(e=>e.to)) : null;
  // Hover-level support/oppose — hovering an evidence should also signal its
  // target candidates (lighter than selection: stroke emphasis only, no fill).
  // Without this, hover evidence lights edges but not candidates — the chain
  // feels broken at the candidate end.
  const hoverEvObj = hoverEv && hoverEv !== selectedEv ? V03_EVIDENCE.find(e=>e.id===hoverEv) : null;
  const hoverSupports = hoverEvObj ? new Set(hoverEvObj.edges.filter(e=>(e.pol||0)>0).map(e=>e.to)) : null;
  const hoverOpposes  = hoverEvObj ? new Set(hoverEvObj.edges.filter(e=>(e.pol||0)<0).map(e=>e.to)) : null;
  const focusEv = selectedEv || hoverEv;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width:"100%", height:"100%", display:"block" }}>
      {/* Column headers */}
      <text x={LEFT_X} y={height * 0.055}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11"
            letterSpacing="1.4"
            fill={V03_colors.inkMute}
            textAnchor="start">
        V03_EVIDENCE · {evs.length} ADMITTED
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
        const isSilence = ev.silence;
        return (
          <g key={`ev-dot-${ev.id}`}
             style={{ opacity: dim ? 0.3 : 1, transition:"opacity 0.3s" }}>
            {cluster && (
              <circle cx={LEFT_X} cy={y} r={12}
                      fill="none" stroke={V03_colors.warn}
                      strokeWidth="0.9" strokeDasharray="2,2"
                      opacity={0.7}/>
            )}
            {isSilence && (
              <rect x={LEFT_X - 8} y={y - 8} width="16" height="16"
                    fill="none" stroke={V03_colors.inkMute}
                    strokeWidth="0.8" strokeDasharray="2,2" opacity={0.55}/>
            )}
            <circle cx={LEFT_X} cy={y}
                    r={isSel ? 8 : isHov ? 7 : 5}
                    fill={isSel ? V03_colors.ink : (isSilence ? V03_colors.paperDeep : V03_colors.paper)}
                    stroke={V03_colors.ink}
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
          const isSilenceEdge = edge.mod === "silence";
          const isFocusEv = focusEv === ev.id;
          const isHoverCand = hoverCand === edge.to;
          const anyFocus = focusEv || hoverCand;
          const inFocus = isFocusEv || isHoverCand;
          const dim = anyFocus && !inFocus;

          let stroke = V03_colors.inkMute, strokeW = 0.7, dash = "";
          if (isSilenceEdge) {
            stroke = edge.silence_type === "political_cost" ? V03_colors.warn : V03_colors.inkMute;
            strokeW = 0.8 + edge.s * 1.5;
            dash = "1,3";  // very short dashes = silence
          } else if (pol > 0) {
            stroke = edge.to === "C2" ? V03_colors.primary
                   : edge.to === "C3" ? V03_colors.secondary
                   : V03_colors.ink;
            strokeW = 0.8 + edge.s * 2.4;
            dash = "";
          } else if (pol < 0) {
            stroke = V03_colors.inkMute;
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
        const metaText = `${ev.published} · cred ${ev.credibility.toFixed(2)}${ev.silence ? " · silence" : ""}`;
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
                    fill={V03_colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X - 20} y={y + 4}
                  textAnchor="end"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize={isFocus ? 12 : 11}
                  fill={isFocus ? V03_colors.ink : V03_colors.inkSoft}
                  fontWeight={isFocus ? 600 : 400}
                  letterSpacing="0.3"
                  style={{ transition:"all 0.15s" }}>{ev.id}</text>
            {/* Main label — halo only when focused */}
            {isFocus && (
              <rect x={LEFT_X + 14} y={y - 9}
                    width={mainLabelWidth} height={18}
                    fill={V03_colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X + 18} y={y + 4}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={isFocus ? 14 : 13}
                  fill={isFocus ? V03_colors.ink : (ev.silence ? V03_colors.inkMute : V03_colors.inkSoft)}
                  fontWeight={isFocus ? 500 : 400}
                  fontStyle={ev.silence ? "italic" : "normal"}
                  style={{ transition:"all 0.15s" }}>
              {labelText}
            </text>
            {/* Meta (date + credibility) — halo only when focused */}
            {isFocus && (
              <rect x={LEFT_X + 14} y={y + 9}
                    width={metaLabelWidth} height={13}
                    fill={V03_colors.paper} opacity={0.9}/>
            )}
            <text x={LEFT_X + 18} y={y + 19}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="10"
                  fill={V03_colors.inkMute}
                  letterSpacing="0.3"
                  opacity={isFocus ? 1 : 0.75}>
              {metaText}
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
        // Hover-level connection — lighter visual (stroke emphasis, no fill)
        const isHoverSupported = hoverSupports?.has(c);
        const isHoverOpposed = hoverOpposes?.has(c);
        const isHoverConnected = isHoverSupported || isHoverOpposed;
        const cc = v03_candColor(c);
        const fill = isSupported ? cc : V03_colors.paper;
        const radius = 6 + v * Math.min(width, height) * 0.05;
        const isConnectedEither = isSupported || isOpposed || isHoverConnected;
        const dim = (focusEv && !isConnectedEither)
                 || (hoverCand && hoverCand !== c);
        const candText = V03_CAND_READABLE[c] || V03_CANDIDATES[c].label;
        const pctText = `${(v*100).toFixed(1)}%`;

        // Stroke: selection > candidate-hover > hover-connection > default
        const strokeWidth = isHover ? 2.4
                          : (isSupported || isOpposed) ? 2
                          : isHoverConnected ? 1.8
                          : 1.2;
        const strokeDasharray = isOpposed ? "3,2"
                              : isHoverOpposed ? "2,3"
                              : "";

        return (
          <g key={c}
             onMouseEnter={()=>setHoverCand(c)}
             onMouseLeave={()=>setHoverCand(null)}
             style={{ cursor:"default", opacity: dim ? 0.35 : 1, transition:"opacity 0.3s" }}>
            <circle cx={RIGHT_X} cy={y} r={radius}
                    fill={fill}
                    stroke={cc}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    opacity={isHover ? 1 : 0.92}
                    style={{ transition:"all 0.4s cubic-bezier(.2,.7,.2,1)" }}/>
            {/* Flag/icon positioned just before the C-code label */}
            <g transform={`translate(${RIGHT_X + radius + 14}, ${y - 14})`}>
              <V03_CandIcon cand={c} w={16} h={11} />
            </g>
            <text x={RIGHT_X + radius + 14 + 22} y={y - 5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="11"
                  fill={V03_colors.inkSoft}
                  letterSpacing="0.6">{c}</text>
            <text x={RIGHT_X + radius + 14} y={y + 12}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={v > 0.15 ? 15 : 13.5}
                  fill={V03_colors.ink}
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
// OVERLAY V03_TIMELINE
// ============================================================================

function V03_TimelineBar({ idx, setIdx }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hoverTick, setHoverTick] = useState(null);

  const onMove = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    const frac = x / r.width;
    const n = Math.round(frac * (V03_TIMELINE.length - 1));
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

  const pct = (idx / (V03_TIMELINE.length - 1)) * 100;
  const hoverTP = hoverTick != null ? V03_TIMELINE[hoverTick] : null;
  const hoverPct = hoverTick != null ? (hoverTick / (V03_TIMELINE.length - 1)) * 100 : null;

  return (
    <div
      ref={trackRef}
      onMouseDown={(e)=>{ setDragging(true); onMove(e.clientX); }}
      style={{
        position:"relative", height: 42, cursor:"pointer",
        width:"100%", userSelect:"none",
      }}
    >
      <div style={{ position:"absolute", top: 21, left: 0, right: 0, height: 1, background: V03_colors.rule }} />
      <div style={{
        position:"absolute", top: 21, left: 0, width: `${pct}%`, height: 1,
        background: V03_colors.ink, transition: dragging ? "none" : "width 0.4s",
      }} />
      {V03_TIMELINE.map((t, i) => {
        const x = (i / (V03_TIMELINE.length - 1)) * 100;
        const active = i <= idx;
        const current = i === idx;
        const turningPoint = TURNING_POINTS[t.tag];
        const isTurning = !!turningPoint;
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
            {/* Turning-point vertical spike — extends up above the label */}
            {isTurning && (
              <div style={{
                position:"absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                width: 1.5, height: 7,
                background: current ? V03_colors.primary : V03_colors.warn,
                opacity: active ? 1 : 0.4,
                transition: "all 0.2s",
              }}/>
            )}
            <div style={{
              fontFamily:"'Instrument Sans', sans-serif",
              fontSize: current ? 11.5 : 10.5,
              color: current ? V03_colors.primary
                    : hoverTick === i ? V03_colors.ink
                    : isTurning && active ? V03_colors.warn
                    : (active ? V03_colors.inkSoft : V03_colors.muted),
              letterSpacing: 0.1,
              marginBottom: 8,
              fontWeight: (current || hoverTick === i || isTurning) ? 600 : 400,
              whiteSpace: "nowrap",
              transition:"all 0.15s",
              lineHeight: 1,
            }}>{t.label}</div>
            {/* Turning-point ticks are diamond-shaped; regular ticks are circles */}
            {isTurning ? (
              <div style={{
                width: current ? 10 : (hoverTick === i ? 8 : active ? 7 : 5),
                height: current ? 10 : (hoverTick === i ? 8 : active ? 7 : 5),
                background: current ? V03_colors.primary : (active ? V03_colors.warn : V03_colors.muted),
                transform: "rotate(45deg)",
                border: current ? `1.5px solid ${V03_colors.paper}` : "none",
                boxShadow: current ? `0 0 0 1px ${V03_colors.primary}` : "none",
                marginTop: current ? -1 : 0,
                transition:"all 0.15s",
              }} />
            ) : (
              <div style={{
                width: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
                height: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
                borderRadius: "50%",
                background: current ? V03_colors.primary : (active ? V03_colors.ink : V03_colors.muted),
                border: current ? `2px solid ${V03_colors.paper}` : "none",
                boxShadow: current ? `0 0 0 1px ${V03_colors.primary}` : "none",
                marginTop: current ? -2 : 0,
                transition:"all 0.15s",
              }} />
            )}
            {/* date label under dot, only for current */}
            {current && (
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: V03_colors.primary, letterSpacing: 0.4,
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
            color: V03_colors.ink, lineHeight: 1.4, fontWeight: 400,
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

function V03_DistributionOverlay({ distribution, hoverCand, setHoverCand, idx, playing, onPlayToggle }) {
  const ordered = CAND_ORDER.map(k => ({ k, v: distribution[k] || 0 }));
  const tp = V03_TIMELINE[idx];
  const u = UNDERSTANDING[tp.tag] || { head: "—" };
  const turningPoint = TURNING_POINTS[tp.tag];

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
            color: V03_colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
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
                border: playing ? `1px solid ${V03_colors.ink}` : `1px solid ${V03_colors.rule}`,
                background: playing ? V03_colors.ink : "transparent",
                cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s",
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e)=>{
                if (!playing) {
                  e.currentTarget.style.background = V03_colors.paperDeep;
                  e.currentTarget.style.borderColor = V03_colors.inkSoft;
                }
              }}
              onMouseLeave={(e)=>{
                if (!playing) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = V03_colors.rule;
                }
              }}
              aria-label={playing ? "Pause timeline" : "Play timeline"}
              title={playing ? "Pause timeline" : "Play timeline"}
            >
              {playing ? (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <rect x="1" y="1" width="2" height="7" fill={V03_colors.paper}/>
                  <rect x="5" y="1" width="2" height="7" fill={V03_colors.paper}/>
                </svg>
              ) : (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <path d="M1.5 1 L7 4.5 L1.5 8 Z" fill={V03_colors.inkSoft}/>
                </svg>
              )}
            </button>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 10.5,
            color: V03_colors.primary, letterSpacing: 0.2,
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
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke={V03_colors.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Turning-point banner — appears when current idx is a major inflection.
          Warn (gold-brown) color distinguishes from primary red (current-state signal).
          Positioned above the Understanding head so the reader's eye catches it first. */}
      {turningPoint && (
        <div style={{
          padding: "10px 14px 11px",
          borderTop: `1px solid ${V03_colors.ruleSoft}`,
          background: "rgba(184, 144, 46, 0.07)",
          animation: "fadeIn 0.3s ease-out",
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap: 6, marginBottom: 5,
          }}>
            {/* Diamond marker — matches timeline bar's turning-point tick */}
            <div style={{
              width: 7, height: 7,
              background: V03_colors.warn,
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}/>
            <div style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
              color: V03_colors.warn, letterSpacing: 1,
              textTransform:"uppercase", fontWeight: 600,
            }}>
              Turning point
            </div>
            <div style={{
              marginLeft: "auto",
              fontFamily:"'Fraunces', serif", fontSize: 13, fontStyle:"italic",
              color: V03_colors.warn, fontVariantNumeric:"tabular-nums",
              fontWeight: 500,
            }}>
              Δ {turningPoint.delta} pts
            </div>
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 14, fontStyle:"italic",
            color: V03_colors.ink, lineHeight: 1.3, letterSpacing: -0.1,
          }}>
            {turningPoint.reason}
          </div>
        </div>
      )}

      {/* Understanding head — always visible, even when collapsed */}
      <div style={{
        padding: collapsed ? "12px 14px 12px" : "14px 14px 14px",
        fontFamily:"'Fraunces', serif",
        fontSize: 15.5, lineHeight: 1.25,
        color: V03_colors.ink, letterSpacing: -0.1,
        fontStyle:"italic",
        borderTop: turningPoint ? "none" : `1px solid ${V03_colors.ruleSoft}`,
        borderBottom: collapsed ? "none" : `1px solid ${V03_colors.ruleSoft}`,
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
                     background: v03_candColor(k),
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
                <div style={{ width: 7, height: 7, background: v03_candColor(k) }}/>
                <V03_CandIcon cand={k} w={16} h={11} />
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                  color: V03_colors.ink, fontWeight: k === "C2" ? 500 : 400,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                }}>
                  {V03_CAND_READABLE[k]}
                </div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 14.5, fontStyle:"italic",
                  color: k === "C2" ? V03_colors.primary : V03_colors.ink,
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
// V03_EVIDENCE DRAWER (slides from right)
// ============================================================================

function V03_EvidenceDrawer({ ev, onClose }) {
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
    ? V03_EVIDENCE.filter(e => e.cluster === ev.cluster && e.id !== ev.id)
    : [];
  const clusterLabel = ev.cluster ? (clusterLabels[ev.cluster] || ev.cluster) : null;
  const clusterExplain = ev.cluster ? clusterExplanations[ev.cluster] : null;

  return (
    <div style={{
      position:"absolute", top: 0, right: 0, bottom: 0,
      width: 440, maxWidth: "44vw",
      background: V03_colors.paper,
      borderLeft: `1px solid ${V03_colors.rule}`,
      boxShadow: "-20px 0 48px rgba(26,26,26,0.05)",
      padding: "48px 36px 40px",
      overflowY:"auto", zIndex: 20,
      animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)",
    }}>
      <button onClick={onClose}
        style={{ position:"absolute", top: 48, right: 36, background:"transparent", border:"none",
                 fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute,
                 letterSpacing: 0.8, cursor:"pointer", textTransform:"uppercase",
                 padding: "4px 6px" }}>close ×</button>

      <div style={{ display:"flex", alignItems:"baseline", gap: 10 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 14, color: V03_colors.ink, fontWeight: 600 }}>{ev.id}</div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute, letterSpacing: 0.5 }}>{ev.published}</div>
      </div>
      <div style={{ fontFamily:"'Fraunces', serif", fontSize: 26, lineHeight: 1.2, color: V03_colors.ink, marginTop: 8, letterSpacing: -0.3 }}>
        {ev.label}
      </div>

      <div style={{ marginTop: 18, display:"flex", gap: 6, flexWrap:"wrap" }}>
        <V03_Tag tone="default">{ev.source_type}</V03_Tag>
        <V03_Tag tone="mute">credibility {ev.credibility.toFixed(2)}</V03_Tag>
        {ev.silence && <V03_Tag tone="primary">silence · {ev.silence_type}</V03_Tag>}
      </div>

      <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: V03_colors.inkSoft, marginTop: 22 }}>
        {ev.detail}
      </div>

      {/* SILENCE TYPE section — only for silence edges */}
      {ev.silence && (
        <div style={{
          marginTop: 26, padding: "16px 18px",
          background: V03_colors.paperDeep,
          border: `1px solid ${V03_colors.ruleSoft}`,
          borderLeft: `3px solid ${ev.silence_type === "political_cost" ? V03_colors.warn : V03_colors.inkMute}`,
          borderRadius: 2,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: V03_colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 10,
          }}>
            Silence Edge · v0.3.1 Extension
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 15, fontStyle:"italic",
            color: V03_colors.ink, lineHeight: 1.4, marginBottom: 10,
          }}>
            {ev.silence_type === "investigated_excluded" && "Silence because a question was investigated and found empty."}
            {ev.silence_type === "framework_bias" && "Silence because a candidate falls outside institutional focus."}
            {ev.silence_type === "political_cost" && "Silence because speaking has political consequences."}
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: V03_colors.inkSoft, lineHeight: 1.55,
          }}>
            {ev.silence_type === "investigated_excluded" && "Carries real negative evidential weight: the question was taken seriously, evaluated against evidence, and excluded. The consensus silence reflects a genuine epistemic finding."}
            {ev.silence_type === "framework_bias" && "Near-neutral weight (slightly negative). The silence doesn't indicate the candidate is impossible — only that it doesn't fit the institutions' usual inquiry frame."}
            {ev.silence_type === "political_cost" && "Weak positive weight for the candidate. Counter-suppression logic: when silence is politically motivated rather than evidentially driven, the suppression itself is information about the candidate."}
          </div>
        </div>
      )}

      {/* CLUSTER section — only when this evidence belongs to a cluster */}
      {ev.cluster && (
        <div style={{
          marginTop: 26, padding: "16px 18px",
          background: V03_colors.paperDeep,
          border: `1px solid ${V03_colors.ruleSoft}`,
          borderLeft: `3px solid ${V03_colors.warn}`,
          borderRadius: 2,
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap: 8, marginBottom: 10,
          }}>
            {/* Dashed ring matching the graph's cluster marker */}
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="5.5" fill="none" stroke={V03_colors.warn}
                      strokeWidth="1" strokeDasharray="2,2"/>
            </svg>
            <div style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: V03_colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            }}>
              Correlated source cluster
            </div>
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
            color: V03_colors.ink, marginBottom: 10, lineHeight: 1.3,
            letterSpacing: -0.1,
          }}>
            {clusterLabel}
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: V03_colors.inkSoft, lineHeight: 1.55, marginBottom: siblings.length > 0 ? 14 : 0,
          }}>
            {clusterExplain}
          </div>

          {siblings.length > 0 && (
            <>
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: V03_colors.inkMute, letterSpacing: 0.6, textTransform:"uppercase",
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
                      color: V03_colors.inkMute, letterSpacing: 0.3,
                    }}>{s.id}</span>
                    <span style={{
                      fontFamily:"'Instrument Sans', sans-serif",
                      color: V03_colors.ink,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                    }}>{s.label}</span>
                    <span style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: V03_colors.inkMute, textAlign:"right",
                    }}>{s.published}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 12 }}>
          Edges · {ev.edges.length}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 8 }}>
          {ev.edges.map((e,i)=> {
            const polSym = e.pol > 0 ? "+" : e.pol < 0 ? "−" : "0";
            const polColor = e.pol > 0
              ? (e.to === "C2" ? V03_colors.primary : (e.to === "C3" ? V03_colors.secondary : V03_colors.ink))
              : (e.pol < 0 ? V03_colors.inkMute : V03_colors.muted);
            return (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"22px 56px 1fr 50px",
                alignItems:"center", gap: 10,
                padding:"8px 0", borderBottom:`1px solid ${V03_colors.ruleSoft}`,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
              }}>
                <span style={{ color: polColor, fontSize: 17, fontWeight: 700 }}>{polSym}</span>
                <span style={{ color: V03_colors.inkSoft }}>{e.to}</span>
                <div>
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5, color: V03_colors.ink, lineHeight: 1.3 }}>
                    {V03_CAND_READABLE[e.to] || V03_CANDIDATES[e.to]?.label}
                  </div>
                  <div style={{ color: V03_colors.inkMute, fontSize: 9.5, marginTop: 2, letterSpacing: 0.3 }}>{e.mod}</div>
                </div>
                <span style={{ color: V03_colors.ink, textAlign:"right", fontVariantNumeric:"tabular-nums",
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
// MASTHEAD + V03_TIMELINE OVERLAY
// ============================================================================

function V03_Masthead({ activeEventCount, activeSilenceCount, totalEventCount, totalSilenceCount, currentLabel, currentDate, isFullscreen, onToggleFullscreen }) {
  return (
    <div style={{
      borderBottom: `1px solid ${V03_colors.rule}`,
      background: V03_colors.paper,
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
            letterSpacing: -0.3, color: V03_colors.ink,
            lineHeight: 1,
          }}>Trace</div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: V03_colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
            lineHeight: 1,
          }}>
            Case file 001 · v0.3.1 · {activeEventCount}/{totalEventCount} events · {activeSilenceCount}/{totalSilenceCount} silences
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
            color: V03_colors.inkSoft, letterSpacing: 0.1,
            lineHeight: 1,
            fontWeight: 500,
          }}>
            {currentLabel}
          </div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: V03_colors.inkMute, letterSpacing: 0.6,
            lineHeight: 1,
          }}>
            {currentDate}
          </div>
        </div>

        <button onClick={onToggleFullscreen}
          style={{
            background: isFullscreen ? V03_colors.ink : "transparent",
            color: isFullscreen ? V03_colors.paper : V03_colors.inkSoft,
            border: `1px solid ${isFullscreen ? V03_colors.ink : V03_colors.rule}`,
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
              e.currentTarget.style.color = V03_colors.ink;
              e.currentTarget.style.borderColor = V03_colors.ink;
            }
          }}
          onMouseLeave={(e)=>{
            if (!isFullscreen) {
              e.currentTarget.style.color = V03_colors.inkSoft;
              e.currentTarget.style.borderColor = V03_colors.rule;
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
          background: V03_colors.primary,
          flexShrink: 0,
        }}/>
        <div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: V03_colors.primary, letterSpacing: 1.4,
            textTransform:"uppercase", fontWeight: 500,
            marginBottom: 6,
          }}>
            Under investigation
          </div>
          <h1 style={{
            fontFamily:"'Fraunces', serif",
            fontSize: "clamp(22px, 2.4vw, 30px)",
            fontWeight: 400, fontStyle:"italic",
            color: V03_colors.ink,
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
// V03_TIMELINE OVERLAY (floats at bottom of graph area)
// ============================================================================

function V03_TimelineOverlay({ idx, setIdx }) {
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
        <V03_TimelineBar idx={idx} setIdx={setIdx} />
      </div>
    </div>
  );
}

// ============================================================================
// ATTRIBUTION READOUT (replaces PromotionGate + RawScoresView)
// Explains in plain language: why 28.7% can't be read as 28.7% confidence,
// and why the claim cannot be promoted despite being the strongest hypothesis.
// ============================================================================

function V03_AttributionReadout({ distribution, raw_scores }) {
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
    label: V03_CAND_READABLE[k],
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
    <div style={{ padding: "48px 56px 56px", background: V03_colors.paper }}>
      <V03_Rule />

      {/* SECTION HEADER */}
      <div style={{ marginTop: 36, marginBottom: 44, maxWidth: 1100 }}>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: V03_colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 14,
        }}>
          Reading the distribution
        </div>
        <div style={{
          fontFamily:"'Fraunces', serif", fontSize: 38, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: -0.6, color: V03_colors.ink,
        }}>
          Why the strongest hypothesis sits at <span style={{ color: V03_colors.primary, fontStyle:"italic" }}>28.7%</span> — and why that number doesn't mean what it looks like.
        </div>
      </div>

      {/* TWO-PANEL VIEW COMPARISON */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap: 48,
        marginBottom: 64,
      }}>
        {/* Left: softmax */}
        <div style={{
          padding: 28, border: `1px solid ${V03_colors.rule}`, borderRadius: 2,
          background: V03_colors.paper,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: V03_colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 6,
          }}>
            what the display shows
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 21, fontStyle:"italic",
            lineHeight: 1.3, color: V03_colors.ink, letterSpacing: -0.15,
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
                    color: V03_colors.ink, marginBottom: 5,
                  }}>
                    {label}
                  </div>
                  <div style={{
                    height: 4, background: V03_colors.paperDeep, borderRadius: 1,
                    overflow:"hidden",
                  }}>
                    <div style={{
                      width: `${soft}%`, height: "100%",
                      background: v03_candColor(k),
                      transition:"width 0.5s cubic-bezier(.2,.7,.2,1)",
                    }}/>
                  </div>
                </div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                  color: k === "C2" ? V03_colors.primary : V03_colors.ink,
                  fontVariantNumeric:"tabular-nums", textAlign:"right",
                }}>
                  {soft.toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55 }}>%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 22, paddingTop: 18,
            borderTop: `1px solid ${V03_colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            lineHeight: 1.55, color: V03_colors.inkSoft,
          }}>
            Softmax spreads weight across <em>all</em> candidates, including ones with no supporting evidence. It's a display convention, not a probability.
          </div>
        </div>

        {/* Right: raw */}
        <div style={{
          padding: 28, border: `1px solid ${V03_colors.ink}`, borderRadius: 2,
          background: V03_colors.paper,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: V03_colors.primary, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 6,
          }}>
            what the evidence actually says
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 21, fontStyle:"italic",
            lineHeight: 1.3, color: V03_colors.ink, letterSpacing: -0.15,
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
                      color: V03_colors.ink, marginBottom: 5,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      position:"relative", height: 4, background: V03_colors.paperDeep,
                      borderRadius: 1,
                    }}>
                      {/* center axis */}
                      <div style={{
                        position:"absolute", left:"50%", top: -2, bottom: -2,
                        width: 1, background: V03_colors.inkMute, opacity: 0.4,
                      }}/>
                      <div style={{
                        position:"absolute",
                        left: pos ? "50%" : `${50 - w}%`,
                        width: `${w}%`, height: "100%",
                        background: pos
                          ? (k === "C2" ? V03_colors.primary
                            : k === "C3" ? V03_colors.secondary
                            : k === "C_insufficient" ? "#7A7A7A"
                            : V03_colors.inkSoft)
                          : V03_colors.muted,
                        transition:"all 0.5s cubic-bezier(.2,.7,.2,1)",
                      }}/>
                    </div>
                  </div>
                  <div style={{
                    fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                    color: k === "C2" ? V03_colors.primary : V03_colors.ink,
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
            borderTop: `1px solid ${V03_colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            lineHeight: 1.55, color: V03_colors.inkSoft,
          }}>
            Raw scores sum each evidence node's contribution directly. Ukraine — state-directed scores <strong style={{ color: V03_colors.primary }}>+1.81</strong>, dominating every other candidate. The evidence is far more concentrated than 28.7% suggests.
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
            color: V03_colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 14,
          }}>
            Five conditions gate promotion
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.15, color: V03_colors.ink, letterSpacing: -0.4,
          }}>
            Even as the leading hypothesis, the Ukrainian state-directed claim cannot be promoted to settled fact.
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
            color: V03_colors.inkMute, marginTop: 18, lineHeight: 1.5,
          }}>
            All five conditions must clear for Trace to close a claim. Currently {passing} of 5 pass.
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap: 18 }}>
          {gates.map((g, i) => (
            <div key={i} style={{
              display:"grid", gridTemplateColumns: "28px 1fr",
              gap: 20, paddingBottom: 20,
              borderBottom: i < gates.length - 1 ? `1px solid ${V03_colors.ruleSoft}` : "none",
            }}>
              {/* pass/fail indicator */}
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${g.pass ? V03_colors.ink : V03_colors.primary}`,
                background: g.pass ? V03_colors.ink : "transparent",
                marginTop: 4,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {g.pass ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5 L4 7 L8 3" stroke={V03_colors.paper} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <div style={{ width: 8, height: 1.5, background: V03_colors.primary }}/>
                )}
              </div>

              <div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 19,
                  color: V03_colors.ink, lineHeight: 1.3, letterSpacing: -0.1,
                }}>
                  {g.title}
                </div>
                <div style={{
                  display:"flex", gap: 14, flexWrap:"wrap",
                  marginTop: 6, alignItems:"baseline",
                }}>
                  <span style={{
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    color: V03_colors.inkMute, letterSpacing: 0.5,
                  }}>
                    {g.rule}
                  </span>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.rule }}>·</span>
                  <span style={{
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    color: g.pass ? V03_colors.ink : V03_colors.primary, letterSpacing: 0.5,
                  }}>
                    {g.current}
                  </span>
                  {!g.pass && g.gap && (
                    <>
                      <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.rule }}>·</span>
                      <span style={{
                        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                        color: V03_colors.inkMute, letterSpacing: 0.4,
                      }}>
                        {g.gap}
                      </span>
                    </>
                  )}
                </div>
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5,
                  color: V03_colors.inkSoft, marginTop: 10, lineHeight: 1.6,
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

function V03_ConsistencyBadge({ level }) {
  const map = {
    consistent: { label: "consistent", color: V03_colors.ink, bg: V03_colors.paperDeep },
    partial:    { label: "partial",    color: V03_colors.warn, bg: "#F4ECD8" },
    divergent:  { label: "divergent",  color: V03_colors.primary, bg: "#F4E4E0" },
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

function V03_ExternalComparison() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  return (
    <div style={{ padding: "32px 56px 56px", background: V03_colors.paper }}>
      <V03_Rule />

      <div style={{ marginTop: 32, display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72 }}>
        <div>
          <div style={{
            display:"flex", alignItems:"center", gap: 10, marginBottom: 20,
          }}>
            {/* Grok wordmark */}
            <div style={{
              display:"flex", alignItems:"center", gap: 8,
              padding: "5px 10px",
              border: `1px solid ${V03_colors.rule}`,
              borderRadius: 2,
              background: V03_colors.paperDeep,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20 L14 4 L18 4 L8 20 Z" fill={V03_colors.ink}/>
                <path d="M14 12 L20 12 L20 20 L16 20 L16 16 L14 16 Z" fill={V03_colors.ink}/>
              </svg>
              <span style={{
                fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                color: V03_colors.ink, fontWeight: 600, letterSpacing: 0.5,
              }}>Grok</span>
            </div>
            <span style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: V03_colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
            }}>
              comparison · xAI
            </span>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 14 }}>
            Sanity check
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.4, color: V03_colors.ink }}>
            Does the protocol produce the same answer as a prose summary?
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5, color: V03_colors.inkSoft, marginTop: 20, lineHeight: 1.6 }}>
            The two systems agree on <em>what happened</em>. Where they differ is <em>how uncertainty is reported</em> — one narrates and hedges, the other names the gates that block promotion.
          </div>

          {/* Toggle button for Grok's full response — panel itself opens in the right column */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={()=>setOpen(!open)}
              style={{
                background: open ? V03_colors.ink : "transparent",
                border: `1px solid ${open ? V03_colors.ink : V03_colors.rule}`,
                padding: "10px 16px",
                borderRadius: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: open ? V03_colors.paper : V03_colors.inkSoft,
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e)=>{ if (!open) e.currentTarget.style.background = V03_colors.paperDeep; }}
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
                border: `1px solid ${V03_colors.ruleSoft}`,
                borderRadius: 2,
                background: V03_colors.paper,
                padding: "22px 24px",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap: 16, marginBottom: 18 }}>
                  <div style={{
                    fontFamily:"'Fraunces', serif", fontSize: 19, lineHeight: 1.3,
                    color: V03_colors.ink, letterSpacing: -0.1, flex: 1,
                  }}>
                    {p.q}
                  </div>
                  <V03_ConsistencyBadge level={p.consistency} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 28 }}>
                  <div>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: V03_colors.inkMute, letterSpacing: 0.9,
                      textTransform:"uppercase", marginBottom: 10,
                      display:"flex", alignItems:"center", gap: 6,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius:"50%", background: V03_colors.inkMute, display:"inline-block" }}/>
                      Grok · unstructured
                    </div>
                    <div style={{
                      fontFamily:"'Fraunces', serif", fontStyle:"italic",
                      fontSize: 17.5, lineHeight: 1.5, color: V03_colors.ink,
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
                      color: V03_colors.inkSoft, lineHeight: 1.6,
                    }}>
                      {p.grok}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: V03_colors.primary, letterSpacing: 0.9,
                      textTransform:"uppercase", marginBottom: 10,
                      display:"flex", alignItems:"center", gap: 6,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius:"50%", background: V03_colors.primary, display:"inline-block" }}/>
                      Trace · v0.3
                    </div>
                    <div style={{
                      fontFamily:"'Fraunces', serif", fontStyle:"italic",
                      fontSize: 17.5, lineHeight: 1.5, color: V03_colors.ink,
                      letterSpacing: -0.15, marginBottom: 12,
                    }}>
                      <span style={{
                        backgroundImage: "linear-gradient(180deg, transparent 62%, rgba(160, 58, 44, 0.20) 62%, rgba(160, 58, 44, 0.20) 94%, transparent 94%)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                        padding: "0 2px",
                      }}>
                        {p.traceKey}
                      </span>
                    </div>
                    <div style={{
                      fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
                      color: V03_colors.inkSoft, lineHeight: 1.6,
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
            background: V03_colors.paperDeep,
            border: `1px solid ${V03_colors.rule}`,
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
              paddingBottom: 18, borderBottom: `1px solid ${V03_colors.ruleSoft}`,
            }}>
              <div>
                {/* Brand eyebrow */}
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  color: V03_colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
                  marginBottom: 10,
                }}>
                  Grok (xAI)
                </div>
                {/* Query — the focal content of this header block */}
                <div style={{
                  fontFamily:"'Fraunces', serif", fontStyle:"italic",
                  fontSize: 17, color: V03_colors.ink, letterSpacing: -0.1,
                  lineHeight: 1.3,
                  marginBottom: 8,
                }}>
                  "Who bombed the Nord Stream?"
                </div>
                {/* Retrieval footer */}
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                  color: V03_colors.inkMute, letterSpacing: 0.5,
                }}>
                  Retrieved April 2026
                </div>
              </div>
              {/* Compact language toggle */}
              <div style={{
                display:"inline-flex", flexShrink: 0,
                border: `1px solid ${V03_colors.rule}`, borderRadius: 2,
                background: V03_colors.paper, padding: 1,
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
                      background: lang === opt.key ? V03_colors.ink : "transparent",
                      color: lang === opt.key ? V03_colors.paper : V03_colors.inkMute,
                      transition:"all 0.15s",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <V03_GrokMarkdown text={lang === "en" ? GROK_EN : GROK_ZH} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lightweight Grok markdown renderer — handles ## h2, - bullets, paragraphs.
function V03_GrokMarkdown({ text }) {
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
      ? <strong key={k} style={{ fontWeight: 700, color: V03_colors.ink }}>{seg.text}</strong>
      : <React.Fragment key={k}>{seg.text}</React.Fragment>
  );

  return (
    <div style={{ fontFamily:"'Fraunces', serif", color: V03_colors.ink }}>
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h3 key={i} style={{
              fontFamily:"'Fraunces', serif",
              fontSize: 17, fontWeight: 500,
              color: V03_colors.ink, letterSpacing: -0.15,
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
                  color: V03_colors.inkSoft,
                }}>
                  <span style={{
                    flexShrink: 0,
                    color: V03_colors.inkMute,
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
            color: isLead ? V03_colors.ink : V03_colors.inkSoft,
            fontWeight: 400,
            margin: isLead ? "0 0 22px" : "0 0 14px",
            paddingBottom: isLead ? 22 : 0,
            borderBottom: isLead ? `1px solid ${V03_colors.ruleSoft}` : "none",
          }}>
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}

// ============================================================================
// V03_LIMITS SECTION
// ============================================================================

function V03_LimitsSection() {
  const items = [
    { k:"L1", t:"Magic numbers remain.", d:"The shrinkage factor (0.3) and evidence threshold (0.1) are now stakeable parameters rather than constants, but still have no first-principles derivation. Consolidation, not elimination." },
    { k:"L2", t:"Cluster declaration is an attack surface.", d:"Malicious under- or over-declaration of source_cluster_id can bias aggregation. Mitigated by making cluster declaration itself stakeable — not eliminated." },
    { k:"L3", t:"Cross-MAS outputs are not directly comparable.", d:"Modality weights are MAS-bound. A distribution produced under MAS_default cannot be numerically averaged with one from MAS_historical without an explicit normalizer." },
    { k:"L4", t:"Aggregation correctness cannot be verified against ground truth.", d:"For contested claims, no oracle exists. Trace does not claim truth; Trace claims transparent, staked, auditable evidence structure. A philosophical boundary, not a fixable defect." },
  ];
  return (
    <div style={{ padding: "56px 56px 96px", background: V03_colors.paper }}>
      <V03_Rule />
      <div style={{ marginTop: 44, display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 14 }}>
            Acknowledged limits
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.4, color: V03_colors.ink }}>
            What this display cannot tell you.
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 16, color: V03_colors.inkMute, marginTop: 20, lineHeight: 1.5 }}>
            Per spec v0.3 Part VII — these are boundaries, not bugs.
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
          {items.map(item => (
            <div key={item.k} style={{
              display:"grid", gridTemplateColumns:"54px 1fr", gap: 22,
              paddingBottom: 20, borderBottom:`1px solid ${V03_colors.ruleSoft}`,
            }}>
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 11, color: V03_colors.inkMute,
                letterSpacing: 0.8, paddingTop: 4,
              }}>v0.3–{item.k}</div>
              <div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 20, color: V03_colors.ink, lineHeight: 1.3 }}>{item.t}</div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14, color: V03_colors.inkSoft, marginTop: 6, lineHeight: 1.6 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 72, paddingTop: 24, borderTop:`1px solid ${V03_colors.rule}`,
                    display:"flex", justifyContent:"space-between", alignItems:"baseline",
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: V03_colors.inkMute, letterSpacing: 0.6, flexWrap:"wrap", gap: 12 }}>
        <span>Trace protocol specification v0.3 · end-to-end pressure test April 2026</span>
        <span>Case file 001 · Nord Stream attribution</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

function TraceV03Experience() {
  const [idx, setIdx] = useState(V03_TIMELINE.length - 1);
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

  const tp = V03_TIMELINE[idx];
  const cutoffDate = tp.date;

  const activeEvidence = useMemo(() =>
    V03_EVIDENCE.filter(e => e.published <= cutoffDate)
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
        if (prev >= V03_TIMELINE.length - 1) {
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
      if (idx >= V03_TIMELINE.length - 1) setIdx(0);
      setPlaying(true);
    }
  };

  // Wrap setIdx so any manual user interaction stops playback
  const setIdxUser = (newIdx) => {
    if (playing) setPlaying(false);
    if (typeof newIdx === "function") setIdx(newIdx);
    else setIdx(newIdx);
  };

  const selectedEvObj = V03_EVIDENCE.find(e => e.id === selectedEv);

  const stageW = 1400, stageH = 880;

  return (
    <div style={{
      fontFamily: "'Instrument Sans', sans-serif",
      background: V03_colors.paper,
      color: V03_colors.ink,
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { margin: 0; background: ${V03_colors.paper}; }
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
        <V03_Masthead
          activeEventCount={activeEvidence.filter(e => !e.silence).length}
          activeSilenceCount={activeEvidence.filter(e => e.silence).length}
          totalEventCount={V03_EVIDENCE.filter(e => !e.silence).length}
          totalSilenceCount={V03_EVIDENCE.filter(e => e.silence).length}
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
        background: V03_colors.paper,
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
          <V03_FullscreenGraph
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
        <V03_DistributionOverlay
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
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5, color: V03_colors.inkMute,
          letterSpacing: 0.5, pointerEvents:"none",
        }}>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="22" height="8" style={{ flexShrink: 0 }}>
              <line x1="0" y1="2" x2="22" y2="2" stroke={V03_colors.primary} strokeWidth="2"/>
              <line x1="0" y1="6" x2="22" y2="6" stroke={V03_colors.secondary} strokeWidth="2"/>
            </svg>
            supports
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="22" height="6" style={{ flexShrink: 0 }}>
              <line x1="0" y1="3" x2="22" y2="3" stroke={V03_colors.inkMute} strokeWidth="1.4" strokeDasharray="3,3"/>
            </svg>
            opposes
          </span>
          <span
            title="Evidence sharing a common origin (e.g. a single intelligence ecosystem). Combined weight is dampened so correlated reports aren't counted as independent."
            style={{ display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", cursor:"help" }}>
            <svg width="22" height="14" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="7" r="5.5" fill="none" stroke={V03_colors.warn} strokeWidth="0.9" strokeDasharray="2,2"/>
            </svg>
            correlated source
          </span>
          <span
            title="v0.3.1 silence edge — models institutional silence as evidence. Weight and direction depend on silence_type."
            style={{ display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", cursor:"help" }}>
            <svg width="22" height="14" style={{ flexShrink: 0 }}>
              <rect x="3" y="2" width="16" height="10" fill="none" stroke={V03_colors.inkMute} strokeWidth="0.8" strokeDasharray="2,2"/>
            </svg>
            silence evidence
          </span>
        </div>

        {/* Timeline overlay — bottom of graph area */}
        <V03_TimelineOverlay idx={idx} setIdx={setIdxUser} />

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
                color: zoom <= 0.7 ? V03_colors.muted : V03_colors.inkSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding: 0, transition:"color 0.15s",
              }}
              onMouseEnter={(e)=>{ if (zoom > 0.7) e.currentTarget.style.color = V03_colors.ink; }}
              onMouseLeave={(e)=>{ if (zoom > 0.7) e.currentTarget.style.color = V03_colors.inkSoft; }}
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
                borderLeft: `1px solid ${V03_colors.rule}`,
                borderRight: `1px solid ${V03_colors.rule}`,
                background:"transparent",
                cursor:"pointer",
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                color: V03_colors.inkSoft, letterSpacing: 0.4,
                fontVariantNumeric:"tabular-nums",
                transition:"color 0.15s",
                minWidth: 46,
              }}
              onMouseEnter={(e)=>{ e.currentTarget.style.color = V03_colors.ink; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.color = V03_colors.inkSoft; }}
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
                color: zoom >= 1.6 ? V03_colors.muted : V03_colors.inkSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding: 0, transition:"color 0.15s",
              }}
              onMouseEnter={(e)=>{ if (zoom < 1.6) e.currentTarget.style.color = V03_colors.ink; }}
              onMouseLeave={(e)=>{ if (zoom < 1.6) e.currentTarget.style.color = V03_colors.inkSoft; }}
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
            color: panReady ? V03_colors.primary : V03_colors.inkMute,
            letterSpacing: 0.5, textTransform:"uppercase",
            pointerEvents:"none",
            transition:"color 0.15s, opacity 0.2s",
            opacity: panning ? 0.4 : 1,
          }}>
            <span style={{
              display:"inline-flex", alignItems:"center",
              padding: "2px 6px",
              border: `1px solid ${panReady ? V03_colors.primary : V03_colors.rule}`,
              borderRadius: 2,
              fontSize: 8.5,
              lineHeight: 1,
              transition:"border-color 0.15s",
            }}>⌘</span>
            <span style={{ fontSize: 8.5 }}>or</span>
            <span style={{
              display:"inline-flex", alignItems:"center",
              padding: "2px 8px",
              border: `1px solid ${panReady ? V03_colors.primary : V03_colors.rule}`,
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
              color: V03_colors.ink,
              border: `1px solid ${V03_colors.rule}`,
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
        <V03_EvidenceDrawer ev={selectedEvObj} onClose={()=>setSelectedEv(null)} />
      </div>

      {/* Everything below the graph is hidden in fullscreen */}
      {!fullscreen && (
        <>
          {/* SANITY CHECK (Grok comparison) — now the first analysis section */}
          <V03_ExternalComparison />

          {/* ATTRIBUTION READOUT — explains distribution + promotion gates */}
          <V03_AttributionReadout distribution={tp.distribution} raw_scores={tp.raw_scores} />

          {/* V03_LIMITS */}
          <V03_LimitsSection />
        </>
      )}
    </div>
  );
}


// ############################################################################
// V0.4 IN-PROGRESS EXPERIENCE
// ----------------------------------------------------------------------------
// The v0.4 protocol work: Pearl-level evidence classification, fourteen-
// language coverage, five reconstructive storylines, possibility-space reader.
// Currently rendered underneath a lock overlay until the analysis is complete.
// ############################################################################

// ============================================================================
// DATA — v0.3 mode (preserved verbatim from original demo)
// ============================================================================

const TIMELINE_V03 = [
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

const CANDIDATES_V03 = {
  C2: {label:"Ukrainian state-directed"},
  C3: {label:"Ukrainian independent"},
  C_insufficient:{label:"Evidence cannot distinguish", meta:true},
  C_unknown:     {label:"Outside enumerated candidates", meta:true},
  C1: {label:"US state"},
  C4: {label:"Russian self-sabotage"},
  C5: {label:"UK state"},
  C6: {label:"Other actor"},
};

const CAND_READABLE_V03 = {
  C2: "Ukraine — state-directed",
  C3: "Ukraine — independent",
  C1: "United States",
  C4: "Russia — self-sabotage",
  C5: "United Kingdom",
  C6: "Other actor",
  C_insufficient: "Inconclusive",
  C_unknown: "Outside candidate set",
};

const CAND_ORDER_V03 = ["C2","C3","C_insufficient","C_unknown","C1","C4","C5","C6"];

// v0.3 evidence (unchanged)
const EVIDENCE_V03 = [
  { id:"E1",  label:"Hersh Substack report", published:"2023-02-08",
    source_type:"testimony", credibility:0.35, cluster:"single_source",
    edges:[{to:"C1",pol:+1,mod:"testimonial",s:0.29},{to:"C4",pol:-1,mod:"testimonial",s:0.15}],
    detail:"Seymour Hersh report alleging US Navy placed charges during BALTOPS 22. Single anonymous source." },
  { id:"E2",  label:"White House denial", published:"2023-02-08",
    source_type:"official_statement", credibility:0.50, cluster:null,
    edges:[{to:"C1",pol:-1,mod:"testimonial",s:0.32}],
    detail:"Official US denial issued same day as Hersh publication." },
  { id:"E3",  label:"NYT pro-Ukrainian group report", published:"2023-03-07",
    source_type:"testimony", credibility:0.55, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.55},{to:"C3",pol:+1,mod:"testimonial",s:0.60}],
    detail:"NYT attributes act to a pro-Ukrainian group, sourced to US officials familiar with intelligence." },
  { id:"E6",  label:"Die Zeit / ARD / SZ: Andromeda forensic", published:"2023-04-01",
    source_type:"forensic", credibility:0.75, cluster:null,
    edges:[{to:"C1",pol:-1,mod:"correlational",s:0.50},{to:"C2",pol:+1,mod:"causal",s:0.70},{to:"C3",pol:+1,mod:"causal",s:0.80}],
    detail:"Yacht Andromeda linked forensically to dive operation. Strongest causal-modality evidence." },
  { id:"E7",  label:"Kiesewetter: evidence too thin", published:"2023-04-15",
    source_type:"derived_analysis", credibility:0.60, cluster:null,
    edges:[{to:"C2",pol:-1,mod:"correlational",s:0.20},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Bundestag intelligence committee member challenges Andromeda narrative." },
  { id:"E5",  label:"WaPo leaked docs / CIA June warning", published:"2023-06-01",
    source_type:"documentary", credibility:0.70, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"correlational",s:0.55},{to:"C3",pol:+1,mod:"correlational",s:0.40}],
    detail:"Discord leaks reveal CIA warning Germany in June 2022 of Ukrainian plan." },
  { id:"E4",  label:"WaPo + Spiegel: Chervinsky named", published:"2023-11-01",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.55},{to:"C3",pol:+1,mod:"testimonial",s:0.50}],
    detail:"Roman Chervinsky named as coordinator. Ukraine denies." },
  { id:"E8",  label:"Sweden closes investigation", published:"2024-02-07",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Sweden's prosecution authority closes investigation without naming perpetrator." },
  { id:"E9",  label:"Denmark closes investigation", published:"2024-02-26",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Denmark follows Sweden." },
  { id:"E10", label:"Germany: EU arrest warrant, Volodymyr Z.", published:"2024-06-20",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.45},{to:"C3",pol:+1,mod:"causal",s:0.55}],
    detail:"German Federal Prosecutor issues EU arrest warrant for Ukrainian diver Volodymyr Z." },
  { id:"E12", label:"Z. exits Poland on embassy diplomatic plates", published:"2024-07-06",
    source_type:"open_source_intelligence", credibility:0.70, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.70},{to:"C3",pol:-1,mod:"causal",s:0.40}],
    detail:"Volodymyr Z. departs Poland in a vehicle carrying Ukrainian embassy diplomatic plates." },
  { id:"E15", label:"Berlin refuses US-intel question", published:"2024-07-17",
    source_type:"official_statement", credibility:0.70, cluster:null,
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.175}],
    detail:"German government declines to confirm or deny US intelligence involvement." },
  { id:"E11", label:"WSJ: Zaluzhnyi knowledge narrative", published:"2024-08-14",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    edges:[{to:"C2",pol:+1,mod:"testimonial",s:0.65},{to:"C3",pol:-1,mod:"testimonial",s:0.30}],
    detail:"WSJ: former Commander-in-Chief Zaluzhnyi had knowledge of plan." },
  { id:"E16", label:"Weltwoche: USS Kearsarge UUV capability", published:"2024-10-15",
    source_type:"open_source_intelligence", credibility:0.45, cluster:null,
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.30}],
    detail:"Reopens technical feasibility of US-state hypothesis." },
  { id:"E13", label:"Italian arrest of Serhii K.", published:"2025-08-21",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"causal",s:0.55},{to:"C3",pol:+1,mod:"causal",s:0.50}],
    detail:"Italian authorities arrest alleged coordinator." },
  { id:"E14", label:"Poland refuses extradition", published:"2025-10-17",
    source_type:"official_statement", credibility:0.80, cluster:null,
    edges:[{to:"C2",pol:+1,mod:"correlational",s:0.30},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Polish government declines extradition request." },
];

// ============================================================================
// DATA — v0.4 mode (fourteen-language intake, post-cross-examination)
// ============================================================================

// v0.4 candidates: C2 split into a/b/c + new C7 compound candidate
const CAND_ORDER_V04 = ["C2b","C_insufficient","C7","C2c","C2a","C_unknown","C5","C6","C1","C4","C3"];

const CAND_READABLE_V04 = {
  C2b: "Ukraine — military bypass (Zaluzhnyi track)",
  C2c: "Ukraine — agency authorization",
  C2a: "Ukraine — presidential authorization",
  C3:  "Ukraine — independent rogue operators",
  C1:  "United States",
  C4:  "Russia — self-sabotage",
  C5:  "United Kingdom",
  C6:  "Other actor",
  C7:  "Ukrainian ops with CIA enabling",
  C_insufficient: "Inconclusive",
  C_unknown: "Outside candidate set",
};

// Shortened labels for tight UI surfaces
const CAND_READABLE_V04_SHORT = {
  C2b: "Ukraine — military bypass",
  C2c: "Ukraine — agency",
  C2a: "Ukraine — presidential",
  C3:  "Ukraine — independent",
  C1:  "United States",
  C4:  "Russia — self-sabotage",
  C5:  "United Kingdom",
  C6:  "Other actor",
  C7:  "Ukrainian + CIA enabling",
  C_insufficient: "Inconclusive",
  C_unknown: "Outside set",
};

// ----------------------------------------------------------------------------
// Candidate buckets — top-level grouping for graph display (v0.4)
// Ukraine aggregate: C2a + C2b + C2c + C3
// US involvement aggregate: C1 + C7 (overlap: C7 also appears in narrative support of Ukraine)
// Everything else is its own bucket.
// ----------------------------------------------------------------------------
const BUCKETS_V04 = [
  { id:"B_UA", label:"Ukraine", flag:"C2b", members:["C2b","C2a","C2c","C3"], expandable:true,
    overlap:null },
  { id:"B_US", label:"US involvement", flag:"C1", members:["C1","C7"], expandable:true,
    overlap:"This bucket includes C7 (Ukrainian operations with CIA enabling), which also contributes to Ukraine's α narrative. The two buckets therefore sum to slightly over 100% — the excess is the overlap itself." },
  { id:"B_UK", label:"United Kingdom", flag:"C5", members:["C5"], expandable:false, overlap:null },
  { id:"B_RU", label:"Russia — self-sabotage", flag:"C4", members:["C4"], expandable:false, overlap:null },
  { id:"B_OTHER", label:"Other actor", flag:"C6", members:["C6"], expandable:false, overlap:null },
  { id:"B_UNK", label:"Outside candidate set", flag:"C_unknown", members:["C_unknown"], expandable:false, overlap:null },
  { id:"B_INS", label:"Inconclusive", flag:"C_insufficient", members:["C_insufficient"], expandable:false, overlap:null },
];

function bucketWeight(bucket, distribution) {
  return bucket.members.reduce((s, c) => s + (distribution[c] || 0), 0);
}

// Evidence importance — primary gets rendered by default on the graph; secondary is
// collapsed into aggregate nodes by cluster/type, expandable on demand.
// Criterion: if removing this evidence would materially change a storyline's shape, it's primary.
const EVIDENCE_IMPORTANCE = {
  // PRIMARY — 13 items
  E1:  "primary",   // Hersh — β's foundation
  E6:  "primary",   // Andromeda forensic — α's strongest causal
  E10: "primary",   // German EU arrest warrant
  E11: "primary",   // WSJ Zaluzhnyi
  E12: "primary",   // Embassy diplomatic plates
  E13: "primary",   // Italian arrest of Serhii K.
  E17: "primary",   // BGH ruling
  E18: "primary",   // Polish Łubowski ruling
  E23: "primary",   // Trump statement
  E24: "primary",   // Hanning ex-BND
  E25: "primary",   // Sachs UN Security Council
  E29: "primary",   // Der Spiegel 2026 Zaluzhnyi approved
  E30: "primary",   // t-online CIA son

  // SECONDARY — 24 items (default-hidden, shown as aggregated cluster nodes)
  E2:  "secondary", // WH denial
  E3:  "secondary", // NYT pro-Ukrainian group (cluster: western_intel_leaks)
  E4:  "secondary", // Chervinsky named (cluster: western_intel_leaks)
  E5:  "secondary", // CIA June warning (cluster: western_intel_leaks)
  E7:  "secondary", // Kiesewetter skepticism
  E8:  "secondary", // Sweden closes
  E9:  "secondary", // Denmark closes
  E14: "secondary", // Poland refuses extradition
  E15: "secondary", // Berlin refuses AfD question
  E16: "secondary", // Kearsarge UUV (low cred)
  E19: "secondary", // Italian Cassazione reversals
  E20: "secondary", // Italian court cites Polish precedent
  E21: "secondary", // Sikorski Thank you USA
  E22: "secondary", // Tusk case closed
  E26: "secondary", // SS-750 Russian ship photos
  E27: "secondary", // Truss "it's done"
  E28: "secondary", // Naryshkin SVR
  E31: "secondary", // Il Fatto Zelensky approved-then-withdrew
  E32: "secondary", // Kanzleramtschef Third Party Rule (coverage_meta)
  E33: "secondary", // UN 12 abstentions (coverage_meta)
  E34: "secondary", // Germany refuses AfD (coverage_meta)
  E35: "secondary", // Polish procedural failure (coverage_meta)
  E36: "secondary", // Kuznetsov defense
  E37: "secondary", // Ukrainian-language media proud tone
};

// Secondary evidence grouped into clusters for aggregated display on the graph
const SECONDARY_CLUSTERS = [
  { id:"SC_WIL", label:"Western intel leaks", color:"warn",
    members:["E3","E4","E5"],
    summary:"Three reports citing anonymous US/Western officials (NYT, WaPo, WaPo+Spiegel). Share likely common origin in single intel ecosystem; dampened as correlated." },
  { id:"SC_COV", label:"Coverage-meta signals", color:"meta",
    members:["E32","E33","E34","E35"],
    summary:"Four signals of how the investigation is being managed: German Chancellor's Office Third Party Rule; UN Security Council 12 abstentions; Berlin refuses AfD question; Polish EAW procedural failure. Feeds μ storyline." },
  { id:"SC_CLOSE", label:"Nordic closures", color:"meta",
    members:["E8","E9"],
    summary:"Sweden and Denmark close their investigations without attribution, within weeks of each other." },
  { id:"SC_CHALL", label:"Challenges & counter-signals", color:"inkMute",
    members:["E2","E7","E15","E16","E36"],
    summary:"White House denial, Kiesewetter skepticism, Berlin refusal, low-cred Kearsarge narrative, Kuznetsov defense. Low weight; kept in exhibit." },
  { id:"SC_POL", label:"Political-layer signals", color:"primary",
    members:["E14","E21","E22"],
    summary:"Poland refuses extradition; Sikorski 'Thank you USA'; Tusk endorses Łubowski. State-level political signals around protection narrative." },
  { id:"SC_IT", label:"Italian judicial procedural", color:"primary",
    members:["E19","E20","E31"],
    summary:"Three-step Cassazione reversal; Italian court citing Polish precedent; Il Fatto's temporal-split narrative reconciling WSJ and Spiegel." },
  { id:"SC_ADV", label:"Adversarial-source testimony", color:"inkMute",
    members:["E27","E28"],
    summary:"Truss SMS (low cred); Naryshkin SVR statement (event-cred ≠ content-cred). Part of exhibit for epistemic completeness." },
  { id:"SC_FOR", label:"Forensic signals (secondary)", color:"warn",
    members:["E26"],
    summary:"SS-750 Russian ship photographed over blast zone four days prior. Most plausible read: monitoring, not execution." },
  { id:"SC_NARR", label:"Narrative-contradiction signals", color:"meta",
    members:["E37"],
    summary:"Ukrainian-language media tone (pride) contradicts official denial by Podolyak — an intra-position signal." },
];

function getEvidenceBy(id) {
  return EVIDENCE_V04.find(e => e.id === id);
}

// Post-aggregation distribution (modality-corrected, cluster-dampened, CMEG-propagated, softmax τ=1.5)
// These percentages come from the audit-corrected computation.
const DISTRIBUTION_V04 = {
  C2b: 0.335,
  C_insufficient: 0.136,
  C7: 0.067,
  C2c: 0.064,
  C2a: 0.063,
  C_unknown: 0.063,
  C5: 0.062,
  C6: 0.058,
  C1: 0.057,
  C4: 0.054,
  C3: 0.042,
};

const RAW_SCORES_V04 = {
  C2b: +2.649,
  C2a: +0.149,
  C2c: +0.171,
  C7:  +0.238,
  C5:  +0.106,
  C1:  -0.010,
  C4:  -0.106,
  C3:  -0.450,
  C6:   0.000,
  C_unknown: +0.135,
  C_insufficient: +1.295,
};

// Evidence layer — 37 items (16 v0.3 + 21 v0.4 new)
// Edges use modality-corrected values from audit round.
const EVIDENCE_V04 = [
  // === v0.3 preserved, edges re-mapped to C2a/b/c + modality-corrected ===
  { id:"E1",  label:"Hersh Substack report", published:"2023-02-08",
    source_type:"testimony", credibility:0.35, cluster:"single_source",
    language:"en", positions:["anglophone_counter_narrative","independent_journalism"],
    edges:[{to:"C1",pol:+1,mod:"testimonial",s:0.29},{to:"C4",pol:-1,mod:"testimonial",s:0.15}],
    detail:"Single anonymous source. The narrative that built β. Cross-examination finds the 17-hour blast interval (F3) incompatible with sonar-triggered one-shot detonation; the fourth intact pipeline (F12) inconsistent with professional US Navy operation." },
  { id:"E2",  label:"White House denial", published:"2023-02-08",
    source_type:"official_statement", credibility:0.50, cluster:null,
    language:"en", positions:["us_government"],
    edges:[{to:"C1",pol:-1,mod:"testimonial",s:0.32}],
    detail:"Same-day denial. Weight bounded by obvious interest of issuing party." },
  { id:"E3",  label:"NYT pro-Ukrainian group report", published:"2023-03-07",
    source_type:"testimony", credibility:0.55, cluster:"western_intel_leaks",
    language:"en", positions:["anglophone_mainstream","western_intel_ecosystem"],
    edges:[{to:"C2b",pol:+1,mod:"testimonial",s:0.40},{to:"C3",pol:+1,mod:"testimonial",s:0.55}],
    detail:"NYT attribution to pro-Ukrainian group. First pivot away from US, but via Western-intel channel — correlated with later WaPo/Spiegel leaks." },
  { id:"E6",  label:"Die Zeit / ARD / SZ: Andromeda forensic", published:"2023-04-01",
    source_type:"forensic", credibility:0.75, cluster:null,
    language:"de", positions:["german_mainstream_investigative"],
    edges:[{to:"C1",pol:-1,mod:"correlational",s:0.50},{to:"C2b",pol:+1,mod:"correlational",s:0.60},{to:"C3",pol:+1,mod:"correlational",s:0.65},{to:"C7",pol:+1,mod:"correlational",s:0.30}],
    detail:"Andromeda yacht: HMX residue, DNA, fingerprints. Forensic-level for 'Ukrainian team executed'; correlational only for distinguishing state-layer candidates (cannot by itself separate C2a/b/c)." },
  { id:"E7",  label:"Kiesewetter: evidence too thin", published:"2023-04-15",
    source_type:"derived_analysis", credibility:0.60, cluster:null,
    language:"de", positions:["german_political_opposition"],
    edges:[{to:"C2b",pol:-1,mod:"correlational",s:0.20},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Bundestag intelligence committee skepticism. Primarily a Layer-4 challenge to E6." },
  { id:"E5",  label:"WaPo leaked docs / CIA June warning", published:"2023-06-01",
    source_type:"documentary", credibility:0.70, cluster:"western_intel_leaks",
    language:"en", positions:["anglophone_mainstream","western_intel_ecosystem"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.50},{to:"C3",pol:+1,mod:"correlational",s:0.30}],
    detail:"Discord leaks: CIA warned Germany June 2022 of Ukrainian plan. Provenance chain MIVD→CIA→Germany." },
  { id:"E4",  label:"WaPo + Spiegel: Chervinsky named", published:"2023-11-01",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    language:"en", positions:["anglophone_mainstream","german_mainstream","western_intel_ecosystem"],
    edges:[{to:"C2b",pol:+1,mod:"testimonial",s:0.50},{to:"C3",pol:+1,mod:"testimonial",s:0.35}],
    detail:"Col. Roman Chervinsky named as coordinator. Ukraine denies. Part of western_intel_leaks cluster." },
  { id:"E8",  label:"Sweden closes investigation", published:"2024-02-07",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    language:"sv", positions:["nordic_prosecutorial","western_aligned_state"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Jurisdiction framed as 'kan antas saknas' (may be presumed lacking). Danish legal scholar Buhl disputes this framing." },
  { id:"E9",  label:"Denmark closes investigation", published:"2024-02-26",
    source_type:"inconclusive_statement", credibility:0.80, cluster:null,
    language:"da", positions:["nordic_prosecutorial","western_aligned_state"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.60}],
    detail:"Denmark follows Sweden. Danish Defence Academy experts later report being barred from public discussion." },
  { id:"E10", label:"Germany: EU arrest warrant, Volodymyr Z.", published:"2024-06-20",
    source_type:"official_statement", credibility:0.80, cluster:null,
    language:"de", positions:["german_judicial"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.45},{to:"C3",pol:+1,mod:"correlational",s:0.45}],
    detail:"EU arrest warrant for Ukrainian diver. Causal for 'Ukrainian individual targeted'; correlational for state-layer distinction." },
  { id:"E11", label:"WSJ: Zaluzhnyi knowledge narrative", published:"2024-08-14",
    source_type:"derived_analysis", credibility:0.65, cluster:"western_intel_leaks",
    language:"en", positions:["anglophone_mainstream","western_intel_ecosystem"],
    edges:[{to:"C2b",pol:+1,mod:"testimonial",s:0.65},{to:"C3",pol:-1,mod:"testimonial",s:0.30}],
    detail:"Zaluzhnyi named as knowing; narrows from rogue operators toward military chain. Cluster-dampened with E3/E4/E5." },
  { id:"E12", label:"Z. exits Poland on embassy diplomatic plates", published:"2024-07-06",
    source_type:"open_source_intelligence", credibility:0.70, cluster:null,
    language:"de", positions:["german_mainstream_investigative","polish_territorial"],
    edges:[{to:"C2b",pol:+1,mod:"causal",s:0.45},{to:"C3",pol:-1,mod:"causal",s:0.40}],
    detail:"Strongest direct evidence of state-level protection. Causal for 'state apparatus enabled exit'; correlational for the specific Zaluzhnyi-bypass layer." },
  { id:"E13", label:"Italian arrest of Serhii K.", published:"2025-08-21",
    source_type:"official_statement", credibility:0.80, cluster:null,
    language:"it", positions:["italian_judicial","european_judicial"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.50},{to:"C3",pol:+1,mod:"correlational",s:0.40}],
    detail:"Alleged coordinator detained in Rimini. A judicial proceedings event, not a verdict." },
  { id:"E14", label:"Poland refuses extradition", published:"2025-10-17",
    source_type:"official_statement", credibility:0.80, cluster:null,
    language:"pl", positions:["polish_judicial","polish_state"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.35},{to:"C3",pol:-1,mod:"correlational",s:0.20}],
    detail:"Judge Łubowski's ruling frames the act as 'organized action by wartime services' — a judicial categorization bordering on legitimation." },
  { id:"E15", label:"Berlin refuses AfD question on US intel", published:"2024-07-17",
    source_type:"official_statement", credibility:0.70, cluster:null,
    language:"de", positions:["german_government"],
    edges:[],
    detail:"Government refusal to confirm or deny US involvement. In v0.4 this edge is removed from C1 and re-routed: the refusal is a coverage-meta signal (feeds μ storyline), not direct evidence for any enumerated candidate." },
  { id:"E16", label:"Weltwoche: USS Kearsarge UUV capability", published:"2024-10-15",
    source_type:"open_source_intelligence", credibility:0.45, cluster:null,
    language:"de", positions:["german_counter_narrative"],
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.30}],
    detail:"Keeps β technically alive but at low credibility." },

  // === v0.4 new evidence: judicial tier ===
  { id:"E17", label:"BGH ruling: 'foreign government intelligence agency'", published:"2025-12-10",
    source_type:"official_statement", credibility:0.90, cluster:"german_judicial",
    language:"de", positions:["german_judicial","european_judicial","high_authority"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.45},{to:"C2c",pol:+1,mod:"correlational",s:0.30},{to:"C2a",pol:+1,mod:"correlational",s:0.15},{to:"C3",pol:-1,mod:"correlational",s:0.60},{to:"C7",pol:+1,mod:"correlational",s:0.10}],
    detail:"Federal Court of Justice (3rd Criminal Senate): the operation is 'with high probability an intelligence-agency action ordered by a foreign government' (ausländische Geheimdienste im Auftrag einer fremden Regierung). Rejects Kuznetsov's functional-immunity appeal — implying state authorship does not shield the individual. Deliberately does NOT name Ukraine." },
  { id:"E18", label:"Polish Judge Łubowski ruling", published:"2025-10-17",
    source_type:"official_statement", credibility:0.85, cluster:null,
    language:"pl", positions:["polish_judicial","european_judicial"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.60},{to:"C2c",pol:+1,mod:"correlational",s:0.40},{to:"C3",pol:-1,mod:"correlational",s:0.55}],
    detail:"'Organized action by services of a warring state' — a judicial categorization that treats Ukrainian state authorship as the operative frame, not a hypothesis." },
  { id:"E19", label:"Italian Cassazione reversals", published:"2025-11-27",
    source_type:"official_statement", credibility:0.85, cluster:null,
    language:"it", positions:["italian_judicial","european_judicial"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.30}],
    detail:"Oct 17 extradition denied → Nov 19 approved → Nov 27 transfer. Three-step judicial volatility. A meta-signal of European judicial non-consensus — contributes to μ." },
  { id:"E20", label:"Italian court cites Polish ruling as precedent", published:"2025-11-19",
    source_type:"derived_analysis", credibility:0.65, cluster:null,
    language:"it", positions:["italian_judicial","european_judicial"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.25}],
    detail:"Defense attorney Canestrini invokes Polish Judge Łubowski's functional-immunity reasoning in an Italian courtroom. Cross-jurisdictional position transfer." },

  // === v0.4 new evidence: political-layer signals ===
  { id:"E21", label:"Sikorski 'Thank you, USA' + Żurawlew medal willingness", published:"2022-09-27",
    source_type:"documentary", credibility:0.75, cluster:null,
    language:"pl", positions:["polish_state","polish_mainstream","eastern_european_hawk"],
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.35},{to:"C2b",pol:+1,mod:"correlational",s:0.30}],
    detail:"Polish Foreign Minister tweets 'Thank you, USA' hours after the blasts. Rzeczpospolita later reports he would grant asylum and a medal to suspect Żurawlew." },
  { id:"E22", label:"Tusk: 'case closed'", published:"2025-10-20",
    source_type:"official_statement", credibility:0.85, cluster:null,
    language:"pl", positions:["polish_state","eu_mainstream"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.25},{to:"C3",pol:-1,mod:"correlational",s:0.15}],
    detail:"Polish Prime Minister publicly endorses Łubowski's non-extradition decision. State-level validation of legitimation narrative." },
  { id:"E23", label:"Trump: 'Russia wasn't involved, many people know'", published:"2025-05-14",
    source_type:"adversarial_first_party", credibility:0.65, cluster:null,
    language:"en", positions:["us_government","us_counter_narrative","adversarial_first_party"],
    edges:[{to:"C1",pol:+1,mod:"testimonial",s:0.40},{to:"C4",pol:-1,mod:"testimonial",s:0.30}],
    detail:"A sitting US president signals that the prior US administration was involved, without formal statement. Event-cred high (he said it publicly), content-cred bounded by political motive." },
  { id:"E24", label:"Ex-BND chief Hanning: Poland and both presidents approved", published:"2024-09-22",
    source_type:"testimony", credibility:0.85, cluster:null,
    language:"de", positions:["german_intelligence_ex","independent_voice","high_authority"],
    edges:[{to:"C2a",pol:+1,mod:"testimonial",s:0.55},{to:"C2b",pol:+1,mod:"testimonial",s:0.40}],
    detail:"Former Director of German BND in Die Welt: 'The operation must have had Poland's backing, and the approval of both presidents.' A T1-level ex-intelligence figure on the record. Credibility adjusted upward to 0.85 in v0.4." },
  { id:"E25", label:"Jeffrey Sachs at UN Security Council: enumerates 7 Western actors", published:"2023-02-21",
    source_type:"derived_analysis", credibility:0.80, cluster:null,
    language:"en", positions:["academic_authority","independent_voice","un_forum"],
    edges:[{to:"C1",pol:+1,mod:"correlational",s:0.30},{to:"C5",pol:+1,mod:"correlational",s:0.25},{to:"C4",pol:-1,mod:"correlational",s:0.25}],
    detail:"Sachs (Columbia, former UN advisor) enumerates US, UK, Poland, Norway, Germany, Denmark, Sweden as plausible actors — singly or in coordination — and explicitly excludes Russia. Credibility adjusted upward to 0.80 in v0.4." },

  // === v0.4 new evidence: investigation-layer ===
  { id:"E26", label:"SS-750 Russian ship: 26 photos (Swedish prosecutor confirmed)", published:"2022-09-22",
    source_type:"forensic", credibility:0.80, cluster:null,
    language:"ru", positions:["nordic_maritime","russian_state_interest"],
    edges:[{to:"C4",pol:+1,mod:"correlational",s:0.25}],
    detail:"Danish patrol vessel Nymfen photographed SS-750 (deep-sea rescue ship) + mini-sub AS-26 over the blast zone 4 days before detonation. Prosecutor Ljungqvist confirms the photos exist. Most likely reads: Russian monitoring presence, not execution." },
  { id:"E27", label:"Truss 'it's done' SMS to Blinken", published:"2022-09-26",
    source_type:"testimony", credibility:0.45, cluster:null,
    language:"en", positions:["uk_counter_narrative","russian_amplified"],
    edges:[{to:"C5",pol:+1,mod:"testimonial",s:0.35}],
    detail:"Reported SMS from UK PM to US Secretary of State on the day. Event-cred 0.75 (widely reported), content-cred 0.30 (sourcing divergent). Net 0.45." },
  { id:"E28", label:"SVR Chief Naryshkin: direct US/UK involvement", published:"2025-10-21",
    source_type:"official_statement", credibility:0.50, cluster:"russian_state",
    language:"ru", positions:["russian_state","russian_counter_narrative"],
    edges:[{to:"C1",pol:+1,mod:"testimonial",s:0.25},{to:"C5",pol:+1,mod:"testimonial",s:0.25}],
    detail:"Head of Russian Foreign Intelligence Service, formal statement on RT Arabic. Event-cred high (he said it), content-cred low (adversarial source with strategic interest)." },
  { id:"E29", label:"Der Spiegel 2026: Zaluzhnyi approved, Zelensky office uninformed", published:"2026-02-12",
    source_type:"derived_analysis", credibility:0.70, cluster:null,
    language:"de", positions:["german_mainstream_investigative"],
    edges:[{to:"C2b",pol:+1,mod:"testimonial",s:0.60},{to:"C2a",pol:-1,mod:"testimonial",s:0.40},{to:"C3",pol:-1,mod:"testimonial",s:0.30},{to:"C7",pol:+1,mod:"testimonial",s:0.35}],
    detail:"CIA learned of plan in spring 2022 Podol (Kyiv); initially 'not opposed'; later warned but did not stop. Zaluzhnyi authorized; Zelensky office not informed of final version. Operation codename 'Diameter'; ~$300K private Ukrainian financier." },
  { id:"E30", label:"t-online: 'CIA son', explosive of non-Ukrainian origin", published:"2026-04-08",
    source_type:"testimony", credibility:0.60, cluster:null,
    language:"de", positions:["german_mainstream_investigative","compound_attribution"],
    edges:[{to:"C7",pol:+1,mod:"correlational",s:0.60},{to:"C1",pol:+1,mod:"correlational",s:0.30},{to:"C2b",pol:+1,mod:"correlational",s:0.20}],
    detail:"Investigative report: coordinator was a former Ukrainian intelligence officer trained by CIA since 2015; military-grade explosive 'not from Ukraine'. A composite-attribution narrative v0.3 candidate-set could not house; drives the existence of C7." },
  { id:"E31", label:"Il Fatto: Zelensky approved then withdrew; operation continued", published:"2025-11-03",
    source_type:"derived_analysis", credibility:0.55, cluster:null,
    language:"it", positions:["italian_mainstream","european_counter_narrative"],
    edges:[{to:"C2a",pol:+1,mod:"testimonial",s:0.30},{to:"C2b",pol:+1,mod:"testimonial",s:0.45},{to:"C_insufficient",pol:+1,mod:"correlational",s:0.15}],
    detail:"Zelensky initially authorized, then withdrew at US urging — but Zaluzhnyi continued. Reconciles the apparent Spiegel/WSJ contradiction as a temporal split rather than a factual one." },

  // === v0.4 new evidence: coverage-meta (feeds μ storyline) ===
  { id:"E32", label:"Kanzleramtschef invokes Third Party Rule on Bundestag inquiry", published:"2024-09-05",
    source_type:"coverage_meta_evidence", credibility:0.70, cluster:"coverage_meta",
    language:"de", positions:["german_government","information_suppression"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.40}],
    detail:"Chancellor's Office chief Schmidt restricts Bundestag access to intelligence-sharing details. Named individual taking the suppressive action. In v0.4 this no longer carries a direct C1 edge; the suppression itself is μ-evidence, not US-attribution evidence." },
  { id:"E33", label:"UN Security Council: 12 abstentions bury investigation proposal", published:"2023-03-27",
    source_type:"coverage_meta_evidence", credibility:0.80, cluster:"coverage_meta",
    language:"en", positions:["un_forum","geopolitical_drift"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.40}],
    detail:"Russian-sponsored resolution for independent international investigation blocked not by vetoes but by mass abstention. Institutional non-resolution." },
  { id:"E34", label:"Germany refuses AfD question on US-intel participation", published:"2024-07-17",
    source_type:"coverage_meta_evidence", credibility:0.75, cluster:"coverage_meta",
    language:"de", positions:["german_government","information_suppression"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.30}],
    detail:"'For reasons of state welfare' — no answer given. In v0.4 this is strictly a suppression signal, not a US-involvement signal." },
  { id:"E35", label:"Polish prosecutor: procedural failure on German EAW", published:"2024-08-20",
    source_type:"coverage_meta_evidence", credibility:0.75, cluster:"coverage_meta",
    language:"pl", positions:["polish_state","european_judicial_failure"],
    edges:[{to:"C_insufficient",pol:+1,mod:"correlational",s:0.30}],
    detail:"Rzeczpospolita documents the procedural breakdown in Poland's non-execution of the German European Arrest Warrant. Not mere refusal — failure of process." },

  // === v0.4 adversarial testimony and Ukrainian-language ===
  { id:"E36", label:"Kuznetsov defense: 'never left Ukraine'", published:"2025-09-02",
    source_type:"testimony", credibility:0.30, cluster:null,
    language:"uk", positions:["ukrainian_accused_defense","adversarial_testimonial"],
    edges:[{to:"C2b",pol:-1,mod:"testimonial",s:0.10}],
    detail:"The accused's own statement. Directly contradicted by F7 (Andromeda physical evidence) and F8 (arrest records). Kept in the exhibit at low credibility — a defendant's denial is part of the case file even when physically disputed." },
  { id:"E37", label:"Ukrainian-language media proud tone (Focus.ua, UNIAN)", published:"2026-02-14",
    source_type:"derived_analysis", credibility:0.55, cluster:null,
    language:"uk", positions:["ukrainian_media_narrative","internal_contradiction"],
    edges:[{to:"C2b",pol:+1,mod:"correlational",s:0.25}],
    detail:"Ukrainian-language outlets report the operation with pride — 'Ukrainian elite unit blew it up.' Contradicts official Ukrainian denial by Podolyak. Official-vs-media narrative split is itself a meta-signal." },
];

// ============================================================================
// v0.4 ENRICHED EVIDENCE — Pearl-level schema per §2.5
// Fields: title, source, date, source_confidence, reasoning_contribution (array
// of {label, inference}), original_text, cross_references, caveats.
// Keyed by evidence id; merged at render time with EVIDENCE_V04 for edges/
// credibility/language metadata already in the graph layer.
// ============================================================================

const EVIDENCE_V04_ENRICHED = {
  E1: {
    title: "Seymour Hersh alleges US Navy divers planted charges during BALTOPS 22, remote-triggered via Norwegian sonar buoy",
    source: "Seymour Hersh Substack (single anonymous source)",
    date: "2023-02-08",
    source_confidence: 0.35,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "A US-attribution narrative pole",
        inference: "A high-profile US investigative journalist publicly attributes the operation to the Biden administration with a specific execution mechanism. Independent of its truth, it establishes a narrative pole that subsequent reporting must address." },
    ],
    original_text: "Hersh (Substack, 2023-02-08): US Navy divers planted C-4 during BALTOPS 22 exercise in June 2022; Norwegian P-8 Poseidon dropped sonar buoy on 26 September to trigger remote detonation; operation personally authorized by Biden.",
    cross_references: ["F3", "F12", "E2"],
    caveats: "Rests on a single anonymous source. The 17-hour detonation gap (F3) and one surviving strand (F12) are counterfactually incompatible with the sonar-triggered single-shot mechanism. F3 breaks Hersh's specific execution mechanism; it does not touch his macro claim about US motive.",
  },
  E2: {
    title: "White House same-day denial of Hersh report",
    source: "White House National Security Council spokesperson",
    date: "2023-02-08",
    source_confidence: 0.50,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Default baseline: expected denial",
        inference: "Formal same-day denial by the accused principal is the default expected response. Its presence is informative as baseline; its absence would have been more informative." },
    ],
    original_text: "NSC spokesperson Adrienne Watson (2023-02-08): 'This is false and complete fiction.' Pentagon and State Department issued parallel denials.",
    cross_references: ["E1"],
    caveats: "Denial by the accused party has minimal probative value — it is the legally and politically expected response. Absence of denial would have been transformative; presence is the null hypothesis.",
  },
  E3: {
    title: "NYT: 'pro-Ukrainian group' likely responsible, according to US officials briefed on intelligence",
    source: "New York Times, citing anonymous US officials",
    date: "2023-03-07",
    source_confidence: 0.55,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Western-intel pivot to Ukrainian-proxy framing",
        inference: "The timing (one month after Hersh) and the deliberately ambiguous phrasing 'pro-Ukrainian group' reveal a coordinated Western-intelligence-ecosystem pivot away from US attribution toward diffuse Ukrainian proxy framing. The shift is itself a behavioral signal about the intelligence community's preferred narrative." },
    ],
    original_text: "NYT (2023-03-07): 'New intelligence reviewed by US officials suggests that a pro-Ukrainian group carried out the attack on the Nord Stream pipelines last year… officials who have reviewed the intelligence… say there are no firm conclusions about it.'",
    cross_references: ["E4", "E5", "E11"],
    caveats: "This is part of the 'western intelligence leaks' cluster (E3, E4, E5, E11). Multiple outlets citing anonymous officials 'familiar with intelligence' likely share a common origin in a single intelligence ecosystem — Trace dampens their combined weight to avoid double-counting the same story retold.",
  },
  E6: {
    title: "Die Zeit / ARD / SZ joint investigation surfaces Andromeda yacht forensic chain",
    source: "Die Zeit, ARD Kontraste, Süddeutsche Zeitung (joint reporting)",
    date: "2023-04-01",
    source_confidence: 0.75,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Material-forensic track (yacht + residue + DNA)",
        inference: "German mainstream investigative reporting surfaces specific physical evidence chain: rented yacht, forged documents, explosive residue, DNA, fingerprints. Establishes that there is a material-forensic track independent of any single government's claims." },
    ],
    original_text: "Die Zeit / ARD / SZ (2023-04-01): Yacht 'Andromeda' rented in Rostock by individuals using falsified Bulgarian and Romanian identity documents. Boat sailed via Christiansø to blast area. Explosive residue, DNA, and fingerprints recovered from yacht interior.",
    cross_references: ["F2", "F7", "F8"],
    caveats: "Forensic chain establishes execution path, not authorization. It does not by itself distinguish Ukrainian state direction, Ukrainian rogue operators, or foreign-directed Ukrainian personnel.",
  },
  E7: {
    title: "Bundestag intelligence-committee member Kiesewetter: evidence still too thin for attribution",
    source: "Roderich Kiesewetter (CDU), Bundestag Parliamentary Oversight Panel",
    date: "2023-04-15",
    source_confidence: 0.60,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "German institutional hesitation on attribution",
        inference: "A senior German parliamentary intelligence overseer publicly maintains epistemic caution one month after the Andromeda reporting. Reveals institutional hesitation to accept the forensic track as sufficient for state-attribution at that point in time." },
    ],
    original_text: "Kiesewetter (2023-04-15): public statements expressing skepticism about the thinness of the evidence base for attributing the operation to any specific actor; warned against premature closure on a 'false flag' vs 'Ukrainian operation' binary.",
    cross_references: ["E6"],
    caveats: "This is a Layer-4 challenge to E6's evidentiary sufficiency, not independent evidence about the event itself. It is about the epistemic process, not the forensic record.",
  },
  E5: {
    title: "WaPo-leaked Discord documents: CIA warned Germany in June 2022 of imminent Ukrainian attack",
    source: "Washington Post (leaked Discord intel documents)",
    date: "2023-06-06",
    source_confidence: 0.70,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "MIVD→CIA→Germany foreknowledge chain (June 2022)",
        inference: "Documentary confirmation of an intelligence chain MIVD → CIA → Germany in June 2022, three months before the event. Any storyline must accommodate foreknowledge at the Western-intelligence level." },
      { label: "Reconciles conflicts",
        summary: "'Knew but did not stop' — reconciles CIA's public surprise with prior foreknowledge",
        inference: "The 'warned but did not stop' pattern reconciles apparent contradictions between 'US was principal' and 'US was publicly surprised'. Both can be true under a 'knew but chose not to intervene' causal model." },
    ],
    original_text: "WaPo (2023-06-06): 'The Central Intelligence Agency warned Germany in June 2022 that Ukrainian forces were planning an attack on the Nord Stream gas pipelines… Three months later, three of the pipelines' four strands were ruptured.'",
    cross_references: ["F6", "E29", "E3"],
    caveats: "The content and specificity of the warning is not public. 'CIA warned' is consistent with both 'CIA trying to prevent' and 'CIA creating a deniability paper trail' — the two readings that distinguish storyline α from storyline γ.",
  },
  E4: {
    title: "WaPo and Der Spiegel jointly name Col. Roman Chervinsky as operational coordinator",
    source: "Washington Post + Der Spiegel joint reporting",
    date: "2023-11-01",
    source_confidence: 0.65,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Named coordinator with documented state connection",
        inference: "Named individual at the operational coordinator level with documented Ukrainian military background. Shifts executor-class from 'unspecified Ukrainian team' to a specific chain-of-command with identifiable state connection." },
    ],
    original_text: "WaPo + Der Spiegel (2023-11-01): Col. Roman Chervinsky, Ukrainian Special Operations Forces, identified as operational coordinator. Ukraine officially denies. Chervinsky is at the time under a separate domestic prosecution in Ukraine.",
    cross_references: ["E3", "E5", "E11", "E29"],
    caveats: "Part of the 'western intelligence leaks' cluster — multiple outlets citing overlapping sources, treated as correlated. Named coordinator does not establish authorization source: an individual with state background can act under state direction, rogue military direction, or foreign service direction.",
  },
  E8: {
    title: "Sweden closes its Nord Stream investigation citing lack of jurisdiction",
    source: "Swedish Prosecution Authority press release",
    date: "2024-02-07",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Closure without attribution — institutional withdrawal",
        inference: "A national investigation that publicly confirmed both 'definite sabotage' and 'state actor involvement' closes without releasing substantive findings or naming suspects. Pattern-of-closure-without-attribution indicates institutional withdrawal rather than evidentiary exhaustion." },
    ],
    original_text: "Chief prosecutor Mats Ljungqvist (2024-02-07): 'In view of the overall picture, we can establish that Swedish jurisdiction is lacking.' Swedish investigation transferred material to Germany; no suspects named.",
    cross_references: ["E9", "F13", "E37"],
    caveats: "Jurisdictional limits can be genuine. However, Danish legal expert Kenneth Øhlenschlæger Buhl publicly questioned this framing: 'If you say you have jurisdiction, you do, unless others say you don't. Not even the Russians have disputed that Sweden and Denmark have jurisdiction.'",
  },
  E9: {
    title: "Denmark closes its Nord Stream investigation without attribution",
    source: "Copenhagen Police and PET joint statement",
    date: "2024-02-26",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Parallel Nordic closure tightens suppression signal",
        inference: "Denmark follows Sweden in closing investigation without attribution. The parallel-without-coordination closure pattern across two Nordic states tightens the systematic suppression signal first visible in E8." },
    ],
    original_text: "Copenhagen Police / PET joint statement (2024-02-26): 'It is the assessment that there is not sufficient basis to pursue a criminal case in Denmark.' No suspects identified, no responsible actors named. Danish Defense Academy experts subsequently report being barred from public comment on the case (see E36).",
    cross_references: ["E8", "F13", "E36"],
    caveats: "A single country's closure is explicable; the pattern of parallel closure with active domestic-expert silencing (E36) is the signal. Domestic epistemic surface is being actively narrowed.",
  },
  E10: {
    title: "Germany issues European Arrest Warrant for Ukrainian diver Volodymyr Z.",
    source: "German Federal Prosecutor (Bundesanwaltschaft)",
    date: "2024-06-20",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Executor-identification elevated from journalism to judicial process",
        inference: "Formal German judicial action identifies a named Ukrainian individual as suspected executor. Raises executor-identification from investigative journalism to judicial process, with forensic-level evidence underpinning the warrant." },
    ],
    original_text: "Bundesanwaltschaft issues EAW (2024-06-20) for 'Volodymyr Z.' — Ukrainian diving instructor, identified as one of the Andromeda team. Warrant names specific forensic evidence (DNA, fingerprints on vessel).",
    cross_references: ["F7", "F8", "E35"],
    caveats: "Executor identity is not authorization source. Individuals with Ukrainian forces backgrounds can act under state direction, rogue military direction, or foreign service direction.",
  },
  E11: {
    title: "WSJ: Zaluzhnyi approved and directed operation, Zelensky's office not informed of final version",
    source: "Wall Street Journal",
    date: "2024-08-14",
    source_confidence: 0.65,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Authorization layer = military chief, not president",
        inference: "Reporting names Ukrainian military chief Zaluzhnyi as authorizer and locates the decision layer in Ukrainian Armed Forces rather than Presidential Office. Establishes the president-vs-military split that is structurally necessary for storyline α." },
      { label: "Reconciles conflicts",
        summary: "Zelensky denial + state involvement — both literally true",
        inference: "Makes the Zelensky-denial narrative and the Ukrainian-state-involvement narrative simultaneously literally true under a single causal model: presidential non-informing + military direction." },
    ],
    original_text: "WSJ (2024-08-14): Plan originated with senior officer of Ukrainian military intelligence; approved by then-Commander-in-Chief Gen. Valerii Zaluzhnyi. Zelensky was 'not informed' of the operation's final version; US had intelligence about the plan and asked Kyiv to call it off.",
    cross_references: ["E29", "E31", "F6"],
    caveats: "Part of the western_intel_leaks cluster — sourcing overlaps with WaPo/NYT lineage. The specific 'approved-then-revoked' temporal structure present in E31 is not present in WSJ's own account; E29 (Der Spiegel 2026) provides the fullest SCM.",
  },
  E12: {
    title: "Ukrainian diver suspect Z. exits Poland on embassy diplomatic plates — three weeks after German EAW",
    source: "Der Spiegel, Polska Zbrojna, subsequent WSJ reporting",
    date: "2024-07-06",
    source_confidence: 0.70,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "State apparatus enabled exit (embassy-plate extraction)",
        inference: "Physical evidence of state-level logistical protection. Exit by vehicle with Ukrainian embassy diplomatic plates requires at minimum embassy-level cooperation, at maximum active state coordination. Establishes a 'state apparatus enabled exit' causal pathway." },
      { label: "Reveals suppression",
        summary: "Poland procedurally blocked its own EAW obligation",
        inference: "Polish non-execution of an active EU arrest warrant, combined with the diplomatic-plate exit, identifies a specific suppression mechanism: procedural non-cooperation between EU member states on this specific case." },
    ],
    original_text: "Reports (various 2024-07 onwards): Volodymyr Z. departed Poland by car to Ukraine on 2024-07-06, two weeks after German EAW issuance. Vehicle carried Ukrainian embassy diplomatic plates. Polish prosecutors had not entered the suspect into the wanted-persons register.",
    cross_references: ["E10", "E35", "E22"],
    caveats: "An embassy-plate exit can reflect routine embassy transport that coincides with the suspect's presence, not coordinated extraction. However, combined with Polish prosecutors' non-registration (E35) and later Tusk 'case closed' (E22), the pattern is institutional alignment, not accident.",
  },
  E13: {
    title: "Alleged coordinator Serhii Kuznetsov arrested in Rimini, Italy on German EAW",
    source: "Italian police, Bologna Court of Appeal records, Il Post",
    date: "2025-08-21",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Second named operator; cross-jurisdictional confirmation",
        inference: "An EU judicial action identifies a second Ukrainian operator with SBU background. Adds the second identified individual to the executor-class; cross-jurisdictional arrest (Italy acting on German EAW) is procedural confirmation that the executor-identification holds across European judicial systems." },
    ],
    original_text: "Italian police arrest Serhii Kuznetsov (2025-08-21) in Rimini on German-issued EAW. Kuznetsov: 49-year-old retired captain of Ukrainian army, former SBU, trained at the Academy of the Secret Service. Proceedings subsequently oscillate between Bologna Court of Appeal and Italian Corte di Cassazione (see E19).",
    cross_references: ["F8", "E19", "E20"],
    caveats: "Arrest is a proceedings event, not a verdict. The subsequent Italian procedural oscillation (E19) is itself notable: normal EU-member extradition does not typically produce repeated Cassazione reversals.",
  },
  E14: {
    title: "Poland refuses extradition of Ukrainian diver Zhuravlev; judge frames the act as 'just war'",
    source: "Warsaw District Court ruling, Judge Dariusz Łubowski",
    date: "2025-10-17",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "State-actor attribution embedded in Polish legal reasoning",
        inference: "A Polish judicial ruling frames the operation as 'organized action by service of belligerent state' — state-actor attribution embedded in legal reasoning. Crosses a threshold: no longer 'investigators suspect' but 'court affirms'." },
      { label: "Reveals a preference",
        summary: "Polish court legitimizes rather than denies",
        inference: "The 'just war' framing provides legal legitimization rather than denial — a Polish court affirms the action occurred and characterizes it as state-actor operation while refusing to treat it as prosecutable. This positional structure is unique among involved jurisdictions." },
    ],
    original_text: "Judge Łubowski (Warsaw District Court, 2025-10-17): 'Such actions undertaken by armed forces and special forces in wartime, against critical infrastructure of the aggressor, are not sabotage but acts of diversion, which cannot be considered crimes under any circumstances.'",
    cross_references: ["F10", "E20", "E22"],
    caveats: "The ruling implicitly assumes Ukrainian responsibility as a conditional, not a fact established in that court. Göttingen law professor Kai Ambos: 'It is not really a reasoning, it is only an affirmation... the pipeline was a civilian target, not a military one.'",
  },
  E15: {
    title: "Berlin refuses AfD parliamentary question on US intelligence involvement, citing unspecified 'state welfare' reasons",
    source: "Bundestag inquiry record, AfD parliamentary question archives",
    date: "2024-07-17",
    source_confidence: 0.70,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Non-denial when denial is available — Bayesian update",
        inference: "Government choice of non-response rather than denial is itself informative: if there were no sensitive information to protect, direct denial would be the lower-cost response. Declining to answer reveals non-trivial downside from either confirming or denying." },
    ],
    original_text: "AfD parliamentary inquiry (2024-07-17) to Bundesregierung regarding US intelligence involvement. Government response: declines to provide substantive answer, invoking 'reasons of state welfare' ('Gründe des Staatswohls').",
    cross_references: ["E32", "E34", "F13"],
    caveats: "Government non-response can reflect legitimate operational secrecy, not necessarily coverup. However, taken together with E32 (Third Party Rule) and F13 (Nordic closures), the pattern is systematic.",
  },
  E16: {
    title: "Weltwoche profile: USS Kearsarge had UUV capability supporting remote-detonation scenarios",
    source: "Weltwoche (German-language, counter-mainstream)",
    date: "2024-10-15",
    source_confidence: 0.45,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "US technical UUV capability — keeps β technically alive",
        inference: "If accurate, establishes US technical capability for remote seabed operation separate from the Hersh sonar account. Keeps the US-execution storyline technically alive despite F3's breaking of Hersh's specific mechanism." },
    ],
    original_text: "Weltwoche (2024-10-15): USS Kearsarge amphibious assault ship was in Baltic Sea during BALTOPS 22 with UUV (unmanned underwater vehicle) capability. Article argues this enables remote-triggered seabed detonation scenarios without requiring the specific Hersh sonar mechanism.",
    cross_references: ["E1", "F3"],
    caveats: "Single-outlet counter-mainstream source. Technical capability does not constitute evidence of use. This evidence keeps storyline β technically viable but does not independently elevate its weight.",
  },
  E19: {
    title: "Italian Corte di Cassazione repeatedly reverses Kuznetsov extradition decisions — procedural oscillation",
    source: "Italian Corte di Cassazione rulings, Il Post, Il Fatto Quotidiano",
    date: "2025-10-16 to 2025-11-27",
    source_confidence: 0.85,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Procedural instability signals contested institutional pressure",
        inference: "The oscillation pattern — Bologna approves → Cassazione overturns → Bologna re-approves → Cassazione confirms → extradition executed — reveals structural pressure within European judicial systems on this specific case. Normal EAW between EU states does not produce this pattern. The procedural instability itself is a measurable signal of contested institutional pressures." },
    ],
    original_text: "Timeline: 2025-08-21 Kuznetsov arrested in Rimini; 2025-09 Bologna approves extradition; 2025-10-16 Cassazione overturns on procedural grounds; 2025-10-27 Bologna re-approves; 2025-11-19 Cassazione confirms; 2025-11-27 Kuznetsov extradited to Germany. Defense counsel Canestrini stated the proceedings were 'tainted by serious procedural violations'.",
    cross_references: ["E20", "E13", "F10"],
    caveats: "Procedural complexity can result from genuine legal ambiguity as well as political pressure. However, the specific referencing of the Polish ruling as precedent in Italian proceedings is significant (see E20).",
  },
  E17: {
    title: "Nord Stream 1 and 2 pipeline infrastructure was primarily civilian gas supply, not a military target",
    source: "BGH ruling narrative, Kai Ambos legal commentary",
    date: "2025-12-10 (BGH reasoning)",
    source_confidence: 0.90,
    reasoning_contribution: [
      { label: "Rules out a class",
        summary: "Eliminates 'justified act of war' framing",
        inference: "Legal determination that Nord Stream was not a legitimate military target rules out the class of storylines under which the attack would be a justified act of war. The 'just war' framing (F10) becomes legally unsustainable in the jurisdiction with primary forensic access." },
    ],
    original_text: "BGH (2025-12-10): 'The pipelines primarily served civilian gas supply' and 'were not a legitimate military target'. Göttingen law professor Kai Ambos (public commentary): 'the pipeline was a civilian target, not a military one.'",
    cross_references: ["F9", "F10"],
    caveats: "This is a legal determination about target-classification, not about actor identity. It rules out a legitimation frame ('just war') without attributing to any specific principal.",
  },
  E18: {
    title: "Chervinsky subject to separate Ukrainian prosecution unrelated to Nord Stream",
    source: "Ukrainian prosecution records, Ukrainska Pravda",
    date: "2023 onwards",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Ukrainian denial is narrow: presidential-only, not operator-wide",
        inference: "Ukrainian state action against Chervinsky on unrelated charges constrains Ukrainian official position: Kyiv is not protecting this individual specifically, yet also not acknowledging his role in the Nord Stream operation. Reveals the narrow form of Ukrainian denial (presidential deniability without operator immunity)." },
    ],
    original_text: "Col. Roman Chervinsky prosecuted in Ukraine on charges of 'exceeding military authority' related to a separate (pre-Nord-Stream) operation. Ukrainian officials decline to address Chervinsky's alleged role in Nord Stream.",
    cross_references: ["E4", "E29"],
    caveats: "The separate prosecution cannot be used to infer Ukrainian state acknowledgment of Nord Stream role. It does reveal that Ukrainian official denial operates at the specific question level rather than as general protection of the individual.",
  },
  E20: {
    title: "Polish 'just war' ruling cited as precedent in Italian Kuznetsov proceedings — cross-border propagation",
    source: "Italian defense submissions, Canestrini statements",
    date: "2025-10 onwards",
    source_confidence: 0.85,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "State-direction becoming implicit European legal presumption",
        inference: "Judicial reasoning about state responsibility is propagating across European jurisdictions. The Polish 'service of belligerent state' framing becomes argumentatively available in Italian proceedings — state-direction is becoming the implicit legal presumption even where not explicitly stated." },
    ],
    original_text: "Defense counsel Canestrini (in Italian proceedings) invoked the Polish decision that 'expressly recognized objective, functional immunity' as grounds against extradition, arguing that 'the principle of mutual trust between member states' was violated by ignoring the Polish precedent.",
    cross_references: ["F10", "E19"],
    caveats: "Precedent-invocation by defense does not mean precedent-acceptance by court. The Italian court ultimately rejected the immunity argument. However, the argument was legally serious enough to require substantive rejection.",
  },
  E21: {
    title: "Polish FM Sikorski publicly advocates medal for Zhuravlev if extradited to Poland",
    source: "Rzeczpospolita, multiple Polish press",
    date: "2025-10",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Polish state posture: support the operator, not the investigation",
        inference: "A sitting foreign minister publicly characterizing a suspected pipeline saboteur as deserving of state decoration is a strong behavioral signal. Combined with F11 (earlier 'Thank you, USA' tweet), this establishes the Polish state's public-facing position as 'support the operator, not the investigation'." },
    ],
    original_text: "Sikorski reportedly stated that Zhuravlev, if extradited to Poland, deserved a medal — characterized in Polish press as 'hero worthy of decoration'. Statement appeared in Rzeczpospolita and was not publicly retracted.",
    cross_references: ["F11", "E22"],
    caveats: "Political statements can be performative. However, taken with Tusk's 'case closed' (E22) and the Łubowski 'just war' ruling (F10), the Polish state position has moved from tweet-level suggestion to judicial legitimization.",
  },
  E22: {
    title: "Polish PM Tusk declares 'the case is closed' after refusal to extradite Zhuravlev",
    source: "Polish press, Tusk public statements",
    date: "2025-10-20",
    source_confidence: 0.85,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Non-cooperation elevated to executive policy",
        inference: "Head of government declaring 'case closed' in response to judicial refusal constitutes state-level ratification: no further Polish cooperation, no appeal, no further judicial pursuit within Poland. Moves the Polish position from judicial decision to executive policy." },
      { label: "Reveals suppression",
        summary: "Suppression of inquiry as state policy, not happenstance",
        inference: "Executive branch affirmation of non-cooperation with another EU state's investigation reveals that suppression of further inquiry is state policy, not judicial happenstance." },
    ],
    original_text: "PM Donald Tusk to press: 'The case is closed.' Earlier: 'The problem for Europe, Ukraine, Lithuania, and Poland is not that Nord Stream 2 was destroyed, but that it was built. It certainly does not benefit Poland, nor the interests of decency and justice, to prosecute or extradite this citizen to another state.'",
    cross_references: ["E21", "F11", "F10"],
    caveats: "A head of government may be expressing personal view rather than policy. However, the Justice Minister's decision not to appeal (Żurek) and the absence of further Polish investigative action indicate institutional alignment, not personal deviation.",
  },
  E23: {
    title: "Trump statement: Russia wasn't involved, 'a lot of people know' who did it",
    source: "Trump public statement; Arabic-language and international press amplification",
    date: "2025-05-14",
    source_confidence: 0.65,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Cross-partisan US position: exclude Russia, do not disclose",
        inference: "A sitting US president's affirmation that Russia was not involved and suggestion that 'many people know who' constitutes behavioral revealed preference: the current US administration is not pursuing Russia-attribution, and is not pursuing a full public disclosure either. The duality — exclusion of Russia plus non-disclosure of alternative — constrains the space of what the US government believes happened." },
    ],
    original_text: "Trump (reported 2025-05-14): 'Russia wasn't involved. A lot of people know who did it.' Paraphrased across multiple language sources; exact wording varies.",
    cross_references: ["F4", "F5"],
    caveats: "Trump statements have elevated source-specific uncertainty. The substance is notable primarily because a Republican president has affirmed a Democrat-administration-era conclusion, suggesting cross-partisan institutional knowledge of Russia-exclusion.",
  },
  E24: {
    title: "Ex-BND chief Hanning: operation required Polish support and approval of both Ukrainian and Polish presidents",
    source: "Die Welt interview with August Hanning",
    date: "2024-09-22",
    source_confidence: 0.85,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Required Polish support + both presidents' approval",
        inference: "A former head of German foreign intelligence (BND) with privileged access to intelligence-operation analysis states that the operation required (a) Polish state support and (b) approval by both presidents. This is an expert claim about causal structure, not a factual revelation — his domain expertise raises the weight above general testimonial level." },
    ],
    original_text: "August Hanning to Die Welt (2024-09-22): the attack must have occurred with the support of Poland and the approval of the Ukrainian and Polish presidents. Hanning is former head of BND (Bundesnachrichtendienst), German Federal Intelligence Service.",
    cross_references: ["F10", "E22", "E21"],
    caveats: "A former intelligence chief with political views can produce structured expert claims that nonetheless reflect personal framing. Hanning does not claim access to specific operational intelligence. This is expert inference on structure, not reported fact.",
  },
  E25: {
    title: "Jeffrey Sachs at UN Security Council: possible actors are US/UK/Poland/Norway/Germany/Denmark/Sweden — Russia excluded",
    source: "UN Security Council session transcript (2023-02-21)",
    date: "2023-02-21",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Rules out a class",
        summary: "Candidate set narrowed to 7 Western states; Russia excluded",
        inference: "Sachs (Columbia University, former UN adviser) formally argues before the UNSC that possible state actors are limited to US, UK, Poland, Norway, Germany, Denmark, Sweden — individually or coordinated — and that Russia is not plausibly implicated. Narrows the candidate space in a formal international forum." },
    ],
    original_text: "Sachs at UN Security Council: 'Such an action can only have been carried out by a state actor.' Enumerated possible responsible states — USA, UK, Poland, Norway, Germany, Denmark, Sweden — 'either individually or coordinated'. Stated that intelligence investigations by various Western services had confirmed that 'Russia does not appear implicated'.",
    cross_references: ["F4", "F5"],
    caveats: "Sachs does not have privileged intelligence access. His enumeration reflects analytical reasoning from publicly known motives and capabilities. Carries weight as structured argument in a formal setting, not as revealed fact.",
  },
  E26: {
    title: "Danish patrol photographed Russian naval vessel SS-750 near blast site four days before detonation",
    source: "Danish Nymfen patrol photos; Swedish prosecutor Ljungqvist confirmation",
    date: "Photos 2022-09-22; made public subsequently",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Russian physical presence near blast site (≠ execution)",
        inference: "Physical presence of Russian naval assets near the blast site 4 days before the event is established. Any narrative must accommodate the presence. However — and this is critical — presence ≠ execution." },
    ],
    original_text: "26 photographs by Danish patrol vessel Nymfen (2022-09-22) showing SS-750 (Russian deep-sea rescue vessel) and mini-submarine AS-26 in the area subsequently affected by the explosions. Swedish chief prosecutor Ljungqvist officially confirmed the existence of the photographs.",
    cross_references: ["F1", "E28"],
    caveats: "CLASSIC PEARL-LADDER TEACHING CASE: P(execution | present) ≠ P(execution | do(present)). The same physical presence is compatible with Russia executing, Russia monitoring a known event, Russia on unrelated routine patrol, or Russia surveilling after rumors reached Russian intelligence. Evidence of presence does NOT distinguish between these causal models.",
  },
  E27: {
    title: "Reported Liz Truss SMS 'it's done' to Blinken on day of explosions — sourcing unverified",
    source: "Various language sources; original sourcing unclear",
    date: "Reported 2022-2023",
    source_confidence: 0.30,
    reasoning_contribution: [
      { label: "Forces a mechanism",
        summary: "Unverified rumor — verification required before L2 unlock",
        inference: "IF the message existed as described, it would constitute direct testimonial evidence of UK foreknowledge or participation at the head-of-government level. However, the sourcing is too weak to unlock this inference. Flagged as 'L1 verification required before L2 unlock'." },
    ],
    original_text: "Claim: Liz Truss sent Antony Blinken a text message reading 'it's done' shortly after the explosions on 2022-09-26. Appears in multiple language ecosystems but has not been authoritatively verified by any primary-source document or credible witness testimony.",
    cross_references: ["E28"],
    caveats: "Treat as rumor until primary verification. Including it in any reasoning chain requires prior disclosure that the underlying fact is unverified. Aggregation must not assign this non-negligible weight without such disclosure.",
  },
  E28: {
    title: "Russian SVR Director Naryshkin formally accuses US and UK of direct involvement",
    source: "Russian state media, SVR press release",
    date: "2025-10-21",
    source_confidence: 0.50,
    reasoning_contribution: [
      { label: "Reveals a preference",
        summary: "Russian state formally commits to US/UK attribution narrative",
        inference: "A sitting Russian Foreign Intelligence Service director formally names US and UK as direct participants. Constitutes the Russian state's formal evidentiary claim. As evidence-of-truth, weight is limited (adversarial party). As evidence-of-Russian-state-position, it is conclusive." },
    ],
    original_text: "Sergei Naryshkin, SVR Director (2025-10-21): SVR possesses 'reliable intelligence' confirming US and UK direct participation in the Nord Stream sabotage. No supporting documents or evidence provided.",
    cross_references: ["E27"],
    caveats: "Russian official claims on this case carry adversarial-party caveat. The statement is informative about Russian state framing and willingness to commit to a public narrative, but does not by itself shift attribution.",
  },
  E29: {
    title: "Der Spiegel 2026: complete causal model — 'Operation Diameter', Zaluzhnyi authorized, Zelensky office uninformed, ~$300K private financier",
    source: "Der Spiegel investigation, cross-reported by Ukrainian and European press",
    date: "2026-02-12",
    source_confidence: 0.80,
    reasoning_contribution: [
      { label: "Reconciles conflicts",
        summary: "Full SCM: Zaluzhnyi-authorized + CIA-aware + non-presidential",
        inference: "THIS IS THE CORE STRUCTURAL CAUSAL MODEL for storyline α. Der Spiegel provides operation codename (Diameter), principal identity (Zaluzhnyi), authorization chain (military, not presidential), funding source (private ~$300K), timing (spring 2022), meeting location (Kyiv Podol with CIA contacts). Reconciles apparent contradictions: Zelensky's denials can be literally true while Ukrainian state involvement is also true." },
      { label: "Forces a mechanism",
        summary: "~$300K private funding = resource-limited operation profile",
        inference: "The identified funding structure (private citizen ~$300K) constrains material resource requirements: state contribution was in non-cash form (HMX, documents, safe harbor), not operational cash. Matches the F7 Andromeda profile of resource-limited operation with civilian execution layer." },
    ],
    original_text: "Der Spiegel (2026-02-12): 'Operation Diameter' planned by Ukrainian team in Kyiv's Podol district, spring 2022. Meetings included CIA contacts who 'expressed interest and did not oppose'. Authorization traced to General Valerii Zaluzhnyi, then Commander-in-Chief. Zelensky office not informed of final execution. Private Ukrainian businessman provided approximately $300,000.",
    cross_references: ["F6", "F7", "F8", "E30", "E31"],
    caveats: "Journalistic reconstruction of intelligence-operation causal structure carries inherent uncertainty. Der Spiegel's sourcing is not fully public. The framework is consistent with WSJ 2024-08, WaPo 2023-11, Ukrainska Pravda 2026-02 — cross-outlet convergence strengthens but does not fully confirm the SCM.",
  },
  E30: {
    title: "t-online (April 2026): CIA training links to key operative; explosives not of Ukrainian origin",
    source: "t-online German-language investigative media",
    date: "2026-04-08",
    source_confidence: 0.60,
    reasoning_contribution: [
      { label: "Rules out a class",
        summary: "Eliminates 'Ukrainian-domestic supply chain' narrative class",
        inference: "The claim that the explosives were not of Ukrainian origin, if accurate, rules out the narrative class 'Ukrainian operators using Ukrainian-domestic supply chain'. Narrows the HMX supply chain (F2) to non-Ukrainian state sources — most plausibly CIA-linked, Polish military, or other third-country supply. A strict L2 exclusion that reshapes the principal-class candidate set." },
      { label: "Forces a mechanism",
        summary: "Historical CIA→executor personnel pathway (2015 onwards)",
        inference: "Reported CIA training links to at least one key operative (from 2015 onwards) establish a historical causal relationship between US intelligence and the executor layer — strengthens the 'CIA enabled through personnel' channel independently of operational authorization." },
    ],
    original_text: "t-online (2026-04-08): the mastermind of the operation is described as 'a child of the CIA', with CIA training relationship dating from 2015. The explosive material used in the attack is reported as not originating from Ukrainian supply chains.",
    cross_references: ["F2", "F6", "F8", "E29"],
    caveats: "Single-outlet investigation with limited corroboration at this analysis date. If independently confirmed, this would be the strongest evidence for elevating CIA from 'co-conspirator by omission' (α) to 'material enabler' (γ). Until confirmation, treat as strong candidate evidence rather than established fact.",
  },
  E31: {
    title: "Il Fatto Quotidiano: Zelensky initially approved, later revoked under US urging, Zaluzhnyi continued",
    source: "Il Fatto Quotidiano (Italian)",
    date: "2025-11-03",
    source_confidence: 0.55,
    reasoning_contribution: [
      { label: "Reconciles conflicts",
        summary: "Temporal split resolves contradiction: approved → revoked → continued",
        inference: "Provides the temporal structural model that reconciles (a) Der Spiegel/WSJ/MIVD reports that Zelensky was not informed with (b) reports that he was. The temporal sequence 'approved spring → revoked after US pressure → Zaluzhnyi continued anyway' makes both parts literally true at different times. The contradiction is dissolved by an internal-power-fracture causal model." },
      { label: "Forces a mechanism",
        summary: "Iran-Contra pattern: military continues past presidential revocation",
        inference: "If accurate, establishes an Iran-Contra-type institutional structure: military continuation after presidential revocation. A well-known historical pattern and therefore a plausible causal mechanism, not an invented construct." },
    ],
    original_text: "Il Fatto Quotidiano (2025-11-03): 'In the reconstruction by the Wall Street Journal, the operation, initially approved by President Zelensky, was then rejected by him because advised against by the United States.' The operation nonetheless proceeded under military direction.",
    cross_references: ["E29", "F6"],
    caveats: "Single-outlet account with secondary sourcing (citing WSJ). The specific 'approved-then-revoked-then-continued' structure is not directly cited in WSJ's own reporting. Value is in providing a consistency framework for α, not independent confirmation.",
  },
  E32: {
    title: "German Chancellery invokes 'Third Party Rule' to block parliamentary questions about US intelligence involvement",
    source: "t-online, Der Spiegel, AfD parliamentary inquiry records",
    date: "2024-09-05",
    source_confidence: 0.75,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Named legal mechanism (Third Party Rule) blocking US-intel inquiry",
        inference: "The deliberate invocation of the Third Party Rule — a specific legal mechanism restricting disclosure of allied intelligence — by Chancellery head Schmidt, specifically in response to parliamentary questions about US involvement, identifies the suppression mechanism and its target with specificity. Not generic investigation slowness — a named mechanism used to block a specific inquiry direction." },
    ],
    original_text: "Kanzleramtschef Wolfgang Schmidt invoked the Third Party Rule — a principle governing intelligence sharing between allied services — as grounds to decline parliamentary inquiry (particularly from AfD and Left parties) regarding US intelligence involvement in the Nord Stream investigation.",
    cross_references: ["E15", "E34", "F13"],
    caveats: "Third Party Rule is a legitimate intelligence-protection mechanism. Its deployment does not by itself prove the content protected is incriminating. However, the selective invocation on this specific topic, combined with other suppression signals, forms a systematic pattern.",
  },
  E33: {
    title: "UN Security Council: 12 abstentions bury Russian proposal for independent international investigation",
    source: "UN Security Council voting record",
    date: "2023-03-27",
    source_confidence: 0.95,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Investigation buried by abstention, not rejection",
        inference: "Russian-sponsored resolution for independent international investigation was blocked not by vetoes but by mass abstention (12 of 15 members). Institutional non-resolution at the highest international level. The specific pattern of abstention rather than veto reveals member states' preference to avoid both endorsement and explicit opposition to investigation." },
    ],
    original_text: "UNSC vote (2023-03-27) on Russian-sponsored resolution to establish independent international commission to investigate Nord Stream: 3 in favor (Russia, China, Brazil), 0 against, 12 abstentions (including all Western states). Resolution failed for lack of required 9 affirmative votes.",
    cross_references: ["E32", "F13"],
    caveats: "A UNSC vote pattern reflects geopolitical alignment generally, not specifically guilt-consciousness. A state may vote against investigation for multiple reasons (sovereignty norms, alliance solidarity, procedural concerns). Pattern is consistent with suppression but not proof of it.",
  },
  E34: {
    title: "German government declines to answer AfD parliamentary inquiry on US intelligence involvement, citing 'state welfare'",
    source: "Bundestag inquiry record",
    date: "2024-07-17",
    source_confidence: 0.85,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Non-denial is cheaper signal than denial would be",
        inference: "When a parliament poses a direct yes/no question about US intelligence involvement and government declines to answer rather than denying, this is a Bayesian update. Refusal-to-answer is informative: if there were no sensitive information to protect, direct denial would be the lower-cost response." },
      { label: "Breaks a story",
        summary: "Falsifies 'zero US involvement' narrative counterfactually",
        inference: "Counterfactually: if the storyline were 'US had no involvement whatsoever', direct denial would be both available and politically advantageous. The choice of refusal-to-answer is inconsistent with that storyline. Probabilistic evidence against the 'no US involvement at any level' narrative." },
    ],
    original_text: "AfD inquiry (2024-07-17) to Bundesregierung regarding US intelligence agency involvement in Nord Stream events. Government response declined to provide substantive answer, invoking 'reasons of state welfare'. Similar inquiry from Die Linke (October 2022) also received non-substantive response.",
    cross_references: ["E15", "E32", "F13"],
    caveats: "Government non-response can reflect legitimate operational secrecy, diplomatic courtesy, or protection of allied intelligence relationships, not necessarily coverup. However, taken together with E32 and F13, the pattern is systematic rather than case-specific.",
  },
  E35: {
    title: "Polish prosecutors systematically fail to execute German European Arrest Warrant for Zhuravlev",
    source: "WSJ, Bundesanwaltschaft statements, Polish prosecutor communications",
    date: "2024-06 to 2025-10",
    source_confidence: 0.75,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Named procedural failure: non-registration of suspect in EAW system",
        inference: "EAW between EU member states is normally routine and executed within days. In this case, Polish prosecutors did not register the suspect in the wanted-persons system, allowing exit to Ukraine. Procedural failure with specific named mechanism (non-registration), not general inefficiency." },
    ],
    original_text: "Germany issued EAW for 'Volodymyr Z.' in June 2024. WSJ and subsequent European press established that Polish prosecutors did not enter the suspect into the wanted-persons register, enabling departure by car to Ukraine on 2024-07-06. Polish prosecution later claimed procedural error by Germany; Germany disputed.",
    cross_references: ["E22", "E21", "F8"],
    caveats: "Procedural failures can have innocent explanations. However, the combination with E22 (Tusk 'case closed'), E21 (medal advocacy), and subsequent Polish court refusal of extradition forms a pattern of state-level protection, not isolated administrative error.",
  },
  E36: {
    title: "Danish Defense Command prohibits Danish Defense Academy experts from public comment on Nord Stream",
    source: "Danish Defense Command order, DR reporting",
    date: "2022-10 (early)",
    source_confidence: 0.30,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Domestic expert voices silenced by Defense Command order",
        inference: "Early in the investigation, Danish Defense Command actively prohibited its own expert analysts from public comment. This is active suppression of domestic expert commentary, with a named mechanism (Defense Command order) and a stated justification ('operational security'). Directly narrows the domestic epistemic surface before investigation conclusions are reached." },
    ],
    original_text: "DR reporting (early October 2022): 'Forsvarskommandoen has decided that experts at the Defense Academy may not comment on events in the Baltic Sea due to operational security.' Experts subsequently declined to provide public analysis for the duration of Danish investigation.",
    cross_references: ["F13", "E32"],
    caveats: "Operational security restrictions during active investigations are not inherently suspicious. However, duration (extending through investigation closure without subsequent release) and specific targeting of domestic expert voices (rather than operational details) are notable.",
  },
  E37: {
    title: "Swedish prosecutor Ljungqvist: Nord Stream case is 'a battlefield for influence operations'",
    source: "SVT interviews, Swedish prosecution press statements",
    date: "2024-02",
    source_confidence: 0.55,
    reasoning_contribution: [
      { label: "Reveals suppression",
        summary: "Insider admits: evidence environment is polluted by influence ops",
        inference: "The lead prosecutor of a national investigation publicly acknowledging that his own case is subject to sustained influence operations constitutes an insider admission that observational evidence on this claim is adversarially polluted. Does not change probabilities of particular candidates, but warns that L1 aggregation of public evidence cannot be trusted to the normal degree." },
    ],
    original_text: "Mats Ljungqvist to SVT (2024-02): 'My reflection is that there has been a great deal of information and speculation, information that is directly incorrect but has been presented as truth. We have had a fairly good insight into this information even before it appeared in media.' On the broader context: Nord Stream investigation was 'a battlefield for influence operations' (slagfält för påverkansoperationer).",
    cross_references: ["F13", "E36"],
    caveats: "Acknowledgment of information warfare does not identify direction or source. A prosecutor saying the environment is polluted does not attribute the pollution. However, it means naive acceptance of any single source — including Swedish official statements — requires adjustment for known-contested epistemic environment.",
  },
};

// Fact-layer (F1–F13) records exist only in the Pearl-spec JSON source, not in
// the graph-layer EVIDENCE_V04 array. They appear in cross_references — the
// reader should still see what F6/F9/etc. describe, even though those records
// don't have their own expandable drawer in this UI. Click-through is disabled
// for these IDs (see crossRefTitle + canJump checks in the drawer).
const FACT_LAYER_TITLES = {
  F1:  "Two explosion waves recorded at 04:03 and 19:03 UTC on 2022-09-26 by multi-country seismic network",
  F2:  "Military-grade HMX explosive residue confirmed on Andromeda yacht by Swedish prosecutor",
  F3:  "Explosions occurred in two waves separated by 17 hours, not simultaneously",
  F4:  "Biden publicly commits to 'ending' Nord Stream 2 if Russia invades Ukraine",
  F5:  "Senior US officials (Blinken, Nuland) express public satisfaction post-event",
  F6:  "CIA warned Germany and European allies of imminent Nord Stream attack in June 2022, based on MIVD intelligence",
  F7:  "Andromeda yacht forensic chain: DNA, fingerprints, HMX residue on specific individuals",
  F8:  "Individual identification: Zhuravlev (PL) and Kuznetsov (IT), with Ukrainian special-forces / SBU backgrounds",
  F9:  "German Federal Court of Justice (BGH) ruling Dec 2025: 'highly probable foreign-government intelligence operation'",
  F10: "Polish judge Łubowski ruling Oct 2025: sabotage was 'organized action by service of belligerent state'",
  F11: "Polish Foreign Minister Sikorski tweets 'Thank you, USA' hours after the explosion",
  F12: "One of four pipeline strands survived the attack intact",
  F13: "Sweden and Denmark close their investigations without attribution (February 2024)",
};

// Evidence clusters — combined inferences that exceed the sum of parts
const EVIDENCE_CLUSTERS_V04 = [
  { id: "western_intel_leaks",
    label: "Western intelligence leaks",
    members: ["E3", "E4", "E5", "E11"],
    combined_inference: "Four reports (NYT, WaPo, WSJ, Spiegel) citing anonymous officials 'familiar with intelligence' share a common origin in a single intelligence ecosystem. Trace treats them as correlated, not independent — their combined weight is dampened to prevent double-counting the same story retold." },
  { id: "judicial_convergence",
    label: "Judicial convergence on state-actor attribution",
    members: ["E14", "E17", "E19", "E20"],
    combined_inference: "European judicial institutions across Germany, Poland, and Italy converge on state-actor framing, though with different political valences. This cross-jurisdictional convergence is stronger than any single ruling." },
  { id: "suppression_pattern",
    label: "Systematic information suppression pattern",
    members: ["E8", "E9", "E15", "E32", "E33", "E34", "E35", "E36", "E37"],
    combined_inference: "Nine independent instances of information suppression — across German, Polish, Danish, Swedish, and UN levels, covering parliamentary inquiries, judicial non-cooperation, domestic expert silencing, and international investigation blockage. The systematic nature of suppression across so many independent jurisdictions and mechanisms exceeds what is plausibly explained by case-specific legitimate reasons." },
  { id: "ukrainian_plausible_deniability",
    label: "Ukrainian plausible deniability structure",
    members: ["E11", "E29", "E31", "E37"],
    combined_inference: "These four pieces together reveal the Iran-Contra-like structural pattern: presidential approval-then-revocation, military continuation, and official-denial / media-affirmation split. Individually each piece is inconclusive; together they form the signature of plausible deniability as a designed feature, not accidental confusion." },
  { id: "us_preference_bookend",
    label: "US preference bookend (ex-ante and ex-post)",
    members: ["E23", "E25"],
    combined_inference: "US political leadership public commitment and Trump-era non-reversal together lock US preference at multiple time points. Does not establish execution but rules out 'US-unrelated event' as a viable causal frame." },
];

// Reasoning label metadata — Pearl level, color, short reader-friendly gloss
// drawn from how-to-read-trace-evidence.md and the v0.4 spec §2.5.3.
const REASONING_LABELS = {
  "Forces a mechanism": {
    pearl: "L2",
    role: "mechanism support",
    color: "#1C3A5E",
    colorSoft: "#E4ECF4",
    short: "Any narrative must pass this gate.",
    long: "The evidence requires that a specific causal structure be present in any viable story. If a story cannot accommodate this mechanism, the story is inconsistent with the evidence. This is not about probability — it is about structural compatibility.",
  },
  "Rules out a class": {
    pearl: "L2",
    role: "mechanism exclusion",
    color: "#A03A2C",
    colorSoft: "#F4E4E0",
    short: "A whole set of stories is now off the table.",
    long: "Stronger than narrowing probability. It eliminates an entire family of possible narratives. Not 'this narrative is less likely' but 'this family of narratives is incompatible with what we observe.' Rare and powerful evidence.",
  },
  "Reveals suppression": {
    pearl: "L2",
    role: "coverage meta-evidence",
    color: "#7A6A54",
    colorSoft: "#F2EEE4",
    short: "The epistemic environment is being actively managed.",
    long: "Evidence about the investigation or coverage process itself, not about the event. When a parliamentary inquiry is refused, a court closes a case without findings, a government prohibits domestic experts from public comment — these are not evidence about what happened. They are evidence about what institutions are doing around the question of what happened.",
  },
  "Breaks a story": {
    pearl: "L3",
    role: "counterfactual check",
    color: "#8B6A20",
    colorSoft: "#F4ECD8",
    short: "This is a test, and a specific narrative fails it.",
    long: "The strongest form of exclusion: evidence under counterfactual reasoning renders a specific narrative structurally incompatible with observation. 'If narrative N were accurate, we would expect to see X. We observe the opposite. Therefore N's specific structure is falsified.' Note: breaking a story usually falsifies specific execution details without necessarily falsifying the macro framework.",
  },
  "Reconciles conflicts": {
    pearl: "L3",
    role: "structural integrator",
    color: "#2F6B4A",
    colorSoft: "#E0EFE6",
    short: "The piece that lets the others fit together.",
    long: "Other evidence seems contradictory, but this evidence provides a causal model under which the contradictions dissolve. Without this piece, conflicting evidence would have to be averaged or discarded. With it, the contradictions become coherent under a single underlying mechanism.",
  },
  "Reveals a preference": {
    pearl: "L2",
    role: "revealed-preference inference",
    color: "#4A4A4A",
    colorSoft: "#EEEAE0",
    short: "Tells us about an actor's stance, not their execution.",
    long: "Behavioral signals — public statements, votes, non-actions, policy positions — that expose what an actor wants or knows, without directly establishing what they did. Constrains actor-position space without necessarily establishing execution role.",
  },
};

// Field-level tooltip copy — directly sourced from how-to-read-trace-evidence.md.
// These are the explanations a first-time reader needs to interpret the drawer.
const FIELD_TOOLTIPS = {
  title: {
    heading: "Title",
    body: "The evidence itself, in plain language — not the source. You can read a list of titles and understand the shape of the record before opening anything. This reverses the common newspaper convention where the source is primary and the evidence is paraphrased.",
  },
  source_confidence: {
    heading: "Source confidence ≠ truth probability",
    body: "How reliable is this source for the type of claim it is making. Not 'how true is the claim.' A Russian state outlet reporting that the SVR director held a press conference receives high source confidence for the event of the press conference, even if the content deserves adversarial-party caveats. Read this as reliability of reporting, not likelihood of truth.",
  },
  reasoning_contribution: {
    heading: "Reasoning contribution",
    body: "The heart of the record. One or more inferences, each with a label and a full sentence explaining what you can reasonably conclude. Each follows the form: from this evidence, through this mechanism, we can reasonably infer this conclusion. When an inference carries a weaker form (\"if accurate, this would establish…\"), the conditional is not hedging — it is an explicit mark that the inference depends on other facts being verified.",
  },
  original_text: {
    heading: "Original text",
    body: "The grounding. The exact quote, the official wording, the specific passage the inferences rest on. If you doubt the reasoning, you can go to the original. This field is what makes Trace's inferences falsifiable: remove the original text and you remove the basis for every inference attached.",
  },
  cross_references: {
    heading: "Cross-references",
    body: "Other evidence records this one interlocks with. Evidence rarely stands alone. HMX residue by itself forces some inferences, but combined with 'explosives not of Ukrainian origin' it forces stronger inferences about supply chain. Cross-references are Trace's way of saying 'to read this properly, also read these.'",
  },
  caveats: {
    heading: "Caveats — read these",
    body: "What you cannot conclude from this evidence even though a casual reader might try. Not footnotes — the discipline that prevents casual over-reading. A record without caveats is a record that has not done its epistemic work. The caveats field is mandatory, not optional.",
  },
  cluster: {
    heading: "Evidence cluster",
    body: "Some truths only appear when evidence is read in combination. A cluster's combined inference is what it enables that no single member does. Reading a claim analysis without reading the clusters is like reading a book chapter by chapter with no understanding of the narrative arc.",
  },
};

// ============================================================================
// STORYLINES (v0.4) — five reconstructions of the event space
// ============================================================================

const STORYLINES = [
  {
    id: "alpha",
    kind: "event_sequence",
    label: "Ukrainian military bypass, Polish complicity, US awareness",
    shortLabel: "Ukrainian military — with Polish complicity and US awareness",
    coverage: 0.50,
    isHero: true,
    claim: "Zaluzhnyi-led Ukrainian military authorized and executed the operation after Zelensky withdrew approval under US urging. Poland provided logistical staging and post-facto protection. The CIA knew, discouraged late, and did not stop it.",
    overlaySummary: "Ukrainian military leadership — Zaluzhnyi at the top, Chervinsky on the ground — authorized and executed the strike after Zelensky, under US pressure, withdrew his earlier approval. Poland sheltered the operators afterward; the CIA knew throughout and chose not to stop it.",
    narrative: "In February 2022, standing beside Olaf Scholz, Biden publicly committed to \"ending\" Nord Stream 2 if Russia invaded. Two weeks later Russia invaded. Under the twin pressures of war and a pipeline that economically bound Germany to Moscow, the upper ranks of the Ukrainian military — Zaluzhnyi in the lead, Chervinsky at the operational level — initiated what internal communications would later call Operation Diameter. That spring, in Kyiv's Podol district, Ukrainian military intelligence disclosed the plan to a CIA contact. The response, recorded in later Der Spiegel reporting, was \"interested, not opposed.\" Zelensky gave early approval. In June, after Dutch MIVD intelligence surfaced the plan through an independent channel, the CIA issued a formal strategic warning to Germany — fulfilling the obligation to inform without foreclosing the operation. Zelensky withdrew his approval under US pressure. Zaluzhnyi continued anyway. The execution layer was unglamorous: roughly three hundred thousand dollars from a Ukrainian private financier, enough for the yacht, the diving equipment, and running costs; the state furnished the military-grade HMX, the forged papers, and the post-facto protection. A team of five men and two women — former SBU special forces mixed with civilian divers — sailed the Andromeda from Rostock on September 7th. The charges were placed with timed detonation. On September 26th the pipelines ruptured in two waves seventeen hours apart — not Hersh's sonar-triggered remote single shot, but a manual or semi-automatic sequence. The fourth line survived, a signature of a resource-constrained team rather than a state navy. Afterward, the machinery of plausible deniability engaged: Sikorski's \"Thank you USA\" tweet, Poland's later refusal to extradite, Washington's pivot toward strategically leaked \"pro-Ukrainian group\" framing that let German public opinion slowly adjust, Kyiv's permanent official denial on the narrow technical truth that the president had not ordered it. Hersh's 2023 report fits as a residue from an earlier, discarded American planning phase — macro-motive correct, micro-execution wrong. In December 2025 the BGH formally classified the act as \"a foreign government intelligence agency,\" wording deliberately chosen to acknowledge state authorship without naming the ally.",
    roleAttribution: {
      kind: "complicity_structure",
      headline: "A four-layer complicity structure — not a single perpetrator.",
      roles: [
        { role: "Principal", actor: "Ukraine — military leadership", flag: "UA",
          weight: 0.46,
          gloss: "Zaluzhnyi authorized and executed, bypassing Zelensky's withdrawn approval. Chervinsky at the operational level." },
        { role: "Accessory", actor: "Poland", flag: "PL",
          weight: 0.14,
          gloss: "Post-facto protection: Zhuravlev exits on Ukrainian embassy plates, Polish courts refuse extradition, Sikorski's \"Thank you, USA.\"" },
        { role: "Co-conspirator by omission", actor: "United States — CIA", flag: "US",
          weight: 0.16,
          gloss: "Informed in spring. Response: \"interested, not opposed.\" Warned Germany in June via the Dutch intelligence chain. Did not stop it." },
        { role: "Inconclusive", actor: "Institutional non-resolution", flag: "INCON",
          weight: 0.14,
          gloss: "Sweden closed, Denmark closed, UN abstentions, Third Party Rule in Berlin. α cannot by itself explain why — μ does." },
        { role: "Alternative", actor: "All other storylines combined", flag: "OTHER",
          weight: 0.10,
          gloss: "β (10%), δ (5%), ε (residual). Scenarios α would displace on promotion." },
      ],
    },
    narrativeTimeline: [
      { date: "Feb 7, 2022", label: "Biden's public pledge",
        body: "Standing beside Olaf Scholz, Biden publicly commits to \"ending\" Nord Stream 2 if Russia invades. Motive is recorded in public view." },
      { date: "Feb 24, 2022", label: "Russian invasion",
        body: "Russia invades Ukraine. The pipeline's economic tie to Moscow becomes a strategic liability for Berlin." },
      { date: "Spring 2022", label: "Operation Diameter initiated",
        body: "Ukrainian military leadership — Zaluzhnyi in the lead, Chervinsky at the operational level — initiates what internal communications will later call Operation Diameter." },
      { date: "Spring 2022", label: "CIA informed in Kyiv",
        body: "In Kyiv's Podol district, Ukrainian military intelligence discloses the plan to a CIA contact. The response, recorded in later Der Spiegel reporting: \"interested, not opposed.\" Zelensky gives early approval." },
      { date: "June 2022", label: "Dutch intelligence surfaces the plan",
        body: "Dutch MIVD obtains the plan through an independent channel. The CIA issues a formal strategic warning to Germany — fulfilling the obligation to inform without foreclosing the operation.",
        turningPoint: { delta: "+5.4", reason: "First multi-source convergence on Ukrainian authorship. Severs the correlated-leak bottleneck; independent intel channel raises α's coherence." } },
      { date: "Summer 2022", label: "Zelensky withdraws, Zaluzhnyi continues",
        body: "Under US pressure, Zelensky withdraws approval. Zaluzhnyi continues anyway. The split between presidential and military authorization is now on the record.",
        turningPoint: { delta: "+8.2", reason: "Presidential-vs-military split is the structural distinction α needs. Before this, \"Ukrainian\" was one undifferentiated attribution — after, α separates from simpler Ukrainian hypotheses and absorbs the otherwise paradoxical CIA warning." } },
      { date: "Summer 2022", label: "Execution layer assembled",
        body: "Roughly $300,000 from a Ukrainian private financier covers the yacht, diving equipment, and running costs. The state furnishes the military-grade HMX, forged papers, and post-facto protection." },
      { date: "Sep 7, 2022", label: "Andromeda sails from Rostock",
        body: "A team of five men and two women — former SBU special forces mixed with civilian divers — sails the yacht Andromeda from Rostock. Charges are placed with timed detonation." },
      { date: "Sep 26, 2022", label: "Two-wave rupture",
        body: "The pipelines rupture in two waves seventeen hours apart — not Hersh's sonar-triggered remote single shot, but a manual or semi-automatic sequence. The fourth line survives, a signature of a resource-constrained team rather than a state navy." },
      { date: "Sep 26, 2022", label: "Deniability machinery engages",
        body: "Sikorski tweets \"Thank you, USA.\" Washington pivots toward strategically leaked \"pro-Ukrainian group\" framing, letting German public opinion slowly adjust. Kyiv settles into a permanent official denial on the narrow technical truth that the president had not ordered it." },
      { date: "Feb 2023", label: "Hersh report surfaces",
        body: "Hersh's account fits as a residue from an earlier, discarded American planning phase — macro-motive correct, micro-execution wrong." },
      { date: "Dec 10, 2025", label: "BGH ruling",
        body: "The Federal Court of Justice formally classifies the act as \"a foreign government intelligence agency,\" wording deliberately chosen to acknowledge state authorship without naming the ally.",
        turningPoint: { delta: "+6.1", reason: "Judicial authority — cross-jurisdictional forensic review survives three years intact. Moves α from \"most coherent hypothesis\" toward the convergence zone." } },
    ],
    accommodates: ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13"],
    supportingEv: ["E3","E4","E5","E6","E10","E11","E12","E13","E14","E17","E18","E20","E21","E22","E24","E29","E30","E37"],
    challengedBy: ["E36"],
    internalVariant: {
      label: "γ — CIA green light (variant reading within α)",
      description: "The same event sequence, but the CIA's 'not opposed' is read as tacit permission rather than mere awareness. Structurally indistinguishable from α without declassified documentation; presented as an internal reading rather than a separate storyline."
    },
    unexplained: "HMX explosive supply chain. If traced to US/NATO military inventory, α shifts toward β. If traced to Ukrainian-captured Russian stock, α strengthens.",
    sourceFromCandidates: "C2b (33.5%) + C2a (6.3%) + C2c (6.4%) + ~half of C7 (3.4%) ≈ 49.6%"
  },
  {
    id: "epsilon",
    kind: "candidate_space",
    label: "Unidentified actor or incomplete candidate set",
    shortLabel: "Unknown actor — candidate set may be incomplete",
    coverage: 0.21,
    isHero: false,
    claim: "The enumerated candidate set — nine attributions across three Ukrainian layers, US, UK, Russia, Other, and the CIA-enabling compound — may not be complete. Weight assigned here represents probability mass that no listed candidate coherently absorbs.",
    overlaySummary: "Some part of what happened fits none of the named stories coherently. An unidentified actor, a multi-state coordination wider than any single principal, or a configuration the current candidate set is structurally blind to. A declared unknown, not a hidden answer.",
    narrativeTimeline: [
      { date: "Structurally", label: "Not a sequence of events",
        body: "ε does not describe what happened. It describes the probability mass that no enumerated storyline coherently absorbs — a declared blind spot in the candidate set." },
      { date: "Historically", label: "What v0.3 was blind to",
        body: "The v0.3 candidate set treated Ukrainian attribution as one undifferentiated C2. It could not house compound attribution (state + foreign intelligence assist), presidential vs military authorization granularity, or post-withdrawal continuation. v0.4 closed these specific gaps." },
      { date: "Currently", label: "What v0.4 may still miss",
        body: "A multi-state coordination wider than any one principal. A role played by an actor whose identity is not yet public. A sequence structurally identical to α or β but with one hidden additional hand whose footprint is too small to have reached any of the fourteen languages surveyed." },
      { date: "Forward-looking", label: "What would collapse ε",
        body: "Declassification of CIA 2022 cables. A whistleblower account from inside the Andromeda operation. An explicit named-third-party acknowledgment from any of the parties currently in the exhibit. Any of these would shrink ε and move its weight into an enumerated storyline — existing or newly added." },
    ],
    narrative: "Some part of what happened does not fit any of the specific stories on the board. The v0.3 candidate set was blind to compound attribution; v0.4 added that dimension and distributions shifted. v0.4 may still be blind to something: a wider multi-state coordination that does not reduce cleanly to any one principal, a role played by an actor not yet publicly named, a sequence that looks like one of the listed storylines but with a hidden additional hand. This storyline does not describe a sequence of events. It describes the protocol's refusal to force all weight into the buckets it currently knows about. When declassification, prosecution, or whistleblower disclosure eventually surfaces what the current candidate set is missing, ε will shrink and one of the named storylines — or a new one added to the board — will absorb the difference.",
    roleAttribution: {
      kind: "meta_space",
      headline: "No actors — a declared blind spot in the candidate set.",
      roles: [
        { role: "Unspecified actor", actor: "Outside current candidate set", flag: "UNKNOWN",
          weight: 0.21,
          gloss: "The protocol's declared blind spot: mass assigned here represents attribution that no listed storyline coherently absorbs. v0.3 was blind to compound attribution; v0.4 closed that gap but may still miss a broader multi-state coordination or an unnamed actor." },
      ],
    },
    accommodates: ["F12"],
    supportingEv: [],
    challengedBy: [],
    unexplained: "By definition, ε cannot point to what it covers. It represents the protocol's refusal to force all weight into listed buckets. Candidates v0.3 missed: compound attribution (now C7), presidential-layer granularity (now C2a/b/c). Candidates v0.4 may still miss: multi-national coordination beyond Ukrainian leadership; an actor not yet publicly identified.",
    sourceFromCandidates: "C_unknown (6.3%) + C6 Other (5.8%) + C3 rogue-operators residual (4.2%) + ~half of C5 UK (3.1%) + ~fifth of C7 (1.3%) ≈ 20.7%"
  },
  {
    id: "mu",
    kind: "meta",
    label: "Avoidance as a stance",
    shortLabel: "Collective non-resolution",
    coverage: 0.14,
    isHero: false,
    claim: "This storyline does not answer who did it. It answers why, three and a half years later, the question still has not converged. Five jurisdictions and one international body each had the capacity to advance. Each chose not to. Consistent non-advancement is itself evidence — not about the perpetrator, but about the political status of the event.",
    overlaySummary: "The question does not close because no institution with the power to close it has chosen to. Sweden and Denmark shut their investigations; Germany's government invokes the Third Party Rule while its courts prosecute; Poland shields the operators; the UN Security Council abstains the issue away. Avoidance as a coordinated stance.",
    narrative: "Three and a half years after the blasts, the institutions with the capacity to resolve what happened have — each for its own reasons — chosen not to. Sweden closed its investigation by citing a jurisdictional doctrine a Danish legal scholar publicly disputes. Denmark followed within weeks, and its own Defence Academy experts report being barred from public discussion. The German judiciary proceeded: warrants issued, Kuznetsov indicted, the BGH ruling on a \"foreign government intelligence agency.\" The German government simultaneously invoked the Third Party Rule to keep intelligence-sharing details out of parliamentary inquiry. Poland did not execute the German European Arrest Warrant when Zhuravlev was on its territory, and Polish courts later categorized the act as \"organized action by services of a warring state\" — a judicial frame bordering on legitimation. Italy's Court of Cassation reversed itself three times on the same extradition question within six weeks. At the UN Security Council, a resolution for independent international investigation was buried — not by vetoes, but by twelve abstentions. Meanwhile, on the record: an ex-BND chief names Polish authorization and both presidents' approval; a prominent academic enumerates seven Western states at the UN and explicitly excludes Russia; a Swedish prosecutor publicly describes his own investigation as \"a battlefield for influence operations.\" The story this storyline tells is not about a perpetrator. It is about a configuration in which every actor with the power to resolve the question finds non-resolution cheaper than resolution — and in which the specific voices that speak through the gaps are specifically the ones without that calculus to make.",
    narrativeTimeline: [
      { date: "Mar 27, 2023", label: "UN Security Council: 12 abstentions",
        body: "Russia-sponsored resolution for an independent international investigation is buried not by vetoes, but by twelve abstentions. No international mechanism is activated." },
      { date: "Feb 7, 2024", label: "Sweden closes",
        body: "Prosecutor cites a jurisdictional doctrine Danish legal scholar Kenneth Buhl publicly disputes. No attribution. SVT editorial: \"Sweden took the easiest way out.\"" },
      { date: "Feb 26, 2024", label: "Denmark closes",
        body: "Follows Sweden within weeks. Defence Academy experts report being barred from public discussion." },
      { date: "Jul 17, 2024", label: "Berlin refuses AfD question",
        body: "German government declines parliamentary inquiry on US-intelligence involvement — \"for reasons of state welfare.\"" },
      { date: "Aug 20, 2024", label: "Polish procedural failure on German EAW",
        body: "Poland does not execute the German European Arrest Warrant while Zhuravlev is on its territory. Rzeczpospolita documents the procedural breakdown." },
      { date: "Sep 5, 2024", label: "Chancellor's Office invokes Third Party Rule",
        body: "Wolfgang Schmidt (Kanzleramtschef) restricts Bundestag access to intelligence-sharing details. Named individual inside the avoidance pattern." },
      { date: "Oct 17, 2025", label: "Poland refuses extradition",
        body: "Judge Łubowski rules the act \"organized action by services of a warring state\" — a judicial frame bordering on legitimation. Tusk endorses." },
      { date: "Oct–Nov 2025", label: "Italy's Cassazione reverses itself three times",
        body: "Oct 17 extradition denied → Nov 19 approved → Nov 27 transfer. Judicial volatility across a single proceeding." },
      { date: "Dec 10, 2025", label: "The internal split",
        body: "The BGH rules \"a foreign government intelligence agency,\" indicts Ukrainian nationals — while the government suppresses the parliamentary record. Judiciary advances; government blocks. μ's central unresolved question.",
        turningPoint: { delta: "+4.8", reason: "Judiciary-vs-executive divergence within a single state. Before Dec 2025, μ could read each jurisdiction's closure as individually motivated; this event surfaces the pattern — avoidance is political, not procedural." } },
      { date: "Continuous", label: "Voices in the silences",
        body: "Ex-BND chief Hanning names Polish authorization. Sachs enumerates seven Western actors at the UN and excludes Russia. Prosecutor Ljungqvist describes his own case as \"a battlefield for influence operations.\" The unofficial record contradicts the official silence." },
    ],
    roleAttribution: {
      kind: "jurisdictional_avoidance",
      headline: "Not actors — jurisdictions, each with the capacity to advance and each choosing not to.",
      roles: [
        { role: "Procedural non-execution", actor: "Poland", flag: "PL",
          weight: 0.28,
          gloss: "Did not execute the German EAW. Courts rule \"organized action by a warring state.\" Tusk endorses non-extradition." },
        { role: "Information suppression", actor: "Germany — government layer", flag: "DE",
          weight: 0.22,
          gloss: "Chancellor's Office invokes the Third Party Rule; refuses Bundestag inquiry. Named individual: Wolfgang Schmidt." },
        { role: "Closed without attribution", actor: "Sweden", flag: "SE",
          weight: 0.14,
          gloss: "Closed on a jurisdictional doctrine Danish legal scholar Buhl publicly disputes." },
        { role: "Closed in parallel", actor: "Denmark", flag: "DK",
          weight: 0.12,
          gloss: "Defence Academy experts report being barred from public discussion." },
        { role: "Abstention burial", actor: "UN Security Council", flag: "UN",
          weight: 0.11,
          gloss: "Russian-sponsored independent-investigation resolution blocked not by vetoes but by twelve abstentions." },
        { role: "Three-step reversal", actor: "Italy — Court of Cassation", flag: "IT",
          weight: 0.08,
          gloss: "Oct 17 denied → Nov 19 approved → Nov 27 transfer. Within six weeks." },
        { role: "Counter-signal", actor: "Germany — judicial layer (BGH)", flag: "DE",
          weight: 0.05,
          gloss: "The system's internal split. BGH prosecutes and rules \"foreign government intelligence agency\" while government suppresses. μ cannot fully explain this." },
      ],
    },
    accommodates: [],
    supportingEv: ["E8","E9","E19","E31","E32","E33","E34","E35"],
    challengedBy: ["E17","E19"],
    unexplained: "Why does the German judicial layer (BGH prosecutes, ruling names 'foreign intelligence agency') diverge from the German government layer (Chancellor's Office invokes Third Party Rule)? μ describes a system-wide avoidance, but the system is internally split — and that split is itself part of the exhibit.",
    sourceFromCandidates: "C_insufficient (13.6%) ≈ 14%"
  },
  {
    id: "beta",
    kind: "event_sequence",
    label: "US-led operation with Ukrainian execution",
    shortLabel: "US-led operation",
    coverage: 0.10,
    isHero: false,
    claim: "The US (possibly with UK coordination) planned and materially enabled the attack; Ukrainian operators were the execution layer. Hersh's reporting was substantially correct on the agency; the specific method details (sonar-triggered, BALTOPS-planted) may be misattributions of an earlier discarded plan.",
    overlaySummary: "A US-led operation, possibly with UK coordination. Ukrainian operators served as the execution layer; the HMX came through US or NATO channels. The \"pro-Ukrainian group\" framing was built afterward to provide plausible deniability — Hersh had the agency right, the method wrong.",
    narrative: "The public record on motive is not in dispute. In February 2022 Biden publicly committed to ending Nord Stream 2. By autumn, Blinken called it \"a tremendous opportunity\" and Nuland was glad to see \"a piece of metal at the bottom of the sea.\" Reported separately: a \"Thank you USA\" tweet from Poland's foreign minister hours after the blasts; a claimed \"it's done\" SMS from the British prime minister; a casual remark from a sitting US president in 2025 asserting that Russia was not involved and \"many people know.\" On this reading, Hersh's 2023 reporting described the operation with the agency correctly identified but the method imperfectly rendered — divers placed the charges during BALTOPS 22, but the specific sonar-triggered mechanism was a narrative simplification of a more mundane timed-detonation execution. Ukrainian operators were the execution layer; the HMX came through US or NATO channels; the post-facto \"pro-Ukrainian group\" framing was constructed to offer plausible deniability to everyone at once. This storyline has to absorb three things that sit badly with it. The BGH indicted a Ukrainian national, not American personnel. In June 2022 the CIA warned Germany about a Ukrainian plan — if the US was the principal, warning the target country is strategically inexplicable. Der Spiegel's reporting on Zelensky's documented approval-then-withdrawal has no function in a story where Ukraine is the tool and the US is the agent. Each of these is survivable in isolation; together they cost β significant weight against α.",
    narrativeTimeline: [
      { date: "Feb 7, 2022", label: "Biden's public pledge",
        body: "Biden commits to \"ending\" Nord Stream 2 if Russia invades. On β's reading, not a warning — a pre-announcement of intent." },
      { date: "Spring 2022", label: "CIA plans the operation",
        body: "The Podol meeting is not where Ukraine informs the US — it is where the US directs Ukraine. HMX is supplied through US or NATO channels." },
      { date: "June 2022", label: "The warning that does not fit",
        body: "CIA warns Germany of a Ukrainian plan. Unresolved: if the US is the principal, warning the target country is strategically inexplicable. β has to reread this as a pre-constructed alibi." },
      { date: "Sep 7, 2022", label: "Andromeda sails",
        body: "Execution layer deploys. Ukrainian operators place the charges. Hersh's BALTOPS-divers account describes the same operation, imprecisely." },
      { date: "Sep 26, 2022", label: "Detonation",
        body: "Pipelines rupture. Sikorski tweets \"Thank you, USA\" — a direct acknowledgment, not post-facto gratitude." },
      { date: "Late 2022", label: "Post-facto satisfaction on record",
        body: "Blinken: \"a tremendous opportunity.\" Nuland: \"a piece of metal at the bottom of the sea.\" Truss reportedly SMSes Blinken \"it's done.\"" },
      { date: "Feb 2023", label: "Hersh publishes",
        body: "Macro-frame correct (agency = US), micro-execution imprecise. A leak from inside the operation, not fiction." },
      { date: "Mar 2023", label: "Pro-Ukrainian group narrative seeded",
        body: "Western intelligence channels begin leaking the pro-Ukrainian framing — in β, this is the deniability structure being installed after the fact." },
      { date: "May 2025", label: "Trump: \"many people know\"",
        body: "A sitting US president dismisses Russian involvement and signals prior-administration authorship. Corroborates β without confirming it." },
      { date: "Dec 10, 2025", label: "BGH's inconvenient indictment",
        body: "The BGH indicts Ukrainian nationals, not American personnel. β has to absorb this as US-engineered scapegoating — the largest single cost against β's coherence.",
        turningPoint: { delta: "−7.3", reason: "Judicial output is the hardest signal β has to re-read as fabrication. Each year the ruling stands, β's required chain of \"scapegoating that survives three jurisdictions\" extends — its weight drops steadily." } },
    ],
    roleAttribution: {
      kind: "complicity_structure",
      headline: "β inverts α: US as principal, Ukraine as execution layer.",
      roles: [
        { role: "Principal", actor: "United States", flag: "US",
          weight: 0.35,
          gloss: "Agency correctly identified in Hersh's macro-frame. HMX traced through US/NATO channels. Biden, Blinken, and Nuland's statements establish intent." },
        { role: "Execution layer", actor: "Ukraine", flag: "UA",
          weight: 0.25,
          gloss: "Operators identified in Andromeda forensics. Pro-Ukrainian group framing is the deniability structure, not the authorship." },
        { role: "Staging & coordination", actor: "Poland", flag: "PL",
          weight: 0.15,
          gloss: "Port access, post-operation protection. Sikorski's tweet reads as immediate acknowledgment rather than post-facto gratitude." },
        { role: "Possible co-principal", actor: "United Kingdom", flag: "GB",
          weight: 0.10,
          gloss: "Truss's reported \"it's done\" SMS to Blinken. Weight bounded by sourcing uncertainty." },
        { role: "Alternative", actor: "α, μ, δ, ε combined", flag: "OTHER",
          weight: 0.15,
          gloss: "BGH indicts Ukrainians not Americans; CIA warning Germany is strategically inexplicable under β; Zelensky's documented withdrawal has no function. Each is survivable; together they cost β significant weight." },
      ],
    },
    accommodates: ["F4","F5","F6"],
    supportingEv: ["E1","E16","E21","E23","E25","E27","E28","E30"],
    challengedBy: ["F3","F7","F12","E17","E18"],
    unexplained: "BGH indicts Kuznetsov (Ukrainian), not US personnel. The CIA's June 2022 warning to Germany is hard to reconcile with US authorship. Zelensky's documented withdrawal would be unnecessary if the US was the principal.",
    sourceFromCandidates: "C1 (5.7%) + ~third of C7 (2.2%) + ~half of C5 UK (2.1%) ≈ 10.0%"
  },
  {
    id: "delta",
    kind: "event_sequence",
    label: "Russian self-sabotage",
    shortLabel: "Russian self-sabotage (false flag)",
    coverage: 0.05,
    isHero: false,
    claim: "Russia destroyed its own infrastructure to weaponize blame against the West.",
    overlaySummary: "Russia destroyed its own pipelines to weaponize the attribution chaos against the West. To hold, this story needs every piece of Andromeda forensics — HMX, DNA, fingerprints, named operators — to be Russian fabrication surviving three years of independent judicial review in three countries.",
    narrative: "In this storyline Russia destroys its own pipelines to create a geopolitical weapon: every subsequent Western difficulty in attributing the act becomes a talking point, every Western leader's ambiguous statement becomes a confession. The Russian rescue ship SS-750 was photographed over the blast zone four days before detonation — consistent with self-authorship as well as with simple monitoring. To hold, this storyline has to explain the Andromeda forensic trail — HMX residue, DNA, fingerprints, forged identity papers — as deliberate planting, access to which was subsequently granted independently to German, Polish, and Italian judicial authorities and survived three years of cross-jurisdictional examination without unraveling. It has to explain why Putin, at the UN General Assembly, publicly accused \"Anglo-Saxons\" — an attribution that a self-author would not strategically advance, because it directs international attention precisely toward the two states most capable of actually having done it. Structurally, δ is the storyline that needs almost every piece of forensic evidence to be something other than what it appears to be.",
    narrativeTimeline: [
      { date: "Early 2022", label: "Strategic motive hypothesized",
        body: "Russia prepares to destroy its own pipelines to weaponize Western attribution chaos. Every subsequent Western ambiguity becomes a talking point." },
      { date: "Sep 22, 2022", label: "SS-750 over the blast zone",
        body: "Russian rescue ship photographed over the exact detonation coordinates four days before the event. Consistent with self-authorship — or with passive monitoring. δ needs the former." },
      { date: "Pre-detonation", label: "Forensic trail planted",
        body: "For δ to hold, Russia must fabricate in advance: HMX residue, DNA, fingerprints, forged identity papers, operator travel patterns — all tuned to later implicate Ukrainian operators." },
      { date: "Sep 26, 2022", label: "Detonation",
        body: "Three of four pipelines rupture. The intact fourth line — in δ's reading — is a deliberate signature choice." },
      { date: "Sep 27+, 2022", label: "Andromeda begins its discovery arc",
        body: "The yacht is traced, boarded, forensically examined — and nothing unravels. δ requires this to be a designed-for-discovery decoy operation." },
      { date: "Sep 2022", label: "Putin at the UN General Assembly",
        body: "Putin publicly accuses \"Anglo-Saxons\" — an attribution that directs international attention precisely at the two top-capability Western states. A self-author would not strategically do this. δ's largest internal contradiction.",
        turningPoint: { delta: "−6.5", reason: "A self-author does not direct international scrutiny toward actually-capable states. This single statement costs δ more than the entire forensic chain combined — not because it proves non-authorship, but because it contradicts the minimal behavioral coherence a false-flag operation requires." } },,
      { date: "2023–2026", label: "Forensic chain survives three jurisdictions",
        body: "German, Polish, and Italian courts access the Andromeda evidence independently. Three years of cross-jurisdictional examination without the fabrication unraveling. Each year the supply of \"Russia planted it\" hypothesis narrows." },
      { date: "Dec 10, 2025", label: "BGH rules",
        body: "Federal Court of Justice: \"a foreign government intelligence agency.\" δ has to read this as courts being deceived at the highest level — across three independent judicial systems simultaneously." },
    ],
    roleAttribution: {
      kind: "complicity_structure",
      headline: "δ requires the forensic trail itself to be fabricated.",
      roles: [
        { role: "Principal", actor: "Russia — self-sabotage", flag: "RU",
          weight: 0.40,
          gloss: "SS-750 presence over the blast zone four days before detonation. Narrative weapon to weaponize attribution ambiguity against the West." },
        { role: "Framed parties", actor: "Ukraine, US, Poland, Germany", flag: "FRAMED",
          weight: 0.20,
          gloss: "Everything identifying these actors — Andromeda forensics, HMX residue, DNA, fingerprints, named operators — would have to be Russian fabrication surviving three years of cross-jurisdictional examination." },
        { role: "Alternative", actor: "α, β, μ, ε combined", flag: "OTHER",
          weight: 0.40,
          gloss: "δ is the storyline that requires almost every piece of forensic evidence to be something other than what it appears to be. Putin's UN speech blaming \"Anglo-Saxons\" directs international attention toward the top-capability states — inconsistent with self-authorship." },
      ],
    },
    accommodates: [],
    supportingEv: ["E26"],
    challengedBy: ["F7","E6","E17","E23","E25"],
    unexplained: "Andromeda's HMX/DNA/fingerprints and all named operators are Ukrainian; these would all need to be fabricated evidence. Cross-jurisdiction forensic access (German, Polish, Italian courts) makes systemic fabrication implausible. Putin's UN speech blaming 'Anglo-Saxons' is inconsistent with self-authorship.",
    sourceFromCandidates: "C4 (5.4%) ≈ 5%"
  },
];

// ============================================================================
// ANCHOR FACTS (F1–F13) — undisputed foundation
// ============================================================================

const ANCHORS = [
  { id:"F1", time:"2022-09-26 04:03 & 19:03 UTC", fact:"Two pipeline sections detonate seventeen hours apart. Three of four lines destroyed; one intact. Swedish, Danish, and German seismographs record simultaneously.", },
  { id:"F2", time:"2022-09 forensic", fact:"Blast depth 70–80 m. Military-grade HMX residue confirmed by Swedish prosecutor; traces on the Andromeda yacht.", },
  { id:"F3", time:"Physical anomaly", fact:"The 17-hour interval between blasts. Incompatible with sonar-triggered remote one-shot detonation; consistent with manual or semi-automatic timed execution.", flagged:true },
  { id:"F4", time:"2022-02-07", fact:"Biden, standing next to Scholz, publicly commits to 'ending' Nord Stream 2 if Russia invades. On camera; uncontested.", },
  { id:"F5", time:"2022–2023 public record", fact:"Blinken and Nuland express post-facto satisfaction. Nuland: 'a piece of metal at the bottom of the sea.'", },
  { id:"F6", time:"2022-06", fact:"CIA issues strategic warning to Germany and other European allies that Nord Stream may be a target. Provenance chain: MIVD (Dutch) → CIA → Germany.", },
  { id:"F7", time:"Forensic, multi-jurisdictional", fact:"Andromeda: forged identities, HMX residue, DNA, fingerprints. Accessed independently by German, Polish, and Italian judicial authorities.", },
  { id:"F8", time:"Identified individuals", fact:"Volodymyr Zhuravlev (Poland) and Serhii Kuznetsov (Italy, Rimini) — identities, backgrounds, arrests, and judicial proceedings all in public records.", },
  { id:"F9", time:"2025-12-10", fact:"BGH (German Federal Court of Justice) formally classifies the operation, 'with high probability', as an intelligence-agency action ordered by a foreign government. Rejects functional-immunity appeal.", flagged:true },
  { id:"F10", time:"2025-10-17", fact:"Polish Judge Łubowski's ruling characterizes the act as 'organized action by services of a warring state' — a judicial categorization.", flagged:true },
  { id:"F11", time:"2022-09-26", fact:"Polish FM Sikorski tweets 'Thank you, USA' hours after the blasts. Tweet timestamp independently verifiable.", },
  { id:"F12", time:"Physical anomaly", fact:"Fourth pipeline intact. Multi-source confirmed. Inconsistent with professional naval SEAL-level operation; consistent with resource-limited team.", flagged:true },
  { id:"F13", time:"2024-02", fact:"Sweden and Denmark close investigations without attribution. Germany continues; Kuznetsov transferred to Germany for trial.", },
];

// ============================================================================
// INDEPENDENT VOICES — quote gallery for μ storyline
// ============================================================================

const INDEPENDENT_VOICES = [
  {
    id:"V1",
    speaker:"Mats Ljungqvist",
    role:"Swedish Senior Prosecutor",
    contextRole:"Lead prosecutor — the official closing the investigation",
    language:"Swedish",
    date:"2024",
    quote:"Nord Stream utredning: slagfält för påverkansoperationer.",
    translation:"The Nord Stream investigation is a battlefield for influence operations.",
    gloss:"The prosecutor whose job was to resolve the case, saying from inside the system what outside critics say. Uniquely powerful because it comes from the office that closed the file.",
    weight: "highest",
  },
  {
    id:"V2",
    speaker:"August Hanning",
    role:"Former Director, German Federal Intelligence Service (BND)",
    contextRole:"T1-level ex-intelligence chief",
    language:"German",
    date:"Die Welt, 2024",
    quote:"Die Operation musste die Unterstützung Polens und die Zustimmung sowohl des ukrainischen als auch des polnischen Präsidenten gehabt haben.",
    translation:"The operation must have had Poland's backing, and the approval of both the Ukrainian and Polish presidents.",
    gloss:"An ex-BND chief naming Polish state-level authorization in a mainstream German outlet. Sits outside both the government narrative and the journalistic mainstream.",
    weight: "high",
  },
  {
    id:"V3",
    speaker:"Jeffrey Sachs",
    role:"Columbia University; former UN senior advisor",
    contextRole:"Academic authority in a UN Security Council forum",
    language:"English",
    date:"UN Security Council, 2023",
    quote:"The US, the UK, Poland, Norway, Germany, Denmark, Sweden — singly or in coordination — are all plausible. Russia is not.",
    translation:null,
    gloss:"Enumerates seven Western actors and explicitly excludes Russia — in the formal UN setting. One of the few on-the-record T1 attributions to the Western alliance space.",
    weight: "high",
  },
  {
    id:"V4",
    speaker:"Kenneth Øhlenschlæger Buhl",
    role:"Danish Defence Academy, legal scholar",
    contextRole:"Domestic legal expert challenging his own government's closure",
    language:"Danish",
    date:"2024",
    quote:"Siger du, at du har jurisdiktion, så har du det — medmindre nogen bestrider det. Selv Rusland har ikke bestridt Sveriges og Danmarks jurisdiktion.",
    translation:"If you say you have jurisdiction, then you have it — unless someone disputes it. Not even Russia disputed Sweden's or Denmark's jurisdiction.",
    gloss:"Disputes — on technical legal grounds — the official reason for Sweden's closure. A Danish legal scholar publicly contradicting the Nordic prosecutorial position.",
    weight: "high",
  },
  {
    id:"V5",
    speaker:"Flemming Splidsboel",
    role:"Senior researcher, Danish Institute for International Studies (DIIS)",
    contextRole:"Policy researcher at a state-funded but editorially independent institute",
    language:"Danish",
    date:"2024",
    quote:"Lukketheden giver næring til myter, misinformation og konspirationsteorier.",
    translation:"The secrecy feeds myths, disinformation, and conspiracy theories.",
    gloss:"Names the cost of non-resolution: when the state system declines to answer, the answer-space gets filled by less-accountable voices.",
    weight: "medium",
  },
  {
    id:"V6",
    speaker:"Ola Tunander",
    role:"Swedish peace researcher (PRIO, emeritus)",
    contextRole:"Counter-narrative independent researcher — represents a suppressed-but-published position",
    language:"Swedish",
    date:"Various, 2023–2024",
    quote:"The Poseidon aircraft could have flown from Keflavík over Bornholm and triggered the charges.",
    translation:null,
    gloss:"An alternate mechanism hypothesis that circulates in Nordic independent research circles but does not enter mainstream discussion — an example of the Overton constraint around this case.",
    weight: "low",
  },
  {
    id:"V7",
    speaker:"SVT editorial desk",
    role:"Swedish public broadcaster, analysis column",
    contextRole:"Domestic journalist characterizing domestic government behavior",
    language:"Swedish",
    date:"2024",
    quote:"Sverige tog enklaste vägen ut.",
    translation:"Sweden took the easiest way out.",
    gloss:"A public-service broadcaster's in-country editorial judgment on the closing of the Swedish investigation. Not an outside accusation — an inside description.",
    weight: "high",
  },
  {
    id:"V8",
    speaker:"steigan.no editorial",
    role:"Norwegian independent left outlet",
    contextRole:"Domestic counter-narrative critique of domestic public broadcaster",
    language:"Norwegian",
    date:"2023",
    quote:"NRK har aldri fremstilt Hersh-rapporten rettferdig — de ser seg selv som talerør for regjeringen, NATO og Washington.",
    translation:"NRK has never fairly presented the Hersh report — they see themselves as a mouthpiece for the government, NATO, and Washington.",
    gloss:"A fringe voice critiquing the editorial stance of its own country's public broadcaster. Signal value: the existence of this critique documents an internal Nordic disagreement.",
    weight: "low",
  },
  {
    id:"V9",
    speaker:"Wolfgang Schmidt",
    role:"Chief of German Chancellor's Office (Kanzleramtschef)",
    contextRole:"Named actor inside the avoidance pattern",
    language:"German",
    date:"2024 (via t-online)",
    quote:"Third Party Rule — keine Offenlegung gegenüber dem Bundestag.",
    translation:"Third Party Rule — no disclosure to the Bundestag.",
    gloss:"The named individual invoking the legal mechanism that restricts parliamentary inquiry. Not a critic of avoidance — avoidance itself, identified by name.",
    weight: "reverse",
  },
];

// ============================================================================
// AVOIDANCE GRID — μ storyline sub-region A
// ============================================================================

const AVOIDANCE_GRID = [
  { id:"SE", place:"Sweden", actor:"Prosecutor's office", form:"Closed without attribution", detail:"Invoked 'presumed lack of jurisdiction' — a phrasing disputed by Danish legal scholar Buhl. SVT editorial: 'took the easiest way out.'", intensity:0.80 },
  { id:"DK", place:"Denmark", actor:"Prosecutor's office", form:"Closed in parallel", detail:"Defence Academy experts report being barred from public discussion. DIIS researcher: 'secrecy feeds myths.'", intensity:0.80 },
  { id:"DE-J", place:"Germany", actor:"Judicial layer (BGH)", form:"Active prosecution", detail:"Indicted Kuznetsov; ruled 'foreign government intelligence agency' — but deliberately unnamed. The internal split: judiciary advances while government suppresses.", intensity:0.35, counterSignal:true },
  { id:"DE-G", place:"Germany", actor:"Government layer", form:"Information suppression", detail:"Chancellor's Office invokes Third Party Rule; refuses Bundestag inquiry on US intelligence participation. Individually named: Wolfgang Schmidt.", intensity:0.85 },
  { id:"PL", place:"Poland", actor:"Prosecutor + state", form:"Procedural non-execution", detail:"Did not execute the German European Arrest Warrant. Tusk publicly endorses Łubowski's non-extradition. Sikorski signals asylum willingness.", intensity:0.90 },
  { id:"IT", place:"Italy", actor:"Cassazione (Supreme Court)", form:"Three-step reversal", detail:"Oct 17 extradition denied → Nov 19 approved → Nov 27 transfer. Judicial volatility across a single proceeding.", intensity:0.65, mixed:true },
  { id:"UN", place:"UN Security Council", actor:"International forum", form:"Abstention burial", detail:"Russia-sponsored independent-investigation resolution. Blocked not by vetoes but by twelve abstentions. No international mechanism activated.", intensity:0.80 },
];

// ============================================================================
// UNDERSTANDING (v0.3 carry-over, retained for timeline overlay in v0.3 mode)
// ============================================================================

const UNDERSTANDING_V03 = {
  t0: { head:"A single anonymous allegation, and the denial it provoked." },
  t1: { head:"Attention pivots from US to Ukrainian actors — still on single-sourced reporting." },
  t2: { head:"First physical-evidence lead — immediately contested by a senior intelligence reviewer." },
  t3: { head:"Three independent reports now point the same direction — all through leaked Western intelligence." },
  t4: { head:"A name surfaces — but from the same chain of leaks." },
  t5: { head:"Two of the three investigating states close their files without naming anyone." },
  t6: { head:"Germany identifies a suspect. That suspect leaves Europe under Ukrainian diplomatic protection." },
  t7: { head:"For the first time, the reporting points to Ukrainian military command — not freelance operators." },
  t8: { head:"A thin counter-signal keeps the US-capability hypothesis technically alive." },
  t9: { head:"A named coordinator is in custody — but no trial yet, and no statement from the accused." },
  t10:{ head:"A NATO ally refuses extradition of the accused — political protection, inferred rather than proven." },
  t11:{ head:"Ukrainian state-direction is the strongest single hypothesis — and no investigating state has officially said so." },
};



// ============================================================================
// STYLING TOKENS (preserved from v0.3)
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
  warnDeep:   "#8B6A20",
  muted:      "#B7B0A0",
  meta:       "#7A6A54",
};

// ============================================================================
// UTILITIES
// ============================================================================

function Rule({ className = "", tone }) {
  return <div className={className} style={{ height: 1, background: tone === "soft" ? colors.ruleSoft : colors.rule }} />;
}

function Tag({ children, tone = "default" }) {
  const tones = {
    default: { bg: colors.paperDeep, fg: colors.inkSoft, bd: colors.rule },
    primary: { bg: "#F4E4E0", fg: colors.primary, bd: colors.primarySoft },
    secondary:{ bg: "#E4ECF4", fg: colors.secondary, bd: colors.secondarySoft },
    warn:    { bg: "#F4ECD8", fg: colors.warnDeep, bd: "#D4B870" },
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
  if (c === "C2" || c === "C2b") return colors.primary;
  if (c === "C2a") return "#B05548"; // lighter primary
  if (c === "C2c") return "#8B2E22"; // deeper primary
  if (c === "C3") return colors.secondary;
  if (c === "C7") return colors.warn;
  if (c === "C_insufficient") return "#7A7A7A";
  if (c === "C_unknown") return "#A89F8A";
  if (c === "C1") return "#5A5A5A";
  return "#CEC7B5";
}

// Mini candidate icons — v0.4 adds C2a/b/c + C7 variants
function CandIcon({ cand, w = 16, h = 11 }) {
  const strokeColor = "rgba(26, 26, 26, 0.25)";
  const strokeWidth = 0.6;
  const isUA = cand === "C2" || cand === "C2a" || cand === "C2b" || cand === "C2c" || cand === "C3";

  switch (cand) {
    case "C1":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#FAF8F3"/>
          {[1,3,5,7,9].map((y,i)=>(<rect key={i} x="0" y={y} width="16" height="1" fill="#B22234"/>))}
          <rect x="0" y="0" width="7" height="6" fill="#3C3B6E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C2":
    case "C2a":
    case "C2b":
    case "C2c":
    case "C3":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="5.5" fill="#0057B7"/>
          <rect x="0" y="5.5" width="16" height="5.5" fill="#FFD700"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
          {cand === "C2a" && <rect x="0" y="0" width="3" height="11" fill="rgba(26,26,26,0.15)"/>}
          {cand === "C2c" && <rect x="13" y="0" width="3" height="11" fill="rgba(26,26,26,0.2)"/>}
        </svg>
      );
    case "C4":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="3.67" fill="#FAF8F3"/>
          <rect x="0" y="3.67" width="16" height="3.67" fill="#0039A6"/>
          <rect x="0" y="7.33" width="16" height="3.67" fill="#D52B1E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "C5":
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
    case "C6":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <circle cx="8" cy="5.5" r="2.2" fill="none" stroke={colors.inkMute} strokeWidth="1"/>
          <circle cx="8" cy="5.5" r="0.6" fill={colors.inkMute}/>
        </svg>
      );
    case "C7":
      // Compound UA + US icon — side-by-side
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="8" height="5.5" fill="#0057B7"/>
          <rect x="0" y="5.5" width="8" height="5.5" fill="#FFD700"/>
          <rect x="8" y="0" width="8" height="11" fill="#FAF8F3"/>
          {[0.5,2,3.5,5,6.5,8,9.5].map((y,i)=>(
            <rect key={i} x="8" y={y+0.5} width="8" height="0.8" fill="#B22234"/>
          ))}
          <rect x="8" y="0" width="4" height="3.5" fill="#3C3B6E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
          <line x1="8" y1="0" x2="8" y2="11" stroke="rgba(26,26,26,0.3)" strokeWidth="0.4"/>
        </svg>
      );
    case "C_unknown":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <text x="8" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
                fontSize="9" fontWeight="600" fill={colors.inkMute}>?</text>
        </svg>
      );
    case "C_insufficient":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <line x1="3" y1="5.5" x2="13" y2="5.5" stroke={colors.inkMute} strokeWidth="1.3"/>
        </svg>
      );
    // === Role-attribution flags: ISO-style short codes ===
    case "UA":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="5.5" fill="#0057B7"/>
          <rect x="0" y="5.5" width="16" height="5.5" fill="#FFD700"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "US":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#FAF8F3"/>
          {[1,3,5,7,9].map((y,i)=>(<rect key={i} x="0" y={y} width="16" height="1" fill="#B22234"/>))}
          <rect x="0" y="0" width="7" height="6" fill="#3C3B6E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "PL":
      // Poland — white over red horizontal
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="5.5" fill="#FAF8F3"/>
          <rect x="0" y="5.5" width="16" height="5.5" fill="#DC143C"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "DE":
      // Germany — black / red / gold horizontal
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="3.67" fill="#1A1A1A"/>
          <rect x="0" y="3.67" width="16" height="3.67" fill="#DD0000"/>
          <rect x="0" y="7.33" width="16" height="3.67" fill="#FFCE00"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "GB":
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
    case "RU":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="3.67" fill="#FAF8F3"/>
          <rect x="0" y="3.67" width="16" height="3.67" fill="#0039A6"/>
          <rect x="0" y="7.33" width="16" height="3.67" fill="#D52B1E"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "SE":
      // Sweden — blue with yellow cross (simplified)
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#006AA7"/>
          <rect x="0" y="4.5" width="16" height="2" fill="#FECC00"/>
          <rect x="5" y="0" width="2" height="11" fill="#FECC00"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "DK":
      // Denmark — red with white cross
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#C8102E"/>
          <rect x="0" y="4.5" width="16" height="2" fill="#FAF8F3"/>
          <rect x="5" y="0" width="2" height="11" fill="#FAF8F3"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "IT":
      // Italy — green/white/red vertical
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="5.33" height="11" fill="#009246"/>
          <rect x="5.33" y="0" width="5.33" height="11" fill="#FAF8F3"/>
          <rect x="10.67" y="0" width="5.33" height="11" fill="#CE2B37"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "UN":
      // UN — simplified laurel circle on light blue
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill="#5B92E5"/>
          <circle cx="8" cy="5.5" r="2.8" fill="none" stroke="#FAF8F3" strokeWidth="0.7"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    case "INCON":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <line x1="3" y1="5.5" x2="13" y2="5.5" stroke={colors.inkMute} strokeWidth="1.3"/>
        </svg>
      );
    case "UNKNOWN":
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <text x="8" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
                fontSize="9" fontWeight="600" fill={colors.inkMute}>?</text>
        </svg>
      );
    case "OTHER":
      // Small dot cluster — alternative / residual
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <circle cx="5" cy="5.5" r="1.2" fill={colors.muted}/>
          <circle cx="8" cy="5.5" r="1.2" fill={colors.muted}/>
          <circle cx="11" cy="5.5" r="1.2" fill={colors.muted}/>
        </svg>
      );
    case "FRAMED":
      // Hatched pattern — parties allegedly framed
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <rect x="0" y="0" width="16" height="11" fill={colors.paperDeep}/>
          <path d="M0,0 L16,11 M-4,8 L12,19 M4,-8 L20,3" stroke={colors.muted} strokeWidth="0.6"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    default:
      return <svg width={w} height={h} style={{ flexShrink: 0 }} />;
  }
}

// Language label flag (tiny version, for evidence-point decoration in v0.4 graph)
function LangFlag({ lang, size = 9 }) {
  const map = {
    en: "EN", de: "DE", pl: "PL", it: "IT", ru: "RU", sv: "SV",
    da: "DA", no: "NO", fi: "FI", uk: "UK", zh: "ZH", ar: "AR",
    fr: "FR", es: "ES", ja: "JA",
  };
  const label = map[lang] || "??";
  return (
    <span style={{
      fontFamily:"'JetBrains Mono', monospace", fontSize: size,
      color: colors.inkMute, letterSpacing: 0.3,
      padding: "1px 3px",
      border: `1px solid ${colors.rule}`,
      borderRadius: 1,
      background: colors.paper,
    }}>
      {label}
    </span>
  );
}



// ============================================================================
// FULLSCREEN GRAPH — mode-aware (handles v0.3 8-candidate and v0.4 11-candidate graphs)
// ============================================================================

// === NEW FullscreenGraph (v0.4 bucketed + primary/secondary layered) ===

function FullscreenGraph({
  activeEvidence, distribution,
  selectedEv, setSelectedEv,
  hoverCand, setHoverCand,
  hoverEv, setHoverEv,
  width, height,
  playing,
  mode,  // "v03" or "v04"
  focusStoryline, // null or storyline id, for v04 mode
  // v0.4 display controls
  expandedClusters,        // Set of cluster ids currently expanded in-place
  setExpandedClusters,
  expandedBuckets,
  setExpandedBuckets,
  // secondary cluster drawer
  selectedCluster, setSelectedCluster,
}) {
  const isV04 = mode === "v04";

  // Text measurement util (proportional font → canvas measure, cached)
  const measureText = useMemo(() => {
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const cache = new Map();
    return (text, fontSize, fontFamily = "Instrument Sans, sans-serif", fontWeight = 400) => {
      if (!ctx) return text.length * 6.8 + 4;
      const key = `${fontWeight}|${fontSize}|${fontFamily}|${text}`;
      if (cache.has(key)) return cache.get(key);
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const w = ctx.measureText(text).width;
      cache.set(key, w);
      return w;
    };
  }, []);

  const LEFT_X = width * 0.22;
  const RIGHT_X = playing ? width * 0.62 : width * 0.75;

  // v0.3-style fixed proportional layout: TOP and BOT mark the evidence/candidate band.
  // Evidence and candidates are distributed proportionally inside [TOP, BOT], so density
  // adjusts to row count without the stage ever growing past the container.
  const TOP = Math.round(height * 0.09);
  const BOT = Math.round(height * 0.86);

  // === Candidate-side computation ===
  // In v0.3: flat candidates as before.
  // In v0.4: bucketed. Each bucket renders as a parent node. If expanded, its members render
  //   as sub-nodes stacked underneath (accordion-style) with slight indentation.
  const candReadable = isV04 ? CAND_READABLE_V04_SHORT : CAND_READABLE_V03;

  // Compute which candidate rows to render and at what Y
  let candRows = []; // { id, isBucket, parentBucket, label, color, weight, indent }
  if (!isV04) {
    const sorted = [...CAND_ORDER_V03].sort((a,b)=> (distribution[b]||0) - (distribution[a]||0));
    candRows = sorted.map(c => ({
      id: c, isBucket: false, parentBucket: null,
      label: candReadable[c] || c, color: candColor(c),
      weight: distribution[c] || 0, indent: 0,
    }));
  } else {
    const bucketsSorted = [...BUCKETS_V04].sort((a,b)=> bucketWeight(b, distribution) - bucketWeight(a, distribution));
    bucketsSorted.forEach(b => {
      const w = bucketWeight(b, distribution);
      candRows.push({
        id: b.id, isBucket: true, parentBucket: null,
        label: b.label, color: candColor(b.flag),
        flag: b.flag, members: b.members, weight: w, indent: 0,
        expandable: b.expandable, overlap: b.overlap,
      });
      if (b.expandable && expandedBuckets.has(b.id)) {
        const subSorted = [...b.members].sort((a,c)=> (distribution[c]||0) - (distribution[a]||0));
        subSorted.forEach(c => {
          candRows.push({
            id: c, isBucket: false, parentBucket: b.id,
            label: candReadable[c] || c, color: candColor(c),
            weight: distribution[c] || 0, indent: 1,
          });
        });
      }
    });
  }

  // Distribute rows vertically with a minimum breathable spacing.
  // The side that needs more vertical room (usually evidence) determines the stage height.
  const nCandRows = candRows.length;

  // Reverse map: evidence id → SECONDARY_CLUSTERS entry (for showing a small
  // "belongs to cluster EC1 · collapse" affordance when the cluster is expanded)
  const evToSecCluster = useMemo(() => {
    const m = {};
    SECONDARY_CLUSTERS.forEach(cl => {
      cl.members.forEach(eid => { m[eid] = cl; });
    });
    return m;
  }, []);

  // === Evidence-side: cluster-by-cluster expansion ===
  // expandedClusters is a Set of cluster ids. Members of expanded clusters are
  // inlined (time-sorted into primary), so the reader sees one time-ordered list.
  // Members of collapsed clusters remain aggregated as a single summary node.
  const expandedClustersSet = expandedClusters instanceof Set ? expandedClusters : new Set();

  const toggleCluster = (clId) => {
    if (!setExpandedClusters) return;
    const next = new Set(expandedClustersSet);
    if (next.has(clId)) next.delete(clId);
    else next.add(clId);
    setExpandedClusters(next);
  };

  // Which evidence IDs are members of clusters (so they don't appear twice)
  const clusterMemberIds = new Set();
  SECONDARY_CLUSTERS.forEach(cl => {
    cl.members.forEach(m => clusterMemberIds.add(m));
  });

  // Collapsed cluster members = hidden from the time list
  const hiddenIds = new Set();
  SECONDARY_CLUSTERS.forEach(cl => {
    if (!expandedClustersSet.has(cl.id)) {
      cl.members.forEach(m => hiddenIds.add(m));
    }
  });

  // Build base evidence list (v0.4): primary + members of expanded clusters.
  // For v0.3: just all evidence.
  let evRows = [];
  if (!isV04) {
    const sorted = [...activeEvidence].sort((a,b) => a.published.localeCompare(b.published));
    sorted.forEach((ev) => evRows.push({ kind: "ev", id: ev.id, ev }));
  } else {
    // Inlined evidence = primary + members-of-expanded-clusters
    const inlined = activeEvidence.filter(e =>
      EVIDENCE_IMPORTANCE[e.id] === "primary" || !hiddenIds.has(e.id)
    );
    // Sort chronologically
    const sorted = [...inlined].sort((a,b) => a.published.localeCompare(b.published));
    sorted.forEach((ev) => evRows.push({ kind: "ev", id: ev.id, ev }));

    // Append a cluster summary row for each collapsed cluster
    SECONDARY_CLUSTERS.forEach(cl => {
      if (cl.members.length > 0 && !expandedClustersSet.has(cl.id)) {
        evRows.push({ kind: "cluster", id: cl.id, cluster: cl });
      }
    });
  }

  const nEvRows = evRows.length;

  // Candidate Y coords — proportional distribution across [TOP, BOT]
  const candY = {};
  if (nCandRows > 0) {
    candRows.forEach((r, i) => {
      candY[r.id] = TOP + (BOT - TOP) * (i / Math.max(1, nCandRows - 1));
    });
  }

  // Evidence Y coords — same proportional model
  const evY = {};
  if (nEvRows > 0) {
    evRows.forEach((r, i) => {
      evY[r.id] = TOP + (BOT - TOP) * (i / Math.max(1, nEvRows - 1));
    });
  }

  // Focus computation
  const selectedEvObj = (isV04 ? EVIDENCE_V04 : EVIDENCE_V03).find(e => e.id === selectedEv);

  // For edges: map edge.to (which references an individual candidate Cx) to the Y of whichever
  // candRow currently represents it. If its bucket isn't expanded, route to the bucket row.
  const candIdToRowId = {};
  candRows.forEach(r => {
    if (r.isBucket) {
      // bucket row itself
      candIdToRowId[r.id] = r.id;
    } else {
      candIdToRowId[r.id] = r.id;
    }
  });
  // Also allow individual candidates to fall back to their bucket if no sub-row exists
  const resolveCandidateY = (cId) => {
    if (cId in candY) return candY[cId];
    // Find bucket containing this candidate
    if (isV04) {
      const b = BUCKETS_V04.find(bb => bb.members.includes(cId));
      if (b && candY[b.id] != null) return candY[b.id];
    }
    return null;
  };
  const resolveCandidateColor = (cId) => {
    if (isV04) {
      const row = candRows.find(r => r.id === cId);
      if (row) return row.color;
      const b = BUCKETS_V04.find(bb => bb.members.includes(cId));
      if (b) return candColor(b.flag);
    }
    return candColor(cId);
  };

  const selectedSupports = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)>0).map(e=>e.to)) : null;
  const selectedOpposes  = selectedEvObj ? new Set(selectedEvObj.edges.filter(e=>(e.pol||0)<0).map(e=>e.to)) : null;
  const focusEv = selectedEv || hoverEv;

  const focusStorylineObj = isV04 && focusStoryline ? STORYLINES.find(s => s.id === focusStoryline) : null;
  const storyEvSet = focusStorylineObj ? new Set(focusStorylineObj.supportingEv) : null;
  const storyChallengeSet = focusStorylineObj ? new Set(focusStorylineObj.challengedBy || []) : null;

  const toggleBucket = (bId) => {
    const next = new Set(expandedBuckets);
    if (next.has(bId)) next.delete(bId);
    else next.add(bId);
    setExpandedBuckets(next);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="xMidYMid meet"
         style={{ width:"100%", height:"100%", display:"block" }}>
      {/* Evidence header */}
      <text x={LEFT_X} y={TOP * 0.55}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11" letterSpacing="1.4" fill={colors.inkMute} textAnchor="start">
        EVIDENCE · {isV04
          ? `${evRows.filter(r=>r.kind==="ev").length} ITEMS${evRows.filter(r=>r.kind==="cluster").length > 0 ? ` + ${evRows.filter(r=>r.kind==="cluster").length} CLUSTERS` : ""}`
          : `${evRows.length} ADMITTED`}
        {focusStorylineObj && ` · STORYLINE: ${focusStorylineObj.shortLabel.toUpperCase()}`}
      </text>

      {/* Candidates header */}
      {isV04 && (
        <text x={RIGHT_X} y={TOP * 0.55}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11" letterSpacing="1.4" fill={colors.inkMute} textAnchor="start">
          CANDIDATES · {BUCKETS_V04.length} BUCKETS
        </text>
      )}

      {/* === EDGES === rendered first so they sit under the nodes */}
      {evRows.map((row) => {
        const y1 = evY[row.id];

        if (row.kind === "cluster") {
          const cl = row.cluster;
          // Aggregate all edges of member evidence to their respective candidates
          const aggEdges = {}; // { "to": { sumPos, sumNeg, count } }
          cl.members.forEach(eid => {
            const ev = getEvidenceBy(eid);
            if (!ev) return;
            ev.edges.forEach(e => {
              if (!aggEdges[e.to]) aggEdges[e.to] = { sumPos: 0, sumNeg: 0, count: 0 };
              if (e.pol > 0) aggEdges[e.to].sumPos += e.s * ev.credibility;
              else if (e.pol < 0) aggEdges[e.to].sumNeg += e.s * ev.credibility;
              aggEdges[e.to].count += 1;
            });
          });

          return Object.entries(aggEdges).map(([to, agg], i) => {
            const y2 = resolveCandidateY(to);
            if (y2 == null) return null;
            const x1 = LEFT_X + 18 + 180;
            const x2 = RIGHT_X;
            const net = agg.sumPos - agg.sumNeg;
            const pol = net >= 0 ? 1 : -1;
            const strokeW = Math.min(2.8, 0.6 + Math.abs(net) * 1.4);
            const stroke = pol > 0 ? resolveCandidateColor(to) : colors.inkMute;
            const dash = pol < 0 ? "3,3" : "";

            const dx = x2 - x1;
            const cx1 = x1 + dx * 0.38;
            const cx2 = x2 - dx * 0.38;
            const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
            return (
              <path key={`${row.id}-${to}`} d={d}
                fill="none" stroke={stroke} strokeWidth={strokeW}
                strokeDasharray={dash} opacity={0.22}
                style={{ transition:"opacity 0.3s" }}/>
            );
          });
        }

        // Normal evidence row
        const ev = row.ev;
        const labelText = ev.label.length > 44 ? ev.label.slice(0,42)+"…" : ev.label;
        const mainLabelWidth = measureText(labelText, 13, "Instrument Sans, sans-serif", 400);
        const edgeStartX = LEFT_X + 18 + mainLabelWidth + 12;
        const inStoryline = storyEvSet && storyEvSet.has(ev.id);
        const isStoryChallenge = storyChallengeSet && storyChallengeSet.has(ev.id);
        const storyDim = focusStorylineObj && !inStoryline && !isStoryChallenge;

        return ev.edges.map((edge, i) => {
          const y2 = resolveCandidateY(edge.to);
          if (y2 == null) return null;
          const x1 = edgeStartX, x2 = RIGHT_X;
          const pol = edge.pol || 0;
          const isFocusEv = focusEv === ev.id;
          const isHoverCand = hoverCand === edge.to
            || (isV04 && hoverCand && BUCKETS_V04.find(b=>b.id===hoverCand && b.members.includes(edge.to)));
          const anyFocus = focusEv || hoverCand;
          const inFocus = isFocusEv || isHoverCand;
          const dim = (anyFocus && !inFocus) || storyDim;

          let stroke = colors.inkMute, strokeW = 0.7, dash = "";
          if (pol > 0) {
            stroke = resolveCandidateColor(edge.to);
            strokeW = 0.8 + edge.s * 2.4;
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
              fill="none" stroke={stroke}
              strokeWidth={inFocus ? strokeW + 1.2 : strokeW}
              strokeDasharray={dash}
              opacity={dim ? 0.06 : (inFocus ? 0.95 : 0.42)}
              style={{ transition:"opacity 0.3s, stroke-width 0.2s" }}/>
          );
        });
      })}

      {/* === EVIDENCE NODES & LABELS === */}
      {evRows.map((row) => {
        const y = evY[row.id];

        if (row.kind === "cluster") {
          const cl = row.cluster;
          const isSelected = selectedCluster === cl.id;
          const colorToken = cl.color === "warn" ? colors.warn
                           : cl.color === "meta" ? colors.meta
                           : cl.color === "primary" ? colors.primary
                           : colors.inkMute;
          // Derive short display ID from cluster.id, e.g. SC_WIL → E*WIL
          const shortId = "E*" + (cl.id.replace(/^SC_/, ""));
          return (
            <g key={`cluster-${cl.id}`}
               onMouseDown={(e)=>{ e.stopPropagation(); toggleCluster(cl.id); }}
               onMouseEnter={()=>setSelectedCluster(cl.id)}
               onMouseLeave={()=>setSelectedCluster(null)}
               style={{ cursor:"pointer" }}>
              {/* Cluster ring — circular (matches evidence-node shape language) */}
              <circle cx={LEFT_X} cy={y} r={10}
                      fill={colors.paperDeep} stroke={colorToken}
                      strokeWidth={isSelected ? 1.6 : 1}
                      strokeDasharray="2,2" opacity={isSelected ? 1 : 0.85}/>
              <text x={LEFT_X} y={y + 3.5} textAnchor="middle"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="10" fill={colorToken} fontWeight="600"
                    letterSpacing="0.2"
                    style={{ pointerEvents:"none" }}>
                {cl.members.length}
              </text>
              {/* Short ID (left side, mirrors evidence id column) */}
              <text x={LEFT_X - 20} y={y + 4}
                    textAnchor="end"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="11" fill={colorToken}
                    letterSpacing="0.3" fontWeight="600"
                    style={{ pointerEvents:"none" }}>
                {shortId}
              </text>
              {/* Label (right side) — count already shown in the ring, no duplicate */}
              <text x={LEFT_X + 18} y={y + 4}
                    fontFamily="'Instrument Sans', sans-serif"
                    fontSize="12.5" fill={colors.ink}
                    fontStyle="italic"
                    style={{ pointerEvents:"none" }}>
                {cl.label}
              </text>
            </g>
          );
        }

        // Regular evidence label
        const ev = row.ev;
        const isSel = selectedEv === ev.id;
        // Forward focus: evidence itself is selected/hovered
        const isFocusByEv = focusEv === ev.id;
        // Reverse focus: a candidate is hovered AND this evidence supports/opposes it
        const isFocusByCand = hoverCand && ev.edges && ev.edges.some(e => {
          // handle both direct candidate IDs and bucket IDs — if hoverCand is a bucket,
          // check whether any of the edge targets fall inside that bucket
          if (e.to === hoverCand) return true;
          const b = BUCKETS_V04.find(b => b.id === hoverCand);
          return b && b.members.includes(e.to);
        });
        const isFocus = isFocusByEv || isFocusByCand;
        const anyFocus = focusEv || hoverCand;
        const dim = anyFocus && !isFocus;
        const inStoryline = storyEvSet && storyEvSet.has(ev.id);
        const isStoryChallenge = storyChallengeSet && storyChallengeSet.has(ev.id);
        const storyDim = focusStorylineObj && !inStoryline && !isStoryChallenge;
        const labelText = ev.label.length > 44 ? ev.label.slice(0,42)+"…" : ev.label;
        const metaSuffix = isV04 && ev.language ? ` · ${ev.language.toUpperCase()}` : "";
        const metaText = `${ev.published} · cred ${ev.credibility.toFixed(2)}${metaSuffix}`;
        const evIdWidth = measureText(ev.id, 12, "JetBrains Mono, monospace", 600) + 6;
        const mainLabelWidth = measureText(labelText, 14, "Instrument Sans, sans-serif", 500) + 8;
        const metaLabelWidth = measureText(metaText, 10, "JetBrains Mono, monospace", 400) + 6;
        const cluster = ev.cluster === "western_intel_leaks";
        const coverageMeta = ev.cluster === "coverage_meta";
        const germanJudicial = ev.cluster === "german_judicial";

        return (
          <g key={`ev-${ev.id}`}
             onMouseEnter={()=>setHoverEv(ev.id)}
             onMouseLeave={()=>setHoverEv(null)}
             onMouseDown={(e)=>{ e.stopPropagation(); setSelectedEv(isSel ? null : ev.id); }}
             style={{ cursor:"pointer", opacity: (dim || storyDim) ? 0.35 : 1, transition:"opacity 0.3s" }}>
            {cluster && (
              <circle cx={LEFT_X} cy={y} r={12}
                      fill="none" stroke={colors.warn}
                      strokeWidth="0.9" strokeDasharray="2,2"
                      opacity={0.7}/>
            )}
            {coverageMeta && (
              <circle cx={LEFT_X} cy={y} r={11}
                      fill="none" stroke={colors.meta}
                      strokeWidth="1.0" strokeDasharray="1,2"
                      opacity={0.9}/>
            )}
            {germanJudicial && (
              <circle cx={LEFT_X} cy={y} r={13}
                      fill="none" stroke={colors.ink}
                      strokeWidth="0.9" opacity={0.6}/>
            )}
            {isStoryChallenge && (
              <circle cx={LEFT_X} cy={y} r={14}
                      fill="none" stroke={colors.primary}
                      strokeWidth="1.2" strokeDasharray="3,2"
                      opacity={0.85}/>
            )}
            <circle cx={LEFT_X} cy={y}
                    r={isSel ? 8 : 5}
                    fill={isSel ? colors.ink : colors.paper}
                    stroke={colors.ink}
                    strokeWidth={isFocus ? 2 : 1}
                    style={{ transition:"all 0.2s" }}/>

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
                  letterSpacing="0.3">{ev.id}</text>
            {isFocus && (
              <rect x={LEFT_X + 14} y={y - 9}
                    width={mainLabelWidth} height={18}
                    fill={colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X + 18} y={y + 4}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={isFocus ? 14 : 13}
                  fill={isFocus ? colors.ink : colors.inkSoft}
                  fontWeight={isFocus ? 500 : 400}>
              {labelText}
            </text>
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
              {metaText}
            </text>
            {/* Cluster affordance — only when this evidence is an inlined member of a currently-expanded cluster */}
            {isV04 && evToSecCluster[ev.id] && expandedClustersSet.has(evToSecCluster[ev.id].id) && (() => {
              const cl = evToSecCluster[ev.id];
              const shortId = "E*" + cl.id.replace(/^SC_/, "");
              const colorToken = cl.color === "warn" ? colors.warn
                              : cl.color === "meta" ? colors.meta
                              : cl.color === "primary" ? colors.primary
                              : colors.inkMute;
              const chipText = `${shortId} ⤴`;
              const chipWidth = measureText(chipText, 9.5, "JetBrains Mono, monospace", 500) + 10;
              const metaEndX = LEFT_X + 18 + measureText(metaText, 10, "JetBrains Mono, monospace", 400) + 10;
              return (
                <g transform={`translate(${metaEndX}, ${y + 11})`}
                   onMouseDown={(e)=>{ e.stopPropagation(); toggleCluster(cl.id); }}
                   style={{ cursor:"pointer" }}>
                  <title>Belongs to "{cl.label}" cluster · click to collapse back</title>
                  <rect x={0} y={0} width={chipWidth} height={14} rx="2"
                        fill={colors.paper} stroke={colorToken}
                        strokeWidth="0.8" strokeDasharray="2,2"
                        opacity={0.85}/>
                  <text x={chipWidth/2} y={10} textAnchor="middle"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="9.5" fill={colorToken} fontWeight="500"
                        letterSpacing="0.3"
                        style={{ pointerEvents:"none" }}>
                    {chipText}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* === CANDIDATE NODES === */}
      {candRows.map((row) => {
        const y = candY[row.id];
        const v = row.weight;
        const isHover = hoverCand === row.id;
        const isSupported = selectedSupports?.has(row.id)
          || (row.isBucket && row.members?.some(m => selectedSupports?.has(m)));
        const isOpposed = selectedOpposes?.has(row.id)
          || (row.isBucket && row.members?.some(m => selectedOpposes?.has(m)));
        const cc = row.color;
        const fill = isSupported ? cc : colors.paper;
        const sizeScale = isV04 ? 0.045 : 0.05;
        const radius = (row.isBucket ? 7 : 4) + v * Math.min(width, height) * sizeScale;
        const dim = (focusEv && !isSupported && !isOpposed)
                 || (hoverCand && hoverCand !== row.id);
        const pctText = `${(v*100).toFixed(1)}%`;
        const isExpanded = row.isBucket && expandedBuckets.has(row.id);
        const indentOffset = row.indent * 28;

        return (
          <g key={`cand-${row.id}`}
             onMouseEnter={()=>setHoverCand(row.id)}
             onMouseLeave={()=>setHoverCand(null)}
             onMouseDown={(e)=>{
               if (row.isBucket && row.expandable) {
                 e.stopPropagation();
                 toggleBucket(row.id);
               }
             }}
             style={{ cursor: row.isBucket && row.expandable ? "pointer" : "default",
               opacity: dim ? 0.35 : 1, transition:"opacity 0.3s" }}>
            {/* Indicator of expanded state */}
            {row.isBucket && row.expandable && (
              <g transform={`translate(${RIGHT_X - 20 + indentOffset}, ${y - 4})`}>
                <path d={isExpanded ? "M0 3 L4 -1 L8 3" : "M0 0 L4 4 L0 8"}
                      stroke={colors.inkMute} strokeWidth="1.2" fill="none"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            )}
            {row.parentBucket && (
              // L-connector to parent bucket
              <line x1={RIGHT_X - 12 + indentOffset} y1={y}
                    x2={RIGHT_X - 4 + indentOffset} y2={y}
                    stroke={colors.ruleSoft} strokeWidth="1"/>
            )}

            <circle cx={RIGHT_X + indentOffset} cy={y} r={radius}
                    fill={fill} stroke={cc}
                    strokeWidth={isHover ? 2.4 : (row.isBucket ? 1.6 : 1.0)}
                    strokeDasharray={isOpposed ? "3,2" : ""}
                    opacity={isHover ? 1 : (row.parentBucket ? 0.8 : 0.92)}
                    style={{ transition:"all 0.4s cubic-bezier(.2,.7,.2,1)" }}/>

            {row.isBucket && row.flag && (
              <g transform={`translate(${RIGHT_X + indentOffset + radius + 14}, ${y - 14})`}>
                <CandIcon cand={row.flag} w={16} h={11} />
              </g>
            )}
            {!row.isBucket && (
              <g transform={`translate(${RIGHT_X + indentOffset + radius + 14}, ${y - 10})`}>
                <CandIcon cand={row.id} w={12} h={8} />
              </g>
            )}

            <text x={RIGHT_X + indentOffset + radius + 14 + (row.isBucket ? 22 : 18)}
                  y={row.isBucket ? y - 5 : y - 2}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize={row.isBucket ? 10 : 9}
                  fill={colors.inkMute}
                  letterSpacing="0.5">
              {row.isBucket ? `BUCKET · ${row.members.length} sub` : row.id}
            </text>

            <text x={RIGHT_X + indentOffset + radius + 14}
                  y={row.isBucket ? y + 12 : y + 11}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={row.isBucket ? (v > 0.15 ? 17 : 15) : 13}
                  fill={colors.ink}
                  fontWeight={row.isBucket ? (v > 0.15 ? 600 : 500) : 400}>
              {row.label}
            </text>

            <text x={RIGHT_X + indentOffset + radius + 14}
                  y={row.isBucket ? y + 32 : y + 25}
                  fontFamily="'Fraunces', serif"
                  fontSize={row.isBucket ? (v > 0.15 ? 22 : 17) : 14}
                  fontStyle="italic"
                  fill={cc}
                  fontVariantNumeric="tabular-nums">
              {pctText}
            </text>

            {row.isBucket && row.overlap && isHover && (
              <g>
                <rect x={RIGHT_X + indentOffset - 10} y={y + 40}
                      width={340} height={28} rx="2"
                      fill={colors.paperDeep} stroke={colors.warn}
                      strokeWidth="0.8" opacity={0.96}/>
                <text x={RIGHT_X + indentOffset - 4} y={y + 57}
                      fontFamily="'JetBrains Mono', monospace"
                      fontSize="9" fill={colors.warnDeep}
                      letterSpacing="0.3">
                  ⚠ overlap: see below
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Show-all / primary toggle is rendered as HTML outside the SVG so it can
          stay fixed in the viewport even when the stage scrolls vertically. */}
    </svg>
  );
}

// ============================================================================
// TIMELINE BAR — v0.3 mode only (preserved from original)
// ============================================================================

function TimelineBar({ idx, setIdx, timeline }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hoverTick, setHoverTick] = useState(null);

  const onMove = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    const frac = x / r.width;
    const n = Math.round(frac * (timeline.length - 1));
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

  const pct = (idx / (timeline.length - 1)) * 100;
  const hoverTP = hoverTick != null ? timeline[hoverTick] : null;
  const hoverPct = hoverTick != null ? (hoverTick / (timeline.length - 1)) * 100 : null;

  return (
    <div ref={trackRef}
      onMouseDown={(e)=>{ setDragging(true); onMove(e.clientX); }}
      style={{ position:"relative", height: 42, cursor:"pointer", width:"100%", userSelect:"none" }}>
      <div style={{ position:"absolute", top: 21, left: 0, right: 0, height: 1, background: colors.rule }} />
      <div style={{ position:"absolute", top: 21, left: 0, width: `${pct}%`, height: 1,
        background: colors.ink, transition: dragging ? "none" : "width 0.4s" }} />
      {timeline.map((t, i) => {
        const x = (i / (timeline.length - 1)) * 100;
        const active = i <= idx;
        const current = i === idx;
        return (
          <div key={t.tag}
               onMouseEnter={()=>setHoverTick(i)}
               onMouseLeave={()=>setHoverTick(null)}
               onMouseDown={(e)=>{ e.stopPropagation(); setIdx(i); }}
               style={{ position:"absolute", left: `${x}%`, top: 0, height: 42,
                 transform:"translateX(-50%)", cursor:"pointer",
                 display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif",
              fontSize: current ? 11.5 : 10.5,
              color: current ? colors.primary : hoverTick === i ? colors.ink : (active ? colors.inkSoft : colors.muted),
              marginBottom: 8,
              fontWeight: (current || hoverTick === i) ? 600 : 400,
              whiteSpace: "nowrap", transition:"all 0.15s", lineHeight: 1 }}>{t.label}</div>
            <div style={{ width: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
              height: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
              borderRadius: "50%",
              background: current ? colors.primary : (active ? colors.ink : colors.muted),
              border: current ? `2px solid ${colors.paper}` : "none",
              boxShadow: current ? `0 0 0 1px ${colors.primary}` : "none",
              marginTop: current ? -2 : 0, transition:"all 0.15s" }} />
            {current && (
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.primary, letterSpacing: 0.4,
                marginTop: 4, whiteSpace:"nowrap", fontWeight: 500, lineHeight: 1 }}>
                {t.date}
              </div>
            )}
          </div>
        );
      })}
      {hoverTP && hoverTick !== idx && (
        <div style={{ position:"absolute", left: `${hoverPct}%`, bottom: "calc(100% + 10px)",
          transform: hoverPct > 88 ? "translateX(-88%)" : hoverPct < 12 ? "translateX(-12%)" : "translateX(-50%)",
          zIndex: 20, pointerEvents:"none", maxWidth: 280, padding: "7px 12px",
          background: "rgba(250, 248, 243, 0.88)",
          backdropFilter:"blur(18px) saturate(160%)",
          WebkitBackdropFilter:"blur(18px) saturate(160%)",
          border: `1px solid rgba(217, 212, 199, 0.9)`, borderRadius: 3,
          boxShadow: "0 8px 20px rgba(26,26,26,0.08)" }}>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
            color: colors.ink, lineHeight: 1.4 }}>{hoverTP.desc}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DISTRIBUTION OVERLAY — mode-aware
// ============================================================================

// Reusable info-icon tooltip — a small "i" glyph that on hover reveals a
// reader-friendly explanation for a field, label, or concept. Used throughout
// the v0.4 evidence drawer so the six reasoning labels and the non-obvious
// fields (source_confidence, original_text, caveats) are self-documenting.
function InfoTooltip({ heading, body, align = "left", width = 280, tone = "neutral", size = 12 }) {
  const [show, setShow] = useState(false);
  const toneColor = tone === "warn" ? colors.warn
                  : tone === "primary" ? colors.primary
                  : colors.inkMute;
  // Scale icon internals proportionally to requested size so small inline uses
  // (inside 10px-font pills) don't push the pill taller than sibling tags.
  const s = size / 12;
  return (
    <span
      onMouseEnter={()=>setShow(true)}
      onMouseLeave={()=>setShow(false)}
      onMouseDown={(e)=>{ e.stopPropagation(); }}
      style={{ position:"relative",
        display:"inline-flex", alignItems:"center",
        cursor:"help", marginLeft: 4, verticalAlign:"middle",
        lineHeight: 1 }}>
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none"
        style={{ opacity: show ? 1 : 0.5, transition:"opacity 0.15s", display:"block" }}>
        <circle cx="6" cy="6" r="5.2" fill="none" stroke={toneColor} strokeWidth={0.9/s}/>
        <circle cx="6" cy="3.2" r="0.7" fill={toneColor}/>
        <line x1="6" y1="5" x2="6" y2="9" stroke={toneColor} strokeWidth={1/s} strokeLinecap="round"/>
      </svg>
      {show && (
        <div style={{
          position:"absolute", top: "calc(100% + 8px)",
          left: align === "left" ? 0 : "auto",
          right: align === "right" ? 0 : "auto",
          zIndex: 60, pointerEvents:"none",
          width: width, padding: "11px 14px",
          background: "rgba(250, 248, 243, 0.98)",
          backdropFilter:"blur(14px) saturate(160%)",
          WebkitBackdropFilter:"blur(14px) saturate(160%)",
          border: `1px solid ${toneColor}`, borderRadius: 2,
          boxShadow: "0 10px 24px rgba(26,26,26,0.14)",
          fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
          color: colors.ink, lineHeight: 1.5,
          animation: "fadeIn 0.12s ease-out",
          whiteSpace:"normal",
        }}>
          {heading && (
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
              color: toneColor, letterSpacing: 0.8, textTransform:"uppercase",
              marginBottom: 6, fontWeight: 600 }}>
              {heading}
            </div>
          )}
          <div style={{ color: colors.inkSoft }}>{body}</div>
        </div>
      )}
    </span>
  );
}

// ============================================================================
// InferenceRow — visualizes a single inference as [LABEL] ─→ target summary,
// with the full reasoning text collapsed behind a click. The arrow-diagram
// pattern makes "what pushes to what" the primary scannable signal; prose is
// secondary and opt-in, so the reader isn't drowned in paragraphs. Each row is
// self-contained so scroll position is preserved when individual rows expand.
// ============================================================================

function InferenceRow({ inf }) {
  const [open, setOpen] = useState(false);
  const meta = REASONING_LABELS[inf.label] || {
    pearl: "—", color: colors.ink, colorSoft: colors.paperDeep,
    short: "", long: inf.label, role: "",
  };
  return (
    <div style={{
      borderLeft: `3px solid ${meta.color}`,
      paddingLeft: 12, paddingTop: 2, paddingBottom: 2,
      transition: "background 0.12s" }}>
      {/* Row: [LABEL pill] ─→ [target summary]  ·  (expand chevron) */}
      <div
        onClick={()=>setOpen(o=>!o)}
        style={{
          display:"grid",
          gridTemplateColumns:"auto 18px 1fr auto",
          alignItems:"center", columnGap: 8, rowGap: 0,
          cursor:"pointer",
          padding: "4px 0" }}>
        {/* Label pill with info tooltip attached */}
        <span style={{ display:"inline-flex", alignItems:"center", gap: 5 }}>
          <span style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: 0.8, textTransform:"uppercase", fontWeight: 600,
            padding:"3px 8px", borderRadius: 2,
            background: meta.colorSoft, color: meta.color,
            border: `1px solid ${meta.color}40`,
            lineHeight: 1.3, whiteSpace:"nowrap" }}>
            {inf.label}
          </span>
          <InfoTooltip
            heading={`${inf.label} · Pearl ${meta.pearl}`}
            body={
              <>
                <div style={{ fontStyle:"italic", marginBottom: 8,
                  color: colors.ink, fontFamily:"'Fraunces', serif",
                  fontSize: 13, lineHeight: 1.4 }}>
                  Read this as: {meta.short}
                </div>
                <div>{meta.long}</div>
              </>
            }
            width={320}
            size={11}
          />
        </span>

        {/* Arrow connector — the "pushes to" glyph */}
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none"
          style={{ display:"block" }}>
          <line x1="0" y1="5" x2="14" y2="5" stroke={meta.color}
                strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M11 2 L15 5 L11 8" stroke={meta.color}
                strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" fill="none"/>
        </svg>

        {/* Target summary — what this inference pushes to */}
        <span style={{
          fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5,
          color: colors.ink, lineHeight: 1.4, fontWeight: 500 }}>
          {inf.summary || inf.inference}
        </span>

        {/* Disclosure chevron — subtle, only appears on the row */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            opacity: 0.45,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s, opacity 0.15s",
            display:"block" }}>
          <path d="M3.5 2 L6.5 5 L3.5 8" stroke={colors.inkMute}
                strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" fill="none"/>
        </svg>
      </div>

      {/* Full reasoning — only when expanded */}
      {open && (
        <div style={{
          marginTop: 8, marginLeft: 0,
          padding: "10px 12px",
          background: colors.paperDeep,
          borderRadius: 2,
          borderLeft: `2px solid ${meta.color}40`,
          animation: "fadeIn 0.15s ease-out" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
            color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
            marginBottom: 6 }}>
            Full reasoning · Pearl {meta.pearl} · {meta.role}
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: colors.inkSoft, lineHeight: 1.6 }}>
            {inf.inference}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact warn-icon tooltip — hover reveals the bucket-overlap explanation without
// taking any vertical space in the overlay when at rest. Placed inline next to
// the bucket label so the reader sees which bucket the warning applies to.
function OverlapTooltip({ text, align = "left" }) {
  const [show, setShow] = useState(false);
  return (
    <span
      onMouseEnter={()=>setShow(true)}
      onMouseLeave={()=>setShow(false)}
      onMouseDown={(e)=>{ e.stopPropagation(); }}
      style={{ position:"relative",
        display:"inline-flex", alignItems:"center",
        cursor:"help", marginLeft: 5, verticalAlign:"middle",
        lineHeight: 1 }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
        style={{ opacity: show ? 1 : 0.55, transition:"opacity 0.15s", display:"block" }}>
        <path d="M5.5 0.8 L10 9.5 L1 9.5 Z" fill="none" stroke={colors.warn} strokeWidth="1"/>
        <circle cx="5.5" cy="8" r="0.6" fill={colors.warnDeep}/>
        <line x1="5.5" y1="4.2" x2="5.5" y2="6.6" stroke={colors.warnDeep} strokeWidth="0.9" strokeLinecap="round"/>
      </svg>
      {show && (
        <div style={{
          position:"absolute", top: "calc(100% + 8px)",
          left: align === "left" ? 0 : "auto",
          right: align === "right" ? 0 : "auto",
          zIndex: 30, pointerEvents:"none",
          width: 260, padding: "9px 12px",
          background: "rgba(250, 248, 243, 0.96)",
          backdropFilter:"blur(14px) saturate(160%)",
          WebkitBackdropFilter:"blur(14px) saturate(160%)",
          border: `1px solid ${colors.warn}`, borderRadius: 2,
          boxShadow: "0 10px 24px rgba(26,26,26,0.12)",
          fontFamily:"'Instrument Sans', sans-serif", fontSize: 11.5,
          color: colors.ink, lineHeight: 1.5,
          animation: "fadeIn 0.12s ease-out",
          whiteSpace:"normal",
        }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.warnDeep, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 5 }}>
            Overlap
          </div>
          <div>{text}</div>
        </div>
      )}
    </span>
  );
}

function DistributionOverlay({ distribution, hoverCand, setHoverCand, tp, playing, onPlayToggle, mode, focusStoryline, setFocusStoryline }) {
  const isV04 = mode === "v04";

  const [pos, setPos] = useState({ top: 20, right: 20, left: null });
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startTop: 0, startLeft: 0 });

  const onHeaderMouseDown = (e) => {
    e.preventDefault();
    // Overlay is position:sticky inside the graph container.
    // Drag coords are relative to the containing (scrollable) parent.
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.offsetParent || document.documentElement;
    const parentRect = parent.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY,
      startLeft: rect.left - parentRect.left, startTop: rect.top - parentRect.top };
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
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [dragging]);

  // Resolve current storyline (v0.4 only). Default α if none set.
  const effectiveStoryId = isV04 ? (focusStoryline || "alpha") : null;
  const story = effectiveStoryId ? STORYLINES.find(s => s.id === effectiveStoryId) : null;

  // === v0.4: build rows from the focused storyline's roleAttribution. ===
  // === v0.3: build rows from the legacy candidate distribution. ===
  let rows, head, storyGlyph;
  if (isV04 && story && story.roleAttribution) {
    const ra = story.roleAttribution;
    rows = ra.roles.map(r => ({
      key: r.role + "|" + r.actor,
      label: r.actor,
      subLabel: r.role,
      flag: r.flag,
      weight: r.weight,
      gloss: r.gloss,
    }));
    head = ra.headline;
    storyGlyph = effectiveStoryId === "alpha" ? "α"
               : effectiveStoryId === "beta"  ? "β"
               : effectiveStoryId === "mu"    ? "μ"
               : effectiveStoryId === "epsilon" ? "ε"
               : effectiveStoryId === "delta" ? "δ" : "";
  } else if (isV04) {
    rows = [];
    head = "Select a storyline to see its role attribution.";
  } else {
    // v0.3 mode: legacy path
    rows = CAND_ORDER_V03.map(k => ({
      key: k, label: CAND_READABLE_V03[k] || k, flag: k,
      weight: distribution[k] || 0,
    })).sort((a,b)=> b.weight - a.weight);
    head = tp ? (UNDERSTANDING_V03[tp.tag]?.head || "—") : "—";
  }

  // Storyline toggle pills (v0.4 only)
  const storyPills = [
    { id: "alpha",   glyph: "α", coverage: 0.50, color: colors.primary },
    { id: "epsilon", glyph: "ε", coverage: 0.21, color: colors.inkSoft },
    { id: "mu",      glyph: "μ", coverage: 0.14, color: colors.meta },
    { id: "beta",    glyph: "β", coverage: 0.10, color: colors.inkSoft },
    { id: "delta",   glyph: "δ", coverage: 0.05, color: colors.muted },
  ];

  // Positioning: sticky inside graph container. User drag overrides with absolute.
  const userDragged = pos.top !== 20 || pos.left !== null;
  const stickyStyle = userDragged
    ? { position: "absolute", top: pos.top,
        ...(pos.right != null ? { right: pos.right } : { left: pos.left }) }
    : { position: "sticky", top: 20, marginLeft: "auto", marginRight: 20, marginTop: 20 };

  return (
    <div onMouseDown={onHeaderMouseDown}
      style={{ ...stickyStyle, zIndex: 8,
        background: "rgba(250, 248, 243, 0.88)",
        backdropFilter:"blur(18px) saturate(140%)",
        WebkitBackdropFilter:"blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.85)`, borderRadius: 3,
        width: isV04 ? 340 : 300,
        alignSelf: "flex-start",
        boxShadow: dragging ? "0 16px 40px rgba(26,26,26,0.10)" : "0 12px 32px rgba(26,26,26,0.06)",
        transition: dragging ? "none" : "box-shadow 0.2s",
        userSelect: dragging ? "none" : "auto", cursor: dragging ? "grabbing" : "grab" }}>

      {/* Header row */}
      <div style={{ padding: "9px 14px 8px", display:"flex",
        justifyContent:"space-between", alignItems:"center", gap: 8 }}>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase", lineHeight: 1 }}>
            Current understanding
          </div>
          {onPlayToggle && !isV04 && (
            <button onMouseDown={(e)=>{ e.stopPropagation(); }}
              onClick={(e)=>{ e.stopPropagation(); onPlayToggle(); }}
              style={{ width: 20, height: 20, borderRadius: 3,
                border: playing ? `1px solid ${colors.ink}` : `1px solid ${colors.rule}`,
                background: playing ? colors.ink : "transparent", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s", padding: 0, flexShrink: 0 }}>
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
          {!isV04 && tp && (
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 10.5,
              color: colors.primary, letterSpacing: 0.2, fontWeight: 500 }}>
              {tp.label}
            </div>
          )}
          <button onMouseDown={(e)=>{ e.stopPropagation(); }}
            onClick={(e)=>{ e.stopPropagation(); setCollapsed(!collapsed); }}
            style={{ background:"transparent", border:"none", padding: 2, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              opacity: 0.6, transition:"opacity 0.15s, transform 0.2s",
              transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke={colors.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* v0.4: storyline name + descriptive summary */}
      {isV04 && story && (
        <div style={{ padding: "10px 16px 14px",
          borderTop: `1px solid ${colors.ruleSoft}`,
          borderBottom: collapsed ? "none" : `1px solid ${colors.ruleSoft}` }}>
          {/* Storyline name row */}
          <div style={{ display:"flex", alignItems:"baseline", gap: 8,
            marginBottom: 8 }}>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 13,
              color: colors.primary, fontWeight: 600, letterSpacing: 0.3 }}>
              {storyGlyph}
            </span>
            <span style={{ fontFamily:"'Fraunces', serif", fontSize: 15,
              color: colors.ink, fontWeight: 500, letterSpacing: -0.15,
              lineHeight: 1.25 }}>
              {story.label}
            </span>
          </div>
          {/* Descriptive summary — the story, not the actors */}
          {!collapsed && (
            <div style={{
              fontFamily:"'Fraunces', serif",
              fontSize: 15.5, lineHeight: 1.25,
              color: colors.ink, letterSpacing: -0.1,
              fontStyle:"italic",
            }}>
              {story.overlaySummary || head}
            </div>
          )}
        </div>
      )}

      {/* v0.3: original timeline-point understanding head */}
      {!isV04 && (
        <div style={{ padding: collapsed ? "12px 14px 12px" : "14px 14px 14px",
          fontFamily:"'Fraunces', serif", fontSize: 14, lineHeight: 1.3,
          color: colors.ink, letterSpacing: -0.1, fontStyle:"italic",
          borderTop: `1px solid ${colors.ruleSoft}`,
          borderBottom: collapsed ? "none" : `1px solid ${colors.ruleSoft}` }}>
          {head}
        </div>
      )}

      {/* v0.4: 5-storyline distribution bar + pills (click to switch overlay) */}
      {isV04 && !collapsed && setFocusStoryline && (
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 8 }}>
            Other possibilities
          </div>
          {/* Distribution bar across all 5 storylines */}
          <div style={{ display:"flex", height: 6, borderRadius: 1, overflow:"hidden",
            marginBottom: 10, background: "rgba(242, 238, 228, 0.6)" }}>
            {storyPills.map(p => {
              const active = p.id === effectiveStoryId;
              return (
                <div key={p.id}
                     onMouseDown={(e)=>{ e.stopPropagation(); }}
                     onClick={(e)=>{ e.stopPropagation(); setFocusStoryline(p.id); }}
                     style={{
                       width: `${p.coverage * 100}%`,
                       background: active ? p.color : candColorForStory(p.id),
                       opacity: active ? 1 : 0.55,
                       borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
                       cursor: "pointer",
                       transition: "opacity 0.15s",
                     }}/>
              );
            })}
          </div>

          {/* 5 pills */}
          <div style={{ display:"flex", gap: 4 }}>
            {storyPills.map(p => {
              const active = p.id === effectiveStoryId;
              return (
                <button key={p.id}
                  onMouseDown={(e)=>{ e.stopPropagation(); }}
                  onClick={(e)=>{ e.stopPropagation(); setFocusStoryline(p.id); }}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 2,
                    border: `1px solid ${active ? colors.ink : colors.rule}`,
                    background: active ? colors.paper : "transparent",
                    cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    color: active ? colors.ink : colors.inkMute,
                    fontWeight: active ? 600 : 400,
                    letterSpacing: 0.3,
                    transition: "all 0.15s",
                    display:"flex", flexDirection:"column", alignItems:"center", gap: 2,
                  }}>
                  <span>{p.glyph}</span>
                  <span style={{ fontSize: 8.5, letterSpacing: 0.4,
                    color: active ? colors.inkMute : colors.muted,
                    fontVariantNumeric: "tabular-nums" }}>
                    {Math.round(p.coverage*100)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* v0.3 distribution bar (legacy path) */}
      {!isV04 && !collapsed && rows.length > 0 && (
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display:"flex", height: 6, borderRadius: 1, overflow:"hidden",
            marginBottom: 12, background: "rgba(242, 238, 228, 0.6)" }}>
            {rows.map(r => (
              <div key={r.key}
                   onMouseEnter={()=>setHoverCand(r.key)}
                   onMouseLeave={()=>setHoverCand(null)}
                   style={{ width: `${r.weight*100}%`, background: candColor(r.flag),
                     opacity: hoverCand && hoverCand !== r.key ? 0.25 : 1,
                     borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
                     transition:"width 0.5s cubic-bezier(.2,.7,.2,1), opacity 0.2s" }}/>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
            {rows.slice(0, 4).map((r, i) => {
              const isTop = i === 0;
              return (
                <div key={r.key}
                     onMouseEnter={()=>setHoverCand(r.key)}
                     onMouseLeave={()=>setHoverCand(null)}
                     style={{ display:"grid", gridTemplateColumns: "9px 16px 1fr auto", gap: 10,
                       alignItems:"center", cursor:"default",
                       opacity: hoverCand && hoverCand !== r.key ? 0.4 : 1, transition:"opacity 0.2s" }}>
                  <div style={{ width: 7, height: 7, background: candColor(r.flag) }}/>
                  <CandIcon cand={r.flag} w={16} h={11} />
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                    color: colors.ink, fontWeight: isTop ? 500 : 400,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily:"'Fraunces', serif", fontSize: 14.5, fontStyle:"italic",
                    color: isTop ? colors.primary : colors.ink, fontVariantNumeric:"tabular-nums" }}>
                    {(r.weight*100).toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55, marginLeft: 1 }}>%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Storyline color helper — returns the canonical color for each storyline
function candColorForStory(id) {
  if (id === "alpha") return "#A03A2C";       // primary
  if (id === "epsilon") return "#4A4A4A";     // inkSoft
  if (id === "mu") return "#7A6A54";          // meta
  if (id === "beta") return "#6A6A6A";
  if (id === "delta") return "#B7B0A0";       // muted
  return "#8A8A8A";
}

// ============================================================================
// EVIDENCE DRAWER — mode-aware (v0.4 adds positions + language)
// ============================================================================

function EvidenceDrawer({ ev, onClose, onJumpTo, mode }) {
  if (!ev) return null;
  const candReadable = mode === "v04" ? CAND_READABLE_V04 : CAND_READABLE_V03;
  const isV04 = mode === "v04";

  // v0.4 enriched record (Pearl-level schema) merged with graph-layer metadata
  const enriched = isV04 ? EVIDENCE_V04_ENRICHED[ev.id] : null;
  const useV04 = !!enriched;

  // --- Legacy cluster data (v0.3 and v0.4 graph-layer clusters) ---
  const clusterLabels = {
    western_intel_leaks: "Western intelligence leaks",
    single_source: "Single-source claim",
    coverage_meta: "Coverage-meta evidence cluster",
    german_judicial: "German judicial authority",
    russian_state: "Russian state-sourced",
  };
  const clusterExplanations = {
    western_intel_leaks: "Multiple Western outlets citing anonymous officials familiar with intelligence. Likely share a common origin in a single intelligence ecosystem — Trace treats them as correlated and dampens their combined weight.",
    single_source: "An allegation resting on a single anonymous source, not corroborated by any independent reporting.",
    coverage_meta: "Not evidence about what happened — evidence about how the investigation is being managed. Feeds the μ storyline (Avoidance as a stance).",
    german_judicial: "A formal judicial ruling from Germany's highest criminal court. High authority; limited correlation with other sources.",
    russian_state: "Source is a Russian state apparatus. Event-credibility is high (the statement was made); content-credibility is bounded by strategic interest.",
  };
  const siblings = ev.cluster ? EVIDENCE_V04.filter(e => e.cluster === ev.cluster && e.id !== ev.id) : [];
  const clusterLabel = ev.cluster ? (clusterLabels[ev.cluster] || ev.cluster) : null;
  const clusterExplain = ev.cluster ? clusterExplanations[ev.cluster] : null;

  // --- v0.4 reasoning-clusters (combined inferences across evidence sets) ---
  const v04Clusters = useV04
    ? EVIDENCE_CLUSTERS_V04.filter(c => c.members.includes(ev.id))
    : [];

  // For cross-reference chips, pull the referenced record's title when available.
  // Priority: enriched E-layer → graph-layer label → F-layer spec title → id.
  const crossRefTitle = (id) => {
    const enr = EVIDENCE_V04_ENRICHED[id];
    if (enr) return enr.title;
    const raw = EVIDENCE_V04.find(e => e.id === id);
    if (raw) return raw.label;
    if (FACT_LAYER_TITLES[id]) return FACT_LAYER_TITLES[id];
    return id;
  };

  return (
    <div style={{ position:"absolute", top: 0, right: 0, bottom: 0,
      width: 500, maxWidth: "50vw", background: colors.paper,
      borderLeft: `1px solid ${colors.rule}`,
      boxShadow: "-20px 0 48px rgba(26,26,26,0.05)",
      padding: "48px 38px 56px", overflowY:"auto", zIndex: 20,
      animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)" }}>
      <button onClick={onClose}
        style={{ position:"absolute", top: 48, right: 36, background:"transparent", border:"none",
                 fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color: colors.inkMute,
                 letterSpacing: 0.8, cursor:"pointer", textTransform:"uppercase",
                 padding: "4px 6px" }}>close ×</button>

      {/* ─── Header: ID · date · language flag ─────────────────────────── */}
      <div style={{ display:"flex", alignItems:"baseline", gap: 10 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 14,
          color: colors.ink, fontWeight: 600 }}>{ev.id}</div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.5 }}>
          {useV04 ? enriched.date : ev.published}
        </div>
        {isV04 && ev.language && (
          <div style={{ marginLeft: "auto" }}><LangFlag lang={ev.language} size={10}/></div>
        )}
      </div>

      {/* ─── Attestation type tag (above title — classifies WHAT the evidence is) ─── */}
      {useV04 && ev.source_type && (
        <div style={{ marginTop: 14 }}>
          <Tag tone="default">{ev.source_type}</Tag>
        </div>
      )}

      {/* ─── Title (primary, evidence self-describes) ──────────────────── */}
      <div style={{ fontFamily:"'Fraunces', serif", fontSize: useV04 ? 22 : 24,
        lineHeight: 1.25, color: colors.ink, letterSpacing: -0.3,
        marginTop: useV04 ? 10 : 12 }}>
        {useV04 ? enriched.title : ev.label}
      </div>

      {/* ─── v0.4 path: source + source_confidence ─────────────────────── */}
      {useV04 && (
        <>
          <div style={{ marginTop: 14, fontFamily:"'Instrument Sans', sans-serif",
            fontSize: 12, color: colors.inkMute, lineHeight: 1.5 }}>
            {enriched.source}
          </div>
          <div style={{ marginTop: 10, display:"flex", gap: 6, alignItems:"center",
            flexWrap:"wrap" }}>
            {/* Source-confidence pill — matched to Tag dimensions so the row has
                a single consistent baseline. Tooltip retained because this field
                is the single most-misread concept in v0.4 (reliability-of-source
                for-type-of-claim, NOT truth probability). */}
            <span style={{
              display:"inline-flex", alignItems:"center", gap: 6,
              fontFamily:"'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: 0.8, textTransform:"uppercase",
              padding: "2px 7px", borderRadius: 2, lineHeight: 1.4,
              background: colors.paperDeep, color: colors.inkSoft,
              border: `1px solid ${colors.rule}` }}>
              <span style={{ color: colors.inkMute }}>Source conf</span>
              <span style={{ color: colors.ink, fontWeight: 600,
                fontVariantNumeric:"tabular-nums", letterSpacing: 0.4,
                textTransform:"none" }}>
                {enriched.source_confidence.toFixed(2)}
              </span>
              <InfoTooltip {...FIELD_TOOLTIPS.source_confidence} width={310} size={10}/>
            </span>
            {isV04 && ev.positions && ev.positions.length > 0 && (
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.inkMute, letterSpacing: 0.4, marginLeft: 4 }}>
                {ev.positions.slice(0,2).map(p=>p.replace(/_/g," ")).join(" · ")}
                {ev.positions.length > 2 ? ` · +${ev.positions.length-2}` : ""}
              </span>
            )}
          </div>
        </>
      )}

      {/* ─── v0.3 legacy path: credibility + source_type tags ──────────── */}
      {!useV04 && (
        <div style={{ marginTop: 18, display:"flex", gap: 6, flexWrap:"wrap" }}>
          <Tag tone="default">{ev.source_type}</Tag>
          <Tag tone="mute">credibility {ev.credibility.toFixed(2)}</Tag>
        </div>
      )}

      {!useV04 && isV04 && ev.positions && ev.positions.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.6, textTransform:"uppercase",
            marginBottom: 6 }}>
            Positions
          </div>
          <div style={{ display:"flex", gap: 5, flexWrap:"wrap" }}>
            {ev.positions.map((p,i) => (
              <span key={i} style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                color: colors.meta, letterSpacing: 0.4,
                padding:"2px 6px", borderRadius: 2,
                background: "transparent", border: `1px solid ${colors.ruleSoft}`,
              }}>{p.replace(/_/g," ")}</span>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* v0.4 PEARL-LEVEL SCHEMA SECTIONS                                */}
      {/* ============================================================== */}

      {useV04 && (
        <>
          {/* ─── 1. Original text (grounding — where inferences anchor) ─── */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
              marginBottom: 10 }}>
              Original text
            </div>
            <div style={{
              fontFamily:"'Fraunces', serif", fontSize: 14, fontStyle:"italic",
              color: colors.ink, lineHeight: 1.55,
              padding: "14px 18px",
              background: colors.paperDeep,
              borderLeft: `2px solid ${colors.meta}`,
              borderRadius: 1 }}>
              {enriched.original_text}
            </div>
          </div>

          {/* ─── 2. Reasoning contribution — VISUALIZED [LABEL] ─→ target ── */}
          {/*  Compact arrow diagram per inference. The "what pushes to what"  */}
          {/*  is the primary view. The full inference text is tucked into a   */}
          {/*  click-to-expand drawer so the default scan stays light-weight.  */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
              marginBottom: 14 }}>
              Reasoning contribution · {enriched.reasoning_contribution.length}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap: 10 }}>
              {enriched.reasoning_contribution.map((inf, i) => (
                <InferenceRow key={i} inf={inf}/>
              ))}
            </div>
          </div>

          {/* ─── 3. Evidence clusters this piece belongs to ──────────────── */}
          {v04Clusters.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom: 12 }}>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                  color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase" }}>
                  Reading paths — clusters this belongs to
                </div>
                <InfoTooltip {...FIELD_TOOLTIPS.cluster} width={310}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap: 12 }}>
                {v04Clusters.map((c) => (
                  <div key={c.id} style={{
                    padding: "14px 16px",
                    background: colors.paperDeep,
                    border: `1px solid ${colors.ruleSoft}`,
                    borderLeft: `3px solid ${colors.secondary}`,
                    borderRadius: 2 }}>
                    <div style={{ fontFamily:"'Fraunces', serif", fontSize: 15,
                      fontStyle:"italic", color: colors.ink, letterSpacing: -0.1,
                      marginBottom: 6, lineHeight: 1.3 }}>
                      {c.label}
                    </div>
                    <div style={{ display:"flex", gap: 4, flexWrap:"wrap",
                      marginBottom: 10 }}>
                      {c.members.map(m => {
                        const isSelf = m === ev.id;
                        const canJump = !isSelf && onJumpTo && EVIDENCE_V04_ENRICHED[m];
                        return (
                          <span key={m}
                            onClick={canJump ? (e)=>{ e.stopPropagation(); onJumpTo(m); } : undefined}
                            style={{
                              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                              padding:"2px 6px", borderRadius: 2,
                              background: isSelf ? colors.ink : "transparent",
                              color: isSelf ? colors.paper : colors.inkMute,
                              border: `1px solid ${isSelf ? colors.ink : colors.rule}`,
                              fontWeight: isSelf ? 600 : 400,
                              letterSpacing: 0.3,
                              cursor: canJump ? "pointer" : "default",
                              transition: "color 0.12s, background 0.12s, border-color 0.12s" }}
                            onMouseEnter={canJump ? (e)=>{
                              e.currentTarget.style.color = colors.ink;
                              e.currentTarget.style.borderColor = colors.ink;
                            } : undefined}
                            onMouseLeave={canJump ? (e)=>{
                              e.currentTarget.style.color = colors.inkMute;
                              e.currentTarget.style.borderColor = colors.rule;
                            } : undefined}>
                            {m}
                          </span>
                        );
                      })}
                    </div>
                    <div style={{ fontFamily:"'Instrument Sans', sans-serif",
                      fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.55 }}>
                      {c.combined_inference}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 4. Cross-references (penultimate · CLICKABLE for E-layer) ── */}
          {/*  E-layer IDs (E1, E29, ...) navigate to their own drawer.       */}
          {/*  F-layer IDs (F1–F13) are spec-only anchors — shown for context,*/}
          {/*  not clickable, visually subordinate.                           */}
          {enriched.cross_references && enriched.cross_references.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
                marginBottom: 10 }}>
                Cross-references · {enriched.cross_references.length}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
                {enriched.cross_references.map((xid) => {
                  const canJump = !!(onJumpTo && EVIDENCE_V04_ENRICHED[xid]);
                  const isFactLayer = !canJump && FACT_LAYER_TITLES[xid];
                  return (
                    <div key={xid}
                      onClick={canJump ? ()=>onJumpTo(xid) : undefined}
                      style={{
                        display:"grid",
                        gridTemplateColumns:"44px 1fr 14px",
                        alignItems:"center", gap: 10,
                        padding: "9px 12px",
                        background: "transparent",
                        border: `1px dashed ${isFactLayer ? colors.ruleSoft : "transparent"}`,
                        borderColor: isFactLayer ? colors.ruleSoft : colors.ruleSoft,
                        borderStyle: isFactLayer ? "dashed" : "solid",
                        borderRadius: 2,
                        cursor: canJump ? "pointer" : "default",
                        opacity: isFactLayer ? 0.82 : 1,
                        transition: "background 0.12s, border-color 0.12s" }}
                      onMouseEnter={canJump ? (e)=>{
                        e.currentTarget.style.background = colors.paperDeep;
                        e.currentTarget.style.borderColor = colors.rule;
                      } : undefined}
                      onMouseLeave={canJump ? (e)=>{
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = colors.ruleSoft;
                      } : undefined}>
                      <span style={{ fontFamily:"'JetBrains Mono', monospace",
                        fontSize: 11.5,
                        color: isFactLayer ? colors.inkMute : colors.ink,
                        fontWeight: isFactLayer ? 500 : 600,
                        letterSpacing: 0.3 }}>
                        {xid}
                      </span>
                      <span style={{ fontFamily:"'Instrument Sans', sans-serif",
                        fontSize: 12.5,
                        color: isFactLayer ? colors.inkMute : colors.inkSoft,
                        lineHeight: 1.4,
                        overflow:"hidden", textOverflow:"ellipsis",
                        display:"-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient:"vertical" }}>
                        {crossRefTitle(xid)}
                      </span>
                      {canJump ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                          style={{ opacity: 0.55 }}>
                          <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke={colors.inkMute}
                                strokeWidth="1.2" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                      ) : isFactLayer ? (
                        <span style={{ fontFamily:"'JetBrains Mono', monospace",
                          fontSize: 8.5, color: colors.inkMute, letterSpacing: 0.5,
                          textTransform:"uppercase", textAlign:"right",
                          whiteSpace:"nowrap" }}
                          title="Fact-layer spec anchor — not a UI node">
                          spec
                        </span>
                      ) : <span/>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 5. Caveats (final — the reading discipline) ────────────── */}
          <div style={{ marginTop: 28, padding: "16px 18px",
            background: "#FBF3E4",
            border: `1px solid ${colors.warn}`,
            borderLeft: `3px solid ${colors.warn}`,
            borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom: 10 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                style={{ flexShrink: 0, marginRight: 7 }}>
                <path d="M6.5 1 L12 11.5 L1 11.5 Z" fill="none"
                      stroke={colors.warnDeep} strokeWidth="1.2"
                      strokeLinejoin="round"/>
                <line x1="6.5" y1="5" x2="6.5" y2="8" stroke={colors.warnDeep}
                      strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="6.5" cy="9.6" r="0.7" fill={colors.warnDeep}/>
              </svg>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.warnDeep, letterSpacing: 0.9, textTransform:"uppercase",
                fontWeight: 600 }}>
                Caveats · what this does NOT establish
              </div>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
              color: colors.ink, lineHeight: 1.65 }}>
              {enriched.caveats}
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* v0.3 LEGACY PATH (unchanged behavior when enriched record absent) */}
      {/* ============================================================== */}

      {!useV04 && (
        <>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
            lineHeight: 1.6, color: colors.inkSoft, marginTop: 22 }}>
            {ev.detail}
          </div>

          {ev.cluster && (
            <div style={{ marginTop: 26, padding: "16px 18px",
              background: colors.paperDeep, border: `1px solid ${colors.ruleSoft}`,
              borderLeft: `3px solid ${ev.cluster === "coverage_meta" ? colors.meta : colors.warn}`,
              borderRadius: 2 }}>
              <div style={{ display:"flex", alignItems:"center", gap: 8, marginBottom: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="5.5" fill="none"
                          stroke={ev.cluster === "coverage_meta" ? colors.meta : colors.warn}
                          strokeWidth="1" strokeDasharray="2,2"/>
                </svg>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase" }}>
                  {ev.cluster === "coverage_meta" ? "Coverage-meta cluster" : "Correlated source cluster"}
                </div>
              </div>
              <div style={{ fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                color: colors.ink, marginBottom: 10, lineHeight: 1.3, letterSpacing: -0.1 }}>
                {clusterLabel}
              </div>
              <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                color: colors.inkSoft, lineHeight: 1.55,
                marginBottom: siblings.length > 0 ? 14 : 0 }}>
                {clusterExplain}
              </div>
              {siblings.length > 0 && (
                <>
                  <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                    color: colors.inkMute, letterSpacing: 0.6, textTransform:"uppercase", marginBottom: 6 }}>
                    Others in cluster ({siblings.length})
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap: 4 }}>
                    {siblings.map((s) => (
                      <div key={s.id} style={{ display:"grid", gridTemplateColumns:"32px 1fr 70px",
                        gap: 8, alignItems:"baseline", fontSize: 11.5 }}>
                        <span style={{ fontFamily:"'JetBrains Mono', monospace",
                          color: colors.inkMute, letterSpacing: 0.3 }}>{s.id}</span>
                        <span style={{ fontFamily:"'Instrument Sans', sans-serif", color: colors.ink,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.label}</span>
                        <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                          color: colors.inkMute, textAlign:"right" }}>{s.published}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ─── Edge list — graph-layer edges to candidates (both paths) ─── */}
      {ev.edges && ev.edges.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 12 }}>
            Graph edges · {ev.edges.length}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 8 }}>
            {ev.edges.map((e,i)=> {
              const polSym = e.pol > 0 ? "+" : e.pol < 0 ? "−" : "0";
              const polColor = e.pol > 0
                ? ((e.to === "C2b" || e.to === "C2") ? colors.primary
                   : e.to === "C3" ? colors.secondary
                   : e.to === "C7" ? colors.warn
                   : colors.ink)
                : (e.pol < 0 ? colors.inkMute : colors.muted);
              return (
                <div key={i} style={{ display:"grid",
                  gridTemplateColumns:"22px 60px 1fr 50px",
                  alignItems:"center", gap: 10,
                  padding:"8px 0", borderBottom:`1px solid ${colors.ruleSoft}`,
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 11 }}>
                  <span style={{ color: polColor, fontSize: 17, fontWeight: 700 }}>{polSym}</span>
                  <span style={{ color: colors.inkSoft }}>{e.to}</span>
                  <div>
                    <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                      color: colors.ink, lineHeight: 1.3 }}>
                      {candReadable[e.to] || e.to}
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
      )}
    </div>
  );
}



// ============================================================================
// MASTHEAD — carries mode toggle
// ============================================================================

function Masthead({ mode, setMode, activeEvidenceCount, currentLabel, currentDate, isFullscreen, onToggleFullscreen }) {
  const isV04 = mode === "v04";
  return (
    <div style={{ borderBottom: `1px solid ${colors.rule}`,
      background: colors.paper, padding: "18px 32px 22px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        gap: 24, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap: 18, flexWrap:"wrap" }}>
          <div style={{ fontFamily:"'Fraunces', serif", fontWeight: 600, fontSize: 22,
            letterSpacing: -0.3, color: colors.ink, lineHeight: 1 }}>Trace</div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase", lineHeight: 1 }}>
            Case file 001 · {isV04 ? "v0.4" : "v0.3"} · {isV04 ? "37" : activeEvidenceCount + "/16"}
          </div>
          {!isV04 && (
            <>
              <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                color: colors.inkSoft, letterSpacing: 0.1, lineHeight: 1, fontWeight: 500 }}>
                {currentLabel}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.inkMute, letterSpacing: 0.6, lineHeight: 1 }}>
                {currentDate}
              </div>
            </>
          )}
          {isV04 && (
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
              color: colors.inkSoft, letterSpacing: 0.1, lineHeight: 1, fontWeight: 500 }}>
              14 languages · 37 evidence items · 5 storylines
            </div>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          {/* v0.3 / v0.4 mode toggle */}
          <div style={{ display:"inline-flex", flexShrink: 0,
            border: `1px solid ${colors.rule}`, borderRadius: 2,
            background: colors.paper, padding: 1 }}>
            {[
              { key: "v03", label: "v0.3 · English only" },
              { key: "v04", label: "v0.4 · 14 languages" },
            ].map(opt => (
              <button key={opt.key} onClick={()=>setMode(opt.key)}
                style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: 0.7, textTransform:"uppercase",
                  padding: "5px 11px", borderRadius: 1, border: "none", cursor: "pointer",
                  background: mode === opt.key ? colors.ink : "transparent",
                  color: mode === opt.key ? colors.paper : colors.inkMute,
                  transition:"all 0.15s", whiteSpace:"nowrap" }}>
                {opt.label}
              </button>
            ))}
          </div>

          <button onClick={onToggleFullscreen}
            style={{ background: isFullscreen ? colors.ink : "transparent",
              color: isFullscreen ? colors.paper : colors.inkSoft,
              border: `1px solid ${isFullscreen ? colors.ink : colors.rule}`,
              padding: "6px 11px", borderRadius: 2,
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
              display:"flex", alignItems:"center", gap: 7,
              transition: "all 0.2s", flexShrink: 0, whiteSpace:"nowrap" }}>
            <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
              <path d={isFullscreen
                ? "M1 4 L1 1 L4 1 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"
                : "M4 1 L1 1 L1 4 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"}
                stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {isFullscreen ? "exit" : "fullscreen"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 18, display:"flex", alignItems:"stretch", gap: 14 }}>
        <div style={{ width: 3, background: colors.primary, flexShrink: 0 }}/>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.primary, letterSpacing: 1.4,
            textTransform:"uppercase", fontWeight: 500, marginBottom: 6 }}>
            Converging · not resolved
          </div>
          <h1 style={{ fontFamily:"'Fraunces', serif",
            fontSize: "clamp(22px, 2.4vw, 30px)",
            fontWeight: 400, fontStyle:"italic", color: colors.ink,
            letterSpacing: -0.5, lineHeight: 1.2, margin: 0,
            maxWidth: "calc(100vw - 130px)", textWrap: "balance" }}>
            Who attacked the Nord Stream pipelines on 26 September 2022?
          </h1>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE OVERLAY (v0.3 mode only)
// ============================================================================

function TimelineOverlay({ idx, setIdx, timeline }) {
  return (
    <div style={{ position:"fixed", left: 20, right: 20, bottom: 20, zIndex: 9,
      pointerEvents:"none" }}>
      <div style={{ pointerEvents:"auto", width: "100%", padding: "8px 54px 10px",
        background: "rgba(250, 248, 243, 0.88)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.8)`, borderRadius: 3,
        boxShadow: "0 12px 32px rgba(26, 26, 26, 0.06)" }}>
        <TimelineBar idx={idx} setIdx={setIdx} timeline={timeline} />
      </div>
    </div>
  );
}

// ============================================================================
// DELTA PANEL (v0.4 only) — what changed from v0.3 to v0.4
// ============================================================================

function DeltaPanel() {
  const rows = [
    { l:"Evidence items", v3:"16", v4:"37", note:"+21 new: judicial rulings (BGH, Łubowski), Trump statement, Hanning testimony, Sachs UN speech, SS-750 photos, Der Spiegel 2026, t-online, Italian Cassazione, coverage-meta" },
    { l:"Languages", v3:"1 (English)", v4:"14 (en + de + pl + ru + uk + it + da + sv + no + ar + fr + es + ja + zh)", note:"Position encoded, not hidden behind linguistic boundaries" },
    { l:"Candidates", v3:"8", v4:"11", note:"C2 → C2a (presidential) / C2b (military bypass) / C2c (agency); C7 added (Ukrainian + CIA enabling compound); actor_tier granularity R1 extension" },
    { l:"Source types", v3:"7", v4:"9", note:"+ coverage_meta_evidence, + adversarial_first_party (for Trump-style statements where event-cred ≠ content-cred)" },
    { l:"Leading candidate", v3:"C2 Ukrainian state-directed · 28.7%", v4:"C2b Ukrainian military bypass · 33.5%", note:"Lower ceiling but more specific — agency and presidential layers drew off earlier C2 weight" },
    { l:"C_insufficient", v3:"14.2%", v4:"13.6%", note:"Not collapsed by more evidence — held up by coverage-meta signals added in v0.4" },
    { l:"Aggregation output form", v3:"Distribution over candidates", v4:"Distribution + five reconstructed storylines + anchor layer + independent-voice gallery", note:"The candidate distribution is now one of several exhibit surfaces, not the terminal output" },
  ];
  return (
    <div style={{ padding: "48px 56px 40px", background: colors.paper }}>
      <Rule />
      <div style={{ marginTop: 36, marginBottom: 32 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
          What changed from v0.3 to v0.4
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
          lineHeight: 1.15, letterSpacing: -0.4, color: colors.ink, maxWidth: 900 }}>
          Fourteen-language intake did not collapse the uncertainty. It made the shape of the uncertainty legible.
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 2fr", gap: 0,
        border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
        <div style={{ padding: "10px 14px", fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9.5, color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
          background: colors.paperDeep, borderRight: `1px solid ${colors.ruleSoft}` }}>Dimension</div>
        <div style={{ padding: "10px 14px", fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9.5, color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
          background: colors.paperDeep, borderRight: `1px solid ${colors.ruleSoft}` }}>v0.3</div>
        <div style={{ padding: "10px 14px", fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9.5, color: colors.primary, letterSpacing: 0.7, textTransform:"uppercase",
          background: colors.paperDeep, borderRight: `1px solid ${colors.ruleSoft}` }}>v0.4</div>
        <div style={{ padding: "10px 14px", fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9.5, color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
          background: colors.paperDeep }}>Note</div>
        {rows.map((r,i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "14px 14px", fontFamily:"'Instrument Sans', sans-serif",
              fontSize: 13, color: colors.ink, fontWeight: 500,
              borderTop: `1px solid ${colors.ruleSoft}`, borderRight: `1px solid ${colors.ruleSoft}` }}>{r.l}</div>
            <div style={{ padding: "14px 14px", fontFamily:"'JetBrains Mono', monospace",
              fontSize: 11.5, color: colors.inkSoft, lineHeight: 1.4,
              borderTop: `1px solid ${colors.ruleSoft}`, borderRight: `1px solid ${colors.ruleSoft}` }}>{r.v3}</div>
            <div style={{ padding: "14px 14px", fontFamily:"'JetBrains Mono', monospace",
              fontSize: 11.5, color: colors.primary, lineHeight: 1.4, fontWeight: 500,
              borderTop: `1px solid ${colors.ruleSoft}`, borderRight: `1px solid ${colors.ruleSoft}` }}>{r.v4}</div>
            <div style={{ padding: "14px 14px", fontFamily:"'Instrument Sans', sans-serif",
              fontSize: 12, color: colors.inkSoft, lineHeight: 1.5,
              borderTop: `1px solid ${colors.ruleSoft}` }}>{r.note}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ANCHORS RAIL — F1–F13 as non-disputed foundation
// ============================================================================

function AnchorsRail() {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ padding: "48px 56px 40px", background: colors.paper }}>
      <Rule />
      <div style={{ marginTop: 36, display:"grid", gridTemplateColumns:"1fr 2.2fr", gap: 56 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Foundation
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.15, letterSpacing: -0.4, color: colors.ink }}>
            Thirteen facts every storyline must accommodate.
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
            color: colors.inkMute, marginTop: 18, lineHeight: 1.5 }}>
            These are the anchors. They are not disputed in any of the fourteen languages we surveyed.
            Any reconstruction that cannot hold them is wrong, no matter whose narrative it flatters.
            <br/><br/>
            Three of them — marked — do independent structural work against specific storylines.
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap: 0,
          border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
          {ANCHORS.map((a, i) => {
            const col = i % 2;
            const isFlagged = a.flagged;
            const isHover = hovered === a.id;
            return (
              <div key={a.id}
                onMouseEnter={()=>setHovered(a.id)}
                onMouseLeave={()=>setHovered(null)}
                style={{
                  padding: "16px 18px",
                  borderTop: i >= 2 ? `1px solid ${colors.ruleSoft}` : "none",
                  borderRight: col === 0 ? `1px solid ${colors.ruleSoft}` : "none",
                  background: isHover ? colors.paperDeep : (isFlagged ? "#FAF4E6" : colors.paper),
                  transition:"background 0.15s",
                  cursor:"default",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom: 8 }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                    color: isFlagged ? colors.warnDeep : colors.inkSoft,
                    fontWeight: 600, letterSpacing: 0.4 }}>{a.id}</span>
                  {isFlagged && (
                    <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
                      color: colors.warnDeep, letterSpacing: 0.9, textTransform:"uppercase" }}>
                      ◆ structural
                    </span>
                  )}
                </div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  color: colors.inkMute, letterSpacing: 0.3, marginBottom: 6 }}>{a.time}</div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  color: colors.ink, lineHeight: 1.5 }}>{a.fact}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STORYLINE CARD — used inside the reconstructions section
// ============================================================================

function StorylineCard({ story, isOpen, onToggle, onFocus, focusStoryline }) {
  const isAlpha = story.id === "alpha";
  const isMu = story.id === "mu";
  const isDelta = story.id === "delta";
  const isEpsilon = story.id === "epsilon";
  const isBeta = story.id === "beta";

  const isThisFocused = focusStoryline === story.id;
  const someoneElseFocused = focusStoryline != null && !isThisFocused;

  const accentColor = isAlpha ? colors.primary
                   : isMu ? colors.meta
                   : isBeta ? colors.inkSoft
                   : isDelta ? colors.muted
                   : colors.inkMute;

  return (
    <div style={{
      border: `1px solid ${isAlpha ? colors.primary : colors.ruleSoft}`,
      borderRadius: 2,
      background: colors.paper,
      opacity: someoneElseFocused ? 0.45 : 1,
      transition:"opacity 0.3s, border-color 0.2s",
    }}>
      {/* Header */}
      <div onClick={onToggle}
        style={{ padding: isAlpha ? "22px 30px 22px" : "20px 26px 20px",
          cursor:"pointer", display:"grid",
          gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems:"center" }}>
        {/* Coverage % — the number the reader cares about, leading the row */}
        <div style={{ display:"flex", alignItems:"baseline", gap: 10,
          minWidth: isAlpha ? 100 : 82 }}>
          <div style={{ fontFamily:"'Fraunces', serif",
            fontSize: isAlpha ? 44 : 32, fontStyle:"italic",
            color: accentColor, fontVariantNumeric:"tabular-nums",
            lineHeight: 0.95, fontWeight: 400 }}>
            {(story.coverage * 100).toFixed(0)}<span style={{ fontSize: isAlpha ? 20 : 15, opacity: 0.55, marginLeft: 1 }}>%</span>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace",
            fontSize: isAlpha ? 14 : 12, color: accentColor, fontWeight: 600,
            letterSpacing: 0.5, lineHeight: 1 }}>
            {story.id === "alpha" ? "α" : story.id === "beta" ? "β" : story.id === "delta" ? "δ" : story.id === "epsilon" ? "ε" : "μ"}
          </div>
        </div>

        {/* Storyline label */}
        <div style={{ fontFamily:"'Fraunces', serif",
          fontSize: isAlpha ? 22 : 17, fontWeight: 400,
          color: colors.ink, lineHeight: 1.25, letterSpacing: -0.25 }}>
          {story.label}
        </div>

        {/* Focus button */}
        <button onClick={(e)=>{ e.stopPropagation(); onFocus(story.id); }}
          style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: isThisFocused ? colors.paper : colors.inkMute,
            background: isThisFocused ? colors.ink : "transparent",
            border: `1px solid ${isThisFocused ? colors.ink : colors.rule}`,
            padding: "6px 10px", borderRadius: 2, cursor:"pointer",
            letterSpacing: 0.8, textTransform:"uppercase",
            whiteSpace:"nowrap", transition:"all 0.15s" }}>
          {isThisFocused ? "clear focus" : "focus on graph"}
        </button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${colors.ruleSoft}`,
          padding: "26px 30px 30px", background: isAlpha ? colors.paper : colors.paperDeep }}>
          {isMu ? <MuExpansion story={story} /> : <GenericExpansion story={story} />}
        </div>
      )}
    </div>
  );
}

function NarrativeBlock({ narrative, timeline, isHero }) {
  if (!narrative && !timeline) return null;

  return (
    <div style={{ marginBottom: 32,
      padding: isHero ? "26px 30px 28px" : "22px 26px 24px",
      background: colors.paper,
      border: `1px solid ${colors.ruleSoft}`,
      borderLeft: `3px solid ${colors.ink}`,
      borderRadius: 2 }}>
      <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
        color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
        marginBottom: timeline ? 22 : 14 }}>
        What happened — if this storyline is true
      </div>

      {timeline ? (
        <NarrativeTimeline nodes={timeline} />
      ) : (
        <div style={{
          fontFamily:"'Fraunces', serif",
          fontSize: isHero ? 16.5 : 15.5,
          lineHeight: 1.65,
          color: colors.ink,
          letterSpacing: -0.1,
          fontWeight: 400,
        }}>
          {narrative}
        </div>
      )}
    </div>
  );
}

function NarrativeTimeline({ nodes }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      {/* Vertical rule running the full height */}
      <div style={{
        position: "absolute",
        left: 5, top: 6, bottom: 6,
        width: 1,
        background: colors.rule,
      }} />

      {nodes.map((n, i) => {
        const tp = n.turningPoint;
        const isTP = !!tp;
        const deltaNum = tp ? parseFloat(tp.delta) : 0;
        const deltaNeg = deltaNum < 0;
        return (
          <div key={i} style={{
            position: "relative",
            paddingBottom: i === nodes.length - 1 ? 0 : 22,
          }}>
            {/* Node marker — diamond for turning points, circle otherwise */}
            {isTP ? (
              <div style={{
                position: "absolute",
                left: -28 + 1,
                top: 5,
                width: 9, height: 9,
                background: colors.warn,
                transform: "rotate(45deg)",
                boxSizing: "border-box",
                boxShadow: `0 0 0 2px ${colors.paper}`,
              }} />
            ) : (
              <div style={{
                position: "absolute",
                left: -28 + 2,
                top: 4,
                width: 8, height: 8,
                borderRadius: "50%",
                background: colors.paper,
                border: `1.5px solid ${colors.ink}`,
                boxSizing: "border-box",
              }} />
            )}

            {/* Date */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: isTP ? colors.warn : colors.inkMute,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 3,
              fontWeight: isTP ? 600 : 400,
            }}>
              {n.date}
            </div>

            {/* Label */}
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 16,
              fontWeight: isTP ? 600 : 500,
              color: colors.ink,
              letterSpacing: -0.15,
              lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {n.label}
            </div>

            {/* Body */}
            <div style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 13,
              lineHeight: 1.55,
              color: colors.inkSoft,
              marginBottom: isTP ? 10 : 0,
            }}>
              {n.body}
            </div>

            {/* Turning-point reason block — appears below body */}
            {isTP && (
              <div style={{
                padding: "9px 12px",
                background: "rgba(184, 144, 46, 0.08)",
                borderLeft: `2px solid ${colors.warn}`,
                borderRadius: 1,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 5,
                }}>
                  <div style={{
                    width: 6, height: 6,
                    background: colors.warn,
                    transform: "rotate(45deg)",
                    flexShrink: 0,
                  }} />
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: colors.warn,
                    letterSpacing: 0.9,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}>
                    Turning point
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 13.5, fontStyle: "italic",
                    color: deltaNeg ? colors.inkMute : colors.warn,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 500,
                  }}>
                    Δ {tp.delta} <span style={{ fontSize: 10, opacity: 0.7 }}>pts</span>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 13.5, fontStyle: "italic",
                  color: colors.ink, lineHeight: 1.35,
                  letterSpacing: -0.05,
                }}>
                  {tp.reason}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GenericExpansion({ story }) {
  return (
    <div>
      <NarrativeBlock narrative={story.narrative} timeline={story.narrativeTimeline} isHero={story.isHero} />
      {story.accommodates && story.accommodates.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 10 }}>
            Accommodates ({story.accommodates.length}/13 anchors)
          </div>
          <div style={{ display:"flex", gap: 4, flexWrap:"wrap" }}>
            {ANCHORS.map(a => {
              const held = story.accommodates.includes(a.id);
              return (
                <span key={a.id} title={a.fact}
                  style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    padding:"3px 7px", borderRadius: 1,
                    background: held ? colors.paper : "transparent",
                    color: held ? colors.ink : colors.muted,
                    border: `1px solid ${held ? colors.rule : colors.ruleSoft}`,
                    opacity: held ? 1 : 0.4,
                    cursor:"help",
                    letterSpacing: 0.3, fontWeight: held ? 500 : 400 }}>
                  {a.id}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {story.supportingEv.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 10 }}>
            Supporting evidence ({story.supportingEv.length})
          </div>
          <div style={{ display:"flex", gap: 5, flexWrap:"wrap" }}>
            {story.supportingEv.map(eid => {
              const ev = EVIDENCE_V04.find(e => e.id === eid);
              return (
                <span key={eid} title={ev ? ev.label : eid}
                  style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    padding:"3px 7px", borderRadius: 1,
                    background: colors.paper, color: colors.ink,
                    border: `1px solid ${colors.rule}`,
                    cursor:"help", letterSpacing: 0.3 }}>
                  {eid}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {story.challengedBy.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.primary, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 10 }}>
            Directly challenged by
          </div>
          <div style={{ display:"flex", gap: 5, flexWrap:"wrap" }}>
            {story.challengedBy.map(eid => {
              const a = ANCHORS.find(x => x.id === eid);
              const ev = EVIDENCE_V04.find(e => e.id === eid);
              const item = a || ev;
              return (
                <span key={eid} title={item ? (item.fact || item.label) : eid}
                  style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                    padding:"3px 7px", borderRadius: 1,
                    background: "transparent", color: colors.primary,
                    border: `1px solid ${colors.primarySoft}`,
                    cursor:"help", letterSpacing: 0.3 }}>
                  {eid}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {story.unexplained && (
        <div style={{ padding: "14px 16px",
          background: colors.paper, borderLeft: `3px solid ${colors.warn}`,
          borderRadius: 2, marginBottom: story.internalVariant ? 22 : 0 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.warnDeep, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 8 }}>
            Unexplained / leverage point
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            color: colors.ink, lineHeight: 1.55 }}>
            {story.unexplained}
          </div>
        </div>
      )}

      {story.internalVariant && (
        <div style={{ padding: "14px 16px",
          background: colors.paper, borderLeft: `3px solid ${colors.secondary}`,
          borderRadius: 2, marginBottom: 22 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.secondary, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 8 }}>
            Internal variant
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 15, fontStyle:"italic",
            color: colors.ink, marginBottom: 6, lineHeight: 1.3 }}>
            {story.internalVariant.label}
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            color: colors.inkSoft, lineHeight: 1.55 }}>
            {story.internalVariant.description}
          </div>
        </div>
      )}

      {story.sourceFromCandidates && (
        <div style={{ marginTop: 16, paddingTop: 14,
          borderTop: `1px solid ${colors.ruleSoft}`,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.4, lineHeight: 1.5 }}>
          <strong style={{ color: colors.inkSoft, fontWeight: 600 }}>weight composed from:</strong> {story.sourceFromCandidates}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// μ STORYLINE EXPANSION — three sub-regions
// ============================================================================

function MuExpansion({ story }) {
  return (
    <div>
      {/* Narrative block replaces the previous short framing */}
      <NarrativeBlock narrative={story.narrative} timeline={story.narrativeTimeline} isHero={false} />

      {/* Sub-region A: avoidance grid */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.meta, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 14 }}>
          A · Jurisdictional avoidance
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 0,
          border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
          {AVOIDANCE_GRID.map((g, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <div key={g.id}
                style={{
                  padding: "18px 18px 20px",
                  background: g.counterSignal ? "rgba(210,210,210,0.22)" : colors.paper,
                  borderTop: row > 0 ? `1px solid ${colors.ruleSoft}` : "none",
                  borderRight: col < 2 ? `1px solid ${colors.ruleSoft}` : "none",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"baseline", marginBottom: 6 }}>
                  <div style={{ fontFamily:"'Fraunces', serif", fontSize: 18, fontWeight: 500,
                    color: colors.ink, letterSpacing: -0.2 }}>
                    {g.place}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                    color: g.counterSignal ? colors.secondary : colors.meta,
                    letterSpacing: 0.5, textTransform:"uppercase" }}>
                    {g.counterSignal ? "counter-signal" : g.mixed ? "mixed" : "avoidance"}
                  </div>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                  color: colors.inkMute, letterSpacing: 0.3, marginBottom: 4 }}>{g.actor}</div>
                <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                  fontSize: 15, color: colors.ink, marginBottom: 10,
                  letterSpacing: -0.15, lineHeight: 1.3 }}>
                  {g.form}
                </div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                  color: colors.inkSoft, lineHeight: 1.55, marginBottom: 12 }}>
                  {g.detail}
                </div>
                {/* intensity bar */}
                <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
                  <div style={{ flex: 1, height: 3, background: colors.ruleSoft,
                    borderRadius: 1, overflow:"hidden" }}>
                    <div style={{
                      width: `${g.intensity*100}%`, height: "100%",
                      background: g.counterSignal ? colors.secondary : colors.meta,
                      transition:"width 0.5s",
                    }}/>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono', monospace",
                    fontSize: 9.5, color: colors.inkMute,
                    fontVariantNumeric:"tabular-nums", minWidth: 30, textAlign:"right" }}>
                    {(g.intensity*100).toFixed(0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, fontFamily:"'Instrument Sans', sans-serif",
          fontSize: 12.5, color: colors.inkMute, lineHeight: 1.6, fontStyle:"italic" }}>
          The Germany row is split: judicial layer actively prosecutes, government layer suppresses. This internal contradiction is the single most honest piece of μ's evidence — and μ's own unresolved question.
        </div>
      </div>

      {/* Sub-region B: independent voices */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.meta, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 14 }}>
          B · Voices in the silences
        </div>
        <VoicesGallery />
      </div>

      {/* Sub-region C: framing conclusion */}
      <div style={{ padding: "24px 26px", background: colors.paper,
        border: `1px solid ${colors.ruleSoft}`,
        borderLeft: `3px solid ${colors.meta}`, borderRadius: 2 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.meta, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 10 }}>
          C · Reading A and B together
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
          fontSize: 17, lineHeight: 1.5, color: colors.ink, letterSpacing: -0.15 }}>
          Five jurisdictions plus one international body decline to advance. Nine named observers — ex-intelligence chief, senior prosecutor, legal scholar, UN-forum academic, domestic editorialists — speak into the space left by that decline. The pattern is not silence. The pattern is <em>selective amplification</em>: the official channels stay quiet; the independent voices name the silence for what it is. μ is not about uncertainty. μ is about a political geometry in which non-resolution is cheaper than resolution, for every actor with the capacity to resolve.
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VOICES GALLERY
// ============================================================================

function VoicesGallery() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const voice = INDEPENDENT_VOICES[selectedIdx];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap: 28,
      alignItems:"stretch" }}>
      {/* Voice list */}
      <div style={{ display:"flex", flexDirection:"column",
        gap: 2, border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
        {INDEPENDENT_VOICES.map((v, i) => {
          const isSel = i === selectedIdx;
          const isReverse = v.weight === "reverse";
          return (
            <div key={v.id} onClick={()=>setSelectedIdx(i)}
              style={{ padding: "9px 12px",
                cursor:"pointer",
                background: isSel ? (isReverse ? "rgba(120,120,120,0.2)" : colors.paperDeep) : colors.paper,
                borderLeft: `3px solid ${isSel ? (isReverse ? colors.inkMute : colors.meta) : "transparent"}`,
                transition:"all 0.15s" }}>
              <div style={{ fontFamily:"'Fraunces', serif", fontSize: 13,
                fontWeight: isSel ? 500 : 400,
                color: colors.ink, letterSpacing: -0.1, lineHeight: 1.25 }}>
                {v.speaker}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: isReverse ? colors.inkMute : colors.meta,
                letterSpacing: 0.3, marginTop: 3, textTransform:"uppercase" }}>
                {v.language} {isReverse && "· reverse"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected quote display */}
      <div style={{ padding: "26px 30px 28px", background: colors.paper,
        border: `1px solid ${colors.ruleSoft}`, borderRadius: 2,
        borderLeft: `3px solid ${voice.weight === "reverse" ? colors.inkMute : colors.meta}` }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
          marginBottom: 12, display:"flex", gap: 12, flexWrap:"wrap" }}>
          <span>{voice.date}</span>
          <span style={{ color: colors.rule }}>·</span>
          <span>{voice.language}</span>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 22, fontWeight: 500,
          color: colors.ink, letterSpacing: -0.3, marginBottom: 4, lineHeight: 1.2 }}>
          {voice.speaker}
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
          color: colors.inkSoft, marginBottom: 22, lineHeight: 1.5 }}>
          {voice.role} — {voice.contextRole}
        </div>

        <div style={{ padding: "18px 22px", background: colors.paperDeep,
          borderRadius: 2, marginBottom: 18,
          borderLeft: `2px solid ${colors.ink}` }}>
          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
            fontSize: voice.translation ? 16 : 20, color: colors.ink,
            lineHeight: 1.5, letterSpacing: -0.15 }}>
            "{voice.quote}"
          </div>
          {voice.translation && (
            <div style={{ fontFamily:"'Fraunces', serif",
              fontSize: 19, color: colors.ink, marginTop: 10,
              lineHeight: 1.4, letterSpacing: -0.2, fontWeight: 400 }}>
              "{voice.translation}"
            </div>
          )}
        </div>

        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: voice.weight === "reverse" ? colors.inkMute : colors.meta,
          letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 10 }}>
          Why this matters
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
          color: colors.inkSoft, lineHeight: 1.65 }}>
          {voice.gloss}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SURVIVING CAUSAL CHAIN — horizontal narrative of what the evidence has NOT
// ruled out, with audit traces and branches for positions not fully excluded.
//
// Reading contract:
//   • The dark main track is α — the only chain that survives every
//     aggregation step (L2 exclusion, L3 counterfactual, L3 integration).
//     It is shown as narrative events, so the reader gets a story, not an
//     abstract causal skeleton.
//   • Branches (γ / β / ε) hang off the main track as secondary annotations.
//     They are not full storylines on screen — they are reading-variants the
//     evidence does not close off: "if this one piece changes, this node
//     flips."
//   • Each node can carry audit glyphs: ⊘ (L2 rules_out), ⇌ (L3 reconciles),
//     ✗ (L3 breaks), with the specific evidence that made the node's value
//     stick. Glyph form, not color — the reader doesn't learn a color code.
//   • μ sits as an outer frame: the chain runs inside a managed epistemic
//     environment, not in a neutral one.
//   • δ appears as a footer annotation with strike styling — it is not a
//     branch because §2.5.4 gates it to zero; but it is shown so readers see
//     the exclusion happened, not that we forgot it.
// ============================================================================

function SurvivingCausalChain() {
  // Pull α's timeline and turning points; build per-node audit + branch metadata.
  const alpha = STORYLINES.find(s => s.id === "alpha");
  const nodes = alpha?.narrativeTimeline || [];

  // Per-node overlays, keyed by node index.
  //   audits: [{ kind, evidence, gloss }]
  //     kind ∈ "rules_out" | "reconciles" | "breaks"
  //   branch: { id, label, gloss } — a reading-variant attached at this node
  const overlays = {
    0: { // Biden's public pledge (Feb 7, 2022)
      branch: { id:"beta", label:"β reading", gloss:"US-execution narrative (Hersh). Macro motive survives this node. Specific execution mechanism falsified downstream at the Sep-26 rupture node." },
    },
    3: { // CIA informed in Kyiv
      audits: [
        { kind:"reconciles", evidence:["E5","E29"], gloss:"CIA foreknowledge + public surprise coexist under \"knew but did not stop\"" },
      ],
      branch: { id:"gamma", label:"γ reading (within α)", gloss:"CIA as material enabler, not informed bystander. Conditional: confirmation of E30 (HMX non-Ukrainian, CIA-trained operative) would flip this node from α to γ." },
    },
    5: { // Zelensky withdraws, Zaluzhnyi continues
      audits: [
        { kind:"reconciles", evidence:["E11","E31"], gloss:"Presidential denial + state involvement become simultaneously true under temporal split" },
      ],
    },
    8: { // Two-wave rupture (17h gap, one surviving strand)
      audits: [
        { kind:"breaks", evidence:["F3","F12"], gloss:"17-hour gap falsifies sonar-triggered single-shot; one surviving strand falsifies state-military profile" },
      ],
    },
    9: { // Deniability machinery engages
      audits: [
        { kind:"rules_out", evidence:["F7","F8","E30"], gloss:"Andromeda forensics + non-Ukrainian HMX exclude the Ukrainian-domestic supply storyline class" },
      ],
    },
    11: { // BGH ruling (end node)
      audits: [
        { kind:"rules_out", evidence:["E17"], gloss:"Nord Stream ruled not a legitimate military target — eliminates 'justified act of war' framing" },
      ],
    },
  };

  // ε appears as the last-position placeholder beyond the final real node.
  // It is not keyed to a node — it is a declared blind-space tail.

  // --- Glyph set for audit trace kinds. Shape-based, not color-based. ---
  const AUDIT_META = {
    rules_out:  { glyph:"⊘", name:"rules out class",  pearl:"L2" },
    reconciles: { glyph:"⇌", name:"reconciles",       pearl:"L3" },
    breaks:     { glyph:"✗", name:"breaks story",     pearl:"L3" },
  };

  return (
    <div style={{ padding: "56px 56px 40px", background: colors.paper }}>
      <Rule/>

      {/* ─── Section header ────────────────────────────────────────────── */}
      <div style={{ marginTop: 44, marginBottom: 28, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 72, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 14 }}>
            Surviving causal chain
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: -0.4, color: colors.ink }}>
            After every piece has spoken — this is the story that still holds together.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15.5,
          color: colors.inkSoft, lineHeight: 1.55, maxWidth: 580 }}>
          The dark track below is α — the only causal sequence left standing after L2 structural exclusion, L3 counterfactual checks, and L3 structural integration. Branches hang off where the evidence has not fully closed a reading off. Audit glyphs show what pinned each node. Read it as a story — every node is both a moment in the narrative and a gate the evidence opened or closed.
        </div>
      </div>

      {/* ─── μ environment frame: outer wrapper with meta label ─────────── */}
      <div style={{ position:"relative",
        padding: "36px 32px 32px",
        background: "rgba(122, 106, 84, 0.04)",
        border: `1px dashed ${colors.meta}`,
        borderRadius: 3 }}>

        {/* μ frame label — sits on the top border */}
        <div style={{
          position:"absolute", top: -11, left: 26,
          padding: "2px 10px",
          background: colors.paper,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.meta, letterSpacing: 0.8, textTransform:"uppercase",
          fontWeight: 600 }}>
          μ · managed epistemic environment
        </div>

        {/* ─── Horizontal scroll container for the chain ───────────────── */}
        <div style={{
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 16,
          WebkitOverflowScrolling:"touch",
        }}>
          <div style={{
            position:"relative",
            minWidth: nodes.length * 220 + 260,
            paddingTop: 110,
            paddingBottom: 180,
          }}>
            {/* Horizontal spine — thick line running through all main-track nodes */}
            <div style={{
              position:"absolute",
              top: 110 + 7,
              left: 20,
              right: 160,
              height: 2,
              background: colors.ink,
            }} />

            {/* Dotted extension toward ε placeholder */}
            <div style={{
              position:"absolute",
              top: 110 + 7,
              left: `calc(${nodes.length * 220 + 20}px)`,
              width: 120,
              height: 2,
              backgroundImage: `linear-gradient(to right, ${colors.inkMute} 40%, transparent 40%)`,
              backgroundSize: "8px 2px",
              backgroundRepeat: "repeat-x",
            }} />

            {/* Node columns */}
            {nodes.map((n, i) => {
              const tp = n.turningPoint;
              const isTP = !!tp;
              const ov = overlays[i] || {};
              const audits = ov.audits || [];
              const branch = ov.branch;
              const x = 20 + i * 220;

              return (
                <div key={i} style={{
                  position:"absolute",
                  left: x,
                  top: 0,
                  width: 200,
                }}>
                  {/* ——— BRANCH annotation (above the spine) ——— */}
                  {branch && (
                    <div style={{
                      position:"absolute",
                      top: 0,
                      left: 12,
                      width: 184,
                      height: 94,
                    }}>
                      {/* Branch box */}
                      <div style={{
                        padding: "7px 10px 8px",
                        background: "rgba(184, 144, 46, 0.06)",
                        border: `1px dashed ${colors.warn}`,
                        borderRadius: 2,
                      }}>
                        <div style={{
                          fontFamily:"'JetBrains Mono', monospace",
                          fontSize: 9, color: colors.warnDeep,
                          letterSpacing: 0.8, textTransform:"uppercase",
                          fontWeight: 600, marginBottom: 3 }}>
                          {branch.label}
                        </div>
                        <div style={{
                          fontFamily:"'Instrument Sans', sans-serif",
                          fontSize: 10.5, color: colors.inkSoft,
                          lineHeight: 1.4 }}>
                          {branch.gloss}
                        </div>
                      </div>
                      {/* Dashed leader down to spine */}
                      <svg width="2" height="24" style={{
                        position:"absolute", left: 14, top: "100%",
                        overflow:"visible" }}>
                        <line x1="1" y1="0" x2="1" y2="24"
                          stroke={colors.warn} strokeWidth="1"
                          strokeDasharray="2 3" />
                      </svg>
                    </div>
                  )}

                  {/* ——— Node marker on the spine ——— */}
                  <div style={{
                    position:"absolute",
                    top: 110,
                    left: 10,
                  }}>
                    {isTP ? (
                      <div style={{
                        width: 14, height: 14,
                        background: colors.warn,
                        transform: "rotate(45deg)",
                        boxShadow: `0 0 0 3px ${colors.paper}`,
                      }}/>
                    ) : (
                      <div style={{
                        width: 14, height: 14,
                        borderRadius:"50%",
                        background: colors.paper,
                        border: `2px solid ${colors.ink}`,
                        boxShadow: `0 0 0 2px ${colors.paper}`,
                      }}/>
                    )}
                  </div>

                  {/* ——— Node card (below the spine) ——— */}
                  <div style={{
                    position:"absolute",
                    top: 140,
                    left: 0,
                    width: 200,
                    padding: "10px 12px 12px",
                  }}>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      color: isTP ? colors.warnDeep : colors.inkMute,
                      letterSpacing: 0.5, textTransform:"uppercase",
                      fontWeight: isTP ? 600 : 400,
                      marginBottom: 5 }}>
                      {n.date}
                    </div>
                    <div style={{
                      fontFamily:"'Fraunces', serif",
                      fontSize: 14,
                      fontWeight: isTP ? 600 : 500,
                      color: colors.ink,
                      lineHeight: 1.3,
                      letterSpacing: -0.1,
                      marginBottom: 6 }}>
                      {n.label}
                    </div>
                    <div style={{
                      fontFamily:"'Instrument Sans', sans-serif",
                      fontSize: 11, color: colors.inkSoft,
                      lineHeight: 1.5,
                      marginBottom: audits.length > 0 ? 10 : 0 }}>
                      {n.body}
                    </div>

                    {/* Audit glyphs */}
                    {audits.map((a, ai) => {
                      const meta = AUDIT_META[a.kind] || {};
                      return (
                        <div key={ai} style={{
                          marginTop: 8,
                          padding: "6px 8px",
                          background: colors.paperDeep,
                          borderLeft: `2px solid ${colors.ink}`,
                          borderRadius: 1,
                        }}>
                          <div style={{ display:"flex", alignItems:"baseline",
                            gap: 6, marginBottom: 3 }}>
                            <span style={{
                              fontFamily:"'Fraunces', serif", fontSize: 14,
                              color: colors.ink, lineHeight: 1 }}>
                              {meta.glyph}
                            </span>
                            <span style={{
                              fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
                              color: colors.inkMute, letterSpacing: 0.6,
                              textTransform:"uppercase" }}>
                              {meta.name} · Pearl {meta.pearl}
                            </span>
                          </div>
                          <div style={{
                            display:"flex", flexWrap:"wrap", gap: 3,
                            marginBottom: 4 }}>
                            {a.evidence.map(eid => (
                              <span key={eid} style={{
                                fontFamily:"'JetBrains Mono', monospace",
                                fontSize: 9, color: colors.ink, fontWeight: 600,
                                padding:"1px 5px",
                                background: colors.paper,
                                border: `0.5px solid ${colors.rule}`,
                                borderRadius: 2 }}>
                                {eid}
                              </span>
                            ))}
                          </div>
                          <div style={{
                            fontFamily:"'Instrument Sans', sans-serif",
                            fontSize: 10.5, color: colors.inkSoft,
                            lineHeight: 1.4 }}>
                            {a.gloss}
                          </div>
                        </div>
                      );
                    })}

                    {/* Turning-point reason block (if present) */}
                    {isTP && (
                      <div style={{
                        marginTop: 8,
                        padding: "7px 9px",
                        background: "rgba(184, 144, 46, 0.08)",
                        borderLeft: `2px solid ${colors.warn}`,
                        borderRadius: 1 }}>
                        <div style={{
                          display:"flex", alignItems:"center", gap: 5,
                          marginBottom: 3 }}>
                          <div style={{
                            width: 5, height: 5,
                            background: colors.warn,
                            transform: "rotate(45deg)" }}/>
                          <div style={{
                            fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
                            color: colors.warnDeep, letterSpacing: 0.7,
                            textTransform:"uppercase", fontWeight: 600 }}>
                            Turning point
                          </div>
                          <div style={{
                            marginLeft:"auto",
                            fontFamily:"'Fraunces', serif", fontSize: 11,
                            fontStyle:"italic", color: colors.warn,
                            fontVariantNumeric:"tabular-nums", fontWeight: 500 }}>
                            Δ {tp.delta}
                          </div>
                        </div>
                        <div style={{
                          fontFamily:"'Instrument Sans', sans-serif",
                          fontSize: 10.5, color: colors.ink,
                          lineHeight: 1.4, fontStyle:"italic" }}>
                          {tp.reason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ——— ε placeholder — dotted terminal column ——— */}
            <div style={{
              position:"absolute",
              left: 20 + nodes.length * 220 + 120,
              top: 0, width: 180 }}>
              {/* Hollow placeholder node on the spine */}
              <div style={{
                position:"absolute",
                top: 110,
                left: 10,
                width: 14, height: 14,
                borderRadius:"50%",
                background: colors.paper,
                border: `2px dashed ${colors.inkMute}`,
                boxShadow: `0 0 0 2px ${colors.paper}`,
              }}/>
              <div style={{
                position:"absolute", top: 140, left: 0, width: 180,
                padding: "10px 12px 12px",
              }}>
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  color: colors.inkMute, letterSpacing: 0.5,
                  textTransform:"uppercase", marginBottom: 5 }}>
                  ε · reserved
                </div>
                <div style={{
                  fontFamily:"'Fraunces', serif", fontSize: 14, fontWeight: 500,
                  fontStyle:"italic", color: colors.inkSoft,
                  lineHeight: 1.3, letterSpacing: -0.1, marginBottom: 6 }}>
                  Nodes not yet on the board
                </div>
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                  color: colors.inkMute, lineHeight: 1.5 }}>
                  Probability mass held for actors or structures the current candidate set cannot absorb. A declared blind spot — not a hidden answer.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── μ gloss inside the frame ──────────────────────────────── */}
        <div style={{
          marginTop: 12, paddingTop: 14,
          borderTop: `1px dashed ${colors.ruleSoft}`,
          fontFamily:"'Instrument Sans', sans-serif", fontSize: 11.5,
          color: colors.meta, lineHeight: 1.55, fontStyle:"italic" }}>
          μ — the chain above sits inside an adversarially-managed information environment. Seven independent suppression events (E32–E37, F13) cover parliamentary inquiries, judicial non-cooperation, domestic expert silencing, and blocked international investigation. Reading α without this frame overstates how much of the story reached the open record on its own.
        </div>
      </div>

      {/* ─── δ footer — structurally excluded, retained as audit note ──── */}
      <div style={{
        marginTop: 24,
        padding: "14px 18px",
        background: colors.paperDeep,
        border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2,
        display:"flex", alignItems:"flex-start", gap: 14 }}>
        <div style={{
          fontFamily:"'Fraunces', serif", fontSize: 28, fontStyle:"italic",
          color: colors.muted, lineHeight: 1,
          textDecoration:"line-through",
          textDecorationColor: colors.warn,
          textDecorationThickness: "2px",
          flexShrink: 0, marginTop: 2 }}>
          δ
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.warnDeep, letterSpacing: 0.8,
            textTransform:"uppercase", fontWeight: 600, marginBottom: 5 }}>
            Structurally excluded · Russian self-sabotage
          </div>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
            color: colors.inkSoft, lineHeight: 1.6, marginBottom: 8 }}>
            Gated to zero at Step 1 of §2.5.4 aggregation. Three independent L2 <code style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11, color: colors.ink }}>rules_out_a_class</code> edges make the Russian-self-op sub-structure incompatible with the forensic record. Retained here so the reader sees the exclusion happened, not that it was forgotten.
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap: 5 }}>
            {[
              { id:"F7",  gloss:"Andromeda forensic chain" },
              { id:"F2",  gloss:"HMX material identification" },
              { id:"E30", gloss:"Explosives non-Ukrainian" },
              { id:"E39", gloss:"Ukrainian internal position split" },
            ].map(e => (
              <span key={e.id} style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                padding:"2px 7px",
                color: colors.ink,
                background: colors.paper,
                border: `0.5px solid ${colors.rule}`,
                borderRadius: 2,
                letterSpacing: 0.3 }}
                title={e.gloss}>
                ⊘ {e.id}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Legend: glyph decoder ─────────────────────────────────────── */}
      <div style={{
        marginTop: 20, paddingTop: 18,
        borderTop: `1px solid ${colors.ruleSoft}`,
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 18 }}>
        {[
          { glyph:"⊘", label:"Rules out a class",   gloss:"L2 · this evidence eliminates a whole family of narratives at the mechanism layer" },
          { glyph:"⇌", label:"Reconciles conflicts", gloss:"L3 · provides a causal model under which apparently-contradictory evidence can coexist" },
          { glyph:"✗", label:"Breaks a story",       gloss:"L3 · counterfactual check falsifies a specific narrative's structure" },
          { glyph:"◇", label:"Turning point",         gloss:"node at which α's coherence shifted measurably — with Δ points recorded" },
        ].map((it, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"flex-start", gap: 8 }}>
            <div style={{
              fontFamily:"'Fraunces', serif", fontSize: 15, color: colors.ink,
              lineHeight: 1, flexShrink: 0, marginTop: 1,
              transform: it.glyph === "◇" ? "rotate(45deg)" : "none",
              display:"inline-block",
              width: it.glyph === "◇" ? 10 : "auto",
              height: it.glyph === "◇" ? 10 : "auto",
              background: it.glyph === "◇" ? colors.warn : "transparent",
              color: it.glyph === "◇" ? "transparent" : colors.ink,
            }}>
              {it.glyph === "◇" ? "" : it.glyph}
            </div>
            <div>
              <div style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.inkMute, letterSpacing: 0.7,
                textTransform:"uppercase", fontWeight: 600, marginBottom: 3 }}>
                {it.label}
              </div>
              <div style={{
                fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                color: colors.inkSoft, lineHeight: 1.45 }}>
                {it.gloss}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STORYLINE RECONSTRUCTIONS — main v0.4 section
// ============================================================================

function StorylineReconstructions({ focusStoryline, setFocusStoryline }) {
  const [openId, setOpenId] = useState("alpha"); // α opens by default

  const sorted = [...STORYLINES].sort((a,b)=> b.coverage - a.coverage);

  return (
    <div style={{ padding: "56px 56px 48px", background: colors.paper }}>
      <Rule />

      {/* Section header */}
      <div style={{ marginTop: 44, marginBottom: 36, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 72, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Reconstructions
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 38, fontWeight: 400,
            lineHeight: 1.08, letterSpacing: -0.6, color: colors.ink }}>
            Five coherent ways to organize what we know.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 17,
          color: colors.inkSoft, lineHeight: 1.55, maxWidth: 580 }}>
          These are not votes on the truth. They are event-sequence reconstructions that each organize a portion of the evidence coherently. The percentages describe how much of the evidence each reconstruction absorbs — not how likely it is to be literally what happened. They do not sum to 100%: what remains is structure that no single reconstruction coherently holds.
        </div>
      </div>

      {/* Storyline cards */}
      <div style={{ display:"flex", flexDirection:"column", gap: 16 }}>
        {sorted.map(story => (
          <StorylineCard key={story.id} story={story}
            isOpen={openId === story.id}
            onToggle={()=>setOpenId(openId === story.id ? null : story.id)}
            focusStoryline={focusStoryline}
            onFocus={(id)=> setFocusStoryline(focusStoryline === id ? null : id)}
          />
        ))}
      </div>

      {/* Coverage sum indicator */}
      <div style={{ marginTop: 32, padding: "18px 22px",
        background: colors.paperDeep, border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap: 30,
          alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 8 }}>
              Total coverage
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5,
              color: colors.inkSoft, lineHeight: 1.55 }}>
              The five reconstructions absorb {STORYLINES.reduce((s,x)=> s + x.coverage, 0) * 100}% of the weight. The remainder is not "uncertainty in general" — it is structure that fits none of these five reconstructions coherently. It is a limit of the reconstructions, not of reality.
            </div>
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 46,
            fontStyle:"italic", color: colors.ink,
            fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            {Math.round(STORYLINES.reduce((s,x)=> s + x.coverage, 0) * 100)}<span style={{ fontSize: 22, opacity: 0.55 }}>%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AGGREGATION READOUT — v0.4 version of "reading the distribution"
// ============================================================================

function AggregationReadout() {
  const rawVals = [
    { k:"C2b", soft: 33.5, raw: 2.649 },
    { k:"C_insufficient", soft: 13.6, raw: 1.295 },
    { k:"C7", soft: 6.7, raw: 0.238 },
    { k:"C2c", soft: 6.4, raw: 0.171 },
    { k:"C2a", soft: 6.3, raw: 0.149 },
    { k:"C_unknown", soft: 6.3, raw: 0.135 },
    { k:"C5", soft: 6.2, raw: 0.106 },
    { k:"C1", soft: 5.7, raw: -0.010 },
    { k:"C4", soft: 5.4, raw: -0.106 },
    { k:"C3", soft: 4.2, raw: -0.450 },
  ];
  const maxRaw = Math.max(...rawVals.map(r => Math.abs(r.raw)), 0.5);

  return (
    <div style={{ padding: "48px 56px 56px", background: colors.paper }}>
      <Rule />
      <div style={{ marginTop: 36, marginBottom: 40, maxWidth: 1100 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
          Under the surface
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 36, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: -0.6, color: colors.ink }}>
          The strongest candidate sits at <span style={{ color: colors.primary, fontStyle:"italic" }}>33.5%</span>. That number is a display artifact, not a confidence level.
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 48, marginBottom: 48 }}>
        <div style={{ padding: 28, border: `1px solid ${colors.rule}`, borderRadius: 2,
          background: colors.paper }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
            What the display shows
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 19, fontStyle:"italic",
            lineHeight: 1.3, color: colors.ink, letterSpacing: -0.15, marginBottom: 20 }}>
            Softmax-normalized percentages
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
            {rawVals.map(({k, soft}) => (
              <div key={k} style={{ display:"grid", gridTemplateColumns:"1fr 56px",
                alignItems:"center", gap: 12 }}>
                <div>
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
                    color: colors.ink, marginBottom: 4 }}>
                    {CAND_READABLE_V04_SHORT[k]}
                  </div>
                  <div style={{ height: 3, background: colors.paperDeep, borderRadius: 1, overflow:"hidden" }}>
                    <div style={{ width: `${soft}%`, height: "100%",
                      background: candColor(k),
                      transition:"width 0.5s cubic-bezier(.2,.7,.2,1)" }}/>
                  </div>
                </div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 15, fontStyle:"italic",
                  color: k === "C2b" ? colors.primary : colors.ink,
                  fontVariantNumeric:"tabular-nums", textAlign:"right" }}>
                  {soft.toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55 }}>%</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16,
            borderTop: `1px solid ${colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            lineHeight: 1.55, color: colors.inkSoft }}>
            Softmax compresses eleven candidates into a bounded probability simplex. Weak candidates get bumped up from zero by the mathematical floor; strong ones get ceiling-capped.
          </div>
        </div>

        <div style={{ padding: 28, border: `1px solid ${colors.ink}`, borderRadius: 2,
          background: colors.paper }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.primary, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
            What the evidence actually says
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 19, fontStyle:"italic",
            lineHeight: 1.3, color: colors.ink, letterSpacing: -0.15, marginBottom: 20 }}>
            Raw score, before normalization
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
            {rawVals.map(({k, raw}) => {
              const pos = raw >= 0;
              const w = (Math.abs(raw) / maxRaw) * 50;
              return (
                <div key={k} style={{ display:"grid", gridTemplateColumns:"1fr 56px",
                  alignItems:"center", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
                      color: colors.ink, marginBottom: 4 }}>
                      {CAND_READABLE_V04_SHORT[k]}
                    </div>
                    <div style={{ position:"relative", height: 3, background: colors.paperDeep, borderRadius: 1 }}>
                      <div style={{ position:"absolute", left:"50%", top: -2, bottom: -2,
                        width: 1, background: colors.inkMute, opacity: 0.4 }}/>
                      <div style={{ position:"absolute",
                        left: pos ? "50%" : `${50 - w}%`,
                        width: `${w}%`, height: "100%",
                        background: pos
                          ? (k === "C2b" ? colors.primary
                            : k === "C7" ? colors.warn
                            : k === "C_insufficient" ? colors.meta
                            : colors.inkSoft)
                          : colors.muted,
                        transition:"all 0.5s cubic-bezier(.2,.7,.2,1)" }}/>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Fraunces', serif", fontSize: 15, fontStyle:"italic",
                    color: k === "C2b" ? colors.primary : colors.ink,
                    fontVariantNumeric:"tabular-nums", textAlign:"right" }}>
                    {raw >= 0 ? "+" : ""}{raw.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16,
            borderTop: `1px solid ${colors.ruleSoft}`,
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            lineHeight: 1.55, color: colors.inkSoft }}>
            Ukraine — military bypass scores <strong style={{ color: colors.primary }}>+2.65</strong>, dominating every other candidate. Inconclusive (the μ-feeder) scores +1.30 — second place goes to "the investigation is avoiding resolution," not to any other perpetrator hypothesis.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LIMITS (v0.4 version) — with Ljungqvist quote as epigraph
// ============================================================================

function LimitsSectionV04() {
  const items = [
    { k:"L1", t:"Shrinkage parameters still have no first-principles derivation.",
      d:"shrinkage_factor = 0.3, evidence_threshold = 0.1. Elevated to stakeable parameters in v0.3; not eliminated." },
    { k:"L2", t:"Cluster declaration is an attack surface.",
      d:"Malicious under- or over-declaration of source_cluster_id can bias aggregation. Mitigated by staking cluster declarations themselves." },
    { k:"L3", t:"Cross-MAS outputs are not directly comparable.",
      d:"Modality weights are MAS-bound. MAS_default and MAS_historical produce non-superposable distributions." },
    { k:"L4", t:"Aggregation correctness cannot be verified against ground truth.",
      d:"For contested claims, no oracle exists. Trace does not claim truth; Trace claims transparent, staked, auditable evidence structure. A philosophical boundary." },
    { k:"L5", t:"Position is exhibited as metadata, not as a filter.",
      d:"v0.4 tags each evidence node with its position (language, institutional layer, stance). Users cannot hide sources they disagree with. The exhibit is the exhibit — visible, not editable.", isV04: true },
    { k:"L6", t:"Edge-on-edge relations chart contradictions; they do not resolve them.",
      d:"Hersh's account and the Andromeda forensic exhibit mutually_exclusive at the data layer. v0.4 renders the relation; v0.4 does not pick a winner. The seventeen-hour interval, the intact fourth pipeline, and multi-jurisdictional HMX access are rendered as anchors the loser must displace — not as a verdict Trace issues.", isV04: true },
    { k:"L7", t:"Storylines are reconstructions, not probabilities.",
      d:"The five storyline percentages are coverage measures, not event probabilities. They describe how much of the evidence base each reconstruction coherently absorbs. A 50% storyline is not 'half likely to be true' — it is 'the reconstruction that coherently organizes roughly half of what we know'.", isV04: true },
    { k:"L8", t:"Model-corrected modality weights under-inflate strong judicial evidence.",
      d:"BGH's 2025-12 ruling and Poland's Łubowski judgment are treated as correlational (modality 0.7), not causal (1.0), because neither names a specific C2 sub-candidate. A reader may legitimately argue these rulings should carry causal weight for 'state involvement' as a union even if they do not separate C2a/b/c.", isV04: true },
  ];
  const epigraph = INDEPENDENT_VOICES.find(v => v.id === "V1");

  return (
    <div style={{ padding: "56px 56px 96px", background: colors.paper }}>
      <Rule />

      {/* Epigraph */}
      <div style={{ marginTop: 44, marginBottom: 52, maxWidth: 900 }}>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
          fontSize: 28, lineHeight: 1.3, color: colors.ink, letterSpacing: -0.3 }}>
          "{epigraph.quote}"
        </div>
        <div style={{ fontFamily:"'Fraunces', serif",
          fontSize: 24, color: colors.ink, marginTop: 10,
          lineHeight: 1.35, letterSpacing: -0.3, fontWeight: 400 }}>
          "{epigraph.translation}"
        </div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.8, marginTop: 14 }}>
          — {epigraph.speaker}, {epigraph.role}, {epigraph.date}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap: 72 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 14 }}>
            Acknowledged limits
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.12, letterSpacing: -0.4, color: colors.ink }}>
            What this exhibit cannot do.
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
            color: colors.inkMute, marginTop: 18, lineHeight: 1.5 }}>
            Four limits inherited from v0.3. Four new limits that v0.4 makes explicit — structural in nature, not parameter-tunable.
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
          {items.map(item => (
            <div key={item.k} style={{
              display:"grid", gridTemplateColumns:"60px 1fr", gap: 22,
              paddingBottom: 20, borderBottom:`1px solid ${colors.ruleSoft}` }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                color: item.isV04 ? colors.primary : colors.inkMute,
                letterSpacing: 0.8, paddingTop: 4, fontWeight: item.isV04 ? 600 : 400 }}>
                {item.isV04 ? `v0.4–${item.k}` : `v0.3–${item.k}`}
              </div>
              <div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 19,
                  color: colors.ink, lineHeight: 1.3 }}>{item.t}</div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
                  color: colors.inkSoft, marginTop: 8, lineHeight: 1.6 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 72, paddingTop: 24, borderTop:`1px solid ${colors.rule}`,
        display:"flex", justifyContent:"space-between", alignItems:"baseline",
        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
        color: colors.inkMute, letterSpacing: 0.6, flexWrap:"wrap", gap: 12 }}>
        <span>Trace protocol v0.4 · fourteen-language intake · exhibit mode</span>
        <span>Case file 001 · Nord Stream attribution · last updated 2026-04-18</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function TraceV04Experience({ mode, setMode }) {

  // v0.3 state
  const [idx, setIdx] = useState(TIMELINE_V03.length - 1); // start at "today"
  const [playing, setPlaying] = useState(false);

  // Shared state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEv, setSelectedEv] = useState(null);
  const [hoverCand, setHoverCand] = useState(null);
  const [hoverEv, setHoverEv] = useState(null);

  // Zoom + pan (fullscreen only) — ported from v0.3
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panKeyHeld, setPanKeyHeld] = useState(false);
  const panStart = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  const canPan = isFullscreen && zoom > 1;
  const panReady = canPan && panKeyHeld;

  useEffect(() => {
    if (!canPan) { setPanKeyHeld(false); return; }
    const isPanKey = (e) => e.code === "Space" || e.metaKey || e.ctrlKey;
    const onDown = (e) => {
      if (isPanKey(e)) {
        if (e.code === "Space") e.preventDefault();
        setPanKeyHeld(true);
      }
    };
    const onUp = (e) => {
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
    if (zoom === 1 || !isFullscreen) setPan({ x: 0, y: 0 });
  }, [zoom, isFullscreen]);

  // Reset zoom when leaving fullscreen
  useEffect(() => {
    if (!isFullscreen) setZoom(1);
  }, [isFullscreen]);

  // v0.4 state
  // focusStoryline: user-initiated focus on a storyline card. null = no focus, no dimming.
  // The overlay uses focusStoryline || "alpha" so it always surfaces the leading storyline by default.
  const [focusStoryline, setFocusStoryline] = useState(null);
  const [expandedClusters, setExpandedClusters] = useState(() => new Set());
  const [expandedBuckets, setExpandedBuckets] = useState(() => new Set()); // bucket ids that are expanded
  const [selectedCluster, setSelectedCluster] = useState(null);

  // v0.3 playback
  useEffect(() => {
    if (mode !== "v03" || !playing) return;
    if (idx >= TIMELINE_V03.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => Math.min(i + 1, TIMELINE_V03.length - 1)), 1600);
    return () => clearTimeout(t);
  }, [playing, idx, mode]);

  // Reset selection when switching modes
  useEffect(() => {
    setSelectedEv(null);
    setHoverCand(null);
    setHoverEv(null);
    setFocusStoryline(null);
  }, [mode]);

  // Derive v0.3 active evidence + distribution
  const tp = TIMELINE_V03[idx];
  const activeEvV03 = useMemo(() => {
    if (mode !== "v03") return [];
    return EVIDENCE_V03.filter(e => e.published <= tp.date);
  }, [mode, tp.date]);

  // Active graph inputs based on mode
  const graphEvidence = mode === "v04" ? EVIDENCE_V04 : activeEvV03;
  const graphDistribution = mode === "v04" ? DISTRIBUTION_V04 : tp.distribution;

  // Selected evidence for drawer — must lookup across both evidence sets
  const selectedEvObj = useMemo(() => {
    if (!selectedEv) return null;
    return (mode === "v04" ? EVIDENCE_V04 : EVIDENCE_V03).find(e => e.id === selectedEv);
  }, [selectedEv, mode]);

  // Fullscreen viewport sizing
  const viewportRef = useRef(null);
  const [viewport, setViewport] = useState({ w: 1400, h: 800 });
  useEffect(() => {
    const update = () => {
      if (viewportRef.current) {
        const r = viewportRef.current.getBoundingClientRect();
        setViewport({ w: Math.max(800, r.width), h: Math.max(500, r.height) });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isFullscreen, mode]);

  // Keyframe injection
  useEffect(() => {
    const id = "trace-v04-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(16px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-3px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      body { margin: 0; }
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    `;
    document.head.appendChild(style);
    // Also inject the Google Fonts link (import inside style can fail on some setups)
    const linkId = "trace-v04-fonts";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: colors.paper,
      fontFamily: "'Instrument Sans', sans-serif",
      color: colors.ink,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>
      <Masthead
        mode={mode} setMode={setMode}
        activeEvidenceCount={activeEvV03.length}
        currentLabel={tp.label}
        currentDate={tp.date}
        isFullscreen={isFullscreen}
        onToggleFullscreen={()=>setIsFullscreen(v=>!v)}
      />

      {/* Graph region */}
      <div ref={viewportRef}
        style={{
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 0 : "auto",
          left: isFullscreen ? 0 : "auto",
          right: isFullscreen ? 0 : "auto",
          bottom: isFullscreen ? 0 : "auto",
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100vh" : "min(78vh, 860px)",
          minHeight: isFullscreen ? "100vh" : 580,
          background: colors.paper,
          zIndex: isFullscreen ? 100 : "auto",
          overflow: "hidden",
          borderBottom: isFullscreen ? "none" : `1px solid ${colors.rule}`,
        }}>
        {isFullscreen && (
          <button onClick={()=>setIsFullscreen(false)}
            style={{ position:"absolute", top: 20, right: 20,
              zIndex: 30,
              background: colors.ink, color: colors.paper,
              border: "none", padding: "8px 14px", borderRadius: 2,
              fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: 1, textTransform:"uppercase", cursor:"pointer" }}>
            exit fullscreen ×
          </button>
        )}

        {/* Pan+zoom wrapper — only transforms in fullscreen + zoom>1 */}
        <div onMouseDown={onPanMouseDown}
          style={{
            position:"absolute", inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: panning ? "none" : "transform 0.2s cubic-bezier(.2,.7,.2,1)",
            cursor: panning ? "grabbing" : (panReady ? "grab" : "default"),
          }}>
          <FullscreenGraph
            activeEvidence={graphEvidence}
            distribution={graphDistribution}
            selectedEv={selectedEv} setSelectedEv={setSelectedEv}
            hoverCand={hoverCand} setHoverCand={setHoverCand}
            hoverEv={hoverEv} setHoverEv={setHoverEv}
            width={viewport.w} height={viewport.h}
            playing={playing}
            mode={mode}
            focusStoryline={mode === "v04" ? focusStoryline : null}
            expandedClusters={expandedClusters}
            setExpandedClusters={setExpandedClusters}
            expandedBuckets={expandedBuckets}
            setExpandedBuckets={setExpandedBuckets}
            selectedCluster={selectedCluster}
            setSelectedCluster={setSelectedCluster}
          />
        </div>

        {/* Legend — top-left. In fullscreen, shifted down to clear zoom controls. */}
        <div style={{
          position:"absolute", top: isFullscreen ? 62 : 22, left: 24, zIndex: 6,
          display:"flex", flexDirection:"column", gap: 8,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5, color: colors.inkMute,
          letterSpacing: 0.5, pointerEvents:"none",
        }}>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="22" height="8" style={{ flexShrink: 0 }}>
              <line x1="0" y1="2" x2="22" y2="2" stroke={colors.primary} strokeWidth="2"/>
              <line x1="0" y1="6" x2="22" y2="6" stroke={colors.secondary} strokeWidth="2"/>
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
            title="A set of reports sharing a likely common source (e.g. single intel ecosystem). Combined weight dampened so correlated reports aren't counted as independent."
            style={{ display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", cursor:"help" }}>
            <svg width="22" height="14" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="7" r="6" fill="none" stroke={colors.warn}
                      strokeWidth="0.9" strokeDasharray="2,2"/>
            </svg>
            correlated cluster
          </span>
          <span
            title="Institutional non-resolution modeled as evidence — declined inquiries, closed investigations, procedural non-execution. Weight and direction depend on silence type."
            style={{ display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", cursor:"help" }}>
            <svg width="22" height="14" style={{ flexShrink: 0 }}>
              <rect x="3" y="2" width="16" height="10" fill="none" stroke={colors.inkMute} strokeWidth="0.8" strokeDasharray="2,2"/>
            </svg>
            silence evidence
          </span>
        </div>

        {/* Zoom controls — fullscreen only, top-left */}
        {isFullscreen && (
          <div style={{
            position:"absolute", top: 20, left: 20, zIndex: 15,
            display:"flex", alignItems:"stretch",
            background: "rgba(250, 248, 243, 0.72)",
            backdropFilter:"blur(14px) saturate(140%)",
            WebkitBackdropFilter:"blur(14px) saturate(140%)",
            border: `1px solid rgba(217, 212, 199, 0.9)`,
            borderRadius: 2, overflow:"hidden",
          }}>
            <button
              onClick={()=>setZoom(z => Math.max(0.7, +(z - 0.1).toFixed(2)))}
              disabled={zoom <= 0.7}
              title="Zoom out"
              style={{
                width: 32, height: 30, background: "transparent",
                border: "none", borderRight: `1px solid ${colors.rule}`,
                cursor: zoom <= 0.7 ? "default" : "pointer",
                color: zoom <= 0.7 ? colors.muted : colors.inkSoft,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 13,
              }}>−</button>
            <button
              onClick={()=>setZoom(1)}
              title="Reset zoom"
              style={{
                padding: "0 12px", height: 30,
                background:"transparent", border:"none",
                borderRight: `1px solid ${colors.rule}`,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.inkSoft, letterSpacing: 0.6,
                cursor: "pointer", fontVariantNumeric:"tabular-nums",
              }}>
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={()=>setZoom(z => Math.min(1.8, +(z + 0.1).toFixed(2)))}
              disabled={zoom >= 1.8}
              title="Zoom in"
              style={{
                width: 32, height: 30, background: "transparent",
                border: "none",
                cursor: zoom >= 1.8 ? "default" : "pointer",
                color: zoom >= 1.8 ? colors.muted : colors.inkSoft,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 13,
              }}>+</button>
          </div>
        )}

        {/* Pan affordance hint — appears in fullscreen when zoomed in */}
        {canPan && (
          <div style={{
            position:"absolute", bottom: 20, left: 20, zIndex: 15,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.7,
            background: "rgba(250, 248, 243, 0.72)",
            backdropFilter:"blur(14px)",
            WebkitBackdropFilter:"blur(14px)",
            padding: "6px 10px", borderRadius: 2,
            border: `1px solid ${colors.rule}`,
            opacity: panReady ? 1 : 0.7,
            transition: "opacity 0.2s",
          }}>
            {panReady ? "drag to pan" : "hold space / ⌘ to pan"}
          </div>
        )}

        <DistributionOverlay
          distribution={graphDistribution}
          hoverCand={hoverCand} setHoverCand={setHoverCand}
          tp={mode === "v03" ? tp : null}
          playing={mode === "v03" ? playing : false}
          onPlayToggle={mode === "v03" ? (()=>setPlaying(p=>!p)) : null}
          mode={mode}
          focusStoryline={focusStoryline}
          setFocusStoryline={setFocusStoryline}
        />

        {mode === "v03" && (
          <TimelineOverlay idx={idx} setIdx={setIdx} timeline={TIMELINE_V03}/>
        )}

        {selectedEvObj && (
          <EvidenceDrawer ev={selectedEvObj}
            onClose={()=>setSelectedEv(null)}
            onJumpTo={(id)=>setSelectedEv(id)}
            mode={mode}/>
        )}
      </div>

      {/* v0.3 mode: stop here — everything else is in the main graph + overlay + timeline */}
      {mode === "v03" && !isFullscreen && (
        <div style={{ padding: "48px 56px 72px", background: colors.paper,
          fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 17,
          color: colors.inkSoft, lineHeight: 1.6, maxWidth: 920 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontStyle:"normal",
            fontSize: 10, color: colors.inkMute, letterSpacing: 0.9,
            textTransform:"uppercase", marginBottom: 14 }}>
            v0.3 exhibit
          </div>
          This is the original Trace v0.3 demo: sixteen English-language evidence items, eight candidates, twelve time points. Use the timeline at the bottom of the graph to move through the case, or press play to watch the distribution evolve. Switch to v0.4 using the toggle above to see the fourteen-language expansion, the added judicial rulings, the eleven-candidate space, and the five-reconstruction storyline layer.
        </div>
      )}

      {/* v0.4 mode: full long-form exhibit — Storylines lead; supporting analysis follows */}
      {mode === "v04" && !isFullscreen && (
        <>
          <SurvivingCausalChain />
          <StorylineReconstructions
            focusStoryline={focusStoryline}
            setFocusStoryline={setFocusStoryline}/>
          <AnchorsRail />
          <AggregationReadout />
          <DeltaPanel />
          <LimitsSectionV04 />
        </>
      )}
    </div>
  );
}


// ============================================================================
// V0.4 LOCKED OVERLAY
// ----------------------------------------------------------------------------
// The v0.4 experience is rendered in full underneath, but a translucent lock
// sheet sits over it. Reader can sense the shape of what's coming; they can't
// interact with it yet. Remove this wrapper when v0.4 is ready to ship.
// ============================================================================

function TraceV04Locked({ mode, setMode }) {
  return (
    <div style={{ position:"relative" }}>
      {/* The underlying v0.4 tree — rendered normally */}
      <div style={{ pointerEvents:"none",
        filter:"blur(2px) saturate(0.6)",
        opacity: 0.55,
        userSelect:"none" }}>
        <TraceV04Experience mode={mode} setMode={setMode}/>
      </div>

      {/* Lock sheet — centered message */}
      <div style={{ position:"absolute", inset: 0,
        background: "rgba(250, 248, 243, 0.5)",
        backdropFilter: "blur(2px) saturate(1.1)",
        WebkitBackdropFilter: "blur(2px) saturate(1.1)",
        display:"flex", alignItems:"flex-start", justifyContent:"center",
        paddingTop: "18vh",
        zIndex: 100 }}>
        <div style={{ maxWidth: 520, padding: "40px 44px",
          background: "rgba(250, 248, 243, 0.94)",
          border: `1px solid ${colors.rule}`,
          borderRadius: 3,
          boxShadow: "0 32px 80px rgba(26,26,26,0.18)",
          textAlign:"center" }}>

          {/* Lock glyph */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom: 22 }}>
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
              <rect x="3" y="14" width="22" height="16" rx="2"
                fill="none" stroke={colors.ink} strokeWidth="1.2"/>
              <path d="M8 14 L8 9 C8 5.5, 10.5 3, 14 3 C17.5 3, 20 5.5, 20 9 L20 14"
                fill="none" stroke={colors.ink} strokeWidth="1.2"
                strokeLinecap="round"/>
              <circle cx="14" cy="22" r="1.6" fill={colors.ink}/>
            </svg>
          </div>

          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 1.2, textTransform:"uppercase",
            marginBottom: 12 }}>
            v0.4 · preview locked
          </div>

          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 28,
            fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.4,
            color: colors.ink, marginBottom: 16 }}>
            The full v0.4 analysis is in development.
          </div>

          <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
            fontSize: 15, color: colors.inkSoft, lineHeight: 1.55,
            marginBottom: 28 }}>
            Pearl-level evidence classification, fourteen-language coverage, five reconstructive storylines, and the possibility-space reader are still being finalized. The shape of the work is visible behind this sheet.
          </div>

          <button
            onClick={()=>setMode("v03")}
            style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: 1, textTransform:"uppercase",
              padding: "10px 20px",
              background: colors.ink, color: colors.paper,
              border: "none", borderRadius: 2, cursor:"pointer",
              transition:"opacity 0.15s" }}
            onMouseEnter={(e)=>{ e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.opacity = "1"; }}>
            ← back to v0.3
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODE TAB STRIP
// ----------------------------------------------------------------------------
// Sits above both experiences. Lets the reader switch between the stable v0.3
// case file and the in-progress v0.4 locked preview. Uses the v0.3 color
// system since v0.3 is the primary experience right now.
// ============================================================================

function ModeTabStrip({ mode, setMode }) {
  const bg = V03_colors.paper;
  return (
    <div style={{ background: bg,
      borderBottom: `1px solid ${V03_colors.rule}`,
      padding: "10px 32px",
      display:"flex", alignItems:"center", gap: 14,
      position:"sticky", top: 0, zIndex: 200 }}>
      <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
        color: V03_colors.inkMute, letterSpacing: 1, textTransform:"uppercase" }}>
        Version
      </div>
      <div style={{ display:"inline-flex", flexShrink: 0,
        border: `1px solid ${V03_colors.rule}`, borderRadius: 2,
        background: V03_colors.paper, padding: 1 }}>
        {[
          { key: "v03", label: "v0.3 · case file" },
          { key: "v04", label: "v0.4 · locked preview" },
        ].map(opt => (
          <button key={opt.key} onClick={()=>setMode(opt.key)}
            style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: 0.7, textTransform:"uppercase",
              padding: "5px 11px", borderRadius: 1, border:"none", cursor:"pointer",
              background: mode === opt.key ? V03_colors.ink : "transparent",
              color: mode === opt.key ? V03_colors.paper : V03_colors.inkMute,
              transition:"all 0.15s", whiteSpace:"nowrap" }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// TOP-LEVEL EXPORT — routes between v0.3 case file and v0.4 locked preview
// ============================================================================

export default function TraceCaseFile() {
  const [mode, setMode] = useState("v03");
  return (
    <div>
      <ModeTabStrip mode={mode} setMode={setMode}/>
      {mode === "v03" && <TraceV03Experience/>}
      {mode === "v04" && <TraceV04Locked mode={mode} setMode={setMode}/>}
    </div>
  );
}
