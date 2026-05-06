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
  paperGlass: "rgba(250, 248, 243, 0.97)",
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

// Multi-layer paper-noise texture used as the graph background in both
// v0.3 and v0.4. Combines static "old paper" layers with an animated
// fine-grain layer that swaps between three seeds at ~10fps to mimic
// high-ISO film exposure (where the grain pattern shimmers per frame).
//
// Layer stack (bottom → top, in CSS background-image syntax it's
// reversed; the FIRST URL paints on top):
//   1. Animated fine grain — three seeds, swapped via @keyframes.
//      Lighter alpha (0.10) than before — was too dark.
//   2. Coarse warm mottle — large-scale color unevenness, static.
//      Alpha lowered (0.07 → 0.04) to keep base tone bright.
//   3. Paper base color (#FAF8F3) — solid bottom layer.
const _grainSVG_a = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0.10 0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>`;
const _grainSVG_b = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17"/><feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0.10 0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>`;
const _grainSVG_c = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="29"/><feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0.10 0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>`;
const _mottleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><filter id="m"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.18  0 0 0 0.04 0"/></filter><rect width="500" height="500" filter="url(#m)"/></svg>`;
const PAPER_GRAIN_A = `url("data:image/svg+xml;utf8,${encodeURIComponent(_grainSVG_a)}")`;
const PAPER_GRAIN_B = `url("data:image/svg+xml;utf8,${encodeURIComponent(_grainSVG_b)}")`;
const PAPER_GRAIN_C = `url("data:image/svg+xml;utf8,${encodeURIComponent(_grainSVG_c)}")`;
const PAPER_MOTTLE_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(_mottleSVG)}")`;
const PAPER_TEXTURE_BG = {
  // The animated grain layer's background-image is set by the
  // @keyframes filmGrain animation (defined globally in the style
  // injection) — the inline rule supplies size/repeat/position and
  // the static mottle + base color.
  backgroundImage: `${PAPER_GRAIN_A}, ${PAPER_MOTTLE_URL}`,
  backgroundSize: "220px 220px, 500px 500px",
  backgroundRepeat: "repeat, repeat",
  backgroundColor: V03_colors.paper,
  animation: "filmGrain 0.3s infinite",
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
        // Expand truncated label to full text on direct hover (not on
        // reverse-trace via candidate hover, which would expand many at once).
        const expandLabel = isFocusByEv && ev.label.length > 44;
        const displayLabel = expandLabel ? ev.label : labelText;
        const displayLabelWidth = expandLabel
          ? measureText(ev.label, 14, "Instrument Sans, sans-serif", 500) + 8
          : mainLabelWidth;
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
                    width={displayLabelWidth} height={18}
                    fill={V03_colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X + 18} y={y + 4}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={isFocus ? 14 : 13}
                  fill={isFocus ? V03_colors.ink : (ev.silence ? V03_colors.inkMute : V03_colors.inkSoft)}
                  fontWeight={isFocus ? 500 : 400}
                  fontStyle={ev.silence ? "italic" : "normal"}
                  style={{ transition:"all 0.15s" }}>
              {displayLabel}
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
          background: "rgba(250, 248, 243, 0.97)",
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
            borderTop:"4px solid rgba(250, 248, 243, 0.97)",
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
  // Default position: bottom-left of the graph, floating above the timeline.
  const [pos, setPos] = useState({ top: null, left: 20, bottom: 82, right: null });
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
    setPos({ top: rect.top - parentRect.top, left: rect.left - parentRect.left, right: null, bottom: null });
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

  // Positioning: default bottom-left; drag overrides to absolute top/left.
  const userDragged = pos.top !== null;
  const positionStyle = userDragged
    ? (pos.right != null ? { top: pos.top, right: pos.right } : { top: pos.top, left: pos.left })
    : { left: pos.left, bottom: pos.bottom };

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
          {/* Play/pause/stop controls now live in the timeline overlay
              (where temporal control belongs). */}
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

// Black-and-white pushpin used at the top-right of the v0.3 evidence
// drawer. Click to "unpin" (close). Mirrors v0.4's PinButton but uses
// V03_colors so the v0.3 standalone bundle stays self-contained.
function V03_PinButton({ onClose }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={(e)=>{ e.stopPropagation(); onClose(); }}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      title="Unpin (close panel)"
      aria-label="Unpin and close evidence panel"
      style={{
        position:"absolute", top: -6, right: 22,
        width: 22, height: 28,
        background:"transparent", border:"none",
        padding: 0, cursor:"pointer",
        transform: hover ? "rotate(-12deg) translateY(-2px)" : "rotate(-4deg)",
        transformOrigin: "50% 25%",
        transition: "transform 0.18s cubic-bezier(.2,.7,.2,1)",
        zIndex: 5,
      }}>
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
        <path d="M 11 9 L 11 24"
              stroke={V03_colors.ink} strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="11" cy="7" r="5.5" fill={V03_colors.ink}/>
        <circle cx="9" cy="5" r="1.5" fill={V03_colors.paper} opacity="0.55"/>
        <ellipse cx="11" cy="13.5" rx="3.5" ry="0.8"
                 fill={V03_colors.ink} opacity="0.12"/>
      </svg>
    </button>
  );
}

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
    <>
      {/* Click-outside backdrop. */}
      <div onClick={onClose}
        style={{ position:"fixed", inset: 0, zIndex: 99,
          background: "rgba(26, 26, 26, 0.18)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          cursor:"default",
          animation: "fadeIn 0.2s ease-out" }}/>
    <div onClick={(e)=>e.stopPropagation()}
      style={{
      position:"fixed", top: 0, right: 0, bottom: 0,
      width: 480, maxWidth: "min(50vw, 540px)",
      background: V03_colors.paper,
      borderLeft: `1px solid ${V03_colors.rule}`,
      boxShadow: "-20px 0 60px rgba(26,26,26,0.12), -2px 0 8px rgba(26,26,26,0.04)",
      padding: "32px 36px 40px",
      overflowY:"auto", zIndex: 100,
      animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)",
    }}>
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
    </>
  );
}

// ============================================================================
// MASTHEAD + V03_TIMELINE OVERLAY
// ============================================================================

function V03_Masthead({ mode, setMode, activeEventCount, activeSilenceCount, totalEventCount, totalSilenceCount, currentLabel, currentDate, isFullscreen, onToggleFullscreen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      borderBottom: `1px solid ${V03_colors.rule}`,
      background: V03_colors.paper,
      padding: "16px 32px 18px",
    }}>
      {/* Top row: brand + case metadata on the left, mode toggle + fullscreen
          on the right. Metadata reads as one breadcrumb-style line:
            CASE FILE 001 · v0.3 · X EVIDENCE */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap: 24, flexWrap:"wrap",
      }}>
        <div style={{ display:"flex", alignItems:"baseline", gap: 12, flexWrap:"wrap" }}>
          <div style={{
            fontFamily:"'Fraunces', serif", fontWeight: 600, fontSize: 20,
            letterSpacing: -0.3, color: V03_colors.ink,
            lineHeight: 1,
          }}>Trace</div>
          <div style={{ width: 1, height: 11, background: V03_colors.rule, alignSelf:"center" }}/>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: V03_colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
            lineHeight: 1,
          }}>
            Case file 001
            <span style={{ color: V03_colors.ruleSoft, margin: "0 7px" }}>·</span>
            <span style={{ color: V03_colors.inkSoft }}>v0.3</span>
            {typeof activeEventCount === "number" && (
              <>
                <span style={{ color: V03_colors.ruleSoft, margin: "0 7px" }}>·</span>
                {activeEventCount} evidence
              </>
            )}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap: 10, flexShrink: 0 }}>
          {/* v0.3 / v0.4 mode toggle — mirrors the one in v0.4 Masthead */}
          {setMode && (
            <div style={{ display:"inline-flex", flexShrink: 0,
              border: `1px solid ${V03_colors.rule}`, borderRadius: 2,
              background: V03_colors.paper, padding: 1 }}>
              {[
                { key: "v03", label: "v0.3 · LLM Default" },
                { key: "v04", label: "v0.4 · Traced" },
              ].map(opt => (
                <button key={opt.key} onClick={()=>setMode(opt.key)}
                  style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                    letterSpacing: 0.7, textTransform:"uppercase",
                    padding: "5px 11px", borderRadius: 1, border: "none", cursor: "pointer",
                    background: mode === opt.key ? V03_colors.ink : "transparent",
                    color: mode === opt.key ? V03_colors.paper : V03_colors.inkMute,
                    transition:"all 0.15s", whiteSpace:"nowrap" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Search button — between mode toggle and fullscreen.
              Same chrome as fullscreen for visual symmetry.
              Opens the centered search overlay. */}
          <button onClick={()=>setSearchOpen(true)}
            title="Search highly contested claims"
            aria-label="Search claims"
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width: 28, height: 28,
              background: "transparent",
              color: V03_colors.inkMute,
              border: `1px solid ${V03_colors.rule}`,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.15s",
              padding: 0,
            }}
            onMouseEnter={(e)=>{
              e.currentTarget.style.color = V03_colors.ink;
              e.currentTarget.style.borderColor = V03_colors.ink;
            }}
            onMouseLeave={(e)=>{
              e.currentTarget.style.color = V03_colors.inkMute;
              e.currentTarget.style.borderColor = V03_colors.rule;
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.3"/>
              <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" stroke="currentColor"
                strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Fullscreen toggle — to the right of mode toggle. Triggers true
              browser fullscreen (whole page, not just graph), so the user can
              still scroll to read content beneath the graph. */}
          {onToggleFullscreen && (
            <button onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen page"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen page"}
              style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width: 28, height: 28,
                background: isFullscreen ? V03_colors.ink : "transparent",
                color: isFullscreen ? V03_colors.paper : V03_colors.inkMute,
                border: `1px solid ${isFullscreen ? V03_colors.ink : V03_colors.rule}`,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.15s",
                padding: 0,
              }}
              onMouseEnter={(e)=>{
                if (!isFullscreen) {
                  e.currentTarget.style.color = V03_colors.ink;
                  e.currentTarget.style.borderColor = V03_colors.ink;
                }
              }}
              onMouseLeave={(e)=>{
                if (!isFullscreen) {
                  e.currentTarget.style.color = V03_colors.inkMute;
                  e.currentTarget.style.borderColor = V03_colors.rule;
                }
              }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d={isFullscreen
                  ? "M1 4 L1 1 L4 1 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"
                  : "M4 1 L1 1 L1 4 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"}
                  stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: claim title — uses V03_QuestionBlock helper for
          consistent behavior with v0.4 (taller red bar, full-width
          hover backdrop, click → input mode). */}
      <V03_QuestionBlock />

      {searchOpen && (
        <SearchOverlay
          theme="v03"
          onClose={()=>setSearchOpen(false)}
        />
      )}
    </div>
  );
}

function V03_QuestionBlock() {
  return (
    <div style={{
      marginTop: 14,
      paddingTop: 4, paddingBottom: 4,
      display: "flex", alignItems: "stretch", gap: 14,
    }}>
      <div style={{ width: 3, background: V03_colors.primary, flexShrink: 0 }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: V03_colors.primary, letterSpacing: 1.4,
          textTransform:"uppercase", fontWeight: 500,
          marginBottom: 5,
        }}>
          Under investigation
        </div>
        <h1 style={{
          fontFamily:"'Fraunces', serif",
          fontSize: 20, fontWeight: 400, fontStyle:"italic",
          color: V03_colors.ink, letterSpacing: -0.4, lineHeight: 1.2,
          margin: 0, textWrap: "balance",
        }}>
          Who attacked the Nord Stream pipelines on 26 September 2022?
        </h1>
      </div>
    </div>
  );
}

// ============================================================================
// V03_TIMELINE OVERLAY (floats at bottom of graph area)
// ============================================================================

function V03_TimelineOverlay({ idx, setIdx, playing, paused, onPlayToggle, onStop }) {
  const transportState = playing ? "playing" : paused ? "paused" : "idle";
  return (
    <div style={{
      position:"absolute", left: 20, right: 20, bottom: 8, zIndex: 9,
      pointerEvents:"none",
    }}>
      <div style={{
        pointerEvents:"auto",
        width: "100%",
        padding: "10px 28px 10px 16px",
        background: "rgba(250, 248, 243, 0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.8)`,
        borderRadius: 3,
        boxShadow: "0 12px 32px rgba(26, 26, 26, 0.06), 0 2px 6px rgba(26, 26, 26, 0.03)",
        display:"flex", alignItems:"stretch", gap: 16,
      }}>
        <div style={{
          display:"flex", alignItems:"center", gap: 6,
          flexShrink: 0,
        }}>
          {transportState === "idle" && onPlayToggle && (
            <V03_TransportButton icon="play" label="PLAY"
              onClick={onPlayToggle}
              tooltip="Play timeline — watch the distribution evolve" />
          )}
          {transportState === "playing" && onPlayToggle && (
            <V03_TransportButton icon="pause" label="PAUSE"
              onClick={onPlayToggle}
              tooltip="Pause — keep current frame, examine" />
          )}
          {transportState === "paused" && onPlayToggle && (
            <V03_TransportButton icon="play" label="RESUME"
              onClick={onPlayToggle}
              tooltip="Resume playback from current frame" />
          )}
          {(transportState === "playing" || transportState === "paused") && onStop && (
            <V03_TransportButton icon="stop"
              onClick={onStop}
              tooltip="Stop — show full timeline (default view)" compact />
          )}
        </div>

        <div style={{
          width: 1,
          background: "rgba(217, 212, 199, 0.7)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}/>

        <div style={{ flex: 1, minWidth: 0,
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding: "0 32px" }}>
          <V03_TimelineBar idx={idx} setIdx={setIdx} />
        </div>
      </div>
    </div>
  );
}

function V03_TransportButton({ icon, label, onClick, tooltip, compact }) {
  return (
    <button onMouseDown={(e)=>e.stopPropagation()}
      onClick={(e)=>{ e.stopPropagation(); onClick(); }}
      title={tooltip}
      aria-label={tooltip}
      style={{
        display:"inline-flex", alignItems:"center", gap: compact ? 0 : 6,
        height: 24,
        padding: compact ? "0" : "0 9px 0 7px",
        width: compact ? 24 : "auto",
        justifyContent: compact ? "center" : "flex-start",
        borderRadius: 2,
        border: `1px solid ${V03_colors.ink}`,
        background: V03_colors.ink, color: V03_colors.paper,
        cursor:"pointer", flexShrink: 0,
        transition:"opacity 0.15s",
      }}
      onMouseEnter={(e)=>{ e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e)=>{ e.currentTarget.style.opacity = "1"; }}>
      {icon === "play" && (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
          <path d="M1.5 1 L8 5 L1.5 9 Z" fill={V03_colors.paper}/>
        </svg>
      )}
      {icon === "pause" && (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
          <rect x="1.5" y="1" width="2" height="8" fill={V03_colors.paper}/>
          <rect x="5.5" y="1" width="2" height="8" fill={V03_colors.paper}/>
        </svg>
      )}
      {icon === "stop" && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <rect x="1" y="1" width="7" height="7" fill={V03_colors.paper}/>
        </svg>
      )}
      {label && (
        <span style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing: 0.7,
          textTransform:"uppercase", fontWeight: 500,
        }}>{label}</span>
      )}
    </button>
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

function TraceV03Experience({ mode, setMode }) {
  const [idx, setIdx] = useState(V03_TIMELINE.length - 1);
  const [selectedEv, setSelectedEv] = useState(null);
  const [hoverCand, setHoverCand] = useState(null);
  const [hoverEv, setHoverEv] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panKeyHeld, setPanKeyHeld] = useState(false);
  const panStart = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  // Page-level fullscreen via browser API.
  const togglePageFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (req) req.call(el).catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
      if (exit) exit.call(document).catch(() => {});
    }
  };
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

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

  // Browser handles Esc natively when in document fullscreen, so no manual
  // keydown listener is needed here.

  // Reset zoom when leaving fullscreen (no-op now that fullscreen doesn't
  // change graph size, but harmless to keep)
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
          setPaused(false);
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
        @keyframes filmGrain {
          0%, 32%   { background-image: ${PAPER_GRAIN_A}, ${PAPER_MOTTLE_URL}; }
          33%, 65%  { background-image: ${PAPER_GRAIN_B}, ${PAPER_MOTTLE_URL}; }
          66%, 100% { background-image: ${PAPER_GRAIN_C}, ${PAPER_MOTTLE_URL}; }
        }
        .trace-search-input::placeholder {
          color: #ABA594;
          font-weight: 300;
          font-style: italic;
          opacity: 1;
        }
        .trace-search-input::-webkit-input-placeholder {
          color: #ABA594;
          font-weight: 300;
          font-style: italic;
        }
      `}</style>

      {/* MASTHEAD — full-width row (hidden in fullscreen) */}
      {!fullscreen && (
        <V03_Masthead
          mode={mode}
          setMode={setMode}
          activeEventCount={activeEvidence.filter(e => !e.silence).length}
          activeSilenceCount={activeEvidence.filter(e => e.silence).length}
          totalEventCount={V03_EVIDENCE.filter(e => !e.silence).length}
          totalSilenceCount={V03_EVIDENCE.filter(e => e.silence).length}
          currentLabel={tp.label}
          currentDate={tp.date}
          isFullscreen={fullscreen}
          onToggleFullscreen={togglePageFullscreen}
        />
      )}

      {/* GRAPH STAGE — always normal size; page-fullscreen is handled by
          the browser Fullscreen API on document root, not by CSS here. */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 132px)",
        minHeight: 560,
        ...PAPER_TEXTURE_BG,
        overflow:"hidden",
        zIndex: 1,
      }}>
        <div
          style={{
            position:"absolute", inset: 0,
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

        {/* Legend — top-left, below the small fullscreen-toggle icon. */}
        <div style={{
          position:"absolute", top: fullscreen ? 56 : 50, left: 24, zIndex: 6,
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
        <V03_TimelineOverlay idx={idx} setIdx={setIdxUser}
          playing={playing}
          paused={paused}
          onPlayToggle={()=>{
            if (playing) { setPlaying(false); setPaused(true); }
            else { setPlaying(true); setPaused(false); }
          }}
          onStop={()=>{
            setPlaying(false); setPaused(false);
            setIdxUser(V03_TIMELINE.length - 1);
          }} />

        {/* Zoom / pan / in-graph fullscreen button removed — fullscreen is
            now a page-level browser toggle in the Masthead, not a CSS-based
            graph-only fullscreen. The graph stays its normal size in both
            states; the user just gets more vertical viewport from the
            browser when fullscreen is active. */}

        {/* Evidence drawer */}
        <V03_EvidenceDrawer ev={selectedEvObj} onClose={()=>setSelectedEv(null)} />
      </div>

      {/* Below-graph sections — always rendered (page-fullscreen is
          scrollable, the user can read past the graph). */}
      <>
        {/* SANITY CHECK (Grok comparison) — now the first analysis section */}
        <V03_ExternalComparison />

        {/* ATTRIBUTION READOUT — explains distribution + promotion gates */}
        <V03_AttributionReadout distribution={tp.distribution} raw_scores={tp.raw_scores} />

        {/* V03_LIMITS */}
        <V03_LimitsSection />
      </>
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
// Right-column nodes — one per storyline (or process subclaim), mirrors the
// panel's distribution. No candidate-level expansion: reconstructions are the
// user-facing layer, candidates are implementation detail.
// Storyline buckets — v0.5 protocol §2.6 family + variant structure.
// α is now a FAMILY containing two variants (NATO-broad / CIA-narrow);
// at the family level all five buckets are mutex; variants under α are
// conditional sub-distributions (P(variant | α)). δ is L2-gated rather
// than softmax-low — the 0% reflects structural causal exclusion, not
// low evidence.
//
// Numbers updated from v0.4's flat softmax to v0.5's family/variant
// renormalization:
//   α (Ukrainian-military-led family) 70.52% → variants 57 / 43
//   μ (Institutional avoidance)       14.70%   ← moved from parallel
//                                                 subclaim into main
//                                                 distribution: "no
//                                                 institutionally
//                                                 accountable actor" is
//                                                 a valid answer to
//                                                 "who did it"
//   ε (Unenumerated coordinator)       6.30%
//   β (US-led operation)               5.77%
//   ζ (UK-led layer)                   2.72%
//   δ (Russian self-sabotage)          0%       L2-gated
const BUCKETS_V04 = [
  { id:"alpha", glyph:"α", label:"Ukrainian military-led",
    flag:"C2b", coverageOverride:0.7052,
    members:["C2b","C2a","C2c"], expandable:false,
    // Variant-level conditional sub-distribution under the α family.
    // Each variant.conditional is P(variant | α) and they sum to 1.
    variants: [
      { id:"alpha_nato",
        label:"with NATO-broad enabling",
        flag:"C2b",
        conditional:0.57,
        note:"Ukrainian military execution + tacit multi-state Western enabling (CIA + UK + Polish protection chain)." },
      { id:"alpha_cia",
        label:"with CIA-narrow enabling",
        flag:"C2b",
        conditional:0.43,
        note:"Ukrainian military execution + narrow CIA-only enabling (Hersh-style attribution, no broader NATO chain)." },
    ],
    overlap:"Family-level mutex with β, ε, ζ, μ. Variants below are conditional probabilities (sum to 100% within α)." },
  { id:"mu", glyph:"μ", label:"Institutional avoidance",
    flag:"C_insufficient", coverageOverride:0.147,
    members:["C_insufficient"], expandable:false,
    overlap:"A valid answer to 'who did it': no actor is institutionally accountable. Held up by the Third-Party Rule, UN abstentions, and the Polish EAW procedural failure. Will collapse if any anchored adjudicator (BGH) issues an attributing ruling." },
  { id:"epsilon", glyph:"ε", label:"Unenumerated coordinator",
    flag:"C_unknown", coverageOverride:0.063,
    members:["C6","C_unknown"], expandable:false,
    overlap:null },
  { id:"beta", glyph:"β", label:"US-led operation",
    flag:"C7", coverageOverride:0.0577,
    members:["C7"], expandable:false,
    overlap:null },
  { id:"zeta", glyph:"ζ", label:"UK-led layer",
    flag:"C5", coverageOverride:0.0272,
    members:["C5"], expandable:false,
    overlap:null },
  { id:"delta", glyph:"δ", label:"Russian self-sabotage",
    flag:"C4", coverageOverride:0.00,
    members:["C4"], expandable:false, ruledOut:true, l2Gated:true,
    overlap:"Causally excluded under Pearl L2: Andromeda forensic chain (F7) places execution platform, Sachs's UN enumeration (E25) names seven Western actors and explicitly excludes Russia. δ is not a low-probability candidate — it is structurally outside the live distribution." },
];

// Note on excluded candidates not in this list:
// C1 (Hersh's US-direct version) and C3 (independent rogue operators) are
// candidates that do not map to any storyline. They are structurally ruled
// out by physical/forensic evidence — see STRUCTURAL_EXCLUSIONS_V04 for full
// audit trail. They are omitted from the right-column view because they add
// no user-facing meaning (no storyline lands there).

function bucketWeight(bucket, distribution) {
  // Storyline-aligned buckets carry a narrative-fitted coverage that is NOT
  // the sum of candidate weights (storylines are reconstructions, not
  // candidate aggregations). Use override when present; fall back to sum.
  if (bucket.coverageOverride != null) return bucket.coverageOverride;
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

// Post-aggregation distribution — v0.4.2 (attribution claim only).
// C1/C3/C4 structurally excluded (weight 0 by construction per §2.5.4 Step 1);
// C_insufficient moved out of attribution into a parallel process subclaim
// (μ in the storyline space). Scaling factor 1.404 applied after exclusion
// & subclaim separation: 100 / (100 - 15.3 - 13.6) ≈ 1.404.
// Process subclaim: μ = 1.0 (sole answer), 13.6% of total evidence corpus.
const DISTRIBUTION_V04 = {
  C2b: 0.470,
  C7: 0.094,
  C2c: 0.090,
  C2a: 0.088,
  C_unknown: 0.088,
  C5: 0.087,
  C6: 0.081,
  C1: 0.0,
  C3: 0.0,
  C4: 0.0,
  // C_insufficient routed to process subclaim — see PROCESS_SUBCLAIM_V042
};

// Process subclaim (v0.4.2) — parallel to attribution; not commensurate with
// attribution percentages. UI may render this as a separate axis when ready.
const PROCESS_SUBCLAIM_V042 = {
  candidates: { mu: 1.0 },
  evidenceShareOfCorpus: 0.136,
  note: "13.6% of total evidence edges (reveals_suppression labels) feed this subclaim rather than the attribution claim. μ is the sole answer.",
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

// Evidence source URLs — primary news / court / UN article URLs for evidence
// items that have one. Extracted from build_v05_full.py + v05-demo.json.
// E-IDs not in this map render the source line as plain text (no redirect).
const EVIDENCE_SOURCE_URLS = {
  E14: "https://wiadomosci.wp.pl/nie-przyznaje-sie-do-wysadzenia-nord-stream-sad-uwalnia-nurka-to-byla-wojna-sprawiedliwa-7211784822815712a",
  E17: "https://www.bundesgerichtshof.de/SharedDocs/Entscheidungen/DE/Strafsenate/3_StS/2025/StB__60-25.pdf",
  E21: "https://www.rp.pl/przestepczosc/art43194881-wolodymyr-zurawlow-nie-zostanie-wydany-niemcom-sad-uchylil-areszt",
  E22: "https://tvn24.pl/polska/reaguja-na-decyzje-sadu-w-sprawie-podejrzanego-o-wysadzenie-nord-stream-st8705218",
  E23: "https://thehill.com/opinion/energy-environment/4726844-trumps-nord-stream-2-disaster/mlite/",
  E24: "https://www.tagesspiegel.de/internationales/nach-staatsterrorismus-vorwurf-regierung-in-polen-weist-jede-verwicklung-an-nord-stream-sabotage-zuruck-12209846.html",
  E25: "https://press.un.org/en/2023/sc15206.doc.htm",
  E26: "https://www.svt.se/nyheter/inrikes/sverige-vantas-ta-enklaste-vagen-ut-fran-nord-stream-harvan",
  E27: "https://www.svt.se/nyheter/inrikes/svenska-utredningen-av-nord-stream-sabotaget-laggs-ner",
  E28: "https://www.dr.dk/nyheder/indland/ekspert-undrer-sig-over-svensk-argument-stoppe-efterforskning-af-nord-stream",
  E29: "https://www.pravda.com.ua/eng/news/2026/02/19/8021774/",
  E30: "https://www.t-online.de/nachrichten/ausland/internationale-politik/id_100140202/nord-stream-explosion-sechs-verdaechtige-eine-yacht-und-verraeterische-spuren-.html",
  E31: "https://www.ilfattoquotidiano.it/2025/11/10/sabotaggio-nord-stream-il-wall-street-journal-rilancia-linchiesta-tedesca-coinvolto-lex-generale-ucraino-zaluzhny/8190836/",
  E32: "https://www.t-online.de/nachrichten/deutschland/innenpolitik/id_100140234/nord-stream-was-die-bundesregierung-wirklich-weiss-und-warum-sie-schweigt.html",
  E33: "https://www.securitycouncilreport.org/whatsinblue/2024/10/the-nord-stream-incident-open-briefing.php",
  E34: "https://www.t-online.de/nachrichten/deutschland/innenpolitik/id_100140234/nord-stream-was-die-bundesregierung-wirklich-weiss-und-warum-sie-schweigt.html",
  E35: "https://www.rp.pl/przestepczosc/art43194881-wolodymyr-zurawlow-nie-zostanie-wydany-niemcom-sad-uchylil-areszt",
  E36: "https://www.dr.dk/nyheder/indland/ekspert-undrer-sig-over-svensk-argument-stoppe-efterforskning-af-nord-stream",
  E37: "https://www.nrk.no/norge/skyggekrigen_-radiomeldinger-avslorer-russisk-skip-over-sprengte-nord-stream-gassror-1.16390302",
  E38: "https://uk.news-pravda.com/ukraine/2026/04/17/138374.html",
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
    body: (
      <>
        <div style={{
          fontFamily:"'Fraunces', serif", fontStyle:"italic",
          fontSize: 13, color: "#1A1A1A", lineHeight: 1.4,
          marginBottom: 8,
        }}>
          Reliability of the source for this type of claim — not whether the claim is true.
        </div>
        <div>
          State media can score high on the fact that a press conference happened, even when its framing deserves adversarial caveats.
        </div>
      </>
    ),
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
// TIMELINE (v0.4) — key events on the case timeline, with per-point
// distribution over the 11-candidate space.
//
// Distributions are generated by linear interpolation between a uniform
// baseline (all candidates equal before any evidence) and DISTRIBUTION_V04
// (post-aggregation final state). Each timepoint carries a `progress` value
// 0..1 that places it on that interpolation curve; turning points (marked in
// TURNING_POINTS_V04) correspond to larger progress jumps. When Mian's real
// aggregation engine produces per-timepoint distributions, the bodies of
// distAt / rawAt below can be replaced without touching the timeline shape.
// ============================================================================

const UNIFORM_V04 = Object.fromEntries(
  CAND_ORDER_V04.map(c => [c, 1 / CAND_ORDER_V04.length])
);

function distAtV04(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const out = {};
  let sum = 0;
  for (const c of CAND_ORDER_V04) {
    const a = UNIFORM_V04[c];
    const b = DISTRIBUTION_V04[c] ?? 0;
    out[c] = a + (b - a) * p;
    sum += out[c];
  }
  // normalize (small drift from rounding)
  for (const c of CAND_ORDER_V04) out[c] /= sum;
  return out;
}

function rawAtV04(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const out = {};
  for (const c of CAND_ORDER_V04) {
    out[c] = (RAW_SCORES_V04[c] ?? 0) * p;
  }
  return out;
}

const TIMELINE_V04 = [
  { tag:"v4t0",  label:"Rupture",     date:"2022-09-26", desc:"Pipelines detonate — baseline uncertainty",           n_evidence: 0, progress: 0.00 },
  { tag:"v4t1",  label:"Hersh",       date:"2023-02-08", desc:"Hersh Substack + WH denial",                          n_evidence: 2, progress: 0.08 },
  { tag:"v4t2",  label:"NYT",         date:"2023-03-07", desc:"NYT pro-Ukrainian group",                             n_evidence: 3, progress: 0.14 },
  { tag:"v4t3",  label:"Andromeda",   date:"2023-04-15", desc:"Yacht Andromeda forensic link",                       n_evidence: 5, progress: 0.42 },
  { tag:"v4t4",  label:"Spiegel/CIA", date:"2023-06-15", desc:"Der Spiegel multilingual + CIA June warning surfaces",n_evidence: 8, progress: 0.52 },
  { tag:"v4t5",  label:"SE/DK close", date:"2024-02-26", desc:"Sweden & Denmark close investigations",               n_evidence:12, progress: 0.58 },
  { tag:"v4t6",  label:"Zaluzhnyi",   date:"2024-08-14", desc:"Zaluzhnyi knowledge narrative (WSJ)",                 n_evidence:18, progress: 0.76 },
  { tag:"v4t7",  label:"IT arrest",   date:"2025-08-21", desc:"Serhii Kuznetsov arrested in Rimini",                 n_evidence:25, progress: 0.84 },
  { tag:"v4t8",  label:"PL refuses",  date:"2025-10-17", desc:"Poland refuses extradition; Łubowski ruling",         n_evidence:30, progress: 0.90 },
  { tag:"v4t9",  label:"BGH ruling",  date:"2025-12-10", desc:"BGH: 'foreign government intelligence agency'",       n_evidence:34, progress: 0.97 },
  { tag:"v4t10", label:"Today",       date:"2026-04-22", desc:"Present state",                                       n_evidence:37, progress: 1.00 },
].map(pt => ({ ...pt, distribution: distAtV04(pt.progress), raw_scores: rawAtV04(pt.progress) }));

const TURNING_POINTS_V04 = {
  v4t3: { reason: "First forensic evidence links operators to Ukraine.",
          detail: "Andromeda yacht — HMX residue, DNA, fingerprints. Cross-jurisdictional access by German/Polish/Italian courts makes systemic fabrication implausible. Ukrainian-military storylines gain coherence.",
          delta: "+8.2" },
  v4t6: { reason: "Military-vs-presidential authorization separates.",
          detail: "Zaluzhnyi named. The 'Ukrainian' attribution is no longer one undifferentiated candidate — it splits into presidential, military, and agency variants. The CIA 'not opposed' record becomes compatible with α.",
          delta: "+6.1" },
  v4t9: { reason: "BGH ruling formalizes state authorship.",
          detail: "Federal Court of Justice: 'foreign government intelligence agency' — deliberate non-naming, but legally binding state attribution. Judicial authority survives three years of cross-jurisdictional forensic review.",
          delta: "+7.4" },
};

const UNDERSTANDING_V04 = {
  v4t0:  { head: "A major pipeline attack with no named actor, no claim, no indictments." },
  v4t1:  { head: "A single anonymous US-attribution allegation meets a predictable same-day denial." },
  v4t2:  { head: "Attention pivots from US to a 'pro-Ukrainian group' — still on anonymous-source reporting." },
  v4t3:  { head: "Physical forensics link the yacht Andromeda to the operation — Ukrainian operators come into view." },
  v4t4:  { head: "CIA warned Germany in advance; Der Spiegel's multilingual reporting cross-corroborates the chain." },
  v4t5:  { head: "Scandinavian investigations close without attribution. Institutional silence becomes its own signal." },
  v4t6:  { head: "Zaluzhnyi named. Ukraine's military-vs-presidential split becomes a structural distinction." },
  v4t7:  { head: "Italy arrests Serhii Kuznetsov — the first named operator physically identified." },
  v4t8:  { head: "Poland refuses extradition. Procedural non-execution now spans five jurisdictions." },
  v4t9:  { head: "BGH formally classifies as state-authored intelligence action — state authorship in law, without naming the state." },
  v4t10: { head: "Zaluzhnyi-led Ukrainian military, Polish complicity, US awareness." },
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
    coverage: 0.70,
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
    coverage: 0.19,
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
    id: "beta",
    kind: "event_sequence",
    label: "US-led operation with Ukrainian execution",
    shortLabel: "US-led operation",
    coverage: 0.05,
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
    coverage: 0.0,
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
  {
    id: "zeta",
    kind: "under_examined",
    label: "UK-layer role, under-examined",
    shortLabel: "UK — under-examined, not adjudicated",
    coverage: 0.06,
    isHero: false,
    claim: "Three independent signals place the UK in the attribution space without converging on a specific role. Previous v0.4 absorbed these signals into β's 'possible co-principal' slot; the 'least refuted' discipline separates them because the question they raise is not refuted, only under-examined.",
    overlaySummary: "Three independent sources — Truss's reported 'it's done' SMS to Blinken, SVR Director Naryshkin's formal naming of US and UK, and Sachs's UN enumeration placing UK among seven Western actors — all place the UK in the attribution space. Each is individually weak: Truss's SMS has sourcing-chain issues, Naryshkin is adversarial-first-party, Sachs is derived analysis. But the sources are independent of each other, and no piece of v0.4 evidence rules UK involvement out. Under 'least refuted' discipline, a question that has not been disproved should not be collapsed into an adjacent storyline.",
    narrative: "Under the v0.4 original reading, the UK was an element of β — a 'possible co-principal' to the US-led operation. Under v0.4.1 'least refuted' discipline, that framing breaks: β's US-as-principal version is structurally excluded, and the UK signals do not automatically re-anchor to the new β′ (Western coordination, principal unclear). They raise their own question. Three independent signals: Liz Truss, then UK Prime Minister, reportedly SMSed Antony Blinken 'it's done' hours after the detonation — a signal whose event-credibility exceeds its content-credibility and which arrives through multiple independent retellings with some variation in exact wording. Sergei Naryshkin, Director of Russia's SVR foreign intelligence service, has formally accused the US and UK of direct involvement — his event-credibility is maximal (he said it, on record, through RT Arabic) but his content-credibility is bounded by strategic interest as an adversarial-first-party source. Jeffrey Sachs, in his February 2023 UN Security Council speech, enumerated seven Western actors as plausibly implicated: US, UK, Poland, Norway, Germany, Denmark, Sweden — placing UK explicitly on the attribution list and excluding Russia. Sachs carries academic authority but offers derived analysis, not direct evidence. None of these is individually dispositive. What matters is: (1) the sources are independent of each other — there is no single ecosystem generating the UK signal; (2) no piece of v0.4 evidence rules UK involvement out, at any layer; (3) the volume of UK-specific reporting is dramatically lower than the volume of Ukrainian-specific or US-specific reporting, which under propaganda-corrected reading is not a reason to dismiss the UK question — it may be a reason to examine it more carefully. ζ does not claim UK involvement. It claims that the current exhibit has not adjudicated UK involvement, and that the question deserves its own storyline rather than being absorbed into β′.",
    narrativeTimeline: [
      { date: "Sep 26, 2022", label: "Truss 'it's done' SMS (day-of)",
        body: "Reported SMS from UK PM Truss to US Sec. State Blinken on the day of detonation. Event-cred 0.75, content-cred 0.30, net 0.45. Part of the exhibit but not dispositive. Present in β′'s possible-co-enabler reading; ζ preserves it independently." },
      { date: "Feb 21, 2023", label: "Sachs at UN enumerates UK among seven",
        body: "Columbia economist and former UN advisor Jeffrey Sachs, at UN Security Council session, enumerates plausible Western actors and excludes Russia. UK is named in the list but no specific role is attributed." },
      { date: "Oct 21, 2025", label: "Naryshkin formal naming of US and UK",
        body: "SVR Director in formal statement on RT Arabic accuses US and UK of direct involvement. Event-cred high (he said it, position-appropriate forum); content-cred bounded by adversarial-first-party status." },
      { date: "Throughout 2022–2026", label: "Absence of UK investigation",
        body: "No UK parliamentary inquiry. No UK judicial proceeding. No UK intelligence community leak. The question is not refuted; it is simply not examined from UK side." },
      { date: "Structurally", label: "What would collapse ζ",
        body: "Three paths: (a) UK parliamentary inquiry findings; (b) a UK intelligence community whistleblower account; (c) independent forensic evidence placing UK-specific operators or materiel at the site. Any one would either refute ζ (moving its weight into β′ or ε) or confirm a more specific role (moving its weight out of ζ into a newly-specific storyline)." },
    ],
    roleAttribution: {
      kind: "under_examined_question",
      headline: "A question the exhibit has not adjudicated — not a reconstruction of events.",
      roles: [
        { role: "Possible co-enabler or co-executor", actor: "United Kingdom", flag: "GB",
          weight: 0.06,
          gloss: "Three independent signals (E27, E28, E25). Volume low; no piece of evidence rules out; no piece of evidence confirms. Under-examined, not adjudicated." },
      ],
    },
    accommodates: [],
    supportingEv: ["E25", "E27", "E28"],
    challengedBy: [],
    unexplained: "UK role cannot be adjudicated under current evidence. The question has been absorbed into β's 'possible co-principal' slot in v0.4 original, but that absorption collapses an under-examined question into a broader storyline. ζ preserves the question as its own line-item so it does not get lost in β′'s coordination framework.",
    sourceFromCandidates: "Two-thirds of C5 UK (5.8%) + residual wider-coordination signal (0.2%) ≈ 6%. ζ is a v0.4.1 storyline surfacing a question previously absorbed into β. Scaled by 1.404 under attribution-only distribution."
  },
];

// ============================================================================
// SUBCLAIM μ — separate claim space: "Why has the attribution question not
// been institutionally closed?" Previously in STORYLINES, moved out in v0.4.2
// because it was answering a different question than α/β/ε/ζ/δ.
// Evidence share in the overall corpus: 13.6% (C_insufficient edges).
// Within this subclaim, μ is the single answer — coverage 100%.
// ============================================================================

const SUBCLAIM_MU_V04 = {
  id: "mu",
  kind: "process_subclaim",
  parentClaim: "Who attacked the Nord Stream pipelines on 26 September 2022?",
  subclaimQuestion: "Why has this attribution question not been institutionally closed?",
  label: "Avoidance as a stance",
  shortLabel: "Collective non-resolution",
  evidenceShare: 0.136,          // 13.6% of total evidence addresses this subclaim
  coverageWithinSubclaim: 1.00,  // μ is the only answer in the subclaim space
  claim: "Five jurisdictions and one international body each had the capacity to advance the attribution question. Each chose not to. Consistent non-advancement is itself evidence — not about the perpetrator, but about the political status of the event.",
  overlaySummary: "The question does not close because no institution with the power to close it has chosen to. Sweden and Denmark shut their investigations; Germany's government invokes the Third Party Rule while its courts prosecute; Poland shields the operators; the UN Security Council abstains the issue away. Avoidance as a coordinated stance. μ does NOT compete with α/β/ε/ζ for weight — it answers a different question, and is surfaced in its own subclaim panel accordingly.",
  narrative: "Three and a half years after the blasts, the institutions with the capacity to resolve what happened have — each for its own reasons — chosen not to. Sweden closed its investigation by citing a jurisdictional doctrine a Danish legal scholar publicly disputes. Denmark followed within weeks, and its own Defence Academy experts report being barred from public discussion. The German judiciary proceeded: warrants issued, Kuznetsov indicted, the BGH ruling on a \"foreign government intelligence agency.\" The German government simultaneously invoked the Third Party Rule to keep intelligence-sharing details out of parliamentary inquiry. Poland did not execute the German European Arrest Warrant when Zhuravlev was on its territory, and Polish courts later categorized the act as \"organized action by services of a warring state\" — a judicial frame bordering on legitimation. Italy's Court of Cassation reversed itself three times on the same extradition question within six weeks. At the UN Security Council, a resolution for independent international investigation was buried — not by vetoes, but by twelve abstentions. Meanwhile, on the record: an ex-BND chief names Polish authorization and both presidents' approval; a prominent academic enumerates seven Western states at the UN and explicitly excludes Russia; a Swedish prosecutor publicly describes his own investigation as \"a battlefield for influence operations.\" The story this subclaim tells is not about a perpetrator. It is about a configuration in which every actor with the power to resolve the question finds non-resolution cheaper than resolution — and in which the specific voices that speak through the gaps are specifically the ones without that calculus to make.",
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
  supportingEv: ["E8","E9","E19","E31","E32","E33","E34","E35"],
  challengedBy: ["E17","E19"],
  unexplained: "Why does the German judicial layer (BGH prosecutes, ruling names 'foreign intelligence agency') diverge from the German government layer (Chancellor's Office invokes Third Party Rule)? μ describes a system-wide avoidance, but the system is internally split — and that split is itself part of the exhibit.",
};

// ============================================================================
// SUB-CLAIM DECOMPOSITION (v0.4) — for the lead storyline
// Each sub-claim has its own weight in the storyline's shape, and enumerates
// the alternative branches it could take. Likelihoods within one sub-claim
// sum to 1.0; weights across sub-claims sum to 1.0.
// ============================================================================

const SUBCLAIMS_V04 = {
  storylineId: "alpha",
  storylineLabel: "Ukraine — state-directed (Zaluzhnyi track)",
  // Sub-claims are ordered: load-bearing first (by weight desc), then
  // decorative (by weight desc). Letters A–F follow this order so the top of
  // the list is where the storyline's structural load sits.
  subclaims: [
    {
      letter: "A",
      name: "Executor identity",
      weight: 0.30,
      role: "load",
      branches: [
        { text: "Ukrainian military / former-military personnel", likelihood: 0.87, isCurrent: true },
        { text: "US Navy divers via BALTOPS-22 (Hersh account)", likelihood: 0.06 },
        { text: "Anglo-American professional saboteurs (Naryshkin account)", likelihood: 0.04 },
        { text: "Russian self-sabotage", likelihood: 0.03 },
      ],
    },
    {
      letter: "B",
      name: "Authorization level",
      weight: 0.22,
      role: "load",
      branches: [
        { text: "Zaluzhnyi-level approval; Zelensky not informed", likelihood: 0.62, isCurrent: true },
        { text: "Zelensky approved then revoked; operation proceeded anyway", likelihood: 0.18 },
        { text: "SBU-directed with military execution layer", likelihood: 0.12 },
        { text: "Independent rogue operators, no state authorization", likelihood: 0.08 },
      ],
    },
    {
      letter: "C",
      name: "Institutional non-advancement",
      weight: 0.18,
      role: "load",
      branches: [
        { text: "Five jurisdictions + UN chose non-resolution; pattern is political, not forensic", likelihood: 0.83, isCurrent: true },
        { text: "Each jurisdiction's non-advancement is independent, not coordinated", likelihood: 0.17 },
      ],
    },
    {
      letter: "D",
      name: "Polish role",
      weight: 0.12,
      role: "decor",
      branches: [
        { text: "Tacit facilitation — territorial / procedural cover, short of formal participation", likelihood: 0.72, isCurrent: true },
        { text: "Post-hoc alignment only; no advance coordination", likelihood: 0.20 },
        { text: "Active co-participation at state level", likelihood: 0.08 },
      ],
    },
    {
      letter: "E",
      name: "CIA foreknowledge & timing",
      weight: 0.10,
      role: "decor",
      branches: [
        { text: "Knew early; initially unopposed; later tried to stop and failed", likelihood: 0.55, isCurrent: true },
        { text: "Knew early and actively enabled throughout", likelihood: 0.22 },
        { text: "Received only late-stage warning, tried genuinely to stop", likelihood: 0.15 },
        { text: "Fully unaware until after the fact", likelihood: 0.08 },
      ],
    },
    {
      letter: "F",
      name: "Funding source",
      weight: 0.08,
      role: "decor",
      branches: [
        { text: "Private Ukrainian citizen (~$300,000)", likelihood: 0.48, isCurrent: true },
        { text: "State-routed via private intermediary as cover", likelihood: 0.35 },
        { text: "Direct military budget allocation", likelihood: 0.17 },
      ],
    },
  ],
};

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
  paperGlass: "rgba(250, 248, 243, 0.97)",
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
  if (c === "C_excluded") return "#9C9685"; // muted audit tone
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
    case "C_excluded":
      // Audit visual — diagonal hatching to signal "this is a structurally
      // excluded band, not an actor". Renders the same regardless of which
      // specific candidate is being represented (C1 / C3 / C4).
      return (
        <svg width={w} height={h} viewBox="0 0 16 11" style={{ flexShrink: 0, display:"block" }}>
          <defs>
            <pattern id="hatch-excl" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3" stroke={colors.inkMute} strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="16" height="11" fill="url(#hatch-excl)" opacity="0.5"/>
          <rect x="0" y="0" width="16" height="11" fill="none" stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="8" cy="5.5" r="3" fill="none" stroke={colors.inkMute} strokeWidth="0.9"/>
          <line x1="6" y1="3.5" x2="10" y2="7.5" stroke={colors.inkMute} strokeWidth="0.9"/>
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
  newEvIds,
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
  // open cluster drawer (drilldown into cluster summary + members)
  setClusterDrawerId,
}) {
  const isV04 = mode === "v04";
  const svgRef = useRef(null);
  // tipData: when a storyline bucket row with overlap content is
  // hovered, store its data here. Renders via portal so the tooltip
  // can extend ABOVE the SVG bounds (into the masthead area) without
  // being clipped by the wrapper's overflow:hidden.
  const [tipData, setTipData] = useState(null);
  useEffect(() => {
    if (!hoverCand) setTipData(null);
  }, [hoverCand]);

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

  // Layout: in v0.3 the right-side candidate column lays out the % VERTICALLY
  // under the label, so RIGHT_X = 0.75·width works comfortably. In v0.4 the
  // right-side bucket row also lays out vertically now, with the % anchored
  // beneath the label, so the column needs ~200px right of RIGHT_X for the
  // longest label.
  //
  // Content shifted right (Apr 2026): the previous 0.30/0.66 left a ~240px
  // dead band on the right side of the SVG. Bumping by +0.10·width
  // (LEFT_X → 0.40, RIGHT_X → 0.76) right-justifies the graph: more
  // breathing room between the Current Understanding panel and the
  // evidence column on the left, less wasted space on the right. The
  // edge span (RIGHT_X − LEFT_X) is preserved so connection lines look
  // unchanged.
  const LEFT_X = isV04 ? width * 0.40 : width * 0.22;
  const RIGHT_X = isV04 ? width * 0.76 : width * 0.75;

  // v0.3-style fixed proportional layout: TOP and BOT mark the evidence/candidate band.
  // Evidence and candidates are distributed proportionally inside [TOP, BOT], so density
  // adjusts to row count without the stage ever growing past the container.
  // BOT pulled in a bit further than v0.3 to leave room for the timeline overlay
  // panel that floats at the bottom — otherwise the last bucket row gets occluded.
  // Vertical band [TOP, BOT] for rows. After we removed the static SVG
  // column headers, there's unused space at the top of the band; we also
  // pull BOT in so the last evidence row ends at roughly the same y as
  // the Current Understanding panel's bottom (panel.bottom = 80 from
  // container bottom). This gives the last evidence row the same
  // "breathing space before the timeline" the panel has — about a
  // third of the gap that an earlier 0.85/120 pairing produced.
  const TOP = Math.round(height * 0.04);
  const BOT = Math.round(height * 0.90);
  // Storyline rows use a tighter band so μ's caption (which renders 44px
  // below the row's y) doesn't crash into the timeline at the bottom.
  const candBOT = isV04 ? BOT - 50 : BOT;

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
    // v0.5 protocol §2.6: families sort by their family-level coverage;
    // L2-gated buckets (δ) move to a tail section; under each family,
    // its variants render as indented child rows immediately after.
    // Visual order: live families desc by weight → L2-gated tail.
    const live = BUCKETS_V04.filter(b => !b.l2Gated && !b.routedTo);
    const subclaim = BUCKETS_V04.filter(b => b.routedTo);
    const gated = BUCKETS_V04.filter(b => b.l2Gated);
    const liveSorted = [...live].sort((a,b)=> bucketWeight(b, distribution) - bucketWeight(a, distribution));

    [...liveSorted, ...subclaim, ...gated].forEach(b => {
      const w = bucketWeight(b, distribution);
      candRows.push({
        id: b.id, isBucket: true, parentBucket: null,
        label: b.label, color: candColorForStory(b.id) || candColor(b.flag),
        glyph: b.glyph, flag: b.flag,
        members: b.members, weight: w, indent: 0,
        expandable: false, overlap: b.overlap,
        routedTo: b.routedTo,
        ruledOut: b.ruledOut,
        l2Gated: b.l2Gated,
        hasVariants: !!(b.variants && b.variants.length),
      });
      // Expand variants (always shown — Plan A nested two-tier).
      // Variant weight = family_weight * conditional. We store BOTH the
      // conditional (for "57% of α" labeling) and the absolute (for
      // proportional ring sizing / edge weight resolution if needed).
      if (b.variants && b.variants.length && !b.l2Gated) {
        b.variants.forEach(v => {
          candRows.push({
            id: v.id, isBucket: true, parentBucket: b.id,
            label: v.label,
            color: candColorForStory(b.id) || candColor(v.flag),
            glyph: null, flag: v.flag,
            members: [], weight: w * v.conditional, indent: 1,
            expandable: false,
            isVariant: true,
            conditional: v.conditional,
            note: v.note,
            familyWeight: w,
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

  // Candidate Y coords — proportional distribution across [TOP, BOT].
  // For v0.4: leave a small extra gap before μ (subclaim) so it visually
  // separates from the attribution storylines, but stay in the same column.
  // The "different question" framing is conveyed by μ's own row caption,
  // not by section headers or dividers.
  // v0.5 row distribution: variants are compact sub-rows (0.65 slot
  // weight) so they pack visually under their parent family. L2-gated
  // bucket(s) get a 1.5-slot gap before them so they read as a separate
  // "structurally excluded" tail rather than just another low-% row.
  const candY = {};
  if (nCandRows > 0) {
    if (isV04) {
      // Compute per-row slot weight, then accumulate offsets.
      const slotWeights = candRows.map(r => {
        if (r.isVariant) return 0.85;        // sub-row, but with enough
                                             // vertical room for the
                                             // flag + label + "of α"
                                             // tspan to clear the next
                                             // variant cleanly
        return 1.0;                          // family / standalone bucket
      });
      // Insert pre-gap before any L2-gated row (visual separator).
      // We track this as additional offset, NOT as an extra slot.
      const preGap = candRows.map(r => r.l2Gated ? 0.8 : 0);
      // Total span in slot-units
      const totalSlots = slotWeights.reduce((s, w) => s + w, 0)
                       + preGap.reduce((s, w) => s + w, 0);
      const totalH = candBOT - TOP;
      const slotPx = totalH / Math.max(1, totalSlots - slotWeights[slotWeights.length - 1]);
      let acc = 0;
      candRows.forEach((r, i) => {
        acc += preGap[i];
        candY[r.id] = TOP + acc * slotPx;
        acc += slotWeights[i];
      });
    } else {
      candRows.forEach((r, i) => {
        candY[r.id] = TOP + (BOT - TOP) * (i / Math.max(1, nCandRows - 1));
      });
    }
  }

  // Evidence Y coords — same proportional model
  const evY = {};
  if (nEvRows > 0) {
    evRows.forEach((r, i) => {
      evY[r.id] = TOP + (BOT - TOP) * (i / Math.max(1, nEvRows - 1));
    });
  }

  // Focus = clicked evidence OR hovered evidence. selectedEv takes
  // precedence (since clicking opens the drawer and the user is in
  // examination mode), but hoverEv works as a transient preview.
  const selectedEvObj = (isV04 ? EVIDENCE_V04 : EVIDENCE_V03).find(e => e.id === selectedEv);
  const hoverEvObj = hoverEv
    ? (isV04 ? EVIDENCE_V04 : EVIDENCE_V03).find(e => e.id === hoverEv)
    : null;
  // Use hover as fallback for highlight context (no drawer needed).
  const focusEvObj = selectedEvObj || hoverEvObj;

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

  const selectedSupports = focusEvObj ? new Set(focusEvObj.edges.filter(e=>(e.pol||0)>0).map(e=>e.to)) : null;
  const selectedOpposes  = focusEvObj ? new Set(focusEvObj.edges.filter(e=>(e.pol||0)<0).map(e=>e.to)) : null;
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
    <>
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="xMidYMid meet"
         style={{ width:"100%", height:"100%", display:"block" }}>
      {/* Column counts moved to the Masthead metadata bar — the static
          "EVIDENCE · 13 ITEMS + 9 CLUSTERS" / "5 STORYLINES + μ SUBCLAIM"
          headers were redundant with the case-file metadata. The graph's
          column structure is self-evident from the rows themselves.
          We keep one contextual indicator: when a storyline is focused
          (user clicked a card), show its name above the evidence column
          so the reader knows what the filter currently is. */}
      {focusStorylineObj && (
        <text x={LEFT_X} y={20}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11" letterSpacing="1.4" fill={colors.inkMute} textAnchor="start">
          STORYLINE FILTER · {focusStorylineObj.shortLabel.toUpperCase()}
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

          // Cluster participates in the focus system: hovering the cluster
          // highlights the conclusions it aggregates into.
          const isFocusCluster = (selectedCluster === cl.id) || (focusEv === cl.id);
          const anyFocus = focusEv || hoverCand || selectedCluster;

          return Object.entries(aggEdges).map(([to, agg], i) => {
            const y2 = resolveCandidateY(to);
            if (y2 == null) return null;
            // Edge starts where cluster label text actually ends + 12px gap,
            // matching the rule used by normal evidence rows. Avoid writing
            // a fixed offset (e.g. 180) — that creates uneven gaps across
            // clusters of different label lengths.
            const clusterLabelWidth = measureText(cl.label, 11.5, "Instrument Sans, sans-serif", 400);
            const x1 = LEFT_X + 18 + clusterLabelWidth + 12;
            const x2 = RIGHT_X;
            const net = agg.sumPos - agg.sumNeg;
            const pol = net >= 0 ? 1 : -1;
            // Cluster aggregates multiple evidence edges; coefficient kept
            // restrained so cluster edges don't visually dwarf single-evidence
            // edges. Tuned to match v0.3's overall edge weight register.
            const strokeW = Math.min(2.0, 0.5 + Math.abs(net) * 1.0);
            const stroke = pol > 0 ? resolveCandidateColor(to) : colors.inkMute;
            const dash = pol < 0 ? "3,3" : "";

            const isHoverCand = hoverCand === to
              || (isV04 && hoverCand && BUCKETS_V04.find(b=>b.id===hoverCand && b.members.includes(to)));
            const inFocus = isFocusCluster || isHoverCand;
            const dim = anyFocus && !inFocus;

            const dx = x2 - x1;
            const cx1 = x1 + dx * 0.38;
            const cx2 = x2 - dx * 0.38;
            const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
            return (
              <path key={`${row.id}-${to}`} d={d}
                fill="none" stroke={stroke}
                strokeWidth={inFocus ? strokeW + 1.2 : strokeW}
                strokeDasharray={dash}
                opacity={dim ? 0.06 : (inFocus ? 0.95 : 0.32)}
                style={{ transition:"opacity 0.3s, stroke-width 0.2s" }}/>
            );
          });
        }

        // Normal evidence row
        const ev = row.ev;
        const labelText = ev.label.length > 44 ? ev.label.slice(0,42)+"…" : ev.label;
        // Measure with the non-focus rendered font size (11.5 / weight 400) so
        // the edge starts right after the label text. Using a different size
        // than what's actually rendered creates uneven gaps between text-end
        // and edge-start across different rows.
        const mainLabelWidth = measureText(labelText, 11.5, "Instrument Sans, sans-serif", 400);
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

          let stroke = colors.inkMute, strokeW = 0.6, dash = "";
          if (pol > 0) {
            stroke = resolveCandidateColor(edge.to);
            // v0.4 has ~2× the edge density of v0.3 (69 edges / 37 evidence
            // vs 31 / 16). Single-line stroke is dialed down so the overall
            // visual weight of the edge field matches v0.3.
            strokeW = 0.6 + edge.s * 1.8;
          } else if (pol < 0) {
            stroke = colors.inkMute;
            strokeW = 0.5 + edge.s * 1.2;
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
          // Reverse-trace highlight: when a storyline ring is hovered, any
          // cluster whose member-evidence supports that storyline should
          // light up too. Without this, hovering α (which is supported by
          // SC_WIL "Western intel leaks") would highlight the individual
          // evidence rows but leave the cluster summary node un-stressed,
          // breaking the visual link from storyline → cluster.
          const isFocusByCand = hoverCand && cl.members.some(mid => {
            const ev = getEvidenceBy(mid);
            if (!ev || !ev.edges) return false;
            return ev.edges.some(e => {
              if (e.to === hoverCand) return true;
              const b = BUCKETS_V04.find(b => b.id === hoverCand);
              return b && b.members.includes(e.to);
            });
          });
          const isFocus = isSelected || isFocusByCand;
          const anyFocus = focusEv || hoverCand || selectedCluster;
          const dim = anyFocus && !isFocus;
          const colorToken = cl.color === "warn" ? colors.warn
                           : cl.color === "meta" ? colors.meta
                           : cl.color === "primary" ? colors.primary
                           : colors.inkMute;
          // Derive short display ID from cluster.id, e.g. SC_WIL → E*WIL
          const shortId = "E*" + (cl.id.replace(/^SC_/, ""));
          const labelW = measureText(cl.label, 11.5, "Instrument Sans, sans-serif", 400);
          // Hit area extends from the short-id text on the left, across the
          // ring, label, and chevron. ~340px wide to match label scan width.
          // Without this rect, only the tiny 10px-radius ring received clicks
          // because text elements need pointerEvents:auto to be clickable —
          // simpler is to put a transparent rect under everything.
          const hitX = LEFT_X - 56;
          const hitW = Math.max(360, 18 + labelW + 26);
          return (
            <g key={`cluster-${cl.id}`}
               onMouseDown={(e)=>{
                 e.stopPropagation();
                 // Open the cluster in a drawer (mirrors how single evidence
                 // drills in). User can then toggle inline expansion or open
                 // any individual member from inside the drawer.
                 if (setClusterDrawerId) setClusterDrawerId(cl.id);
               }}
               onMouseEnter={()=>setSelectedCluster(cl.id)}
               onMouseLeave={()=>setSelectedCluster(null)}
               style={{ cursor:"pointer", opacity: dim ? 0.4 : 1, transition:"opacity 0.3s" }}>
              {/* Invisible hit rectangle — covers the whole cluster row so
                  clicking anywhere on the label / chevron / id triggers the
                  drawer. SVG text by default has pointer-events on the glyphs
                  only (not the bounding box), which is too small a hit zone. */}
              <rect x={hitX} y={y - 12} width={hitW} height={24}
                    fill="transparent"/>
              {/* Cluster ring — circular (matches evidence-node shape language) */}
              <circle cx={LEFT_X} cy={y} r={10}
                      fill={colors.paperDeep} stroke={colorToken}
                      strokeWidth={isFocus ? 1.8 : 1}
                      strokeDasharray="2,2" opacity={isFocus ? 1 : 0.85}
                      style={{ pointerEvents:"none" }}/>
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
              {/* Label (right side) */}
              <text x={LEFT_X + 18} y={y + 4}
                    fontFamily="'Instrument Sans', sans-serif"
                    fontSize="11.5"
                    fill={isFocus ? colors.ink : colors.inkSoft}
                    fontWeight={isFocus ? 500 : 400}
                    fontStyle="italic"
                    style={{ pointerEvents:"none" }}>
                {cl.label}
              </text>
              {/* Click affordance — small chevron indicating this opens a drawer. */}
              <text x={LEFT_X + 18 + labelW + 8} y={y + 4}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="9" fill={colorToken}
                    opacity={isSelected ? 1 : 0.55}
                    letterSpacing="0.3"
                    style={{ pointerEvents:"none" }}>
                ▸
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
        // Per-evidence meta (date / credibility / language) intentionally not
        // rendered on the graph — too visually noisy, overlaps adjacent labels.
        // Full meta is available in the evidence drawer on click. Language is
        // signalled visually by the colored flag pill elsewhere in the row.
        const evIdWidth = measureText(ev.id, 12, "JetBrains Mono, monospace", 600) + 6;
        const mainLabelWidth = measureText(labelText, 14, "Instrument Sans, sans-serif", 500) + 8;
        // When this evidence row is the directly-focused one (hovered or
        // clicked, NOT when a connected candidate is hovered), expand the
        // truncated label to show the full text. Limit ONLY to direct
        // focus (isFocusByEv) so reverse-trace highlighting via candidate
        // hover doesn't expand many labels at once.
        const expandLabel = isFocusByEv && ev.label.length > 44;
        const displayLabel = expandLabel ? ev.label : labelText;
        const displayLabelWidth = expandLabel
          ? measureText(ev.label, 12.5, "Instrument Sans, sans-serif", 500) + 8
          : mainLabelWidth;
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
            {/* New-evidence flash ring — appears briefly when this evidence
                just entered the active set (via timeline advance / play). */}
            {newEvIds && newEvIds.has(ev.id) && (
              <>
                <circle cx={LEFT_X} cy={y} r={14}
                        fill="none" stroke={colors.warn}
                        strokeWidth="1.8" opacity={0.9}>
                  <animate attributeName="r" from="5" to="22" dur="1s" fill="freeze"/>
                  <animate attributeName="opacity" from="0.95" to="0" dur="1s" fill="freeze"/>
                  <animate attributeName="stroke-width" from="2.4" to="0.4" dur="1s" fill="freeze"/>
                </circle>
                <circle cx={LEFT_X} cy={y} r={9}
                        fill="none" stroke={colors.warn}
                        strokeWidth="1.6" opacity={0.85}/>
              </>
            )}
            <circle cx={LEFT_X} cy={y}
                    r={isSel ? 8 : 5}
                    fill={isSel ? colors.ink : colors.paper}
                    stroke={newEvIds && newEvIds.has(ev.id) ? colors.warn : colors.ink}
                    strokeWidth={isFocus ? 2 : (newEvIds && newEvIds.has(ev.id) ? 1.6 : 1)}
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
                  fill={isFocus ? colors.ink
                       : (newEvIds && newEvIds.has(ev.id) ? colors.warnDeep : colors.inkSoft)}
                  fontWeight={isFocus ? 600
                            : (newEvIds && newEvIds.has(ev.id) ? 600 : 400)}
                  letterSpacing="0.3">{ev.id}</text>
            {isFocus && (
              <rect x={LEFT_X + 14} y={y - 9}
                    width={displayLabelWidth} height={18}
                    fill={colors.paper} opacity={0.94}/>
            )}
            <text x={LEFT_X + 18} y={y + 4}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={isFocus ? 12.5 : 11.5}
                  fill={isFocus ? colors.ink
                       : (newEvIds && newEvIds.has(ev.id) ? colors.ink : colors.inkSoft)}
                  fontWeight={isFocus ? 500
                            : (newEvIds && newEvIds.has(ev.id) ? 500 : 400)}>
              {displayLabel}
            </text>
            {/* Meta line — date + credibility, mirrors v0.3's two-line
                evidence row pattern. Only shown when the evidence has a
                published date (silence-evidence and synthetic rows skip
                this; the drawer still shows full meta on click).
                Compact: 9pt at y+15 keeps the row within ~22px content
                so 22 rows fit in the BOT-TOP band without crowding. */}
            {ev.published && (
              <text x={LEFT_X + 18} y={y + 15}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="9"
                    fill={colors.inkMute}
                    letterSpacing="0.3"
                    opacity={isFocus ? 1 : 0.7}>
                {ev.published}
                {typeof ev.credibility === "number" && ` · cred ${ev.credibility.toFixed(2)}`}
              </text>
            )}
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
              const metaEndX = LEFT_X + 18 + mainLabelWidth + 10;
              return (
                <g transform={`translate(${metaEndX}, ${y - 4})`}
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
        // v0.4 radius scales with weight but capped — large rings consume too
        // much vertical space and push the bottom row into the timeline panel.
        // Storyline rows: 7-15px; candidate sub-rows: 4-9px.
        const sizeScale = isV04 ? 0.025 : 0.05;
        const baseRad = row.isVariant ? 4 : (row.isBucket ? 7 : 4);
        const maxRad = row.isVariant ? 10 : (row.isBucket ? 15 : 9);
        const radius = Math.min(maxRad, baseRad + v * Math.min(width, height) * sizeScale);
        const dim = (focusEv && !isSupported && !isOpposed)
                 || (hoverCand && hoverCand !== row.id);
        const pctText = `${(v*100).toFixed(1)}%`;
        const isExpanded = row.isBucket && expandedBuckets.has(row.id);
        const indentOffset = row.indent * 28;

        return (
          <g key={`cand-${row.id}`}
             onMouseEnter={()=>{
               setHoverCand(row.id);
               // Push storyline tooltip data on hover — only for
               // bucket rows that have overlap explanatory content.
               if (row.isBucket && row.overlap) {
                 const labelW = measureText(
                   row.label, 12.5,
                   "Instrument Sans, sans-serif",
                   v > 0.15 ? 600 : 500
                 );
                 const badgeX = RIGHT_X + indentOffset + radius + 14 + labelW + 10;
                 const headerLabel = row.l2Gated      ? "Why structurally excluded"
                                   : row.routedTo === "mu" ? "Why parallel axis"
                                   : row.hasVariants  ? "About this storyline family"
                                   : "About this storyline";
                 setTipData({
                   rowId: row.id,
                   badgeX, badgeY: y,
                   headerLabel, body: row.overlap,
                 });
               }
             }}
             onMouseLeave={()=>{
               setHoverCand(null);
               setTipData(null);
             }}
             style={{ cursor: "default",
               opacity: dim ? 0.35 : 1, transition:"opacity 0.3s" }}>
            {/* Invisible hit-rect spanning the row's full horizontal
                extent. Without this, the row's hit area is just the
                union of the ring + flag + text glyphs — leaving small
                gaps between elements where the cursor briefly leaves
                the row's hover state. The rect makes the entire
                row-band a unified hover target so the tooltip stays
                stable as the user moves toward the info badge. */}
            {row.isBucket && (() => {
              const labelW = measureText(
                row.label,
                row.isBucket ? 12.5 : 11,
                "Instrument Sans, sans-serif",
                row.isBucket ? (v > 0.15 ? 600 : 500) : 400
              );
              const hasBadge = !!row.overlap;
              const xStart = RIGHT_X + indentOffset - radius - 4;
              const xEnd = RIGHT_X + indentOffset + radius + 14 + labelW + (hasBadge ? 22 : 4);
              return (
                <rect x={xStart} y={y - 20}
                      width={xEnd - xStart} height={56}
                      fill="transparent"
                      style={{ cursor: "default" }}/>
              );
            })()}

            {row.parentBucket && (() => {
              // L-connector showing the family→variant relationship.
              // Parent is at (RIGHT_X, parentY) with no indent; we are
              // at (RIGHT_X + indentOffset, y) one indent in. Draw a
              // vertical line down from just below the parent ring,
              // then a horizontal stub into our own ring's left edge.
              const parentY = candY[row.parentBucket];
              if (parentY == null) return null;
              const parentRowColor = (() => {
                const pr = candRows.find(r => r.id === row.parentBucket);
                return pr ? pr.color : colors.ruleSoft;
              })();
              const stubX = RIGHT_X + indentOffset - radius - 6;
              const elbowY = y;
              return (
                <g style={{ pointerEvents:"none" }}>
                  <line x1={RIGHT_X} y1={parentY + 12}
                        x2={RIGHT_X} y2={elbowY}
                        stroke={parentRowColor} strokeOpacity="0.35"
                        strokeWidth="1"/>
                  <line x1={RIGHT_X} y1={elbowY}
                        x2={stubX} y2={elbowY}
                        stroke={parentRowColor} strokeOpacity="0.35"
                        strokeWidth="1"/>
                </g>
              );
            })()}

            <circle cx={RIGHT_X + indentOffset} cy={y} r={radius}
                    fill={fill} stroke={cc}
                    strokeWidth={isHover ? 2.4 : (row.isBucket ? 1.6 : 1.0)}
                    strokeDasharray={
                      isOpposed ? "3,2"
                      : (row.ruledOut || row.routedTo ? "3,3" : "")
                    }
                    opacity={isHover ? 1 : (
                      row.ruledOut || row.routedTo ? 0.55
                      : (row.parentBucket ? 0.8 : 0.92)
                    )}
                    style={{ transition:"all 0.4s cubic-bezier(.2,.7,.2,1)" }}/>

            {/* Storyline glyph inside the ring (replaces flag icon for the
                top-level node — flag icons remain on candidate sub-rows). */}
            {row.isBucket && row.glyph && (
              <text x={RIGHT_X + indentOffset} y={y + 4}
                    textAnchor="middle"
                    fontFamily="'Fraunces', serif"
                    fontStyle="italic"
                    fontSize={Math.max(11, radius * 0.7)}
                    fontWeight={500}
                    fill={cc}
                    opacity={row.ruledOut || row.routedTo ? 0.6 : 0.9}
                    style={{ pointerEvents:"none" }}>
                {row.glyph}
              </text>
            )}
            {/* Flag icon at TOP of the row's text column — exact v0.3
                spacing: y - 14 puts the flag at the visual top, with enough
                gap below before the label baseline at y + 12. */}
            {row.isBucket && row.flag && (
              <g transform={`translate(${RIGHT_X + indentOffset + radius + 14}, ${y - 14})`}
                 opacity={row.ruledOut || row.routedTo ? 0.5 : 1}>
                <CandIcon cand={row.flag} w={14} h={10} />
              </g>
            )}
            {!row.isBucket && (
              <g transform={`translate(${RIGHT_X + indentOffset + radius + 14}, ${y - 14})`}>
                <CandIcon cand={row.id} w={12} h={8} />
              </g>
            )}

            {/* Label — y + 12 baseline (v0.3). 26px gap from flag top to
                label baseline gives the rows visual separation v0.3 has.
                Variants are slightly smaller (11pt vs 12.5pt) to read as
                children of the family above. */}
            <text x={RIGHT_X + indentOffset + radius + 14}
                  y={y + 12}
                  fontFamily="'Instrument Sans', sans-serif"
                  fontSize={row.isVariant ? 11 : (row.isBucket ? 12.5 : 11)}
                  fill={colors.ink}
                  fontWeight={row.isVariant ? 400 : (row.isBucket ? (v > 0.15 ? 600 : 500) : 400)}
                  fontStyle={row.ruledOut ? "italic" : "normal"}
                  opacity={row.ruledOut ? 0.7 : 1}>
              {row.label}
            </text>

            {/* Percentage — variants show conditional probability with
                an explicit "of α" hint so the reader knows it's
                P(variant | family), not P(variant). L2-gated rows show
                a structural-exclusion note instead of just "0%". */}
            {row.isVariant ? (
              <text x={RIGHT_X + indentOffset + radius + 14}
                    y={y + 28}
                    fontFamily="'Fraunces', serif"
                    fontSize={12}
                    fontStyle="italic"
                    fill={cc}
                    fontVariantNumeric="tabular-nums"
                    opacity={0.9}>
                {(row.conditional * 100).toFixed(0)}%
                <tspan fontFamily="'JetBrains Mono', monospace"
                       fontSize="8" fill={colors.inkMute}
                       fontStyle="normal" letterSpacing="0.4"
                       dx="6">
                  of α (conditional)
                </tspan>
              </text>
            ) : row.l2Gated ? (
              <>
                <text x={RIGHT_X + indentOffset + radius + 14}
                      y={y + 30}
                      fontFamily="'Fraunces', serif"
                      fontSize={13}
                      fontStyle="italic"
                      fill={cc}
                      fontVariantNumeric="tabular-nums"
                      opacity={0.55}>
                  0%
                </text>
                <text x={RIGHT_X + indentOffset + radius + 14}
                      y={y + 44}
                      fontFamily="'JetBrains Mono', monospace"
                      fontSize={8}
                      fill={colors.inkMute}
                      letterSpacing="0.6"
                      textTransform="uppercase"
                      opacity={0.9}>
                  Structurally excluded
                </text>
              </>
            ) : (
              <text x={RIGHT_X + indentOffset + radius + 14}
                    y={y + 30}
                    fontFamily="'Fraunces', serif"
                    fontSize={row.isBucket ? 15 : 12.5}
                    fontStyle="italic"
                    fill={cc}
                    fontVariantNumeric="tabular-nums"
                    opacity={row.ruledOut ? 0.6 : 1}>
                {row.ruledOut ? "0%" : `${(v*100).toFixed(1)}%`}
              </text>
            )}

            {/* Persistent info badge — small gold "i" placed to the
                RIGHT of the label text (where the user's eye finishes
                reading "Russian self-sabotage" / "Institutional
                avoidance"), signalling additional reasoning is
                available on hover. Width is measured per-row so the
                badge sits a consistent 8px after the label tail. */}
            {row.isBucket && row.overlap && (() => {
              const labelW = measureText(
                row.label,
                row.isBucket ? 12.5 : 11,
                "Instrument Sans, sans-serif",
                row.isBucket ? (v > 0.15 ? 600 : 500) : 400
              );
              const badgeX = RIGHT_X + indentOffset + radius + 14 + labelW + 10;
              const badgeY = y + 8;
              return (
                <g transform={`translate(${badgeX}, ${badgeY})`}>
                  <circle cx={0} cy={0} r={6}
                          fill={colors.paper}
                          stroke={colors.warn}
                          strokeWidth="1"
                          opacity={isHover ? 1 : 0.7}/>
                  <text x={0} y={2.8} textAnchor="middle"
                        fontFamily="'Fraunces', serif"
                        fontStyle="italic"
                        fontSize="8"
                        fontWeight="600"
                        fill={colors.warnDeep}
                        opacity={isHover ? 1 : 0.7}
                        style={{ pointerEvents: "none" }}>i</text>
                </g>
              );
            })()}

            {/* Custom tooltip — same chrome as the timeline tick tooltip
                (frosted glass, soft border, drop shadow, Instrument
                Sans 12pt). Rendered via SVG <foreignObject> so the HTML
                inside wraps the long reasoning text into multiple
                lines. Pointer aligns with the info badge to the right
                of the label, not the ring. */}
            {/* Storyline tooltip — handled via setTipData on the row's
                mouseEnter handler (not in render). The actual tooltip
                renders via StorylineTooltip outside the SVG. */}
          </g>
        );
      })}

      {/* Show-all / primary toggle is rendered as HTML outside the SVG so it can
          stay fixed in the viewport even when the stage scrolls vertically. */}
    </svg>
    {tipData && (
      <StorylineTooltip
        data={tipData}
        svgRef={svgRef}
        svgWidth={width}
        svgHeight={height}
      />
    )}
    </>
  );
}

// StorylineTooltip — renders OUTSIDE the SVG as a sibling, using
// position:fixed at viewport coords computed from the SVG ref's
// bounding rect + the badge's SVG-coord position. position:fixed
// uses the viewport as containing block, escaping the wrapper's
// overflow:hidden, so the tooltip can extend ABOVE α (the top
// storyline) into the masthead area without being clipped.
function StorylineTooltip({ data, svgRef, svgWidth, svgHeight }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const update = () => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      // SVG uses preserveAspectRatio="xMidYMid meet" → uniform scale
      // to fit, content centered. Compute the actual scale + offset.
      const scale = Math.min(rect.width / svgWidth, rect.height / svgHeight);
      const offsetX = (rect.width - svgWidth * scale) / 2;
      const offsetY = (rect.height - svgHeight * scale) / 2;
      setPos({
        x: rect.left + offsetX + data.badgeX * scale,
        y: rect.top + offsetY + data.badgeY * scale,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [data, svgRef, svgWidth, svgHeight]);

  if (!pos || typeof window === "undefined") return null;

  const TOOLTIP_W = 280;
  const ARROW_GAP = 12;
  const left = Math.max(8, Math.min(window.innerWidth - 8 - TOOLTIP_W, pos.x - TOOLTIP_W / 2));
  // Anchor by bottom — tooltip sits ARROW_GAP above the badge,
  // intrinsic height from content.
  const bottom = window.innerHeight - pos.y + ARROW_GAP;
  const pointerLeftWithinBox = pos.x - left;

  return (
    <div style={{
      position: "fixed",
      left,
      bottom,
      width: TOOLTIP_W,
      zIndex: 9999,
      pointerEvents: "none",
      animation: "fadeIn 0.15s ease-out",
    }}>
      <div style={{
        position: "relative",
        padding: "10px 14px 11px",
        background: colors.paper,
        border: `1px solid ${colors.rule}`,
        borderRadius: 3,
        boxShadow: "0 12px 28px rgba(26,26,26,0.18), 0 3px 8px rgba(26,26,26,0.08)",
      }}>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 8.5,
          letterSpacing: 0.8,
          color: colors.warnDeep,
          textTransform:"uppercase",
          marginBottom: 6,
          fontWeight: 600,
        }}>
          {data.headerLabel}
        </div>
        <div style={{
          fontFamily:"'Instrument Sans', sans-serif",
          fontSize: 12,
          color: colors.ink,
          lineHeight: 1.45,
          fontWeight: 400,
        }}>
          {data.body}
        </div>
        {/* Arrow at bottom pointing DOWN to the badge below */}
        <div style={{
          position:"absolute", top:"100%",
          left: Math.max(10, Math.min(TOOLTIP_W - 10, pointerLeftWithinBox)),
          transform:"translateX(-50%)",
          width: 0, height: 0,
          borderLeft:"6px solid transparent",
          borderRight:"6px solid transparent",
          borderTop:`6px solid ${colors.rule}`,
        }}/>
        <div style={{
          position:"absolute", top:"100%",
          left: Math.max(10, Math.min(TOOLTIP_W - 10, pointerLeftWithinBox)),
          transform:"translateX(-50%) translateY(-1px)",
          width: 0, height: 0,
          borderLeft:"5px solid transparent",
          borderRight:"5px solid transparent",
          borderTop:`5px solid ${colors.paper}`,
        }}/>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE BAR — v0.3 mode only (preserved from original)
// ============================================================================

function TimelineBar({ idx, setIdx, timeline, turningPoints }) {
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
        const turningPoint = turningPoints ? turningPoints[t.tag] : null;
        const isTurning = !!turningPoint;
        return (
          <div key={t.tag}
               onMouseEnter={()=>setHoverTick(i)}
               onMouseLeave={()=>setHoverTick(null)}
               onMouseDown={(e)=>{ e.stopPropagation(); setIdx(i); }}
               style={{ position:"absolute", left: `${x}%`, top: 0, height: 42,
                 transform:"translateX(-50%)", cursor:"pointer",
                 display:"flex", flexDirection:"column", alignItems:"center" }}>
            {/* Turning-point vertical spike — extends up above the label */}
            {isTurning && (
              <div style={{
                position:"absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                width: 1.5, height: 7,
                background: current ? colors.primary : colors.warn,
                opacity: active ? 1 : 0.4,
                transition: "all 0.2s",
              }}/>
            )}
            <div style={{ fontFamily:"'Instrument Sans', sans-serif",
              fontSize: current ? 11.5 : 10.5,
              color: current ? colors.primary
                    : hoverTick === i ? colors.ink
                    : isTurning && active ? colors.warn
                    : (active ? colors.inkSoft : colors.muted),
              marginBottom: 8,
              fontWeight: (current || hoverTick === i || isTurning) ? 600 : 400,
              whiteSpace: "nowrap", transition:"all 0.15s", lineHeight: 1 }}>{t.label}</div>
            {/* Turning-point ticks are diamond-shaped; regular ticks are circles */}
            {isTurning ? (
              <div style={{
                width: current ? 10 : (hoverTick === i ? 8 : active ? 7 : 5),
                height: current ? 10 : (hoverTick === i ? 8 : active ? 7 : 5),
                background: current ? colors.primary : (active ? colors.warn : colors.muted),
                transform: "rotate(45deg)",
                border: current ? `1.5px solid ${colors.paper}` : "none",
                boxShadow: current ? `0 0 0 1px ${colors.primary}` : "none",
                marginTop: current ? -1 : 0,
                transition:"all 0.15s",
              }} />
            ) : (
              <div style={{ width: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
                height: current ? 10 : (hoverTick === i ? 7 : active ? 6 : 4),
                borderRadius: "50%",
                background: current ? colors.primary : (active ? colors.ink : colors.muted),
                border: current ? `2px solid ${colors.paper}` : "none",
                boxShadow: current ? `0 0 0 1px ${colors.primary}` : "none",
                marginTop: current ? -2 : 0, transition:"all 0.15s" }} />
            )}
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
          background: "rgba(250, 248, 243, 0.97)",
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
          // Reset typographic inheritance — when InfoTooltip is
          // nested inside a Tag (textTransform:uppercase, letterSpacing:0.8)
          // the body text would otherwise render in caps.
          textTransform: "none",
          letterSpacing: "normal",
          fontWeight: 400,
          fontStyle: "normal",
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

  // Default position: bottom-left of the graph, floating above the timeline.
  // Left-aligned with the timeline track + ample spacing above. User can
  // drag-relocate; drag overrides the default placement.
  const [pos, setPos] = useState({ top: null, left: 20, bottom: 82, right: null });
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startTop: 0, startLeft: 0 });

  const onHeaderMouseDown = (e) => {
    e.preventDefault();
    // Overlay is position:absolute inside the graph container.
    // Drag coords are relative to the containing (scrollable) parent.
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.offsetParent || document.documentElement;
    const parentRect = parent.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY,
      startLeft: rect.left - parentRect.left, startTop: rect.top - parentRect.top };
    setPos({ top: rect.top - parentRect.top, left: rect.left - parentRect.left, right: null, bottom: null });
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

  // Turning-point lookup — works in both modes. Banner renders above the
  // main body when the current tp is flagged as a structural inflection.
  const turningPoint = tp
    ? (isV04 ? (TURNING_POINTS_V04[tp.tag] || null)
             : (TURNING_POINTS[tp.tag] || null))
    : null;

  // v0.5 §2.6 storyline pills: families with their family-level coverage.
  // δ marked as l2Gated (causally excluded — categorically different from
  // a low-probability candidate).
  const storyPills = [
    { id: "alpha",   glyph: "α", coverage: 0.7052, color: colors.primary },
    { id: "mu",      glyph: "μ", coverage: 0.147,  color: colors.inkSoft },
    { id: "epsilon", glyph: "ε", coverage: 0.063,  color: colors.inkSoft },
    { id: "beta",    glyph: "β", coverage: 0.0577, color: colors.inkSoft },
    { id: "zeta",    glyph: "ζ", coverage: 0.0272, color: colors.inkSoft },
    { id: "delta",   glyph: "δ", coverage: 0.00,   color: colors.muted, l2Gated: true },
  ];

  // Positioning: absolute inside graph container.
  // Default: bottom-left, above the timeline. User drag overrides.
  const userDragged = pos.top !== null;
  const stickyStyle = userDragged
    ? { position: "absolute", top: pos.top,
        ...(pos.right != null ? { right: pos.right } : { left: pos.left }) }
    : { position: "absolute", left: pos.left, bottom: pos.bottom };

  return (
    <div onMouseDown={onHeaderMouseDown}
      style={{ ...stickyStyle, zIndex: 8,
        background: "rgba(250, 248, 243, 0.97)",
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
            Current Understanding
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          {tp && (
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

      {/* Turning-point banner — appears when current tp is flagged as a
          structural inflection. Warn-tinted (gold-brown) distinguishes it
          from primary red (current-state signal). Positioned above the
          main body so the reader's eye catches it first. Works in both
          v0.3 and v0.4. */}
      {turningPoint && !collapsed && (
        <div style={{
          padding: "10px 14px 11px",
          borderTop: `1px solid ${colors.ruleSoft}`,
          background: "rgba(184, 144, 46, 0.07)",
          animation: "fadeIn 0.3s ease-out",
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap: 6, marginBottom: 5,
          }}>
            {/* Diamond marker — matches timeline bar's turning-point tick */}
            <div style={{
              width: 7, height: 7,
              background: colors.warn,
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}/>
            <div style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
              color: colors.warn, letterSpacing: 1,
              textTransform:"uppercase", fontWeight: 600,
            }}>
              Turning point
            </div>
            <div style={{
              marginLeft: "auto",
              fontFamily:"'Fraunces', serif", fontSize: 13, fontStyle:"italic",
              color: colors.warn, fontVariantNumeric:"tabular-nums",
              fontWeight: 500,
            }}>
              Δ {turningPoint.delta} pts
            </div>
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 14, fontStyle:"italic",
            color: colors.ink, lineHeight: 1.3, letterSpacing: -0.1,
          }}>
            {turningPoint.reason}
          </div>
        </div>
      )}

      {/* v0.4: Title block — current timepoint understanding (mirrors v0.3
          exactly). The title is the reading at this moment in time and
          changes during playback; storylines and their distribution sit
          below as a separate, pseudo-static state summary. */}
      {isV04 && (() => {
        const titleHead = tp ? (UNDERSTANDING_V04[tp.tag]?.head || "—") : "—";
        return (
          <div style={{
            padding: collapsed ? "12px 14px 12px" : "14px 14px 14px",
            borderTop: turningPoint ? "none" : `1px solid ${colors.ruleSoft}`,
            borderBottom: collapsed ? "none" : `1px solid ${colors.ruleSoft}`,
            fontFamily:"'Fraunces', serif", fontSize: 15.5, lineHeight: 1.25,
            color: colors.ink, letterSpacing: -0.1, fontStyle:"italic",
          }}>
            {titleHead}
          </div>
        );
      })()}

      {/* v0.4: storyline distribution — single-region, attribution only.
          μ stays out of the panel (its "different axis" framing was confusing
          when squeezed into 340px). It still appears on the graph with its
          own caption. Greek letter glyphs are dropped here — flag icon +
          label is enough, the letters were redundant chrome. */}
      {isV04 && !collapsed && (() => {
        // Storyline → flag mapping (matches BUCKETS_V04 on the graph).
        const storyFlag = {
          alpha:   "C2b",          // 🇺🇦
          epsilon: "C_unknown",    // ?
          zeta:    "C5",           // 🇬🇧
          beta:    "C7",           // 🇺🇸+🇺🇦
          delta:   "C4",           // 🇷🇺
        };
        // Build rows directly from BUCKETS_V04 (v0.5 source of truth).
        // Live rows: families with weight > 0 — sorted desc.
        // L2-gated rows: stay separate, rendered after a divider.
        const liveBuckets = BUCKETS_V04.filter(b => !b.l2Gated);
        const gatedBuckets = BUCKETS_V04.filter(b => b.l2Gated);
        const liveRows = liveBuckets
          .map(b => ({
            id: b.id,
            flag: storyFlag[b.id] || b.flag,
            coverage: b.coverageOverride || 0,
            summary: (STORYLINES.find(s => s.id === b.id)?.shortLabel)
                  || (STORYLINES.find(s => s.id === b.id)?.label)
                  || b.label,
            color: candColorForStory(b.id),
            variants: b.variants || null,
          }))
          .sort((a, b) => b.coverage - a.coverage);
        const gatedRows = gatedBuckets.map(b => ({
          id: b.id,
          flag: storyFlag[b.id] || b.flag,
          coverage: 0,
          summary: b.label,
          color: candColorForStory(b.id),
          l2Gated: true,
        }));
        const rows = liveRows;
        const leadingId = rows[0]?.id;
        const hoverStory = hoverCand && hoverCand.startsWith("_story:") ? hoverCand.slice(7) : null;
        return (
          <div style={{ padding: "10px 14px 12px" }}>
            {/* Distribution bar — segments double as hover targets */}
            <div style={{ display:"flex", height: 7, borderRadius: 1, overflow:"hidden",
              marginBottom: 10, background: "rgba(242, 238, 228, 0.6)" }}>
              {rows.map(r => (
                <div key={r.id}
                     onMouseEnter={()=>setHoverCand("_story:" + r.id)}
                     onMouseLeave={()=>setHoverCand(null)}
                     title={`${r.summary} — ${(r.coverage*100).toFixed(1)}%`}
                     style={{
                       width: `${r.coverage * 100}%`,
                       background: r.color,
                       opacity: hoverStory && hoverStory !== r.id ? 0.25 : 1,
                       borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
                       cursor:"default",
                       transition:"opacity 0.15s",
                     }}/>
              ))}
            </div>
            {/* Row list — color square + flag icon + label + %.
                Variants render as compact indented sub-rows beneath
                their family. */}
            <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
              {rows.map(r => {
                const isLead = r.id === leadingId;
                const isHovered = hoverStory === r.id;
                const dim = hoverStory && !isHovered;
                return (
                  <React.Fragment key={r.id}>
                    <div onMouseEnter={()=>setHoverCand("_story:" + r.id)}
                         onMouseLeave={()=>setHoverCand(null)}
                         style={{ display:"grid",
                           gridTemplateColumns: "9px 18px 1fr auto", gap: 10,
                           alignItems:"center", cursor:"default",
                           opacity: dim ? 0.4 : 1,
                           transition:"opacity 0.2s" }}>
                      <div style={{ width: 7, height: 7, background: r.color,
                        outline: isHovered ? `1.5px solid ${colors.ink}` : "none",
                        outlineOffset: 1 }}/>
                      <CandIcon cand={r.flag} w={16} h={11} />
                      <div style={{ fontFamily:"'Instrument Sans', sans-serif",
                        fontSize: 12.5, color: colors.ink,
                        fontWeight: isLead ? 500 : 400,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {r.summary}
                      </div>
                      <div style={{ fontFamily:"'Fraunces', serif", fontSize: 14.5,
                        fontStyle:"italic",
                        color: isLead ? colors.primary : colors.ink,
                        fontVariantNumeric:"tabular-nums" }}>
                        {(r.coverage * 100).toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55, marginLeft: 1 }}>%</span>
                      </div>
                    </div>
                    {/* Variant sub-rows — indented, conditional %, smaller text */}
                    {r.variants && r.variants.map((v, i) => {
                      const isLast = i === r.variants.length - 1;
                      return (
                        <div key={v.id}
                             style={{ display:"grid",
                               gridTemplateColumns: "9px 18px 1fr auto", gap: 10,
                               alignItems:"center", cursor:"default",
                               opacity: dim ? 0.4 : 0.9,
                               paddingLeft: 22,
                               transition:"opacity 0.2s",
                               position:"relative" }}>
                          {/* Mini L-connector to parent — reinforces the
                              tree relationship. */}
                          <div style={{
                            position:"absolute",
                            left: 14, top: -8, width: 1, height: 17,
                            background: r.color, opacity: 0.35,
                          }}/>
                          <div style={{
                            position:"absolute",
                            left: 14, top: 9, width: 8, height: 1,
                            background: r.color, opacity: 0.35,
                          }}/>
                          <div/>
                          <CandIcon cand={v.flag} w={14} h={9.5} />
                          <div style={{ fontFamily:"'Instrument Sans', sans-serif",
                            fontSize: 11, color: colors.inkSoft,
                            fontWeight: 400,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {v.label}
                          </div>
                          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 12,
                            fontStyle:"italic",
                            color: colors.inkSoft,
                            fontVariantNumeric:"tabular-nums" }}>
                            {(v.conditional * 100).toFixed(0)}
                            <span style={{ fontSize: 8.5, opacity: 0.6,
                              marginLeft: 1, fontFamily:"'JetBrains Mono', monospace",
                              fontStyle:"normal" }}> %·of α</span>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              {/* L2-gated tail — visually separated, no coverage in
                  distribution bar, marked as structurally excluded. */}
              {gatedRows.length > 0 && (
                <>
                  <div style={{
                    margin: "8px 0 4px",
                    fontFamily:"'JetBrains Mono', monospace",
                    fontSize: 8.5, letterSpacing: 0.7,
                    color: colors.inkMute, textTransform:"uppercase",
                    display:"flex", alignItems:"center", gap: 8,
                  }}>
                    <div style={{ flex: 1, height: 1, background: colors.ruleSoft }}/>
                    Structurally excluded
                    <div style={{ flex: 1, height: 1, background: colors.ruleSoft }}/>
                  </div>
                  {gatedRows.map(r => (
                    <div key={r.id}
                         style={{ display:"grid",
                           gridTemplateColumns: "9px 18px 1fr auto", gap: 10,
                           alignItems:"center", cursor:"default",
                           opacity: 0.55 }}>
                      <div style={{ width: 7, height: 7,
                        border: `1px dashed ${colors.muted}`,
                        background: "transparent" }}/>
                      <CandIcon cand={r.flag} w={16} h={11} />
                      <div style={{ fontFamily:"'Instrument Sans', sans-serif",
                        fontSize: 12, color: colors.inkSoft,
                        fontStyle:"italic",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {r.summary}
                      </div>
                      <div style={{ fontFamily:"'Fraunces', serif", fontSize: 12.5,
                        fontStyle:"italic",
                        color: colors.muted,
                        fontVariantNumeric:"tabular-nums" }}>
                        0<span style={{ fontSize: 9, opacity: 0.55, marginLeft: 1 }}>%</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* v0.3: original timeline-point understanding head */}
      {!isV04 && (
        <div style={{ padding: collapsed ? "12px 14px 12px" : "14px 14px 14px",
          fontFamily:"'Fraunces', serif", fontSize: 15.5, lineHeight: 1.25,
          color: colors.ink, letterSpacing: -0.1, fontStyle:"italic",
          borderTop: turningPoint ? "none" : `1px solid ${colors.ruleSoft}`,
          borderBottom: collapsed ? "none" : `1px solid ${colors.ruleSoft}` }}>
          {head}
        </div>
      )}

      {/* v0.3 distribution bar (legacy path) */}
      {!isV04 && !collapsed && rows.length > 0 && (
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display:"flex", height: 7, borderRadius: 1, overflow:"hidden",
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
  if (id === "zeta") return "#4A4A4A";        // inkSoft — UK-layer (under-examined)
  if (id === "mu") return "#7A6A54";          // process subclaim — meta hue (separate axis)
  if (id === "beta") return "#6A6A6A";
  if (id === "delta") return "#B7B0A0";       // muted
  return "#8A8A8A";
}

// ============================================================================
// EVIDENCE DRAWER — mode-aware (v0.4 adds positions + language)
// ============================================================================

// Small monochrome pushpin button used in evidence/cluster drawers.
// Positioned absolutely at top-right of the drawer (slightly above the
// drawer's top edge so it reads as "pinned on" rather than "inside").
// Click → unpin (close). Hover → subtle tilt, suggesting it can be pulled.
// Map a source string to a short letter mark for the circular icon
// shown left of the source line in the evidence drawer. We can't use
// real publication logos (copyright), so this returns a 1-3 char
// initial-mark that reads as identifying that publication / source
// category. The circle itself is monochrome (ink fill, paper letters)
// to keep the editorial aesthetic consistent.
function getSourceMark(source) {
  if (!source) return "?";
  const patterns = [
    // Specific publications (most → least specific)
    [/seymour hersh/i,                 "SH"],
    [/new york times|\bnyt\b/i,        "NY"],
    [/washington post|\bwapo\b/i,      "WP"],
    [/wall street journal|\bwsj\b/i,   "WSJ"],
    [/der spiegel|spiegel/i,           "DS"],
    [/die zeit/i,                      "DZ"],
    [/süddeutsche|süddeutsche zeitung/i, "SZ"],
    [/\bard\b|kontraste/i,             "ARD"],
    [/weltwoche/i,                     "WW"],
    [/die welt|\bwelt\b/i,             "DW"],
    [/\bbild\b/i,                      "B"],
    [/tagesschau/i,                    "TS"],
    [/t-online/i,                      "to"],
    [/il fatto quotidiano/i,           "IFQ"],
    [/il post/i,                       "IP"],
    [/la repubblica/i,                 "LR"],
    [/corriere/i,                      "CS"],
    [/rzeczpospolita/i,                "Rz"],
    [/gazeta wyborcza/i,               "GW"],
    [/polska zbrojna/i,                "PZ"],
    [/ukrainska pravda/i,              "UP"],
    [/reuters/i,                       "R"],
    [/associated press|\bap\b/i,       "AP"],
    [/\bbbc\b/i,                       "BBC"],
    [/\bafp\b/i,                       "AFP"],
    [/ria novosti/i,                   "RIA"],
    [/\btass\b/i,                      "TAS"],
    [/bloomberg/i,                     "BB"],
    [/financial times|\bft\b/i,        "FT"],
    [/le monde/i,                      "LM"],
    [/le figaro/i,                     "LF"],
    [/el país/i,                       "EP"],
    [/\bsvt\b/i,                       "SVT"],
    [/danish radio|\bdr\b/i,           "DR"],
    // Categorical fallbacks — symbols for institutional source types
    [/substack/i,                      "§"],
    [/un security council|united nations/i, "UN"],
    [/security service|secret intelligence|\bsvr\b|\bfsb\b|\bgru\b|\bcia\b|\bmi6\b|\bmi5\b|\bbnd\b/i, "✺"],
    [/prosecut|bundesanwaltschaft|prosecutor|prosecution authority/i, "§"],
    [/court|court of appeal|district court|cassazione|bgh ruling/i, "§"],
    [/police|polizei|politi/i,         "§"],
    [/bundestag|parliament|inquiry|oversight panel/i, "★"],
    [/white house|spokesperson|defense command|defence|ministry/i, "★"],
    [/state media|state-sourced/i,     "★"],
    [/trump/i,                         "T"],
  ];
  for (const [re, mark] of patterns) {
    if (re.test(source)) return mark;
  }
  // Fallback: first uppercase letter from first word
  const m = source.match(/[A-ZÄÖÜА-Я]/);
  return m ? m[0] : "?";
}

// Source block — circular media-mark + source description + positions.
// When a source_url exists in EVIDENCE_SOURCE_URLS, the entire block is
// wrapped in an anchor that opens the original news article / court
// document / official statement in a new tab. Hover shows an underline
// on the source text + reveals a ↗ external-link icon, matching the
// affordance pattern of other clickable rows in the drawer.
function SourceBlock({ source, sourceUrl, positions }) {
  const [hover, setHover] = React.useState(false);
  const isLink = !!sourceUrl;
  const showHover = isLink && hover;

  const innerStructure = (
    <>
      <div style={{ marginTop: 1, flexShrink: 0 }}>
        <SourceIcon source={source} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily:"'Instrument Sans', sans-serif",
          fontSize: 12.5,
          color: showHover ? colors.ink : colors.inkSoft,
          lineHeight: 1.5, fontWeight: 400,
          textDecoration: showHover ? "underline" : "none",
          textUnderlineOffset: 3,
          textDecorationColor: colors.inkMute,
          textDecorationThickness: 1,
          transition: "color 0.15s",
        }}>
          {source}
          {isLink && (
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
              style={{
                display:"inline-block", marginLeft: 6,
                verticalAlign: "baseline",
                opacity: hover ? 1 : 0.5,
                transform: hover ? "translate(1px,-1px)" : "translate(0,0)",
                transition: "opacity 0.15s, transform 0.15s",
              }}>
              <path d="M3.2 2.8 L7 2.8 L7 6.6 M7 2.8 L3.2 6.6"
                stroke={hover ? colors.primary : colors.inkMute}
                strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {positions && positions.length > 0 && (
          <div style={{ marginTop: 5,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.4,
            lineHeight: 1.5 }}>
            {positions.map(p=>p.replace(/_/g," ")).join(" · ")}
          </div>
        )}
      </div>
    </>
  );

  const containerStyle = {
    marginTop: 14,
    display:"flex", alignItems:"flex-start", gap: 12,
    textDecoration:"none", color:"inherit",
    cursor: isLink ? "pointer" : "default",
  };

  if (isLink) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
         onMouseEnter={()=>setHover(true)}
         onMouseLeave={()=>setHover(false)}
         style={containerStyle}>
        {innerStructure}
      </a>
    );
  }
  return <div style={containerStyle}>{innerStructure}</div>;
}

function SourceIcon({ source, theme = "v04" }) {
  const mark = getSourceMark(source);
  const ink = theme === "v03" ? V03_colors.ink : colors.ink;
  const paper = theme === "v03" ? V03_colors.paper : colors.paper;
  return (
    <div style={{
      width: 22, height: 22,
      borderRadius: "50%",
      background: ink,
      color: paper,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: mark.length >= 3 ? 7.5 : mark.length === 2 ? 9 : 11,
      fontWeight: 600,
      letterSpacing: mark.length >= 3 ? 0 : 0.2,
      flexShrink: 0,
      lineHeight: 1,
    }}>
      {mark}
    </div>
  );
}

// For cross-reference chips, pull the referenced record's title when
// available. Priority: enriched E-layer → graph-layer label →
// F-layer spec title → id. Hoisted to module scope so CrossRefRow
// (defined as a top-level component) can access it.
function crossRefTitle(id) {
  const enr = EVIDENCE_V04_ENRICHED[id];
  if (enr) return enr.title;
  const raw = EVIDENCE_V04.find(e => e.id === id);
  if (raw) return raw.label;
  if (FACT_LAYER_TITLES[id]) return FACT_LAYER_TITLES[id];
  return id;
}

// Cross-reference row inside EvidenceDrawer — clickable for E-layer
// IDs (which navigate to that evidence's own drawer), visually
// subordinate dashed for F-layer IDs (spec-only anchors). Hover state
// is hoisted to React state so we can drive multiple coordinated
// transitions: bg + border + ID color + arrow opacity + arrow shift.
function CrossRefRow({ xid, onJumpTo }) {
  const [hover, setHover] = useState(false);
  const canJump = !!(onJumpTo && EVIDENCE_V04_ENRICHED[xid]);
  const isFactLayer = !canJump && FACT_LAYER_TITLES[xid];
  const showHover = canJump && hover;
  return (
    <div
      onClick={canJump ? ()=>onJumpTo(xid) : undefined}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        display:"grid",
        gridTemplateColumns:"44px 1fr 14px",
        alignItems:"center", gap: 10,
        padding: "9px 12px",
        background: showHover ? colors.paperDeep : "transparent",
        border: `1px ${isFactLayer ? "dashed" : "solid"} ${
          showHover ? colors.ink : colors.ruleSoft
        }`,
        borderRadius: 2,
        cursor: canJump ? "pointer" : "default",
        opacity: isFactLayer ? 0.82 : 1,
        transition: "background 0.12s, border-color 0.12s",
      }}>
      <span style={{ fontFamily:"'JetBrains Mono', monospace",
        fontSize: 11.5,
        // ID color shifts to primary on hover — strong signal that
        // this row is the navigable element (matches link-color
        // convention without relying on underline).
        color: isFactLayer ? colors.inkMute
              : showHover ? colors.primary
              : colors.ink,
        fontWeight: isFactLayer ? 500 : 600,
        letterSpacing: 0.3,
        transition: "color 0.12s" }}>
        {xid}
      </span>
      <span style={{ fontFamily:"'Instrument Sans', sans-serif",
        fontSize: 12.5,
        color: isFactLayer ? colors.inkMute
              : showHover ? colors.ink
              : colors.inkSoft,
        lineHeight: 1.4,
        overflow:"hidden", textOverflow:"ellipsis",
        display:"-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient:"vertical",
        transition: "color 0.12s" }}>
        {crossRefTitle(xid)}
      </span>
      {canJump ? (
        // Arrow icon — fades up to full opacity on hover and slides
        // 2px right, suggesting "go there".
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            opacity: showHover ? 1 : 0.55,
            transform: showHover ? "translateX(2px)" : "translateX(0)",
            transition: "opacity 0.15s, transform 0.15s",
          }}>
          <path d="M2 5 L8 5 M5 2 L8 5 L5 8"
                stroke={showHover ? colors.primary : colors.inkMute}
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
}

function PinButton({ onClose }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={(e)=>{ e.stopPropagation(); onClose(); }}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      title="Unpin (close panel)"
      aria-label="Unpin and close evidence panel"
      style={{
        position:"absolute", top: -6, right: 22,
        width: 22, height: 28,
        background:"transparent", border:"none",
        padding: 0, cursor:"pointer",
        transform: hover ? "rotate(-12deg) translateY(-2px)" : "rotate(-4deg)",
        transformOrigin: "50% 25%",
        transition: "transform 0.18s cubic-bezier(.2,.7,.2,1)",
        zIndex: 5,
      }}>
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
        {/* Needle/spike — ink, narrow, slight taper */}
        <path d="M 11 9 L 11 24"
              stroke={colors.ink} strokeWidth="1.6" strokeLinecap="round"/>
        {/* Pin head — solid ink disc */}
        <circle cx="11" cy="7" r="5.5" fill={colors.ink}/>
        {/* Highlight — paper color, suggests dimensional pin head */}
        <circle cx="9" cy="5" r="1.5" fill={colors.paper} opacity="0.55"/>
        {/* Subtle drop shadow under pin head */}
        <ellipse cx="11" cy="13.5" rx="3.5" ry="0.8"
                 fill={colors.ink} opacity="0.12"/>
      </svg>
    </button>
  );
}

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

  // crossRefTitle moved to module scope so CrossRefRow can use it directly.

  // Click-outside handling — wrap the drawer in a transparent backdrop that
  // captures clicks anywhere outside the drawer body and closes it. Also
  // close on Escape key. Stops the click event inside drawer body from
  // propagating up to the backdrop.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Transparent backdrop — captures click-outside on the entire
          viewport. Fixed so it doesn't get bound to the graph
          container; covers everything behind the drawer. */}
      <div onClick={onClose}
        style={{ position:"fixed", inset: 0, zIndex: 99,
          background: "rgba(26, 26, 26, 0.18)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          cursor:"default",
          animation: "fadeIn 0.2s ease-out" }}/>

    <div onClick={(e)=>e.stopPropagation()}
      style={{ position:"fixed", top: 0, right: 0, bottom: 0,
      width: 540, maxWidth: "min(50vw, 600px)",
      background: colors.paper,
      borderLeft: `1px solid ${colors.rule}`,
      boxShadow: "-20px 0 60px rgba(26,26,26,0.12), -2px 0 8px rgba(26,26,26,0.04)",
      padding: "32px 38px 56px", overflowY:"auto", zIndex: 100,
      animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)" }}>

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

      {/* ─── Source-type + source-confidence — categorical label first,
          numeric score last. The descriptive label (TESTIMONY,
          OFFICIAL_STATEMENT, etc.) takes the primary visual position
          via Tag.default; the numeric reliability score takes the
          secondary slot via Tag.mute (transparent bg) — matches v0.3's
          "categorical primary, quantitative secondary" hierarchy. */}
      {useV04 && (
        <div style={{ marginTop: 14, display:"flex", gap: 6,
          alignItems:"center", flexWrap:"wrap" }}>
          {ev.source_type && <Tag tone="default">{ev.source_type}</Tag>}
          <Tag tone="mute">
            source conf {enriched.source_confidence.toFixed(2)}
            <InfoTooltip {...FIELD_TOOLTIPS.source_confidence} width={310} size={10}/>
          </Tag>
        </div>
      )}

      {/* ─── Title (primary, evidence self-describes) ──────────────────── */}
      <div style={{ fontFamily:"'Fraunces', serif", fontSize: useV04 ? 22 : 24,
        lineHeight: 1.25, color: colors.ink, letterSpacing: -0.3,
        marginTop: useV04 ? 10 : 12 }}>
        {useV04 ? enriched.title : ev.label}
      </div>

      {/* ─── Source line — circular media-mark + source description.
          When the evidence has a primary source URL in
          EVIDENCE_SOURCE_URLS, SourceBlock wraps everything in an
          anchor that opens the original article in a new tab. */}
      {useV04 && (
        <SourceBlock
          source={enriched.source}
          sourceUrl={EVIDENCE_SOURCE_URLS[ev.id]}
          positions={isV04 ? ev.positions : null}
        />
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
                {enriched.cross_references.map((xid) => (
                  <CrossRefRow key={xid} xid={xid} onJumpTo={onJumpTo}/>
                ))}
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
    </>
  );
}


// ============================================================================
// CLUSTER DRAWER — opens when a cluster row is clicked. Shows the cluster's
// rationale (why these are grouped) + lists each member as a row that can be
// drilled into a regular EvidenceDrawer. Also offers an inline-expansion
// toggle so the reader can choose to see the members spread across the
// graph's time list. Same chrome as EvidenceDrawer (right-side panel,
// click-outside-to-close, Esc-to-close).
// ============================================================================

function ClusterDrawer({ cluster, onClose, onOpenMember, isInlineExpanded, onToggleInline, mode }) {
  if (!cluster) return null;

  // Esc-to-close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const evidenceList = mode === "v04" ? EVIDENCE_V04 : EVIDENCE_V03;
  const colorToken = cluster.color === "warn" ? colors.warn
                   : cluster.color === "meta" ? colors.meta
                   : cluster.color === "primary" ? colors.primary
                   : colors.inkMute;
  const shortId = "E*" + (cluster.id.replace(/^SC_/, ""));

  return (
    <>
      {/* Click-outside backdrop — fixed, covers full viewport. */}
      <div onClick={onClose}
        style={{ position:"fixed", inset: 0, zIndex: 99,
          background: "rgba(26, 26, 26, 0.18)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          cursor:"default",
          animation: "fadeIn 0.2s ease-out" }}/>

      <div onClick={(e)=>e.stopPropagation()}
        style={{ position:"fixed", top: 0, right: 0, bottom: 0,
        width: 540, maxWidth: "min(50vw, 600px)",
        background: colors.paper,
        borderLeft: `1px solid ${colors.rule}`,
        boxShadow: "-20px 0 60px rgba(26,26,26,0.12), -2px 0 8px rgba(26,26,26,0.04)",
        padding: "32px 38px 56px", overflowY:"auto", zIndex: 100,
        animation: "slideInRight 0.35s cubic-bezier(.2,.7,.2,1)" }}>

        {/* ─── Header: cluster id + count ─────────────────────────── */}
        <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 14 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 14,
            color: colorToken, fontWeight: 600 }}>{shortId}</div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.5 }}>
            cluster · {cluster.members.length} items
          </div>
        </div>

        {/* Cluster type badge */}
        <div style={{ display:"inline-block",
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colorToken, letterSpacing: 0.7, textTransform:"uppercase",
          background: `${colorToken}14`,
          border: `1px solid ${colorToken}40`,
          padding: "3px 8px", borderRadius: 2,
          marginBottom: 16, fontWeight: 600 }}>
          Correlated cluster
        </div>

        {/* Cluster label as title */}
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 28,
          fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.4,
          color: colors.ink, marginBottom: 18 }}>
          {cluster.label}
        </div>

        {/* Cluster summary / rationale */}
        <div style={{
          padding: "14px 16px",
          background: colors.paperDeep,
          borderLeft: `3px solid ${colorToken}`,
          borderRadius: 2,
          fontFamily:"'Fraunces', serif", fontStyle:"italic",
          fontSize: 14, lineHeight: 1.55, color: colors.inkSoft,
          marginBottom: 28 }}>
          {cluster.summary}
        </div>

        {/* ─── Inline-expand toggle ─────────────────────────── */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding: "12px 14px",
          background: colors.paper,
          border: `1px solid ${colors.ruleSoft}`,
          borderRadius: 2,
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: colors.inkSoft, lineHeight: 1.4 }}>
            <strong style={{ color: colors.ink, fontWeight: 600 }}>
              {isInlineExpanded ? "Members are inlined in graph" : "Members are aggregated in graph"}
            </strong><br/>
            <span style={{ fontSize: 11.5, color: colors.inkMute }}>
              {isInlineExpanded
                ? "Each member appears as its own row in the time list."
                : "Click below to spread the members across the graph's time list."}
            </span>
          </div>
          <button onClick={onToggleInline}
            style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
              color: isInlineExpanded ? colors.paper : colorToken,
              background: isInlineExpanded ? colorToken : "transparent",
              border: `1px solid ${colorToken}`,
              padding: "6px 11px", borderRadius: 2,
              letterSpacing: 0.7, textTransform:"uppercase",
              cursor:"pointer", whiteSpace:"nowrap",
              fontWeight: 600,
              transition:"all 0.15s",
              flexShrink: 0,
              marginLeft: 14 }}>
            {isInlineExpanded ? "Collapse" : "Expand inline"}
          </button>
        </div>

        {/* ─── Member list — each clickable to drill into EvidenceDrawer ─── */}
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 12, fontWeight: 600 }}>
          {cluster.members.length} members
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 1,
          border: `1px solid ${colors.ruleSoft}`, borderRadius: 2,
          background: colors.paperDeep, padding: 1 }}>
          {cluster.members.map(memberId => {
            const ev = evidenceList.find(e => e.id === memberId);
            if (!ev) return (
              <div key={memberId} style={{
                padding:"12px 14px", background: colors.paper,
                fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                color: colors.inkMute }}>
                {memberId} · not found in current corpus
              </div>
            );
            const credColor = ev.credibility >= 0.85 ? colors.ink
                            : ev.credibility >= 0.6 ? colors.inkSoft
                            : colors.inkMute;
            return (
              <div key={memberId}
                onClick={() => onOpenMember(memberId)}
                style={{
                  padding: "12px 14px",
                  background: colors.paper,
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 12,
                  alignItems: "baseline",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(242, 238, 228, 0.55)"}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.paper}>
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                  color: colors.inkSoft, fontWeight: 600,
                  letterSpacing: 0.3 }}>
                  {ev.id}
                </div>
                <div style={{
                  fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  color: colors.ink, lineHeight: 1.4 }}>
                  {ev.label}
                  <div style={{
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                    color: colors.inkMute, letterSpacing: 0.4, marginTop: 4 }}>
                    {ev.published} · cred {ev.credibility.toFixed(2)}
                  </div>
                </div>
                <div style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                  color: credColor, opacity: 0.6, lineHeight: 1 }}>
                  ▸
                </div>
              </div>
            );
          })}
        </div>

        {/* Reading hint */}
        <div style={{ marginTop: 22,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.inkMute, letterSpacing: 0.4, lineHeight: 1.6 }}>
          Click any member to view its full citation, source position, and reasoning contribution.
          <br/>
          Press <kbd style={{ fontFamily:"'JetBrains Mono', monospace",
            background: colors.paperDeep, padding: "1px 5px",
            borderRadius: 2, fontSize: 9.5, color: colors.inkSoft,
            border: `1px solid ${colors.ruleSoft}` }}>Esc</kbd> or click outside to close.
        </div>
      </div>
    </>
  );
}


// ============================================================================
// MASTHEAD — carries mode toggle
// ============================================================================

function Masthead({ mode, setMode, activeEvidenceCount, currentLabel, currentDate, isFullscreen, onToggleFullscreen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const isV04 = mode === "v04";
  return (
    <div style={{
      // Sticky to top so the masthead stays anchored as the user scrolls
      // through the case file (storylines, delta panel, etc.). Especially
      // important in fullscreen where the viewport is the entire screen
      // and the user navigates a long case-file by scroll.
      position: "sticky", top: 0, zIndex: 50,
      borderBottom: `1px solid ${colors.rule}`,
      background: colors.paper, padding: "16px 32px 18px" }}>
      {/* Top row: brand + case metadata on the left, mode toggle + fullscreen
          on the right. Metadata reads as one breadcrumb-style line:
            CASE FILE 001 · v0.4 · 13 EVIDENCE · 5 STORYLINES
          The version + counts are the orientation a reader needs at a glance;
          the per-column "EVIDENCE · X ITEMS" / "5 STORYLINES + μ" headers
          inside the SVG were redundant with this and were removed. */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        gap: 24, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap: 12, flexWrap:"wrap" }}>
          <div style={{ fontFamily:"'Fraunces', serif", fontWeight: 600, fontSize: 20,
            letterSpacing: -0.3, color: colors.ink, lineHeight: 1 }}>Trace</div>
          <div style={{ width: 1, height: 11, background: colors.rule, alignSelf:"center" }}/>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase", lineHeight: 1 }}>
            Case file 001
            <span style={{ color: colors.ruleSoft, margin: "0 7px" }}>·</span>
            <span style={{ color: colors.inkSoft }}>{isV04 ? "v0.4" : "v0.3"}</span>
            <span style={{ color: colors.ruleSoft, margin: "0 7px" }}>·</span>
            {activeEvidenceCount} evidence
            {isV04 && (
              <>
                <span style={{ color: colors.ruleSoft, margin: "0 7px" }}>·</span>
                5 storylines
              </>
            )}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap: 10, flexShrink: 0 }}>
          {/* v0.3 / v0.4 mode toggle */}
          <div style={{ display:"inline-flex", flexShrink: 0,
            border: `1px solid ${colors.rule}`, borderRadius: 2,
            background: colors.paper, padding: 1 }}>
            {[
              { key: "v03", label: "v0.3 · LLM Default" },
              { key: "v04", label: "v0.4 · Traced" },
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

          {/* Search button — between mode toggle and fullscreen.
              Same 28×28 chrome as fullscreen for visual symmetry.
              Opens the centered search overlay. */}
          <button onClick={()=>setSearchOpen(true)}
            title="Search highly contested claims"
            aria-label="Search claims"
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width: 28, height: 28,
              background: "transparent",
              color: colors.inkMute,
              border: `1px solid ${colors.rule}`,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.15s",
              padding: 0,
            }}
            onMouseEnter={(e)=>{
              e.currentTarget.style.color = colors.ink;
              e.currentTarget.style.borderColor = colors.ink;
            }}
            onMouseLeave={(e)=>{
              e.currentTarget.style.color = colors.inkMute;
              e.currentTarget.style.borderColor = colors.rule;
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.3"/>
              <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" stroke="currentColor"
                strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Fullscreen toggle — to the right of mode toggle. Triggers true
              browser fullscreen (whole page, not just graph), so the user can
              still scroll to read content beneath the graph. */}
          {onToggleFullscreen && (
            <button onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen page"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen page"}
              style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width: 28, height: 28,
                background: isFullscreen ? colors.ink : "transparent",
                color: isFullscreen ? colors.paper : colors.inkMute,
                border: `1px solid ${isFullscreen ? colors.ink : colors.rule}`,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.15s",
                padding: 0,
              }}
              onMouseEnter={(e)=>{
                if (!isFullscreen) {
                  e.currentTarget.style.color = colors.ink;
                  e.currentTarget.style.borderColor = colors.ink;
                }
              }}
              onMouseLeave={(e)=>{
                if (!isFullscreen) {
                  e.currentTarget.style.color = colors.inkMute;
                  e.currentTarget.style.borderColor = colors.rule;
                }
              }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d={isFullscreen
                  ? "M1 4 L1 1 L4 1 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"
                  : "M4 1 L1 1 L1 4 M7 1 L10 1 L10 4 M10 7 L10 10 L7 10 M4 10 L1 10 L1 7"}
                  stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Question block — red accent bar + eyebrow + h1 / input.
          - Default: red bar tall (matches eyebrow+h1 height + extra
            vertical padding); search icon sits next to the question.
          - Hover: full-width red-tinted backdrop spans the entire
            masthead row, search icon pushes to the far right.
          - Click: enters input-focused mode (an editable text field
            replaces the h1, autofocused, Esc / blur to exit).
          The eyebrow/h1 itself doesn't change typography; only the
          surrounding chrome animates. */}
      <QuestionBlock />

      {searchOpen && (
        <SearchOverlay
          theme="v04"
          onClose={()=>setSearchOpen(false)}
        />
      )}
    </div>
  );
}

// SearchOverlay — full-screen modal that appears when the masthead's
// search button is clicked. Fake-door for now: input + trending claims
// are interactive (cursor pointer, hover state) but don't actually
// navigate anywhere. Purpose is to show the *shape* of the search
// experience for highly contested claims.
//
// Theme parameter switches between v0.3 / v0.4 color tokens so the
// component can render correctly under either bundle.
function SearchOverlay({ theme = "v04", onClose }) {
  const c = theme === "v03" ? V03_colors : colors;
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Curated trending highly-contested claims — geopolitical / forensic
  // attribution questions with multiple competing storylines that fit
  // Trace's epistemic-infrastructure niche. The Nord Stream entry is
  // marked as currently-viewing.
  const trending = [
    { q: "Who attacked the Nord Stream pipelines?",
      meta: "Currently viewing", isCurrent: true },
    { q: "Did COVID-19 originate from a lab in Wuhan?",
      meta: "32 contributors · 4 storylines" },
    { q: "Who shot down MH17 over eastern Ukraine?",
      meta: "18 contributors · 3 storylines · resolved" },
    { q: "Did Saudi Arabia order the Khashoggi assassination?",
      meta: "21 contributors · 2 storylines" },
    { q: "What caused the casualties at Al-Ahli Hospital (Oct 2023)?",
      meta: "44 contributors · 5 storylines · contested" },
    { q: "Did the 2020 Beirut explosion involve Hezbollah munitions?",
      meta: "12 contributors · 3 storylines" },
  ];

  return (
    <div onClick={onClose}
      style={{
        position:"fixed", inset: 0, zIndex: 200,
        background: "rgba(26, 26, 26, 0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display:"flex", alignItems:"flex-start", justifyContent:"center",
        paddingTop: "12vh",
        animation: "fadeIn 0.18s ease-out",
      }}>
      <div onClick={(e)=>e.stopPropagation()}
        style={{
          width: "min(640px, 92vw)",
          background: c.paper,
          border: `1px solid ${c.rule}`,
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(26,26,26,0.30), 0 4px 12px rgba(26,26,26,0.10)",
          padding: "28px 32px 24px",
          animation: "fadeIn 0.22s cubic-bezier(.2,.7,.2,1)",
        }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9.5, color: c.inkMute, letterSpacing: 1.2,
          textTransform:"uppercase", fontWeight: 500,
          marginBottom: 14,
        }}>
          Trace · search highly contested claims
        </div>

        {/* Input field with magnifier icon prefix */}
        <div style={{
          display:"flex", alignItems:"center", gap: 12,
          padding: "12px 14px",
          background: c.paperDeep,
          border: `1px solid ${c.rule}`,
          borderRadius: 3,
          marginBottom: 22,
        }}>
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none"
            style={{ color: c.inkMute, flexShrink: 0 }}>
            <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" stroke="currentColor"
              strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="What contested claim do you want to investigate?"
            className="trace-search-input"
            style={{
              flex: 1, minWidth: 0,
              fontFamily:"'Fraunces', serif",
              fontSize: 15, fontWeight: 300, fontStyle:"italic",
              color: c.ink, letterSpacing: 0, lineHeight: 1.4,
              border:"none", outline:"none",
              background:"transparent",
              padding: 0, margin: 0,
            }}/>
          {/* Esc indicator */}
          <span style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: c.inkMute, letterSpacing: 0.8,
            padding: "2px 6px", borderRadius: 2,
            border: `1px solid ${c.rule}`, flexShrink: 0,
          }}>
            ESC
          </span>
        </div>

        {/* Trending section */}
        <div style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9, color: c.inkMute, letterSpacing: 1.2,
          textTransform:"uppercase", fontWeight: 500,
          marginBottom: 10,
        }}>
          Trending this week · {trending.length}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 2,
          marginLeft: -10, marginRight: -10 }}>
          {trending.map((t, i) => (
            <TrendingRow key={i} item={t} c={c}/>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          marginTop: 18, paddingTop: 12,
          borderTop: `1px solid ${c.ruleSoft}`,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: c.inkMute, letterSpacing: 0.5,
          display:"flex", justifyContent:"space-between" }}>
          <span>type to search · ↵ to open</span>
          <span style={{ fontStyle:"italic", fontFamily:"'Instrument Sans', sans-serif",
            textTransform:"none", letterSpacing: 0 }}>
            new claim record · request via contributor portal
          </span>
        </div>
      </div>
    </div>
  );
}

// Trending row — clickable in look, fake door in behavior. Hover state
// for tactile feel. The current-viewing marker uses a small dot to
// distinguish it from siblings without color signaling.
function TrendingRow({ item, c }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        display:"flex", alignItems:"center", gap: 12,
        padding: "10px 12px",
        cursor: item.isCurrent ? "default" : "pointer",
        background: hover && !item.isCurrent ? c.paperDeep : "transparent",
        borderRadius: 2,
        transition: "background 0.12s",
      }}>
      {/* Bullet — current item gets a filled square; others a small ring */}
      {item.isCurrent ? (
        <div style={{
          width: 6, height: 6, background: c.primary, borderRadius: 1,
          flexShrink: 0,
        }}/>
      ) : (
        <div style={{
          width: 6, height: 6, border: `1px solid ${c.inkMute}`,
          borderRadius: "50%", flexShrink: 0,
        }}/>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily:"'Fraunces', serif",
          fontSize: 15, fontWeight: 400, fontStyle:"italic",
          color: hover && !item.isCurrent ? c.ink : c.ink,
          lineHeight: 1.3, letterSpacing: -0.2,
        }}>
          {item.q}
        </div>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9, color: item.isCurrent ? c.primary : c.inkMute,
          letterSpacing: 0.5, marginTop: 3,
          textTransform:"uppercase",
        }}>
          {item.meta}
        </div>
      </div>
      {!item.isCurrent && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            opacity: hover ? 1 : 0.4,
            transform: hover ? "translateX(2px)" : "translateX(0)",
            transition: "opacity 0.15s, transform 0.15s",
            flexShrink: 0,
          }}>
          <path d="M2 5 L8 5 M5 2 L8 5 L5 8"
            stroke={hover ? c.primary : c.inkMute}
            strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function QuestionBlock() {
  return (
    <div style={{
      marginTop: 14,
      paddingTop: 4, paddingBottom: 4,
      display: "flex", alignItems: "stretch", gap: 14,
    }}>
      <div style={{ width: 3, background: colors.primary, flexShrink: 0 }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.primary, letterSpacing: 1.4,
          textTransform:"uppercase", fontWeight: 500, marginBottom: 5 }}>
          Converged · institutionally open
        </div>
        <h1 style={{ fontFamily:"'Fraunces', serif",
          fontSize: 20, fontWeight: 400, fontStyle:"italic", color: colors.ink,
          letterSpacing: -0.4, lineHeight: 1.2, margin: 0,
          textWrap: "balance" }}>
          Who attacked the Nord Stream pipelines on 26 September 2022?
        </h1>
      </div>
    </div>
  );
}

// Spacer to keep block-scope tidy (above QuestionBlock was injected
// from inside the Masthead — close the original Masthead component
// definition cleanly).

// ============================================================================
// TIMELINE OVERLAY — floats at bottom of graph stage. Shared by v0.3 and
// v0.4; the Experience passes the active timeline (TIMELINE_V03 or
// TIMELINE_V04) via props.
// ============================================================================

function TimelineOverlay({ idx, setIdx, timeline, turningPoints,
                          playing, paused, onPlayToggle, onStop }) {
  // Three-state transport:
  //   idle    → only PLAY visible
  //   playing → PAUSE + STOP (animation running)
  //   paused  → RESUME + STOP (idx held, user examines current frame)
  // The RESUME state is what makes pause distinguishable from stop in
  // the UI. After Pause, buttons stay in "active timeline mode" so the
  // user knows they can either continue playback (Resume) or fully
  // reset (Stop) — not just go back to the initial idle view.
  const transportState = playing ? "playing" : paused ? "paused" : "idle";
  return (
    <div style={{ position:"absolute", left: 20, right: 20, bottom: 8, zIndex: 9,
      pointerEvents:"none" }}>
      <div style={{ pointerEvents:"auto", width: "100%",
        padding: "10px 28px 10px 16px",
        background: "rgba(250, 248, 243, 0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        border: `1px solid rgba(217, 212, 199, 0.8)`, borderRadius: 3,
        boxShadow: "0 12px 32px rgba(26, 26, 26, 0.06), 0 2px 6px rgba(26, 26, 26, 0.03)",
        display:"flex", alignItems:"stretch", gap: 16 }}>
        {/* TRANSPORT CONTROLS — left zone. */}
        <div style={{
          display:"flex", alignItems:"center", gap: 6,
          flexShrink: 0,
        }}>
          {transportState === "idle" && onPlayToggle && (
            <TransportButton
              icon="play"
              label="PLAY"
              onClick={onPlayToggle}
              tooltip="Play timeline — watch the distribution evolve"
            />
          )}
          {transportState === "playing" && onPlayToggle && (
            <TransportButton
              icon="pause"
              label="PAUSE"
              onClick={onPlayToggle}
              tooltip="Pause — keep current frame, examine"
            />
          )}
          {transportState === "paused" && onPlayToggle && (
            <TransportButton
              icon="play"
              label="RESUME"
              onClick={onPlayToggle}
              tooltip="Resume playback from current frame"
            />
          )}
          {(transportState === "playing" || transportState === "paused") && onStop && (
            <TransportButton
              icon="stop"
              onClick={onStop}
              tooltip="Stop — show full timeline (default view)"
              compact
            />
          )}
        </div>

        {/* Vertical rule separating controls from the date axis */}
        <div style={{
          width: 1,
          background: "rgba(217, 212, 199, 0.7)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}/>

        {/* TIMELINE BAR — fills remaining horizontal space.
            Inner horizontal padding (32px each side) gives the first
            tick ("Rupture") and the last ("Today" + date) breathing
            room from the panel's inner edges. Without this, the tick
            labels (which are translateX(-50%) on the track edges) half-
            overflow the track and visually crowd the panel border. */}
        <div style={{ flex: 1, minWidth: 0,
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding: "0 32px" }}>
          <TimelineBar idx={idx} setIdx={setIdx} timeline={timeline}
                       turningPoints={turningPoints} />
        </div>
      </div>
    </div>
  );
}

// Reusable transport-control button — same chrome as the v0.3/v0.4 toggle
// (black background, paper foreground), so play/pause/stop all read as
// the same family of authoritative interactive controls.
function TransportButton({ icon, label, onClick, tooltip, compact }) {
  return (
    <button onMouseDown={(e)=>e.stopPropagation()}
      onClick={(e)=>{ e.stopPropagation(); onClick(); }}
      title={tooltip}
      aria-label={tooltip}
      style={{
        display:"inline-flex", alignItems:"center", gap: compact ? 0 : 6,
        height: 24,
        padding: compact ? "0" : "0 9px 0 7px",
        width: compact ? 24 : "auto",
        justifyContent: compact ? "center" : "flex-start",
        borderRadius: 2,
        border: `1px solid ${colors.ink}`,
        background: colors.ink, color: colors.paper,
        cursor:"pointer", flexShrink: 0,
        transition:"opacity 0.15s",
      }}
      onMouseEnter={(e)=>{ e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e)=>{ e.currentTarget.style.opacity = "1"; }}>
      {icon === "play" && (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
          <path d="M1.5 1 L8 5 L1.5 9 Z" fill={colors.paper}/>
        </svg>
      )}
      {icon === "pause" && (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
          <rect x="1.5" y="1" width="2" height="8" fill={colors.paper}/>
          <rect x="5.5" y="1" width="2" height="8" fill={colors.paper}/>
        </svg>
      )}
      {icon === "stop" && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <rect x="1" y="1" width="7" height="7" fill={colors.paper}/>
        </svg>
      )}
      {label && (
        <span style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing: 0.7,
          textTransform:"uppercase", fontWeight: 500,
        }}>{label}</span>
      )}
    </button>
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

  // The 13 anchor facts grouped by structural role.
  // ANCHORS (global) is source of truth for fact text + time. This local map
  // adds metadata: which group each fact belongs to, and what consequence
  // each fact carries (what it rules out, points to, or establishes).
  const GROUPS = [
    { id:"event",
      label:"What happened",
      caption:"Pure observation. The physical event, undisputed across all fourteen language ecosystems we surveyed.",
      ids:["F1","F2"] },
    { id:"act",
      label:"What the act required",
      caption:"Mechanism + forensics. These facts rule out specific theories of execution and point to who could physically have done it.",
      ids:["F3","F12","F7","F8"] },
    { id:"surround",
      label:"What surrounded it",
      caption:"Political and judicial context. Motive, foreknowledge, public endorsement, and post-event court findings.",
      ids:["F4","F6","F11","F5","F9","F10","F13"] },
  ];

  // Consequence per fact — rescued / synthesized from the original
  // CausalChainSection.jsx mechanism-constraints layer. Each fact is now
  // explicit about its inferential work.
  //   kind: rules_out | points_to | supports | establishes
  const CONSEQUENCE = {
    F1: null,
    F2: { kind:"rules_out",   text:"HMX is military-grade — non-state actors structurally excluded" },
    F3: { kind:"rules_out",   text:"sonar-triggered remote one-shot (Hersh's mechanism) falsified" },
    F12:{ kind:"rules_out",   text:"full SEAL-level operation; consistent with resource-limited team" },
    F7: { kind:"points_to",   text:"Ukrainian-connected operators — independent forensic chain through three jurisdictions" },
    F8: { kind:"supports",    text:"named operators in custody / under prosecution" },
    F4: { kind:"establishes", text:"US political motive on the public record" },
    F5: { kind:"establishes", text:"post-event endorsement at senior US level" },
    F6: { kind:"establishes", text:"foreknowledge in the CIA → German channel before the act" },
    F11:{ kind:"establishes", text:"Polish foreign minister's public endorsement, hours after the blasts" },
    F9: { kind:"supports",    text:"\"foreign government intelligence agency\" — judicial classification (Germany)" },
    F10:{ kind:"supports",    text:"\"organized action by services of a warring state\" — second jurisdiction (Poland)" },
    F13:{ kind:"establishes", text:"investigative response fragmented — three jurisdictions, three outcomes" },
  };

  // Common trunk — what the 13 facts together force every viable storyline
  // to accept. Recovered from original CausalChainSection.jsx.
  const TRUNK = [
    "Ukrainian-connected operators physically placed the charges",
    "Military-grade explosives externally supplied (not domestic Ukrainian)",
    "Manual placement at 70–80 m depth, by a resource-limited team",
  ];

  // Storyline-anchor coverage — canonical values from STORYLINES const (above).
  // 5 storylines (μ is a parallel process subclaim, not a storyline, and lives
  // in SuppressionAndJudicial). δ rejecting the trunk is the structural reason
  // δ is excluded — it can't hold the joint output of the 13 facts.
  const COVERAGE = [
    { id:"alpha",   glyph:"α", label:"Ukrainian military bypass",                holds:"all 13", breaks:null,           trunk:"accepts",          color: colors.primary, pct:"70%" },
    { id:"epsilon", glyph:"ε", label:"Unidentified actor / candidate set incomplete", holds:"n/a",   breaks:"—",            trunk:"holds (depends)",  color: colors.inkSoft, pct:"19%" },
    { id:"zeta",    glyph:"ζ", label:"UK-layer, under-examined",                 holds:"n/a",   breaks:"—",            trunk:"holds (depends)",  color: colors.inkSoft, pct:"6%" },
    { id:"beta",    glyph:"β", label:"US-led operation",                          holds:"3/13",  breaks:"F3, F7, F12",  trunk:"accepts",          color: colors.inkSoft, pct:"5%" },
    { id:"delta",   glyph:"δ", label:"Russian self-sabotage",                     holds:"0/13",  breaks:"F7",           trunk:"REJECTS",          color: colors.muted,   pct:"—",  excluded: true },
  ];

  const conseqStyle = (kind) => {
    if (kind === "rules_out")   return { color: colors.primary,    glyph:"✕", label:"rules out" };
    if (kind === "points_to")   return { color: colors.secondary,  glyph:"→", label:"points to" };
    if (kind === "supports")    return { color: colors.secondary,  glyph:"+", label:"supports" };
    if (kind === "establishes") return { color: colors.warnDeep,   glyph:"●", label:"establishes" };
    return { color: colors.inkMute, glyph:"·", label:"" };
  };

  return (
    <div style={{ padding:"56px 56px 48px", background: colors.paper }}>
      <Rule />

      {/* Header */}
      <div style={{ marginTop: 36, marginBottom: 32, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 56, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Foundation
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.15, letterSpacing: -0.4, color: colors.ink }}>
            Thirteen facts every storyline must accommodate.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
          color: colors.inkMute, lineHeight: 1.55 }}>
          Anchors not disputed in any of the fourteen languages we surveyed. Below: the facts grouped by their structural role. Each fact carries an explicit consequence — what it rules out, what it points to, what it supports, what it establishes. The three groups together force the common trunk every viable reconstruction must accept.
        </div>
      </div>

      {/* 3 grouped fact panels */}
      <div style={{ display:"flex", flexDirection:"column", gap: 18, marginBottom: 36 }}>
        {GROUPS.map(group => (
          <div key={group.id} style={{
            border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden",
            background: colors.paper }}>

            {/* Group header */}
            <div style={{ padding:"16px 22px",
              background: colors.paperDeep,
              borderBottom: `1px solid ${colors.ruleSoft}`,
              display:"grid", gridTemplateColumns:"1fr auto", gap: 24, alignItems:"baseline" }}>
              <div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 19,
                  color: colors.ink, lineHeight: 1.25, letterSpacing: -0.2,
                  marginBottom: 4 }}>
                  {group.label}
                </div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                  color: colors.inkMute, lineHeight: 1.5 }}>
                  {group.caption}
                </div>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
                fontWeight: 500, whiteSpace:"nowrap" }}>
                {group.ids.length} facts
              </div>
            </div>

            {/* Fact rows */}
            {group.ids.map((fid, ri) => {
              const fact = ANCHORS.find(a => a.id === fid);
              if (!fact) return null;
              const conseq = CONSEQUENCE[fid];
              const cs = conseq ? conseqStyle(conseq.kind) : null;
              const isFlagged = fact.flagged;
              const isHover = hovered === fid;

              return (
                <div key={fid}
                  onMouseEnter={()=>setHovered(fid)}
                  onMouseLeave={()=>setHovered(null)}
                  style={{
                    display:"grid", gridTemplateColumns:"54px 130px 1fr",
                    gap: 18, padding:"14px 22px",
                    borderTop: ri > 0 ? `1px solid ${colors.ruleSoft}` : "none",
                    background: isHover ? "rgba(242, 238, 228, 0.55)"
                                : isFlagged ? "rgba(184, 144, 46, 0.04)"
                                : "transparent",
                    transition:"background 0.15s",
                    alignItems:"baseline" }}>

                  {/* F# + flag */}
                  <div style={{ display:"flex", alignItems:"baseline", gap: 5 }}>
                    <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                      color: isFlagged ? colors.warnDeep : colors.inkSoft,
                      fontWeight: 600, letterSpacing: 0.4 }}>
                      {fid}
                    </span>
                    {isFlagged && (
                      <span title="Structural anchor — does independent work against specific storylines"
                        style={{ fontSize: 9, color: colors.warnDeep,
                          lineHeight: 1, marginLeft: 1 }}>◆</span>
                    )}
                  </div>

                  {/* Time */}
                  <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                    color: colors.inkMute, letterSpacing: 0.3, lineHeight: 1.4 }}>
                    {fact.time}
                  </div>

                  {/* Fact + consequence */}
                  <div>
                    <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                      color: colors.ink, lineHeight: 1.5,
                      marginBottom: cs ? 7 : 0 }}>
                      {fact.fact}
                    </div>
                    {cs && (
                      <div style={{
                        display:"flex", alignItems:"baseline", gap: 8,
                        fontFamily:"'JetBrains Mono', monospace" }}>
                        <span style={{
                          fontSize: 9, fontWeight: 600, letterSpacing: 0.9,
                          textTransform:"uppercase", color: cs.color,
                          padding:"1px 6px",
                          background:`${cs.color}12`,
                          border:`1px solid ${cs.color}40`,
                          borderRadius: 1,
                          whiteSpace:"nowrap" }}>
                          {cs.glyph} {cs.label}
                        </span>
                        <span style={{
                          fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
                          color: colors.inkSoft, lineHeight: 1.45 }}>
                          {conseq.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Common trunk callout — what every viable storyline must accept.
          Recovered from CausalChainSection.jsx; sets up the connection
          to SuppressionAndJudicial below ("the trunk is settled; the
          disagreement is over what's above it"). */}
      <div style={{
        marginBottom: 28,
        padding:"22px 28px",
        background: "rgba(122, 106, 84, 0.06)",
        border: `1px solid rgba(122, 106, 84, 0.20)`,
        borderLeft: `4px solid ${colors.meta}`,
        borderRadius: 2 }}>
        <div style={{
          fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.meta, letterSpacing: 1.0, textTransform:"uppercase",
          fontWeight: 600, marginBottom: 14 }}>
          Common trunk · what every viable storyline must accept
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap: 10 }}>
          {TRUNK.map((t, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"baseline", gap: 14,
              fontFamily:"'Fraunces', serif",
              fontSize: 16.5, lineHeight: 1.4, color: colors.ink,
              letterSpacing: -0.05 }}>
              <span style={{
                fontFamily:"'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 600,
                color: colors.meta, opacity: 0.75,
                minWidth: 24, lineHeight: 1.4 }}>
                0{i+1}
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storyline coverage table — extended with trunk acceptance column.
          δ's REJECTS in the trunk column makes its structural exclusion
          legible: it's not just losing on individual facts, it can't hold
          the joint output of those facts. */}
      <div style={{
        background: colors.paperDeep,
        border: `1px solid ${colors.ruleSoft}`, borderRadius: 2,
        overflow:"hidden" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"50px 1fr 100px 130px 120px 60px",
          gap: 14, padding:"10px 22px",
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase" }}>
          <span></span>
          <span>Storyline</span>
          <span>Holds</span>
          <span>Breaks</span>
          <span>Common trunk</span>
          <span style={{ textAlign:"right" }}>Coverage</span>
        </div>
        {COVERAGE.map(c => (
          <div key={c.id} style={{
            display:"grid",
            gridTemplateColumns:"50px 1fr 100px 130px 120px 60px",
            gap: 14, padding:"14px 22px",
            background: colors.paper, alignItems:"baseline",
            borderTop: `1px solid ${colors.ruleSoft}` }}>
            <span style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
              fontSize: 22, color: c.color, fontWeight: 400, lineHeight: 1 }}>
              {c.glyph}
            </span>
            <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13.5,
              color: c.excluded ? colors.inkMute : colors.ink,
              textDecoration: c.excluded ? "line-through" : "none",
              textDecorationColor: colors.muted }}>
              {c.label}
            </span>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
              color: c.holds === "all 13" ? colors.ink : colors.inkSoft,
              fontWeight: 500 }}>
              {c.holds}
            </span>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
              color: c.breaks ? colors.primary : colors.inkMute,
              fontWeight: c.breaks ? 600 : 400 }}>
              {c.breaks ? `breaks ${c.breaks}` : "—"}
            </span>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
              color: c.trunk === "REJECTS" ? colors.primary : colors.inkSoft,
              fontWeight: c.trunk === "REJECTS" ? 600 : 400,
              letterSpacing: 0.3 }}>
              {c.trunk}
            </span>
            <span style={{ fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
              color: c.color, fontVariantNumeric:"tabular-nums", textAlign:"right" }}>
              {c.pct}
            </span>
          </div>
        ))}
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
      {/* Header — clickable; tighter padding when collapsed since the leverage
          row sits below it as part of the collapsed view */}
      <div onClick={onToggle}
        style={{
          padding: isOpen
            ? (isAlpha ? "22px 30px 22px" : "20px 26px 20px")
            : (isAlpha ? "22px 30px 14px" : "20px 26px 12px"),
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
            {story.id === "alpha" ? "α" : story.id === "beta" ? "β" : story.id === "delta" ? "δ" : story.id === "epsilon" ? "ε" : story.id === "zeta" ? "ζ" : "μ"}
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

      {/* COLLAPSED-STATE LEVERAGE POINT — only shown when card is closed.
          Surfaces "what would shift this reading" without making the reader
          expand the card. Indented to align with the storyline label, not
          the coverage number. */}
      {!isOpen && story.unexplained && (
        <div onClick={onToggle}
          style={{
            cursor: "pointer",
            padding: isAlpha
              ? "0 30px 18px calc(100px + 30px + 24px)"
              : "0 26px 16px calc(82px + 26px + 24px)",
          }}>
          <div style={{
            display:"flex", alignItems:"flex-start", gap: 10,
            paddingTop: 12,
            borderTop: `1px solid ${colors.ruleSoft}`,
          }}>
            <div style={{
              width: 5, height: 5,
              background: colors.warn,
              transform: "rotate(45deg)",
              flexShrink: 0,
              marginTop: 6,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace",
                fontSize: 9, color: colors.warnDeep, letterSpacing: 0.9,
                textTransform:"uppercase", fontWeight: 600, marginBottom: 4 }}>
                Leverage point
              </div>
              <div style={{
                fontFamily:"'Instrument Sans', sans-serif",
                fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.5,
              }}>
                {story.unexplained}
              </div>
            </div>
          </div>
        </div>
      )}

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
      {/* LEVERAGE POINT — promoted to FIRST position with hero treatment.
          This is the single most important piece of info inside any
          expansion: what could still shift this storyline, what is the
          structural weak point. Larger Fraunces body, full-width amber
          panel, eyebrow + thick left stripe make this the visual anchor
          of the expansion. */}
      {story.unexplained && (
        <div style={{
          padding: "20px 24px 22px",
          marginBottom: 28,
          background: "rgba(184, 144, 46, 0.06)",
          borderLeft: `4px solid ${colors.warn}`,
          border: `1px solid rgba(184, 144, 46, 0.25)`,
          borderLeftWidth: 4,
          borderRadius: 2,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 8, height: 8,
              background: colors.warn,
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}/>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              color: colors.warnDeep, letterSpacing: 1.0, textTransform:"uppercase",
              fontWeight: 600 }}>
              Leverage point — what would shift this reading
            </div>
          </div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 17, lineHeight: 1.45,
            color: colors.ink, letterSpacing: -0.1,
          }}>
            {story.unexplained}
          </div>
        </div>
      )}

      <NarrativeBlock narrative={story.narrative} timeline={story.narrativeTimeline} isHero={story.isHero} />

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
// SUB-CLAIM BREAKDOWN — decomposes the lead storyline into component claims
// with stacked branch bars. Design principles after Mian review:
//   • No top divider; the section opens with a narrative H2 instead.
//   • Luminance-gradient palette (deepest → lightest). Colorblind-safe:
//     readers can separate branches by brightness alone, not only hue.
//   • Numbers are emphasized, right-aligned to a fixed column, in pure ink.
//   • No "w 0.30" weight figure; load/decorative tag carries that signal.
//   • No "ALT" label; a single-line layout per alternative makes the tail
//     visually distinct from the leading claim above the bar.
// ============================================================================

// Luminance-gradient palette. Position 0 is the brand primary; downstream
// positions step progressively lighter so the leading branch always reads
// first, and the figure degrades gracefully to grayscale.
const SUBCLAIM_BRANCH_PALETTE = [
  "#A03A2C", // 0 — brand terracotta (leading branch in every row)
  "#4E6B85", // 1 — deep slate blue
  "#9C8456", // 2 — warm khaki
  "#BFC4B8", // 3 — pale warm gray-green
];

function SubClaimBreakdown() {
  const data = SUBCLAIMS_V04;
  const palette = SUBCLAIM_BRANCH_PALETTE;

  // Subclaim weights are PERCENTAGES WITHIN α — they sum to 100% inside α.
  // α itself is 70% of the total case (canonical STORYLINES coverage).
  // Load-bearing (A+B+C) = 70% of α; decorative (D+E+F) = 30% of α.
  // The label below names these as "share within α" to remove the
  // ambiguity readers had between case-share and α-share.
  const loadBearing = data.subclaims.filter(s => s.role === "load");
  const decorative  = data.subclaims.filter(s => s.role === "decor");
  const loadWeight  = loadBearing.reduce((s, x) => s + x.weight, 0);
  const decorWeight = decorative.reduce((s, x) => s + x.weight, 0);

  // Short labels — replace verbose names so the row scans at-a-glance.
  const SHORT_NAMES = {
    A: "Executor",
    B: "Authorization",
    C: "Non-advancement",
    D: "Polish role",
    E: "CIA foreknowledge",
    F: "Funding source",
  };

  // Branch geometry — two visually-separated groups (load / decorative),
  // three branches per group, 45 svg units apart.
  const branches = data.subclaims.map((sc, i) => {
    const isLoad = sc.role === "load";
    const idxInGroup = isLoad ? i : i - 3;
    const y = isLoad
      ? 50 + idxInGroup * 45    // load: y = 50, 95, 140
      : 220 + idxInGroup * 45;  // decor: y = 220, 265, 310
    return { ...sc, y, isLoad };
  });

  return (
    <div style={{ padding: "48px 56px 56px", background: colors.paper }}>
      <Rule />

      {/* Compact header — no big italic prose paragraph; the storyline label
          and leverage point already appeared on the α card directly above. */}
      <div style={{ marginTop: 32, marginBottom: 28, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 56, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
            marginBottom: 14 }}>
            Inside α · how it decomposes
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.12, letterSpacing: -0.4, color: colors.ink }}>
            What does the lead storyline rest on?
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
          color: colors.inkMute, lineHeight: 1.55 }}>
          α covers 70% of the case. Below: how that 70% is distributed across six structural sub-claims. Three load-bearing claims (A, B, C) carry most of α's weight — if any of them flips, α changes shape. Three decorative claims (D, E, F) refine the picture but α survives without them. The percentages on each row are <em>within α</em>, not of the total case.
        </div>
      </div>

      {/* ───────── TWO-COLUMN LAYOUT ─────────
          LEFT: compact branch graph (visual at-a-glance)
          RIGHT: 6 detailed subclaim rows with branch alternatives
          Side-by-side reduces vertical scrolling vs the previous
          stacked layout. */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)",
        gap: 56,
        alignItems: "start",
      }}>

        {/* ─────── LEFT — branch graph + scaffold ─────── */}
        <div style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div style={{
            position: "relative", width: "100%",
            aspectRatio: "380 / 360",
          }}>
            {/* SVG: trunk + branch lines */}
            <svg viewBox="0 0 380 360"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <line x1="62" y1="180" x2="100" y2="180"
                    stroke={colors.ink} strokeWidth="2"/>
              {branches.map(b => (
                <g key={b.letter}>
                  <path d={`M 100 180 C 160 180 180 ${b.y} 230 ${b.y}`}
                        stroke={b.isLoad ? colors.ink : colors.inkMute}
                        strokeWidth={1 + b.weight * 9}
                        strokeLinecap="round"
                        fill="none"
                        opacity={b.isLoad ? 1 : 0.7}/>
                  <circle cx="230" cy={b.y} r="2.6"
                          fill={b.isLoad ? colors.ink : colors.inkMute}
                          opacity={b.isLoad ? 1 : 0.7}/>
                </g>
              ))}
            </svg>

            {/* Root label — α and 70% (canonical) at the trunk's left end */}
            <div style={{
              position: "absolute", left: "1%", top: "50%",
              transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", alignItems: "flex-start",
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontStyle: "italic",
                fontSize: 32, fontWeight: 400, color: colors.primary,
                lineHeight: 0.95, letterSpacing: -0.5,
              }}>α</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 600, color: colors.ink,
                letterSpacing: 0.4, marginTop: 6,
                fontVariantNumeric: "tabular-nums",
              }}>70%</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8.5, color: colors.inkMute,
                letterSpacing: 0.6, marginTop: 2,
                textTransform: "uppercase",
              }}>of case</div>
            </div>

            {/* Group labels at top + bottom right */}
            <div style={{
              position: "absolute", right: 0, top: 0,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
              letterSpacing: 1, textTransform: "uppercase",
              color: colors.inkMute, fontWeight: 500,
            }}>
              Load-bearing · {Math.round(loadWeight * 100)}% of α
            </div>
            <div style={{
              position: "absolute", right: 0, bottom: 0,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
              letterSpacing: 1, textTransform: "uppercase",
              color: colors.inkMute, fontWeight: 500,
            }}>
              Decorative · {Math.round(decorWeight * 100)}% of α
            </div>

            {/* Branch endpoint labels */}
            {branches.map(b => (
              <div key={b.letter} style={{
                position: "absolute",
                left: `${(238 / 380) * 100}%`,
                top: `${(b.y / 360) * 100}%`,
                right: 0,
                transform: "translateY(-50%)",
                display: "flex", alignItems: "baseline", gap: 8,
                paddingLeft: 6,
              }}>
                <span style={{
                  fontFamily: "'Fraunces', serif", fontStyle: "italic",
                  fontSize: 16, fontWeight: 400,
                  color: b.isLoad ? colors.ink : colors.inkSoft,
                  lineHeight: 1, width: 11,
                  letterSpacing: -0.2,
                }}>{b.letter}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: 0.7, textTransform: "uppercase",
                  color: b.isLoad ? colors.ink : colors.inkMute,
                  flex: 1, minWidth: 0,
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{SHORT_NAMES[b.letter]}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  fontWeight: 600,
                  color: b.isLoad ? colors.ink : colors.inkSoft,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: 0.3,
                }}>{Math.round(b.weight * 100)}%</span>
              </div>
            ))}
          </div>

          {/* Reading hint under the graph */}
          <div style={{
            marginTop: 18, padding: "12px 14px",
            background: colors.paperDeep, borderRadius: 2,
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 11.5,
            color: colors.inkSoft, lineHeight: 1.55,
          }}>
            Stroke thickness encodes weight within α. Bold = load-bearing; faded = decorative. The percentages each branch carries are <strong style={{color: colors.ink}}>shares of α</strong> — the inside of α's 70% — not shares of the whole case.
          </div>
        </div>

        {/* ─────── RIGHT — 6 detailed subclaim rows ─────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {data.subclaims.map((sc) => (
            <SubClaimRow key={sc.letter} sc={sc} palette={palette} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Fixed right-column width for all probability numbers — keeps the reader's
// eye anchored on a vertical axis they can scan.
const SUBCLAIM_NUMBER_COL = 56;

function SubClaimRow({ sc, palette }) {
  const [hovered, setHovered] = useState(null);
  const leading = sc.branches.find(b => b.isCurrent) || sc.branches[0];
  const alts    = sc.branches.filter(b => b !== leading);
  const leadIdx = sc.branches.indexOf(leading);
  const isLoad  = sc.role === "load";

  return (
    <div>
      {/* Header — letter · name · role tag (matches overlay's MONO tag +
          uppercase letterSpacing for structural metadata) */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
          fontSize: 16, color: colors.inkMute, letterSpacing: -0.2,
          minWidth: 12,
        }}>
          {sc.letter}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
          color: colors.inkSoft, letterSpacing: 1.3,
          textTransform: "uppercase", fontWeight: 500,
        }}>
          {sc.name}
        </span>
        <Tag tone={isLoad ? "default" : "mute"}>
          {isLoad ? "Load-bearing" : "Decorative"}
        </Tag>
      </div>

      {/* Leading branch — head block matching overlay's italic Fraunces
          summary, with the probability as the biggest visual element. */}
      <div style={{
        display: "flex", alignItems: "baseline", gap: 16,
        marginBottom: 10,
      }}>
        <div style={{
          flex: 1,
          fontFamily: "'Fraunces', serif", fontStyle: "italic",
          fontSize: 17, fontWeight: 400, lineHeight: 1.3,
          color: colors.ink, letterSpacing: -0.2,
          textWrap: "balance",
        }}>
          {leading.text}
        </div>
        <div style={{
          width: SUBCLAIM_NUMBER_COL,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18, fontWeight: 700,
          color: colors.primary, letterSpacing: 0.3,
          textAlign: "right", fontVariantNumeric: "tabular-nums",
          flexShrink: 0, lineHeight: 1,
        }}>
          {Math.round(leading.likelihood * 100)}<span style={{
            fontSize: 11, fontWeight: 600, opacity: 0.65, marginLeft: 1,
          }}>%</span>
        </div>
      </div>

      {/* Stacked distribution bar — matches overlay's 7px bar style.
          Leading segment first (not in natural branch order) so the
          bar reads left-to-right as "dominant → alternatives". */}
      <div style={{
        display: "flex", width: "100%", height: 7, borderRadius: 1,
        overflow: "hidden", background: "rgba(242, 238, 228, 0.6)",
        marginBottom: 12,
      }}>
        {/* Leading first */}
        <div
          onMouseEnter={() => setHovered(leadIdx)}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: `${leading.likelihood * 100}%`,
            background: palette[leadIdx] || palette[0],
            opacity: (hovered !== null && hovered !== leadIdx) ? 0.28 : 1,
            borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
            transition: "opacity 0.15s",
          }}
        />
        {/* Alternatives in order */}
        {alts.map((br) => {
          const origIdx = sc.branches.indexOf(br);
          const isHovered = hovered === origIdx;
          const otherHovered = hovered !== null && !isHovered;
          return (
            <div
              key={origIdx}
              onMouseEnter={() => setHovered(origIdx)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: `${br.likelihood * 100}%`,
                background: palette[origIdx] || palette[palette.length - 1],
                opacity: otherHovered ? 0.28 : 1,
                borderRight: `1px solid rgba(250, 248, 243, 0.6)`,
                transition: "opacity 0.15s",
              }}
            />
          );
        })}
      </div>

      {/* Alternatives — same grid shape as overlay's 5-storyline rows:
          color chip · text · probability (right-aligned to shared column).
          No hover-driven color swaps; only subtle ink-shift + dim of others. */}
      {alts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {alts.map((br) => {
            const origIdx = sc.branches.indexOf(br);
            const isHovered = hovered === origIdx;
            const otherHovered = hovered !== null && !isHovered;
            return (
              <div
                key={origIdx}
                onMouseEnter={() => setHovered(origIdx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: `9px 1fr ${SUBCLAIM_NUMBER_COL}px`,
                  gap: 12,
                  alignItems: "baseline",
                  opacity: otherHovered ? 0.4 : 1,
                  transition: "opacity 0.15s",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 7, height: 7,
                  background: palette[origIdx] || palette[palette.length - 1],
                  alignSelf: "center", transform: "translateY(-2px)",
                  outline: isHovered ? `1.5px solid ${colors.ink}` : "none",
                  outlineOffset: 1,
                  transition: "outline 0.15s",
                }} />
                <span style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 12.5, lineHeight: 1.45,
                  color: isHovered ? colors.ink : colors.inkSoft,
                  fontWeight: 400,
                  textWrap: "balance",
                  transition: "color 0.15s",
                }}>
                  {br.text}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 600,
                  color: isHovered ? colors.ink : colors.inkSoft,
                  letterSpacing: 0.3,
                  textAlign: "right", fontVariantNumeric: "tabular-nums",
                  transition: "color 0.15s",
                }}>
                  {Math.round(br.likelihood * 100)}<span style={{
                    fontSize: 9.5, opacity: 0.65, marginLeft: 1,
                  }}>%</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
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

// ============================================================================
// AUTO-SCROLLER — wraps a horizontal-scroll container with a slow,
// continuous left-to-right autoscroll. Pauses while the mouse is inside
// the container OR while the user is interacting with the scrollbar.
// When the scroll reaches the right edge, it snaps back to the start
// after a brief pause (so the loop is legible, not jarring).
// ============================================================================
function AutoScroller({ children, minWidth, speed = 0.4, restartPauseMs = 1200 }) {
  const ref = React.useRef(null);
  const pausedRef = React.useRef(false);
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    let lastTs = 0;
    let resetTimeout = null;

    const tick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (!pausedRef.current && el) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          if (el.scrollLeft >= max - 1) {
            // At end — pause briefly, then jump back to start.
            pausedRef.current = true;
            resetTimeout = setTimeout(() => {
              if (el) el.scrollLeft = 0;
              pausedRef.current = false;
            }, restartPauseMs);
          } else {
            el.scrollLeft += speed * dt;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [speed, restartPauseMs]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => { pausedRef.current = true; setIsHover(true); }}
      onMouseLeave={() => { pausedRef.current = false; setIsHover(false); }}
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: 16,
        WebkitOverflowScrolling: "touch",
        position: "relative",
      }}>
      {children}
      {/* Hover hint — small badge that appears in the corner when paused */}
      {isHover && (
        <div style={{
          position: "absolute", top: 8, right: 12,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 0.6,
          background: "rgba(250, 248, 243, 0.92)",
          padding: "3px 7px", borderRadius: 1,
          border: `1px solid ${colors.ruleSoft}`,
          pointerEvents: "none",
          letterSpacing: 0.7,
          textTransform: "uppercase",
        }}>
          paused · scroll resumes when you move away
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SURVIVING CAUSAL CHAIN — α's narrative timeline, with audit overlays at
// nodes where evidence forces a constraint or branch reading.
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
        {/* Auto-scrolls left-to-right at a slow, readable pace; pauses on
            hover or when the user manually drags the scrollbar. When the
            scroll reaches the end, it resets to the start. */}
        <AutoScroller minWidth={nodes.length * 220 + 260}>
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
        </AutoScroller>

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
  // All storylines default to collapsed — reader must expand to drill in.
  // Each card surfaces its leverage point on the collapsed header so the
  // "what would shift this reading" signal is legible without expansion.
  const [openId, setOpenId] = useState(null);

  // Filter out process subclaim — μ lives on a parallel axis, not in the
  // attribution storyline list. Sort by coverage descending.
  const attribution = STORYLINES.filter(s => s.kind !== "subclaim");
  const subclaim = STORYLINES.find(s => s.kind === "subclaim"); // μ
  const sorted = [...attribution].sort((a,b)=> b.coverage - a.coverage);

  return (
    <div style={{ padding: "56px 56px 48px", background: colors.paper }}>
      {/* WIP advisory — quiet centered annotation marking the
          transition from the shipped graph to the in-progress
          storylines/delta sections below. */}
      <div style={{
        textAlign: "center",
        marginTop: -28, marginBottom: 18,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5, letterSpacing: 0.8,
        color: colors.inkSoft, opacity: 0.85,
        textTransform: "uppercase", fontWeight: 400,
      }}>
        Below — Design is Work in Progress
      </div>

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
            {attribution.length} coherent ways to organize what we know.
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
              The {STORYLINES.filter(s => s.kind !== "subclaim").length} attribution reconstructions absorb {Math.round(STORYLINES.filter(s => s.kind !== "subclaim").reduce((s,x)=> s + x.coverage, 0) * 100)}% of the weight. The remainder is not "uncertainty in general" — it is structure that fits none of these reconstructions coherently. It is a limit of the reconstructions, not of reality. (Process — μ — sits on a parallel subclaim axis and is not summed here.)
            </div>
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 46,
            fontStyle:"italic", color: colors.ink,
            fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            {Math.round(STORYLINES.filter(s => s.kind !== "subclaim").reduce((s,x)=> s + x.coverage, 0) * 100)}<span style={{ fontSize: 22, opacity: 0.55 }}>%</span>
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

      {/* Header — softmax-artifact warning is the single most important
          piece of info on this section, so it leads */}
      <div style={{ marginTop: 36, marginBottom: 32, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 56, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Under the surface
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.12, letterSpacing: -0.4, color: colors.ink }}>
            What the evidence actually says, before normalization.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
          color: colors.inkMute, lineHeight: 1.55 }}>
          The graph above shows softmax-normalized percentages. Softmax compresses eleven candidates into a bounded simplex — weak candidates get a mathematical floor, strong ones get a ceiling. Below: the raw scores, which were the input to that compression. They are far less compressed and tell a sharper story.
        </div>
      </div>

      {/* Single panel — raw scores, full width */}
      <div style={{ padding: "28px 32px", border: `1px solid ${colors.ink}`, borderRadius: 2,
        background: colors.paper }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 32, alignItems:"baseline",
          marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
              color: colors.primary, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
              Raw score
            </div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize: 22, fontStyle:"italic",
              lineHeight: 1.25, color: colors.ink, letterSpacing: -0.2 }}>
              C2b dominates at <strong style={{ color: colors.primary, fontWeight: 500 }}>+2.65</strong> — every other candidate sits below +1.3.
            </div>
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
            color: colors.inkSoft, lineHeight: 1.6 }}>
            The 33.5% the graph shows is the softmax of these raw scores. Second place is +1.30 for "the investigation is avoiding resolution" — a process subclaim, not a competing perpetrator hypothesis. Third place is +0.24, more than ten times smaller than the leader.
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap: 8 }}>
          {rawVals.map(({k, raw}) => {
            const pos = raw >= 0;
            const w = (Math.abs(raw) / maxRaw) * 50;
            return (
              <div key={k} style={{ display:"grid", gridTemplateColumns:"180px 1fr 64px",
                alignItems:"center", gap: 16 }}>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                  color: colors.ink, fontWeight: k === "C2b" ? 500 : 400 }}>
                  {CAND_READABLE_V04_SHORT[k]}
                </div>
                <div style={{ position:"relative", height: 5, background: colors.paperDeep, borderRadius: 1 }}>
                  <div style={{ position:"absolute", left:"50%", top: -3, bottom: -3,
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
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 16, fontStyle:"italic",
                  color: k === "C2b" ? colors.primary : colors.ink,
                  fontVariantNumeric:"tabular-nums", textAlign:"right",
                  fontWeight: k === "C2b" ? 500 : 400 }}>
                  {raw >= 0 ? "+" : ""}{raw.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LIMITS (v0.4 version) — with Ljungqvist quote as epigraph
// ============================================================================

function LimitsSectionV04() {
  // Limits compressed to a footer-style accordion. Each limit shows just
  // its key + title by default; click to expand description. Total height
  // dropped ~70% vs the old hero-treatment version.
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

  const [openK, setOpenK] = useState(null);

  return (
    <div style={{ padding: "32px 56px 40px", background: colors.paper }}>
      <Rule />

      {/* Compact header — single line, no hero treatment */}
      <div style={{ marginTop: 22, marginBottom: 18,
        display:"flex", alignItems:"baseline", gap: 16, flexWrap:"wrap" }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase" }}>
          What this exhibit cannot do
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
          color: colors.inkMute, lineHeight: 1.5 }}>
          Eight acknowledged limits — four inherited from v0.3, four new in v0.4. Click a row to expand.
        </div>
      </div>

      {/* Accordion list — each limit one row, expand on click */}
      <div style={{ border: `1px solid ${colors.ruleSoft}`, borderRadius: 2,
        background: colors.paper, marginBottom: 24 }}>
        {items.map((item, i) => {
          const isOpen = openK === item.k;
          const tag = item.isV04 ? `v0.4–${item.k}` : `v0.3–${item.k}`;
          return (
            <div key={item.k}
              style={{
                borderTop: i > 0 ? `1px solid ${colors.ruleSoft}` : "none",
                background: isOpen ? "rgba(242, 238, 228, 0.4)" : "transparent",
                transition:"background 0.15s",
              }}>
              {/* Row header — always visible */}
              <button
                onClick={()=>setOpenK(isOpen ? null : item.k)}
                style={{
                  display:"grid",
                  gridTemplateColumns:"72px 1fr 14px",
                  gap: 16, alignItems:"baseline",
                  width:"100%", padding:"10px 18px",
                  background:"transparent", border:"none",
                  cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10.5,
                  color: item.isV04 ? colors.primary : colors.inkMute,
                  letterSpacing: 0.7, fontWeight: item.isV04 ? 600 : 500 }}>
                  {tag}
                </span>
                <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  color: colors.ink, lineHeight: 1.4 }}>
                  {item.t}
                </span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                  color: colors.inkMute, transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition:"transform 0.15s", textAlign:"right" }}>
                  ▾
                </span>
              </button>
              {/* Expanded description */}
              {isOpen && (
                <div style={{
                  padding:"4px 18px 14px",
                  display:"grid", gridTemplateColumns:"72px 1fr 14px",
                  gap: 16 }}>
                  <span/>
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                    color: colors.inkSoft, lineHeight: 1.6 }}>
                    {item.d}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FooterMeta />
    </div>
  );
}

// ============================================================================
// FOOTER META — collapsible "what changed" + version line
// Shown at the bottom of LimitsSectionV04. Replaces the old standalone
// DeltaPanel — readers who care about version history can expand; readers
// who don't aren't taxed with a full-screen comparison table.
// ============================================================================

function FooterMeta() {
  const [showDelta, setShowDelta] = useState(false);
  return (
    <div style={{ marginTop: 72, paddingTop: 24, borderTop:`1px solid ${colors.rule}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline",
        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
        color: colors.inkMute, letterSpacing: 0.6, flexWrap:"wrap", gap: 12 }}>
        <span>Trace protocol v0.4 · fourteen-language intake · exhibit mode</span>
        <span>
          <button onClick={()=>setShowDelta(!showDelta)} style={{
            background:"transparent", border:"none", padding: 0, cursor:"pointer",
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkSoft, letterSpacing: 0.6,
            textTransform:"uppercase", textDecoration:"underline",
            textUnderlineOffset: 2 }}>
            {showDelta ? "hide changelog ▴" : "v0.3 → v0.4 changelog ▾"}
          </button>
          <span style={{ margin: "0 12px", opacity: 0.4 }}>·</span>
          <span>Case file 001 · last updated 2026-04-18</span>
        </span>
      </div>

      {showDelta && (
        <div style={{ marginTop: 28 }}>
          <DeltaPanel />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CROSS-IMPACT TABLE — extracted from CausalChainSection.jsx, condensed.
// Shown BETWEEN SurvivingCausalChain and StorylineReconstructions, so the
// reader sees how individual evidence items differentially impact each
// storyline BEFORE they encounter the 5 cards. The E31 pivot is the visual
// climax — a single piece of evidence that separates α from ε.
//
// This is a leverage-point preview at the case level (vs storyline level).
// ============================================================================

const CROSS_IMPACT_DATA = [
  { id:"F9",      label:"BGH ruling: 'foreign government intelligence agency' — anonymous",   impact:{ alpha:+2, epsilon:+2, zeta:+1, beta:-1, delta:-2 } },
  { id:"F12",     label:"Fourth pipeline left intact",                                          impact:{ alpha:+1, epsilon:+1, zeta:+0, beta:-1, delta:+0 } },
  { id:"MC5",     label:"Explosives not Ukrainian-domestic — external supply chain",             impact:{ alpha:+1, epsilon:+1, zeta:+1, beta:+1, delta:-2 } },
  { id:"F6",      label:"CIA warned Germany about a Ukrainian plan",                             impact:{ alpha:+2, epsilon:+1, zeta:+0, beta:-1, delta:+0 } },
  { id:"E31",     label:"Zelensky approved, then withdrew — Zaluzhnyi continued",
                  impact:{ alpha:+3, epsilon:-1, zeta:+0, beta:+0, delta:+0 }, pivot: true,
                  pivotNote: "The single piece of evidence that separates α from ε. Without it, α and ε are structurally indistinguishable — \"some Ukrainian actor\" could absorb the attribution mass. With it, α has a specific structural distinction (military bypass of presidential withdrawal) that ε cannot claim." },
  { id:"E32-35",  label:"Suppression cluster: Germany blocks questions, Poland blocks extradition, Sweden / Denmark close",
                  impact:{ alpha:+1, epsilon:+2, zeta:+2, beta:+0, delta:+0 } },
];

// 5 storylines (canonical, matching the master STORYLINES const).
// μ is a parallel process subclaim, not a storyline — it lives in
// SuppressionAndJudicial as its own section, not as a column here.
const CROSS_IMPACT_STORIES = [
  { id:"alpha",   glyph:"α", color: "primary",   label:"Ukrainian military bypass" },
  { id:"epsilon", glyph:"ε", color: "inkSoft",   label:"Unidentified actor" },
  { id:"zeta",    glyph:"ζ", color: "inkSoft",   label:"UK-layer, under-examined" },
  { id:"beta",    glyph:"β", color: "inkSoft",   label:"US-led operation" },
  { id:"delta",   glyph:"δ", color: "muted",     label:"Russian self-sabotage" },
];

function ImpactDot({ val }) {
  if (val === 0) {
    return <span style={{ display:"inline-block", width: 8, height: 8, borderRadius:"50%",
      border:`1px solid ${colors.rule}`, background:"transparent" }}/>;
  }
  const pos = val > 0;
  const mag = Math.abs(val);
  const size = 7 + mag * 3;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      width: size, height: size, borderRadius:"50%",
      background: pos ? "#3A8A5C" : colors.primary,
      opacity: mag === 1 ? 0.45 : mag === 2 ? 0.7 : 1,
    }}>
      <span style={{ color: colors.paper, fontSize: 9,
        fontFamily:"'JetBrains Mono', monospace", lineHeight: 1, fontWeight: 600 }}>
        {pos ? "+" : "−"}
      </span>
    </span>
  );
}

function CrossImpactTable() {
  const [hoverStory, setHoverStory] = useState(null);
  const storyColor = (key) => key === "primary" ? colors.primary
                            : key === "meta" ? colors.meta
                            : key === "muted" ? colors.muted
                            : colors.inkSoft;

  return (
    <div style={{ padding: "56px 56px 48px", background: colors.paper }}>
      <Rule />

      <div style={{ marginTop: 44, marginBottom: 32, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 56, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Where the leverage is
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 30, fontWeight: 400,
            lineHeight: 1.12, letterSpacing: -0.4, color: colors.ink }}>
            Same evidence, different impact on each storyline.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 15,
          color: colors.inkMute, lineHeight: 1.55 }}>
          One piece of evidence rarely settles attribution. What matters is its differential impact: which storyline does it strengthen, which does it break? Below, six high-leverage evidence items × five storylines. The dot size encodes signal strength. Read the rows for "what this evidence does to each story." Read the columns for "what this storyline lives or dies on."
        </div>
      </div>

      <div style={{ display:"grid",
        gridTemplateColumns:`minmax(280px, 1fr) repeat(${CROSS_IMPACT_STORIES.length}, 56px)`,
        gap: 0,
        border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
        {/* Header row */}
        <div style={{ padding: "12px 18px", background: colors.paperDeep,
          borderRight: `1px solid ${colors.ruleSoft}`,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase" }}>
          Evidence
        </div>
        {CROSS_IMPACT_STORIES.map((s,i) => (
          <div key={s.id}
            onMouseEnter={()=>setHoverStory(s.id)}
            onMouseLeave={()=>setHoverStory(null)}
            style={{
              padding: "12px 0", textAlign:"center",
              background: colors.paperDeep,
              borderRight: i < CROSS_IMPACT_STORIES.length - 1 ? `1px solid ${colors.ruleSoft}` : "none",
              cursor:"default",
            }}>
            <div title={s.label} style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
              fontSize: 18, fontWeight: 400,
              color: hoverStory === s.id ? storyColor(s.color) : colors.inkSoft,
              opacity: hoverStory && hoverStory !== s.id ? 0.3 : 1,
              transition:"all 0.15s",
              lineHeight: 1 }}>
              {s.glyph}
            </div>
          </div>
        ))}

        {/* Body rows */}
        {CROSS_IMPACT_DATA.map((ev, ri) => (
          <React.Fragment key={ev.id}>
            <div style={{
              padding: "14px 18px",
              borderTop: `1px solid ${colors.ruleSoft}`,
              borderRight: `1px solid ${colors.ruleSoft}`,
              background: ev.pivot ? "rgba(160, 58, 44, 0.05)" : colors.paper,
              display:"flex", alignItems:"center", gap: 10 }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: ev.pivot ? colors.primary : colors.inkMute,
                letterSpacing: 0.4, fontWeight: ev.pivot ? 600 : 400,
                minWidth: 50, flexShrink: 0 }}>
                {ev.id}
              </span>
              <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
                color: colors.ink, lineHeight: 1.4 }}>
                {ev.label}
              </span>
            </div>
            {CROSS_IMPACT_STORIES.map((s,i) => (
              <div key={s.id} style={{
                padding: "14px 0", textAlign:"center",
                borderTop: `1px solid ${colors.ruleSoft}`,
                borderRight: i < CROSS_IMPACT_STORIES.length - 1 ? `1px solid ${colors.ruleSoft}` : "none",
                background: ev.pivot ? "rgba(160, 58, 44, 0.05)" : colors.paper,
                opacity: hoverStory && hoverStory !== s.id ? 0.2 : 1,
                transition:"opacity 0.15s",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ImpactDot val={ev.impact[s.id]}/>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Pivot callout — promoted as a leverage point at the case level */}
      {(() => {
        const pivot = CROSS_IMPACT_DATA.find(d => d.pivot);
        if (!pivot) return null;
        return (
          <div style={{ marginTop: 24, padding: "20px 24px",
            background: "rgba(160, 58, 44, 0.05)",
            borderLeft: `4px solid ${colors.primary}`,
            border: `1px solid rgba(160, 58, 44, 0.18)`,
            borderLeftWidth: 4, borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.primary, letterSpacing: 1.0, textTransform:"uppercase",
                fontWeight: 600 }}>
                Case-level pivot · {pivot.id}
              </span>
            </div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize: 17,
              lineHeight: 1.45, color: colors.ink, letterSpacing: -0.1 }}>
              {pivot.pivotNote}
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1px solid ${colors.ruleSoft}`,
        display:"flex", gap: 24, flexWrap:"wrap",
        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
        color: colors.inkMute, letterSpacing: 0.5 }}>
        <span style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
          <ImpactDot val={3}/> strengthens (mag 3)
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
          <ImpactDot val={1}/> strengthens (mag 1)
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
          <ImpactDot val={0}/> no effect
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
          <ImpactDot val={-1}/> weakens (mag 1)
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
          <ImpactDot val={-2}/> weakens (mag 2)
        </span>
      </div>
    </div>
  );
}


// ============================================================================
// SUPPRESSION + JUDICIAL — extracted from CausalChainSection.jsx, combined.
// μ's concrete content: who is blocking resolution, where the case stands
// judicially. Two halves of the same question — "is the system avoiding
// closure, and how close is closure anyway?" Sits between AggregationReadout
// and LimitsSectionV04, where μ's significance becomes legible.
// ============================================================================

const SUPPRESSION_ACTORS = [
  { actor:"Germany",          action:"Chancellery invokes Third Party Rule to block parliamentary questions" },
  { actor:"Sweden & Denmark", action:"Close investigations without attribution" },
  { actor:"Poland",           action:"Refuses to execute the German European Arrest Warrant" },
  { actor:"UN Security Council", action:"Russia's investigation request blocked by twelve abstentions" },
  { actor:"US intelligence",  action:"No formal attribution assessment produced post-denial (Feb 2023)" },
];

const JUDICIAL_STATE = [
  { court:"BGH (Germany)", ruling:"\"Intelligence-agency action ordered by a foreign government\" — government unnamed",
    status:"Trial pending", statusColor:"warn" },
  { court:"Poland",        ruling:"\"Organized action by services of a warring state\"",
    status:"Extradition refused", statusColor:"primary" },
  { court:"Italy",         ruling:"Kuznetsov arrested in Rimini",
    status:"Transferred to Germany", statusColor:"inkMute" },
];

function SuppressionAndJudicial() {
  return (
    <div style={{ padding: "72px 56px 72px",
      background: "linear-gradient(180deg, " + colors.paper + " 0%, rgba(122, 106, 84, 0.04) 100%)" }}>
      <Rule />

      {/* Larger hero block — section is structurally significant, deserves
          visual weight on par with the storyline section. Hero text scales
          up; intro paragraph stays the same width but with larger leading. */}
      <div style={{ marginTop: 48, marginBottom: 44, maxWidth: 1100 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
          color: colors.meta, letterSpacing: 1.2, textTransform:"uppercase",
          marginBottom: 16, fontWeight: 600 }}>
          μ · process subclaim, made concrete
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 40, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: -0.6, color: colors.ink, marginBottom: 24,
          maxWidth: 920 }}>
          What "the case is being kept open" looks like in specifics.
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 17,
          color: colors.inkSoft, lineHeight: 1.55, maxWidth: 820 }}>
          μ absorbs 13.6% of evidence flow not because the evidence is weak — but because five jurisdictions and one international body have, in different forms, declined to close the question. The judicial layer is doing the opposite: converging. Both states coexist; that is the exhibit.
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 36, marginBottom: 36 }}>
        {/* LEFT — Suppression actors */}
        <div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.meta, letterSpacing: 1.0, textTransform:"uppercase",
            marginBottom: 14, fontWeight: 600,
            display:"flex", alignItems:"baseline", gap: 8 }}>
            <span>Five actors blocking resolution</span>
            <span style={{ flex: 1, height: 1, background: `${colors.meta}40`, marginTop: 4 }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 1,
            border: `1px solid ${colors.ruleSoft}`, borderRadius: 2, overflow:"hidden" }}>
            {SUPPRESSION_ACTORS.map((s, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"140px 1fr", gap: 14,
                padding: "14px 18px",
                background: i % 2 === 0 ? colors.paper : "rgba(122, 106, 84, 0.04)" }}>
                <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  fontWeight: 600, color: colors.ink, lineHeight: 1.4 }}>
                  {s.actor}
                </span>
                <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  color: colors.inkSoft, lineHeight: 1.45 }}>
                  {s.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Judicial cards */}
        <div>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.ink, letterSpacing: 1.0, textTransform:"uppercase",
            marginBottom: 14, fontWeight: 600,
            display:"flex", alignItems:"baseline", gap: 8 }}>
            <span>Where it stands judicially</span>
            <span style={{ flex: 1, height: 1, background: colors.rule, marginTop: 4 }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 14 }}>
            {JUDICIAL_STATE.map((j, i) => {
              const sc = j.statusColor === "warn" ? colors.warn
                       : j.statusColor === "primary" ? colors.primary
                       : colors.inkMute;
              return (
                <div key={i} style={{
                  padding: "18px 20px",
                  background: colors.paper,
                  border: `1px solid ${colors.ruleSoft}`,
                  borderLeft: `4px solid ${sc}`,
                  borderRadius: 2 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"baseline", marginBottom: 8, gap: 12 }}>
                    <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
                      fontWeight: 600, color: colors.ink }}>
                      {j.court}
                    </span>
                    <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                      color: sc, letterSpacing: 0.8, textTransform:"uppercase",
                      whiteSpace:"nowrap", fontWeight: 600 }}>
                      {j.status}
                    </span>
                  </div>
                  <div style={{ fontFamily:"'Fraunces', serif", fontSize: 14.5, fontStyle:"italic",
                    color: colors.inkSoft, lineHeight: 1.45, letterSpacing: -0.05 }}>
                    "{j.ruling}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Closing observation — restored from original CausalChainSection.jsx.
          This is the section's structural punchline: the trunk is settled
          (forensics converged on Ukrainian operators); the disagreement
          is over what's ABOVE the trunk (who authorized, who supplied,
          who is preventing closure). Distinguishes "what is known" from
          "what is being asked." */}
      <div style={{ marginTop: 36, padding: "26px 32px",
        background: colors.paper,
        border: `1px solid ${colors.rule}`,
        borderLeft: `4px solid ${colors.ink}`,
        borderRadius: 2 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.ink, letterSpacing: 1.0, textTransform:"uppercase",
          fontWeight: 600, marginBottom: 14 }}>
          What is known vs what is being asked
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 18,
          color: colors.ink, lineHeight: 1.5, letterSpacing: -0.1, marginBottom: 14 }}>
          Every storyline above must pass through the common trunk shown earlier. The question is not whether Ukrainian operators placed the charges — the forensics have converged on that.
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 14,
          color: colors.inkSoft, lineHeight: 1.65 }}>
          The question is <strong style={{ color: colors.ink, fontWeight: 600 }}>who authorized them</strong>, <strong style={{ color: colors.ink, fontWeight: 600 }}>who supplied the materiel</strong>, and <strong style={{ color: colors.ink, fontWeight: 600 }}>who is now preventing the answer from becoming public</strong>. That distinction — between what is known and what is being asked — is what a headline cannot show you. The judicial layer keeps moving (BGH ruled, Poland refused, Italy extradited). The political layer keeps blocking (Sweden closed, Denmark closed, Germany sealed, the UN Security Council declined). μ is the interval between those two trajectories.
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// POSITION FROM REGISTER — how 14 language ecosystems speak from their
// positions. Tone is meta-evidence: same fact + different register reveals
// different positional relationship. This section is paired with the (future)
// NarrativeFrameMap — frame coordinates show WHERE each ecosystem sits;
// register shows HOW they speak from there.
//
// Sits between StorylineReconstructions and AnchorsRail. Reader flow:
// "5 readings → but who is saying what, with what tone? → 13 facts everyone
// must accept regardless."
// ============================================================================

// 14 ecosystems plotted on certainty × affective-intensity plane.
// x ∈ [0,100]: 0 = observer / pure neutral / silence
//              50 = evasive / hedged
//              100 = affirmative / certain / explicit position
// y ∈ [0,100]: 0 = distance / coolness / pure observer
//              100 = high affective load (pride, indignation, mockery)
// affect: pride | indignation | mockery | distance | observer
//   colors:
//     pride → warn (gold)         — load-bearing celebration
//     indignation → primary (red) — adversarial heat
//     mockery → primarySoft       — sharp criticism
//     distance → inkSoft          — institutional cool
//     observer → inkMute          — disengagement / silence
// 14 language ecosystems × 4 time points (t0–t3, matching NarrativeFrameMap).
// Each ecosystem has 4 snapshots showing register drift over time.
//   x ∈ [0,100]: stance certainty (left = observer/neutral, right = affirmative)
//   y ∈ [0,100]: affective intensity (low = cool/distance, high = pride/indignation)
// Several ecosystems drift meaningfully: Polish (cautious → pride post-Łubowski),
// Ukrainian media (state-denial cover → media pride), Swedish/Danish (cool inves-
// tigation → mockery post-closure), German alt-left (skeptical → full mockery),
// German judicial (silent → BGH-active), Spanish-Sachs (absent → high indignation
// post-UN speech). Russian, Japanese, English mainstream stay near-static.
const REGISTER_TIMES = [
  { id:"t0", label:"Q4 2022", sub:"immediately after attack" },
  { id:"t1", label:"2023",    sub:"Hersh report · Andromeda surfaces" },
  { id:"t2", label:"2024",    sub:"Die Zeit · Polish extradition refused" },
  { id:"t3", label:"2025–26", sub:"Italian arrest · BGH ruling · converging" },
];

const REGISTER_NODES = [
  { id:"en", flag:"🇬🇧🇺🇸", lang:"English mainstream",
    diag:"Restrained puzzlement. WSJ/NYT use 'allegedly,' 'people familiar with.' De-dramatization deflects accountability — readers don't feel urgency to demand consequences against an ally.",
    drift:"Stable distance throughout. Tiny rightward drift as judicial rulings come in.",
    snapshots:{
      t0:{x:35, y:22, affect:"distance"},
      t1:{x:38, y:24, affect:"distance"},
      t2:{x:40, y:22, affect:"distance"},
      t3:{x:42, y:22, affect:"distance"} } },

  { id:"zh", flag:"🇨🇳", lang:"Chinese state",
    diag:"留白即态度. Doesn't accuse — selectively amplifies (Sikorski tweet, UN vote, Sachs testimony, US silence). Attribution outsourced to the reader.",
    drift:"Initial silence (t0); selective amplification kicks in post-Hersh (t1+).",
    snapshots:{
      t0:{x:15, y:10, affect:"observer"},
      t1:{x:30, y:30, affect:"distance"},
      t2:{x:42, y:38, affect:"distance"},
      t3:{x:45, y:40, affect:"distance"} } },

  { id:"ru", flag:"🇷🇺", lang:"Russian state",
    diag:"Naryshkin: 'we possess reliable intelligence' — intelligence-agency syntax as authority manufacture. RT amplifies via adverb-stacking ('bizarro,' 'utterly false').",
    drift:"High indignation from t0; saturates post-Hersh (t1) and stays.",
    snapshots:{
      t0:{x:80, y:78, affect:"indignation"},
      t1:{x:88, y:86, affect:"indignation"},
      t2:{x:90, y:86, affect:"indignation"},
      t3:{x:90, y:86, affect:"indignation"} } },

  { id:"de_j", flag:"⚖", lang:"German judicial",
    diag:"BGH: 'mit hoher Wahrscheinlichkeit' — won't name government. Cool jurisprudential register. The hotter the topic, the colder the German legal voice.",
    drift:"Inactive at t0–t1 (no rulings yet); emerges with investigations (t2); dominant after BGH ruling (t3).",
    snapshots:{
      t0:{x:20, y:10, affect:"observer"},
      t1:{x:28, y:14, affect:"distance"},
      t2:{x:48, y:20, affect:"distance"},
      t3:{x:58, y:22, affect:"distance"} } },

  { id:"de_g", flag:"🇩🇪", lang:"German government",
    diag:"'Wohl der Bundesrepublik,' 'Third Party Rule' — German bureaucratic language designed to say-nothing-substantively. Procedural deflection at scale.",
    drift:"Locks into evasion early (t1) when Third Party Rule emerges; stays.",
    snapshots:{
      t0:{x:22, y:22, affect:"distance"},
      t1:{x:14, y:18, affect:"distance"},
      t2:{x:14, y:18, affect:"distance"},
      t3:{x:14, y:18, affect:"distance"} } },

  { id:"de_alt", flag:"🇩🇪", lang:"German alt-left",
    diag:"Multipolar / Hintergrund: 'verwesenden Körper des einstigen Rechtsstaats' (rotting corpse of the former Rechtsstaat). Maximum-saturation anti-establishment register.",
    drift:"Skeptical at t0; sharpens to mockery as government deflection becomes structural.",
    snapshots:{
      t0:{x:55, y:48, affect:"mockery"},
      t1:{x:68, y:66, affect:"mockery"},
      t2:{x:75, y:72, affect:"mockery"},
      t3:{x:78, y:76, affect:"mockery"} } },

  { id:"pl", flag:"🇵🇱", lang:"Polish",
    diag:"Tusk: 'sprawa zamknięta — i słusznie' (case closed, and rightly so). Łubowski's ruling uses 'wojna sprawiedliwa' (just war). Affirmation + moral activation.",
    drift:"Cautious distance early. Pride mode emerges with extradition refusal (t2); peaks after Łubowski + Tusk (t3). Most pronounced register drift in the dataset.",
    snapshots:{
      t0:{x:40, y:22, affect:"distance"},
      t1:{x:50, y:32, affect:"distance"},
      t2:{x:80, y:72, affect:"pride"},
      t3:{x:92, y:92, affect:"pride"} } },

  { id:"ar", flag:"🌐", lang:"Arabic anti-imperial",
    diag:"Al Jazeera Arabic amplifies Hersh significantly more than its English version. Same media, two register temperatures — editorial judgment that audiences should hear different stories.",
    drift:"Skeptical at t0; ramps to full anti-imperial activation post-Hersh.",
    snapshots:{
      t0:{x:50, y:50, affect:"indignation"},
      t1:{x:72, y:78, affect:"indignation"},
      t2:{x:76, y:80, affect:"indignation"},
      t3:{x:76, y:80, affect:"indignation"} } },

  { id:"fr_inst", flag:"🇫🇷", lang:"French institutional",
    diag:"Republican neutrality with adjective-inserted skepticism. France 24: 'Une figure très populaire, limogée par Zelensky' — 'popular' inserted to flag that Zaluzhnyi's removal contradicts his record.",
    drift:"Stable institutional neutrality with subtle adjective-skepticism throughout.",
    snapshots:{
      t0:{x:42, y:28, affect:"distance"},
      t1:{x:44, y:30, affect:"distance"},
      t2:{x:44, y:30, affect:"distance"},
      t3:{x:46, y:32, affect:"distance"} } },

  { id:"fr_alt", flag:"🇫🇷", lang:"French alt (Elucid)",
    diag:"'la nonchalance des différentes parties européennes' (European parties' nonchalance) — at the level of indictment in French. Borderline accusation of complicity.",
    drift:"Sharpens from skepticism to indictment as European silence becomes legible.",
    snapshots:{
      t0:{x:55, y:55, affect:"mockery"},
      t1:{x:64, y:64, affect:"mockery"},
      t2:{x:68, y:68, affect:"mockery"},
      t3:{x:70, y:70, affect:"mockery"} } },

  { id:"it_ifq", flag:"🇮🇹", lang:"Italian (Il Fatto)",
    diag:"'disobbedienza' (disobedience) for Zaluzhnyi's continuation. 'bocciata da lui stesso' (vetoed by himself) for Zelensky's reversal. Dramatic verbs as endorsement.",
    drift:"Cautious early. Dramatization ramps continuously. Peaks at t3 with Calenda's 2026 endorsement.",
    snapshots:{
      t0:{x:48, y:42, affect:"indignation"},
      t1:{x:64, y:58, affect:"indignation"},
      t2:{x:72, y:64, affect:"indignation"},
      t3:{x:78, y:70, affect:"indignation"} } },

  { id:"es", flag:"🇪🇸", lang:"Spanish (Sachs corpus)",
    diag:"Sachs's 'act of international terrorism' framing amplified in Spanish-language outlets with UN-charter solemnity preserved. Academic-moral register.",
    drift:"Effectively absent at t0 (no Sachs UN speech yet). Explosive entry at t1 (Feb 2023 UN speech). Sustained.",
    snapshots:{
      t0:{x:15, y:15, affect:"observer"},
      t1:{x:72, y:72, affect:"indignation"},
      t2:{x:76, y:74, affect:"indignation"},
      t3:{x:76, y:74, affect:"indignation"} } },

  { id:"ja", flag:"🇯🇵", lang:"Japanese mainstream",
    diag:"'欧州で議論が起きている' (a discussion is occurring in Europe) — third-person framing of a global question. Pure observer register. Silence is selected, not accidental.",
    drift:"Static observer register across all four time points. Selective non-engagement persists.",
    snapshots:{
      t0:{x:8, y:6, affect:"observer"},
      t1:{x:8, y:6, affect:"observer"},
      t2:{x:8, y:6, affect:"observer"},
      t3:{x:8, y:6, affect:"observer"} } },

  { id:"uk_med", flag:"🇺🇦", lang:"Ukrainian (media layer)",
    diag:"'елітний підрозділ України підірвав' (Ukraine's elite unit blew it up). State layer maintains plausible deniability; media layer builds national narrative. Two-layer structure.",
    drift:"Cautious early (state denial dominates). Pride emerges in media as forensics surface (t2). Saturates post-arrests (t3).",
    snapshots:{
      t0:{x:42, y:22, affect:"distance"},
      t1:{x:60, y:46, affect:"indignation"},
      t2:{x:80, y:78, affect:"pride"},
      t3:{x:94, y:92, affect:"pride"} } },

  { id:"sv", flag:"🇸🇪", lang:"Swedish (SVT)",
    diag:"'Sverige tog enklaste vägen ut' (Sweden took the easiest way out). In Swedish public discourse, 'easiest way out' carries laziness/abdication weight. Public broadcaster against own state.",
    drift:"Cool investigative reporting at t0–t1; mockery emerges after own-state closes the case (t2); peaks at t3.",
    snapshots:{
      t0:{x:50, y:20, affect:"distance"},
      t1:{x:55, y:25, affect:"distance"},
      t2:{x:66, y:56, affect:"mockery"},
      t3:{x:70, y:64, affect:"mockery"} } },

  { id:"da", flag:"🇩🇰", lang:"Danish legal-academic",
    diag:"Buhl: 'Selv Rusland har ikke bestridt...' (even Russia hasn't disputed...) — using opponent's silence to indict own government. Sharp questioning preserved under academic surface.",
    drift:"Same trajectory as Swedish — cool early, mockery post-closure.",
    snapshots:{
      t0:{x:48, y:20, affect:"distance"},
      t1:{x:54, y:26, affect:"distance"},
      t2:{x:66, y:54, affect:"mockery"},
      t3:{x:70, y:60, affect:"mockery"} } },

  { id:"no_nrk", flag:"🇳🇴", lang:"Norwegian (NRK)",
    diag:"'Skyggekrigen' methodological pride. Long-form investigations show radar / satellite / signal analysis — Nordic public-broadcaster register saying 'our method is better than Hersh's single source.'",
    drift:"Methodological mode emerges with Skyggekrigen documentary launch (t1); sustained authority register thereafter.",
    snapshots:{
      t0:{x:42, y:20, affect:"distance"},
      t1:{x:58, y:24, affect:"distance"},
      t2:{x:64, y:26, affect:"distance"},
      t3:{x:64, y:26, affect:"distance"} } },
];

const REGISTER_AFFECT_COLOR = {
  pride:       "warn",
  indignation: "primary",
  mockery:     "primarySoft",
  distance:    "inkSoft",
  observer:    "inkMute",
};

const REGISTER_OBSERVATIONS = [
  { id: 1,
    headline: "\"Pride\" register is the rarest — and most diagnostic",
    body: "Affirmative + honor-bearing language for the Ukrainian-sabotage narrative appears in only two ecosystems: Polish and Ukrainian-language media. France, Italy, English mainstream don't use it — even where the investigative conclusion has converged. Whoever dares to be proud holds the position. Other ecosystems may agree with the conclusion; only PL and UK-media own it." },
  { id: 2,
    headline: "Judicial register diverges from political register within one country",
    body: "Germany: BGH's cool jurisprudence ('mit hoher Wahrscheinlichkeit, nicht namen') against Kanzleramt's procedural blocking ('Third Party Rule'). Poland: Łubowski's morally-activated ruling against Tusk's celebratory tweet. Italy: Cassazione's procedural neutrality against IFQ's dramatized endorsement. The split is itself the meta-evidence — courts can advance what governments cannot." },
  { id: 3,
    headline: "Denial intensity scales with stake",
    body: "Ukraine official: 'смішно' (laughable), 'провокація' — contemptuous-tier denial. Russia state: 'fantastical,' 'utterly false' — baroque adjective stacking. Germany: 'Wohl der Bundesrepublik' — institutional-tier deflection. The denial volume tracks how much the speaker has to lose. Calm denials mean low stakes." },
];

const REGISTER_QUOTES = [
  { lang:"Polish", flag:"🇵🇱", quote:"sprawa zamknięta — i słusznie",
    translation:"\"case closed — and rightly so\"",
    source:"Donald Tusk, X post, 2025",
    diag:"Four-word celebratory sentence + explicit moral endorsement. In Polish political discourse this is roughly equivalent to 'we won.' The political register matching Łubowski's jurisprudential one." },
  { lang:"Polish", flag:"🇵🇱", quote:"krwawa i ludobójcza napaść",
    translation:"\"a bloody and genocidal assault\"",
    source:"Łubowski ruling rationale, 2025",
    diag:"Moral characterization of the Russia-Ukraine war placed BEFORE the legal analysis of the Nord Stream act. Polish jurisprudence permits this; the placement signals the verdict before the reasoning." },
  { lang:"Swedish", flag:"🇸🇪", quote:"Sverige tog enklaste vägen ut",
    translation:"\"Sweden took the easiest way out\"",
    source:"SVT analysis headline, 2024",
    diag:"In Swedish, 'enklaste vägen ut' carries laziness + abdication weight. Public broadcaster using this to characterize own government's investigative posture is severe — registers as cry for accountability." },
  { lang:"Russian", flag:"🇷🇺", quote:"располагаем достоверной информацией",
    translation:"\"we possess reliable intelligence\"",
    source:"Sergey Naryshkin (SVR), 2023",
    diag:"Intelligence-agency syntax used in public statement. Form is borrowed from authority-establishing genres; function is to manufacture certainty in the absence of disclosed evidence." },
];

function PositionFromRegister() {
  const [hovered, setHovered] = useState(null);
  const [timeIdx, setTimeIdx] = useState(3); // default to most recent (t3)
  const [autoplay, setAutoplay] = useState(false);

  // Autoplay — cycles through t0 → t3 → t0 ... while enabled.
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setTimeIdx(i => (i + 1) % REGISTER_TIMES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [autoplay]);

  const tKey = REGISTER_TIMES[timeIdx].id;

  const colorFor = (affect) => {
    const k = REGISTER_AFFECT_COLOR[affect];
    return colors[k] || colors.inkSoft;
  };

  const hoveredNode = REGISTER_NODES.find(n => n.id === hovered);
  // Whether a node has visually meaningful drift (so we render a trail).
  const hasDrift = (n) => {
    const s0 = n.snapshots.t0, s3 = n.snapshots.t3;
    return Math.abs(s0.x - s3.x) > 4 || Math.abs(s0.y - s3.y) > 4;
  };

  // Convert snapshot coords to plot percentages with [4%, 96%] padding.
  const px = (x) => 4 + (x / 100) * 92;
  const py = (y) => 96 - (y / 100) * 92; // flip: high y = top

  return (
    <div style={{ padding: "56px 56px 56px", background: colors.paper }}>
      <Rule />

      {/* Header */}
      <div style={{ marginTop: 44, marginBottom: 28, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 56, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            How positions reveal themselves
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 34, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: -0.5, color: colors.ink }}>
            Tone is harder to fake than wording.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 16,
          color: colors.inkMute, lineHeight: 1.55 }}>
          Same fact, different register reveals different positional relationship to the subject. Below: fourteen language ecosystems on the certainty × affective-intensity plane, plotted across four time points. Some ecosystems sit still — Russian state's indignation locks in early, Japanese silence persists. Others drift — Polish from cautious distance to full pride after Łubowski; Swedish from cool investigation to public mockery after closure. The drift is the data.
        </div>
      </div>

      {/* Time slider — segmented control, click any to jump.
          Autoplay button cycles through 4 time points to make drift visible
          without manual interaction. Mirrors the time mechanism that the
          (future) NarrativeFrameMap section will use. */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr auto",
        gap: 24,
        alignItems:"center",
        marginBottom: 18,
        padding: "12px 16px",
        background: colors.paperDeep,
        border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2,
      }}>
        <div style={{ display:"flex", gap: 0, alignItems:"stretch",
          border: `1px solid ${colors.ruleSoft}`, borderRadius: 2,
          background: colors.paper, overflow:"hidden" }}>
          {REGISTER_TIMES.map((t, i) => {
            const isActive = timeIdx === i;
            return (
              <button key={t.id}
                onClick={() => { setTimeIdx(i); setAutoplay(false); }}
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  background: isActive ? colors.ink : "transparent",
                  color: isActive ? colors.paper : colors.inkSoft,
                  border: "none",
                  borderRight: i < REGISTER_TIMES.length - 1 ? `1px solid ${colors.ruleSoft}` : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                }}>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: 0.7, fontWeight: isActive ? 600 : 500,
                  marginBottom: 3 }}>
                  {t.id} · {t.label}
                </div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 10.5,
                  color: isActive ? colors.paper : colors.inkMute,
                  opacity: isActive ? 0.85 : 1,
                  letterSpacing: -0.05 }}>
                  {t.sub}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setAutoplay(!autoplay)}
          style={{
            padding: "8px 14px",
            background: autoplay ? colors.warn : "transparent",
            color: autoplay ? colors.paper : colors.inkSoft,
            border: `1px solid ${autoplay ? colors.warn : colors.ruleSoft}`,
            borderRadius: 2,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: 0.7, textTransform:"uppercase",
            fontWeight: 600,
            cursor:"pointer",
            whiteSpace:"nowrap",
            transition: "all 0.15s",
          }}>
          {autoplay ? "■ stop" : "▶ play drift"}
        </button>
      </div>

      {/* The plot */}
      <div style={{
        position:"relative",
        width: "100%",
        aspectRatio: "1.6 / 1",
        marginBottom: 36,
        background: "rgba(242, 238, 228, 0.35)",
        border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2,
      }}>
        {/* Crosshair midlines */}
        <div style={{ position:"absolute", left: "50%", top: 24, bottom: 24, width: 1,
          background: colors.ruleSoft, opacity: 0.7 }}/>
        <div style={{ position:"absolute", top: "50%", left: 24, right: 24, height: 1,
          background: colors.ruleSoft, opacity: 0.7 }}/>

        {/* Axis labels */}
        <div style={{ position:"absolute", left: 24, top: "50%",
          transform:"translateY(-50%) rotate(-90deg)", transformOrigin:"left top",
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase",
          whiteSpace:"nowrap" }}>
          ↑ affective intensity
        </div>
        <div style={{ position:"absolute", left: "50%", bottom: 8,
          transform:"translateX(-50%)",
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 1, textTransform:"uppercase" }}>
          stance certainty →
        </div>

        {/* Quadrant labels */}
        <div style={{ position:"absolute", left: 56, top: 16,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 0.6, opacity: 0.7 }}>
          mocking · adversarial
        </div>
        <div style={{ position:"absolute", right: 16, top: 16,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.warnDeep, letterSpacing: 0.6, fontWeight: 600 }}>
          PRIDE · INDIGNATION
        </div>
        <div style={{ position:"absolute", left: 56, bottom: 32,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 0.6, opacity: 0.7 }}>
          observer · silence
        </div>
        <div style={{ position:"absolute", right: 16, bottom: 32,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.inkMute, letterSpacing: 0.6, opacity: 0.7 }}>
          institutional · cool
        </div>

        {/* DRIFT TRAILS — for ecosystems with meaningful drift, render an
            SVG path showing position from t0 → current-time. Only past
            positions; future positions are not shown. */}
        <svg style={{ position:"absolute", inset: 0, width:"100%", height:"100%",
          pointerEvents:"none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {REGISTER_NODES.filter(hasDrift).map(n => {
            const isHover = hovered === n.id;
            const dim = hovered && !isHover;
            const color = colorFor(n.snapshots[tKey].affect);
            // Build path from t0 → current time.
            const points = [];
            for (let i = 0; i <= timeIdx; i++) {
              const s = n.snapshots[REGISTER_TIMES[i].id];
              points.push(`${px(s.x)},${py(s.y)}`);
            }
            if (points.length < 2) return null;
            return (
              <polyline key={n.id}
                points={points.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="0.25"
                strokeOpacity={dim ? 0.15 : (isHover ? 0.7 : 0.35)}
                strokeDasharray="0.8 0.6"
                strokeLinecap="round"
                style={{ transition: "stroke-opacity 0.15s" }}
              />
            );
          })}
        </svg>

        {/* PAST-POSITION DOTS — show small faded dots for past time points
            so the eye can read drift trajectory beyond just the line. */}
        {REGISTER_NODES.filter(hasDrift).map(n => {
          const isHover = hovered === n.id;
          const dim = hovered && !isHover;
          if (timeIdx === 0) return null; // no past positions to show
          return (
            <React.Fragment key={`trail-${n.id}`}>
              {Array.from({ length: timeIdx }).map((_, i) => {
                const s = n.snapshots[REGISTER_TIMES[i].id];
                const c = colorFor(s.affect);
                return (
                  <div key={i} style={{
                    position:"absolute",
                    left: `${px(s.x)}%`, top: `${py(s.y)}%`,
                    transform:"translate(-50%, -50%)",
                    width: 4, height: 4, borderRadius:"50%",
                    background: c,
                    opacity: dim ? 0.1 : (isHover ? 0.4 : 0.22),
                    pointerEvents:"none",
                    transition:"opacity 0.15s",
                  }}/>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* CURRENT-POSITION MARKERS — full marker at the current snapshot. */}
        {REGISTER_NODES.map(n => {
          const isHover = hovered === n.id;
          const dim = hovered && !isHover;
          const snap = n.snapshots[tKey];
          const color = colorFor(snap.affect);
          return (
            <div key={n.id}
              onMouseEnter={()=>setHovered(n.id)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                position:"absolute",
                left: `${px(snap.x)}%`, top: `${py(snap.y)}%`,
                transform:"translate(-50%, -50%)",
                display:"flex", alignItems:"center", gap: 6,
                padding: "3px 8px 3px 4px",
                background: isHover ? colors.paper : "transparent",
                border: `1px solid ${isHover ? color : "transparent"}`,
                borderRadius: 12,
                cursor:"default",
                transition:"all 0.45s cubic-bezier(.4, 0, .2, 1)",
                opacity: dim ? 0.35 : 1,
                whiteSpace:"nowrap",
                zIndex: isHover ? 10 : 1,
              }}>
              <div style={{
                width: 9, height: 9, borderRadius:"50%",
                background: color,
                boxShadow: isHover ? `0 0 0 3px ${color}33` : "none",
                flexShrink: 0,
                transition:"box-shadow 0.15s, background 0.45s",
              }}/>
              <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 11,
                color: colors.ink, fontWeight: isHover ? 600 : 400,
                letterSpacing: -0.05 }}>
                {n.flag} {n.lang}
              </span>
            </div>
          );
        })}

        {/* Hovered node — diagnostic note + drift summary */}
        {hoveredNode && (
          <div style={{
            position:"absolute", left: 24, bottom: 24, right: 24,
            padding: "14px 18px",
            background: "rgba(250, 248, 243, 0.96)",
            backdropFilter:"blur(6px)",
            border: `1px solid ${colorFor(hoveredNode.snapshots[tKey].affect)}`,
            borderLeft: `3px solid ${colorFor(hoveredNode.snapshots[tKey].affect)}`,
            borderRadius: 2,
            maxWidth: 600,
            pointerEvents:"none",
          }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 8,
              flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                fontWeight: 600, color: colors.ink }}>
                {hoveredNode.flag} {hoveredNode.lang}
              </span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colorFor(hoveredNode.snapshots[tKey].affect), letterSpacing: 0.7,
                textTransform:"uppercase", fontWeight: 600 }}>
                {hoveredNode.snapshots[tKey].affect} · {REGISTER_TIMES[timeIdx].label}
              </span>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
              color: colors.inkSoft, lineHeight: 1.5, marginBottom: hoveredNode.drift ? 8 : 0 }}>
              {hoveredNode.diag}
            </div>
            {hoveredNode.drift && (
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.meta, letterSpacing: 0.4, lineHeight: 1.5,
                paddingTop: 8, borderTop: `1px solid ${colors.ruleSoft}` }}>
                <span style={{ fontWeight: 600, letterSpacing: 0.7,
                  textTransform:"uppercase", marginRight: 6 }}>
                  drift t0→t3:
                </span>
                {hoveredNode.drift}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Affect legend */}
      <div style={{ display:"flex", gap: 22, flexWrap:"wrap", marginBottom: 40,
        fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
        color: colors.inkMute, letterSpacing: 0.5, textTransform:"uppercase" }}>
        {Object.entries(REGISTER_AFFECT_COLOR).map(([affect, key]) => (
          <span key={affect} style={{ display:"inline-flex", alignItems:"center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius:"50%",
              background: colors[key] || colors.inkSoft, display:"inline-block" }}/>
            {affect}
          </span>
        ))}
      </div>

      {/* Observations + quote callouts side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap: 40, marginBottom: 36 }}>
        {/* LEFT — three structural observations */}
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 18, fontWeight: 600 }}>
            Three patterns the tone exposes
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 22 }}>
            {REGISTER_OBSERVATIONS.map(obs => (
              <div key={obs.id} style={{
                display:"grid", gridTemplateColumns:"32px 1fr", gap: 16,
                paddingBottom: 22, borderBottom: `1px solid ${colors.ruleSoft}` }}>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 24, fontStyle:"italic",
                  color: colors.inkMute, lineHeight: 1, fontVariantNumeric:"tabular-nums",
                  fontWeight: 400 }}>
                  {obs.id}
                </div>
                <div>
                  <div style={{ fontFamily:"'Fraunces', serif", fontSize: 18,
                    color: colors.ink, lineHeight: 1.3, marginBottom: 8,
                    letterSpacing: -0.2 }}>
                    {obs.headline}
                  </div>
                  <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                    color: colors.inkSoft, lineHeight: 1.6 }}>
                    {obs.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — high-signal quote callouts */}
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 18, fontWeight: 600 }}>
            Four high-signal phrases
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 14 }}>
            {REGISTER_QUOTES.map((q, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                background: colors.paper,
                border: `1px solid ${colors.ruleSoft}`,
                borderLeft: `3px solid ${colors.warn}`,
                borderRadius: 2 }}>
                <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                  fontSize: 16, color: colors.ink, lineHeight: 1.35,
                  letterSpacing: -0.1, marginBottom: 6 }}>
                  "{q.quote}"
                </div>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize: 12.5,
                  color: colors.inkSoft, lineHeight: 1.4, marginBottom: 8 }}>
                  {q.translation}
                </div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                  color: colors.inkMute, letterSpacing: 0.5, marginBottom: 6 }}>
                  {q.flag} {q.source}
                </div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 11.5,
                  color: colors.inkSoft, lineHeight: 1.5 }}>
                  {q.diag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storyline-affinity grouping — connects register analysis to the
          attribution storyline space. Each ecosystem's dominant register
          implicitly endorses (or surfaces) one storyline. Grouping by
          target storyline reveals which positional camps have congealed
          around which reading. */}
      <div style={{
        marginBottom: 32,
        padding: "24px 28px",
        background: colors.paperDeep,
        border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2,
      }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.inkSoft, letterSpacing: 1.0, textTransform:"uppercase",
          fontWeight: 600, marginBottom: 6 }}>
          Which storyline each register endorses
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
          color: colors.inkMute, lineHeight: 1.55, marginBottom: 22, maxWidth: 760 }}>
          Each register doesn't just signal a position — it implicitly endorses (or surfaces) a specific storyline. Below: which language ecosystems align with which reading. Hedged endorsements appear in lighter type.
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap: 18 }}>
          {/* α — Ukrainian attribution */}
          <div style={{ padding: "14px 16px", background: colors.paper,
            border: `1px solid ${colors.ruleSoft}`,
            borderLeft: `3px solid ${colors.primary}`, borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                fontSize: 18, color: colors.primary, lineHeight: 1, fontWeight: 400 }}>α</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.primary, letterSpacing: 0.8, textTransform:"uppercase",
                fontWeight: 600 }}>
                Endorses Ukrainian attribution
              </span>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
              color: colors.ink, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>Active</strong> · 🇵🇱 Polish · 🇺🇦 Ukrainian-media · 🇮🇹 Il Fatto · ⚖ German judicial (BGH) · 🇳🇴 NRK
              </div>
              <div style={{ color: colors.inkMute }}>
                <strong style={{ color: colors.inkSoft }}>Hedged</strong> · 🇬🇧🇺🇸 English mainstream (uses "allegedly")
              </div>
            </div>
          </div>

          {/* β — Western covert attribution */}
          <div style={{ padding: "14px 16px", background: colors.paper,
            border: `1px solid ${colors.ruleSoft}`,
            borderLeft: `3px solid ${colors.secondary}`, borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                fontSize: 18, color: colors.secondary, lineHeight: 1, fontWeight: 400 }}>β</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.secondary, letterSpacing: 0.8, textTransform:"uppercase",
                fontWeight: 600 }}>
                Endorses US-led / Western coordination
              </span>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
              color: colors.ink, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>Active</strong> · 🇷🇺 Russian state · 🌐 Arabic anti-imperial · 🇪🇸 Sachs corpus · 🇫🇷 Elucid · 🇩🇪 alt-left
              </div>
              <div style={{ color: colors.inkMute }}>
                <strong style={{ color: colors.inkSoft }}>Implicit</strong> · 🇨🇳 Chinese state (selective amplification)
              </div>
            </div>
          </div>

          {/* μ — system avoidance */}
          <div style={{ padding: "14px 16px", background: colors.paper,
            border: `1px solid ${colors.ruleSoft}`,
            borderLeft: `3px solid ${colors.meta}`, borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                fontSize: 18, color: colors.meta, lineHeight: 1, fontWeight: 400 }}>μ</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.meta, letterSpacing: 0.8, textTransform:"uppercase",
                fontWeight: 600 }}>
                Surfaces system avoidance
              </span>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
              color: colors.ink, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>Active</strong> · 🇸🇪 Swedish (SVT) · 🇩🇰 Danish · 🇫🇷 institutional
              </div>
              <div style={{ color: colors.inkMute }}>
                <strong style={{ color: colors.inkSoft }}>Practiced</strong> · 🇩🇪 German government (Third Party Rule)
              </div>
            </div>
          </div>

          {/* Silent / no-position */}
          <div style={{ padding: "14px 16px", background: colors.paper,
            border: `1px solid ${colors.ruleSoft}`,
            borderLeft: `3px solid ${colors.muted}`, borderRadius: 2 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic",
                fontSize: 18, color: colors.muted, lineHeight: 1, fontWeight: 400 }}>—</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
                color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
                fontWeight: 600 }}>
                Silent · positioning by absence
              </span>
            </div>
            <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12,
              color: colors.ink, lineHeight: 1.6 }}>
              🇯🇵 Japanese mainstream — third-person framing of a global question. Selective non-engagement, given the same outlets cover Ukraine war / tariffs / semiconductors with clear stances.
            </div>
          </div>
        </div>

        {/* Tight observation — the asymmetry between α and β endorsement. */}
        <div style={{ marginTop: 18, fontFamily:"'Fraunces', serif", fontStyle:"italic",
          fontSize: 14, color: colors.inkSoft, lineHeight: 1.5, letterSpacing: -0.05 }}>
          α and β endorsements are not symmetric: α is endorsed where investigations have produced names; β is endorsed where political distance from the West makes the position cheap to hold. Same fact, different stakes — and stake structure shows up in the register before it shows up in the position itself.
        </div>
      </div>

      {/* Closing punchline — propagation cascade */}
      <div style={{
        marginTop: 12,
        padding: "24px 28px",
        background: "rgba(122, 106, 84, 0.05)",
        border: `1px solid rgba(122, 106, 84, 0.18)`,
        borderLeft: `4px solid ${colors.meta}`,
        borderRadius: 2,
      }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
          color: colors.meta, letterSpacing: 1.0, textTransform:"uppercase",
          fontWeight: 600, marginBottom: 12 }}>
          Tone is the propagation mechanism
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontSize: 18,
          lineHeight: 1.5, color: colors.ink, letterSpacing: -0.1, marginBottom: 12 }}>
          Each register doesn't just position the outlet — it shapes what readers in that ecosystem can feel about the case.
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
          lineHeight: 1.65, color: colors.inkSoft }}>
          English mainstream's de-dramatization deflates urgency — readers don't feel they need to demand consequences. Polish "sprawa zamknięta" closes the question — adjacent Polish media cannot adopt a neutral register without registering as traitorous. Japanese silence skips the question entirely — readers don't encounter it. Russian indignation activates grievance — reinforces a pre-existing anti-Western frame. <strong style={{ color: colors.ink, fontWeight: 600 }}>Same evidence, fourteen reader experiences.</strong> The tone an outlet selects is not just a signal of where they sit — it is the transmission packet they hand to the reader.
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// MAIN COMPONENT
// ============================================================================

function TraceV04Experience({ mode, setMode }) {

  // Timeline selection — pick the timeline matching current mode. Each mode
  // has its own idx-space; when the user switches modes we cap the idx so
  // the new timeline doesn't run past its end.
  const activeTimeline = mode === "v04" ? TIMELINE_V04 : TIMELINE_V03;

  const [idx, setIdx] = useState(activeTimeline.length - 1); // start at "today"
  const [playing, setPlaying] = useState(false);
  // Three-state transport: idle / playing / paused. Paused means the
  // animation is stopped but idx is preserved (user examines the
  // current frame). Different from Stop, which resets to idx=0.
  const [paused, setPaused] = useState(false);

  // Shared state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEv, setSelectedEv] = useState(null);
  const [hoverCand, setHoverCand] = useState(null);
  const [hoverEv, setHoverEv] = useState(null);

  // Page-level fullscreen via the browser Fullscreen API. When on, the entire
  // page enters browser fullscreen (browser chrome hidden) — the graph stays
  // its normal size and the user can scroll to read content beneath it. This
  // is different from the previous behavior where "fullscreen" meant the
  // graph took 100vh by CSS, which hid the rest of the page.
  const togglePageFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (req) req.call(el).catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
      if (exit) exit.call(document).catch(() => {});
    }
  };
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

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
  // Cluster drawer — when a cluster row is clicked, open this drawer to show
  // the cluster's rationale + member list (each member is clickable to drill
  // into a regular EvidenceDrawer). Mirrors how single evidence drills in.
  const [clusterDrawerId, setClusterDrawerId] = useState(null);

  // Timeline playback — advances idx while `playing` is true. Works for both
  // v0.3 and v0.4: which timeline advances is determined by `activeTimeline`.
  // If the user presses play while at the end, rewind to the start so the
  // animation has somewhere to go (otherwise play becomes a no-op).
  useEffect(() => {
    if (!playing) return;
    if (idx >= activeTimeline.length - 1) {
      setIdx(0);
      return;
    }
    const t = setTimeout(
      () => setIdx(i => Math.min(i + 1, activeTimeline.length - 1)),
      1600
    );
    return () => clearTimeout(t);
  }, [playing, idx, activeTimeline.length]);

  // Stop playback once we hit the last frame (so play doesn't auto-loop).
  useEffect(() => {
    if (playing && idx >= activeTimeline.length - 1) {
      const t = setTimeout(() => { setPlaying(false); setPaused(false); }, 1600);
      return () => clearTimeout(t);
    }
  }, [playing, idx, activeTimeline.length]);

  // Reset selection + cap idx when switching modes. Uses a ref to skip the
  // initial mount so we don't fire setPlaying(false) before the user has
  // had a chance to press play.
  const didMountMode = useRef(false);
  useEffect(() => {
    if (!didMountMode.current) { didMountMode.current = true; return; }
    setSelectedEv(null);
    setHoverCand(null);
    setHoverEv(null);
    setFocusStoryline(null);
    setPlaying(false);
    setIdx(prev => Math.min(prev, activeTimeline.length - 1));
  }, [mode]);

  // Current timepoint + evidence filtered to that timepoint's date.
  const tp = activeTimeline[idx];
  const activeEvV03 = useMemo(() => {
    if (mode !== "v03") return [];
    return EVIDENCE_V03.filter(e => e.published <= tp.date);
  }, [mode, tp.date]);
  const activeEvV04 = useMemo(() => {
    if (mode !== "v04") return [];
    return EVIDENCE_V04.filter(e => e.published <= tp.date);
  }, [mode, tp.date]);

  // Active graph inputs based on mode
  const graphEvidence = mode === "v04" ? activeEvV04 : activeEvV03;
  const graphDistribution = tp.distribution;

  // newEvIds tracks evidence that became visible at the current tick.
  // Persists until idx changes — gives the user a clear visual anchor
  // for "what just got added" while paused / examining a frame.
  // The brief flash animation still plays once when entries appear (via
  // SVG <animate>); the static stroke-color highlight stays.
  const [newEvIds, setNewEvIds] = useState(new Set());
  const prevEvIdsRef = useRef(null);
  useEffect(() => {
    const curr = new Set(graphEvidence.map(e => e.id));
    const prev = prevEvIdsRef.current;
    if (prev == null) {
      // First render: don't flash (avoids flashing all 37 on page load).
      prevEvIdsRef.current = curr;
      return;
    }
    const added = [...curr].filter(id => !prev.has(id));
    prevEvIdsRef.current = curr;
    // Always update — even if empty — so old highlights clear when the
    // user advances to a tick that adds nothing new.
    setNewEvIds(new Set(added));
  }, [idx, mode]);

  // Selected evidence for drawer — must lookup across both evidence sets
  const selectedEvObj = useMemo(() => {
    if (!selectedEv) return null;
    return (mode === "v04" ? EVIDENCE_V04 : EVIDENCE_V03).find(e => e.id === selectedEv);
  }, [selectedEv, mode]);

  // Fullscreen viewport sizing
  const viewportRef = useRef(null);
  const [viewport, setViewport] = useState({ w: 1400, h: 800 });
  // Masthead height measurement — used in fullscreen to size the graph
  // wrapper to (100vh - mastheadH), so the timeline panel sits flush
  // against the viewport bottom. Re-measured on resize / fullscreen
  // toggle since masthead can wrap on narrow viewports.
  const mastheadRef = useRef(null);
  const [mastheadH, setMastheadH] = useState(90);
  useEffect(() => {
    const update = () => {
      if (viewportRef.current) {
        const r = viewportRef.current.getBoundingClientRect();
        setViewport({ w: Math.max(800, r.width), h: Math.max(500, r.height) });
      }
      if (mastheadRef.current) {
        setMastheadH(mastheadRef.current.getBoundingClientRect().height);
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
      @keyframes filmGrain {
        0%, 32%   { background-image: ${PAPER_GRAIN_A}, ${PAPER_MOTTLE_URL}; }
        33%, 65%  { background-image: ${PAPER_GRAIN_B}, ${PAPER_MOTTLE_URL}; }
        66%, 100% { background-image: ${PAPER_GRAIN_C}, ${PAPER_MOTTLE_URL}; }
      }
      .trace-search-input::placeholder {
        color: #ABA594;
        font-weight: 300;
        font-style: italic;
        opacity: 1;
      }
      .trace-search-input::-webkit-input-placeholder {
        color: #ABA594;
        font-weight: 300;
        font-style: italic;
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
      {/* MASTHEAD — full-width row, hidden in fullscreen so the graph
          gets the entire viewport (matches v0.3's approach which works
          reliably for scroll behavior). */}
      {!isFullscreen && (
        <div ref={mastheadRef}>
          <Masthead
            mode={mode} setMode={setMode}
            activeEvidenceCount={graphEvidence.length}
            currentLabel={tp.label}
            currentDate={tp.date}
            isFullscreen={isFullscreen}
            onToggleFullscreen={togglePageFullscreen}
          />
        </div>
      )}

      {/* Graph region — full screen width, no maxWidth/margin
          constraint (matches v0.3). Height stays calc(100vh - 132px)
          in normal mode and uses 100vh in fullscreen since the
          masthead is hidden. Below the wrapper sits the rest of
          the case-file content, reachable by normal page scroll. */}
      <div ref={viewportRef}
        style={{
          position: "relative",
          width: "100%",
          height: isFullscreen
            ? "100vh"
            : "calc(100vh - 132px)",
          minHeight: isFullscreen ? undefined : 560,
          ...PAPER_TEXTURE_BG,
          overflow: "hidden",
          borderBottom: `1px solid ${colors.rule}`,
        }}>
        <div
          style={{
            position:"absolute", inset: 0,
          }}>
          <FullscreenGraph
            activeEvidence={graphEvidence}
            newEvIds={newEvIds}
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
            setClusterDrawerId={setClusterDrawerId}
          />
        </div>

        {/* Legend — top-left of graph region */}
        <div style={{
          position:"absolute", top: 22, left: 24, zIndex: 6,
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

        {/* Zoom + pan controls removed: they were specific to the old
            graph-only fullscreen (where the graph itself filled the viewport).
            Page-level fullscreen renders the graph at normal size, so the
            built-in browser zoom (⌘+ / ⌘−) handles magnification needs. */}

        <DistributionOverlay
          distribution={graphDistribution}
          hoverCand={hoverCand} setHoverCand={setHoverCand}
          tp={tp}
          playing={playing}
          onPlayToggle={()=>setPlaying(p=>!p)}
          mode={mode}
          focusStoryline={focusStoryline}
          setFocusStoryline={setFocusStoryline}
        />

        <TimelineOverlay idx={idx} setIdx={setIdx}
          timeline={activeTimeline}
          turningPoints={mode === "v04" ? TURNING_POINTS_V04 : TURNING_POINTS}
          playing={playing}
          paused={paused}
          onPlayToggle={()=>{
            // play / pause / resume — single button, three meanings:
            //   idle  → start playing
            //   playing → pause (keep idx, can resume)
            //   paused → resume from current idx
            if (playing) { setPlaying(false); setPaused(true); }
            else { setPlaying(true); setPaused(false); }
          }}
          onStop={()=>{
            // Stop returns to the default view: idx at the end of the
            // timeline, where all evidence is visible. This matches the
            // initial state on page load. Trace's "default" is the
            // complete picture, not the empty start.
            setPlaying(false); setPaused(false);
            setIdx(activeTimeline.length - 1);
          }}/>

        {selectedEvObj && (
          <EvidenceDrawer ev={selectedEvObj}
            onClose={()=>setSelectedEv(null)}
            onJumpTo={(id)=>setSelectedEv(id)}
            mode={mode}/>
        )}

        {/* Cluster drawer — shows when a cluster row is clicked.
            Drilling into a member from inside it closes the cluster drawer
            and opens the regular EvidenceDrawer for that member. */}
        {clusterDrawerId && (() => {
          const cl = SECONDARY_CLUSTERS.find(c => c.id === clusterDrawerId);
          if (!cl) return null;
          return (
            <ClusterDrawer
              cluster={cl}
              mode={mode}
              isInlineExpanded={expandedClusters.has(cl.id)}
              onToggleInline={() => {
                const next = new Set(expandedClusters);
                if (next.has(cl.id)) next.delete(cl.id);
                else next.add(cl.id);
                setExpandedClusters(next);
              }}
              onOpenMember={(memberId) => {
                setClusterDrawerId(null);
                setSelectedEv(memberId);
              }}
              onClose={() => setClusterDrawerId(null)}
            />
          );
        })()}
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

      {/* v0.4 mode: full long-form exhibit.
          Order rationale (post-reorg, now reader-flow first):
          · StorylineReconstructions LEADS — sits directly below the evidence
            graph. α is the highest-coverage card, but defaults COLLAPSED so
            the reader sees the full attribution space at once. The leverage
            point appears on the folded card itself, so the reader can read
            "what could shift this" without expanding.
          · α deep-dive (SubClaimBreakdown + SurvivingCausalChain) follows —
            once the reader chooses to go deeper into α, these unpack it.
          · Cross-impact table shows where evidence-level leverage lives.
          · PositionFromRegister: 14-language tone analysis.
          · AnchorsRail: 13 facts, common trunk.
          · AggregationReadout, SuppressionAndJudicial, LimitsSectionV04. */}
      {mode === "v04" && !isFullscreen && (
        <>
          <StorylineReconstructions
            focusStoryline={focusStoryline}
            setFocusStoryline={setFocusStoryline}/>
          <SubClaimBreakdown />
          <SurvivingCausalChain />
          <CrossImpactTable />
          <PositionFromRegister />
          <AnchorsRail />
          <AggregationReadout />
          <SuppressionAndJudicial />
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


// ############################################################################
// V0.4.2 — STRUCTURAL EXCLUSION + PROCESS SUBCLAIM
// (extracted from TraceCaseFileV042.jsx; SUBCLAIM_MU_V04 omitted because
//  this file already has it; PROCESS_SUBCLAIM_V042 above replaces
//  V042's SUBCLAIM_DISTRIBUTION_V04.)
// ############################################################################

// --- Excluded/subclaim candidate sets ---
const CAND_EXCLUDED_V04 = new Set(["C1","C3","C4"]);
const CAND_SUBCLAIM_V04 = new Set(["C_insufficient"]);  // not attribution-claim candidates

// --- STRUCTURAL_EXCLUSIONS_V04 (data the StructurallyExcluded function reads) ---
// v0.4.1 — explicit structural exclusions.
// A candidate appears here when it carries L2 rules_out_a_class or L3 breaks_a_story
// refutations from sources above the gate threshold. This surfaces WHY the candidate's
// weight is zero, so readers can distinguish "structurally impossible" from "low-weight".
const STRUCTURAL_EXCLUSIONS_V04 = [
  {
    candidate: "C1",
    label: "United States — direct execution (Hersh version)",
    formerSoftmaxWeight: 0.057,
    excluded_by: [
      { id: "E6",  type: "GATE",
        reason: "Andromeda forensic chain (HMX residue, DNA, fingerprints, forged identity papers) points to a Ukrainian-operator execution layer, not US Navy personnel. Rules out US-direct-execution as a class." },
      { id: "F3",  type: "BREAKS",
        reason: "17-hour detonation gap is incompatible with Hersh's sonar-triggered one-shot remote mechanism. The predicted synchronous detonation did not occur." },
      { id: "F12", type: "BREAKS",
        reason: "One of four pipeline strands survived intact — inconsistent with a professional state-navy operation that would have ensured all four. Signature of a resource-constrained team." },
    ],
    preservedQuestion: "A wider Western coordination (US enabling, UK possible, Poland staging) is NOT refuted by the above. That question is preserved in β′ (Western coordination, principal unclear) and ζ (UK-layer, under-examined).",
  },
  {
    candidate: "C3",
    label: "Ukraine — independent rogue operators (no state authorization)",
    formerSoftmaxWeight: 0.042,
    excluded_by: [
      { id: "F2",  type: "GATE",
        reason: "Military-grade HMX explosive supply chain requires state-level access. Rules out the class of non-state-enabled operators regardless of executor identity." },
      { id: "E17", type: "BREAKS",
        reason: "BGH (German Federal Court of Justice) December 2025 ruling explicitly classifies the operation as 'a foreign government intelligence agency' action. Judicial T1 authority directly contradicts rogue-operator framing." },
    ],
    preservedQuestion: null,
  },
  {
    candidate: "C4",
    label: "Russia — self-sabotage (false flag)",
    formerSoftmaxWeight: 0.054,
    excluded_by: [
      { id: "E25", type: "GATE",
        reason: "Jeffrey Sachs at the UN Security Council enumerates seven plausible Western actors (US, UK, Poland, Norway, Germany, Denmark, Sweden) and explicitly excludes Russia. Academic-authority derived analysis in a high-authority forum." },
      { id: "F7",  type: "GATE",
        reason: "Andromeda forensic chain survives three years of cross-jurisdictional review (German, Polish, Italian judicial systems). A false-flag δ would require fabricated forensics to withstand three independent judiciaries — structurally implausible." },
    ],
    preservedQuestion: null,
  },
];

// Evidence layer — 37 items (16 v0.3 + 21 v0.4 new)
// Edges use modality-corrected values from audit round.

// --- ProcessSubclaim ---
function ProcessSubclaim() {
  const sub = SUBCLAIM_MU_V04;

  return (
    <div style={{ padding: "48px 56px 48px", background: colors.paperDeep }}>
      <Rule />
      <div style={{ marginTop: 40, marginBottom: 32, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 72, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.meta, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Subclaim · separate question
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: -0.5, color: colors.ink }}>
            Why has this not been institutionally closed?
          </div>
          <div style={{ marginTop: 12, fontFamily:"'Fraunces', serif", fontStyle:"italic",
            fontSize: 15, color: colors.inkMute, lineHeight: 1.5 }}>
            Parent claim: <span style={{ color: colors.inkSoft }}>{sub.parentClaim}</span>
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 16,
          color: colors.inkSoft, lineHeight: 1.55, maxWidth: 620 }}>
          μ addresses a question the attribution distribution above cannot answer. It is a subclaim, not a sibling reconstruction — its percentage lives on a different axis and is not comparable to α, β, ε, ζ. 13.6% of the total evidence corpus (via C_insufficient edges) addresses this subclaim; within that subclaim, μ is the sole answer the evidence supports. Previously μ sat alongside attribution storylines in the main distribution, which created a category error — readers were invited to compare apples with oranges. v0.4.2 separates them.
        </div>
      </div>

      {/* Subclaim card — μ */}
      <div style={{
        border: `1px solid ${colors.ruleSoft}`,
        borderLeft: `3px solid ${colors.meta}`,
        borderRadius: 2,
        background: colors.paper,
      }}>
        {/* Header */}
        <div style={{ padding: "22px 30px", display:"grid",
          gridTemplateColumns:"auto 1fr auto", gap: 24, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap: 10, minWidth: 100 }}>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize: 40, fontStyle:"italic",
              color: colors.meta, fontVariantNumeric:"tabular-nums", lineHeight: 0.95,
              fontWeight: 400 }}>
              100<span style={{ fontSize: 18, opacity: 0.55, marginLeft: 1 }}>%</span>
            </div>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 14,
              color: colors.meta, fontWeight: 600, letterSpacing: 0.5, lineHeight: 1 }}>
              μ
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize: 20, fontWeight: 400,
              color: colors.ink, lineHeight: 1.25, letterSpacing: -0.25 }}>
              {sub.label}
            </div>
            <div style={{ marginTop: 6, display:"inline-block",
              fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
              color: colors.meta, letterSpacing: 1, textTransform:"uppercase",
              background: `${colors.meta}15`, padding:"3px 7px",
              border: `1px solid ${colors.meta}40`, borderRadius: 2 }}>
              Within-subclaim coverage · 100% · evidence share {Math.round(sub.evidenceShare * 100)}%
            </div>
          </div>
        </div>

        {/* Expanded body — reuse the MuExpansion component */}
        <div style={{ borderTop: `1px solid ${colors.ruleSoft}`,
          padding: "26px 30px 30px", background: colors.paperDeep }}>
          <MuExpansion story={sub} />
        </div>
      </div>

      {/* Cross-claim orientation note */}
      <div style={{ marginTop: 24, padding: "18px 22px",
        background: colors.paper, border: `1px solid ${colors.ruleSoft}`,
        borderLeft: `3px solid ${colors.ink}`, borderRadius: 2 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 8 }}>
          How this relates to the attribution distribution above
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
          color: colors.inkSoft, lineHeight: 1.6, maxWidth: 900 }}>
          α's 70% coverage and μ's 100% coverage are NOT on the same axis. α occupies 70% of the attribution-claim space ("who attacked"). μ occupies 100% of the process-subclaim space ("why not institutionally closed"). The two questions are related — α being answered would reduce the need for μ — but they are not competing answers. In v0.4 original, both sat in a single percentage bar, which misled readers into treating μ as a fractional attribution answer. v0.4.2 separates them into parallel claim spaces.
        </div>
      </div>
    </div>
  );
}

// --- StructurallyExcluded (with header) ---
// ============================================================================
// STRUCTURALLY EXCLUDED CANDIDATES — surfaces C1, C3, C4 exclusion at the
// candidate layer (not the storyline layer). δ is also preserved as an excluded
// storyline card above; this section addresses the same concern from the data-
// layer perspective: these are candidate hypotheses that L2 exclusion gating
// (§2.5.4 Step 1) mandates be set to zero before softmax, not after.
// ============================================================================

function StructurallyExcluded({ setSelectedEv }) {
  const totalFormer = STRUCTURAL_EXCLUSIONS_V04.reduce((s,x)=> s + x.formerSoftmaxWeight, 0);

  // Wired to the top-level graph region and to the AnchorsRail section.
  // F-prefix IDs (F1–F13) are anchor facts that live in AnchorsRail; E-prefix
  // IDs are evidence nodes in the graph. Click an evidence pill → scroll to the
  // appropriate section → briefly flash the target so the reader can audit the
  // refutation source without losing context.
  const onEvidenceClick = (evId) => {
    const isAnchor = evId && evId.startsWith("F");
    if (!isAnchor && setSelectedEv) setSelectedEv(evId);

    setTimeout(() => {
      const targetEl = isAnchor
        ? document.getElementById(`anchor-${evId}`)
        : document.getElementById("trace-graph-region");
      if (!targetEl) return;
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      if (isAnchor) {
        // Brief flash to spotlight the anchor the reader was sent to.
        const prevOutline = targetEl.style.outline;
        const prevOffset  = targetEl.style.outlineOffset;
        const prevZ       = targetEl.style.zIndex;
        targetEl.style.outline = `2px solid ${colors.warn}`;
        targetEl.style.outlineOffset = "3px";
        targetEl.style.zIndex = "2";
        setTimeout(() => {
          targetEl.style.outline = prevOutline;
          targetEl.style.outlineOffset = prevOffset;
          targetEl.style.zIndex = prevZ;
        }, 1600);
      }
    }, 40);
  };

  return (
    <div style={{ padding: "48px 56px 48px", background: colors.paper }}>
      <Rule />
      <div style={{ marginTop: 40, marginBottom: 32, display:"grid",
        gridTemplateColumns:"1fr 2fr", gap: 72, alignItems:"baseline" }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 10,
            color: colors.warn, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 14 }}>
            Structurally excluded · {STRUCTURAL_EXCLUSIONS_V04.length} candidates
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 32, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: -0.5, color: colors.ink }}>
            Three candidates ruled out — not low-weight, structurally impossible.
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontSize: 16,
          color: colors.inkSoft, lineHeight: 1.55, maxWidth: 620 }}>
          Each candidate below carries at least one L2 <code style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 13, fontStyle:"normal", color: colors.ink }}>rules_out_a_class</code> or L3 <code style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 13, fontStyle:"normal", color: colors.ink }}>breaks_a_story</code> refutation above the gate threshold. Per §2.5.4 Step 1, these exclusions precede softmax, not follow it. Weight is <strong style={{ color: colors.ink, fontStyle:"normal" }}>0 by construction</strong>. Preserved here in full — not buried in a footnote — so a reader can audit the exclusion logic the same way they audit any live candidate.
        </div>
      </div>

      {/* Summary totals row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 1,
        background: colors.ruleSoft, border: `1px solid ${colors.ruleSoft}`,
        borderRadius: 2, overflow:"hidden", marginBottom: 24 }}>
        <div style={{ background: colors.paper, padding: "18px 22px" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
            Former softmax weight (v0.4)
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 28, fontStyle:"italic",
            color: colors.inkMute, textDecoration:"line-through",
            textDecorationColor: colors.warn, textDecorationThickness: "1.5px",
            fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            {(totalFormer * 100).toFixed(1)}<span style={{ fontSize: 14, opacity: 0.6 }}>%</span>
          </div>
        </div>
        <div style={{ background: colors.paper, padding: "18px 22px" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
            Current weight (v0.4.1)
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 28, fontStyle:"italic",
            color: colors.ink, fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            0.0<span style={{ fontSize: 14, opacity: 0.6 }}>%</span>
          </div>
        </div>
        <div style={{ background: colors.paper, padding: "18px 22px" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
            color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase", marginBottom: 6 }}>
            Freed mass redistributed
          </div>
          <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 12.5,
            color: colors.inkSoft, lineHeight: 1.45 }}>
            → Combined with the 13.6% moved to the μ subclaim, the attribution distribution rescales by factor 1.404. C2b goes from 33.5% → 47.0%; every active attribution candidate scales up proportionally. No discretionary discount applied.
          </div>
        </div>
      </div>

      {/* Per-candidate cards */}
      <div style={{ display:"flex", flexDirection:"column", gap: 14 }}>
        {STRUCTURAL_EXCLUSIONS_V04.map(ex => (
          <ExcludedCandidateCard key={ex.candidate} ex={ex} onEvidenceClick={onEvidenceClick} />
        ))}
      </div>

      {/* Methodological note */}
      <div style={{ marginTop: 26, padding: "18px 22px",
        background: colors.paperDeep, border: `1px solid ${colors.ruleSoft}`,
        borderLeft: `3px solid ${colors.ink}`, borderRadius: 2 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase", marginBottom: 8 }}>
          Why exclusion is not the same as low weight
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
          color: colors.inkSoft, lineHeight: 1.6, maxWidth: 900 }}>
          A low-weight candidate is one the evidence does not strongly support. A structurally excluded candidate is one the evidence <em style={{ color: colors.ink }}>forbids</em> — its mechanism is incompatible with observation, or its narrative is falsified by a specific counterfactual. The two were conflated in v0.4's softmax distribution, which assigned floor weights of 4.2–5.7% to candidates that should have been at zero. v0.4.1 separates them. Readers consulting historical v0.4 output should note: those floor weights were a display artifact of softmax aggregation, not a claim that the candidates were alive.
        </div>
      </div>
    </div>
  );
}


// --- ExcludedCandidateCard ---
function ExcludedCandidateCard({ ex, onEvidenceClick }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${colors.ruleSoft}`,
      borderLeft: `3px solid ${colors.warn}`,
      borderRadius: 2,
      background: colors.paper,
    }}>
      {/* Header row */}
      <div onClick={()=>setIsOpen(!isOpen)}
        style={{ padding: "18px 24px", cursor:"pointer",
          display:"grid", gridTemplateColumns:"auto 1fr auto auto", gap: 20,
          alignItems:"center" }}>
        {/* Candidate code */}
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 13,
          color: colors.warn, fontWeight: 600, letterSpacing: 0.5,
          minWidth: 32 }}>
          {ex.candidate}
        </div>

        {/* Label + excluded-by evidence summary (clickable badges) */}
        <div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 17,
            color: colors.ink, lineHeight: 1.3, letterSpacing: -0.2 }}>
            {ex.label}
          </div>
          <div style={{ marginTop: 6, display:"flex", flexWrap:"wrap", gap: 6,
            fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            alignItems:"center" }}>
            <span style={{ color: colors.inkMute, letterSpacing: 0.7,
              textTransform:"uppercase" }}>Excluded by</span>
            {ex.excluded_by.map((e,i) => (
              <button key={i}
                onClick={(event)=>{ event.stopPropagation(); onEvidenceClick && onEvidenceClick(e.id); }}
                title={`Open ${e.id} in the evidence graph`}
                style={{
                  padding:"2px 7px", borderRadius: 2,
                  background: e.type === "GATE" ? `${colors.warn}18` : `${colors.primary}12`,
                  color: e.type === "GATE" ? colors.warn : colors.primary,
                  border: `1px solid ${e.type === "GATE" ? `${colors.warn}40` : `${colors.primary}30`}`,
                  fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: 0.4, fontWeight: 600, cursor:"pointer",
                  transition:"background 0.15s, transform 0.1s" }}
                onMouseEnter={(ev)=>{ ev.currentTarget.style.background = e.type === "GATE" ? `${colors.warn}30` : `${colors.primary}22`; }}
                onMouseLeave={(ev)=>{ ev.currentTarget.style.background = e.type === "GATE" ? `${colors.warn}18` : `${colors.primary}12`; }}>
                {e.type} · {e.id} ↗
              </button>
            ))}
          </div>
        </div>

        {/* Former weight — struck through */}
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
            color: colors.inkMute, letterSpacing: 0.7, textTransform:"uppercase",
            marginBottom: 3 }}>
            former softmax
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 20, fontStyle:"italic",
            color: colors.inkMute, textDecoration:"line-through",
            textDecorationColor: colors.warn, textDecorationThickness: "1.5px",
            fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            {(ex.formerSoftmaxWeight * 100).toFixed(1)}%
          </div>
        </div>

        {/* Current weight — zero */}
        <div style={{ textAlign:"right", minWidth: 60 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 8.5,
            color: colors.warn, letterSpacing: 0.7, textTransform:"uppercase",
            marginBottom: 3 }}>
            gated out
          </div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize: 20, fontStyle:"italic",
            color: colors.ink, fontVariantNumeric:"tabular-nums", lineHeight: 1 }}>
            0%
          </div>
        </div>
      </div>

      {/* Expanded body: evidence reasons + preserved question */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${colors.ruleSoft}`,
          padding: "22px 28px 24px", background: colors.paperDeep }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
            color: colors.inkMute, letterSpacing: 0.8, textTransform:"uppercase",
            marginBottom: 14 }}>
            Refutations — {ex.excluded_by.length} {ex.excluded_by.length === 1 ? "entry" : "entries"}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap: 14 }}>
            {ex.excluded_by.map((e,i) => (
              <div key={i} style={{ display:"grid",
                gridTemplateColumns:"auto 1fr", gap: 16, alignItems:"start" }}>
                <div>
                  <div style={{
                    display:"inline-block",
                    padding:"4px 8px", borderRadius: 2,
                    background: e.type === "GATE" ? `${colors.warn}18` : `${colors.primary}12`,
                    color: e.type === "GATE" ? colors.warn : colors.primary,
                    border: `1px solid ${e.type === "GATE" ? `${colors.warn}40` : `${colors.primary}30`}`,
                    fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                    letterSpacing: 0.7, fontWeight: 600, textTransform:"uppercase",
                    marginBottom: 4, whiteSpace:"nowrap" }}>
                    {e.type === "GATE" ? "L2 · rules out a class" : "L3 · breaks a story"}
                  </div>
                  <button
                    onClick={()=> onEvidenceClick && onEvidenceClick(e.id)}
                    title={`Open ${e.id} in the evidence graph`}
                    style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 11,
                      color: colors.ink, fontWeight: 600, letterSpacing: 0.3,
                      background: "transparent", border: "none",
                      padding: 0, cursor:"pointer",
                      textDecoration: "underline",
                      textDecorationColor: colors.ruleSoft,
                      textDecorationThickness: "1px",
                      textUnderlineOffset: "3px",
                      transition: "text-decoration-color 0.15s" }}
                    onMouseEnter={(ev)=>{ ev.currentTarget.style.textDecorationColor = colors.ink; }}
                    onMouseLeave={(ev)=>{ ev.currentTarget.style.textDecorationColor = colors.ruleSoft; }}>
                    {e.id} ↗
                  </button>
                </div>
                <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                  color: colors.inkSoft, lineHeight: 1.6, paddingTop: 2 }}>
                  {e.reason}
                </div>
              </div>
            ))}
          </div>

          {ex.preservedQuestion && (
            <div style={{ marginTop: 22, padding: "14px 18px",
              background: colors.paper,
              border: `1px solid ${colors.ruleSoft}`, borderLeft: `3px solid ${colors.ink}`,
              borderRadius: 2 }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
                color: colors.inkMute, letterSpacing: 0.9, textTransform:"uppercase",
                marginBottom: 6 }}>
                What this exclusion does NOT refute
              </div>
              <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
                color: colors.ink, lineHeight: 1.6 }}>
                {ex.preservedQuestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- ExcludedExpansion ---
function ExcludedExpansion({ story }) {
  return (
    <div>
      <div style={{ marginBottom: 18, padding: "14px 18px",
        background: `${colors.warn}10`,
        border: `1px solid ${colors.warn}30`, borderLeft: `3px solid ${colors.warn}`,
        borderRadius: 2 }}>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          color: colors.warn, letterSpacing: 0.9, textTransform:"uppercase",
          marginBottom: 8 }}>
          Why this storyline is excluded, not low-weight
        </div>
        <div style={{ fontFamily:"'Instrument Sans', sans-serif", fontSize: 13,
          color: colors.inkSoft, lineHeight: 1.6 }}>
          {story.excludedReason}
        </div>
        <div style={{ marginTop: 10, fontFamily:"'Instrument Sans', sans-serif",
          fontSize: 12, color: colors.inkMute, lineHeight: 1.5,
          fontStyle:"italic" }}>
          δ is one of three structurally excluded hypotheses. The corresponding candidate (C4) is also listed in the <strong style={{ color: colors.ink, fontStyle:"normal" }}>Structurally Excluded</strong> section below, alongside C1 (US direct / Hersh) and C3 (independent rogue operators). δ is the only excluded storyline because C1 and C3 were not standalone v0.4 storylines — they existed only at the candidate layer.
        </div>
      </div>
      <div style={{ marginBottom: 12, fontFamily:"'JetBrains Mono', monospace",
        fontSize: 9, color: colors.inkMute, letterSpacing: 0.9,
        textTransform:"uppercase" }}>
        Narrative preserved for audit — not a live hypothesis
      </div>
      <div style={{ fontFamily:"'Fraunces', serif", fontSize: 15,
        color: colors.inkMute, lineHeight: 1.65, fontStyle:"italic",
        paddingLeft: 14, borderLeft: `1px solid ${colors.ruleSoft}` }}>
        {story.narrative}
      </div>
    </div>
  );
}


// ############################################################################
// V0.5 — READ / EXAMINE / AUDIT MODE ARCHITECTURE (extracted from TraceCaseFileV05.jsx)
// 6 conflicting identifiers renamed with _V05 suffix:
//   ANCHORS, Rule, STORYLINES, StorylineCard, Tag, colors
// ############################################################################


// ============================================================================
// TRACE CASE FILE — Nord Stream Pipeline Sabotage (v0.5)
//
// Layered workspace:
//   READ    → Reader-grade orientation. Current understanding + 5 storyline
//             cards. The α hero card carries strongest argument / weakest
//             point / what would change directly on its face.
//   EXAMINE → Analyst-grade dissection. Four lenses:
//             Claim Map · Evidence · Contradictions · Register.
//   AUDIT   → Source-grade trail. Timeline · Provenance · Briefing.
//
// Visual language preserved from v0.4.2: paper aesthetic, Fraunces +
// Instrument Sans + JetBrains Mono, primary rust + secondary navy,
// no rounded corners (border-radius ≤ 2).
// ============================================================================


// ============================================================================
// DESIGN TOKENS
// ============================================================================

const colors_V05 = {
  paper:        "#FAF8F3",
  paperDeep:    "#F2EEE4",
  paperGlass:   "rgba(250, 248, 243, 0.97)",
  ink:          "#1A1A1A",
  inkSoft:      "#4A4A4A",
  inkMute:      "#8A8A8A",
  rule:         "#D9D4C7",
  ruleSoft:     "#E8E4D8",
  primary:      "#A03A2C",   // rust — α, leading reconstruction
  primarySoft:  "#C87769",
  primaryDeep:  "#7A2C20",
  secondary:    "#1C3A5E",   // navy — analytical accent
  secondarySoft:"#6B8AAE",
  warn:         "#B8902E",   // ochre — turning points / structural exclusion
  warnDeep:     "#8B6A20",
  muted:        "#B7B0A0",
  meta:         "#7A6A54",
  good:         "#5A6E48",   // moss — established / supports
  goodSoft:     "#8A9C76",
};

const fonts = {
  serif: "'Fraunces', 'Georgia', serif",
  sans:  "'Instrument Sans', 'Helvetica Neue', sans-serif",
  mono:  "'JetBrains Mono', 'SFMono-Regular', monospace",
};

// Proof-state palette — used for Claim Map subclaims and Anchors
const proofPalette = {
  anchor:      { fg: colors_V05.good,      bg: "#E8EDE0", bd: colors_V05.goodSoft, label: "Established anchor" },
  strong:      { fg: colors_V05.primary,   bg: "#F4E4E0", bd: colors_V05.primarySoft, label: "Strong inference" },
  plausible:   { fg: colors_V05.secondary, bg: "#E4ECF4", bd: colors_V05.secondarySoft, label: "Plausible reconstruction" },
  speculative: { fg: colors_V05.warn,      bg: "#F4ECD8", bd: "#D4B870", label: "Speculative" },
  excluded:    { fg: colors_V05.muted,     bg: colors_V05.paperDeep, bd: colors_V05.rule, label: "Structurally excluded" },
};


// ============================================================================
// CASE META
// ============================================================================

const CASE_META = {
  id: "001",
  version: "v0.5",
  lastUpdated: "April 2026",
  question: "Who attacked the Nord Stream pipelines on 26 September 2022?",
  state: "Converging on structure · not closed on identity",
  stateRationale:
    "Three years on, judicial systems in Germany, Poland, and Italy converge on a state-level Ukrainian-linked operation. Political institutions across Sweden, Denmark, Germany, and the UN do not advance. The case is no longer evenly contested across competing actors — but it is also not institutionally resolved.",
  counts: {
    storylinesLive:        4,   // α, β′, ε, ζ
    storylinesExcluded:    1,   // δ kept for audit
    candidatesExcluded:    3,   // C1, C3, C4
    subclaim:              1,   // μ
    anchorFacts:          13,
    evidenceRecords:      37,
    contradictions:        8,
    languagesSurveyed:    14,
    jurisdictionsActive:   5,   // DE, PL, IT, SE, DK
  },
};


// ============================================================================
// CURRENT UNDERSTANDING — READ mode opener
// ============================================================================

const CURRENT_UNDERSTANDING = {
  headline: "A Ukrainian military-command operation, executed via the Zaluzhnyi track, with Polish post-facto protection and US prior awareness.",
  bodyLong: "The strongest current reconstruction is a Ukrainian military-command operation, led through the Zaluzhnyi track after presidential approval was withdrawn, with Polish logistical and judicial complicity and US foreknowledge that did not foreclose. It is the only live storyline that simultaneously absorbs the Andromeda forensic chain, the BGH ruling, the Polish refusal to extradite, the Italian Cassazione transfers, and the CIA warning to Germany. It is not a verdict. It is a structured reading of which reconstruction the surviving evidence makes most coherent.",
  notFullyExplains: "Why several institutions — Sweden, Denmark, Germany's political layer, the UN Security Council — have continued to avoid closure rather than name what their judicial counterparts already name.",
  leadingStoryline: "alpha",
};


// ============================================================================
// LOAD-BEARING UNKNOWNS — three tiers
// ============================================================================

const LOAD_BEARING_UNKNOWNS = {
  changeLeading: {
    label: "Unknowns that would change the leading reconstruction",
    rationale: "Disclosure here would either confirm α or move probability mass to β′ or ε.",
    items: [
      {
        q: "What exactly did Zaluzhnyi authorize, and on what date?",
        why: "Operational authorization is the single weakest documentary link in α. Spiegel 2026 reports Zaluzhnyi approved; Il Fatto reports Zelensky approved-then-withdrew. Direct documentation would adjudicate the split.",
        wouldShift: "α → confirm or fork into γ-variant",
      },
      {
        q: "Was CIA's 2022 stance passive awareness or tacit green light?",
        why: "The Spiegel-reported 'interested, not opposed' permits both readings. Declassified CIA cables would adjudicate between α (passive) and β′ (tacit permission).",
        wouldShift: "α ↔ β′",
      },
      {
        q: "What did Polish state actors know, and when?",
        why: "Hanning's Die Welt testimony names Polish authorization. Polish refusal to execute the German EAW is documented but its decision-making record is not.",
        wouldShift: "α → broaden complicity layer; β′ → strengthen",
      },
      {
        q: "What is in the full German prosecution file?",
        why: "BGH ruling text is public; the underlying evidentiary record is sealed under Third Party Rule. Disclosure would either confirm 'foreign government' as Ukraine or surface a wider coordination signal.",
        wouldShift: "Adjudicates α vs β′ on multiple axes",
      },
    ],
  },
  interesting: {
    label: "Unknowns that are interesting but not load-bearing",
    rationale: "Disclosure here would enrich the exhibit but not move probability mass between live storylines.",
    items: [
      {
        q: "Origin of the HMX supply chain.",
        why: "If traced to Ukrainian-captured Russian stock, α strengthens incrementally. If traced to US/NATO inventory, β′ strengthens incrementally. Either would refine α — neither would unseat it.",
      },
      {
        q: "Exact wording of Truss's SMS to Blinken.",
        why: "Independent retellings show variation. Resolving the wording bounds ζ's content credibility but does not adjudicate whether the UK question deserves its own storyline.",
      },
      {
        q: "Why the seventeen-hour interval between blasts.",
        why: "F3 is anchored as a physical anomaly incompatible with sonar-triggered remote detonation. The operational reasoning for the gap (resource-limited team, two-pass execution, deliberate signature) remains under-examined.",
      },
    ],
  },
  silence: {
    label: "Unknowns generated by institutional silence",
    rationale: "These are the load-bearing absences. Each is a case where an institution capable of resolving a question has chosen non-resolution. They feed μ and define the gap between converging structure and unclosed identity.",
    items: [
      {
        q: "Sweden's substantive jurisdictional reasoning.",
        why: "Closure cited 'kan antas saknas' (may be presumed lacking). Danish legal scholar Buhl publicly disputes this. The substantive reasoning record is not public.",
      },
      {
        q: "Denmark's substantive closure record.",
        why: "Defence Academy experts report being barred from public discussion. The legal basis is not in the public record.",
      },
      {
        q: "German Chancellor's Office record on US-intelligence sharing.",
        why: "Wolfgang Schmidt invoked Third Party Rule on the Bundestag inquiry. The underlying communications are sealed.",
      },
      {
        q: "Identities of the 12 UN Security Council abstainers' rationales.",
        why: "Non-vetoes by abstention are not customarily explained. The pattern of mass abstention buried the resolution; the per-state reasoning was not entered into record.",
      },
    ],
  },
};


// ============================================================================
// STORYLINES_V05 — five live (α/β′/ε/ζ/μ) + one structurally excluded (δ)
//
// Each storyline carries the new front-of-card fields:
//   strongestArgument · weakestPoint · whatWouldChange
// ============================================================================

const STORYLINES_V05 = [
  // -------------------------------------------------------------------------
  {
    id: "alpha",
    glyph: "α",
    kind: "leading_reconstruction",
    coverage: 0.70,
    isHero: true,
    label: "Ukrainian military bypass, Polish complicity, US awareness",
    shortLabel: "Ukrainian military bypass · Polish complicity · US awareness",
    claim:
      "Zaluzhnyi-led Ukrainian military leadership executed the operation after presidential approval was withdrawn. Poland enabled and protected operationally and judicially. The CIA was informed and chose not to foreclose.",

    strongestArgument: {
      headline: "α uniquely reconciles three otherwise awkward facts.",
      bullets: [
        "The Andromeda forensic trail (HMX, DNA, fingerprints, forged identity papers) points to a smaller operational layer with Ukrainian-linked execution — not a state-navy professional operation.",
        "The CIA's June 2022 warning to Germany via the Dutch MIVD chain implies prior knowledge, not surprise — and was followed by no foreclosure.",
        "Polish refusal to execute the German EAW, Italian Cassazione's three-step transfer, and the BGH's December 2025 'foreign government intelligence' ruling cohere only if Ukrainian state-linked authorship is the operative frame.",
      ],
    },
    weakestPoint: {
      headline: "Operational authorization is α's least documented link.",
      body:
        "α depends on reconstructing what Zaluzhnyi authorized, what Zelensky knew, and what Polish state actors agreed to — and when. The forensic and judicial record is strong on operational traces; the documentary record on command intent is sparse. Spiegel 2026 (Zaluzhnyi approved) and Il Fatto 2025 (Zelensky approved-then-withdrew under US pressure, Zaluzhnyi continued) are testimonial, not documentary.",
    },
    whatWouldChange: {
      headline: "Disclosure here would either confirm α or fork it.",
      items: [
        "Direct documentation of command authorization (Zaluzhnyi or General Staff communications).",
        "Clarification of Polish state-level knowledge and timing (Tusk-era Cabinet record).",
        "Full German prosecution file currently sealed under Third Party Rule.",
        "CIA / MIVD warning chain primary documents (currently classified).",
        "Trial record from Kuznetsov / Zhuravlev proceedings, if and when held.",
      ],
    },

    overlaySummary:
      "α is the only live storyline that simultaneously absorbs Andromeda, the BGH ruling, the Polish refusal, the Italian transfer, the CIA warning chain, and the post-facto Polish judicial legitimation. The 70% coverage is what is left when three candidates structurally exclude (15.3%) and the institutional non-resolution question is moved to its own subclaim (13.6%) — α is not propped up. It is what the surviving attribution-claim space converges on.",

    keyEvidence:    ["E6","E10","E11","E12","E13","E14","E17","E18","E24","E29","E30"],
    keyAnchors:     ["F1","F2","F3","F7","F8","F9","F10","F11","F12"],
    challengedBy:   ["E36"],
    contradictionStance: {
      "DE_judicial_vs_political":    "absorbs",
      "forensic_vs_official_silence":"absorbs",
      "ua_denial_vs_ua_media_pride": "absorbs",
      "pl_judicial_vs_de_criminal":  "absorbs",
      "cia_warning_vs_cia_denial":   "absorbs",
      "se_jurisdiction_vs_buhl":     "strains",
      "wsj_vs_spiegel":              "absorbs",
      "andromeda_vs_state_navy":     "absorbs",
    },

    sourceFromCandidates:
      "C2b (47.0%) + C2a (8.8%) + C2c (9.0%) + half of C7 (4.7%) ≈ 70%. Distribution rescaled by 1.404 after structural exclusion of C1/C3/C4 and after C_insufficient was moved to the μ subclaim.",
  },

  // -------------------------------------------------------------------------
  {
    id: "beta_prime",
    glyph: "β′",
    kind: "alternate_reconstruction",
    coverage: 0.05,
    isHero: false,
    label: "Western coordination, principal unclear",
    shortLabel: "Western coordination — principal unclear",
    claim:
      "A wider Western coordination — US enabling, Polish staging, possible UK involvement — extended beyond Ukrainian military leadership alone. β′ does NOT claim US-direct-execution; that version (Hersh) is structurally excluded.",

    strongestArgument: {
      headline: "β′ preserves a coordination question the rest of the exhibit cannot fully retire.",
      bullets: [
        "CIA's 2022 'interested, not opposed' is compatible with passive awareness AND with tacit green light. The exhibit cannot adjudicate.",
        "Sikorski's 'Thank you, USA' tweet and the Polish refusal pattern read coherently as either post-facto alignment (α) or pre-coordinated structure (β′).",
        "12 UN Security Council abstentions on independent investigation are compatible with both readings; under β′, the voting pattern is itself a coordination signature.",
      ],
    },
    weakestPoint: {
      headline: "β′ cannot separate awareness from permission on current evidence.",
      body:
        "The structural distinguisher between α and β′ is whether the CIA's 2022 stance crossed from awareness into tacit permission. The available evidence (Spiegel 'not opposed', the June warning) supports both readings. β′ also cannot adjudicate whether UK signals (Truss SMS, Naryshkin accusation, Sachs enumeration) point at active involvement or third-party amplification — a question ζ holds open separately.",
    },
    whatWouldChange: {
      headline: "Declassification of intelligence-layer communications would adjudicate β′.",
      items: [
        "CIA 2022 cables on the Podol disclosure and the June warning.",
        "MIVD records on what Dutch intelligence knew and shared.",
        "UK Defence Intelligence Staff records on the period.",
        "Internal communications between Blinken, Sullivan, and Nuland in late 2022.",
      ],
    },

    overlaySummary:
      "β′ is what remains of the original 'Western coordination' hypothesis after Hersh's specific US-direct-execution version is structurally excluded. It does not claim a single principal; it claims that the enabling structure is wider than Ukrainian military + passive CIA. It is α's principal alternative on the 'width of coordination' axis.",

    keyEvidence:    ["E5","E21","E22","E23","E24","E25","E27","E28","E30","E33"],
    keyAnchors:     ["F4","F5","F6"],
    challengedBy:   ["E17","E29"],
    contradictionStance: {
      "DE_judicial_vs_political":    "absorbs",
      "forensic_vs_official_silence":"absorbs",
      "ua_denial_vs_ua_media_pride": "strains",
      "pl_judicial_vs_de_criminal":  "absorbs",
      "cia_warning_vs_cia_denial":   "strains",
      "se_jurisdiction_vs_buhl":     "absorbs",
      "wsj_vs_spiegel":              "strains",
      "andromeda_vs_state_navy":     "strains",
    },

    sourceFromCandidates:
      "Third of C7 (3.1%) + third of C5 (2.9%) ≈ 5%. Down from 10% in v0.4 — β lost C1 (5.7%, structurally excluded) entirely.",
  },

  // -------------------------------------------------------------------------
  {
    id: "epsilon",
    glyph: "ε",
    kind: "candidate_space_unknown",
    coverage: 0.19,
    isHero: false,
    label: "Unidentified actor or incomplete candidate set",
    shortLabel: "Unknown actor — candidate set may be incomplete",
    claim:
      "The enumerated candidate set may not be complete. Weight assigned to ε represents probability mass that no listed storyline coherently absorbs.",

    strongestArgument: {
      headline: "v0.3's candidate set was demonstrably blind. v0.4 closed those gaps. v0.5 cannot prove completeness.",
      bullets: [
        "v0.3 collapsed all Ukrainian attribution into one C2 candidate — missing the presidential / military-bypass / agency split that later evidence forced. ε is the protocol's record of having been wrong before.",
        "Compound attribution (Ukrainian operation with CIA enabling) was structurally invisible until C7 was added in v0.4.",
        "ε does not assert hidden truth. It refuses to force all weight into the buckets currently named.",
      ],
    },
    weakestPoint: {
      headline: "ε cannot point to what it covers.",
      body:
        "By definition, ε is what no listed storyline absorbs. Any specific candidate proposed for ε would either be admitted (and ε would shrink) or dismissed (and ε would not grow). Its 19% is a function of softmax floor mass plus unenumerated configurations — not a probability over any specific reconstruction.",
    },
    whatWouldChange: {
      headline: "Disclosure that names a previously unenumerated configuration shrinks ε directly.",
      items: [
        "A whistleblower account from inside the Andromeda operation naming a non-listed actor.",
        "An explicit named-third-party acknowledgment from any party currently in the exhibit.",
        "Declassification surfacing a coordination structure not currently in the candidate set.",
      ],
    },

    overlaySummary:
      "ε is a declared blind spot. It carries the v0.3 → v0.4 lesson that candidate sets are revisable. The 19% does not assert that something specific is missing — it asserts that the protocol does not force mass into named buckets when the evidence does not support them.",

    keyEvidence:    [],
    keyAnchors:     ["F12"],
    challengedBy:   [],
    contradictionStance: {
      "DE_judicial_vs_political":    "absorbs",
      "forensic_vs_official_silence":"absorbs",
      "ua_denial_vs_ua_media_pride": "absorbs",
      "pl_judicial_vs_de_criminal":  "absorbs",
      "cia_warning_vs_cia_denial":   "absorbs",
      "se_jurisdiction_vs_buhl":     "absorbs",
      "wsj_vs_spiegel":              "absorbs",
      "andromeda_vs_state_navy":     "absorbs",
    },

    sourceFromCandidates:
      "C_unknown (8.8%) + C6 (8.1%) + fifth of C7 (1.9%) ≈ 19%. Rescaled by 1.404 under attribution-only distribution.",
  },

  // -------------------------------------------------------------------------
  {
    id: "zeta",
    glyph: "ζ",
    kind: "alternate_reconstruction",
    coverage: 0.06,
    isHero: false,
    label: "UK-layer, under-examined",
    shortLabel: "UK-layer · under-examined",
    claim:
      "The UK question has its own evidence base — independent of the Ukrainian and US tracks — and has not been adjudicated by any institution in the exhibit. ζ asserts the question, not an answer.",

    strongestArgument: {
      headline: "Three independent UK signals from three different source positions.",
      bullets: [
        "Liz Truss reportedly SMSed Blinken 'it's done' — multiple independent retellings, event-credibility above content-credibility.",
        "SVR Chief Naryshkin formally accused US and UK on RT Arabic — adversarial, but on record.",
        "Jeffrey Sachs at the UN Security Council enumerated UK among seven plausible Western actors — academic-authority derived analysis in a high forum.",
      ],
    },
    weakestPoint: {
      headline: "Each UK signal is individually weak.",
      body:
        "Truss SMS: content-credibility 0.30. Naryshkin: adversarial-source. Sachs: derived analysis, not direct evidence. The combined signal is non-zero only because the three sources are independent and their convergence on a UK frame is not generated by any single ecosystem. No piece of v0.4 evidence rules UK involvement out, at any layer.",
    },
    whatWouldChange: {
      headline: "Either confirm or retire the UK question.",
      items: [
        "Independent confirmation of Truss SMS content from a non-Russian-amplified source.",
        "UK Defence Intelligence or Cabinet records from the period.",
        "Forensic linkage of the operation to UK-specific assets or training.",
        "Authoritative ruling-out from an institution with capacity to investigate.",
      ],
    },

    overlaySummary:
      "ζ is the protocol's refusal to fold the UK signal into β′ when the evidence base is independent. It is a small storyline because the signals are weak — but it is its own storyline because the question has not been adjudicated.",

    keyEvidence:    ["E25","E27","E28"],
    keyAnchors:     [],
    challengedBy:   [],
    contradictionStance: {
      "DE_judicial_vs_political":    "neutral",
      "forensic_vs_official_silence":"strains",
      "ua_denial_vs_ua_media_pride": "neutral",
      "pl_judicial_vs_de_criminal":  "neutral",
      "cia_warning_vs_cia_denial":   "neutral",
      "se_jurisdiction_vs_buhl":     "absorbs",
      "wsj_vs_spiegel":              "neutral",
      "andromeda_vs_state_navy":     "strains",
    },

    sourceFromCandidates:
      "C5 (8.7%) − overlap with β′ (≈3%) ≈ 6%. ζ does not double-count UK signals shared with β′.",
  },

  // -------------------------------------------------------------------------
  {
    id: "mu",
    glyph: "μ",
    kind: "process_subclaim",
    coverage: null,                        // not an attribution candidate
    evidenceShare: 0.136,
    isHero: false,
    isSubclaim: true,
    label: "Institutional non-resolution as a stance",
    shortLabel: "Collective non-resolution",
    claim:
      "Five jurisdictions and one international body each had the capacity to advance the attribution question. Each chose not to. μ does not compete with α/β′/ε/ζ for attribution weight — it answers a different question (why has this not closed?) and lives in its own subclaim panel.",

    strongestArgument: {
      headline: "Six institutional non-advancements, each documented, each independent.",
      bullets: [
        "Sweden closed citing a jurisdictional doctrine Buhl publicly disputes. Denmark followed within weeks; its Defence Academy reports being barred from public discussion.",
        "Germany's executive invoked the Third Party Rule on parliamentary inquiry while its judicial layer continued — and the BGH ruled 'foreign government intelligence agency' without naming the government.",
        "Poland did not execute the German EAW; Polish courts framed the act as 'organized action by services of a warring state'; Tusk endorsed.",
        "Italy's Cassazione reversed itself three times on the same extradition question within six weeks.",
        "The UN Security Council buried the independent-investigation resolution by twelve abstentions, not by vetoes.",
      ],
    },
    weakestPoint: {
      headline: "μ cannot fully explain the BGH-vs-Kanzleramt internal split.",
      body:
        "If μ describes a system-wide avoidance, why does the German judicial layer advance (BGH ruling, ongoing prosecutions) while the German political layer suppresses (Third Party Rule)? The split is itself part of the exhibit and indicates that 'avoidance' is not uniform within a single state — it operates along the judicial-vs-executive axis.",
    },
    whatWouldChange: {
      headline: "Any single institution breaking the non-advancement pattern would shift μ.",
      items: [
        "Sweden or Denmark publishing the substantive jurisdictional reasoning behind closure.",
        "The German Chancellor's Office releasing the intelligence-sharing record under retroactive Bundestag pressure.",
        "The UN re-tabling the independent-investigation resolution.",
        "A trial in Germany producing a publicly-named state actor.",
      ],
    },

    overlaySummary:
      "μ is structurally separated from the attribution claim. The 13.6% of evidence that addresses 'why has this not closed?' was previously aggregated into C_insufficient — which forced it to compete with attribution candidates as if it answered the same question. v0.4.2 split it out. μ is now read on its own axis.",

    keyEvidence:    ["E8","E9","E19","E31","E32","E33","E34","E35"],
    keyAnchors:     ["F13"],
    challengedBy:   ["E17"],
    contradictionStance: {
      "DE_judicial_vs_political":    "centers",   // μ is the home for this contradiction
      "forensic_vs_official_silence":"centers",
      "ua_denial_vs_ua_media_pride": "neutral",
      "pl_judicial_vs_de_criminal":  "absorbs",
      "cia_warning_vs_cia_denial":   "absorbs",
      "se_jurisdiction_vs_buhl":     "centers",
      "wsj_vs_spiegel":              "neutral",
      "andromeda_vs_state_navy":     "neutral",
    },

    sourceFromCandidates:
      "Subclaim. 13.6% of total evidence addresses this question. Within the subclaim, μ is the only live answer (coverage 1.00 within μ-subclaim space).",
  },

  // -------------------------------------------------------------------------
  {
    id: "delta",
    glyph: "δ",
    kind: "structurally_excluded",
    coverage: 0.00,
    isHero: false,
    excluded: true,
    label: "Russian self-sabotage",
    shortLabel: "Russian self-sabotage — structurally excluded",
    claim:
      "Russia destroyed its own infrastructure to weaponize attribution chaos against the West.",

    strongestArgument: { headline: "—", bullets: [] },
    weakestPoint:      { headline: "—", body: "" },
    whatWouldChange:   { headline: "—", items: [] },

    excludedBy: ["E25","F7"],
    excludedReason:
      "Two independent GATE-level refutations. (1) Sachs at the UN Security Council enumerates seven plausible Western actors and explicitly excludes Russia. (2) The Andromeda forensic chain (HMX, DNA, fingerprints, forged identities) survives three years of cross-jurisdictional review across German, Polish, and Italian judicial systems. δ would require the entire forensic chain to be Russian fabrication that escapes three independent judiciaries. Putin's UN General Assembly speech blaming 'Anglo-Saxons' is the single most internally inconsistent move for a self-author — it directs international scrutiny precisely toward the actors most capable of having done it. The narrative is preserved here for audit transparency, not as a live hypothesis.",

    overlaySummary:
      "STRUCTURALLY EXCLUDED. Retained for audit transparency. Readers consulting historical v0.4 output that shows δ at 5% should understand that this reflects pre-audit softmax behavior, not surviving hypothesis weight.",

    keyEvidence:    [],
    keyAnchors:     [],
    challengedBy:   [],
    contradictionStance: {},
    sourceFromCandidates: "0% by structural exclusion. Former softmax weight (5%) was a pre-audit floor that L2 exclusion gating should have zeroed before aggregation.",
  },
];


// ============================================================================
// STRUCTURALLY EXCLUDED CANDIDATES — at the candidate layer, not storyline
// ============================================================================

const STRUCTURAL_EXCLUSIONS = [
  {
    candidate: "C1",
    label: "United States — direct execution (Hersh version)",
    formerWeight: 0.057,
    excludedBy: [
      { id: "E6",  type: "GATE",
        reason: "Andromeda forensic chain (HMX, DNA, fingerprints, forged identity papers) points to a Ukrainian-operator execution layer, not US Navy personnel." },
      { id: "F3",  type: "BREAKS",
        reason: "17-hour detonation gap is incompatible with Hersh's sonar-triggered one-shot remote mechanism." },
      { id: "F12", type: "BREAKS",
        reason: "One of four pipeline strands survived intact — inconsistent with a professional state-navy operation." },
    ],
    preservedQuestion:
      "A wider Western coordination (US enabling, UK possible, Poland staging) is NOT refuted. That question is preserved in β′ and ζ.",
  },
  {
    candidate: "C3",
    label: "Ukraine — independent rogue operators (no state authorization)",
    formerWeight: 0.042,
    excludedBy: [
      { id: "F2",  type: "GATE",
        reason: "Military-grade HMX explosive supply chain requires state-level access. Rules out non-state-enabled operators as a class." },
      { id: "E17", type: "BREAKS",
        reason: "BGH December 2025 ruling explicitly classifies the operation as 'a foreign government intelligence agency' action. Judicial T1 authority directly contradicts rogue-operator framing." },
    ],
    preservedQuestion: null,
  },
  {
    candidate: "C4",
    label: "Russia — self-sabotage (false flag)",
    formerWeight: 0.054,
    excludedBy: [
      { id: "E25", type: "GATE",
        reason: "Sachs at the UN Security Council enumerates seven plausible Western actors and explicitly excludes Russia." },
      { id: "F7",  type: "GATE",
        reason: "Andromeda forensic chain survives three years of cross-jurisdictional review (DE, PL, IT). A false-flag δ would require fabricated forensics to withstand three independent judiciaries." },
    ],
    preservedQuestion: null,
  },
];


// ============================================================================
// ANCHOR FACTS — F1–F13, undisputed across 14 languages surveyed
// Each carries a proof-state of "anchor" and is referenced from Claim Map.
// ============================================================================

const ANCHORS_V05 = [
  { id:"F1",  time:"2022-09-26 04:03 & 19:03 UTC",
    fact:"Two pipeline sections detonate seventeen hours apart. Three of four lines destroyed; one intact. Swedish, Danish, and German seismographs record simultaneously.",
    flagged:false },
  { id:"F2",  time:"2022-09 forensic",
    fact:"Blast depth 70–80 m. Military-grade HMX residue confirmed by Swedish prosecutor; traces on the Andromeda yacht.",
    flagged:false },
  { id:"F3",  time:"Physical anomaly",
    fact:"The 17-hour interval between blasts. Incompatible with sonar-triggered remote one-shot detonation; consistent with manual or semi-automatic timed execution.",
    flagged:true },
  { id:"F4",  time:"2022-02-07",
    fact:"Biden, standing next to Scholz, publicly commits to 'ending' Nord Stream 2 if Russia invades. On camera; uncontested.",
    flagged:false },
  { id:"F5",  time:"2022–2023 public record",
    fact:"Blinken and Nuland express post-facto satisfaction. Nuland: 'a piece of metal at the bottom of the sea.'",
    flagged:false },
  { id:"F6",  time:"2022-06",
    fact:"CIA issues strategic warning to Germany and other European allies that Nord Stream may be a target. Provenance chain: MIVD (Dutch) → CIA → Germany.",
    flagged:false },
  { id:"F7",  time:"Forensic, multi-jurisdictional",
    fact:"Andromeda: forged identities, HMX residue, DNA, fingerprints. Accessed independently by German, Polish, and Italian judicial authorities.",
    flagged:false },
  { id:"F8",  time:"Identified individuals",
    fact:"Volodymyr Zhuravlev (Poland) and Serhii Kuznetsov (Italy, Rimini) — identities, backgrounds, arrests, and judicial proceedings all in public records.",
    flagged:false },
  { id:"F9",  time:"2025-12-10",
    fact:"BGH (German Federal Court of Justice) formally classifies the operation, 'with high probability', as an intelligence-agency action ordered by a foreign government. Rejects functional-immunity appeal.",
    flagged:true },
  { id:"F10", time:"2025-10-17",
    fact:"Polish Judge Łubowski's ruling characterizes the act as 'organized action by services of a warring state' — a judicial categorization.",
    flagged:true },
  { id:"F11", time:"2022-09-26",
    fact:"Polish FM Sikorski tweets 'Thank you, USA' hours after the blasts. Tweet timestamp independently verifiable.",
    flagged:false },
  { id:"F12", time:"Physical anomaly",
    fact:"Fourth pipeline intact. Multi-source confirmed. Inconsistent with professional naval SEAL-level operation; consistent with resource-limited team.",
    flagged:true },
  { id:"F13", time:"2024-02",
    fact:"Sweden and Denmark close investigations without attribution. Germany continues; Kuznetsov transferred to Germany for trial.",
    flagged:false },
];


// ============================================================================
// CLAIM MAP — 6 subclaims under the main attribution question
// Each carries a proof state and pointers to anchors / evidence.
// ============================================================================

const CLAIM_MAP = {
  rootClaim: CASE_META.question,
  rootProof: "strong",
  subclaims: [
    {
      id: "S1",
      label: "Physical mechanism",
      question: "What operation type physically caused the rupture?",
      proof: "anchor",
      summary: "A team-executed timed-charge operation at 70–80 m depth, conducted in two passes seventeen hours apart, with one of four strands surviving. Not sonar-triggered, not single-shot, not naval-professional in signature.",
      established: [
        "F1 — two-wave detonation, three of four lines destroyed",
        "F2 — HMX military-grade explosive at 70–80 m",
        "F3 — 17-hour interval rules out remote sonar-triggered execution",
        "F12 — surviving fourth strand inconsistent with state-navy professional signature",
      ],
      tensions: [
        "F2 (state-grade explosive) and F12 (non-professional execution signature) point to a state-enabled but resource-limited team — a structural pattern matching α and β′, not Hersh's C1.",
      ],
      stateInfluence: "Locks the operation type. Forces command-authorization debate (S3) onto a smaller-team operational layer. Excludes C1's mechanism.",
    },
    {
      id: "S2",
      label: "Operational actor identity",
      question: "Who executed the operation on site?",
      proof: "strong",
      summary: "Ukrainian-linked operators executed: identified individuals (Zhuravlev, Kuznetsov), Andromeda forensic trail, German EU arrest warrant, embassy-plated exit. Identity is judicially anchored across three jurisdictions.",
      established: [
        "F7 — Andromeda forensic chain accessed by DE, PL, IT independently",
        "F8 — identified individuals with public-record arrests and proceedings",
        "F11 — embassy-plated exit through Poland (state apparatus enabled)",
      ],
      tensions: [
        "α's forensic identity narrative is shared with β′ and ζ at the execution layer — disagreement among live storylines is over enabling structure, not executors.",
      ],
      stateInfluence: "Strong inference for Ukrainian-linked execution. Distinguishes from C1 (US-direct) and C4 (Russian self-authorship). Does not by itself adjudicate command-layer authorization — that is S3.",
      keyEvidence: ["E6","E10","E11","E12","E13"],
    },
    {
      id: "S3",
      label: "Command authorization",
      question: "Was this presidential, military-command, agency-level, rogue, or foreign-state directed?",
      proof: "plausible",
      summary: "α's reading: Zaluzhnyi-led military command after Zelensky withdrew approval. Spiegel 2026 (Zaluzhnyi approved) and Il Fatto 2025 (Zelensky approved-then-withdrew) are testimonial. Documentary record on command intent is sparse.",
      established: [
        "F9 — BGH rules 'foreign government intelligence agency' — rules out C3 (rogue independent)",
      ],
      tensions: [
        "Spiegel 2026 and Il Fatto 2025 reconcile as a temporal split (Zelensky early-yes, then-no; Zaluzhnyi continued) but neither is documentary.",
        "Hanning's Die Welt testimony names Polish authorization and 'both presidents' — ex-BND chief authority, but contradicts the Zaluzhnyi-bypass framing α prefers.",
      ],
      stateInfluence: "α's least-documented link. Disclosure here adjudicates α vs β′ on the most consequential axis.",
      keyEvidence: ["E11","E29","E31","E24"],
    },
    {
      id: "S4",
      label: "State knowledge and complicity",
      question: "Which states knew, facilitated, protected, or obstructed?",
      proof: "plausible",
      summary: "Polish post-facto protection is documented (refusal to execute EAW, Łubowski ruling, Tusk endorsement). US prior knowledge is documented (CIA June 2022 warning). UK question is unresolved (held in ζ).",
      established: [
        "F6 — CIA warned Germany via MIVD chain in June 2022",
        "F10 — Polish judicial framing as 'organized action by services of a warring state'",
        "F11 — Sikorski tweet immediately post-event",
      ],
      tensions: [
        "CIA's stance is undetermined between passive awareness (α) and tacit permission (β′).",
        "Polish state-level knowledge timing is undocumented in the public record.",
      ],
      stateInfluence: "Defines the 'enabling structure' axis along which α and β′ diverge. ζ holds the UK piece separately because it is independently sourced.",
      keyEvidence: ["E5","E14","E18","E21","E22","E24"],
    },
    {
      id: "S5",
      label: "Institutional non-resolution",
      question: "Why has this attribution question not been institutionally closed?",
      proof: "anchor",
      summary: "Five jurisdictions and one international body have each had capacity to advance — and each has not. This is the μ subclaim. It does not compete with attribution storylines for weight.",
      established: [
        "F13 — Sweden and Denmark close without attribution",
        "Sweden's prosecutor self-describes the case as 'a battlefield for influence operations'",
        "BGH advances criminal proceedings while the German Chancellor's Office invokes Third Party Rule",
      ],
      tensions: [
        "BGH-vs-Kanzleramt internal split: the German judiciary advances while the German executive suppresses. μ describes system-wide avoidance but cannot fully account for this intra-state divergence.",
      ],
      stateInfluence: "Centers the contradiction set on a jurisdictional-avoidance pattern. Surfaces 'silence as evidence' as a first-class object.",
      keyEvidence: ["E8","E9","E32","E33","E34","E35"],
    },
    {
      id: "S6",
      label: "Narrative behavior consistency",
      question: "Do public statements, omissions, and register shifts behave as predicted under the leading reconstruction?",
      proof: "strong",
      summary: "Official Ukrainian denials coexist with Ukrainian-language media pride. Polish state moralizes; German judiciary criminalizes; German executive suppresses; Italian judiciary oscillates. The aggregate register pattern is not random — it tracks the alliance-and-jurisdiction structure α predicts.",
      established: [
        "Cross-record register pattern: Germany criminalizes, Poland moralizes, Italy proceduralizes (see Register lens)",
        "Domestic broadcaster critique of own government (SVT editorial, Splidsboel public dissent)",
      ],
      tensions: [
        "ζ's UK signals are register-anomalous: SVR amplification of an SMS that the UK has neither confirmed nor denied — a register pattern that does not yet have a clean reading.",
      ],
      stateInfluence: "Register is positional evidence, not factual evidence. It strengthens α structurally without grounding causal claims directly.",
      keyEvidence: ["E37","E32","E22","E18","E19"],
    },
  ],
};


// ============================================================================
// EVIDENCE LEDGER — 37 records with v0.5 audit fields:
//   whatItOnlyShows · whatRemainsMissing · supportsStorylines · contradictsStorylines
// (Edges preserved from v0.4.2 for storyline mapping.)
// ============================================================================

const EVIDENCE = [
  {
    id:"E1", label:"Hersh Substack report", date:"2023-02-08",
    type:"testimony", credibility:0.35, language:"en", cluster:"single_source",
    detail:"Single anonymous source. The narrative that built β. Cross-examination finds the 17-hour blast interval (F3) incompatible with sonar-triggered one-shot detonation; the fourth intact pipeline (F12) inconsistent with professional US Navy operation.",
    whatItOnlyShows:"That a long-form journalistic account exists alleging US Navy execution under BALTOPS cover, sourced to a single anonymous individual.",
    whatRemainsMissing:"Independent corroboration of the source. The specific mechanism Hersh describes (sonar-triggered single-shot) does not match physical anchors F3 and F12.",
    supports:["beta_prime"],
    refutes:[],
    structurallyExcludedFor:"C1 — Hersh's specific US-direct mechanism is the version structurally refuted.",
  },
  {
    id:"E2", label:"White House denial", date:"2023-02-08",
    type:"official_statement", credibility:0.50, language:"en", cluster:null,
    detail:"Same-day denial. Weight bounded by obvious interest of issuing party.",
    whatItOnlyShows:"That the US executive branch issued an official denial within hours of Hersh's publication.",
    whatRemainsMissing:"Substantive engagement with the specific mechanism. A pro forma denial does not adjudicate.",
    supports:[],
    refutes:[],
  },
  {
    id:"E3", label:"NYT 'pro-Ukrainian group' report", date:"2023-03-07",
    type:"testimony", credibility:0.55, language:"en", cluster:"western_intel_leaks",
    detail:"NYT attribution to pro-Ukrainian group, sourced to anonymous US officials familiar with intelligence. First pivot away from US-direct framing.",
    whatItOnlyShows:"That a Western intelligence narrative shifted public framing toward 'Ukrainian-group' attribution in early 2023.",
    whatRemainsMissing:"The provenance chain of the leak. The reporting itself is potentially correlated with later WaPo/Spiegel leaks (cluster: western_intel_leaks).",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E4", label:"WaPo + Spiegel: Chervinsky named", date:"2023-11-01",
    type:"derived_analysis", credibility:0.65, language:"en", cluster:"western_intel_leaks",
    detail:"Col. Roman Chervinsky named as coordinator. Ukraine denies. Part of western_intel_leaks cluster.",
    whatItOnlyShows:"That a named individual at the operational coordination layer was identified by Western reporting in late 2023.",
    whatRemainsMissing:"Direct documentary evidence of the coordination role. Cluster-dampened weight (correlated leak ecosystem).",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E5", label:"WaPo leaked docs / CIA June 2022 warning", date:"2023-06-01",
    type:"documentary", credibility:0.70, language:"en", cluster:"western_intel_leaks",
    detail:"Discord leaks: CIA warned Germany June 2022 of Ukrainian plan. Provenance chain MIVD → CIA → Germany.",
    whatItOnlyShows:"That a documentary record exists of CIA prior knowledge in June 2022 and a formal warning to Germany.",
    whatRemainsMissing:"Whether the CIA's stance was passive (α) or tacit-permission (β′). The warning itself is compatible with both readings.",
    supports:["alpha","beta_prime"],
    refutes:[],
  },
  {
    id:"E6", label:"Die Zeit / ARD / SZ: Andromeda forensic", date:"2023-04-01",
    type:"forensic", credibility:0.75, language:"de", cluster:null,
    detail:"Andromeda yacht: HMX residue, DNA, fingerprints. Forensic-level for 'Ukrainian team executed'; correlational for distinguishing state-layer candidates.",
    whatItOnlyShows:"That the operational layer was Ukrainian-linked and that physical evidence is recoverable and consistent.",
    whatRemainsMissing:"Adjudication between C2a/C2b/C2c (presidential / military-bypass / agency authorization). Andromeda alone cannot separate these.",
    supports:["alpha"],
    refutes:[],
    structurallyExcludedFor:"C1 — physical evidence points away from US-Navy execution.",
  },
  {
    id:"E7", label:"Kiesewetter: evidence too thin", date:"2023-04-15",
    type:"derived_analysis", credibility:0.60, language:"de", cluster:null,
    detail:"Bundestag intelligence committee skepticism. Primarily a Layer-4 challenge to E6.",
    whatItOnlyShows:"That German political opposition voiced skepticism about the Andromeda framing in early 2023.",
    whatRemainsMissing:"Substantive counter-evidence. Skepticism is not evidence; it is a position on evidence sufficiency.",
    supports:[],
    refutes:["alpha"],
  },
  {
    id:"E8", label:"Sweden closes investigation", date:"2024-02-07",
    type:"inconclusive_statement", credibility:0.80, language:"sv", cluster:null,
    detail:"Jurisdiction framed as 'kan antas saknas' (may be presumed lacking). Danish legal scholar Buhl publicly disputes this.",
    whatItOnlyShows:"That Sweden ended its investigation without attribution and offered jurisdictional doctrine as the public reasoning.",
    whatRemainsMissing:"The substantive evidentiary record. Whether jurisdiction was actually examined or used as a closing mechanism.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E9", label:"Denmark closes investigation", date:"2024-02-26",
    type:"inconclusive_statement", credibility:0.80, language:"da", cluster:null,
    detail:"Denmark follows Sweden. Danish Defence Academy experts later report being barred from public discussion.",
    whatItOnlyShows:"That Denmark closed within weeks of Sweden, with consistent non-attribution language.",
    whatRemainsMissing:"The legal basis for closure. The Defence Academy gag is itself a μ-signal but not a substantive reasoning record.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E10", label:"Germany: EU arrest warrant, Volodymyr Z.", date:"2024-06-20",
    type:"official_statement", credibility:0.80, language:"de", cluster:null,
    detail:"EU arrest warrant for Ukrainian diver. Causal for 'Ukrainian individual targeted'; correlational for state-layer distinction.",
    whatItOnlyShows:"That the German Federal Prosecutor identified a Ukrainian individual at the operational layer as a criminal suspect.",
    whatRemainsMissing:"State-layer authorization. EAWs are issued against individuals, not states.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E11", label:"WSJ: Zaluzhnyi knowledge narrative", date:"2024-08-14",
    type:"derived_analysis", credibility:0.65, language:"en", cluster:"western_intel_leaks",
    detail:"Zaluzhnyi named as knowing; narrows from rogue operators toward military chain. Cluster-dampened with E3/E4/E5.",
    whatItOnlyShows:"That a Western reporting layer began naming Zaluzhnyi at the command level in 2024.",
    whatRemainsMissing:"Direct command-authorization documentation. Provenance dampened by western_intel_leaks correlation.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E12", label:"Z. exits Poland on embassy diplomatic plates", date:"2024-07-06",
    type:"open_source_intelligence", credibility:0.70, language:"de", cluster:null,
    detail:"Strongest direct evidence of state-level protection. Causal for 'state apparatus enabled exit'; correlational for the specific Zaluzhnyi-bypass layer.",
    whatItOnlyShows:"That Ukrainian state apparatus actively enabled Zhuravlev's exit from Polish territory through diplomatic channels.",
    whatRemainsMissing:"Whether the protection was authorized at presidential, ministerial, or services-only level inside Ukraine.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E13", label:"Italian arrest of Serhii K.", date:"2025-08-21",
    type:"official_statement", credibility:0.80, language:"it", cluster:null,
    detail:"Alleged coordinator detained in Rimini. A judicial proceedings event, not a verdict.",
    whatItOnlyShows:"That a second identified individual was arrested by an EU member state on the German EAW.",
    whatRemainsMissing:"Trial outcome. The arrest establishes capacity, not finding.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E14", label:"Poland refuses extradition", date:"2025-10-17",
    type:"official_statement", credibility:0.80, language:"pl", cluster:null,
    detail:"Judge Łubowski's ruling frames the act as 'organized action by wartime services' — a judicial categorization bordering on legitimation.",
    whatItOnlyShows:"That a Polish judicial body refused extradition on grounds compatible with state-level authorship.",
    whatRemainsMissing:"Whether the refusal reflects independent judicial reasoning or aligns with executive preference (Tusk endorsement E22 suggests the latter).",
    supports:["alpha","mu"],
    refutes:[],
  },
  {
    id:"E15", label:"Berlin refuses AfD question on US intel", date:"2024-07-17",
    type:"official_statement", credibility:0.70, language:"de", cluster:null,
    detail:"Government refusal to confirm or deny US involvement. In v0.4 this edge is removed from C1 and re-routed: the refusal is a coverage-meta signal (feeds μ), not direct evidence for any enumerated candidate.",
    whatItOnlyShows:"That the German government chose non-disclosure as its public stance on US-intelligence involvement.",
    whatRemainsMissing:"What the government would say if compelled. The refusal itself is positional evidence (μ), not factual evidence.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E16", label:"Weltwoche: USS Kearsarge UUV capability", date:"2024-10-15",
    type:"open_source_intelligence", credibility:0.45, language:"de", cluster:null,
    detail:"Keeps β technically alive but at low credibility.",
    whatItOnlyShows:"That UUV capability existed near the timeframe in question.",
    whatRemainsMissing:"Linkage to the specific operation. Capability is not action.",
    supports:[],
    refutes:[],
  },
  {
    id:"E17", label:"BGH ruling: 'foreign government intelligence agency'", date:"2025-12-10",
    type:"official_statement", credibility:0.90, language:"de", cluster:"german_judicial",
    detail:"Federal Court of Justice (3rd Criminal Senate): the operation is 'with high probability an intelligence-agency action ordered by a foreign government'. Rejects Kuznetsov's functional-immunity appeal — implying state authorship does not shield the individual. Deliberately does NOT name Ukraine.",
    whatItOnlyShows:"That the German judiciary believes the operation was highly likely a foreign-government-directed intelligence action.",
    whatRemainsMissing:"Which foreign government. The BGH's deliberate non-naming is itself informative — the evidentiary threshold for 'foreign government' was crossed; the diplomatic threshold for naming was not.",
    supports:["alpha"],
    refutes:["delta","mu"],
    structurallyExcludedFor:"C3 — rules out independent rogue operators by judicial finding.",
  },
  {
    id:"E18", label:"Polish Judge Łubowski ruling", date:"2025-10-17",
    type:"official_statement", credibility:0.85, language:"pl", cluster:null,
    detail:"'Organized action by services of a warring state' — a judicial categorization that treats Ukrainian state authorship as the operative frame, not a hypothesis.",
    whatItOnlyShows:"That a Polish judicial body has categorized the act in language treating Ukrainian state authorship as a legal frame.",
    whatRemainsMissing:"Whether other Polish jurisdictions would reach the same finding under appellate review.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E19", label:"Italian Cassazione reversals", date:"2025-11-27",
    type:"official_statement", credibility:0.85, language:"it", cluster:null,
    detail:"Oct 17 extradition denied → Nov 19 approved → Nov 27 transfer. Three-step judicial volatility.",
    whatItOnlyShows:"That European judicial procedure is non-consensual on this case across just six weeks.",
    whatRemainsMissing:"The political pressure context (if any) behind each reversal.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E20", label:"Italian court cites Polish ruling as precedent", date:"2025-11-19",
    type:"derived_analysis", credibility:0.65, language:"it", cluster:null,
    detail:"Defense attorney invokes Polish Judge Łubowski's functional-immunity reasoning in an Italian courtroom. Cross-jurisdictional position transfer.",
    whatItOnlyShows:"That the Polish judicial frame is travelling laterally across EU member-state proceedings.",
    whatRemainsMissing:"Whether Italian judges are persuaded.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E21", label:"Sikorski 'Thank you, USA' tweet", date:"2022-09-27",
    type:"documentary", credibility:0.75, language:"pl", cluster:null,
    detail:"Polish Foreign Minister tweets 'Thank you, USA' hours after the blasts. Independently timestamp-verifiable.",
    whatItOnlyShows:"That a senior Polish official publicly signaled approval of US action within hours of detonation.",
    whatRemainsMissing:"Whether 'Thank you' reflects knowledge of specific authorship or rhetorical alignment.",
    supports:["alpha","beta_prime"],
    refutes:[],
  },
  {
    id:"E22", label:"Tusk: 'case closed'", date:"2025-10-20",
    type:"official_statement", credibility:0.85, language:"pl", cluster:null,
    detail:"Polish Prime Minister publicly endorses Łubowski's non-extradition decision. State-level validation of legitimation narrative.",
    whatItOnlyShows:"That the Polish executive backs the judicial framing of non-extradition.",
    whatRemainsMissing:"The internal Cabinet record. Public endorsement is positional, not procedural.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E23", label:"Trump: 'Russia wasn't involved, many people know'", date:"2025-05-14",
    type:"adversarial_first_party", credibility:0.65, language:"en", cluster:null,
    detail:"A sitting US president signals that the prior US administration was involved, without formal statement. Event-cred high (he said it publicly), content-cred bounded by political motive.",
    whatItOnlyShows:"That a sitting US president publicly excluded Russia and signaled prior-administration awareness.",
    whatRemainsMissing:"Specifics. Bipartisan signaling does not adjudicate principal-vs-enabler structure.",
    supports:["beta_prime"],
    refutes:["delta"],
  },
  {
    id:"E24", label:"Ex-BND Hanning: Poland and both presidents approved", date:"2024-09-22",
    type:"testimony", credibility:0.85, language:"de", cluster:null,
    detail:"Former Director of German BND in Die Welt: 'The operation must have had Poland's backing, and the approval of both presidents.'",
    whatItOnlyShows:"That a T1-level former intelligence chief, on the record, names Polish authorization and 'both presidents'.",
    whatRemainsMissing:"Sources for Hanning's claim. As ex-officer testimony, his credibility is high but his evidentiary base is not public.",
    supports:["beta_prime","alpha"],
    refutes:[],
  },
  {
    id:"E25", label:"Sachs at UN Security Council: 7 Western actors", date:"2023-02-21",
    type:"derived_analysis", credibility:0.80, language:"en", cluster:null,
    detail:"Sachs (Columbia, former UN advisor) enumerates US, UK, Poland, Norway, Germany, Denmark, Sweden as plausible — and explicitly excludes Russia.",
    whatItOnlyShows:"That academic authority in a UN forum has placed UK and other Western states in the plausible-actor frame and excluded Russia.",
    whatRemainsMissing:"Specific evidence for each enumerated actor. Sachs's enumeration is analytical, not investigative.",
    supports:["zeta","beta_prime"],
    refutes:["delta"],
    structurallyExcludedFor:"C4 — Sachs's exclusion of Russia is a GATE-level refutation.",
  },
  {
    id:"E26", label:"SS-750 Russian ship over blast zone", date:"2022-09-22",
    type:"forensic", credibility:0.80, language:"ru", cluster:null,
    detail:"Danish Nymfen photographed SS-750 + mini-sub AS-26 over the blast zone 4 days before detonation. Prosecutor Ljungqvist confirms photos exist.",
    whatItOnlyShows:"That Russian deep-sea capability was present in the area four days before.",
    whatRemainsMissing:"Distinguishing between monitoring presence and operational presence. Most plausible reading: monitoring.",
    supports:[],
    refutes:[],
  },
  {
    id:"E27", label:"Truss 'it's done' SMS to Blinken", date:"2022-09-26",
    type:"testimony", credibility:0.45, language:"en", cluster:null,
    detail:"Reported SMS from UK PM to US Secretary of State on the day. Event-cred 0.75 (widely reported), content-cred 0.30 (sourcing divergent). Net 0.45.",
    whatItOnlyShows:"That multiple independent retellings exist of an SMS exchange consistent with UK foreknowledge.",
    whatRemainsMissing:"Verification of the SMS content. UK has neither confirmed nor denied.",
    supports:["zeta"],
    refutes:[],
  },
  {
    id:"E28", label:"SVR Chief Naryshkin: direct US/UK involvement", date:"2025-10-21",
    type:"official_statement", credibility:0.50, language:"ru", cluster:"russian_state",
    detail:"Head of Russian Foreign Intelligence Service, formal statement on RT Arabic. Event-cred high (he said it), content-cred low (adversarial source).",
    whatItOnlyShows:"That the Russian state has formally accused the US and UK on the record.",
    whatRemainsMissing:"Independent corroboration. Adversarial-source content credibility is bounded.",
    supports:["zeta"],
    refutes:[],
  },
  {
    id:"E29", label:"Der Spiegel 2026: Zaluzhnyi approved, Zelensky uninformed", date:"2026-02-12",
    type:"derived_analysis", credibility:0.70, language:"de", cluster:null,
    detail:"CIA learned of plan in spring 2022 Podol; initially 'not opposed'; later warned but did not stop. Zaluzhnyi authorized; Zelensky office not informed of final version. Operation codename 'Diameter'.",
    whatItOnlyShows:"That investigative reporting has reconstructed an operational timeline naming Zaluzhnyi at the authorization layer and excluding Zelensky's office from the final version.",
    whatRemainsMissing:"Documentary corroboration. Spiegel's account is testimonial-derived, not document-released.",
    supports:["alpha"],
    refutes:["delta"],
  },
  {
    id:"E30", label:"t-online: 'CIA son', non-Ukrainian explosive origin", date:"2026-04-08",
    type:"testimony", credibility:0.60, language:"de", cluster:null,
    detail:"Coordinator was a former Ukrainian intelligence officer trained by CIA since 2015; military-grade explosive 'not from Ukraine'. A composite-attribution narrative v0.3 candidate-set could not house; drives the existence of C7.",
    whatItOnlyShows:"That a composite-attribution layer (Ukrainian operator + non-Ukrainian explosive + CIA training history) is being seriously reported.",
    whatRemainsMissing:"Verification of the explosive supply chain origin. The 'not from Ukraine' claim is sourced but not anchored.",
    supports:["alpha","beta_prime"],
    refutes:[],
  },
  {
    id:"E31", label:"Il Fatto: Zelensky approved then withdrew", date:"2025-11-03",
    type:"derived_analysis", credibility:0.55, language:"it", cluster:null,
    detail:"Zelensky initially authorized, then withdrew at US urging — but Zaluzhnyi continued. Reconciles the apparent Spiegel/WSJ contradiction as a temporal split.",
    whatItOnlyShows:"That a reconciling temporal-split narrative exists which makes Spiegel's and WSJ's accounts consistent.",
    whatRemainsMissing:"Primary documentation. The temporal-split reading is plausible but not anchored.",
    supports:["alpha"],
    refutes:[],
  },
  {
    id:"E32", label:"Kanzleramt invokes Third Party Rule", date:"2024-09-05",
    type:"coverage_meta_evidence", credibility:0.70, language:"de", cluster:"coverage_meta",
    detail:"Chancellor's Office chief Schmidt restricts Bundestag access to intelligence-sharing details.",
    whatItOnlyShows:"That a named individual in the Chancellor's Office is taking positional action to restrict legislative inquiry.",
    whatRemainsMissing:"What is being protected. The Third Party Rule invocation is the act itself, not a window into its content.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E33", label:"UN Security Council: 12 abstentions", date:"2023-03-27",
    type:"coverage_meta_evidence", credibility:0.80, language:"en", cluster:"coverage_meta",
    detail:"Russian-sponsored resolution for independent international investigation blocked not by vetoes but by mass abstention.",
    whatItOnlyShows:"That at the UN level, the institutional response was burial-by-abstention rather than substantive engagement.",
    whatRemainsMissing:"Per-state rationales. Abstention-without-explanation is institutional opacity, not record.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E34", label:"Germany refuses AfD question", date:"2024-07-17",
    type:"coverage_meta_evidence", credibility:0.75, language:"de", cluster:"coverage_meta",
    detail:"'For reasons of state welfare' — no answer given.",
    whatItOnlyShows:"That the German government explicitly invoked state welfare as the reason for parliamentary non-disclosure.",
    whatRemainsMissing:"What state welfare is protecting against. The reason given names a category, not a content.",
    supports:["mu"],
    refutes:[],
  },
  {
    id:"E35", label:"Polish prosecutor: procedural failure on German EAW", date:"2024-08-20",
    type:"coverage_meta_evidence", credibility:0.75, language:"pl", cluster:"coverage_meta",
    detail:"Rzeczpospolita documents the procedural breakdown in Poland's non-execution of the German EAW. Not mere refusal — failure of process.",
    whatItOnlyShows:"That the Polish non-execution of the German EAW had procedural-failure structure, not just refusal structure.",
    whatRemainsMissing:"Whether the failure was managed or accidental.",
    supports:["mu","alpha"],
    refutes:[],
  },
  {
    id:"E36", label:"Kuznetsov defense: 'never left Ukraine'", date:"2025-09-02",
    type:"testimony", credibility:0.30, language:"it", cluster:null,
    detail:"Defendant statement through counsel.",
    whatItOnlyShows:"That a defendant statement asserting non-presence at the operational layer has been entered into the record.",
    whatRemainsMissing:"Cross-examination. Defendant statements are weighted accordingly.",
    supports:[],
    refutes:["alpha"],
  },
  {
    id:"E37", label:"Ukrainian-language media: pride tone", date:"2025-09-10",
    type:"derived_analysis", credibility:0.55, language:"uk", cluster:null,
    detail:"Aggregated Ukrainian-language outlet register analysis: pride/positive tone toward operation, contrasting with Podolyak's official denial. Intra-position contradiction.",
    whatItOnlyShows:"That the Ukrainian-language media register pattern diverges from the official Ukrainian governmental denial pattern.",
    whatRemainsMissing:"Whether media register reflects state preference or autonomous editorial position. Register is positional, not factual.",
    supports:["alpha"],
    refutes:[],
  },
];


// ============================================================================
// CONTRADICTIONS — eight cross-cutting tensions
// Each row carries per-storyline absorption: absorbs · strains · breaks · centers · neutral
// ============================================================================

const CONTRADICTIONS = [
  {
    id: "DE_judicial_vs_political",
    title: "German judicial layer rules; German political layer suppresses",
    type: "Institutional contradiction (intra-state)",
    poles: [
      { side: "Judicial", evidence: ["E17"],
        position: "BGH (Dec 2025): 'foreign government intelligence agency' — formal classification at the highest German judicial authority." },
      { side: "Political", evidence: ["E32","E34"],
        position: "Chancellor's Office invokes Third Party Rule on Bundestag inquiry; refuses AfD parliamentary question 'for reasons of state welfare'." },
    ],
    why:
      "Within a single state, the judicial branch advances and rules in language naming state authorship; the executive branch withholds. The split is itself part of the exhibit — 'avoidance' is not uniform across institutions.",
    bestAbsorbedBy: "mu",
    notes: "μ centers this contradiction. α absorbs it as 'judicial layer signals what political layer cannot' — consistent with Germany not naming its ally publicly.",
  },
  {
    id: "forensic_vs_official_silence",
    title: "Forensic trail concrete; Nordic prosecutorial closures absent of attribution",
    type: "Institutional contradiction (cross-state)",
    poles: [
      { side: "Forensic", evidence: ["E6","F2","F7","F8"],
        position: "Andromeda yacht: HMX residue, DNA, fingerprints, forged identity papers, identified individuals — accessed by three independent jurisdictions." },
      { side: "Closure", evidence: ["E8","E9"],
        position: "Sweden and Denmark close investigations within weeks of each other, citing jurisdictional doctrine (SE) or following pattern (DK), without attribution." },
    ],
    why:
      "The same physical trail that produced the German EAW and the BGH ruling could not produce attribution in Sweden or Denmark — despite both being closer to the blast geography. Disparity is between investigative output, not investigative input.",
    bestAbsorbedBy: "mu",
    notes: "α absorbs as 'jurisdictions choose what they investigate'. β′ absorbs as evidence of coordinated non-resolution preference. μ centers this as the defining pattern.",
  },
  {
    id: "ua_denial_vs_ua_media_pride",
    title: "Ukrainian official denial coexists with Ukrainian-language media pride",
    type: "Source-position contradiction (intra-state)",
    poles: [
      { side: "Official", evidence: ["E36"],
        position: "Podolyak and successive Ukrainian government statements deny operational involvement." },
      { side: "Media", evidence: ["E37"],
        position: "Ukrainian-language outlets aggregate to a pride/positive register on the operation — diverging from official denial." },
    ],
    why:
      "Within Ukraine, the official line (denial) and the domestic media register (pride) move in opposite directions. Either the denial is technically narrow ('the president did not order it' — α-compatible) or the media is operating outside state preference.",
    bestAbsorbedBy: "alpha",
    notes: "α absorbs cleanly via the Zelensky-withdrew / Zaluzhnyi-continued split: both readings can coexist. β′ strains because the pride register is specifically Ukrainian, not Western-coordination.",
  },
  {
    id: "pl_judicial_vs_de_criminal",
    title: "Polish judicial framing legitimizes; German judicial framing criminalizes",
    type: "Legal-classification contradiction (cross-state)",
    poles: [
      { side: "Polish", evidence: ["E14","E18","E22"],
        position: "Łubowski: 'organized action by services of a warring state' — categorization bordering on legitimation. Tusk endorses." },
      { side: "German", evidence: ["E17","E10","E13"],
        position: "BGH: criminal sabotage by foreign-government intelligence; EAWs and prosecutions ongoing." },
    ],
    why:
      "Two EU member-state judicial systems characterize the same act in opposite frames — legitimate wartime action (PL) vs criminal sabotage (DE). The frames cannot both be operative under a single legal order.",
    bestAbsorbedBy: "alpha",
    notes: "α absorbs as expected: Polish state has rhetorical and operational stakes that pull toward legitimation; German criminal apparatus operates under its own institutional logic. β′ also absorbs cleanly. μ absorbs as part of jurisdictional fragmentation.",
  },
  {
    id: "cia_warning_vs_cia_denial",
    title: "CIA warned Germany in June 2022; CIA later denied involvement",
    type: "Source-position contradiction (within-actor)",
    poles: [
      { side: "Documented prior knowledge", evidence: ["E5","E29","F6"],
        position: "Spring 2022 Podol disclosure to CIA; June 2022 formal warning to Germany via MIVD chain; 'interested, not opposed' (Spiegel 2026)." },
      { side: "Public denial", evidence: [],
        position: "CIA spokespeople and successive US administration statements deny operational involvement." },
    ],
    why:
      "The CIA cannot be both 'informed in advance and chose to warn but not foreclose' and 'uninvolved' under any reasonable read. The denial is technically compatible with α (passive awareness) and β′ (tacit permission) — neither makes it untrue, but both make it incomplete.",
    bestAbsorbedBy: "alpha",
    notes: "α absorbs by reading denial narrowly: CIA did not execute. β′ strains because β′'s structural distinguisher requires more than awareness. μ absorbs as institutional pattern.",
  },
  {
    id: "se_jurisdiction_vs_buhl",
    title: "Sweden's jurisdictional closure vs Buhl's substantive legal critique",
    type: "Domain-expertise contradiction",
    poles: [
      { side: "Prosecutorial closure", evidence: ["E8"],
        position: "Sweden cites 'kan antas saknas' (jurisdiction may be presumed lacking) as basis for closure." },
      { side: "Legal-academic dispute", evidence: [],
        position: "Kenneth Buhl (Danish Defence Academy): 'If you say you have jurisdiction, then you have it — unless someone disputes it. Not even Russia disputed Sweden's or Denmark's jurisdiction.'" },
    ],
    why:
      "A peer-jurisdiction legal scholar publicly contradicts the legal reasoning of a neighbouring prosecutor's closure. The technical legal claim has been challenged on the record; the closure has not been re-examined.",
    bestAbsorbedBy: "mu",
    notes: "μ centers this. α and β′ absorb as expected. ζ absorbs because Buhl's challenge expands the institutional-dissent layer.",
  },
  {
    id: "wsj_vs_spiegel",
    title: "WSJ Zaluzhnyi-knowledge narrative vs Spiegel 2026 Zelensky-uninformed account",
    type: "Timeline contradiction",
    poles: [
      { side: "WSJ 2024", evidence: ["E11"],
        position: "Zaluzhnyi knew of the plan." },
      { side: "Spiegel 2026", evidence: ["E29"],
        position: "Zaluzhnyi authorized; Zelensky's office was not informed of the final version." },
    ],
    why:
      "The two accounts appear contradictory only on first read. Il Fatto's reconciling reading (Zelensky approved-then-withdrew under US pressure, Zaluzhnyi continued) makes them consistent as a temporal split. Whether one accepts the reconciliation depends on whether one accepts Il Fatto's sourcing.",
    bestAbsorbedBy: "alpha",
    notes: "α absorbs via the temporal-split reading. β′ strains because β′ does not predict a Ukrainian-internal authorization fork — it predicts a Western-coordination structure. μ neutral.",
  },
  {
    id: "andromeda_vs_state_navy",
    title: "Andromeda physical trail concrete; signature does not match professional state-navy",
    type: "Physical-mechanism contradiction",
    poles: [
      { side: "Forensic concreteness", evidence: ["F2","F7","E6"],
        position: "Military-grade HMX, recovered DNA, fingerprints, forged identities — at 70–80m operational depth." },
      { side: "Operational signature", evidence: ["F12","F3"],
        position: "One of four lines survives intact; 17-hour interval between blasts. Inconsistent with a professional, well-resourced state-navy operation." },
    ],
    why:
      "The forensic trail evidences a real, state-grade-equipped team. The operational signature evidences a resource-constrained, two-pass execution. The combination matches a state-enabled but not state-executed operation — α's principal structural prediction.",
    bestAbsorbedBy: "alpha",
    notes: "α absorbs cleanly: state-enabled, military-bypass-executed, resource-limited team. β′ strains because the resource-limited signature does not fit a wider-coordination thesis. ε absorbs (declared blind spot for unenumerated configurations).",
  },
];


// ============================================================================
// REGISTER PATTERNS — cross-record positional analysis (v0.5 register layer)
//
// Register is positional, not factual. These patterns are surfaced as a
// secondary lens — they strengthen α structurally without grounding causal
// claims directly. (Per spec §1.2 inference firewall.)
// ============================================================================

const REGISTER_PATTERNS = [
  {
    id: "RP1",
    title: "Germany criminalizes; Poland moralizes; Italy proceduralizes",
    locus: "Cross-jurisdictional EU register variation",
    sources: ["E17 (BGH)","E18 (Łubowski)","E19 (Cassazione)","E22 (Tusk)"],
    description:
      "Three EU member states each engage the same act in three categorically different registers. Germany maps the act onto Straftatbestand-Subsumtion (criminal-element matching) — procedural coldness, foreign-government finding without naming. Poland maps the act onto wartime-services framing — moral legitimation (Łubowski) endorsed by the executive (Tusk). Italy maps the act onto extradition procedure — three reversals in six weeks, no substantive position.",
    onlyShows:
      "That the case crosses register-incompatible institutional cultures. Each system describes its own perceived stakes.",
    doesNotShow:
      "Causal attribution. Register variation is a function of institutional grammar, not of state participation.",
    relevantTo: ["alpha","mu"],
  },
  {
    id: "RP2",
    title: "Domestic broadcaster critique of own government (Sweden, Denmark)",
    locus: "Within-state state-media tension",
    sources: ["SVT editorial 2024","Splidsboel 2024","Buhl 2024","E8","E9"],
    description:
      "Swedish public broadcaster (SVT) editorial: 'Sweden took the easiest way out.' Danish Defence Academy senior researcher Splidsboel publicly dissents from his own government's closure rationale. Danish legal scholar Buhl publicly disputes Sweden's jurisdictional doctrine. The within-state register is divided — official prosecutorial register defaults to closure; institutional-academic register defaults to substantive critique.",
    onlyShows:
      "That the Nordic closure pattern is not endorsed by the Nordic expert ecosystem.",
    doesNotShow:
      "What the Nordic states actually concluded. The dissent is positional, not investigative.",
    relevantTo: ["mu"],
  },
  {
    id: "RP3",
    title: "Ukrainian official denial + Ukrainian-language media pride",
    locus: "Within-state state-media split",
    sources: ["E36","E37","Podolyak public statements"],
    description:
      "Ukrainian government register on the operation is denial — narrow, technical, repeatable. Ukrainian-language media register on the operation is pride — affirmative, positive, audience-internal. The two registers do not converge because they speak to different audiences: government to the international diplomatic forum, media to the domestic public. The split is α-predicted.",
    onlyShows:
      "That the within-state register division tracks an audience-management strategy compatible with α.",
    doesNotShow:
      "Whether the operation occurred as α describes. Register is positional evidence; α's claim must be supported by causal-layer evidence (it is — see Storylines lens).",
    relevantTo: ["alpha"],
  },
  {
    id: "RP4",
    title: "BGH structural-affirmation + politically-evasive non-naming",
    locus: "Single-source dual-aspect register",
    sources: ["E17","F9"],
    description:
      "The BGH's December 2025 ruling is dual-aspect: AFFIRMATIVE on the structural finding ('foreign government intelligence operation') and EVASIVE on naming the specific government. The deviation from BGH baseline is high — German high courts default to procedural retreat in state-secrecy cases. Pushing further than baseline on structure while withholding the politically-loadable specificity is a register pattern compatible with the judicial-vs-executive split surfaced in S5.",
    onlyShows:
      "That the BGH crossed its evidentiary threshold for category but did not cross its political threshold for naming. The gap between 'foreign government' (asserted) and naming (withheld) is positional information.",
    doesNotShow:
      "Which government. Register cannot fill what the ruling withholds.",
    relevantTo: ["alpha","mu"],
  },
  {
    id: "RP5",
    title: "US bipartisan ambiguity",
    locus: "Within-state cross-administration register continuity",
    sources: ["E2","E5","E23"],
    description:
      "Biden-administration register: pro-forma denial (E2), then post-facto satisfaction (Blinken 'tremendous opportunity', Nuland 'piece of metal'). Trump 2025 register: 'Russia wasn't involved, many people know.' Cross-administration register is consistent on (a) excluding Russia, (b) refusing to name the actual actor, (c) signaling implicit alignment with the outcome. The bipartisan continuity is itself register evidence — it signals institutional, not partisan, position.",
    onlyShows:
      "That the US register on this question is administration-invariant.",
    doesNotShow:
      "What the US position actually is on principal-vs-enabler structure.",
    relevantTo: ["beta_prime","alpha"],
  },
];


// ============================================================================
// VERSION CHANGELOG — what changed across versions
// ============================================================================

const CHANGELOG = [
  { version:"v0.3", date:"2025-08", title:"English-only baseline",
    notes:[
      "Sixteen evidence items; eight candidates; twelve time points.",
      "Treated all Ukrainian attribution as one undifferentiated C2.",
      "C_insufficient competed with attribution candidates as if it answered the same question.",
      "δ (Russian self-sabotage) carried 5% softmax floor weight.",
    ] },
  { version:"v0.4", date:"2026-01", title:"Fourteen-language intake + new evidence tiers",
    notes:[
      "Added 21 evidence items (E17–E37). Total 37.",
      "Added candidates C2a/C2b/C2c (presidential/military/agency authorization) and C7 (Ukrainian + CIA enabling).",
      "Added BGH ruling, Polish Łubowski ruling, Italian Cassazione reversals as judicial-tier evidence.",
      "Added coverage-meta evidence (E32–E35) feeding the institutional non-resolution question.",
    ] },
  { version:"v0.4.1", date:"2026-02", title:"Structural exclusion audit",
    notes:[
      "Audited C1, C3, C4 against GATE/BREAKS criteria — all three structurally excluded.",
      "C1 (Hersh US-direct): excluded by E6/F3/F12.",
      "C3 (rogue independent): excluded by F2/E17.",
      "C4 (Russian self-sabotage): excluded by E25/F7.",
      "Surfaced as Structurally Excluded section rather than weight 0 in main distribution.",
    ] },
  { version:"v0.4.2", date:"2026-03", title:"Attribution / subclaim split",
    notes:[
      "Separated attribution claim from process subclaim. C_insufficient moved to μ subclaim.",
      "Distribution rescaled by 1.404 to remaining seven attribution candidates.",
      "α: 50% → 70% (not propped up — what remains when structurally excluded mass and subclaim mass are removed).",
      "β: 10% → 5% (β′: lost C1's 5.7% entirely).",
    ] },
  { version:"v0.5", date:"2026-04", title:"Layered workspace + register lens",
    notes:[
      "Front-end IA: READ → EXAMINE → AUDIT three-mode shell.",
      "Storyline cards carry strongest argument / weakest point / what would change directly on face.",
      "Claim Map surfaces six subclaims with proof-state badges (anchor / strong / plausible / speculative / excluded).",
      "Contradiction Matrix renders 8 cross-cutting tensions × 5 storylines, with absorbs / strains / breaks / centers per cell.",
      "Register lens added as positional-evidence layer (per v0.5 spec §1.2 inference firewall).",
    ] },
];


// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function Rule_V05({ tone = "default", style = {} }) {
  const bg = tone === "soft" ? colors_V05.ruleSoft
           : tone === "strong" ? colors_V05.ink
           : colors_V05.rule;
  return <div style={{ height: 1, background: bg, ...style }} />;
}

function MonoLabel({ children, color = colors_V05.inkMute, size = 9.5, letterSpacing = 1, style = {} }) {
  return (
    <div style={{
      fontFamily: fonts.mono, fontSize: size, color,
      letterSpacing, textTransform: "uppercase", fontWeight: 500,
      lineHeight: 1.3, ...style,
    }}>
      {children}
    </div>
  );
}

function Tag_V05({ children, tone = "default" }) {
  const tones = {
    default:   { bg: colors_V05.paperDeep,  fg: colors_V05.inkSoft,    bd: colors_V05.rule },
    primary:   { bg: "#F4E4E0",          fg: colors_V05.primary,    bd: colors_V05.primarySoft },
    secondary: { bg: "#E4ECF4",          fg: colors_V05.secondary,  bd: colors_V05.secondarySoft },
    warn:      { bg: "#F4ECD8",          fg: colors_V05.warnDeep,   bd: "#D4B870" },
    good:      { bg: "#E8EDE0",          fg: colors_V05.good,       bd: colors_V05.goodSoft },
    mute:      { bg: "transparent",      fg: colors_V05.inkMute,    bd: colors_V05.rule },
    inverse:   { bg: colors_V05.ink,         fg: colors_V05.paper,      bd: colors_V05.ink },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{
      fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.8,
      textTransform: "uppercase", padding: "3px 7px", borderRadius: 2,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      display: "inline-block", lineHeight: 1.2, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

function ProofBadge({ proof, compact = false }) {
  const p = proofPalette[proof] || proofPalette.plausible;
  if (compact) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: fonts.mono, fontSize: 9, color: p.fg,
        letterSpacing: 0.7, textTransform: "uppercase", fontWeight: 500,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.fg, display: "inline-block" }} />
        {p.label}
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.9,
      textTransform: "uppercase", padding: "4px 9px", borderRadius: 2,
      background: p.bg, color: p.fg, border: `1px solid ${p.bd}`,
      display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.fg }} />
      {p.label}
    </span>
  );
}

function GlyphBadge({ glyph, color = colors_V05.ink, size = 28 }) {
  return (
    <span style={{
      fontFamily: fonts.mono, fontSize: size, color,
      fontWeight: 600, letterSpacing: 0, lineHeight: 1, display: "inline-block",
    }}>
      {glyph}
    </span>
  );
}

function CoverageDisplay({ value, large = false, color = colors_V05.ink, strikethrough = false }) {
  if (value == null) {
    return (
      <div style={{
        fontFamily: fonts.serif, fontStyle: "italic",
        fontSize: large ? 36 : 24, color: colors_V05.inkMute,
        fontVariantNumeric: "tabular-nums", lineHeight: 0.95, fontWeight: 400,
      }}>—</div>
    );
  }
  return (
    <div style={{
      fontFamily: fonts.serif, fontStyle: "italic",
      fontSize: large ? 56 : 36, color, fontVariantNumeric: "tabular-nums",
      lineHeight: 0.95, fontWeight: 400, textDecoration: strikethrough ? "line-through" : "none",
      textDecorationThickness: strikethrough ? "1.5px" : undefined,
      textDecorationColor: strikethrough ? colors_V05.inkMute : undefined,
    }}>
      {(value * 100).toFixed(0)}<span style={{ fontSize: large ? 24 : 17, opacity: 0.55, marginLeft: 1 }}>%</span>
    </div>
  );
}

function StorylineColor(id) {
  switch (id) {
    case "alpha":      return colors_V05.primary;
    case "beta_prime": return colors_V05.secondary;
    case "epsilon":    return colors_V05.inkSoft;
    case "zeta":       return colors_V05.meta;
    case "mu":         return colors_V05.warnDeep;
    case "delta":      return colors_V05.muted;
    default:           return colors_V05.inkSoft;
  }
}

function StorylineGlyph(id) {
  const map = { alpha:"α", beta_prime:"β′", epsilon:"ε", zeta:"ζ", mu:"μ", delta:"δ" };
  return map[id] || "·";
}

function StorylineShortLabel(id) {
  const s = STORYLINES_V05.find(x => x.id === id);
  return s ? s.shortLabel : id;
}

// Simple flag for evidence cards
function LangBadge({ lang }) {
  const map = { en:"EN", de:"DE", pl:"PL", it:"IT", ru:"RU", sv:"SV", da:"DA", uk:"UK", no:"NO" };
  const label = map[lang] || lang.toUpperCase();
  return (
    <span style={{
      fontFamily: fonts.mono, fontSize: 9, color: colors_V05.inkMute,
      letterSpacing: 0.4, padding: "2px 5px",
      border: `1px solid ${colors_V05.rule}`, borderRadius: 1, background: colors_V05.paper,
    }}>{label}</span>
  );
}

// Absorption indicator for the contradiction matrix cells
function AbsorptionMark({ kind, size = 18 }) {
  // kind: absorbs · strains · breaks · centers · neutral
  const styles = {
    absorbs:  { fg: colors_V05.good,    bg: "#E8EDE0",  glyph: "●", title: "Absorbs cleanly" },
    strains:  { fg: colors_V05.warn,    bg: "#F4ECD8",  glyph: "◐", title: "Strains — partial absorption" },
    breaks:   { fg: colors_V05.primary, bg: "#F4E4E0",  glyph: "✕", title: "Breaks — storyline cannot accommodate" },
    centers:  { fg: colors_V05.ink,     bg: colors_V05.ink, glyph: "★", title: "Centers — this is the storyline's home contradiction", inverse: true },
    neutral:  { fg: colors_V05.muted,   bg: "transparent", glyph: "·", title: "Neutral — does not engage" },
  };
  const s = styles[kind] || styles.neutral;
  return (
    <div title={s.title} style={{
      width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center",
      background: s.inverse ? s.bg : s.bg,
      color: s.inverse ? colors_V05.paper : s.fg,
      border: `1px solid ${s.inverse ? s.bg : s.fg}`,
      fontFamily: fonts.mono, fontSize: size * 0.55, fontWeight: 600,
      borderRadius: 2, lineHeight: 1,
    }}>
      {s.glyph}
    </div>
  );
}


// ============================================================================
// MODE SHELL — top nav with three modes + case identity
// ============================================================================

function ModeShell({ mode, setMode, children }) {
  const modes = [
    { id: "READ",    label: "Read",    sub: "Reader-grade orientation" },
    { id: "EXAMINE", label: "Examine", sub: "Analyst lenses" },
    { id: "AUDIT",   label: "Audit",   sub: "Source trail" },
  ];

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: colors_V05.paper, color: colors_V05.ink,
      fontFamily: fonts.sans,
      WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale",
    }}>
      {/* Sticky top bar — Trace identity + mode selector */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: colors_V05.paperGlass,
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderBottom: `1px solid ${colors_V05.rule}`,
      }}>
        <div style={{
          maxWidth: 1480, margin: "0 auto",
          padding: "14px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
        }}>
          {/* Left: Trace mark + case identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <div style={{
              fontFamily: fonts.serif, fontWeight: 600, fontSize: 22,
              letterSpacing: -0.3, color: colors_V05.ink, lineHeight: 1,
            }}>
              Trace
            </div>
            <div style={{
              fontFamily: fonts.mono, fontSize: 10,
              color: colors_V05.inkMute, letterSpacing: 1, textTransform: "uppercase",
            }}>
              Case file {CASE_META.id} · {CASE_META.version} · {CASE_META.lastUpdated}
            </div>
          </div>

          {/* Right: Mode picker */}
          <div style={{
            display: "inline-flex", border: `1px solid ${colors_V05.rule}`,
            borderRadius: 2, background: colors_V05.paper, padding: 1,
          }}>
            {modes.map(m => {
              const active = m.id === mode;
              return (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{
                    fontFamily: fonts.mono, fontSize: 10, fontWeight: 500,
                    letterSpacing: 1, textTransform: "uppercase",
                    padding: "8px 18px", borderRadius: 1, border: "none",
                    cursor: "pointer", whiteSpace: "nowrap",
                    background: active ? colors_V05.ink : "transparent",
                    color: active ? colors_V05.paper : colors_V05.inkSoft,
                    transition: "all 0.15s",
                  }}>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case header strip — main question + state */}
      <div style={{
        background: colors_V05.paper, borderBottom: `1px solid ${colors_V05.rule}`,
        padding: "26px 32px 28px",
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: 14 }}>
            <div style={{ width: 3, background: colors_V05.primary, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <MonoLabel color={colors_V05.primary} letterSpacing={1.4} size={9.5} style={{ marginBottom: 8 }}>
                {CASE_META.state}
              </MonoLabel>
              <h1 style={{
                fontFamily: fonts.serif, fontWeight: 400, fontStyle: "italic",
                fontSize: "clamp(22px, 2.4vw, 32px)", color: colors_V05.ink,
                letterSpacing: -0.5, lineHeight: 1.2, margin: 0,
              }}>
                {CASE_META.question}
              </h1>
            </div>
          </div>

          {/* Status chips */}
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Chip num={CASE_META.counts.evidenceRecords} label="evidence records" />
            <Chip num={CASE_META.counts.anchorFacts} label="anchor facts" />
            <Chip num={CASE_META.counts.storylinesLive} label="live storylines" tone="primary" />
            <Chip num={CASE_META.counts.subclaim} label="process subclaim" tone="warn" />
            <Chip num={CASE_META.counts.contradictions} label="cross-cutting contradictions" />
            <Chip num={CASE_META.counts.candidatesExcluded} label="structurally excluded" tone="mute" />
            <Chip num={CASE_META.counts.languagesSurveyed} label="languages surveyed" />
            <Chip num={CASE_META.counts.jurisdictionsActive} label="jurisdictions active" />
          </div>
        </div>
      </div>

      {/* Mode body */}
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${colors_V05.rule}`, marginTop: 60,
        padding: "26px 32px 40px",
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
          <MonoLabel size={9} letterSpacing={0.9}>
            Trace · Claim-intelligence workspace · {CASE_META.version}
          </MonoLabel>
          <MonoLabel size={9} letterSpacing={0.9}>
            Not a verdict · A structured reading of contested attribution
          </MonoLabel>
        </div>
      </div>
    </div>
  );
}

function Chip({ num, label, tone = "default" }) {
  const tones = {
    default:  { fg: colors_V05.ink,       bg: colors_V05.paper,    bd: colors_V05.rule },
    primary:  { fg: colors_V05.primary,   bg: "#F4E4E0",        bd: colors_V05.primarySoft },
    warn:     { fg: colors_V05.warnDeep,  bg: "#F4ECD8",        bd: "#D4B870" },
    mute:     { fg: colors_V05.inkMute,   bg: colors_V05.paperDeep, bd: colors_V05.rule },
  };
  const t = tones[tone] || tones.default;
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: 8,
      padding: "7px 12px", border: `1px solid ${t.bd}`, background: t.bg,
      borderRadius: 2,
    }}>
      <span style={{
        fontFamily: fonts.serif, fontStyle: "italic",
        fontSize: 18, color: t.fg, fontVariantNumeric: "tabular-nums",
        fontWeight: 400, lineHeight: 1,
      }}>{num}</span>
      <span style={{
        fontFamily: fonts.mono, fontSize: 9.5, color: t.fg,
        letterSpacing: 0.6, textTransform: "uppercase", lineHeight: 1, fontWeight: 500,
      }}>{label}</span>
    </div>
  );
}


// ============================================================================
// READ MODE — Current Understanding + storyline cards
// ============================================================================

function ReadMode() {
  const liveStorylines    = STORYLINES_V05.filter(s => !s.excluded);
  const heroStoryline     = liveStorylines.find(s => s.isHero);
  const otherStorylines   = liveStorylines.filter(s => !s.isHero);
  const excludedStoryline = STORYLINES_V05.find(s => s.excluded);

  const [openIds, setOpenIds] = useState(() => new Set([heroStoryline?.id]));

  const toggle = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ padding: "40px 32px 0" }}>
      <CurrentUnderstandingPanel leadingId={CURRENT_UNDERSTANDING.leadingStoryline} />

      <SectionHeading
        eyebrow="Five live reconstructions"
        title="Competing storylines"
        body="Each card carries the storyline's strongest argument, weakest point, and what would change it. The hero card (α) is expanded by default. Open the others to compare directly."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Hero card — always expanded by default */}
        {heroStoryline && (
          <StorylineCard_V05
            story={heroStoryline}
            isOpen={openIds.has(heroStoryline.id)}
            onToggle={() => toggle(heroStoryline.id)}
            isHero
          />
        )}

        {/* Other live storylines */}
        {otherStorylines.map(s => (
          <StorylineCard_V05
            key={s.id}
            story={s}
            isOpen={openIds.has(s.id)}
            onToggle={() => toggle(s.id)}
          />
        ))}
      </div>

      {/* Structurally excluded fold */}
      {excludedStoryline && (
        <ExcludedFold story={excludedStoryline} />
      )}

      {/* Load-bearing unknowns rail */}
      <LoadBearingUnknownsRail />
    </div>
  );
}

function SectionHeading({ eyebrow, title, body, dense = false }) {
  return (
    <div style={{ margin: dense ? "32px 0 18px" : "56px 0 26px", maxWidth: 760 }}>
      {eyebrow && (
        <MonoLabel color={colors_V05.primary} letterSpacing={1.3} size={9.5} style={{ marginBottom: 10 }}>
          {eyebrow}
        </MonoLabel>
      )}
      <h2 style={{
        fontFamily: fonts.serif, fontWeight: 400, fontStyle: "italic",
        fontSize: dense ? 22 : 28, color: colors_V05.ink, letterSpacing: -0.4,
        lineHeight: 1.2, margin: 0,
      }}>{title}</h2>
      {body && (
        <p style={{
          fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.55,
          color: colors_V05.inkSoft, marginTop: 12, marginBottom: 0, maxWidth: 720,
        }}>{body}</p>
      )}
    </div>
  );
}

function CurrentUnderstandingPanel({ leadingId }) {
  const leading = STORYLINES_V05.find(s => s.id === leadingId);
  if (!leading) return null;

  return (
    <div style={{
      border: `1px solid ${colors_V05.rule}`,
      background: colors_V05.paperDeep,
      padding: "32px 36px 36px",
      display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 36,
      borderRadius: 2,
    }}>
      {/* Left — current understanding text */}
      <div>
        <MonoLabel color={colors_V05.primary} letterSpacing={1.3} size={9.5} style={{ marginBottom: 14 }}>
          Current understanding · {CASE_META.lastUpdated}
        </MonoLabel>
        <div style={{
          fontFamily: fonts.serif, fontStyle: "italic", fontSize: 22,
          fontWeight: 400, color: colors_V05.ink, letterSpacing: -0.3, lineHeight: 1.32,
          marginBottom: 22,
        }}>
          {CURRENT_UNDERSTANDING.headline}
        </div>
        <div style={{
          fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.65,
          color: colors_V05.inkSoft, marginBottom: 22,
        }}>
          {CURRENT_UNDERSTANDING.bodyLong}
        </div>
        <div style={{
          padding: "16px 18px",
          background: colors_V05.paper, border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${colors_V05.warn}`,
          borderRadius: 2,
        }}>
          <MonoLabel color={colors_V05.warnDeep} size={9} letterSpacing={1} style={{ marginBottom: 8 }}>
            What this still does not fully explain
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 13, lineHeight: 1.55, color: colors_V05.inkSoft,
          }}>
            {CURRENT_UNDERSTANDING.notFullyExplains}
          </div>
        </div>
      </div>

      {/* Right — leading reconstruction summary card */}
      <div style={{
        background: colors_V05.paper, border: `1px solid ${colors_V05.primarySoft}`,
        padding: "20px 22px 22px", borderRadius: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <MonoLabel color={colors_V05.primary} letterSpacing={1.3} size={9}>
            Leading reconstruction
          </MonoLabel>
          <GlyphBadge glyph={leading.glyph} color={colors_V05.primary} size={20} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
          <CoverageDisplay value={leading.coverage} large color={colors_V05.primary} />
          <div style={{
            fontFamily: fonts.mono, fontSize: 9, color: colors_V05.inkMute,
            letterSpacing: 0.8, textTransform: "uppercase",
          }}>
            attribution coverage
          </div>
        </div>
        <div style={{
          fontFamily: fonts.serif, fontSize: 17, fontWeight: 400, color: colors_V05.ink,
          letterSpacing: -0.2, lineHeight: 1.3, marginBottom: 16,
        }}>
          {leading.shortLabel}
        </div>
        <Rule_V05 tone="soft" />
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <SmallStat label="Strongest argument" body={leading.strongestArgument.headline} fg={colors_V05.good} />
          <SmallStat label="Weakest point" body={leading.weakestPoint.headline} fg={colors_V05.warnDeep} />
          <SmallStat label="What would change" body={leading.whatWouldChange.headline} fg={colors_V05.secondary} />
        </div>
      </div>
    </div>
  );
}

function SmallStat({ label, body, fg }) {
  return (
    <div>
      <MonoLabel color={fg} letterSpacing={0.9} size={8.5} style={{ marginBottom: 4 }}>
        {label}
      </MonoLabel>
      <div style={{
        fontFamily: fonts.sans, fontSize: 12, lineHeight: 1.5, color: colors_V05.inkSoft,
      }}>
        {body}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// StorylineCard_V05 — α hero variant + standard variant
// ----------------------------------------------------------------------------

function StorylineCard_V05({ story, isOpen, onToggle, isHero = false }) {
  const isSubclaim = story.isSubclaim;
  const accent = StorylineColor(story.id);
  const showCoverage = story.coverage != null;

  return (
    <div style={{
      border: `1px solid ${isHero ? colors_V05.primary : colors_V05.ruleSoft}`,
      background: colors_V05.paper, borderRadius: 2,
      transition: "border-color 0.2s",
    }}>
      {/* Header */}
      <div onClick={onToggle}
        style={{
          padding: isHero ? "26px 32px" : "20px 28px",
          cursor: "pointer", display: "grid",
          gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center",
        }}>
        {/* Coverage + glyph */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 110 }}>
          {showCoverage ? (
            <CoverageDisplay value={story.coverage} large={isHero} color={accent} />
          ) : (
            <div style={{
              fontFamily: fonts.serif, fontStyle: "italic", fontSize: isHero ? 56 : 36,
              color: accent, lineHeight: 0.95, fontWeight: 400,
            }}>μ</div>
          )}
          {showCoverage && (
            <GlyphBadge glyph={story.glyph} color={accent} size={isHero ? 18 : 14} />
          )}
        </div>

        {/* Label + chips */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: fonts.serif, fontSize: isHero ? 23 : 17, fontWeight: 400,
            color: colors_V05.ink, letterSpacing: -0.25, lineHeight: 1.3,
          }}>
            {story.label}
          </div>
          {isSubclaim && (
            <div style={{ marginTop: 8 }}>
              <Tag_V05 tone="warn">Subclaim · not an attribution candidate</Tag_V05>
            </div>
          )}
          {!isSubclaim && !isHero && (
            <div style={{
              marginTop: 8, fontFamily: fonts.sans, fontSize: 12,
              color: colors_V05.inkMute, lineHeight: 1.5, maxWidth: 720,
            }}>
              {story.claim.length > 200 ? story.claim.slice(0, 200) + "…" : story.claim}
            </div>
          )}
        </div>

        {/* Toggle indicator */}
        <button
          aria-label={isOpen ? "collapse" : "expand"}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkSoft,
            background: isOpen ? colors_V05.paperDeep : "transparent",
            border: `1px solid ${colors_V05.rule}`, padding: "6px 12px",
            borderRadius: 2, cursor: "pointer",
            letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
          {isOpen ? "− collapse" : "+ expand"}
        </button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div style={{
          borderTop: `1px solid ${colors_V05.ruleSoft}`,
          padding: isHero ? "30px 32px 32px" : "24px 28px 26px",
          background: isHero ? colors_V05.paper : colors_V05.paperDeep,
        }}>
          <StorylineExpansion story={story} isHero={isHero} />
        </div>
      )}
    </div>
  );
}

function StorylineExpansion({ story, isHero }) {
  const accent = StorylineColor(story.id);
  return (
    <>
      {/* Claim text */}
      <div style={{
        fontFamily: fonts.serif, fontSize: isHero ? 16 : 14, fontStyle: "italic",
        fontWeight: 400, color: colors_V05.inkSoft, lineHeight: 1.55,
        paddingLeft: 14, borderLeft: `1px solid ${colors_V05.ruleSoft}`,
        marginBottom: 26, maxWidth: 880,
      }}>
        {story.claim}
      </div>

      {/* Three judgment cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14,
        marginBottom: 28,
      }}>
        <JudgmentCard
          label="Strongest argument"
          accent={colors_V05.good}
          headline={story.strongestArgument.headline}
          bullets={story.strongestArgument.bullets}
        />
        <JudgmentCard
          label="Weakest point"
          accent={colors_V05.warnDeep}
          headline={story.weakestPoint.headline}
          body={story.weakestPoint.body}
        />
        <JudgmentCard
          label="What would change it"
          accent={colors_V05.secondary}
          headline={story.whatWouldChange.headline}
          bullets={story.whatWouldChange.items}
        />
      </div>

      {/* Overlay summary block */}
      <div style={{
        padding: "16px 18px", background: colors_V05.paperDeep,
        border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${accent}`,
        borderRadius: 2, marginBottom: 22,
      }}>
        <MonoLabel color={accent} size={9} letterSpacing={1} style={{ marginBottom: 8 }}>
          {story.isSubclaim ? "What this subclaim does" : "What this storyline does"}
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 13, lineHeight: 1.6, color: colors_V05.inkSoft,
        }}>
          {story.overlaySummary}
        </div>
      </div>

      {/* Evidence + anchors footer */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18,
        paddingTop: 16, borderTop: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        <div>
          <MonoLabel size={9} letterSpacing={0.9} style={{ marginBottom: 8 }}>
            Key supporting evidence ({story.keyEvidence.length})
          </MonoLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {story.keyEvidence.length === 0 ? (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute }}>
                — meta-storyline, no direct evidence —
              </span>
            ) : (
              story.keyEvidence.map(eid => <EvidencePill key={eid} eid={eid} />)
            )}
          </div>
        </div>
        <div>
          <MonoLabel size={9} letterSpacing={0.9} style={{ marginBottom: 8 }}>
            Anchored to facts ({story.keyAnchors.length}/13)
          </MonoLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {story.keyAnchors.length === 0 ? (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute }}>—</span>
            ) : (
              story.keyAnchors.map(fid => (
                <span key={fid} style={{
                  fontFamily: fonts.mono, fontSize: 9.5, color: colors_V05.good,
                  padding: "2px 6px", border: `1px solid ${colors_V05.goodSoft}`,
                  background: "#E8EDE0", borderRadius: 1, letterSpacing: 0.4,
                }}>{fid}</span>
              ))
            )}
          </div>
        </div>
        <div>
          <MonoLabel size={9} letterSpacing={0.9} style={{ marginBottom: 8 }}>
            Challenged by
          </MonoLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {story.challengedBy.length === 0 ? (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute }}>— none active —</span>
            ) : (
              story.challengedBy.map(eid => <EvidencePill key={eid} eid={eid} variant="warn" />)
            )}
          </div>
        </div>
      </div>

      {/* Distribution provenance */}
      <div style={{
        marginTop: 18, padding: "10px 12px", background: colors_V05.paper,
        border: `1px dashed ${colors_V05.ruleSoft}`, borderRadius: 2,
      }}>
        <MonoLabel size={8.5} letterSpacing={0.9} style={{ marginBottom: 4 }}>
          Distribution source
        </MonoLabel>
        <div style={{
          fontFamily: fonts.mono, fontSize: 10.5, color: colors_V05.inkMute,
          lineHeight: 1.55, fontVariantNumeric: "tabular-nums",
        }}>
          {story.sourceFromCandidates}
        </div>
      </div>
    </>
  );
}

function JudgmentCard({ label, accent, headline, body, bullets }) {
  return (
    <div style={{
      border: `1px solid ${colors_V05.ruleSoft}`, background: colors_V05.paper,
      padding: "16px 16px 18px", borderRadius: 2,
      borderTop: `2px solid ${accent}`,
    }}>
      <MonoLabel color={accent} size={9} letterSpacing={1} style={{ marginBottom: 10 }}>
        {label}
      </MonoLabel>
      <div style={{
        fontFamily: fonts.serif, fontStyle: "italic", fontSize: 15,
        fontWeight: 400, color: colors_V05.ink, letterSpacing: -0.15,
        lineHeight: 1.35, marginBottom: 12,
      }}>
        {headline}
      </div>
      {body && (
        <div style={{
          fontFamily: fonts.sans, fontSize: 12, lineHeight: 1.55, color: colors_V05.inkSoft,
        }}>
          {body}
        </div>
      )}
      {bullets && bullets.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: fonts.sans, fontSize: 12, lineHeight: 1.55, color: colors_V05.inkSoft,
              paddingLeft: 14, position: "relative", marginBottom: 7,
            }}>
              <span style={{
                position: "absolute", left: 0, top: 7, width: 6, height: 1,
                background: accent,
              }} />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EvidencePill({ eid, variant = "default" }) {
  const ev = EVIDENCE.find(e => e.id === eid);
  const tone = variant === "warn" ? { fg: colors_V05.warnDeep, bg: "#F4ECD8", bd: "#D4B870" }
                                  : { fg: colors_V05.secondary, bg: "#E4ECF4", bd: colors_V05.secondarySoft };
  return (
    <span title={ev ? ev.label : eid}
      style={{
        fontFamily: fonts.mono, fontSize: 9.5, color: tone.fg,
        padding: "2px 6px", border: `1px solid ${tone.bd}`, background: tone.bg,
        borderRadius: 1, letterSpacing: 0.4, cursor: "help",
      }}>
      {eid}
    </span>
  );
}

function ExcludedFold({ story }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      marginTop: 24, border: `1px solid ${colors_V05.ruleSoft}`,
      background: colors_V05.paperDeep, borderRadius: 2,
    }}>
      <div onClick={() => setOpen(o => !o)}
        style={{
          padding: "16px 24px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Tag_V05 tone="warn">Structurally excluded</Tag_V05>
          <div style={{
            fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft, fontWeight: 500,
          }}>
            {story.label} · retained for audit transparency
          </div>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute, letterSpacing: 0.8 }}>
          {open ? "− collapse" : "+ expand"}
        </span>
      </div>
      {open && (
        <div style={{
          borderTop: `1px solid ${colors_V05.ruleSoft}`, padding: "20px 24px 22px",
          background: colors_V05.paper,
        }}>
          <div style={{
            padding: "14px 16px", background: "#F4ECD8", border: `1px solid #D4B870`,
            borderLeft: `3px solid ${colors_V05.warn}`, borderRadius: 2, marginBottom: 16,
          }}>
            <MonoLabel color={colors_V05.warnDeep} size={9} letterSpacing={1} style={{ marginBottom: 6 }}>
              Why this storyline is excluded, not low-weight
            </MonoLabel>
            <div style={{
              fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 1.6, color: colors_V05.inkSoft,
            }}>
              {story.excludedReason}
            </div>
          </div>
          <MonoLabel size={9} letterSpacing={0.9} style={{ marginBottom: 8 }}>
            See also: structurally excluded candidates
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkMute, lineHeight: 1.55,
          }}>
            δ is one of one excluded storyline. At the candidate layer, three candidates (C1 Hersh / C3 rogue / C4 Russian) are also structurally excluded — see Examine → Claim Map for the full audit trail.
          </div>
        </div>
      )}
    </div>
  );
}

function LoadBearingUnknownsRail() {
  const tiers = [
    { key: "changeLeading", data: LOAD_BEARING_UNKNOWNS.changeLeading, accent: colors_V05.primary },
    { key: "interesting",   data: LOAD_BEARING_UNKNOWNS.interesting,   accent: colors_V05.inkSoft },
    { key: "silence",       data: LOAD_BEARING_UNKNOWNS.silence,       accent: colors_V05.warnDeep },
  ];
  return (
    <>
      <SectionHeading
        eyebrow="What we don't know — structured"
        title="Load-bearing unknowns"
        body="Trace's distinguishing move from generic case summaries: not 'here is what is missing', but 'here is what is missing AND whether disclosure would change anything'. Three tiers."
      />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16,
      }}>
        {tiers.map(({ key, data, accent }) => (
          <div key={key} style={{
            background: colors_V05.paper, border: `1px solid ${colors_V05.ruleSoft}`,
            borderTop: `2px solid ${accent}`, padding: "18px 18px 20px", borderRadius: 2,
          }}>
            <MonoLabel color={accent} size={9} letterSpacing={1} style={{ marginBottom: 10 }}>
              {data.label}
            </MonoLabel>
            <div style={{
              fontFamily: fonts.sans, fontSize: 12, fontStyle: "italic", color: colors_V05.inkMute,
              lineHeight: 1.5, marginBottom: 14,
            }}>
              {data.rationale}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {data.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 12 }}>
                  <div style={{
                    fontFamily: fonts.serif, fontSize: 13.5, color: colors_V05.ink,
                    fontStyle: "italic", lineHeight: 1.4, marginBottom: 4,
                  }}>
                    {item.q}
                  </div>
                  <div style={{
                    fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft, lineHeight: 1.5,
                  }}>
                    {item.why}
                  </div>
                  {item.wouldShift && (
                    <div style={{ marginTop: 5 }}>
                      <span style={{
                        fontFamily: fonts.mono, fontSize: 9, color: colors_V05.primary,
                        letterSpacing: 0.7, textTransform: "uppercase", padding: "2px 6px",
                        background: "#F4E4E0", border: `1px solid ${colors_V05.primarySoft}`, borderRadius: 1,
                      }}>
                        would shift: {item.wouldShift}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}


// ============================================================================
// EXAMINE MODE — four lenses: Claim Map · Evidence · Contradictions · Register
// ============================================================================

function ExamineMode() {
  const [lens, setLens] = useState("claim_map");

  const lenses = [
    { id: "claim_map",     label: "Claim Map",      sub: "Structure of the question" },
    { id: "evidence",      label: "Evidence Ledger", sub: "37 records · audit fields" },
    { id: "contradictions",label: "Contradictions",  sub: "8 cross-cutting tensions" },
    { id: "register",      label: "Register",        sub: "5 patterns + ecosystem map" },
  ];

  return (
    <div style={{ padding: "32px 32px 0" }}>
      {/* Lens picker — secondary nav */}
      <div style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${colors_V05.rule}`, marginBottom: 32,
      }}>
        {lenses.map(l => {
          const active = l.id === lens;
          return (
            <button key={l.id} onClick={() => setLens(l.id)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "16px 22px 14px", borderBottom: active ? `2px solid ${colors_V05.primary}` : "2px solid transparent",
                marginBottom: -1, textAlign: "left", transition: "all 0.15s",
              }}>
              <div style={{
                fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18,
                color: active ? colors_V05.ink : colors_V05.inkSoft, fontWeight: 400,
                letterSpacing: -0.2, lineHeight: 1.2, marginBottom: 4,
              }}>
                {l.label}
              </div>
              <MonoLabel size={9} letterSpacing={0.7} color={active ? colors_V05.primary : colors_V05.inkMute}>
                {l.sub}
              </MonoLabel>
            </button>
          );
        })}
      </div>

      {/* Lens body */}
      {lens === "claim_map"      && <ClaimMapLens />}
      {lens === "evidence"       && <EvidenceLens />}
      {lens === "contradictions" && <ContradictionsLens />}
      {lens === "register"       && <RegisterLens />}
    </div>
  );
}

// ----------------------------------------------------------------------------
// LENS 1 — CLAIM MAP
// ----------------------------------------------------------------------------

function ClaimMapLens() {
  const [selectedId, setSelectedId] = useState("S1");
  const selected = CLAIM_MAP.subclaims.find(s => s.id === selectedId);

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Claim Map"
        title="The question, decomposed"
        body="The attribution question is not one claim but a tree. Each subclaim is anchored to facts and challenged by evidence at a different proof state. Click a node to inspect."
      />

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(360px, 1fr) minmax(0, 1.6fr)", gap: 28,
      }}>
        {/* Left — tree */}
        <div>
          <div style={{
            background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
            padding: "20px 22px", borderRadius: 2, marginBottom: 12,
          }}>
            <MonoLabel size={9} letterSpacing={1} color={colors_V05.primary} style={{ marginBottom: 8 }}>
              Root claim
            </MonoLabel>
            <div style={{
              fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18,
              color: colors_V05.ink, letterSpacing: -0.25, lineHeight: 1.3, marginBottom: 12,
            }}>
              {CLAIM_MAP.rootClaim}
            </div>
            <ProofBadge proof={CLAIM_MAP.rootProof} compact />
          </div>

          {/* Subclaim list */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CLAIM_MAP.subclaims.map((s, i) => {
              const active = s.id === selectedId;
              const palette = proofPalette[s.proof];
              return (
                <button key={s.id} onClick={() => setSelectedId(s.id)}
                  style={{
                    background: active ? colors_V05.paperDeep : colors_V05.paper,
                    border: `1px solid ${active ? colors_V05.ink : colors_V05.ruleSoft}`,
                    borderTop: i > 0 && !active ? `1px solid ${colors_V05.ruleSoft}` : `1px solid ${active ? colors_V05.ink : colors_V05.ruleSoft}`,
                    padding: "14px 18px", textAlign: "left", cursor: "pointer",
                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
                    borderRadius: 2, marginTop: i === 0 ? 0 : -1,
                    transition: "all 0.12s",
                  }}>
                  <div style={{
                    fontFamily: fonts.mono, fontSize: 12, color: colors_V05.inkMute,
                    fontVariantNumeric: "tabular-nums", fontWeight: 500,
                  }}>
                    S{i + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.serif, fontSize: 15, color: colors_V05.ink,
                      letterSpacing: -0.15, lineHeight: 1.3, marginBottom: 3,
                    }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkMute,
                      lineHeight: 1.45,
                    }}>
                      {s.question}
                    </div>
                  </div>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", background: palette.fg,
                    border: `2px solid ${palette.bg}`,
                  }} />
                </button>
              );
            })}
          </div>

          {/* Structurally excluded fold */}
          <div style={{ marginTop: 16 }}>
            <StructurallyExcludedAccordion />
          </div>
        </div>

        {/* Right — selected subclaim detail */}
        {selected && (
          <ClaimDetailPanel s={selected} />
        )}
      </div>
    </div>
  );
}

function ClaimDetailPanel({ s }) {
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "26px 30px 30px", borderRadius: 2, alignSelf: "flex-start",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
        <div>
          <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.primary} style={{ marginBottom: 8 }}>
            Subclaim · {s.id}
          </MonoLabel>
          <div style={{
            fontFamily: fonts.serif, fontStyle: "italic", fontSize: 22,
            color: colors_V05.ink, letterSpacing: -0.3, lineHeight: 1.25,
          }}>
            {s.label}
          </div>
        </div>
        <ProofBadge proof={s.proof} />
      </div>

      <div style={{
        fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft,
        fontStyle: "italic", lineHeight: 1.55, marginBottom: 22,
      }}>
        {s.question}
      </div>

      <div style={{
        padding: "14px 16px", background: colors_V05.paperDeep,
        border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${colors_V05.primary}`,
        borderRadius: 2, marginBottom: 22,
      }}>
        <MonoLabel size={9} letterSpacing={1} style={{ marginBottom: 6 }}>
          Current reading
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft, lineHeight: 1.6,
        }}>
          {s.summary}
        </div>
      </div>

      {s.established && s.established.length > 0 && (
        <SubclaimList
          label="Established"
          items={s.established}
          accent={colors_V05.good}
        />
      )}

      {s.tensions && s.tensions.length > 0 && (
        <SubclaimList
          label="Tensions and what is not yet established"
          items={s.tensions}
          accent={colors_V05.warnDeep}
        />
      )}

      {s.keyEvidence && s.keyEvidence.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <MonoLabel size={9} letterSpacing={0.9} style={{ marginBottom: 8 }}>
            Key evidence
          </MonoLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {s.keyEvidence.map(eid => <EvidencePill key={eid} eid={eid} />)}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 22, paddingTop: 16, borderTop: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.secondary} style={{ marginBottom: 6 }}>
          Why this matters for the case
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.55,
        }}>
          {s.stateInfluence}
        </div>
      </div>
    </div>
  );
}

function SubclaimList({ label, items, accent }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <MonoLabel color={accent} size={9} letterSpacing={1} style={{ marginBottom: 8 }}>
        {label}
      </MonoLabel>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((item, i) => (
          <li key={i} style={{
            fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft,
            lineHeight: 1.6, paddingLeft: 14, position: "relative", marginBottom: 6,
          }}>
            <span style={{
              position: "absolute", left: 0, top: 9, width: 6, height: 1, background: accent,
            }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StructurallyExcludedAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${colors_V05.ruleSoft}`, background: colors_V05.paperDeep, borderRadius: 2,
    }}>
      <div onClick={() => setOpen(o => !o)}
        style={{
          padding: "12px 18px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tag_V05 tone="warn">{STRUCTURAL_EXCLUSIONS.length} structurally excluded candidates</Tag_V05>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute, letterSpacing: 0.8 }}>
          {open ? "−" : "+"}
        </span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${colors_V05.ruleSoft}`, padding: "12px 18px 16px" }}>
          {STRUCTURAL_EXCLUSIONS.map(ex => (
            <div key={ex.candidate} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px dashed ${colors_V05.ruleSoft}` }}>
              <div style={{
                fontFamily: fonts.serif, fontSize: 14, fontStyle: "italic",
                color: colors_V05.inkSoft, marginBottom: 6, textDecoration: "line-through",
                textDecorationColor: colors_V05.inkMute,
              }}>
                {ex.candidate} · {ex.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {ex.excludedBy.map((x, i) => (
                  <div key={i} style={{
                    fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft,
                    lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 9, color: colors_V05.warnDeep,
                      padding: "1px 5px", background: "#F4ECD8", border: `1px solid #D4B870`,
                      letterSpacing: 0.5, marginRight: 6,
                    }}>{x.id} · {x.type}</span>
                    {x.reason}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ----------------------------------------------------------------------------
// LENS 2 — EVIDENCE LEDGER
// ----------------------------------------------------------------------------

function EvidenceLens() {
  const [filter, setFilter]   = useState("all");
  const [selectedId, setSelectedId] = useState("E17");

  const filters = [
    { id: "all",       label: "All", count: EVIDENCE.length },
    { id: "anchor",    label: "Anchored facts", count: ANCHORS_V05.length },
    { id: "judicial",  label: "Judicial", count: EVIDENCE.filter(e => e.cluster === "german_judicial" || ["E14","E18","E19","E20","E13"].includes(e.id)).length },
    { id: "forensic",  label: "Forensic", count: EVIDENCE.filter(e => e.type === "forensic").length },
    { id: "intel",     label: "Intel-leak cluster", count: EVIDENCE.filter(e => e.cluster === "western_intel_leaks").length },
    { id: "official",  label: "Official", count: EVIDENCE.filter(e => e.type === "official_statement").length },
    { id: "register",  label: "Coverage / register", count: EVIDENCE.filter(e => e.cluster === "coverage_meta" || e.id === "E37").length },
  ];

  const filtered = useMemo(() => {
    if (filter === "all") return EVIDENCE;
    if (filter === "anchor") return [];   // anchors shown separately
    if (filter === "judicial") return EVIDENCE.filter(e =>
      e.cluster === "german_judicial" || ["E14","E18","E19","E20","E13"].includes(e.id));
    if (filter === "forensic") return EVIDENCE.filter(e => e.type === "forensic");
    if (filter === "intel")    return EVIDENCE.filter(e => e.cluster === "western_intel_leaks");
    if (filter === "official") return EVIDENCE.filter(e => e.type === "official_statement");
    if (filter === "register") return EVIDENCE.filter(e => e.cluster === "coverage_meta" || e.id === "E37");
    return EVIDENCE;
  }, [filter]);

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Evidence Ledger"
        title="Audit-grade record"
        body="Each record carries five fields: what it is · what it supports · what it contradicts · what it only shows · what remains missing. Anchored facts (F1–F13) are foundation; evidence (E1–E37) is interpretive."
      />

      {/* Filter row */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24,
        paddingBottom: 14, borderBottom: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        {filters.map(f => {
          const active = f.id === filter;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{
                fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.7,
                textTransform: "uppercase", padding: "6px 12px", borderRadius: 2,
                cursor: "pointer", border: `1px solid ${active ? colors_V05.ink : colors_V05.rule}`,
                background: active ? colors_V05.ink : "transparent",
                color: active ? colors_V05.paper : colors_V05.inkSoft, fontWeight: 500,
                transition: "all 0.12s",
              }}>
              {f.label} <span style={{ opacity: 0.6, marginLeft: 5 }}>{f.count}</span>
            </button>
          );
        })}
      </div>

      {filter === "anchor" ? (
        <AnchorsList />
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)", gap: 24,
        }}>
          {/* Evidence list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(e => {
              const active = e.id === selectedId;
              return (
                <button key={e.id} onClick={() => setSelectedId(e.id)}
                  style={{
                    background: active ? colors_V05.paperDeep : colors_V05.paper,
                    border: `1px solid ${active ? colors_V05.ink : colors_V05.ruleSoft}`,
                    padding: "12px 16px", textAlign: "left", cursor: "pointer",
                    display: "grid", gridTemplateColumns: "auto auto 1fr auto", gap: 12, alignItems: "center",
                    borderRadius: 2,
                  }}>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 11, color: colors_V05.inkMute,
                    fontVariantNumeric: "tabular-nums", fontWeight: 500, minWidth: 28,
                  }}>{e.id}</span>
                  <LangBadge lang={e.language} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.serif, fontSize: 13.5, color: colors_V05.ink,
                      lineHeight: 1.3, marginBottom: 2,
                    }}>{e.label}</div>
                    <div style={{
                      fontFamily: fonts.mono, fontSize: 9, color: colors_V05.inkMute,
                      letterSpacing: 0.5,
                    }}>{e.date} · {e.type.replace(/_/g, " ")}</div>
                  </div>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkSoft,
                    fontVariantNumeric: "tabular-nums",
                  }}>{e.credibility.toFixed(2)}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedId && (
            <EvidenceDetailPanel ev={EVIDENCE.find(e => e.id === selectedId)} />
          )}
        </div>
      )}
    </div>
  );
}

function EvidenceDetailPanel({ ev }) {
  if (!ev) return null;
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "26px 30px 28px", borderRadius: 2, alignSelf: "flex-start",
    }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <span style={{
          fontFamily: fonts.mono, fontSize: 13, color: colors_V05.primary,
          fontVariantNumeric: "tabular-nums", fontWeight: 600,
        }}>{ev.id}</span>
        <LangBadge lang={ev.language} />
        <Tag_V05>{ev.type.replace(/_/g, " ")}</Tag_V05>
        {ev.cluster && <Tag_V05 tone="warn">cluster: {ev.cluster.replace(/_/g, " ")}</Tag_V05>}
      </div>

      <div style={{
        fontFamily: fonts.serif, fontSize: 22, color: colors_V05.ink, fontWeight: 400,
        letterSpacing: -0.25, lineHeight: 1.25, marginBottom: 6,
      }}>
        {ev.label}
      </div>
      <MonoLabel size={9.5} letterSpacing={0.8}>{ev.date}</MonoLabel>

      <div style={{
        fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft,
        lineHeight: 1.6, margin: "18px 0 22px", paddingLeft: 14, borderLeft: `1px solid ${colors_V05.ruleSoft}`,
        fontStyle: "italic",
      }}>
        {ev.detail}
      </div>

      <Rule_V05 tone="soft" style={{ margin: "18px 0" }} />

      {/* Audit fields */}
      <AuditField
        label="What it only shows"
        accent={colors_V05.good}
        body={ev.whatItOnlyShows}
      />
      <AuditField
        label="What remains missing"
        accent={colors_V05.warnDeep}
        body={ev.whatRemainsMissing}
      />

      {/* Storyline edges */}
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <MonoLabel color={colors_V05.good} size={9} letterSpacing={0.9} style={{ marginBottom: 7 }}>
            Supports
          </MonoLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {ev.supports.length === 0 ? (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute }}>—</span>
            ) : (
              ev.supports.map(sid => (
                <span key={sid} style={{
                  fontFamily: fonts.mono, fontSize: 9.5, color: StorylineColor(sid),
                  padding: "2px 6px", border: `1px solid ${StorylineColor(sid)}`,
                  background: colors_V05.paper, borderRadius: 1, letterSpacing: 0.4, fontWeight: 500,
                }}>{StorylineGlyph(sid)} · {StorylineShortLabel(sid)}</span>
              ))
            )}
          </div>
        </div>
        <div>
          <MonoLabel color={colors_V05.primary} size={9} letterSpacing={0.9} style={{ marginBottom: 7 }}>
            Refutes / strains
          </MonoLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {ev.refutes.length === 0 ? (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors_V05.inkMute }}>—</span>
            ) : (
              ev.refutes.map(sid => (
                <span key={sid} style={{
                  fontFamily: fonts.mono, fontSize: 9.5, color: StorylineColor(sid),
                  padding: "2px 6px", border: `1px dashed ${StorylineColor(sid)}`,
                  background: colors_V05.paper, borderRadius: 1, letterSpacing: 0.4, fontWeight: 500,
                }}>{StorylineGlyph(sid)} · {StorylineShortLabel(sid)}</span>
              ))
            )}
          </div>
        </div>
      </div>

      {ev.structurallyExcludedFor && (
        <div style={{
          marginTop: 18, padding: "10px 14px", background: "#F4ECD8",
          border: `1px solid #D4B870`, borderLeft: `3px solid ${colors_V05.warn}`,
          borderRadius: 2,
        }}>
          <MonoLabel color={colors_V05.warnDeep} size={9} letterSpacing={1} style={{ marginBottom: 4 }}>
            Contributes to structural exclusion
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.55,
          }}>
            {ev.structurallyExcludedFor}
          </div>
        </div>
      )}

      <Rule_V05 tone="soft" style={{ margin: "20px 0 14px" }} />
      <div style={{ display: "flex", gap: 16, fontFamily: fonts.mono, fontSize: 10,
        color: colors_V05.inkMute, letterSpacing: 0.5 }}>
        <span>Credibility · {ev.credibility.toFixed(2)}</span>
      </div>
    </div>
  );
}

function AuditField({ label, accent, body }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <MonoLabel color={accent} size={9} letterSpacing={0.9} style={{ marginBottom: 6 }}>
        {label}
      </MonoLabel>
      <div style={{
        fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.6,
      }}>
        {body}
      </div>
    </div>
  );
}

function AnchorsList() {
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "26px 30px 28px", borderRadius: 2,
    }}>
      <div style={{ marginBottom: 18 }}>
        <ProofBadge proof="anchor" />
      </div>
      <div style={{
        fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft, lineHeight: 1.6,
        marginBottom: 22, fontStyle: "italic", maxWidth: 720,
      }}>
        These are the anchors. They are not disputed in any of the fourteen languages we surveyed. They define what every storyline must accommodate.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {ANCHORS_V05.map(a => (
          <div key={a.id} style={{
            border: `1px solid ${a.flagged ? "#D4B870" : colors_V05.ruleSoft}`,
            background: a.flagged ? "#F4ECD8" : colors_V05.paper,
            padding: "14px 16px", borderRadius: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                fontFamily: fonts.mono, fontSize: 11, color: a.flagged ? colors_V05.warnDeep : colors_V05.good,
                fontWeight: 600, letterSpacing: 0.4,
              }}>{a.id}</span>
              <span style={{
                fontFamily: fonts.mono, fontSize: 9, color: colors_V05.inkMute,
                letterSpacing: 0.5,
              }}>{a.time}</span>
            </div>
            <div style={{
              fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.ink, lineHeight: 1.55,
            }}>
              {a.fact}
            </div>
            {a.flagged && (
              <div style={{ marginTop: 8 }}>
                <span style={{
                  fontFamily: fonts.mono, fontSize: 9, color: colors_V05.warnDeep,
                  letterSpacing: 0.7, textTransform: "uppercase",
                }}>
                  ◆ Load-bearing for storyline differentiation
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------------
// LENS 3 — CONTRADICTIONS (matrix + detail panel)
// ----------------------------------------------------------------------------

function ContradictionsLens() {
  const matrixStorylines = STORYLINES_V05.filter(s => !s.excluded);  // α β′ ε ζ μ
  const [selectedId, setSelectedId] = useState("DE_judicial_vs_political");
  const selected = CONTRADICTIONS.find(c => c.id === selectedId);

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Contradictions matrix"
        title="Eight cross-cutting tensions"
        body="Each row is a contradiction the case must accommodate. Each column is a live storyline. Each cell answers: does this storyline absorb the contradiction cleanly, strain against it, break under it, center it, or remain silent?"
      />

      {/* Legend */}
      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 22, padding: "10px 16px",
        border: `1px solid ${colors_V05.ruleSoft}`, background: colors_V05.paperDeep, borderRadius: 2,
      }}>
        <LegendItem kind="absorbs" label="Absorbs cleanly" />
        <LegendItem kind="strains"  label="Strains" />
        <LegendItem kind="breaks"   label="Breaks the storyline" />
        <LegendItem kind="centers"  label="Centers (storyline's home)" />
        <LegendItem kind="neutral"  label="Neutral / does not engage" />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: 24, alignItems: "flex-start",
      }}>
        {/* Matrix */}
        <div style={{
          background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`, borderRadius: 2,
          overflow: "hidden",
        }}>
          {/* Column header — storyline glyphs */}
          <div style={{
            display: "grid", gridTemplateColumns: `minmax(0, 1.4fr) repeat(${matrixStorylines.length}, 56px)`,
            background: colors_V05.paperDeep, borderBottom: `1px solid ${colors_V05.rule}`,
          }}>
            <div style={{ padding: "12px 16px" }}>
              <MonoLabel size={9} letterSpacing={1}>Contradiction</MonoLabel>
            </div>
            {matrixStorylines.map(s => (
              <div key={s.id} style={{
                padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                borderLeft: `1px solid ${colors_V05.ruleSoft}`,
              }}>
                <span style={{
                  fontFamily: fonts.serif, fontStyle: "italic", fontSize: 16,
                  color: StorylineColor(s.id), fontWeight: 500, lineHeight: 1,
                }}>{s.glyph}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {CONTRADICTIONS.map((c, idx) => {
            const active = c.id === selectedId;
            return (
              <div key={c.id} onClick={() => setSelectedId(c.id)}
                style={{
                  display: "grid", gridTemplateColumns: `minmax(0, 1.4fr) repeat(${matrixStorylines.length}, 56px)`,
                  cursor: "pointer", background: active ? colors_V05.paperDeep : "transparent",
                  borderBottom: idx < CONTRADICTIONS.length - 1 ? `1px solid ${colors_V05.ruleSoft}` : "none",
                  transition: "background 0.12s",
                }}>
                <div style={{ padding: "14px 16px", borderLeft: active ? `3px solid ${colors_V05.primary}` : "3px solid transparent" }}>
                  <div style={{
                    fontFamily: fonts.serif, fontSize: 13.5, color: colors_V05.ink,
                    letterSpacing: -0.1, lineHeight: 1.35, marginBottom: 4, fontWeight: 400,
                  }}>
                    {c.title}
                  </div>
                  <MonoLabel size={8.5} letterSpacing={0.7} color={colors_V05.inkMute}>
                    {c.type}
                  </MonoLabel>
                </div>
                {matrixStorylines.map(s => {
                  const stance = s.contradictionStance[c.id] || "neutral";
                  return (
                    <div key={s.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderLeft: `1px solid ${colors_V05.ruleSoft}`,
                    }}>
                      <AbsorptionMark kind={stance} size={20} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right — selected contradiction detail */}
        {selected && <ContradictionDetailPanel c={selected} />}
      </div>
    </div>
  );
}

function LegendItem({ kind, label }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <AbsorptionMark kind={kind} size={16} />
      <span style={{
        fontFamily: fonts.mono, fontSize: 9.5, color: colors_V05.inkSoft,
        letterSpacing: 0.6, textTransform: "uppercase",
      }}>{label}</span>
    </div>
  );
}

function ContradictionDetailPanel({ c }) {
  const homeStory = STORYLINES_V05.find(s => s.id === c.bestAbsorbedBy);
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "24px 28px 26px", borderRadius: 2, position: "sticky", top: 80,
    }}>
      <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.primary} style={{ marginBottom: 8 }}>
        {c.type}
      </MonoLabel>
      <div style={{
        fontFamily: fonts.serif, fontStyle: "italic", fontSize: 21, color: colors_V05.ink,
        letterSpacing: -0.3, lineHeight: 1.25, marginBottom: 18,
      }}>
        {c.title}
      </div>

      {/* Two poles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {c.poles.map((p, i) => (
          <div key={i} style={{
            border: `1px solid ${colors_V05.ruleSoft}`, background: colors_V05.paperDeep,
            padding: "12px 14px", borderRadius: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.inkSoft}>
                {p.side}
              </MonoLabel>
              {p.evidence.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.evidence.map(eid => (
                    <span key={eid} style={{
                      fontFamily: fonts.mono, fontSize: 9, color: colors_V05.secondary,
                      padding: "1px 5px", border: `1px solid ${colors_V05.secondarySoft}`,
                      background: colors_V05.paper, borderRadius: 1, letterSpacing: 0.4,
                    }}>{eid}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{
              fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.ink, lineHeight: 1.5,
            }}>
              {p.position}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "12px 14px", background: colors_V05.paper,
        border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${colors_V05.primary}`,
        borderRadius: 2, marginBottom: 14,
      }}>
        <MonoLabel size={9} letterSpacing={1} style={{ marginBottom: 6 }}>
          Why these poles cannot both stand without explanation
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.55,
        }}>
          {c.why}
        </div>
      </div>

      {homeStory && (
        <div style={{
          padding: "12px 14px", background: colors_V05.paperDeep,
          border: `1px solid ${StorylineColor(homeStory.id)}`,
          borderRadius: 2, marginBottom: 14,
        }}>
          <MonoLabel size={9} letterSpacing={1} color={StorylineColor(homeStory.id)} style={{ marginBottom: 6 }}>
            Best absorbed by
          </MonoLabel>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18,
              color: StorylineColor(homeStory.id), fontWeight: 500,
            }}>{homeStory.glyph}</span>
            <span style={{
              fontFamily: fonts.serif, fontSize: 14, color: colors_V05.ink, fontStyle: "italic",
              lineHeight: 1.3,
            }}>{homeStory.shortLabel}</span>
          </div>
        </div>
      )}

      <div>
        <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.inkMute} style={{ marginBottom: 6 }}>
          Per-storyline notes
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.55, fontStyle: "italic",
        }}>
          {c.notes}
        </div>
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------------
// LENS 4 — REGISTER (5 patterns + inference firewall warning)
// ----------------------------------------------------------------------------

function RegisterLens() {
  const [view, setView] = useState("patterns");
  const subTabs = [
    { id: "patterns",   label: "Cross-cutting patterns", sub: "5 recurring register signatures" },
    { id: "ecosystems", label: "Ecosystem map",          sub: `${ECOSYSTEM_STATS.totalFactions} factions · ${ECOSYSTEM_STATS.totalEcosystems} languages` },
  ];

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Register lens"
        title="How institutions are speaking, not what they are saying"
        body="Register is positional evidence — patterns in how sources behave, not what they assert. It strengthens or strains storylines structurally. Register cannot ground a causal claim by itself."
      />

      {/* Inference firewall — v0.5 spec §1.2 */}
      <div style={{
        padding: "16px 20px", background: "#F4ECD8", border: `1px solid #D4B870`,
        borderLeft: `3px solid ${colors_V05.warn}`, borderRadius: 2, marginBottom: 22,
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <span style={{
          fontFamily: fonts.mono, fontSize: 18, color: colors_V05.warnDeep, lineHeight: 1, marginTop: 1,
        }}>⚠</span>
        <div>
          <MonoLabel color={colors_V05.warnDeep} size={9.5} letterSpacing={1} style={{ marginBottom: 5 }}>
            Inference firewall · spec §1.2
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.6,
          }}>
            Register patterns DO NOT, by themselves, establish authorship, intent, or motive. They establish that an institution's behavior diverges from its baseline — which is information. Causal-layer claims must be grounded in causal-layer evidence (Anchors, Evidence Ledger). Use register as a check on storyline coherence, never as primary support.
          </div>
        </div>
      </div>

      {/* Sub-tab nav */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 26,
        borderBottom: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        {subTabs.map(t => {
          const active = t.id === view;
          return (
            <button key={t.id} onClick={() => setView(t.id)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "10px 18px 12px",
                borderBottom: active ? `2px solid ${colors_V05.warn}` : "2px solid transparent",
                marginBottom: -1, textAlign: "left", transition: "all 0.15s",
              }}>
              <div style={{
                fontFamily: fonts.serif, fontStyle: "italic", fontSize: 15,
                color: active ? colors_V05.ink : colors_V05.inkSoft, fontWeight: 400,
                letterSpacing: -0.15, lineHeight: 1.2, marginBottom: 2,
              }}>{t.label}</div>
              <MonoLabel size={9} letterSpacing={0.6} color={active ? colors_V05.warnDeep : colors_V05.inkMute}>
                {t.sub}
              </MonoLabel>
            </button>
          );
        })}
      </div>

      {view === "patterns"   && <RegisterPatternsView />}
      {view === "ecosystems" && <EcosystemMapView />}
    </div>
  );
}

function RegisterPatternsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {REGISTER_PATTERNS.map(rp => (
        <RegisterPatternCard key={rp.id} rp={rp} />
      ))}
    </div>
  );
}

function RegisterPatternCard({ rp }) {
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "22px 26px 24px", borderRadius: 2,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.primary}>
              {rp.id}
            </MonoLabel>
            <MonoLabel size={9} letterSpacing={0.7} color={colors_V05.inkMute}>
              {rp.locus}
            </MonoLabel>
          </div>
          <div style={{
            fontFamily: fonts.serif, fontStyle: "italic", fontSize: 19, color: colors_V05.ink,
            letterSpacing: -0.25, lineHeight: 1.25,
          }}>
            {rp.title}
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 260 }}>
          {rp.relevantTo.map(sid => (
            <span key={sid} style={{
              fontFamily: fonts.mono, fontSize: 9, color: StorylineColor(sid),
              padding: "2px 6px", border: `1px solid ${StorylineColor(sid)}`,
              background: colors_V05.paper, borderRadius: 1, letterSpacing: 0.4, fontWeight: 500,
            }}>{StorylineGlyph(sid)} · {STORYLINES_V05.find(s => s.id === sid)?.shortLabel.split(" · ")[0]}</span>
          ))}
        </div>
      </div>

      <div style={{
        fontFamily: fonts.sans, fontSize: 13, color: colors_V05.inkSoft,
        lineHeight: 1.6, marginBottom: 16,
      }}>
        {rp.description}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        paddingTop: 14, borderTop: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        <div style={{
          padding: "12px 14px", background: "#E8EDE0",
          border: `1px solid ${colors_V05.goodSoft}`, borderRadius: 2,
        }}>
          <MonoLabel color={colors_V05.good} size={9} letterSpacing={1} style={{ marginBottom: 6 }}>
            What it only shows
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.55,
          }}>
            {rp.onlyShows}
          </div>
        </div>
        <div style={{
          padding: "12px 14px", background: "#F4ECD8",
          border: `1px solid #D4B870`, borderRadius: 2,
        }}>
          <MonoLabel color={colors_V05.warnDeep} size={9} letterSpacing={1} style={{ marginBottom: 6 }}>
            What it does not show
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.55,
          }}>
            {rp.doesNotShow}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.inkMute} style={{ marginBottom: 6 }}>
          Sources observed
        </MonoLabel>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {rp.sources.map((src, i) => (
            <span key={i} style={{
              fontFamily: fonts.mono, fontSize: 9.5, color: colors_V05.inkSoft,
              padding: "2px 6px", background: colors_V05.paperDeep, border: `1px solid ${colors_V05.ruleSoft}`,
              borderRadius: 1, letterSpacing: 0.4,
            }}>{src}</span>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// AUDIT MODE — three sub-tabs: Timeline · Provenance · Briefing
// ============================================================================

function AuditMode() {
  const [tab, setTab] = useState("timeline");

  const tabs = [
    { id: "timeline",   label: "Timeline",   sub: "Events + evidence publication" },
    { id: "provenance", label: "Provenance", sub: "Source clusters · correlation risk" },
    { id: "briefing",   label: "Briefing",   sub: "Export-ready memos" },
  ];

  return (
    <div style={{ padding: "32px 32px 0" }}>
      <div style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${colors_V05.rule}`, marginBottom: 32,
      }}>
        {tabs.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "16px 22px 14px",
                borderBottom: active ? `2px solid ${colors_V05.primary}` : "2px solid transparent",
                marginBottom: -1, textAlign: "left", transition: "all 0.15s",
              }}>
              <div style={{
                fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18,
                color: active ? colors_V05.ink : colors_V05.inkSoft, fontWeight: 400,
                letterSpacing: -0.2, lineHeight: 1.2, marginBottom: 4,
              }}>{t.label}</div>
              <MonoLabel size={9} letterSpacing={0.7} color={active ? colors_V05.primary : colors_V05.inkMute}>
                {t.sub}
              </MonoLabel>
            </button>
          );
        })}
      </div>

      {tab === "timeline"   && <TimelineTab />}
      {tab === "provenance" && <ProvenanceTab />}
      {tab === "briefing"   && <BriefingTab />}

      <VersionChangelog />
    </div>
  );
}

// ----------------------------------------------------------------------------
// AUDIT TAB 1 — TIMELINE
// ----------------------------------------------------------------------------

function TimelineTab() {
  // Build a chronological merged timeline of anchors + evidence
  const items = useMemo(() => {
    const norm = (d) => {
      // For anchors, time field can be a date or a phrase. We treat phrased
      // anchors (e.g. "Physical anomaly") as undated meta — they're surfaced
      // separately, not on the timeline ribbon.
      if (!d) return null;
      const m = d.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
      if (!m) return null;
      const y = parseInt(m[1], 10);
      const mo = m[2] ? parseInt(m[2], 10) : 6;
      const da = m[3] ? parseInt(m[3], 10) : 15;
      return new Date(Date.UTC(y, mo - 1, da)).getTime();
    };
    const a = ANCHORS_V05
      .map(x => ({ kind: "anchor", id: x.id, date: x.time, ts: norm(x.time), label: x.fact, flagged: x.flagged }))
      .filter(x => x.ts !== null);
    const e = EVIDENCE
      .map(x => ({ kind: "evidence", id: x.id, date: x.date, ts: norm(x.date), label: x.label, type: x.type, lang: x.language }))
      .filter(x => x.ts !== null);
    return [...a, ...e].sort((p, q) => p.ts - q.ts);
  }, []);

  // Group by year-quarter
  const grouped = useMemo(() => {
    const out = {};
    items.forEach(it => {
      const d = new Date(it.ts);
      const y = d.getUTCFullYear();
      const q = Math.floor(d.getUTCMonth() / 3) + 1;
      const key = `${y}-Q${q}`;
      if (!out[key]) out[key] = [];
      out[key].push(it);
    });
    return out;
  }, [items]);

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Timeline"
        title="When facts entered the record"
        body="Two streams interleaved: anchored facts from the event itself, and evidence as it was published. The gap between an event and the evidence about it is itself part of the case."
      />

      <div style={{
        background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
        padding: "26px 30px 28px", borderRadius: 2,
      }}>
        {Object.entries(grouped).map(([key, group], i) => (
          <div key={key} style={{
            display: "grid", gridTemplateColumns: "100px 1fr", gap: 22,
            paddingBottom: i < Object.keys(grouped).length - 1 ? 22 : 0,
            marginBottom: i < Object.keys(grouped).length - 1 ? 22 : 0,
            borderBottom: i < Object.keys(grouped).length - 1 ? `1px dashed ${colors_V05.ruleSoft}` : "none",
          }}>
            <div>
              <MonoLabel size={11} letterSpacing={1.2} color={colors_V05.primary}>
                {key}
              </MonoLabel>
              <MonoLabel size={9} letterSpacing={0.6} color={colors_V05.inkMute} style={{ marginTop: 4 }}>
                {group.length} {group.length === 1 ? "item" : "items"}
              </MonoLabel>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {group.map(it => (
                <div key={`${it.kind}-${it.id}`} style={{
                  display: "grid", gridTemplateColumns: "auto 80px 1fr", gap: 12, alignItems: "baseline",
                  paddingBottom: 6, borderBottom: `1px dotted ${colors_V05.ruleSoft}`,
                }}>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 10,
                    color: it.kind === "anchor" ? colors_V05.good : colors_V05.secondary,
                    fontWeight: 600, letterSpacing: 0.5,
                    padding: "1px 5px",
                    background: it.kind === "anchor" ? "#E8EDE0" : "#E4ECF4",
                    border: `1px solid ${it.kind === "anchor" ? colors_V05.goodSoft : colors_V05.secondarySoft}`,
                    borderRadius: 1,
                    minWidth: 36, textAlign: "center",
                  }}>{it.id}</span>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 9.5, color: colors_V05.inkMute,
                    letterSpacing: 0.4,
                  }}>{it.date}</span>
                  <span style={{
                    fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.ink, lineHeight: 1.45,
                  }}>{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, padding: "12px 16px", border: `1px dashed ${colors_V05.ruleSoft}`,
        background: colors_V05.paperDeep, borderRadius: 2,
        fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkMute, lineHeight: 1.55,
      }}>
        Note: F3 (17-hour gap) and F12 (intact fourth strand) are physical anomalies, not dated events — they are anchored facts about the operation's structure rather than items on the publication timeline. See Examine → Claim Map → S1 for their role.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// AUDIT TAB 2 — PROVENANCE
// ----------------------------------------------------------------------------

function ProvenanceTab() {
  const clusters = useMemo(() => {
    const groups = {
      western_intel_leaks: {
        name: "Western intelligence leaks",
        risk: "high",
        note: "Discord-leak-derived narratives (E3/E4/E5) plus WSJ-Spiegel-Bellingcat reporting (E11). Likely correlated through overlapping Western intelligence sourcing. Cluster-dampened in distribution.",
        members: EVIDENCE.filter(e => e.cluster === "western_intel_leaks"),
      },
      german_judicial: {
        name: "German judicial trail",
        risk: "low",
        note: "BGH ruling and prosecutorial actions are independently sourced from court records. Judicial procedure is itself a check on cluster correlation.",
        members: EVIDENCE.filter(e => e.cluster === "german_judicial"),
      },
      coverage_meta: {
        name: "Coverage / institutional non-resolution",
        risk: "low",
        note: "Each item documents a separate institutional non-action. Independent across jurisdictions. Pattern emerges only on aggregation (μ).",
        members: EVIDENCE.filter(e => e.cluster === "coverage_meta"),
      },
      russian_state: {
        name: "Russian state outlets",
        risk: "high",
        note: "Adversarial sourcing. Content credibility bounded; event credibility (the statement was made) preserved.",
        members: EVIDENCE.filter(e => e.cluster === "russian_state"),
      },
      single_source: {
        name: "Single-source narratives",
        risk: "high",
        note: "Hersh's account stands or falls on one anonymous source. Specific mechanism is structurally refuted; broader Western-coordination question is preserved in β′.",
        members: EVIDENCE.filter(e => e.cluster === "single_source"),
      },
    };
    return Object.entries(groups);
  }, []);

  const unclustered = EVIDENCE.filter(e => !e.cluster);

  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Provenance"
        title="Source clusters and correlation risk"
        body="Two evidence items from the same ecosystem are not two votes — they are one signal. The provenance audit identifies clusters whose contributions must be dampened in aggregation, and flags adversarial sourcing where event-credibility and content-credibility diverge."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {clusters.map(([key, c]) => (
          <ProvenanceClusterCard key={key} c={c} />
        ))}

        {/* Independent evidence */}
        <div style={{
          background: colors_V05.paper, border: `1px solid ${colors_V05.ruleSoft}`,
          padding: "18px 22px 20px", borderRadius: 2,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <MonoLabel size={10} letterSpacing={1.2} color={colors_V05.good}>
              Independently sourced · {unclustered.length} records
            </MonoLabel>
            <Tag_V05 tone="good">low correlation risk</Tag_V05>
          </div>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.55, marginBottom: 12,
          }}>
            These items do not share a common originating source layer. Convergence among them is signal, not echo.
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {unclustered.map(e => <EvidencePill key={e.id} eid={e.id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvenanceClusterCard({ c }) {
  const riskTone = c.risk === "high" ? { fg: colors_V05.warnDeep, bg: "#F4ECD8", bd: "#D4B870", label: "Cluster-dampened in distribution" }
                                     : { fg: colors_V05.good,     bg: "#E8EDE0", bd: colors_V05.goodSoft, label: "Independent within cluster" };
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${riskTone.bd}`,
      borderLeft: `3px solid ${riskTone.fg}`,
      padding: "18px 22px 20px", borderRadius: 2,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <MonoLabel size={10} letterSpacing={1.2} color={riskTone.fg}>
          {c.name} · {c.members.length} {c.members.length === 1 ? "record" : "records"}
        </MonoLabel>
        <span style={{
          fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase",
          color: riskTone.fg, background: riskTone.bg, border: `1px solid ${riskTone.bd}`,
          padding: "3px 8px", borderRadius: 1, fontWeight: 500,
        }}>{riskTone.label}</span>
      </div>
      <div style={{
        fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.55, marginBottom: 12,
      }}>{c.note}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {c.members.map(e => <EvidencePill key={e.id} eid={e.id} />)}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// AUDIT TAB 3 — BRIEFING (1 full Analyst memo + 3 placeholders)
// ----------------------------------------------------------------------------

function BriefingTab() {
  return (
    <div>
      <SectionHeading
        dense
        eyebrow="Briefing"
        title="Export-ready memos"
        body="Trace synthesizes the case file into format-specific briefings. The Analyst memo below is rendered in full; three other formats are available in the workspace tier."
      />

      <AnalystMemo />

      <div style={{ marginTop: 32 }}>
        <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.inkMute} style={{ marginBottom: 14 }}>
          Other formats — workspace tier
        </MonoLabel>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14,
        }}>
          <PlaceholderBriefing
            label="Reader brief"
            tagline="5-minute version for a non-specialist audience"
            sketch={[
              "Current Understanding (one paragraph)",
              "α / β′ / ε / ζ / μ in one sentence each",
              "What we don't know — three pinned items",
              "How to read this exhibit (50 words)",
            ]}
          />
          <PlaceholderBriefing
            label="Legal brief"
            tagline="Issue / claim / evidence / contradictions / burden"
            sketch={[
              "Issue framing — attribution under disputed jurisdiction",
              "Per-claim evidence inventory",
              "Per-claim contradictions and resolutions",
              "Burden-of-proof analysis",
              "Outstanding evidentiary gaps",
            ]}
          />
          <PlaceholderBriefing
            label="Source audit appendix"
            tagline="Provenance, correlation, register confidence per record"
            sketch={[
              "All 37 evidence records with full audit fields",
              "Cluster correlation analysis",
              "Register-confidence per record",
              "Independence graph",
              "Methodology notes",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function PlaceholderBriefing({ label, tagline, sketch }) {
  return (
    <div style={{
      background: colors_V05.paperDeep, border: `1px dashed ${colors_V05.rule}`,
      padding: "20px 22px 22px", borderRadius: 2,
    }}>
      <div style={{
        fontFamily: fonts.serif, fontStyle: "italic", fontSize: 17, color: colors_V05.ink,
        letterSpacing: -0.2, lineHeight: 1.2, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.5,
        marginBottom: 14,
      }}>
        {tagline}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {sketch.map((s, i) => (
          <li key={i} style={{
            fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkMute,
            lineHeight: 1.5, paddingLeft: 12, position: "relative", marginBottom: 4,
          }}>
            <span style={{ position: "absolute", left: 0, top: 8, width: 5, height: 1, background: colors_V05.muted }} />
            {s}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${colors_V05.rule}` }}>
        <Tag_V05 tone="mute">Available in workspace tier</Tag_V05>
      </div>
    </div>
  );
}

function AnalystMemo() {
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.ink}`,
      padding: "36px 44px 40px", borderRadius: 2,
    }}>
      {/* Letterhead */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        paddingBottom: 16, borderBottom: `1px solid ${colors_V05.ink}`, marginBottom: 28,
      }}>
        <div>
          <MonoLabel size={9.5} letterSpacing={1.4} color={colors_V05.primary} style={{ marginBottom: 8 }}>
            Analyst memo · Trace claim file {CASE_META.id} · {CASE_META.version}
          </MonoLabel>
          <div style={{
            fontFamily: fonts.serif, fontStyle: "italic", fontSize: 26, color: colors_V05.ink,
            letterSpacing: -0.4, lineHeight: 1.2,
          }}>
            Nord Stream attribution · structured reading
          </div>
        </div>
        <MonoLabel size={9.5} letterSpacing={0.8} color={colors_V05.inkMute}>
          {CASE_META.lastUpdated}
        </MonoLabel>
      </div>

      {/* BLUF */}
      <MemoSection
        eyebrow="Bottom line up front"
        body={[
          "Three years on, the case has converged on structure but has not closed on identity. The leading reconstruction (α, 70% attribution coverage) is a Ukrainian military-command operation conducted via the Zaluzhnyi track after presidential approval was withdrawn, with Polish post-facto protection and US prior awareness that did not foreclose. This is the only live storyline that simultaneously absorbs the Andromeda forensic chain, the December 2025 BGH ruling, the Polish refusal to execute the German EAW, the Italian Cassazione transfers, and the documented June 2022 CIA warning to Germany.",
          "α is not a verdict. Three storylines remain live: β′ (wider Western coordination, 5%), ε (declared blind spot for unenumerated configurations, 19%), and ζ (UK question, under-examined, 6%). A separate process subclaim (μ) holds the question of why five jurisdictions and one international body have chosen non-advancement.",
        ]}
      />

      {/* Strongest argument */}
      <MemoSection
        eyebrow="Why α leads"
        body={[
          "α uniquely reconciles three otherwise awkward facts. First: the Andromeda forensic trail (HMX residue, DNA, fingerprints, forged identity papers, 70-80m operational depth) points to a Ukrainian-linked execution layer at small operational scale — not a US Navy or state-navy professional operation. Second: the CIA's June 2022 warning to Germany via the Dutch MIVD chain implies prior knowledge, not surprise — and was followed by no foreclosure. Third: Poland's refusal to execute the German EAW, the Italian Cassazione's three-step transfer, and the BGH's December 2025 ruling that the operation was 'with high probability an intelligence-agency action ordered by a foreign government' cohere only if Ukrainian state-linked authorship is the operative frame.",
          "α's least-documented link is the command-authorization layer. Spiegel 2026 (Zaluzhnyi approved) and Il Fatto 2025 (Zelensky approved-then-withdrew under US pressure, Zaluzhnyi continued) are testimonial, not documentary. Hanning's Die Welt testimony naming Polish authorization and 'both presidents' is T1-level ex-officer credibility but its evidentiary base is not public. The Zaluzhnyi-bypass framing α prefers reconciles the WSJ-Spiegel narrative split via temporal sequencing — but the reconciliation is plausible, not anchored.",
        ]}
      />

      {/* Storyline comparison */}
      <MemoSection
        eyebrow="Live storylines, briefly"
        body={[]}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STORYLINES_V05.filter(s => !s.excluded).map(s => (
            <MemoStorylineRow key={s.id} s={s} />
          ))}
        </div>
      </MemoSection>

      {/* Contradictions to track */}
      <MemoSection
        eyebrow="Three contradictions to track"
        body={[]}
      >
        <ol style={{ margin: 0, paddingLeft: 22, color: colors_V05.inkSoft }}>
          {[
            { c: CONTRADICTIONS.find(x => x.id === "DE_judicial_vs_political"),
              note: "The German judiciary advances; the German executive suppresses. The split is itself part of the case. μ centers it; α absorbs as 'judicial layer signals what political layer cannot'." },
            { c: CONTRADICTIONS.find(x => x.id === "wsj_vs_spiegel"),
              note: "WSJ 2024 (Zaluzhnyi knew) and Spiegel 2026 (Zelensky uninformed) appear contradictory. Il Fatto's temporal-split reading reconciles them — α absorbs cleanly, β′ strains." },
            { c: CONTRADICTIONS.find(x => x.id === "andromeda_vs_state_navy"),
              note: "Andromeda forensics evidence a real state-grade-equipped team. Operational signature evidences a resource-constrained execution. The combination matches state-enabled but not state-executed — α's principal structural prediction." },
          ].map((row, i) => (
            <li key={i} style={{
              fontFamily: fonts.sans, fontSize: 13, lineHeight: 1.6, marginBottom: 12,
            }}>
              <strong style={{ color: colors_V05.ink, fontWeight: 600 }}>{row.c.title}</strong>
              <div style={{ marginTop: 4 }}>{row.note}</div>
            </li>
          ))}
        </ol>
      </MemoSection>

      {/* Watchlist */}
      <MemoSection
        eyebrow="Watchlist · what would shift the reading"
        body={[]}
      >
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {LOAD_BEARING_UNKNOWNS.changeLeading.items.map((item, i) => (
            <li key={i} style={{
              fontFamily: fonts.sans, fontSize: 13, lineHeight: 1.55, marginBottom: 10,
              paddingLeft: 16, position: "relative", color: colors_V05.inkSoft,
            }}>
              <span style={{
                position: "absolute", left: 0, top: 9, width: 8, height: 1, background: colors_V05.primary,
              }} />
              <span style={{
                fontFamily: fonts.serif, fontStyle: "italic", fontSize: 13.5, color: colors_V05.ink,
              }}>{item.q}</span>{" "}
              — would shift {item.wouldShift}.
            </li>
          ))}
        </ul>
      </MemoSection>

      {/* Coda */}
      <div style={{
        marginTop: 28, paddingTop: 18, borderTop: `1px solid ${colors_V05.rule}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap",
      }}>
        <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.inkMute}>
          Trace · Not a verdict · A structured reading the surviving evidence makes most coherent
        </MonoLabel>
        <MonoLabel size={9} letterSpacing={0.9} color={colors_V05.inkMute}>
          37 evidence · 13 anchors · 14 languages · 5 jurisdictions
        </MonoLabel>
      </div>
    </div>
  );
}

function MemoSection({ eyebrow, body, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <MonoLabel size={9.5} letterSpacing={1.2} color={colors_V05.primary} style={{ marginBottom: 12 }}>
        {eyebrow}
      </MonoLabel>
      {body.map((para, i) => (
        <p key={i} style={{
          fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 1.7, color: colors_V05.ink,
          margin: i === body.length - 1 ? 0 : "0 0 12px 0",
        }}>
          {para}
        </p>
      ))}
      {children}
    </div>
  );
}

function MemoStorylineRow({ s }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto auto 1fr auto", gap: 14, alignItems: "baseline",
      paddingBottom: 8, borderBottom: `1px dotted ${colors_V05.ruleSoft}`,
    }}>
      <span style={{
        fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18,
        color: StorylineColor(s.id), fontWeight: 500, lineHeight: 1, minWidth: 22,
      }}>{s.glyph}</span>
      <CoverageDisplay value={s.coverage} color={StorylineColor(s.id)} />
      <div>
        <div style={{
          fontFamily: fonts.serif, fontSize: 14, color: colors_V05.ink, fontStyle: "italic",
          letterSpacing: -0.15, lineHeight: 1.3, marginBottom: 3,
        }}>{s.label}</div>
        <div style={{
          fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.45,
        }}>
          {s.strongestArgument.headline}
        </div>
      </div>
      {s.isSubclaim && <Tag_V05 tone="warn">Subclaim</Tag_V05>}
    </div>
  );
}


// ============================================================================
// VERSION CHANGELOG (rendered at bottom of AUDIT)
// ============================================================================

function VersionChangelog() {
  return (
    <div style={{ marginTop: 56 }}>
      <SectionHeading
        dense
        eyebrow="Versioning"
        title="What has changed across versions"
        body="Trace surfaces version history because revising the candidate set is part of being right. Hidden updates would degrade trust; visible updates compound it."
      />
      <div style={{
        background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
        borderRadius: 2, padding: "26px 30px 28px",
      }}>
        {CHANGELOG.map((c, i) => (
          <div key={c.version} style={{
            display: "grid", gridTemplateColumns: "120px 1fr", gap: 24,
            paddingBottom: i < CHANGELOG.length - 1 ? 22 : 0,
            marginBottom: i < CHANGELOG.length - 1 ? 22 : 0,
            borderBottom: i < CHANGELOG.length - 1 ? `1px dashed ${colors_V05.ruleSoft}` : "none",
          }}>
            <div>
              <div style={{
                fontFamily: fonts.serif, fontStyle: "italic", fontSize: 22,
                color: i === CHANGELOG.length - 1 ? colors_V05.primary : colors_V05.ink, fontWeight: 400,
                letterSpacing: -0.3, lineHeight: 1, marginBottom: 4,
              }}>
                {c.version}
              </div>
              <MonoLabel size={9} letterSpacing={0.7} color={colors_V05.inkMute}>
                {c.date}
              </MonoLabel>
            </div>
            <div>
              <div style={{
                fontFamily: fonts.serif, fontSize: 16, color: colors_V05.ink,
                letterSpacing: -0.2, lineHeight: 1.3, marginBottom: 10,
              }}>{c.title}</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {c.notes.map((n, j) => (
                  <li key={j} style={{
                    fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft,
                    lineHeight: 1.55, paddingLeft: 14, position: "relative", marginBottom: 5,
                  }}>
                    <span style={{
                      position: "absolute", left: 0, top: 8, width: 6, height: 1,
                      background: i === CHANGELOG.length - 1 ? colors_V05.primary : colors_V05.muted,
                    }} />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================================
// MAIN APP
// ============================================================================

function TraceCaseFileV05() {
  const [mode, setMode] = useState("READ");

  // Inject Google Fonts once at mount
  useEffect(() => {
    const id = "trace-fonts-v05";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <ModeShell mode={mode} setMode={setMode}>
      {mode === "READ"    && <ReadMode />}
      {mode === "EXAMINE" && <ExamineMode />}
      {mode === "AUDIT"   && <AuditMode />}
    </ModeShell>
  );
}


// ============================================================================
// ECOSYSTEMS — per-language positional data
//   14 language ecosystems × 1–4 factions each = 30 faction-level points
//
// Each faction carries:
//   · Frame coordinates (x: US-attribution → Russia-attribution;
//                        y: accepts-mainstream → rejects-mainstream)
//   · Victim category + intensity + moral frame + epistemic posture
//   · Register profile (certainty + affect + diagnostic markers)
//   · Baseline (predicted technique) · Observed · Deviation level (fit)
//   · Why-it-matters meta-implication
//
// Inference firewall (spec §1.2): register / baseline-deviation analysis is
// positional evidence. It maps how an ecosystem speaks, not what is true.
// ============================================================================

const ECOSYSTEMS = [
  {
    id: "en", flag: "🇬🇧🇺🇸", name: "English", longName: "English-language press",
    factions: [
      {
        id: "en-main", label: "Mainstream (WSJ/NYT/WaPo)", kind: "main",
        frame: { x: 70, y: 26, victim: "C3", victimIntensity: 0.4, moral: "B2", posture: "D1" },
        drift: { fromX: 82, fromY: 18, dx: -12, dy: 8 },
        register: {
          certainty: "neutral", affect: "distance",
          markers: ["according to people familiar", "what authorities described as", "a plan hatched over drinks"],
        },
        baseline: "Anglo investigative outlets default to extensive hedging, passive constructions, and sourced-to-officials framing on contested attribution stories.",
        observed: "Standard normalization register. Even when scoop-level Ukrainian-attribution evidence is delivered, the editorial register stays uniformly cool and procedural.",
        deviation: { level: "low", direction: "baseline-typical; no deviation from Anglo investigative norm", fit: "strong" },
        whyMatters: "Low deviation IS the diagnostic. The register signals an editorial position that consequences-questions ('why no sanctions on a treaty ally?') should not be triggered. Normalization here equals non-pursuit.",
      },
      {
        id: "en-hersh", label: "Hersh (single-source)", kind: "single",
        frame: { x: 8, y: 86, victim: "C1", victimIntensity: 0.85, moral: "B3", posture: "D3" },
        register: {
          certainty: "affirmative", affect: "indignation",
          markers: ["The U.S. Navy's Diving and Salvage Center", "blockbuster", "deep state"],
        },
        baseline: "Hersh's career baseline on US covert operations is high-drama investigative + open moral indignation.",
        observed: "Standard Hersh dramatization register. Cinematic opening, single-anonymous-source structure, full moral framing.",
        deviation: { level: "low", direction: "no deviation against Hersh's own baseline; high contrast against Anglo-mainstream baseline", fit: "strong vs self / weak vs ecosystem" },
        whyMatters: "Hersh consciously refuses the mainstream normalization register. The contrast itself is positional — he occupies the role 'the one who will dramatize when mainstream won't.' Distinct from being right.",
      },
      {
        id: "en-factcheck", label: "Fact-checkers (Snopes etc.)", kind: "alt",
        frame: { x: 72, y: 22, victim: "C3", victimIntensity: 0.35, moral: "B2", posture: "D1" },
        register: {
          certainty: "ironic", affect: "mockery",
          markers: ["blockbuster revelation", "fantastical claims", "no evidence has emerged"],
        },
        baseline: "Mainstream fact-check outlets default to detached neutrality on contested claims.",
        observed: "Pointed irony toward Hersh's specifically; light dismissal posture beyond bare-facts review.",
        deviation: { level: "medium", direction: "from neutral fact-review toward register-mocking the source", fit: "moderate" },
        whyMatters: "Register dismissal of a single source is a position move, not a fact-check operation. It signals which sources are inside vs outside the legitimacy boundary the fact-check operates within.",
      },
    ],
  },

  {
    id: "zh", flag: "🇨🇳", name: "Chinese", longName: "Chinese state press",
    factions: [
      {
        id: "zh-party", label: "Party-state (Xinhua / People's Daily / 观察者网)", kind: "main",
        frame: { x: 14, y: 80, victim: "C1", victimIntensity: 0.85, moral: "B1", posture: "D3" },
        drift: { fromX: 24, fromY: 62, dx: -10, dy: 18 },
        register: {
          certainty: "ironic", affect: "suspicion",
          markers: ["谁从中获益?", "集体沉默", "西方学者也指出", "某些国家"],
        },
        baseline: "Chinese party-state media default to neutral-reportorial register on geopolitical attribution, with occasional indirect editorial alignment via selective amplification.",
        observed: "Sustained meta-observation register: the framing places adversary statements (Sikorski's 'thank you', UNSC abstentions, Sachs's testimony) into juxtaposition without explicit editorial attribution.",
        deviation: { level: "medium", direction: "from baseline neutral-amplification toward systematic suggestive juxtaposition; the omitted editorial is itself positional", fit: "moderate" },
        whyMatters: "The register encodes a Confucian 'silence as stance' rhetorical resource — 'we don't say who, but observe who is silent.' Outsourcing attribution to the reader while structuring what they read.",
      },
    ],
  },

  {
    id: "ru", flag: "🇷🇺", name: "Russian", longName: "Russian-language press",
    factions: [
      {
        id: "ru-state", label: "State (RT / TASS / SVR)", kind: "main",
        frame: { x: 9, y: 85, victim: "C1", victimIntensity: 1.0, moral: "B1", posture: "D3" },
        drift: { fromX: 14, fromY: 74, dx: -5, dy: 11 },
        register: {
          certainty: "affirmative", affect: "indignation",
          markers: ["располагаем достоверной информацией", "fantastical", "bizarro", "utterly false"],
        },
        baseline: "Russian state media on adversarial Western attribution stories defaults to indignant-victim register with intelligence-authority syntax.",
        observed: "Naryshkin formal accusation deploys court-document syntax — register-of-authority designed to manufacture credibility against the bounded content credibility of an adversarial source.",
        deviation: { level: "low", direction: "no deviation from baseline state-media indignation register", fit: "strong" },
        whyMatters: "Low deviation marks this as boilerplate — the register tells us what register the Russian state media chose, not what it knows. Adversarial-source baseline applies; content-credibility bounded by structural position.",
      },
      {
        id: "ru-exile", label: "Exile (Meduza)", kind: "alt",
        frame: { x: 58, y: 42, victim: "C4", victimIntensity: 0.55, moral: "B3", posture: "D2" },
        register: {
          certainty: "neutral", affect: "distance",
          markers: ["officially never confirmed", "according to Western reporting", "no Russian-language source independently corroborates"],
        },
        baseline: "Exile Russian-language outlets curate distance from both Kremlin narrative and Western mainstream — the 'only credible Russian voice' positioning.",
        observed: "Maintained academic-distance register on Zaluzhnyi line. Reports Western findings without amplification; refuses Kremlin counter-narrative.",
        deviation: { level: "low", direction: "consistent with exile-media positioning baseline", fit: "strong" },
        whyMatters: "Register-distance from BOTH ecosystems is itself a structural position. Meduza's existence as a credible Russian-language alternative depends on this dual refusal — register protects identity, not just neutrality.",
      },
    ],
  },

  {
    id: "de", flag: "🇩🇪", name: "German", longName: "German-language ecosystem (most register-split)",
    factions: [
      {
        id: "de-judicial", label: "Judiciary (BGH / Generalbundesanwaltschaft)", kind: "judicial",
        frame: { x: 58, y: 18, victim: "C2", victimIntensity: 0.55, moral: "B1", posture: "D1" },
        register: {
          certainty: "evasive", affect: "procedural_coldness",
          markers: ["mit hoher Wahrscheinlichkeit", "ausländische Geheimdienste", "fremde Regierung", "nicht zu benennen"],
        },
        baseline: "German high courts on state-secrecy-adjacent rulings default to procedural retreat — refusal to name, refusal to advance, technical-evidentiary minimum.",
        observed: "STRUCTURALLY assertive (foreign-government-intelligence finding crosses category threshold); POLITICALLY evasive (refuses to name the foreign government). Dual-aspect register.",
        deviation: { level: "high", direction: "from procedural-retreat baseline toward category-crossing assertion while keeping naming threshold", fit: "weak" },
        whyMatters: "The register itself encodes the case's structure: BGH crossed its evidentiary threshold; it did not cross its political-naming threshold. The gap between 'foreign government' (asserted) and the specific government (withheld) is positional information of the highest density.",
      },
      {
        id: "de-government", label: "Government (Kanzleramt / Schmidt)", kind: "government",
        frame: { x: 72, y: 24, victim: "C3", victimIntensity: 0.35, moral: "B1", posture: "D1" },
        register: {
          certainty: "evasive", affect: "procedural_coldness",
          markers: ["Wohl der Bundesrepublik", "Third Party Rule", "aus staatswohl Gründen"],
        },
        baseline: "German Chancellor's Office defaults to diplomatic-procedural register on intelligence matters; refusal-to-answer is by formula, not silence.",
        observed: "Maximal procedural coldness. Bundestag inquiry blocked via Third Party Rule. AfD parliamentary question refused 'for reasons of state welfare' without further response.",
        deviation: { level: "low", direction: "baseline-typical procedural register; the act of invocation, not the language, is the signal", fit: "strong" },
        whyMatters: "Low register deviation but high act-frequency. The Kanzleramt is doing exactly what it normally does — but doing it more, on this case. The repetition is the position.",
      },
      {
        id: "de-mainstream", label: "Mainstream investigative (Die Zeit / SZ / ARD)", kind: "main",
        frame: { x: 40, y: 46, victim: "C2", victimIntensity: 0.95, moral: "B3", posture: "D2" },
        drift: { fromX: 76, fromY: 22, dx: -36, dy: 24 },
        register: {
          certainty: "neutral", affect: "anxiety",
          markers: ["bemerkenswert", "auffällig", "die Frage drängt sich auf", "Deutschland war mitschweigend"],
        },
        baseline: "German mainstream investigative outlets default to thorough-documentary register with hedged moral framing.",
        observed: "Documentary thoroughness preserved; victim-frame migrated from C3 (Ukraine-frontline) to C2 (Europe-as-collateral). Implicit-anxiety markers ('bemerkenswert') flag political anomaly.",
        deviation: { level: "high", direction: "from default neutral-Europe baseline toward sustained 'Germany was complicit in silence' framing", fit: "weak" },
        whyMatters: "The drift is structural: the question moved from 'who did it' (settled at Ukraine) to 'who was hurt' (Europe, with Germany as silent participant). The register migrated to host the victim-frame shift.",
      },
      {
        id: "de-alt", label: "Alt-media (Multipolar / NachDenkSeiten / Hintergrund)", kind: "alt",
        frame: { x: 20, y: 63, victim: "C2", victimIntensity: 0.95, moral: "B1", posture: "D3" },
        drift: { fromX: 38, fromY: 54, dx: -18, dy: 9 },
        register: {
          certainty: "adversarial", affect: "indignation",
          markers: ["simuliert", "verwesender Körper des einstigen Rechtsstaats", "Vasallen", "Deindustrialisierung"],
        },
        baseline: "German independent-left alt-media baseline is open mockery + system-critique register on US-EU alliance dynamics.",
        observed: "Maximal indignation register. Mainstream investigation framed as performative ('simuliert'); state described in decay metaphors ('decomposing body of the former Rechtsstaat').",
        deviation: { level: "low", direction: "consistent with anti-establishment alt-media baseline", fit: "strong" },
        whyMatters: "Low deviation = baseline-typical fervor. The register is structurally familiar; the question is whether the baseline-typical alt-media reading happens to be ecosystem-correct here. Register alone cannot answer that.",
      },
    ],
  },

  {
    id: "pl", flag: "🇵🇱", name: "Polish", longName: "Polish-language press (only ecosystem in 'pride' register)",
    factions: [
      {
        id: "pl-judicial-political", label: "Judicial-political (Łubowski / Tusk)", kind: "judicial",
        frame: { x: 82, y: 18, victim: "C3", victimIntensity: 0.85, moral: "B2", posture: "D1" },
        register: {
          certainty: "affirmative", affect: "pride",
          markers: ["wojna sprawiedliwa", "krwawa i ludobójcza napaść", "sprawa zamknięta", "i słusznie"],
        },
        baseline: "Polish judicial register on cross-border criminal matters defaults to formal-legal procedural language without moral framing in the ratio decidendi.",
        observed: "Łubowski's ruling text places moral judgment ('blood-stained, genocidal aggression') BEFORE legal analysis. Tusk's 'sprawa zamknięta' tweet treats non-extradition as victory, not jurisdictional outcome.",
        deviation: { level: "high", direction: "from procedural-formal judicial baseline toward moralized legitimation register", fit: "weak" },
        whyMatters: "The deviation is the most diagnostically loaded in the entire case. A judicial register that pre-empts legal analysis with moral framing tells us the legal system has aligned with a national narrative — not that the narrative is correct, but that institutional posture is taken, not held in reserve.",
      },
      {
        id: "pl-mainstream", label: "Mainstream press (Rzeczpospolita / wp.pl)", kind: "main",
        frame: { x: 80, y: 20, victim: "C3", victimIntensity: 0.65, moral: "B2", posture: "D1" },
        register: {
          certainty: "affirmative", affect: "endorsement",
          markers: ["Wysadzenie Nord Stream sprawiedliwe", "ordery dla", "bohaterowie"],
        },
        baseline: "Polish mainstream press baseline includes nationally-aligned register on Russia-related security matters, but typically maintains attributional hedging on contested cross-border legal questions.",
        observed: "Editorial choice to print 'Blowing up Nord Stream was just' as a headline (not 'court considers it just'). Reporting on Sikorski's signaling for medals to suspects without rebuttal-soliciting follow-up.",
        deviation: { level: "medium", direction: "from contested-attribution hedging baseline toward unhedged endorsement headlines", fit: "moderate" },
        whyMatters: "Polish mainstream is the only EU member-state mainstream where 'sabotage of treaty-ally infrastructure' is reframed as 'justice'. The register choice shows alignment between editorial layer and judicial-executive layer — three institutional layers in one register direction is the rare case.",
      },
    ],
  },

  {
    id: "ar", flag: "🇪🇬🇱🇧", name: "Arabic", longName: "Arabic-language press",
    factions: [
      {
        id: "ar-state", label: "State formal (Al-Ahram)", kind: "main",
        frame: { x: 42, y: 42, victim: "C4", victimIntensity: 0.5, moral: "B3", posture: "D2" },
        register: {
          certainty: "neutral", affect: "distance",
          markers: ["accusations have emerged", "denials have been issued", "investigations remain ongoing"],
        },
        baseline: "Arab state-aligned formal media on Western intra-alliance disputes defaults to non-aligned diplomatic register.",
        observed: "Maintained baseline. But selection bias visible — Hersh and Naryshkin amplified more than EU judicial findings.",
        deviation: { level: "low", direction: "no register deviation; selection layer carries the position", fit: "strong" },
        whyMatters: "Register-low-deviation but selection-high-bias. The visible neutrality is a register frame; the position lives in editorial selection, not language.",
      },
      {
        id: "ar-anti-imperial", label: "Anti-imperial (RT Arabic / Rai al-Youm)", kind: "alt",
        frame: { x: 12, y: 78, victim: "C1", victimIntensity: 0.9, moral: "B3", posture: "D3" },
        drift: { fromX: 28, fromY: 58, dx: -16, dy: 20 },
        register: {
          certainty: "affirmative", affect: "indignation",
          markers: ["الأنجلو-ساكسون", "إمبريالية", "آخر مغامرات الناتو"],
        },
        baseline: "Arabic anti-imperial outlets default to high-affect anti-Western register on alliance covert-operation stories.",
        observed: "Russian state register translated into Arabic + indigenous anti-colonial vocabulary ('Anglo-Saxons' as historically-loaded designation).",
        deviation: { level: "low", direction: "baseline-typical anti-imperial register; cross-language vocabulary import", fit: "strong" },
        whyMatters: "Low deviation but illustrative of cross-language alliance: Russian state register and Arab anti-imperial register converge in affect because their structural positions toward US power align, despite different cultural origins.",
      },
    ],
  },

  {
    id: "fr", flag: "🇫🇷", name: "French", longName: "French-language press",
    factions: [
      {
        id: "fr-mainstream", label: "Mainstream (Le Monde / France 24)", kind: "main",
        frame: { x: 52, y: 40, victim: "C2", victimIntensity: 0.8, moral: "B3", posture: "D2" },
        drift: { fromX: 72, fromY: 24, dx: -20, dy: 16 },
        register: {
          certainty: "neutral", affect: "anxiety",
          markers: ["se confirme", "questionnement", "souveraineté européenne"],
        },
        baseline: "French mainstream defaults to republican-neutral reportage with implicit critique via adjective-insertion.",
        observed: "France Info detective-style investigation; Le Monde adopting 'European sovereignty' frame. Adjective-insertion ('une figure populaire qui a été limogée') sneaks position into description.",
        deviation: { level: "medium", direction: "from cool-reportage baseline toward implicit-critical register via adjective placement", fit: "moderate" },
        whyMatters: "French register signals position through grammatical placement, not lexical choice. The political reading lives in adverbs and modifiers — a register technique distinctive to French editorial culture.",
      },
      {
        id: "fr-independent", label: "Independent (Elucid / Le Grand Continent)", kind: "alt",
        frame: { x: 24, y: 65, victim: "C2", victimIntensity: 0.85, moral: "B3", posture: "D3" },
        register: {
          certainty: "adversarial", affect: "indignation",
          markers: ["nonchalance", "complicité tacite", "sacrifice de la souveraineté", "vassalisation"],
        },
        baseline: "French independent-left baseline includes open institutional critique, but typically diplomatic-academic register on foreign-policy matters.",
        observed: "Elucid uses 'nonchalance' (= 'indifference verging on complicity') for European institutional response — a near-accusation in French editorial register.",
        deviation: { level: "high", direction: "from diplomatic-academic baseline toward direct accusation register", fit: "weak" },
        whyMatters: "French institutional accusation requires specific register escalation. 'Nonchalance' is the verb-cue for moving from analysis to accusation. Its appearance signals the writer has crossed a register threshold.",
      },
    ],
  },

  {
    id: "it", flag: "🇮🇹", name: "Italian", longName: "Italian-language press",
    factions: [
      {
        id: "it-critical", label: "Critical (Il Fatto Quotidiano)", kind: "alt",
        frame: { x: 20, y: 70, victim: "C2", victimIntensity: 0.85, moral: "B3", posture: "D3" },
        register: {
          certainty: "affirmative", affect: "indignation",
          markers: ["disobbedienza", "bocciata da lui stesso", "ucraini hanno fatto bene"],
        },
        baseline: "Il Fatto baseline is critical-dramatic register on government-establishment matters.",
        observed: "Above-baseline intensity. Calenda's 'ucraini hanno fatto bene a distruggerlo' (Ukrainians did right to destroy it) printed without rebuttal — register-level endorsement via non-rebuttal.",
        deviation: { level: "medium", direction: "from baseline critical-dramatic toward unhedged-endorsement register", fit: "moderate" },
        whyMatters: "The register choice to print and not rebut a center-right politician's endorsement of the operation is editorial position. Italian critical media is rarely silent in this way; the silence is the position.",
      },
      {
        id: "it-mainstream", label: "Mainstream (Corriere / Repubblica)", kind: "main",
        frame: { x: 42, y: 48, victim: "C2", victimIntensity: 0.7, moral: "B3", posture: "D2" },
        drift: { fromX: 70, fromY: 30, dx: -28, dy: 18 },
        register: {
          certainty: "neutral", affect: "procedural_coldness",
          markers: ["Cassazione ha disposto", "questioni di immunità funzionale", "in attesa di pronuncia"],
        },
        baseline: "Italian mainstream defaults to procedural-judicial register on EU sensitive matters — 'judicialism as shelter'.",
        observed: "Sustained procedural focus on Cassazione reversals (annul → remand → reapprove → confirm). Political layer kept in reserve.",
        deviation: { level: "medium", direction: "from typical-procedural baseline toward extended procedural oscillation register", fit: "moderate" },
        whyMatters: "Italian procedural-shelter register is a known structural pattern; what's notable is the duration and density of procedural oscillation here. Three reversals in six weeks is procedurally noisy in a way that signals upstream pressure even when the register stays cool.",
      },
      {
        id: "it-skeptic", label: "Skeptic (Nuova Bussola / Politica Internazionale)", kind: "alt",
        frame: { x: 28, y: 58, victim: "C4", victimIntensity: 0.6, moral: "B3", posture: "D3" },
        register: {
          certainty: "ironic", affect: "suspicion",
          markers: ["da solo? difficilmente", "Anglo-americani non potevano non sapere", "depth-state classico"],
        },
        baseline: "Italian conservative-skeptical media baseline is 'deep-state suspicion' register — long tradition predating this case.",
        observed: "Standard NBQ register applied to this specific factual content. 'Could Zaluzhnyi alone direct this? Doubtful' — rhetorical questioning structure.",
        deviation: { level: "low", direction: "baseline-typical conservative deep-state register", fit: "strong" },
        whyMatters: "Low deviation; the register itself is the position. NBQ would write the same way regardless of which Western covert operation; this is structural skepticism, not reactive analysis. Diagnostic value moderate — the register predicts itself.",
      },
    ],
  },

  {
    id: "es", flag: "🇪🇸🇦🇷", name: "Spanish", longName: "Spanish-language press",
    factions: [
      {
        id: "es-mainstream", label: "Mainstream (El País / El Mundo)", kind: "main",
        frame: { x: 50, y: 38, victim: "C2", victimIntensity: 0.7, moral: "B3", posture: "D2" },
        register: {
          certainty: "neutral", affect: "distance",
          markers: ["se investiga", "según fuentes alemanas", "sin atribución pública"],
        },
        baseline: "Spanish European-mainstream baseline mirrors Le Monde register: fact-reportage with mild European-sovereignty inflection.",
        observed: "Baseline-typical. Sachs amplified with charter-formal language; mainstream reporting kept measured.",
        deviation: { level: "low", direction: "no deviation from European-mainstream baseline", fit: "strong" },
        whyMatters: "Low-deviation cluster with French and Italian mainstream forms a recognizable EU-mainstream register pattern. The pattern is collective, not individual.",
      },
      {
        id: "es-latam-left", label: "Latam left (El Salto / Infobae)", kind: "alt",
        frame: { x: 20, y: 70, victim: "C1", victimIntensity: 0.8, moral: "B3", posture: "D3" },
        drift: { fromX: 36, fromY: 52, dx: -16, dy: 18 },
        register: {
          certainty: "affirmative", affect: "indignation",
          markers: ["imperialismo anglo-sajón", "doble vara", "OTAN como agresor"],
        },
        baseline: "Latin American left-independent media baseline is anti-NATO + anti-imperial register on US-Western-alliance matters.",
        observed: "Standard anti-imperial register. Infobae's Bayesian-exploratory register ('poco verosímil' on Russian self-attribution) is a regional variant.",
        deviation: { level: "low", direction: "consistent with Latam-left anti-imperial baseline", fit: "strong" },
        whyMatters: "Cross-cultural register convergence with Russian state and Arabic anti-imperial — same affect from different cultural roots. Convergence is structural-political alignment, not coordination.",
      },
    ],
  },

  {
    id: "ja", flag: "🇯🇵", name: "Japanese", longName: "Japanese press (the diagnostic null)",
    factions: [
      {
        id: "ja-observer", label: "Mainstream observer (Nikkei / Newsweek Japan)", kind: "main",
        frame: { x: 56, y: 22, victim: "C4", victimIntensity: 0.5, moral: "B3", posture: "D1" },
        register: {
          certainty: "neutral", affect: "distance",
          markers: ["欧州で議論が起きている", "とされる", "報じられている"],
        },
        baseline: "Japanese press on global events DOES take positions — Ukraine war, Trump tariffs, semiconductors all generate engaged register. Nord Stream is the exception.",
        observed: "Pure observer register: keigo politeness markers, third-party-event grammar, zero dramatization, zero positional vocabulary.",
        deviation: { level: "high", direction: "from default engaged-register on geopolitical matters toward total disengagement register on this specific topic", fit: "weak" },
        whyMatters: "Selective non-participation on a single topic is itself positional. The Japanese press chose to make this case 'not their event' — a register of structural avoidance not visible elsewhere in their geopolitical coverage.",
      },
    ],
  },

  {
    id: "uk", flag: "🇺🇦", name: "Ukrainian", longName: "Ukrainian-language press (two-layer narrative)",
    factions: [
      {
        id: "uk-official", label: "Official (Podolyak / Zelensky office)", kind: "government",
        frame: { x: 92, y: 23, victim: "C3", victimIntensity: 0.85, moral: "B1", posture: "D1" },
        register: {
          certainty: "adversarial", affect: "mockery",
          markers: ["смішно", "провокація", "russian fakery"],
        },
        baseline: "Ukrainian official communications on adversarial allegations baseline is firm-but-procedural denial register.",
        observed: "Above-baseline mockery register. 'Смішно' (laughable), 'провокація' (provocation) carry contempt, not denial.",
        deviation: { level: "medium", direction: "from procedural-denial baseline toward contemptuous-denial register", fit: "moderate" },
        whyMatters: "Denial intensity correlates with stake. A merely-uninvolved party tends to register-low denials; the contemptuous escalation is the kind a party with something to manage produces. Note: the inference firewall (§1.2) prohibits reading this as causal admission. It documents stake-perception, not knowledge.",
      },
      {
        id: "uk-media", label: "Domestic media (Focus.ua / UNIAN / TSN)", kind: "alt",
        frame: { x: 30, y: 35, victim: "C3", victimIntensity: 0.95, moral: "B2", posture: "D1" },
        register: {
          certainty: "affirmative", affect: "pride",
          markers: ["елітний підрозділ", "наша операція", "патріоти"],
        },
        baseline: "Ukrainian-language domestic media on military operations defaults to pro-state achievement register.",
        observed: "Pride-register on operations the official line denies. 'Елітний підрозділ України підірвав' (Ukraine's elite unit blew up) — declarative, achievement-coded.",
        deviation: { level: "high", direction: "from baseline pro-state register toward register CONTRADICTING the official denial layer", fit: "weak" },
        whyMatters: "The register split between official (denial) and domestic-media (pride) is structural, not factional. Two registers serving two audiences (international diplomatic; domestic constituency) within one ecosystem. This is the case's clearest example of audience-aware register design.",
      },
    ],
  },

  {
    id: "sv", flag: "🇸🇪", name: "Swedish", longName: "Swedish-language press",
    factions: [
      {
        id: "sv-prosecutorial", label: "Prosecutorial (Åklagarmyndigheten / Ljungqvist)", kind: "judicial",
        frame: { x: 52, y: 17, victim: "C4", victimIntensity: 0.8, moral: "B3", posture: "D1" },
        register: {
          certainty: "evasive", affect: "procedural_coldness",
          markers: ["kan antas saknas", "slagfält för påverkansoperationer", "förundersökningen läggs ned"],
        },
        baseline: "Swedish prosecutorial register on jurisdictional questions defaults to binary 'saknas / föreligger' (lacking / present) — evidence is or is not present.",
        observed: "'Kan antas saknas' (can be presumed lacking) — the insertion of 'antas' is marked. Swedish legal grammar can do binary judgment; the modal qualifier 'antas' (presumed) introduces uncertainty into a typically-decided category.",
        deviation: { level: "high", direction: "from binary-jurisdictional baseline to intentionally-fuzzy presumption-based construction", fit: "weak" },
        whyMatters: "Swedish lawyers can read the deviation. The 'antas' insertion signals: 'we do not say jurisdiction is missing; we say it can be presumed missing' — preserving room for later reinterpretation and avoiding a substantive jurisdictional finding.",
      },
      {
        id: "sv-broadcaster", label: "Public broadcaster critic (SVT)", kind: "alt",
        frame: { x: 42, y: 56, victim: "C2", victimIntensity: 0.85, moral: "B3", posture: "D2" },
        register: {
          certainty: "ironic", affect: "indignation",
          markers: ["enklaste vägen ut", "Sverige tog enklaste vägen", "rättssamhälle utan ryggrad"],
        },
        baseline: "SVT public-broadcaster register defaults to balanced reportage with hedged opinion in editorial pages.",
        observed: "Editorial page headline 'Sverige tog enklaste vägen ut' (Sweden took the easiest way out). 'Enklaste vägen ut' carries laziness + responsibility-evasion semantic load in Swedish.",
        deviation: { level: "high", direction: "from baseline balanced editorial toward sharp directly-named criticism of own state", fit: "weak" },
        whyMatters: "A Swedish public broadcaster using 'enklaste vägen ut' for the national prosecutor is a register escalation. Swedish editorial culture rarely puts this phrase in a headline about a state actor. The escalation is the signal.",
      },
    ],
  },

  {
    id: "da", flag: "🇩🇰", name: "Danish", longName: "Danish-language press",
    factions: [
      {
        id: "da-academic", label: "Academic dissent (Buhl / Splidsboel DIIS)", kind: "alt",
        frame: { x: 50, y: 56, victim: "C2", victimIntensity: 0.85, moral: "B3", posture: "D2" },
        register: {
          certainty: "ironic", affect: "indignation",
          markers: ["Selv Rusland har ikke bestridt", "mytedannelser, desinformation, konspirationsteorier", "Danmark havde jurisdiktion"],
        },
        baseline: "Danish legal-academic register defaults to formal-cool analysis with hedged disagreement.",
        observed: "Buhl: 'Even Russia has not disputed Danish jurisdiction' — rhetorical reversal using adversary's silence. Splidsboel: 'mytedannelser, desinformation, konspirationsteorier' — three-word warning escalation.",
        deviation: { level: "high", direction: "from formal-academic baseline toward open warning register against own government", fit: "weak" },
        whyMatters: "Danish academic warning register has a specific tradition (prophetic-academic). Its activation is institutionally rare; activation here is a marker that domain-experts feel the public reasoning is dangerous.",
      },
      {
        id: "da-broadcaster", label: "Public broadcaster (DR / TV2 Bornholm)", kind: "main",
        frame: { x: 56, y: 38, victim: "C4", victimIntensity: 0.65, moral: "B3", posture: "D2" },
        register: {
          certainty: "neutral", affect: "anxiety",
          markers: ["bornholmernes hverdag", "uforklarede observationer", "Zhuravlevs danske familieforbindelser"],
        },
        baseline: "Danish public-broadcaster baseline is community-empathy register on national-security-adjacent matters.",
        observed: "Local-island vantage prioritized. TV2 Bornholm's 'Zhuravlev's wife works at Danish company' — placed without explanatory frame, leaving the reader to interpret.",
        deviation: { level: "medium", direction: "from community-anxiety baseline toward suspense-investigative register", fit: "moderate" },
        whyMatters: "The 'placed without explanation' technique is positional: the Danish public broadcaster will not say what it suspects, but will arrange facts so the reader sees them. Register restraint with editorial direction.",
      },
    ],
  },

  {
    id: "no", flag: "🇳🇴", name: "Norwegian", longName: "Norwegian-language press",
    factions: [
      {
        id: "no-broadcaster", label: "Public broadcaster (NRK Skyggekrigen)", kind: "main",
        frame: { x: 54, y: 30, victim: "C4", victimIntensity: 0.75, moral: "B3", posture: "D2" },
        register: {
          certainty: "neutral", affect: "endorsement",
          markers: ["radarspor", "satellittbilder", "radioaktivitet", "metodologisk transparens"],
        },
        baseline: "NRK investigative baseline is professional-thorough register with method-transparency.",
        observed: "Above-baseline method-display. Skyggekrigen series spends extensive screen time on HOW the team knows, not just what they know. Methodology becomes implicit argument against single-source competitors (Hersh).",
        deviation: { level: "medium", direction: "from method-transparent baseline toward methodological-pride register as positional contrast", fit: "moderate" },
        whyMatters: "The register implicitly stakes a methodological claim: 'we know because we showed our work; competitors that didn't are differently-credible.' Register-as-epistemology positioning.",
      },
      {
        id: "no-independent-left", label: "Independent left (steigan.no)", kind: "alt",
        frame: { x: 22, y: 64, victim: "C2", victimIntensity: 0.8, moral: "B1", posture: "D3" },
        register: {
          certainty: "adversarial", affect: "indignation",
          markers: ["regjeringas talerør", "imperialistisk lydighet", "atlantisk vassalitet"],
        },
        baseline: "Norwegian independent-left baseline is open anti-establishment register.",
        observed: "Indictment of NRK as 'government's mouthpiece' — direct register accusation against own public broadcaster.",
        deviation: { level: "low", direction: "consistent with steigan.no anti-establishment baseline", fit: "strong" },
        whyMatters: "Low deviation = register predicts itself. Diagnostic value moderate; the position is a category-position, not a case-specific judgment. Useful for exhibiting the spread, less useful as evidence on the case.",
      },
    ],
  },
];


// Aggregate stats for the lens
const ECOSYSTEM_STATS = {
  totalFactions: ECOSYSTEMS.reduce((s, e) => s + e.factions.length, 0),
  totalEcosystems: ECOSYSTEMS.length,
  highDeviation: ECOSYSTEMS.flatMap(e => e.factions).filter(f => f.deviation.level === "high").length,
  lowDeviation: ECOSYSTEMS.flatMap(e => e.factions).filter(f => f.deviation.level === "low").length,
};

// Color per ecosystem (uses existing palette)
function ecosystemColor(eid) {
  switch (eid) {
    case "en":   return colors_V05.secondary;
    case "zh":   return "#A03A2C";
    case "ru":   return colors_V05.warnDeep;
    case "de":   return colors_V05.ink;
    case "pl":   return colors_V05.primary;
    case "ar":   return "#7A6A54";
    case "fr":   return "#1C3A5E";
    case "it":   return "#5A6E48";
    case "es":   return "#C87769";
    case "ja":   return colors_V05.muted;
    case "uk":   return "#B8902E";
    case "sv":   return "#6B8AAE";
    case "da":   return "#8A9C76";
    case "no":   return colors_V05.meta;
    default:     return colors_V05.inkMute;
  }
}

// Faction kind → marker shape
function factionShape(kind) {
  switch (kind) {
    case "main":       return "circle";
    case "judicial":   return "diamond";
    case "government": return "square";
    case "alt":        return "circle-open";
    case "single":     return "triangle";
    default:           return "circle";
  }
}

function deviationLabel(level) {
  return { low: "Strong fit", medium: "Moderate fit", high: "Weak fit" }[level] || level;
}

function deviationColor(level) {
  return level === "low" ? colors_V05.good : level === "medium" ? colors_V05.warn : colors_V05.primary;
}


// ============================================================================
// ECOSYSTEM MAP — 2D frame plane with faction-level detail panel
// ============================================================================

function EcosystemMapView() {
  const allFactions = useMemo(() => ECOSYSTEMS.flatMap(e =>
    e.factions.map(f => ({ ...f, ecosystem: e }))
  ), []);

  const [selectedId, setSelectedId] = useState("de-judicial");
  const [hoveredId, setHoveredId] = useState(null);
  const [showDriftTrails, setShowDriftTrails] = useState(true);

  const activeFaction = useMemo(() => {
    const id = hoveredId || selectedId;
    return allFactions.find(f => f.id === id);
  }, [allFactions, hoveredId, selectedId]);

  return (
    <div>
      {/* Stats strip */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap",
      }}>
        <Chip num={ECOSYSTEM_STATS.totalEcosystems} label="language ecosystems" />
        <Chip num={ECOSYSTEM_STATS.totalFactions} label="factions surveyed" />
        <Chip num={ECOSYSTEM_STATS.highDeviation} label="weak fit (signal-rich)" tone="primary" />
        <Chip num={ECOSYSTEM_STATS.lowDeviation} label="strong fit (baseline-typical)" tone="warn" />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
        gap: 24, alignItems: "flex-start",
      }}>
        {/* Left: plane */}
        <div>
          <FramePlane
            allFactions={allFactions}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            showDriftTrails={showDriftTrails}
          />
          <FramePlaneLegend
            showDriftTrails={showDriftTrails}
            setShowDriftTrails={setShowDriftTrails}
          />
        </div>

        {/* Right: faction detail */}
        {activeFaction && (
          <FactionDetailPanel f={activeFaction} />
        )}
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------------
// FRAME PLANE — SVG 2D plot, 14 ecosystem clusters, drift trails optional
// ----------------------------------------------------------------------------

function FramePlane({ allFactions, selectedId, hoveredId, onSelect, onHover, showDriftTrails }) {
  // Frame coords range x ∈ [0,100], y ∈ [0,100]
  // SVG viewBox: 80px padding for axis labels
  const W = 720, H = 560;
  const PAD = 64;
  const PW = W - PAD * 2, PH = H - PAD * 2;

  const px = (x) => PAD + (x / 100) * PW;
  const py = (y) => PAD + (y / 100) * PH;

  // Group factions by ecosystem for connecting lines
  const groups = useMemo(() => {
    const out = {};
    allFactions.forEach(f => {
      if (!out[f.ecosystem.id]) out[f.ecosystem.id] = [];
      out[f.ecosystem.id].push(f);
    });
    return out;
  }, [allFactions]);

  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: 0, borderRadius: 2, overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 22px 12px",
        borderBottom: `1px solid ${colors_V05.ruleSoft}`,
        background: colors_V05.paperDeep,
      }}>
        <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.warnDeep} style={{ marginBottom: 4 }}>
          Frame plane · positional spread across language ecosystems
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft, lineHeight: 1.5,
        }}>
          Each marker = one faction. Same color = same language ecosystem. Lines connect factions within an ecosystem to show internal register split. Hover to inspect.
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{
        display: "block", width: "100%", height: "auto",
        background: colors_V05.paper,
      }}>
        {/* Quadrant background tints */}
        <rect x={px(0)} y={py(0)} width={PW/2} height={PH/2}
              fill={colors_V05.paperDeep} opacity={0.4} />
        <rect x={px(50)} y={py(50)} width={PW/2} height={PH/2}
              fill={colors_V05.paperDeep} opacity={0.4} />

        {/* Axis labels (corners) */}
        <text x={px(2)} y={py(3)} fill={colors_V05.inkMute}
              style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6 }}>
          ACCEPTS US-AS-OPERATIVE-FRAME
        </text>
        <text x={px(98)} y={py(3)} fill={colors_V05.inkMute} textAnchor="end"
              style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6 }}>
          ACCEPTS RUSSIA-AS-VICTIM-FRAME
        </text>
        <text x={px(2)} y={py(98)} fill={colors_V05.inkMute}
              style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6 }}>
          REJECTS MAINSTREAM (toward US-blame)
        </text>
        <text x={px(98)} y={py(98)} fill={colors_V05.inkMute} textAnchor="end"
              style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6 }}>
          REJECTS MAINSTREAM (toward Russia-blame)
        </text>

        {/* Crosshair */}
        <line x1={px(50)} y1={py(0)} x2={px(50)} y2={py(100)}
              stroke={colors_V05.rule} strokeDasharray="3 4" strokeWidth={1} />
        <line x1={px(0)} y1={py(50)} x2={px(100)} y2={py(50)}
              stroke={colors_V05.rule} strokeDasharray="3 4" strokeWidth={1} />

        {/* Axis arrows */}
        <line x1={px(0)} y1={py(50)} x2={px(100)} y2={py(50)}
              stroke={colors_V05.inkMute} strokeWidth={0.5} />
        <line x1={px(50)} y1={py(0)} x2={px(50)} y2={py(100)}
              stroke={colors_V05.inkMute} strokeWidth={0.5} />

        {/* Center axis labels */}
        <text x={px(50)} y={py(50) - 6} fill={colors_V05.inkMute} textAnchor="middle"
              style={{ fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.5, fontStyle: "italic" }}>
          attribution axis →
        </text>
        <text x={px(50) + 8} y={py(50) + 14} fill={colors_V05.inkMute}
              style={{ fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.5, fontStyle: "italic" }}>
          ↓ epistemic posture
        </text>

        {/* Connecting lines within ecosystem */}
        {Object.entries(groups).map(([eid, factions]) => {
          if (factions.length < 2) return null;
          const c = ecosystemColor(eid);
          // Convex hull approximation: just connect to centroid
          const cx = factions.reduce((s, f) => s + f.frame.x, 0) / factions.length;
          const cy = factions.reduce((s, f) => s + f.frame.y, 0) / factions.length;
          return (
            <g key={`line-${eid}`}>
              {factions.map(f => (
                <line key={f.id}
                      x1={px(cx)} y1={py(cy)}
                      x2={px(f.frame.x)} y2={py(f.frame.y)}
                      stroke={c} strokeWidth={0.6} opacity={0.22}
                      strokeDasharray="2 3" />
              ))}
            </g>
          );
        })}

        {/* Drift trails (optional) */}
        {showDriftTrails && allFactions.filter(f => f.drift).map(f => {
          const c = ecosystemColor(f.ecosystem.id);
          return (
            <g key={`drift-${f.id}`}>
              <line x1={px(f.drift.fromX)} y1={py(f.drift.fromY)}
                    x2={px(f.frame.x)} y2={py(f.frame.y)}
                    stroke={c} strokeWidth={1.2} opacity={0.45} />
              <circle cx={px(f.drift.fromX)} cy={py(f.drift.fromY)}
                      r={2.5} fill={c} opacity={0.5} />
            </g>
          );
        })}

        {/* Faction markers — shape-based on plane, ecosystem color */}
        {allFactions.map(f => {
          const isSelected = f.id === selectedId;
          const isHovered  = f.id === hoveredId;
          const isActive   = isSelected || isHovered;
          const c = ecosystemColor(f.ecosystem.id);
          const cx = px(f.frame.x), cy = py(f.frame.y);
          const shape = factionShape(f.kind);
          const baseR = f.kind === "main" ? 9 : 6.5;
          const r = isActive ? baseR + 3 : baseR;

          return (
            <g key={f.id}
               style={{ cursor: "pointer" }}
               onMouseEnter={() => onHover(f.id)}
               onMouseLeave={() => onHover(null)}
               onClick={() => onSelect(f.id)}>
              {/* Active halo */}
              {isActive && (
                <circle cx={cx} cy={cy} r={r + 5} fill="none"
                        stroke={c} strokeWidth={1} opacity={0.4} />
              )}
              <FactionMarker shape={shape} cx={cx} cy={cy} r={r}
                             color={c} active={isActive} kind={f.kind} />
              {/* Active state: flag + faction label above marker */}
              {isActive && (
                <text x={cx} y={cy - r - 8} fill={colors_V05.ink} textAnchor="middle"
                      style={{
                        fontFamily: fonts.mono, fontSize: 10, fontWeight: 600,
                        letterSpacing: 0.4, pointerEvents: "none",
                      }}>
                  {primaryFlag(f.ecosystem.flag)} {f.label.split(" (")[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FactionMarker({ shape, cx, cy, r, color, active, kind }) {
  const fill = kind === "alt" ? colors_V05.paper : color;
  const stroke = color;
  const strokeWidth = active ? 2.2 : 1.5;
  switch (shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case "circle-open":
      return <circle cx={cx} cy={cy} r={r} fill={colors_V05.paper} stroke={stroke} strokeWidth={strokeWidth} />;
    case "diamond":
      return (
        <polygon points={`${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}`}
                 fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      );
    case "square":
      return <rect x={cx-r*0.85} y={cy-r*0.85} width={r*1.7} height={r*1.7}
                   fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case "triangle":
      return (
        <polygon points={`${cx},${cy-r} ${cx+r*0.92},${cy+r*0.7} ${cx-r*0.92},${cy+r*0.7}`}
                 fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      );
    default:
      return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
}

function FramePlaneLegend({ showDriftTrails, setShowDriftTrails }) {
  const shapes = [
    { kind: "main",       label: "Mainstream / dominant outlet" },
    { kind: "judicial",   label: "Judicial / legal layer" },
    { kind: "government", label: "Government / executive" },
    { kind: "alt",        label: "Alt / independent" },
    { kind: "single",     label: "Single-source narrative" },
  ];
  return (
    <div style={{
      marginTop: 14, padding: "12px 16px", border: `1px solid ${colors_V05.ruleSoft}`,
      background: colors_V05.paper, borderRadius: 2,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 8 }}>
        <MonoLabel size={9} letterSpacing={0.9}>
          Reading the plane
        </MonoLabel>
        <button onClick={() => setShowDriftTrails(!showDriftTrails)}
          style={{
            fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.7,
            textTransform: "uppercase", padding: "5px 11px", borderRadius: 2,
            cursor: "pointer", border: `1px solid ${colors_V05.rule}`,
            background: showDriftTrails ? colors_V05.ink : "transparent",
            color: showDriftTrails ? colors_V05.paper : colors_V05.inkSoft, fontWeight: 500,
            transition: "all 0.12s",
          }}>
          {showDriftTrails ? "✓" : "○"} drift trails (Q4 2022 → 2026)
        </button>
      </div>
      <div style={{
        fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft, lineHeight: 1.55,
        marginBottom: 10,
      }}>
        Color = language ecosystem. Shape = faction kind. Same-ecosystem factions are connected by faint dotted lines to a centroid; the spread shows internal register split (the German cluster is the most spread). Hover any marker to surface its national flag + faction name; click to pin.
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 8, borderTop: `1px dashed ${colors_V05.ruleSoft}` }}>
        {shapes.map(s => (
          <div key={s.kind} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <svg width={20} height={20} viewBox="0 0 20 20">
              <FactionMarker shape={factionShape(s.kind)} cx={10} cy={10} r={6}
                             color={colors_V05.inkSoft} active={false} kind={s.kind} />
            </svg>
            <MonoLabel size={9} letterSpacing={0.5} color={colors_V05.inkSoft}>
              {s.label}
            </MonoLabel>
          </div>
        ))}
      </div>
    </div>
  );
}

// Strip a multi-flag ecosystem string (e.g. "🇬🇧🇺🇸") to its first flag.
// One regional-indicator pair = 4 UTF-16 code units in JS.
function primaryFlag(flagStr) {
  return flagStr.length > 4 ? flagStr.substring(0, 4) : flagStr;
}


// ----------------------------------------------------------------------------
// FACTION DETAIL PANEL — frame coords + register profile + baseline-deviation
// ----------------------------------------------------------------------------

function FactionDetailPanel({ f }) {
  const c = ecosystemColor(f.ecosystem.id);
  return (
    <div style={{
      background: colors_V05.paper, border: `1px solid ${colors_V05.rule}`,
      padding: "26px 28px 28px", borderRadius: 2, position: "sticky", top: 80,
    }}>
      {/* Identity card header — large flag + ecosystem + faction */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18, marginBottom: 18,
        paddingBottom: 16, borderBottom: `1px solid ${colors_V05.ruleSoft}`,
      }}>
        <div style={{
          fontSize: 44, lineHeight: 1, padding: "6px 12px",
          background: colors_V05.paperDeep, border: `1px solid ${colors_V05.ruleSoft}`,
          borderLeft: `3px solid ${c}`, borderRadius: 2,
          flexShrink: 0,
        }}>
          {f.ecosystem.flag}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <MonoLabel size={10} letterSpacing={1.1} color={c} style={{ marginBottom: 6 }}>
            {f.ecosystem.name} · {factionKindLabel(f.kind)}
          </MonoLabel>
          <div style={{
            fontFamily: fonts.serif, fontStyle: "italic", fontSize: 19, color: colors_V05.ink,
            letterSpacing: -0.25, lineHeight: 1.2, marginBottom: 4,
          }}>
            {f.label}
          </div>
          <MonoLabel size={9} letterSpacing={0.7} color={colors_V05.inkMute}>
            {f.ecosystem.longName}
          </MonoLabel>
        </div>
      </div>

      {/* Frame coordinates capsule */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16,
      }}>
        <FrameCoordPill label="Attribution" value={attributionLabel(f.frame.x)} accent={c} />
        <FrameCoordPill label="Posture"     value={postureLabel(f.frame.y)}      accent={c} />
        <FrameCoordPill label="Victim frame" value={victimLabel(f.frame.victim)}  accent={c} />
        <FrameCoordPill label="Moral frame"  value={moralLabel(f.frame.moral)}    accent={c} />
      </div>

      {f.drift && (
        <div style={{
          padding: "10px 14px", background: colors_V05.paperDeep,
          border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${colors_V05.warn}`,
          borderRadius: 2, marginBottom: 18,
        }}>
          <MonoLabel size={9} letterSpacing={1} color={colors_V05.warnDeep} style={{ marginBottom: 5 }}>
            Drift Q4 2022 → 2026
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors_V05.inkSoft, lineHeight: 1.5,
          }}>
            Started at attribution<sub>{f.drift.fromX}</sub> / posture<sub>{f.drift.fromY}</sub>; moved <strong>{Math.abs(f.drift.dx)} {f.drift.dx < 0 ? "left" : "right"}</strong> on attribution and <strong>{Math.abs(f.drift.dy)} {f.drift.dy < 0 ? "up" : "down"}</strong> on posture.
          </div>
        </div>
      )}

      {/* Register profile */}
      <Rule_V05 tone="soft" style={{ marginBottom: 14 }} />
      <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.warnDeep} style={{ marginBottom: 10 }}>
        Register profile
      </MonoLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <RegisterPill kind="certainty" value={f.register.certainty} />
        <RegisterPill kind="affect"    value={f.register.affect} />
      </div>
      {f.register.markers && f.register.markers.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <MonoLabel size={9} letterSpacing={0.8} color={colors_V05.inkMute} style={{ marginBottom: 6 }}>
            Diagnostic markers
          </MonoLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {f.register.markers.map((m, i) => (
              <div key={i} style={{
                fontFamily: fonts.mono, fontSize: 10.5, color: colors_V05.inkSoft,
                padding: "4px 8px", background: colors_V05.paperDeep,
                border: `1px solid ${colors_V05.ruleSoft}`, borderRadius: 1,
                lineHeight: 1.4, fontStyle: "italic",
              }}>
                "{m}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicted vs Observed (the user's "manipulation technique fit") */}
      <Rule_V05 tone="soft" style={{ marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <MonoLabel size={9.5} letterSpacing={1} color={colors_V05.warnDeep}>
          Predicted vs observed technique
        </MonoLabel>
        <FitBadge level={f.deviation.level} />
      </div>

      <PredictedObservedBlock
        predictedLabel="Predicted (baseline)"
        predictedBody={f.baseline}
        observedLabel="Observed (this case)"
        observedBody={f.observed}
        deviationDirection={f.deviation.direction}
        accent={deviationColor(f.deviation.level)}
      />

      {/* Why it matters */}
      <div style={{
        marginTop: 14, padding: "12px 14px", background: colors_V05.paperDeep,
        border: `1px solid ${colors_V05.ruleSoft}`, borderLeft: `3px solid ${c}`,
        borderRadius: 2,
      }}>
        <MonoLabel size={9} letterSpacing={1} color={c} style={{ marginBottom: 6 }}>
          What this fit reveals
        </MonoLabel>
        <div style={{
          fontFamily: fonts.sans, fontSize: 12.5, color: colors_V05.inkSoft, lineHeight: 1.6,
        }}>
          {f.whyMatters}
        </div>
      </div>
    </div>
  );
}

function FrameCoordPill({ label, value, accent }) {
  return (
    <div style={{
      padding: "8px 10px", background: colors_V05.paperDeep,
      border: `1px solid ${colors_V05.ruleSoft}`, borderRadius: 2,
    }}>
      <MonoLabel size={8.5} letterSpacing={0.8} color={colors_V05.inkMute} style={{ marginBottom: 3 }}>
        {label}
      </MonoLabel>
      <div style={{
        fontFamily: fonts.serif, fontSize: 13, color: colors_V05.ink,
        fontStyle: "italic", lineHeight: 1.25, fontWeight: 400,
      }}>
        {value}
      </div>
    </div>
  );
}

function RegisterPill({ kind, value }) {
  const certaintyTones = {
    affirmative: { fg: colors_V05.primary,   bg: "#F4E4E0" },
    neutral:     { fg: colors_V05.inkSoft,   bg: colors_V05.paperDeep },
    evasive:     { fg: colors_V05.warnDeep,  bg: "#F4ECD8" },
    adversarial: { fg: colors_V05.primary,   bg: "#F4E4E0" },
    ironic:      { fg: colors_V05.secondary, bg: "#E4ECF4" },
  };
  const affectTones = {
    pride:               { fg: colors_V05.primary,   bg: "#F4E4E0" },
    endorsement:         { fg: colors_V05.good,      bg: "#E8EDE0" },
    mourning:            { fg: colors_V05.secondary, bg: "#E4ECF4" },
    indignation:         { fg: colors_V05.primary,   bg: "#F4E4E0" },
    procedural_coldness: { fg: colors_V05.inkSoft,   bg: colors_V05.paperDeep },
    distance:            { fg: colors_V05.muted,     bg: colors_V05.paperDeep },
    anxiety:             { fg: colors_V05.warnDeep,  bg: "#F4ECD8" },
    mockery:             { fg: colors_V05.primary,   bg: "#F4E4E0" },
    suspicion:           { fg: colors_V05.warnDeep,  bg: "#F4ECD8" },
  };
  const t = (kind === "certainty" ? certaintyTones : affectTones)[value]
    || { fg: colors_V05.inkSoft, bg: colors_V05.paperDeep };

  return (
    <div style={{
      padding: "6px 10px", background: t.bg, border: `1px solid ${t.fg}`,
      borderRadius: 2, display: "inline-flex", flexDirection: "column",
    }}>
      <MonoLabel size={8.5} letterSpacing={0.7} color={t.fg} style={{ marginBottom: 2 }}>
        {kind}
      </MonoLabel>
      <span style={{
        fontFamily: fonts.serif, fontStyle: "italic", fontSize: 13,
        color: colors_V05.ink, letterSpacing: -0.1, lineHeight: 1.1,
      }}>
        {value.replace(/_/g, " ")}
      </span>
    </div>
  );
}

function FitBadge({ level }) {
  const tone = {
    low:    { fg: colors_V05.good,    bg: "#E8EDE0", label: "Strong fit",   sub: "predicted = observed" },
    medium: { fg: colors_V05.warnDeep,bg: "#F4ECD8", label: "Moderate fit", sub: "register diverges" },
    high:   { fg: colors_V05.primary, bg: "#F4E4E0", label: "Weak fit",     sub: "register breaks baseline" },
  }[level] || { fg: colors_V05.inkSoft, bg: colors_V05.paperDeep, label: level, sub: "" };

  return (
    <span style={{
      display: "inline-flex", flexDirection: "column",
      padding: "4px 9px", border: `1px solid ${tone.fg}`, background: tone.bg,
      borderRadius: 2, alignItems: "flex-end",
    }}>
      <span style={{
        fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.9,
        color: tone.fg, fontWeight: 600, textTransform: "uppercase",
      }}>
        {tone.label}
      </span>
      <span style={{
        fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.4,
        color: tone.fg, opacity: 0.85, textTransform: "uppercase",
      }}>
        {tone.sub}
      </span>
    </span>
  );
}

function PredictedObservedBlock({ predictedLabel, predictedBody, observedLabel, observedBody, deviationDirection, accent }) {
  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10,
      }}>
        <div style={{
          padding: "10px 12px", background: colors_V05.paperDeep,
          border: `1px solid ${colors_V05.ruleSoft}`, borderTop: `2px solid ${colors_V05.muted}`,
          borderRadius: 2,
        }}>
          <MonoLabel size={8.5} letterSpacing={0.8} color={colors_V05.inkMute} style={{ marginBottom: 5 }}>
            {predictedLabel}
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft, lineHeight: 1.5,
          }}>
            {predictedBody}
          </div>
        </div>
        <div style={{
          padding: "10px 12px", background: colors_V05.paper,
          border: `1px solid ${accent}`, borderTop: `2px solid ${accent}`,
          borderRadius: 2,
        }}>
          <MonoLabel size={8.5} letterSpacing={0.8} color={accent} style={{ marginBottom: 5 }}>
            {observedLabel}
          </MonoLabel>
          <div style={{
            fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.ink, lineHeight: 1.5,
          }}>
            {observedBody}
          </div>
        </div>
      </div>
      <div style={{
        padding: "8px 12px", background: colors_V05.paper,
        border: `1px dashed ${colors_V05.ruleSoft}`, borderRadius: 2,
        display: "flex", gap: 8, alignItems: "baseline",
      }}>
        <MonoLabel size={8.5} letterSpacing={0.7} color={accent}>
          Direction:
        </MonoLabel>
        <span style={{
          fontFamily: fonts.sans, fontSize: 11.5, color: colors_V05.inkSoft,
          lineHeight: 1.5, fontStyle: "italic",
        }}>
          {deviationDirection}
        </span>
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------------
// Frame coordinate decoders
// ----------------------------------------------------------------------------

function attributionLabel(x) {
  if (x < 20) return "US/UK as principal";
  if (x < 40) return "Western coordination";
  if (x < 60) return "Unresolved / multi-actor";
  if (x < 80) return "Ukraine as actor";
  return "Russia as victim (or self-author)";
}

function postureLabel(y) {
  if (y < 25) return "Accepts mainstream framing";
  if (y < 50) return "Questions mainstream";
  if (y < 75) return "Skeptical of mainstream";
  return "Rejects mainstream";
}

function victimLabel(v) {
  return {
    C1: "Russia (sovereign injury)",
    C2: "Europe (collateral)",
    C3: "Ukraine (frontline / partner)",
    C4: "Ecological / universal",
  }[v] || v;
}

function moralLabel(m) {
  return {
    B1: "Terror act",
    B2: "Justified sabotage",
    B3: "Unaccountable / impunity",
  }[m] || m;
}

function factionKindLabel(kind) {
  return {
    main:       "Mainstream outlet",
    judicial:   "Judicial layer",
    government: "Government / executive",
    alt:        "Alt / independent",
    single:     "Single-source narrative",
  }[kind] || kind;
}

// ============================================================================
// TOP-LEVEL EXPORT — routes between v0.3 (public reading) and v0.4 (pro
// analysis). Mode toggle lives inside each experience's Masthead; no
// separate tab strip at top.
// ============================================================================

export default function TraceCaseFile() {
  const [mode, setMode] = useState("v04");
  return (
    <div>
      {/* Global :fullscreen overrides — when the user toggles browser
          fullscreen, ensure the page remains scrollable and the paper
          background fills. Some browsers (Chrome/Safari) apply default
          overflow:hidden / black background to the fullscreen element,
          which would otherwise lock the user to whatever's visible at
          the moment of entering fullscreen. */}
      <style>{`
        :fullscreen, :-webkit-full-screen, :-moz-full-screen {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          background: #faf8f3;
        }
        html:fullscreen, html:-webkit-full-screen { overflow-y: auto !important; }
        body:fullscreen, body:-webkit-full-screen { overflow-y: auto !important; }
      `}</style>
      {mode === "v03" && <TraceV03Experience mode={mode} setMode={setMode}/>}
      {mode === "v04" && <TraceV04Experience mode={mode} setMode={setMode}/>}
    </div>
  );
}
