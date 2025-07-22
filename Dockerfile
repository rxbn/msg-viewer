FROM oven/bun:latest AS builder

COPY . /app
WORKDIR /app

RUN bun install
RUN bun ./build.ts

FROM httpd:latest

COPY --from=builder /app/build /usr/local/apache2/htdocs/

RUN sed -i 's/Listen 80/Listen 1024/' /usr/local/apache2/conf/httpd.conf

EXPOSE 80

USER www-data
