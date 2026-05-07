FROM mcr.microsoft.com/playwright:v1.52.0-jammy
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
CMD ["pnpm","--filter","worker","run-loop"]
