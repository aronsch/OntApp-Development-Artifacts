#!/bin/bash
rsync -avrhz --exclude-from="rsync_exclude" mean/ localhost::mean/