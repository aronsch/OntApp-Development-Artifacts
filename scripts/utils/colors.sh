#!/usr/bin/env bash

export green=$(tput setaf 2)
export yellow=$(tput setaf 3)
export red=$(tput setaf 1)
export teal=$(tput setaf 14)
export bold=$(tput bold)
export underline=$(tput smul)
export nounderline=$(tput rmul)
export yellowbold=$bold$yellow
export greenbold=$bold$green
export redbold=$bold$red
export greenbg=$(tput setab 2)$(tput setaf 0)
export yellowbg=$(tput setab 3)$(tput setaf 0)
export whitebg=$(tput setab 7)$(tput setaf 0)
export logcol=$(tput setab 19)$teal
export dim=$(tput dim)
export nocol=$(tput sgr0)


# Value	Color
# 0	    Black
# 1	    Red
# 2	    Green
# 3	    Yellow
# 4	    Blue
# 5	    Magenta
# 6	    Cyan
# 7	    White
# 8	    Not used
# 9	    Reset to default color