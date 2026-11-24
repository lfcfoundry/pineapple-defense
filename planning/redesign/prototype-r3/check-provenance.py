"""Verify copied routines against the pinned Git object without regenerating files."""
import subprocess,json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent
m=json.loads((P/'PROVENANCE.json').read_text())
g=subprocess.check_output(['git','show',m['sourceCommit']+':src/game.js'],cwd=P).decode()
l=(P/'legacy.mjs').read_text()
for name,h in m['functions'].items():
 start=g.index('function '+name+'(')
 # Locate exact hashed source extent, bounded by next top-level declaration/comment.
 found=False
 for end in range(g.index('{',start)+1,len(g)):
  if g[end]=='}':
   fragment=g[start:end+1]
   if hashlib.sha256(fragment.encode()).hexdigest()==h:
    assert fragment in l,name+' differs from pinned source';found=True;break
 assert found,name+' source digest missing'
assert 'SaveKit.create' not in l
print('PASS: all',len(m['functions']),'pinned function bodies retained; no campaign persistence bootstrap.')
