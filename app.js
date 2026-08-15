const DATA = window.WANHUA_DATA;
const COMMUNITY_ACTIONS = [
  {
    id:'river-forum',date:'2026.08.01',type:'RIVER ACTION｜流域行動',image:'action-river-forum.webp',
    title:'從新店溪出發 讓流域成為共同的課堂',
    paragraphs:[
      '新店溪孕育臺北盆地的人文聚落與自然生態，也是串聯地方文化、環境教育與公民參與的重要流域。面對氣候變遷、都市發展與水環境治理等挑戰，這場論壇讓不同領域的經驗進入同一個對話現場。',
      '從課堂走向流域，學習不只累積知識，也在跨域合作與全民參與中形成守護河川的行動。'
    ]
  },
  {
    id:'memory-walk',date:'2026.07.08',type:'CARE｜社區照顧',image:'action-memory-walk.webp',
    title:'陪長輩走回熟悉的萬華日常',
    paragraphs:[
      '萬華社大與頂碩里、一粒麥子日照中心共同辦理兩場失智長輩社區走讀暨生活體驗。長輩在志工陪伴下走進熟悉街道，從採買食材、辨認日常用品，到分享曾經的市場記憶。',
      '一把豆芽菜、一袋牛奶，都可能打開記憶的話匣子。走讀在這裡不是參觀，而是讓生活經驗重新被聽見，也讓失智友善成為社區裡真實可感的同行。'
    ]
  },
  {
    id:'river-sharing',date:'2026.07.13',type:'FIELD NOTES｜流域共學',image:'action-river-sharing.webp',
    title:'九位學員與教師 把河岸觀察帶回社區',
    paragraphs:[
      '「家河溪望」夏季分享會集結一學期在新店溪、淡水河與萬華水岸的走讀、觀察和實踐。九位學員與教師分享鸕鶿與鰻魚生態、河岸植物、礫間處理場、河岸生活故事與課程影像製作。',
      '地方知識不是一次活動的成果，而是在觀察、記錄與彼此交流中慢慢累積。每一次分享，都為下一次走進流域準備更清楚的視角。'
    ]
  },
  {
    id:'community-parade',date:'2026.01.31',type:'VOLUNTEERS｜志工同行',image:'action-community-parade.webp',
    title:'四十位夥伴 用腳步傳遞萬華的溫暖',
    paragraphs:[
      '萬華社大志工隊與社區夥伴共同參與「走街穿巷・愛聚萬華」，約四十位志工走過華西街、廣州街、康定路、和平西路與艋舺文創區，向長期支持弱勢長者與兒童家庭的友善店家表達感謝。',
      '龍韻口琴班與錫口笛班也把課堂帶上街角，以音樂為踩街加入溫度。學習不只被展示，更成為連結店家、居民與社區組織的公共行動。'
    ]
  },
  {
    id:'reuse-charity',date:'2026.07.02',type:'REUSE｜惜物分享',image:'action-reuse-charity.webp',
    title:'讓一件好物 成為善意循環的開始',
    paragraphs:[
      '學員捐出的良好物品，一部分先分享給萬華區社福單位與老人服務中心，其餘在成果展進行二手惜物義賣，讓物品延續使用，也讓分享的心意繼續流動。',
      '義賣所得新臺幣 6,200 元由萬華社大志工隊全數捐出，作為萬華兒童中心愛心代用餐券。惜物因此同時成為環境行動與社區照顧。'
    ]
  }
];
const FACEBOOK_STORY_IMAGES = {
  'story-01-01':'fb-story-flute-01.webp','story-01-02':'fb-story-flute-02.webp','story-01-03':'fb-story-flute-03.webp',
  'story-01-04':'fb-story-flute-04.webp','story-01-05':'fb-story-flute-05.webp','story-01-06':'fb-story-flute-06.webp',
  'story-03':'fb-story-flamenco-01.webp','story-04':'fb-story-flower-01.webp','story-06':'fb-story-indigo-01.webp',
  'story-07':'fb-story-african-drum-01.webp','story-08-01':'fb-story-harmonica-b-01.webp','story-08-02':'fb-story-harmonica-b-02.webp',
  'story-11-01':'fb-story-harmonica-ensemble-01.webp','story-11-02':'fb-story-harmonica-ensemble-02.webp',
  'story-11-03':'fb-story-harmonica-ensemble-03.webp','story-11-04':'fb-story-harmonica-ensemble-04.webp',
  'story-11-05':'fb-story-harmonica-ensemble-05.webp','story-11-06':'fb-story-harmonica-ensemble-06.webp',
  'story-11-07':'fb-story-harmonica-ensemble-07.webp','story-13':'fb-story-coffee-01.webp','story-14':'fb-story-cycling-01.webp',
  'story-15':'fb-story-clogging-01.webp','story-16-01':'fb-story-harmonica-a-01.webp','story-16-02':'fb-story-harmonica-a-02.webp',
  'story-16-03':'fb-story-harmonica-a-03.webp','story-16-04':'fb-story-harmonica-a-04.webp','story-16-05':'fb-story-harmonica-a-05.webp',
  'story-20':'fb-story-enamel-01.webp','story-21':'fb-story-mandolin-01.webp','story-23-01':'fb-story-painting-01.webp',
  'story-23-02':'fb-story-painting-02.webp','story-23-03':'fb-story-painting-03.webp'
};
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cleanTeacher = name => String(name || '').replace(/老師$|老$/,'');
const teacherLabel = name => `${cleanTeacher(name)}老師`;
const storyImage = story => FACEBOOK_STORY_IMAGES[story.id] || story.images[0];
const figureOrder = [3,7,1,6,4,0,5,2];
const loopRailState = new WeakMap();

function polishFacultyText(value){
  return String(value || '')
    .replace(/\r\n?/g,'\n')
    .replace(/_{1,}|>{2,}/g,' ')
    .replace(/[●•]+/g,' ')
    .replace(/[﹝“]/g,'「')
    .replace(/[﹞”]/g,'」')
    .replace(/現任\s*[:：]/g,'現任：')
    .replace(/經歷：\s*經歷：/g,'經歷：')
    .replace(/[\t　]+/g,' ')
    .replace(/\s+/g,' ')
    .replace(/\s+([，。；：])/g,'$1')
    .replace(/([，。；：])\1+/g,'$1')
    .trim();
}

function facultyProfile(value){
  const source = String(value || '')
    .replace(/^\s*1\.\s*現職：/,'現職：')
    .replace(/，\s*經歷：/,'\n經歷：')
    .replace(/萬華社大講師\s*經歷：/,'萬華社大講師\n經歷：');
  const marker = source.indexOf('\n經歷：');
  const rawCurrent = marker >= 0 ? source.slice(0,marker).replace(/^現職：/,'') : '';
  const experience = marker >= 0 ? source.slice(marker + 4) : source.replace(/^現職：/,'');
  const otherCurrent = polishFacultyText(rawCurrent)
    .replace(/(?:^|[｜、，；]\s*)萬華(?:社大|社區大學)講師/g,'')
    .replace(/^[｜、，；\s]+|[｜、，；\s]+$/g,'');
  return {
    current: ['萬華社大講師',otherCurrent].filter(Boolean).join('｜'),
    experience: polishFacultyText(experience).replace(/^經歷：\s*/,'')
  };
}

function installInfiniteRail(container){
  if (!container || loopRailState.has(container)) return;
  const state = {ticking:false,setWidth:0};
  loopRailState.set(container,state);
  container.addEventListener('scroll',() => {
    if (state.ticking || !state.setWidth) return;
    state.ticking = true;
    requestAnimationFrame(() => {
      const left = container.scrollLeft;
      if (left < state.setWidth * .5) container.scrollLeft = left + state.setWidth;
      if (left > state.setWidth * 1.5) container.scrollLeft = left - state.setWidth;
      state.ticking = false;
    });
  },{passive:true});
}

function renderInfiniteRail(container,items,template){
  installInfiniteRail(container);
  const copies = [0,1,2].flatMap(copy => items.map((item,index) => ({item,index,copy})));
  container.innerHTML = copies.map(({item,index,copy}) => template(item,index,copy)).join('');
  requestAnimationFrame(() => {
    const state = loopRailState.get(container);
    state.setWidth = container.scrollWidth / 3;
    container.scrollLeft = state.setWidth;
  });
}

function slideRail(container){
  if (!container) return;
  const card = container.querySelector(':scope > article');
  const styles = getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap) || 0;
  const distance = card ? card.getBoundingClientRect().width + gap : container.clientWidth * .82;
  container.scrollBy({left:distance,behavior:'smooth'});
}

let activeDomain = '';
let activeGroup = '';
let courseLimit = 9;

function showModal(content){
  $('#modalContent').innerHTML = `<div class="modal-body">${content}</div>`;
  $('#modal').showModal();
}

function syncFilterButtons(){
  document.querySelectorAll('[data-filter-domain]').forEach(button => {
    const active = button.dataset.filterDomain === activeDomain;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  document.querySelectorAll('[data-filter-group]').forEach(button => {
    const active = button.dataset.filterGroup === activeGroup;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}

function renderCourses(){
  const query = $('#courseSearch').value.trim().toLowerCase();
  const courses = DATA.courses.filter(course => {
    const domainMatch = !activeDomain || course.domains.includes(activeDomain);
    const groupMatch = !activeGroup || course.group === activeGroup;
    const searchable = [course.name,course.teacher,course.description,course.category,course.subcategory,course.group,...course.domains].join(' ').toLowerCase();
    return domainMatch && groupMatch && (!query || searchable.includes(query));
  });
  $('#courseTitle').textContent = '找到下一段學習旅程';
  $('#clearFilters').hidden = !activeDomain && !activeGroup && !query;
  syncFilterButtons();
  $('#courseGrid').innerHTML = courses.slice(0,courseLimit).map(course => `
    <article class="course-card" data-course="${escapeHTML(course.id)}" tabindex="0">
      <small>${escapeHTML(course.domains.join(' · '))}</small>
      <h4>${escapeHTML(course.name)}</h4>
      <p>${escapeHTML(cleanTeacher(course.teacher))}</p>
      <span>${escapeHTML(course.group)}　→</span>
    </article>`).join('') || '<p class="empty-state">目前沒有符合條件的課程　請調整篩選或搜尋文字</p>';
  $('#moreCourses').hidden = courses.length <= courseLimit;
}

function renderTeachers(){
  renderInfiniteRail($('#teacherRail'),DATA.teachers,(teacher,index,copy) => {
    const figure = figureOrder[index % figureOrder.length] + 1;
    const visibleName = teacher.name === '孫家偉' ? '孫家偉老師' : teacher.name;
    return `<article class="teacher-card" data-teacher="${escapeHTML(teacher.id)}" tabindex="${copy === 1 ? '0' : '-1'}"${copy === 1 ? '' : ' aria-hidden="true"'}>
      <div class="portrait"><img loading="lazy" src="figure-${String(figure).padStart(2,'0')}.png" alt="社區師資公仔 ${figure}"></div>
      <h3>${escapeHTML(visibleName)}</h3>
      <p>${escapeHTML(teacher.verified_specialty || teacher.specialties.slice(0,2).join('・'))}</p>
      <small>VIEW PROFILE｜查看教師資料 →</small>
    </article>`;
  });
}

function renderStories(){
  renderInfiniteRail($('#storyList'),DATA.stories,(story,index,copy) => `
    <article class="story-card" data-story="${escapeHTML(story.id)}" tabindex="${copy === 1 ? '0' : '-1'}"${copy === 1 ? '' : ' aria-hidden="true"'}>
      <div class="story-image"><img loading="lazy" src="${escapeHTML(storyImage(story))}" alt="${escapeHTML(story.course)}學習紀錄"></div>
      <div class="story-copy">
        <small>LEARNING STORY｜學習故事 · ${escapeHTML(story.semester)}</small>
        <h3>${escapeHTML(story.course)}</h3>
        <p>${escapeHTML((story.excerpt || '以影像記錄課堂裡的學習與相遇').slice(0,120))}${story.excerpt && story.excerpt.length > 120 ? '…' : ''}</p>
        <em>${escapeHTML(teacherLabel(story.teacher))}</em>
        <b>${escapeHTML(story.student || '匿名學員')}　READ｜閱讀 →</b>
      </div>
    </article>`);
}

function openCourse(id){
  const course = DATA.courses.find(item => item.id === id);
  if (!course) return;
  showModal(`<span class="eyebrow">${escapeHTML(course.domains.join(' · '))}</span>
    <h2>${escapeHTML(course.name)}</h2><h3>${escapeHTML(teacherLabel(course.teacher))}</h3>
    <p>${escapeHTML(course.description)}</p>
    <div>${[course.group,...course.sdgs].map(item => `<span class="pill">${escapeHTML(item)}</span>`).join('')}</div>
    ${course.official_url ? `<p><a class="text-button" target="_blank" rel="noopener" href="${escapeHTML(course.official_url)}">前往官方課程頁 ↗</a></p>` : ''}`);
}

function openTeacher(id){
  const teacher = DATA.teachers.find(item => item.id === id);
  if (!teacher) return;
  const visibleName = teacher.name === '孫家偉' ? '孫家偉老師' : teacher.name;
  const profile = facultyProfile(teacher.bio);
  showModal(`<span class="eyebrow">COMMUNITY FACULTY｜社區師資</span>
    <h2>${escapeHTML(visibleName)}</h2><h3>${escapeHTML(teacher.verified_specialty || teacher.specialties.join('・'))}</h3>
    <h3>師資簡介</h3>
    <div class="faculty-profile">
      <p><b>現職：</b><span>${escapeHTML(profile.current)}</span></p>
      <p><b>經歷：</b><span>${escapeHTML(profile.experience)}</span></p>
    </div>
    <h3>開設課程</h3><p>${teacher.courses.map(escapeHTML).join('<br>')}</p>
    <div>${[...teacher.domains,...teacher.groups,...teacher.sdgs].map(item => `<span class="pill">${escapeHTML(item)}</span>`).join('')}</div>
    ${teacher.official_url ? `<p><a class="text-button" target="_blank" rel="noopener" href="${escapeHTML(teacher.official_url)}">查看官方資料 ↗</a></p>` : ''}`);
}

function openStory(id){
  const story = DATA.stories.find(item => item.id === id);
  if (!story) return;
  const paragraphs = String(story.full_text || story.excerpt || '本則以影像記錄學習現場')
    .split(/\n{2,}/)
    .filter(Boolean)
    .map(text => `<p>${escapeHTML(text)}</p>`)
    .join('');
  showModal(`<span class="eyebrow">${escapeHTML(story.semester)} · LEARNING STORY｜學習故事</span>
    <h2>${escapeHTML(story.course)}</h2><h3>${escapeHTML(story.student || '匿名學員')}｜${escapeHTML(teacherLabel(story.teacher))}</h3>
    <img class="modal-image" src="${escapeHTML(storyImage(story))}" alt="${escapeHTML(story.course)}學習紀錄">
    <div class="story-full-text">${paragraphs}</div>`);
}

function openAction(id){
  const action = COMMUNITY_ACTIONS.find(item => item.id === id);
  if (!action) return;
  showModal(`<span class="eyebrow">${escapeHTML(action.date)} · ${escapeHTML(action.type)}</span>
    <h2>${escapeHTML(action.title)}</h2>
    <img class="modal-image" src="${escapeHTML(action.image)}" alt="${escapeHTML(action.title)}行動紀錄">
    <div class="story-full-text">${action.paragraphs.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('')}</div>`);
}

function openFramework(){
  showModal(`<span class="eyebrow">ABOUT LEARNING｜學習架構</span><h2>三大領域連結終身學習與永續行動</h2>
    <div class="framework-visual"><article><b>LOCAL｜地方</b><h3>萬華地方學</h3><p>從地方歷史、文化、產業與街區出發。</p></article><article><b>SUSTAINABLE｜永續</b><h3>永續實踐</h3><p>讓環境意識成為日常生活的行動。</p></article><article><b>ACTIVE｜活躍</b><h3>活躍老化</h3><p>以健康、創作與參與支持終身學習。</p></article></div>
    <h3>四大學群</h3><p>A 環境永續　B 族群關懷　C 社區培力　D 文化深耕</p>
    <img class="framework-image" src="lifelong-learning.png" alt="終身學習素養架構圖">
    <img class="framework-image" src="sdgs.png" alt="永續發展目標圖">`);
}

document.addEventListener('click', event => {
  const domainFilter = event.target.closest('[data-filter-domain]');
  if (domainFilter){
    activeDomain = domainFilter.dataset.filterDomain;
    courseLimit = 9;
    renderCourses();
    return;
  }
  const groupFilter = event.target.closest('[data-filter-group]');
  if (groupFilter){
    activeGroup = groupFilter.dataset.filterGroup;
    courseLimit = 9;
    renderCourses();
    return;
  }
  const field = event.target.closest('.field');
  if (field){
    activeDomain = field.dataset.domain;
    activeGroup = '';
    courseLimit = 9;
    renderCourses();
    $('#explore').scrollIntoView({behavior:'smooth'});
    return;
  }
  const course = event.target.closest('.course-card');
  if (course) return openCourse(course.dataset.course);
  const teacher = event.target.closest('.teacher-card');
  if (teacher) return openTeacher(teacher.dataset.teacher);
  const story = event.target.closest('.story-card');
  if (story) return openStory(story.dataset.story);
  const action = event.target.closest('.action-story');
  if (action) return openAction(action.dataset.action);
  if (event.target.closest('.close')) $('#modal').close();
  if (event.target.id === 'moreCourses'){ courseLimit += 9; renderCourses(); }
  if (event.target.closest('#moreTeachers')) slideRail($('#teacherRail'));
  if (event.target.closest('#moreStories')) slideRail($('#storyList'));
  if (event.target.closest('#moreActions')) slideRail($('#actionRail'));
  if (event.target.id === 'clearFilters'){
    activeDomain = '';
    activeGroup = '';
    courseLimit = 9;
    $('#courseSearch').value = '';
    renderCourses();
  }
  if (event.target.closest('#frameworkOpen')) openFramework();
  if (event.target.closest('#lifelongOpen')) showModal(`<span class="eyebrow">LIFELONG LEARNING｜終身學習</span><h2>終身學習素養架構</h2><img class="framework-image" src="lifelong-learning.png" alt="終身學習素養架構圖"><p>以終身學習者為核心，連結自主行動、溝通互動與社會參與。</p>`);
  if (event.target.closest('#sdgsOpen')) showModal(`<span class="eyebrow">SUSTAINABLE DEVELOPMENT GOALS｜永續發展目標</span><h2>SDGs 與我們的課程</h2><img class="framework-image" src="sdgs.png" alt="永續發展目標圖"><p>讓地方課程連結全球永續行動。</p>`);
  const menu = event.target.closest('.menu');
  if (menu){
    $('.site-header').classList.toggle('open');
    menu.setAttribute('aria-expanded',$('.site-header').classList.contains('open'));
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target;
  if (target.matches('.course-card')) openCourse(target.dataset.course);
  if (target.matches('.teacher-card')) openTeacher(target.dataset.teacher);
  if (target.matches('.story-card')) openStory(target.dataset.story);
  if (target.matches('.action-story')) openAction(target.dataset.action);
});

$('#courseSearch').addEventListener('input',() => { courseLimit = 9; renderCourses(); });
$('#modal').addEventListener('click',event => { if (event.target === $('#modal')) $('#modal').close(); });
document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click',() => $('.site-header').classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

renderCourses();
renderTeachers();
renderStories();
