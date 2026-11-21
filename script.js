// InkWell demo: mock API layer simulates real backend requests.
// Replace these functions with fetch("http://localhost:5000/api/posts") when a server is connected.
const API = {
  async getPosts() {
    await delay(850); // simulate network latency
    return structuredClone(mockPosts);
  },
  async createPost(post) {
    await delay(650);
    const created = { ...post, id: Date.now(), date: new Date().toISOString(), readTime: "3 min read", likes: 0 };
    mockPosts.unshift(created);
    return created;
  },
  async subscribe(email) {
    await delay(500);
    return { success: true, message: `You're on the list, ${email}!` };
  }
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const mockPosts = [
 {id:1,category:"Technology",title:"The quiet revolution of artificial intelligence",excerpt:"AI is changing how we work, create, and solve problems. The most interesting part isn't the technology itself — it's what people choose to do with it.",author:"Maya Sharma",date:"2026-11-18",readTime:"6 min read",likes:24,image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1100&q=85"},
 {id:2,category:"Lifestyle",title:"Finding stillness in a world that never stops",excerpt:"Maybe a slower morning, a walk without headphones, or a page in a notebook is enough to bring us back to ourselves.",author:"Aarav Mehta",date:"2026-11-16",readTime:"4 min read",likes:18,image:"https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85"},
 {id:3,category:"Creativity",title:"Make something before you feel ready",excerpt:"Perfection is a moving finish line. The first version is allowed to be messy — it only needs to exist.",author:"Ira Kapoor",date:"2026-11-14",readTime:"5 min read",likes:31,image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85"},
 {id:4,category:"Technology",title:"A beginner's guide to building on the web",excerpt:"From a blank HTML file to a living website, learn how small pieces of code come together to make something useful.",author:"Kabir Verma",date:"2026-11-12",readTime:"7 min read",likes:12,image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85"},
 {id:5,category:"Lifestyle",title:"The little rituals that make a day",excerpt:"A cup of chai, a familiar song, and ten minutes away from a screen. Small rituals can make ordinary days feel special.",author:"Naina Roy",date:"2026-11-10",readTime:"3 min read",likes:27,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"},
 {id:6,category:"Creativity",title:"Why every idea deserves a notebook",excerpt:"A notebook is a home for unfinished thoughts. It gives ideas room to grow before the world gets to judge them.",author:"Dev Malhotra",date:"2026-11-08",readTime:"4 min read",likes:16,image:"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85"}
];

let allPosts = [];
let activeCategory = "All";
let searchTerm = "";
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const formatDate = date => new Date(date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const fallbackImage = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80";

function cardTemplate(post, featured=false) {
  const image = post.image || fallbackImage;
  return `<article class="story-card ${featured?'featured-card':''}" data-id="${post.id}">
    <div class="story-image"><img src="${escapeHTML(image)}" alt="${escapeHTML(post.title)}" loading="lazy" onerror="this.src='${fallbackImage}'"><span class="image-tag">${escapeHTML(post.category)}</span></div>
    <div class="story-body"><div class="story-meta"><span>${formatDate(post.date)}</span><span>${escapeHTML(post.readTime || "4 min read")}</span></div>
      <h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt)}</p>
      <div class="story-footer"><span class="author">BY ${escapeHTML(post.author).toUpperCase()}</span><div><button class="like-btn" data-like="${post.id}" aria-label="Like story">♡ ${post.likes || 0}</button> <button class="read-link" data-read="${post.id}">READ STORY ↗</button></div></div>
    </div></article>`;
}
function renderPosts() {
  const filtered = allPosts.filter(post => (activeCategory==="All" || post.category===activeCategory) &&
    `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(searchTerm));
  const featured = filtered.slice(0,3), rest = filtered.slice(3);
  $("#featuredGrid").innerHTML = featured.map((post,i)=>cardTemplate(post,i===0)).join("");
  $("#postsGrid").innerHTML = rest.map(post=>cardTemplate(post)).join("");
  $("#emptyState").classList.toggle("hidden", filtered.length!==0);
  $("#storyCount").textContent = String(allPosts.length).padStart(2,"0");
}
async function loadPosts() {
  $("#apiStatus").textContent = "Fetching stories from /api/posts…";
  try {
    // Demo backend request: API.getPosts() behaves like an asynchronous fetch call.
    allPosts = await API.getPosts();
    $("#apiStatus").textContent = "Live · mock API connected";
    renderPosts();
  } catch(error) {
    $("#apiStatus").textContent = "Could not load stories";
    showToast("Unable to load stories. Please refresh.");
  }
}
function showToast(message) {
  const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function openEditor(){ $("#editorModal").classList.remove("hidden"); document.body.style.overflow="hidden"; }
function closeEditor(){ $("#editorModal").classList.add("hidden"); document.body.style.overflow=""; }

$("#categoryTabs").addEventListener("click",event=>{
  const tab=event.target.closest("[data-category]"); if(!tab)return;
  activeCategory=tab.dataset.category;
  document.querySelectorAll(".tab").forEach(item=>item.classList.toggle("active",item===tab));
  renderPosts();
});
$("#searchInput").addEventListener("input",event=>{searchTerm=event.target.value.toLowerCase().trim();renderPosts();});
$("#openEditor").addEventListener("click",openEditor);
$("#closeEditor").addEventListener("click",closeEditor);
$("#editorModal").addEventListener("click",event=>{if(event.target.id==="editorModal")closeEditor();});
$("#postForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const button=event.currentTarget.querySelector("button[type=submit]");
  const post={title:$("#postTitle").value.trim(),author:$("#postAuthor").value.trim(),category:$("#postCategory").value, image:$("#postImage").value.trim()||fallbackImage, excerpt:$("#postExcerpt").value.trim()};
  button.disabled=true;button.textContent="Publishing…";
  try {
    const saved=await API.createPost(post); // simulated POST /api/posts
    allPosts.unshift(saved); activeCategory="All";searchTerm="";
    $("#searchInput").value="";document.querySelectorAll(".tab").forEach(tab=>tab.classList.toggle("active",tab.dataset.category==="All"));
    renderPosts();event.currentTarget.reset();closeEditor();showToast("Your story has been published!");
    $("#latest").scrollIntoView({behavior:"smooth"});
  } catch(error){showToast("Something went wrong. Try again.");}
  finally{button.disabled=false;button.innerHTML='Publish story <span>↗</span>';}
});
document.addEventListener("click",event=>{
  const like=event.target.closest("[data-like]");
  if(like){const post=allPosts.find(item=>item.id==like.dataset.like);if(!post)return;post.likes=(post.likes||0)+1;like.classList.add("liked");like.textContent=`♥ ${post.likes}`;}
  const read=event.target.closest("[data-read]");
  if(read){const post=allPosts.find(item=>item.id==read.dataset.read);if(post)showToast(`${post.title} · by ${post.author}`);}
});
$("#subscribeForm").addEventListener("submit",async event=>{
  event.preventDefault();const email=$("#emailInput").value.trim();
  const result=await API.subscribe(email);$("#subscribeMessage").textContent=result.message;event.currentTarget.reset();
});
$("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");$("#themeBtn").textContent=document.body.classList.contains("dark")?"☾":"☼";});
$("#menuBtn").addEventListener("click",()=>$(".main-nav").classList.toggle("mobile-open"));
document.querySelectorAll(".main-nav a").forEach(link=>link.addEventListener("click",()=>$(".main-nav").classList.remove("mobile-open")));

loadPosts();
