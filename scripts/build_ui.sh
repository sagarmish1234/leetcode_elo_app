#!/bin/bash

#sudo apt install unzip

curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"



cd src/main/ui

bun run build
rm -rf ../resources/static/*
mv  dist/* ../resources/static




