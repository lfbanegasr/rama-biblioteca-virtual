import { preview } from 'vite';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
if(!existsSync('dist/index.html')){
  console.error('Falta la compilación. Ejecuta pnpm install y pnpm build dentro de esta carpeta.');
  process.exit(1);
}
try{
  const server=await preview({root,preview:{host:'127.0.0.1',port:4173,strictPort:true}});
  const url='http://127.0.0.1:4173/#/a/inicio';
  console.log('\nFundación RAMA · Prototipos locales\n');
  console.log(`Propuesta A: ${url}`);
  console.log('Propuesta B: http://127.0.0.1:4173/#/b/inicio');
  console.log('\nUsa el selector superior para comparar. Mantén esta ventana abierta.\n');
  if(!process.argv.includes('--no-open')){
    const opener=spawn('explorer.exe',[url],{detached:true,stdio:'ignore',windowsHide:true});
    opener.on('error',()=>console.log('Abre la dirección anterior en tu navegador.'));
    opener.unref();
  }
  const stop=()=>server.httpServer.close(()=>process.exit(0));
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(error){
  console.error('No se pudo iniciar la vista previa. Si el puerto 4173 está ocupado por otro prototipo, utiliza su ventana abierta o ciérrala e inténtalo otra vez.');
  console.error(error.message);process.exitCode=1;
}
