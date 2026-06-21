import fs from 'node:fs';
import path from 'node:path';

// Prüft zur Build-/Renderzeit (Server), ob eine Datei unter /public existiert.
// So rendern Logos automatisch, sobald Marcel sie ablegt, sonst greift der
// Text-Fallback und es gibt kein 404.
export function publicAsset(publicPath: string): string | undefined {
  const rel = publicPath.replace(/^\//, '');
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', rel)) ? publicPath : undefined;
  } catch {
    return undefined;
  }
}
