#!/bin/bash

#sudo apt install unzip

curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"



cd src/main/ui

bun install
bun run build
mkdir -p ../../../target/classes/static
mv  dist/* ../../../target/classes/static




