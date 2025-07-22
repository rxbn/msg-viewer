FROM oven/bun:latest AS builder

COPY . /app
WORKDIR /app

RUN bun install
RUN bun ./build.ts

FROM httpd:latest

COPY --from=builder /app/build /usr/local/apache2/htdocs/

RUN sed -i 's/Listen 80/Listen 1024/' /usr/local/apache2/conf/httpd.conf

RUN mkdir -p /usr/local/apache2/logs && \
  chown -R www-data:www-data /usr/local/apache2/logs

EXPOSE 1024

USER www-data
