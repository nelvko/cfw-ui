FROM ubuntu:latest
LABEL authors="issuser"

ENTRYPOINT ["top", "-b"]