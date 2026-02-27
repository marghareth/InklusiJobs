import { useRef, useState } from "react";
import {
  IcLink, IcX, IcTrash, IcPlus, IcCheck,
  IcUpload, IcTextB, IcImage
} from "./Icons";

export default function CustomSections({ sections, setSections, readOnly }) {
  const fileRef = useRef();
  const [uploadId, setUploadId] = useState(null);
  const [addingLink, setAddingLink] = useState(null);
  const [newLinkData, setNewLinkData] = useState({ label: "", url: "" });

  const patch = (id, data) => setSections(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  const remove = (id) => setSections(p => p.filter(s => s.id !== id));

  const addSection = (type) => {
    const id = `sec_${Date.now()}`;
    if (type === "links") setSections(p => [...p, { id, type: "links", title: "My Links", items: [] }]);
    if (type === "text")  setSections(p => [...p, { id, type: "text",  title: "Additional Info", content: "" }]);
    if (type === "image") setSections(p => [...p, { id, type: "image", title: "Gallery", src: null }]);
  };

  const confirmLink = (secId) => {
    if (!newLinkData.label.trim() || !newLinkData.url.trim()) return;
    const url = newLinkData.url.match(/^https?:\/\//) ? newLinkData.url : `https://${newLinkData.url}`;
    setSections(p => p.map(s => s.id === secId ? {
      ...s,
      items: [...(s.items || []), { id: `lk_${Date.now()}`, label: newLinkData.label, url }]
    } : s));
    setNewLinkData({ label: "", url: "" });
    setAddingLink(null);
  };

  const removeLink = (secId, linkId) =>
    setSections(p => p.map(s => s.id === secId ? { ...s, items: s.items.filter(l => l.id !== linkId) } : s));

  return (
    <div className="cs-root">
      {sections.map(sec => (
        <div key={sec.id} className="cs-sec">
          <div className="cs-sec-head">
            {readOnly ? (
              <h4 className="cs-sec-title">{sec.title}</h4>
            ) : (
              <input
                className="cs-title-inp"
                value={sec.title}
                onChange={e => patch(sec.id, { title: e.target.value })}
              />
            )}
            {!readOnly && (
              <button className="cs-del-btn" onClick={() => remove(sec.id)}>
                <IcTrash /> Remove
              </button>
            )}
          </div>

          {/* LINKS */}
          {sec.type === "links" && (
            <div className="cs-links">
              {(sec.items || []).map(lk => (
                <div key={lk.id} className="cs-link-row">
                  <span className="cs-link-ico"><IcLink /></span>
                  <a href={lk.url} target="_blank" rel="noopener noreferrer" className="cs-link-name">
                    {lk.label}
                  </a>
                  <span className="cs-link-url">{lk.url.replace(/^https?:\/\//, "")}</span>
                  {!readOnly && (
                    <button className="cs-lk-rm" onClick={() => removeLink(sec.id, lk.id)}>
                      <IcX />
                    </button>
                  )}
                </div>
              ))}

              {!readOnly && (
                addingLink === sec.id ? (
                  <div className="cs-link-form">
                    <input className="cs-inp" placeholder="Label (e.g. LinkedIn)"
                      value={newLinkData.label}
                      onChange={e => setNewLinkData(p => ({ ...p, label: e.target.value }))} />
                    <input className="cs-inp" placeholder="URL (e.g. linkedin.com/in/you)"
                      value={newLinkData.url}
                      onChange={e => setNewLinkData(p => ({ ...p, url: e.target.value }))} />
                    <div className="cs-link-form-btns">
                      <button className="cs-confirm-btn" onClick={() => confirmLink(sec.id)}>
                        <IcCheck /> Add Link
                      </button>
                      <button className="cs-cancel-btn" onClick={() => setAddingLink(null)}>
                        <IcX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="cs-add-link-btn" onClick={() => {
                    setAddingLink(sec.id);
                    setNewLinkData({ label: "", url: "" });
                  }}>
                    <IcPlus /> Add a link
                  </button>
                )
              )}
            </div>
          )}

          {/* TEXT */}
          {sec.type === "text" && (
            readOnly ? (
              <p className="cs-text-view">{sec.content || <em style={{ color: "rgba(26,39,68,0.35)" }}>—</em>}</p>
            ) : (
              <textarea
                className="cs-textarea"
                rows={5}
                value={sec.content || ""}
                onChange={e => patch(sec.id, { content: e.target.value })}
                placeholder="Add your content here — a cover note, specialisations, availability…"
              />
            )
          )}

          {/* IMAGE */}
          {sec.type === "image" && (
            <div className="cs-img-area">
              {sec.src ? (
                <>
                  <img src={sec.src} alt="Portfolio" className="cs-img" />
                  {!readOnly && (
                    <button className="cs-img-rm" onClick={() => patch(sec.id, { src: null })}>
                      Remove image
                    </button>
                  )}
                </>
              ) : readOnly ? (
                <div className="cs-img-empty">No image uploaded</div>
              ) : (
                <div className="cs-img-drop" onClick={() => { setUploadId(sec.id); fileRef.current?.click(); }}>
                  <div className="cs-img-drop-ico"><IcUpload /></div>
                  <p className="cs-img-drop-t">Click to upload an image</p>
                  <p className="cs-img-drop-s">PNG · JPG · WEBP — max 5 MB</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <input
        ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file || !uploadId) return;
          const r = new FileReader();
          r.onload = ev => { patch(uploadId, { src: ev.target.result }); setUploadId(null); };
          r.readAsDataURL(file);
          e.target.value = "";
        }}
      />

      {!readOnly && (
        <div className="cs-add-row">
          <span className="cs-add-label">+ Add section</span>
          <button className="cs-add-btn" onClick={() => addSection("links")}><IcLink /> Links</button>
          <button className="cs-add-btn" onClick={() => addSection("text")}><IcTextB /> Text block</button>
          <button className="cs-add-btn" onClick={() => addSection("image")}><IcImage /> Image</button>
        </div>
      )}
    </div>
  );
}