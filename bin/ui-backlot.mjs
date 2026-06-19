#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reg=path.join(repo,'dist/registry');
const usage=()=>console.log('Usage: ui-backlot catalog | install <name> [--dir <project>]');
const args=process.argv.slice(2); if(!args[0]){usage(); process.exit(0)}
const catalog=JSON.parse(fs.readFileSync(path.join(reg,'registry.json'),'utf8'));
if(args[0]==='catalog'){ console.table(catalog.items.map(({name,type,title})=>({name,type,title}))); process.exit(0); }
if(args[0]!=='install'){usage(); process.exit(1)}
const name=args[1]; const dir=args.includes('--dir')?args[args.indexOf('--dir')+1]:process.cwd();
const item=catalog.items.find(i=>i.name===name); if(!item){console.error(`Unknown item ${name}`); process.exit(1)}
const folder={ 'hyperframes:block':'blocks','hyperframes:component':'components','hyperframes:example':'examples'}[item.type];
const base=path.join(reg,folder,name); const manifest=JSON.parse(fs.readFileSync(path.join(base,'registry-item.json'),'utf8'));
const written=[];
for(const f of manifest.files){ const src=path.join(base,f.path); const dst=path.join(dir,f.target); fs.mkdirSync(path.dirname(dst),{recursive:true}); fs.copyFileSync(src,dst); written.push(f.target); }
const snippet=item.type==='hyperframes:block'?`<div data-composition-src="${manifest.files.find(f=>f.type==='hyperframes:composition')?.target}" data-duration="${manifest.duration}" data-width="${manifest.dimensions.width}" data-height="${manifest.dimensions.height}"></div>`: item.type==='hyperframes:component'?`<!-- paste from ${manifest.files[0].target} into your composition -->`:'npx hyperframes render';
console.log(JSON.stringify({ok:true,name,type:item.type,written,snippet},null,2));
