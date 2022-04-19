# This .zshrc is in source control.

# https://scriptingosx.com/2019/07/moving-to-zsh-06-customizing-the-zsh-prompt/
export PROMPT='%F{green}docker %F{red}(%*) %F{cyan}%2d %f'
export CLICOLOR=1
export LSCOLORS=cxhxhxhxbxHxHxhbhbcxcx
alias ls='ls -a'
alias parent='cd ..; pwd'
alias seeSettings='cat ~/.zshrc'
alias cd-root='cd /usr/src'
alias cd-build='cd /usr/src/utility/build'
alias cd-client='cd /usr/src/projects/client'
alias cd-server='cd /usr/src/projects/server'
alias cd-server-http='cd /usr/src/projects/server-http'
alias cd-iso='cd /usr/src/projects/iso'
setopt EXTENDED_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_FIND_NO_DUPS
setopt HIST_SAVE_NO_DUPS
export HISTFILESIZE=300