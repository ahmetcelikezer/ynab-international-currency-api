.PHONY: copy-env

# Copy example environment files for development and testing
copy-env:
	@test -f .env && echo ".env already exists, skipping copy." || (echo "Copying .env.example to .env..." && cp .env.example .env)
	@test -f .env.test && echo ".env.test already exists, skipping copy." || (echo "Copying .env.example to .env.test..." && cp .env.example .env.test)
