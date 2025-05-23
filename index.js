import{a as p,S as y,i as s}from"./assets/vendor-BLPZKqeQ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();const g="50377156-76a0d970257c0a39042cd42de",h="https://pixabay.com/api/";async function b(o){try{return(await p.get(`${h}`,{params:{key:g,q:o,image_type:"photo",orientation:"horizontal",safesearch:!0}})).data}catch(t){throw console.error("Error fetching images:",t),t}}const d=document.querySelector(".gallery");let c;function L(o){const t=o.map(({webformatURL:i,largeImageURL:n,tags:e,likes:r,views:a,comments:f,downloads:m})=>`
            <li class="gallery-item">
                <a href="${n}">
                    <img class="gallery-image" src="${i}" alt="${e}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b> ${r}</p>
                        <p class="info-item"><b>Views</b> ${a}</p>
                        <p class="info-item"><b>Comments</b> ${f}</p>
                        <p class="info-item"><b>Downloads</b> ${m}</p>
                    </div>
                </a>
            </li>
        `).join("");d.innerHTML=t,c?c.refresh():c=new y(".gallery a")}function q(){d.innerHTML=""}function S(){document.querySelector(".loader-container").classList.add("is-loading")}function u(){document.querySelector(".loader-container").classList.remove("is-loading")}const l=document.querySelector(".search-form"),w=l.querySelector('input[name="search-text"]');document.querySelector(".gallery");l.addEventListener("submit",async o=>{o.preventDefault();const t=w.value.trim();if(!t){s.warning({title:"Warning",message:"Please enter a search query.",position:"topRight"});return}q(),S();try{const i=await b(t);u(),i.hits.length>0?L(i.hits):s.info({title:"Info",message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"})}catch(i){u(),s.error({title:"Error",message:"Failed to fetch images. Please try again later.",position:"topRight"}),console.error(i)}finally{l.reset()}});
//# sourceMappingURL=index.js.map
