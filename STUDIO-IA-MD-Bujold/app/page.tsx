 "use client";

import { useRef, useState } from "react";

type Layer = { id: number; name: string; visible: boolean };

export default function Home() {
  const [tab, setTab] = useState<"create" | "edit">("create");
  const [prompt, setPrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("Bienvenue dans votre espace créatif.");
  const [layers, setLayers] = useState<Layer[]>([{id: 1, name: "Image principale", visible: true}]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState("none");
  const fileRef = useRef<HTMLInputElement>(null);

  function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Choisis un fichier image (PNG, JPG ou WebP)."); return; }
    const reader = new FileReader();
    reader.onload = () => { setImage(String(reader.result)); setResult(null); setNotice("Image chargée dans l'éditeur."); setLayers([{id: Date.now(), name: file.name, visible: true}]); };
    reader.readAsDataURL(file);
  }

  async function runAI(kind: "generate" | "edit") {
    const text = kind === "generate" ? prompt : editPrompt;
    if (!text.trim()) { setNotice("Écris d'abord une description."); return; }
    if (kind === "edit" && !image) { setNotice("Ajoute une photo avant de demander une retouche."); return; }
    setBusy(true);
    setNotice("Préparation de la demande…");
    try {
      const response = await fetch(`/api/${kind}`, {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ prompt: text, image })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Service IA non configuré.");
      if (data.image) { setResult(data.image); setNotice("Résultat reçu. Tu peux l'envoyer dans l'éditeur."); }
      else setNotice(data.message || "Le service IA a répondu sans image.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally { setBusy(false); }
  }

  function download() {
    const src = result || image;
    if (!src) { setNotice("Aucune image à exporter."); return; }
    const a = document.createElement("a"); a.href = src; a.download = "studio-ia-md-bujold.png"; a.click();
  }

  const shown = result || image;
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">✦</div><div><strong>STUDIO IA</strong><small>MD BUJOLD</small></div></div>
        <div className="side-label">ESPACE CRÉATIF</div>
        <button className={`nav-item ${tab === "create" ? "active" : ""}`} onClick={() => setTab("create")}><span>✧</span> Générer une image</button>
        <button className={`nav-item ${tab === "edit" ? "active" : ""}`} onClick={() => setTab("edit")}><span>◈</span> Retoucher avec l'IA</button>
        <button className="nav-item" onClick={() => fileRef.current?.click()}><span>▧</span> Ouvrir une photo</button>
        <div className="side-bottom"><div className="status-dot"/> Mode studio <span className="demo">APERÇU</span></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><div className="eyebrow">VOTRE ATELIER DE CRÉATION</div><h1>{tab === "create" ? "Donnez vie à vos idées." : "Réinventez vos images."}</h1></div>
          <div className="top-actions"><span className="plan">STUDIO PERSONNEL</span><button className="export-btn" onClick={download}>↥ Exporter</button></div>
        </header>

        <div className="workspace">
          <section className="center-column">
            <div className="mode-tabs">
              <button className={tab === "create" ? "selected" : ""} onClick={() => setTab("create")}>✧ Création IA</button>
              <button className={tab === "edit" ? "selected" : ""} onClick={() => setTab("edit")}>◈ Retouche IA</button>
            </div>

            {tab === "create" ? <div className="prompt-panel">
              <div className="panel-heading"><div><span className="number">01</span><strong>Décrivez votre création</strong></div><span className="soft-tag">TEXTE → IMAGE</span></div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ex. : Un paysage futuriste au coucher du soleil, éclairage cinématographique, détails ultra réalistes…" />
              <div className="prompt-footer"><span>Plus votre description est précise, meilleur sera le résultat.</span><button className="primary-btn" disabled={busy} onClick={() => runAI("generate")}>{busy ? "Génération…" : "✦ Générer l'image"}</button></div>
              <div className="option-row"><label>STYLE<select><option>Photorealiste</option><option>3D réaliste</option><option>Cinématique</option><option>Illustration</option><option>Fantaisie</option><option>Peinture</option></select></label><label>FORMAT<select><option>Carré · 1:1</option><option>Portrait · 2:3</option><option>Paysage · 16:9</option></select></label><label>VARIANTES<select><option>1 image</option><option>2 images</option><option>4 images</option></select></label></div>
            </div> : <div className="prompt-panel">
              <div className="panel-heading"><div><span className="number">01</span><strong>Que souhaitez-vous modifier ?</strong></div><span className="soft-tag">RETOUCHE IA</span></div>
              <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="Ex. : Remplace le ciel par un coucher de soleil spectaculaire et conserve le sujet principal…" />
              <div className="prompt-footer"><span>Importez une image, puis décrivez les changements souhaités.</span><button className="primary-btn" disabled={busy} onClick={() => runAI("edit")}>{busy ? "Traitement…" : "✦ Modifier avec l'IA"}</button></div>
              <div className="edit-shortcuts"><button onClick={() => setEditPrompt("Supprime l'arrière-plan et conserve le sujet principal.")}>Retirer l'arrière-plan</button><button onClick={() => setEditPrompt("Améliore la netteté et la qualité de cette image.")}>Améliorer la qualité</button><button onClick={() => setEditPrompt("Donne à cette image un style cinématographique.")}>Style cinématique</button></div>
            </div>}

            <div className="canvas-panel">
              <div className="canvas-head"><div><span className="number">02</span><strong>Zone de travail</strong></div><div className="canvas-actions"><button onClick={() => fileRef.current?.click()}>＋ Importer</button><button onClick={() => {setImage(null);setResult(null);setNotice("Zone de travail vidée.");}}>Réinitialiser</button></div></div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => upload(e.target.files?.[0])}/>
              <div className="canvas">
                {shown ? <div className="image-wrap"><img src={shown} alt="Aperçu de votre création" style={{filter:`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter === "mono" ? "grayscale(1)" : filter === "sepia" ? "sepia(1)" : ""}`}}/></div> :
                  <button className="upload-zone" onClick={() => fileRef.current?.click()}><span className="upload-icon">⇧</span><strong>Déposez une image ici</strong><span>ou cliquez pour parcourir vos fichiers</span><small>PNG · JPG · WEBP</small></button>}
              </div>
              <div className="canvas-foot"><span>APERÇU DE L'ÉDITEUR</span><span>{shown ? "Image chargée" : "Aucun document ouvert"} · 100%</span></div>
            </div>
            <div className="notice"><span>●</span>{notice}</div>
          </section>

          <aside className="properties">
            <div className="right-title">PROPRIÉTÉS <span>⌘</span></div>
            <section className="prop-section"><h3>Réglages de l'image</h3>
              <Slider label="Luminosité" value={brightness} set={setBrightness}/>
              <Slider label="Contraste" value={contrast} set={setContrast}/>
              <Slider label="Saturation" value={saturation} set={setSaturation}/>
              <label className="select-label">Filtre<select value={filter} onChange={e => setFilter(e.target.value)}><option value="none">Aucun</option><option value="mono">Noir et blanc</option><option value="sepia">Sépia</option></select></label>
              <button className="reset-btn" onClick={() => {setBrightness(100);setContrast(100);setSaturation(100);setFilter("none");}}>↺ Réinitialiser les réglages</button>
            </section>
            <section className="prop-section layers"><div className="layers-head"><h3>Calques</h3><button onClick={() => setLayers([...layers, {id:Date.now(), name:`Calque ${layers.length+1}`, visible:true}])}>＋</button></div>
              {layers.map(layer => <div className="layer" key={layer.id}><button className="eye" onClick={() => setLayers(layers.map(x => x.id === layer.id ? {...x, visible:!x.visible} : x))}>{layer.visible ? "◉" : "○"}</button><span className="layer-thumb">▧</span><span>{layer.name}</span><button className="delete" onClick={() => setLayers(layers.filter(x => x.id !== layer.id))}>×</button></div>)}
              {layers.length === 0 && <p className="empty-layers">Aucun calque pour le moment.</p>}
            </section>
            <div className="tip"><span>✦ CONSEIL</span><p>Importez une photo pour commencer à la retoucher, ou décrivez une idée dans le panneau de création.</p></div>
          </aside>
        </div>
        <footer className="footer"><span>STUDIO IA <b>·</b> CRÉEZ SANS LIMITES</span><span>Conçu avec soin <b>✦</b> MD Bujold</span></footer>
      </section>
    </main>
  );
}

function Slider({label, value, set}:{label:string; value:number; set:(n:number)=>void}) {
  return <div className="slider-control"><div><label>{label}</label><span>{value}%</span></div><input type="range" min="0" max="200" value={value} onChange={e => set(Number(e.target.value))}/></div>;
}