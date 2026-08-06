const CLUB_URL = "https://www.chess.com/club/64 Squares Of War";

const playlist = [
  { title: "Opening Theme", file: "music/opening-theme.mp3" },
  { title: "Community Theme", file: "music/community-theme.mp3" }
];

const audio = document.getElementById("clubAudio");
const trackTitle = document.getElementById("trackTitle");
const audioFallback = document.getElementById("audioFallback");
const playPause = document.getElementById("playPause");
let currentTrack = 0;

function loadTrack(index) {
  if (!playlist.length) return;
  currentTrack = (index + playlist.length) % playlist.length;
  audio.src = playlist[currentTrack].file;
  trackTitle.textContent = playlist[currentTrack].title;
  audio.load();
}
async function playCurrent() {
  try { await audio.play(); audioFallback.hidden = true; playPause.textContent = "⏸"; }
  catch { audioFallback.hidden = false; }
}
function nextTrack(){ loadTrack(currentTrack + 1); playCurrent(); }
function previousTrack(){ loadTrack(currentTrack - 1); playCurrent(); }
document.getElementById("nextTrack").addEventListener("click", nextTrack);
document.getElementById("previousTrack").addEventListener("click", previousTrack);
playPause.addEventListener("click", () => audio.paused ? playCurrent() : (audio.pause(), playPause.textContent = "▶"));
audioFallback.addEventListener("click", playCurrent);
audio.addEventListener("ended", nextTrack);
audio.addEventListener("pause", () => playPause.textContent = "▶");
audio.addEventListener("play", () => playPause.textContent = "⏸");
window.addEventListener("load", () => { loadTrack(0); playCurrent(); });

const toolToggle = document.getElementById("toolToggle");
const toolPanel = document.getElementById("toolPanel");
const scanLine = document.getElementById("scanLine");
const celebrationLayer = document.getElementById("celebrationLayer");
const toolMessage = document.getElementById("toolMessage");
let messageTimer;

function showToolMessage(message){ clearTimeout(messageTimer); toolMessage.textContent=message; toolMessage.classList.add("show"); messageTimer=setTimeout(()=>toolMessage.classList.remove("show"),1800); }
toolToggle.addEventListener("click",()=>{ const opening=toolPanel.hidden; toolPanel.hidden=!opening; toolToggle.setAttribute("aria-expanded",String(opening)); });
function toggleBackgroundMask(){ document.body.classList.toggle("background-masked"); showToolMessage(document.body.classList.contains("background-masked")?"Background simplified":"Background restored"); }
async function copyClubLink(){
  try { await navigator.clipboard.writeText(CLUB_URL); showToolMessage("Club link copied"); }
  catch { fallbackCopy(CLUB_URL); }
}
function fallbackCopy(text){ const area=document.createElement("textarea"); area.value=text; area.setAttribute("readonly",""); area.style.cssText="position:fixed;opacity:0"; document.body.appendChild(area); area.select(); try{document.execCommand("copy");showToolMessage("Club link copied");}catch{showToolMessage("Copying was blocked");} area.remove(); }
function scrollPage(direction){ window.scrollBy({top:Math.max(innerHeight*.8,400)*direction,behavior:"smooth"}); }
function activateScanner(){ scanLine.classList.remove("active"); void scanLine.offsetWidth; scanLine.classList.add("active"); showToolMessage("Scan started"); setTimeout(()=>{scanLine.classList.remove("active");showToolMessage("Scan complete");},1650); }
function celebrate(){ const colors=["#ffd166","#59b5ff","#fff","#ef476f","#78e08f"]; const amount=innerWidth<600?45:90; for(let i=0;i<amount;i++){const p=document.createElement("span");p.className="confetti-piece";p.style.left=`${Math.random()*100}%`;p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.setProperty("--fall-time",`${2.4+Math.random()*2.2}s`);p.style.setProperty("--drift",`${-120+Math.random()*240}px`);p.style.animationDelay=`${Math.random()*.5}s`;celebrationLayer.appendChild(p);p.addEventListener("animationend",()=>p.remove());} showToolMessage("Celebration activated"); }
document.querySelectorAll("[data-tool]").forEach(button=>button.addEventListener("click",()=>{ const tool=button.dataset.tool; if(tool==="background")toggleBackgroundMask(); if(tool==="copy")copyClubLink(); if(tool==="scan")activateScanner(); if(tool==="up")scrollPage(-1); if(tool==="down")scrollPage(1); if(tool==="celebrate")celebrate(); }));
