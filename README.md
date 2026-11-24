# Biawak-tsvm01

[![make.fun · tiny-stack-vm-01](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Ajihashpangestu/Biawak-tsvm01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Ajihashpangestu/Biawak-tsvm01/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack ISA virtual machine in Node 22, entered in make.fun's "tiny stack virtual machine" bounty ($100 USDC). It runs every bytecode program byte-for-byte like the kit's reference VM — verified 40/40 on the practice set and by a 6,000-program differential fuzz against the reference (output, exit code, trap code and step count).

## Run it

```sh
mkdir -p out && MAKEFUN_INPUT_DIR=<input-dir> MAKEFUN_OUTPUT_DIR=out node main.ts
```

For each `<id>` under the input dir it writes `out/<id>/stdout.bin` (the bytes the program wrote) and `out/<id>/exit.txt` (its exit code, traps included).

## What it implements

- 32-bit wrapping arithmetic (including `INT_MIN / -1`, `INT_MIN % -1`, unsigned div/mod and signed remainder sign)
- a 256-value data stack, a 64-deep call stack, 256 words of memory
- branches, calls, print/putc/in/exit, and every trap code (2–10) with the step and output limits

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
