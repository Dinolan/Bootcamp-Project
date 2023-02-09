FROM node:18

WORKDIR /Bootcamp Project

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm","start"]
