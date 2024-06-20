FROM postgres:15.3

RUN apt-get update \
    && apt-get install -y wget \
    && apt-get install -y postgresql-15-postgis-3 \
    && apt-get install -y postgis
