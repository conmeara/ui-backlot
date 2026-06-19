#!/usr/bin/env node
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { spawnSync } from 'node:child_process';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ui-backlot-install-'));
for(const name of ['browser-app','claude-chat-pane','mac-menu-bar','claude-browser-chat-pane-workflow','quickstart-demo']){
 const dir=path.join(tmp,name); fs.mkdirSync(dir,{recursive:true}); const r=spawnSync(process.execPath,['bin/ui-backlot.mjs','install',name,'--dir',dir],{encoding:'utf8'}); if(r.status) throw new Error(`${name} failed: ${r.stderr||r.stdout}`);
 const parsed=JSON.parse(r.stdout); for(const f of parsed.written){ if(!fs.existsSync(path.join(dir,f))) throw new Error(`${name} missing ${f}`); }
}
console.log(`Install registry clean-room OK: ${tmp}`);
