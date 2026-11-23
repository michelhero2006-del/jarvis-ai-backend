const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization"};
const json = (data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...cors}});
export default { async fetch(request,env) {
 const url=new URL(request.url);
 if(request.method==="OPTIONS") return new Response(null,{headers:cors});
 if(url.pathname==="/"||url.pathname==="/health") return json({name:"JARVIS AI Backend",status:"online",endpoints:["/api/chat","/api/image","/api/video"]});
 try {
  if(request.method!=="POST") return json({error:"Method not allowed"},405);
  const body=await request.json();
  if(url.pathname==="/api/chat") {
   if(!env.OPENAI_API_KEY) return json({error:"OPENAI_API_KEY secret is not configured"},503);
   if(!body.message) return json({error:"message is required"},400);
   const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:body.model||"gpt-4.1-mini",messages:[{role:"system",content:"You are JARVIS, a helpful and honest AI assistant."},...(Array.isArray(body.history)?body.history.slice(-20):[]),{role:"user",content:body.message}]})});
   const d=await r.json(); if(!r.ok)return json({error:d.error?.message||"OpenAI request failed"},r.status);
   return json({reply:d.choices?.[0]?.message?.content||"",usage:d.usage||null});
  }
  if(url.pathname==="/api/image") {
   if(!env.FAL_KEY)return json({error:"FAL_KEY secret is not configured"},503);
   if(!body.prompt)return json({error:"prompt is required"},400);
   const r=await fetch("https://fal.run/fal-ai/flux/dev",{method:"POST",headers:{Authorization:"Key "+env.FAL_KEY,"Content-Type":"application/json"},body:JSON.stringify({prompt:body.prompt})});
   return json(await r.json(),r.status);
  }
  if(url.pathname==="/api/video") {
   if(!env.FAL_KEY)return json({error:"FAL_KEY secret is not configured"},503);
   if(!body.prompt)return json({error:"prompt is required"},400);
   const model=env.FAL_VIDEO_MODEL||"fal-ai/kling-video/v2.1/standard/text-to-video";
   const r=await fetch("https://queue.fal.run/"+model,{method:"POST",headers:{Authorization:"Key "+env.FAL_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
   return json(await r.json(),r.status);
  }
  return json({error:"Not found"},404);
 } catch(e) { return json({error:e.message||"Unexpected server error"},500); }
}};
