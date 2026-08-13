
function teacherPhoto(t, cls="avatar"){
  if(t && t.photo_url) return `<div class="${cls}"><img src="${esc(t.photo_url)}" alt="${esc(t.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='${esc(initial(t.name))}'"></div>`;
  return `<div class="${cls}">${esc(initial(t?.name||"萬"))}</div>`;
}
function verifiedLine(t){
  return t && t.verified_note ? `<span class="verify">✓ 已對照公開課程資料</span>` : "";
}
function officialLink(t){
  return t && t.official_url ? `<a class="official-link" href="${esc(t.official_url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">查看萬華社大公開課程資料 →</a>` : "";
}


const D = window.WANHUA_DATA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let teacherTag = "";

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function initial(name){return (name||"萬").trim().slice(0,1);}
function chips(arr, cls=""){return (arr||[]).filter(Boolean).slice(0,8).map(x=>`<span class="chip ${cls}">${esc(x)}</span>`).join("");}

function showPage(id){
  $$(".page").forEach(p=>p.classList.remove("active"));
  const el=$("#"+id); if(el) el.classList.add("active");
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{const btn=e.target.closest("[data-page]");if(btn)showPage(btn.dataset.page);});

$("#statCourses").textContent=D.stats.courses;
$("#statTeachers").textContent=D.stats.teachers;
$("#statStories").textContent=D.stats.stories || D.stories.length;

// Courses
function renderCourses(){
  const q=$("#courseSearch").value.trim().toLowerCase();
  const cat=$("#courseCategory").value, dom=$("#courseDomain").value, grp=$("#courseGroup").value;
  const list=D.courses.filter(c=>{
    const text=(c.name+" "+c.description+" "+c.teacher).toLowerCase();
    return (!q||text.includes(q)) && (!cat||c.category===cat) && (!dom||c.domains.includes(dom)) && (!grp||c.group===grp);
  });
  $("#courseCount").textContent=`找到 ${list.length} 門課程`;
  $("#courseGrid").innerHTML=list.map(c=>`
    <article class="course-card" data-course="${esc(c.id)}">
      <div class="mini">${esc(c.category)} · ${esc(c.subcategory)} · ${esc(c.id)}</div>
      <h3>${esc(c.name)}</h3><div class="mini">授課教師｜${esc(c.teacher)}</div>
      <div class="chips">${chips(c.domains)}${chips([c.group],"gold")}${chips(c.sdgs.slice(0,4),"dark")}</div>
    </article>`).join("") || `<div class="course-card"><h3>沒有符合的課程</h3><p>請調整搜尋或篩選條件。</p></div>`;
}
["courseSearch","courseCategory","courseDomain","courseGroup"].forEach(id=>$("#"+id).addEventListener("input",renderCourses));
$("#clearCourse").onclick=()=>{$("#courseSearch").value="";$("#courseCategory").value="";$("#courseDomain").value="";$("#courseGroup").value="";renderCourses();};
$("#courseGrid").addEventListener("click",e=>{const c=e.target.closest("[data-course]");if(c)openCourse(c.dataset.course);});

// Teachers
function renderTeacherTags(){
  const tags=[...new Set(D.teachers.flatMap(t=>t.specialties))].filter(Boolean).slice(0,28);
  $("#teacherTags").innerHTML=`<button class="${teacherTag===""?"active":""}" data-tag="">全部</button>`+
    tags.map(t=>`<button class="${teacherTag===t?"active":""}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
}
function renderTeachers(){
  const q=$("#teacherSearch").value.trim().toLowerCase();
  const list=D.teachers.filter(t=>{
    const text=(t.name+" "+t.bio+" "+t.courses.join(" ")+" "+t.specialties.join(" ")+" "+t.domains.join(" ")).toLowerCase();
    return (!q||text.includes(q)) && (!teacherTag||t.specialties.includes(teacherTag));
  });
  $("#teacherCount").textContent=`找到 ${list.length} 位教師`;
  $("#teacherGrid").innerHTML=list.map(t=>`
    <article class="teacher-card" data-teacher="${esc(t.id)}">
      <div class="teacher-top">${teacherPhoto(t)}<div><div class="mini">萬華社區大學教師</div><h3>${esc(t.name)}</h3></div></div>
      <p class="specialty">${esc((t.verified_specialty||t.specialties.slice(0,3).join("｜")||"專長資料待補"))}</p>${verifiedLine(t)}
      <div class="chips">${chips(t.domains)}${chips(t.groups.slice(0,2),"gold")}</div>
      <div class="mini" style="margin-top:14px">授課 ${t.courses.length} 門 · 查看完整人物誌 →</div>
    </article>`).join("");
}
$("#teacherSearch").addEventListener("input",renderTeachers);
$("#teacherTags").addEventListener("click",e=>{const b=e.target.closest("[data-tag]");if(b){teacherTag=b.dataset.tag;renderTeacherTags();renderTeachers();}});
$("#teacherGrid").addEventListener("click",e=>{const t=e.target.closest("[data-teacher]");if(t)openTeacher(t.dataset.teacher);});

function openTeacher(id){
  const t=D.teachers.find(x=>x.id===id); if(!t)return;
  const related=D.courses.filter(c=>t.courses.includes(c.name));
  const teacherStories=(D.stories||[]).filter(s=>s.teacher===t.name || t.courses.includes(s.course));
  $("#teacherDetailContent").innerHTML=`
    <div class="detail-hero">${teacherPhoto(t)}
      <div><div class="eyebrow">LOCAL LEARNING TALENT</div><h2>${esc(t.name)}</h2><p>${esc(t.bio)}</p><div class="detail-tags">${chips(t.specialties)}${chips(t.domains)}${chips(t.groups,"gold")}</div>${officialLink(t)}</div></div>
    </div>
    <div class="detail-section"><h3>📚 在萬華社大授課</h3><div class="course-list">${related.map(c=>`<div class="course-link" data-course="${esc(c.id)}"><b>${esc(c.name)}</b><div class="mini">${esc(c.category)} · ${esc(c.group)}</div></div>`).join("")}</div></div>
    ${teacherStories.length?`<div class="detail-section"><h3>💬 115-1 學員故事</h3><div class="course-list">${teacherStories.map(s=>`<div class="course-link" data-story="${esc(s.id)}"><b>${esc(s.title)}</b><div class="mini">${s.images.length} 張照片</div></div>`).join("")}</div></div>`:""}
    <div class="detail-section"><h3>📖 出版品與作品</h3><p>出版品採既有 Google Sites 為正式內容庫；之後可在每位教師頁自動帶入對應出版品。</p><button class="primary" data-page="publications">前往教師出版品專區 →</button></div>`;
  showPage("teacherDetail");
  $("#teacherDetailContent").querySelectorAll("[data-course]").forEach(el=>el.onclick=()=>openCourse(el.dataset.course));
  $("#teacherDetailContent").querySelectorAll("[data-story]").forEach(el=>el.onclick=()=>openStory(el.dataset.story));
}
function openCourse(id){
  const c=D.courses.find(x=>x.id===id); if(!c)return;
  const relatedStories=(D.stories||[]).filter(s=>s.course===c.name);
  $("#courseDetailContent").innerHTML=`
    <div class="detail-hero"><div class="avatar">${esc(c.category.slice(0,1))}</div>
      <div><div class="eyebrow">${esc(c.category)} · ${esc(c.subcategory)}</div><h2>${esc(c.name)}</h2><p>${esc(c.description||"課程介紹待補。")}</p><div class="detail-tags">${chips(c.domains)}${chips([c.group],"gold")}${chips(c.sdgs,"dark")}</div></div>
    </div>
    <div class="detail-section"><h3>👩‍🏫 授課教師</h3><div class="course-link" id="courseTeacherLink"><b>${esc(c.teacher)}</b><div class="mini">查看教師人物誌 →</div></div></div>
    ${relatedStories.length?`<div class="detail-section"><h3>💬 115-1 學習故事</h3>${relatedStories.map(s=>`<div class="course-link" data-story="${esc(s.id)}"><b>${esc(s.title)}</b><div class="mini">${s.images.length} 張照片 · 閱讀故事 →</div></div>`).join("")}</div>`:""}
    <div class="detail-section"><h3>🧭 課程定位</h3><p>包含領域：${esc(c.domains.join("、")||"待補")}｜所屬學群：${esc(c.group)}</p><p>SDGs：${esc(c.sdgs.join("、"))}</p></div>`;
  showPage("courseDetail");
  $("#courseTeacherLink").onclick=()=>{const t=D.teachers.find(x=>x.name===c.teacher);if(t)openTeacher(t.id);};
  $("#courseDetailContent").querySelectorAll("[data-story]").forEach(el=>el.onclick=()=>openStory(el.dataset.story));
}

// Stories
function renderStories(){
  const q=$("#storySearch").value.trim().toLowerCase();
  const typ=$("#storyType").value;
  const list=D.stories.filter(s=>{
    const text=(s.course+" "+s.teacher+" "+s.title+" "+s.excerpt+" "+s.full_text).toLowerCase();
    const typeOK=!typ || (typ==="text" && !!s.full_text) || (typ==="photo" && !s.full_text);
    return (!q||text.includes(q)) && typeOK;
  });
  $("#storyCount").textContent=`115-1 共整理 ${list.length} 組學習故事／課堂紀錄`;
  $("#storyGrid").innerHTML=list.map(s=>{
    const cover=s.images[0];
    return `<article class="story-card" data-story="${esc(s.id)}">
      <div class="story-cover ${cover?"":"no-photo"}">${cover?`<img loading="lazy" src="${esc(cover)}" alt="${esc(s.course)}">`:`<img src="assets/brand/wanhua-logo.png" alt="">`}<span class="story-badge">${s.full_text?"學員心得":"影像紀錄"}</span></div>
      <div class="story-body"><div class="story-meta">${esc(s.semester)} · ${esc(s.teacher||"教師資料待補")}</div><h3>${esc(s.title)}</h3><p>${esc(s.excerpt)}</p><div class="story-media-count">📷 ${s.images.length} 張照片${s.video_count?` · 🎬 原始資料含 ${s.video_count} 支影片`:""} · 查看完整內容 →</div></div>
    </article>`;
  }).join("");
}
$("#storySearch").addEventListener("input",renderStories);
$("#storyType").addEventListener("input",renderStories);
$("#storyGrid").addEventListener("click",e=>{const x=e.target.closest("[data-story]");if(x)openStory(x.dataset.story);});

function openStory(id){
  const s=D.stories.find(x=>x.id===id); if(!s)return;
  const cover=s.images[0];
  const course=D.courses.find(c=>c.name===s.course);
  $("#storyDetailContent").innerHTML=`
    <div class="story-detail-head">
      <div><div class="eyebrow">${esc(s.semester)} · LEARNING STORY</div><h2>${esc(s.title)}</h2><p class="story-meta">課程｜${esc(s.course)}${s.teacher?`　教師｜${esc(s.teacher)}`:""}</p><div class="chips">${chips(s.domains)}${chips([s.group],"gold")}${chips(s.sdgs.slice(0,5),"dark")}</div><p style="color:#65766d;margin-top:20px">原始資料夾：${esc(s.source_folder)}<br>本頁課名已依心得文字、教師資料與資料夾關鍵字交叉辨識。</p>${course?`<button class="secondary" data-course="${esc(course.id)}">查看 115-2 對應課程 →</button>`:""}</div>
      <div class="cover ${cover?"":"logo"}">${cover?`<img src="${esc(cover)}" alt="${esc(s.course)}">`:`<img src="assets/brand/wanhua-logo.png" alt="">`}</div>
    </div>
    <div class="detail-section"><h3>💬 學員心得</h3>${s.full_text?`<div class="story-text">${esc(s.full_text)}</div>`:`<p>此資料夾未附文字心得，目前以課堂照片作為學習成果紀錄。</p>`}</div>
    <div class="detail-section"><h3>📷 課堂照片 <span class="mini">${s.images.length} 張</span></h3>
      ${s.images.length?`<div class="photo-gallery">${s.images.map((img,i)=>`<a href="${esc(img)}" target="_blank" title="開啟照片 ${i+1}"><img loading="lazy" src="${esc(img)}" alt="${esc(s.course)}照片 ${i+1}"></a>`).join("")}</div>`:`<p>此筆資料沒有照片。</p>`}
      ${s.video_count?`<div class="video-note">原始 ZIP 另含 ${s.video_count} 支影片。為了讓免費網站版本維持較小容量，本 Demo 未打包大型影片；正式上線可改用 Google Drive／YouTube 嵌入。</div>`:""}
    </div>`;
  showPage("storyDetail");
  $("#storyDetailContent").querySelectorAll("[data-course]").forEach(el=>el.onclick=()=>openCourse(el.dataset.course));
}

$("#publicationLink").href=D.site.publication_url;
renderCourses();renderTeacherTags();renderTeachers();renderStories();


function renderHome(){
  const featureNames=["李欣融","陳建志","吳讚軒","林淑媛","陳金泉"];
  const featured=featureNames.map(n=>D.teachers.find(t=>t.name===n)).filter(Boolean).slice(0,5);
  const f=$("#featuredTeacherGrid");
  if(f) f.innerHTML=featured.map(t=>`
    <article class="featured-teacher" data-teacher="${esc(t.id)}">
      <div class="teacher-media">${t.photo_url?`<img src="${esc(t.photo_url)}" alt="${esc(t.name)}" loading="lazy" referrerpolicy="no-referrer">`:`<div class="teacher-initial">${esc(initial(t.name))}</div>`}</div>
      <div class="teacher-copy"><div class="mini">${esc(t.domains.slice(0,2).join("・")||"萬華社大教師")}</div><h3>${esc(t.name)}</h3><p>${esc(t.verified_specialty||t.specialties.slice(0,2).join("｜")||"教師專業資料")}</p>${verifiedLine(t)}</div>
    </article>`).join("");
  if(f) f.querySelectorAll("[data-teacher]").forEach(el=>el.onclick=()=>openTeacher(el.dataset.teacher));
  const hs=$("#homeStoryGrid");
  if(hs){
    hs.innerHTML=(D.stories||[]).slice(0,3).map(s=>{
      const cover=s.images&&s.images[0];
      return `<article class="story-card" data-story="${esc(s.id)}"><div class="story-cover ${cover?"":"no-photo"}">${cover?`<img src="${esc(cover)}" alt="${esc(s.course)}">`:`<img src="assets/brand/wanhua-logo.png" alt="">`}<span class="story-badge">${s.full_text?"學員心得":"影像紀錄"}</span></div><div class="story-body"><div class="story-meta">${esc(s.semester)} · ${esc(s.teacher||"")}</div><h3>${esc(s.title)}</h3><p>${esc(s.excerpt)}</p></div></article>`;
    }).join("");
    hs.querySelectorAll("[data-story]").forEach(el=>el.onclick=()=>openStory(el.dataset.story));
  }
}
const mt=$("#menuToggle"); if(mt) mt.onclick=()=>$("#mainNav").classList.toggle("open");

renderHome();