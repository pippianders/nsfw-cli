FROM node

WORKDIR /opt

RUN npm install multer form-data express axios concat-stream

COPY static static
COPY *.js ./

CMD ["node", "image2image.js"]
