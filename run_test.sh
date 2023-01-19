docker build -t test_nodejs .

docker run --rm \
    -p 3000:3000 \
    test_nodejs 

