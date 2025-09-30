# macOS verion

FROM ubuntu:22.04

LABEL maintainer="Neil Ernst <nernst@uvic.ca>"

# update packages and install
    RUN apt-get update && apt-get install -y --no-install-recommends software-properties-common && rm -rf /var/lib/apt/lists/*

# update packages and install
RUN apt-get update && apt-get install -y --no-install-recommends wget openjdk-8-jdk curl unzip git maven 'libblas*' && rm -rf /var/lib/apt/lists/*

RUN [ -d /usr/local/cuda/lib64 ] && ldconfig /usr/local/cuda/lib64 || true

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-arm64
ENV PATH="${JAVA_HOME}/bin:${PATH}"
