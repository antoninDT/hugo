export HISTCONTROL=ignoreboth:erasedups

export EDITOR="atom -nw"

[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

if [ -f "$(brew --prefix bash-git-prompt)/share/gitprompt.sh" ]; then
    GIT_PROMPT_THEME=Default
    source "$(brew --prefix bash-git-prompt)/share/gitprompt.sh"
fi
export PATH="/usr/local/sbin:$PATH"

export CLICOLOR=1
export LSCOLORS=gxBxhxDxfxhxhxhxhxcxcx
