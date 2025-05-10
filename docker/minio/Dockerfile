FROM minio/minio:RELEASE.2025-04-22T22-12-26Z

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /workdir

ENTRYPOINT ["/entrypoint.sh"]
