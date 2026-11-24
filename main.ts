import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
export function run(p, inp) {
  const n = p.length;
  const D = new Int32Array(256);
  let sp = 0;
  const C = new Int32Array(64);
  let csp = 0;
  const M = new Int32Array(256);
  const out = new Uint8Array(65536);
  let olen = 0, ip = 0, pc = 0, steps = 0;
  const F = (e, c) => ({ stdout: out.slice(0, olen), exit: c, trap: e, steps: steps });
  const T = { 0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],16:[0,2,1],17:[0,2,1],18:[0,2,1],19:[0,2,1],20:[0,2,1],21:[0,2,1],22:[0,2,1],23:[0,1,1],24:[0,2,1],25:[0,2,1],26:[0,2,1],27:[0,1,1],28:[0,2,1],29:[0,2,1],30:[0,2,1],32:[0,2,1],33:[0,2,1],34:[0,2,1],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0] };
  for (;;) {
    if (steps === 1e6) return F(10, 10);
    if (pc < 0 || pc >= n) return F(9, 9);
    const op = T[p[pc]];
    if (op === undefined) return F(5, 5);
    const imm = op[0], next = pc + 1 + imm;
    if (pc + imm >= n) return F(9, 9);
    steps++;
    if (sp < op[1]) return F(2, 2);
    if (sp - op[1] + op[2] > 256) return F(3, 3);
    pc = next;
    let r, a, b;
    const o = p[pc - 1 - imm];
    switch (o) {
      case 0: return F(null, 0);
      case 1: D[sp++] = (p[next - 1] << 24) >> 24; break;
      case 2: D[sp++] = p[next-4] | p[next-3]<<8 | p[next-2]<<16 | p[next-1]<<24; break;
      case 3: sp--; break;
      case 4: D[sp] = D[sp-1]; sp++; break;
      case 5: a = D[sp-1]; D[sp-1] = D[sp-2]; D[sp-2] = a; break;
      case 6: D[sp] = D[sp-2]; sp++; break;
      case 7: a = D[sp-3]; D[sp-3] = D[sp-2]; D[sp-2] = D[sp-1]; D[sp-1] = a; break;
      case 16: r = D[sp-2] + D[sp-1] | 0; sp -= 2; D[sp++] = r; break;
      case 17: r = D[sp-2] - D[sp-1] | 0; sp -= 2; D[sp++] = r; break;
      case 18: r = Math.imul(D[sp-2], D[sp-1]); sp -= 2; D[sp++] = r; break;
      case 19: b = D[sp-1]; a = D[sp-2]; if (!b) return F(4, 4); r = (a === -2147483648 && b === -1) ? a : a / b | 0; sp -= 2; D[sp++] = r; break;
      case 20: b = D[sp-1]; a = D[sp-2]; if (!b) return F(4, 4); r = b === -1 ? 0 : a % b | 0; sp -= 2; D[sp++] = r; break;
      case 21: b = D[sp-1]; a = D[sp-2]; if (!b) return F(4, 4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; sp -= 2; D[sp++] = r; break;
      case 22: b = D[sp-1]; a = D[sp-2]; if (!b) return F(4, 4); r = (a >>> 0) % (b >>> 0) | 0; sp -= 2; D[sp++] = r; break;
      case 23: D[sp-1] = -D[sp-1] | 0; break;
      case 24: r = D[sp-2] & D[sp-1]; sp -= 2; D[sp++] = r; break;
      case 25: r = D[sp-2] | D[sp-1]; sp -= 2; D[sp++] = r; break;
      case 26: r = D[sp-2] ^ D[sp-1]; sp -= 2; D[sp++] = r; break;
      case 27: D[sp-1] = ~D[sp-1]; break;
      case 28: r = D[sp-2] << (D[sp-1] & 31); sp -= 2; D[sp++] = r; break;
      case 29: r = D[sp-2] >> (D[sp-1] & 31); sp -= 2; D[sp++] = r; break;
      case 30: r = D[sp-2] >>> (D[sp-1] & 31) | 0; sp -= 2; D[sp++] = r; break;
      case 32: r = D[sp-2] === D[sp-1] ? 1 : 0; sp -= 2; D[sp++] = r; break;
      case 33: r = D[sp-2] < D[sp-1] ? 1 : 0; sp -= 2; D[sp++] = r; break;
      case 34: r = (D[sp-2] >>> 0) < (D[sp-1] >>> 0) ? 1 : 0; sp -= 2; D[sp++] = r; break;
      case 48: case 49: case 50: {
        const rel = (p[next-2] | p[next-1] << 8) << 16 >> 16;
        let take = true;
        if (o !== 48) { const v = D[--sp]; take = o === 49 ? v === 0 : v !== 0; }
        if (take) pc = next + rel;
        break;
      }
      case 51:
        if (csp === 64) return F(7, 7);
        C[csp++] = next;
        pc = p[next-2] | p[next-1] << 8;
        break;
      case 52:
        if (csp === 0) return F(8, 8);
        pc = C[--csp];
        break;
      case 64:
        a = D[sp-1];
        if (a < 0 || a > 255) return F(6, 6);
        D[sp-1] = M[a];
        break;
      case 65:
        a = D[sp-1];
        if (a < 0 || a > 255) return F(6, 6);
        sp -= 2; M[a] = D[sp];
        break;
      case 80: {
        const s = String(D[sp-1]);
        if (olen + s.length > 65536) return F(11, 11);
        sp--;
        for (let k = 0; k < s.length; k++) out[olen++] = s.charCodeAt(k);
        break;
      }
      case 81:
        if (olen === 65536) return F(11, 11);
        out[olen++] = D[--sp] & 255;
        break;
      case 82:
        D[sp++] = ip < inp.length ? inp[ip++] : -1;
        break;
      case 83:
        return F(null, D[--sp] & 255);
    }
  }
}
if (process.argv[1]?.endsWith('main.ts')) {
  const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
  const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  for (const id of readdirSync(I).sort()) {
    const d = join(I, id);
    const prog = new Uint8Array(readFileSync(join(d, 'program.bin')));
    let inp = new Uint8Array(0);
    try { inp = new Uint8Array(readFileSync(join(d, 'input.bin'))); } catch {}
    const { stdout, exit } = run(prog, inp);
    mkdirSync(join(O, id), { recursive: true });
    writeFileSync(join(O, id, 'stdout.bin'), stdout);
    writeFileSync(join(O, id, 'exit.txt'), String(exit) + '\n');
  }
}