#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const registry=JSON.parse(fs.readFileSync('surfaces/registry.json','utf8'));
const out='dist/registry';
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const itemDirs={ 'hyperframes:block':'blocks', 'hyperframes:component':'components', 'hyperframes:example':'examples' };
const copy=(src,dst)=>{fs.mkdirSync(path.dirname(dst),{recursive:true}); fs.copyFileSync(src,dst);};
const rel=(p)=>p.split(path.sep).join('/');
const items=[];
function manifestFor(s){
 const type=s.publish.type; const dir=path.join(out,itemDirs[type],s.id); fs.mkdirSync(dir,{recursive:true});
 const files=[]; const addFile=(src,target,type)=>{ if(!fs.existsSync(src)) return; copy(src,path.join(dir,src)); files.push({path:src,target,type}); };
 addFile(s.source,s.source,'hyperframes:composition');
 if (fs.existsSync('runtime/backlot-component-loader.js')) addFile('runtime/backlot-component-loader.js','runtime/backlot-component-loader.js','hyperframes:asset');
 if (fs.existsSync('assets/cursors/normal-select.svg')) addFile('assets/cursors/normal-select.svg','assets/cursors/normal-select.svg','hyperframes:asset');
 const deps=(s.dependencies||[]).filter(id=>registry.surfaces.find(x=>x.id===id && x.publish?.enabled));
 const m={
  $schema:'https://hyperframes.heygen.com/schema/registry-item.json', name:s.id, type, title:s.title,
  description:s.recommendedUse || s.fidelity || s.title, tags:s.tags||[], author:'UI Backlot contributors', license:'ISC', minCliVersion:'0.6.114',
  sourcePrompt:'Install editable UI Backlot source into a HyperFrames project; keep the copied HTML/CSS/JS editable.',
  registryDependencies:deps, files
 };
 if(type!=='hyperframes:component'){ m.dimensions=s.dimensions; m.duration=Number(s.duration||s.capture?.duration||10); }
 fs.writeFileSync(path.join(dir,'registry-item.json'),JSON.stringify(m,null,2)+'\n');
 items.push({name:s.id,type,title:s.title,description:m.description,tags:m.tags});
}
for(const s of registry.surfaces.filter(s=>s.publish?.enabled)) manifestFor(s);
const quick='quickstart-demo'; const qdir=path.join(out,'examples',quick); fs.mkdirSync(qdir,{recursive:true});
for(const f of ['examples/quickstart-demo.html','runtime/backlot-component-loader.js','assets/cursors/normal-select.svg','compositions/mac-menu-bar.html','compositions/browser-app.html','compositions/claude-chat-pane.html']) copy(f,path.join(qdir,f));
const qm={ $schema:'https://hyperframes.heygen.com/schema/registry-item.json', name:quick, type:'hyperframes:example', title:'UI Backlot Claude plus Browser Quickstart', description:'Complete starter video assembling macOS menu bar, browser app, Claude chat pane, cursor, and click feedback.', tags:['starter','claude','browser','example'], author:'UI Backlot contributors', license:'ISC', minCliVersion:'0.6.114', sourcePrompt:'Start a fresh HyperFrames project from the editable UI Backlot Claude-plus-browser starter.', dimensions:{width:1920,height:1080}, duration:14, files:[{path:'examples/quickstart-demo.html',target:'index.html',type:'hyperframes:composition'},{path:'runtime/backlot-component-loader.js',target:'runtime/backlot-component-loader.js',type:'hyperframes:asset'},{path:'assets/cursors/normal-select.svg',target:'assets/cursors/normal-select.svg',type:'hyperframes:asset'},{path:'compositions/mac-menu-bar.html',target:'compositions/mac-menu-bar.html',type:'hyperframes:composition'},{path:'compositions/browser-app.html',target:'compositions/browser-app.html',type:'hyperframes:composition'},{path:'compositions/claude-chat-pane.html',target:'compositions/claude-chat-pane.html',type:'hyperframes:composition'}] };
fs.writeFileSync(path.join(qdir,'registry-item.json'),JSON.stringify(qm,null,2)+'\n'); items.push({name:quick,type:qm.type,title:qm.title,description:qm.description,tags:qm.tags});
fs.writeFileSync(path.join(out,'registry.json'),JSON.stringify({schemaVersion:1,items},null,2)+'\n');
console.log(`Generated ${items.length} installable UI Backlot registry items in ${out}`);
