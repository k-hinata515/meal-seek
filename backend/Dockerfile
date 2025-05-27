FROM golang:1.23

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:$PATH
RUN go install github.com/air-verse/air@latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 5174

CMD ["air", "-c", ".air.toml"]