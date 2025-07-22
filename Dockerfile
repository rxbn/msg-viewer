FROM oven/bun:latest AS builder

COPY . /app
WORKDIR /app

RUN bun install
RUN bun ./build.ts

FROM httpd:latest

COPY --from=builder /app/build /usr/local/apache2/htdocs/
EXPOSE 80

USER 1000
