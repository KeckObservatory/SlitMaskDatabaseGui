
SYSNAM   = observers/Slitmask
VERNUM   = $(shell basename `pwd`)
RELDIR   = /www/$(SYSNAM)/$(VERNUM)
EXCLUDE  = --exclude .git --exclude README --exclude Makefile

install:
        @echo "rsync -abvhHS --recursive ./ /$(RELDIR)/ $(EXCLUDE)"
        rsync -abvhHS --recursive ./ /$(RELDIR)/ $(EXCLUDE)
        cd $(RELDIR)/..; rm rel; ln -s $(VERNUM) rel;
