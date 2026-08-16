const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const experience = $("#experience");
const spell = $("#spell");
const unlockBtn = $("#unlockBtn");
const unlockMessage = $("#unlockMessage");
const unlockFlash = $("#unlockFlash");
const particles = $("#magicParticles");

// Ambient floating magical particles.
for(let i=0;i<34;i++){
  const p=document.createElement("i");
  p.style.left=(Math.random()*100)+"%";
  p.style.top=(60+Math.random()*50)+"%";
  p.style.animationDuration=(6+Math.random()*9)+"s";
  p.style.animationDelay=(-Math.random()*12)+"s";
  p.style.transform=`scale(${0.5+Math.random()*1.2})`;
  particles.appendChild(p);
}

function unlock(){
  const value = spell.value.trim().toLowerCase();
  if(value !== "alohomora"){
    unlockMessage.textContent = "That spell didn't quite work…";
    spell.animate(
      [{transform:"translateX(-7px)"},{transform:"translateX(7px)"},{transform:"translateX(-3px)"},{transform:"translateX(0)"}],
      {duration:300,easing:"ease-out"}
    );
    return;
  }

  unlockBtn.disabled=true;
  spell.disabled=true;
  unlockMessage.textContent="The castle heard you…";
  unlockMessage.style.color="#d9c178";

  unlockFlash.classList.remove("cast");
  void unlockFlash.offsetWidth;
  unlockFlash.classList.add("cast");

  // A visible burst of individual magical sparks around the unlocking charm.
  const rect = unlockBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for(let i=0;i<42;i++){
    const spark=document.createElement("i");
    spark.className="magic-spark";
    spark.style.left=cx+"px";
    spark.style.top=cy+"px";
    const angle=Math.random()*Math.PI*2;
    const distance=90+Math.random()*260;
    spark.style.setProperty("--dx",Math.cos(angle)*distance+"px");
    spark.style.setProperty("--dy",Math.sin(angle)*distance+"px");
    spark.style.animationDelay=(Math.random()*.18)+"s";
    document.body.appendChild(spark);
    setTimeout(()=>spark.remove(),1500);
  }

  document.body.classList.add("unlocked");

  setTimeout(()=>{
    document.body.classList.remove("locked");
    experience.setAttribute("aria-hidden","false");
    unlockMessage.textContent="The charm worked. Welcome in. ✦";
    document.querySelector("#letter").scrollIntoView({behavior:"smooth"});
  },900);
}
unlockBtn.addEventListener("click",unlock);
spell.addEventListener("keydown",e=>{if(e.key==="Enter") unlock()});

// Slow, dramatic Sorting Hat sequence.
const sortBtn = $("#sortBtn");
const lines = $("#sortingText");
const house = $("#houseReveal");
const sortTitle = $("#sortingTitle");
let sortingRunning = false;
let sortingSeen = false;

function resetSorting(){
  sortingRunning=false;
  sortingSeen=false;
  lines.classList.remove("reveal");
  house.classList.remove("show");
  house.setAttribute("aria-hidden","true");
  sortBtn.disabled=false;
  sortBtn.textContent="SORT ME ✨";
  sortTitle.textContent="Let the Hat decide…";
  $$("#sortingText p").forEach(p=>{p.style.opacity="";p.style.transform=""});
}

sortBtn.addEventListener("click",()=>{
  if(sortingRunning) return;
  sortingRunning=true;
  sortingSeen=true;
  sortBtn.disabled=true;
  sortBtn.textContent="THE HAT IS THINKING…";
  sortTitle.textContent="Hmmmm…";
  lines.classList.remove("reveal");
  house.classList.remove("show");
  void lines.offsetWidth;
  lines.classList.add("reveal");

  // Long enough for every line to be read.
  setTimeout(()=>{
    house.classList.add("show");
    house.setAttribute("aria-hidden","false");
    sortTitle.textContent="I know exactly where you belong.";
    sortBtn.disabled=false;
    sortBtn.textContent="SORT AGAIN ✨";
    sortingRunning=false;
  },7600);
});

// Reset after genuinely leaving the sorting section.
const sortingSection = $("#sorting");
const observer = new IntersectionObserver(entries=>{
  const entry=entries[0];
  if(entry.intersectionRatio < .18 && sortingSeen && !sortingRunning) resetSorting();
},{threshold:[0,.18,.5]});
observer.observe(sortingSection);

// Cinematic section reveal.
const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
    }
  });
},{threshold:.14,rootMargin:"0px 0px -8% 0px"});
$$(".reveal-section").forEach(section=>revealObserver.observe(section));

// Gallery staggered reveal.
const galleryObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      $$("#gallery .gallery figure").forEach((fig,i)=>{
        fig.style.animationDelay=(i*.07)+"s";
      });
      entry.target.classList.add("in-view");
      galleryObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
galleryObserver.observe($("#gallery"));

// Trait popups.
const modal = $("#modal"), modalTitle=$("#modalTitle"), modalText=$("#modalText");
function openModal(title,text){
  modalTitle.textContent=title;
  modalText.textContent=text;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}
$$(".trait").forEach(btn=>btn.addEventListener("click",()=>openModal(btn.dataset.title,btn.dataset.text)));
$("#modalClose").addEventListener("click",closeModal);
$(".modal-backdrop").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

// Always start with the Alohomora experience on a fresh load.
localStorage.removeItem("sweekUnlocked");


// Final enchanted-scroll interaction.
// This is additive: all existing interactions remain unchanged.
const mischiefBtn = document.querySelector("#mischiefBtn");
const finalLetter = document.querySelector("#final .final-letter");
const finalSection = document.querySelector("#final");
const closeSparks = document.querySelector("#closeSparks");
const closingCore = document.querySelector("#closingCore");

function createClosingSparks(){
  closeSparks.innerHTML="";
  const r=finalLetter.getBoundingClientRect();
  const ox=r.left+r.width/2;
  const oy=r.top+r.height/2;
  for(let i=0;i<48;i++){
    const s=document.createElement("i");
    s.className="close-spark";
    s.style.left=ox+"px";
    s.style.top=oy+"px";
    const angle=Math.random()*Math.PI*2;
    const distance=90+Math.random()*320;
    s.style.setProperty("--sx",Math.cos(angle)*distance+"px");
    s.style.setProperty("--sy",Math.sin(angle)*distance+"px");
    s.style.animationDelay=(Math.random()*.18)+"s";
    closeSparks.appendChild(s);
    setTimeout(()=>s.remove(),1600);
  }
}

mischiefBtn?.addEventListener("click",()=>{
  if(finalLetter.classList.contains("scroll-closing")) return;
  mischiefBtn.disabled=true;
  mischiefBtn.textContent="✦ SPELL COMPLETE ✦";
  createClosingSparks();
  closingCore.classList.remove("flash");
  void closingCore.offsetWidth;
  closingCore.classList.add("flash");
  finalLetter.classList.add("scroll-closing");
  setTimeout(()=>{
    // The letter stays closed permanently; the final line lives outside it.
    finalLetter.classList.remove("scroll-closing");
    finalLetter.classList.add("letter-closed-final");
    finalSection.classList.add("finished");
  },1400);
});
