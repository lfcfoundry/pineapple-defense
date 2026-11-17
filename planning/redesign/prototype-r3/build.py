"""Dependency-free offline experiment assembly; never builds or writes the game."""
from pathlib import Path
import re,hashlib,json
P=Path(__file__).resolve().parent
order=['even-dt.mjs','assets.mjs','legacy.mjs','engine.mjs','input.mjs','render.mjs','study.mjs','app.mjs']
parts=[]
for name in order:
 s=(P/name).read_text()
 s=re.sub(r'^import .*?;\n','',s,flags=re.M)
 s=re.sub(r'\bexport (?=(?:const|function|async function|class)\b)','',s)
 parts.append('// Module: '+name+'\n'+s)
script='\n'.join(parts).replace('</script','<\\/script')
html=(P/'template.html').read_text().replace('/* EXPERIMENT_MODULE */',script)
(P/'index.html').write_text(html)
(P/'ARTIFACT.json').write_text(json.dumps({'sourceCommit':'4356ead15a5eb61693f33497515f0212cf01dd77','spec':'R3','artifactSHA256':hashlib.sha256(html.encode()).hexdigest(),'modules':{n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in order}},indent=2)+'\n')
print('Isolated offline index.html:',len(html.encode()),'bytes; no runtime imports or requests.')
