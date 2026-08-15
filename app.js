const DATA = window.WANHUA_DATA;
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cleanTeacher = name => String(name || '').replace(/老師$|老$/,'');
const teacherLabel = name => `${cleanTeacher(name)}老師`;
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
      <div class="story-image"><img loading="lazy" src="${escapeHTML(story.images[0])}" alt="${escapeHTML(story.course)}學習紀錄"></div>
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
    <img class="modal-image" src="${escapeHTML(story.images[0])}" alt="${escapeHTML(story.course)}學習紀錄">
    <div class="story-full-text">${paragraphs}</div>`);
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
  if (event.target.closest('.close')) $('#modal').close();
  if (event.target.id === 'moreCourses'){ courseLimit += 9; renderCourses(); }
  if (event.target.closest('#moreTeachers')) slideRail($('#teacherRail'));
  if (event.target.closest('#moreStories')) slideRail($('#storyList'));
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
