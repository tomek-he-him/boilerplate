VERSION    ?= LATEST

dist: dist/manifest.json
	@echo dist app
	@mkdir -p $@
	@cp {{{ name }}}.html $@

dist/manifest.json: manifest.json
	@mkdir -p $(@D)
	@cp manifest.json $@
	@sed 's|^\s\+"version":".*",$$| "version":"$(VERSION)",|;s|^\s\+"coreClientVersion":".*",$$| "coreClientVersion":"$(VERSION)",|' -i $@

clean:
	@rm -rf dist

.PHONY: tests clean prepare docs dist
