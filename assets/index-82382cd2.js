(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const u of t.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();const r=o=>document.getElementById(o),a=(o,s,i)=>o.addEventListener(s,i),f=(o,s,i)=>{const n=document.createElement("option");n.text=i,n.value=s,o.add(n)},h=o=>({deviceId:o,aspectRatio:16/9,width:2560,height:1440}),L=o=>({deviceId:o});document.addEventListener("DOMContentLoaded",()=>{const o=r("screen"),s=r("video"),i=r("video-select"),n=r("audio-select"),e=r("setting-popup"),t=r("close-setting-btn"),u=r("open-setting-btn"),v=r("menu"),l=r("volume-input"),g=r("fullscreen-btn");let m=!1;(async()=>{(await navigator.mediaDevices.enumerateDevices()).forEach(c=>{c.kind==="videoinput"?f(i,c.deviceId,c.label):c.kind==="audioinput"&&f(n,c.deviceId,c.label),console.log(c.deviceId,c.label)}),l.value=localStorage.getItem("volume")||"100",l.style.setProperty("--volume",`${l.value}%`)})();const p=async()=>{const d=i.value,c=n.value;if(!d&&!c){s.srcObject=null,v.classList.remove("opacity-0");return}const y=await navigator.mediaDevices.getUserMedia({video:d?h(i.value):!1,audio:c?L(n.value):!1});s.srcObject=y,s.volume=Number(l.value)/100,d&&v.classList.add("opacity-0")};a(i,"change",()=>p()),a(n,"change",()=>p()),a(t,"click",()=>{e.classList.remove("open"),e.classList.add("close")}),a(u,"click",()=>{e.classList.add("open"),e.classList.remove("close")}),a(l,"input",()=>{l.style.setProperty("--volume",`${l.value}%`),s.volume=Number(l.value)/100}),a(l,"change",()=>{localStorage.setItem("volume",l.value)}),a(g,"click",()=>{m=!m,m?o.requestFullscreen():document.exitFullscreen()})});
