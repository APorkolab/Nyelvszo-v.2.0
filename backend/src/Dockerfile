# Használjunk egy alap Node.js képet
FROM node:14

# Állítsuk be a munkakönyvtárat
WORKDIR /usr/src/app

# Másoljuk a csomagdefiníciós fájlokat a munkakönyvtárba
COPY package*.json ./

# Telepítsük a függőségeket
RUN npm install

# Másoljuk a teljes alkalmazást a munkakönyvtárba
COPY . .

# Állítsuk be a portot, amin az alkalmazás fut
EXPOSE 3000

# Indítsuk el a várakozási scriptet és az alkalmazást
CMD ["node", "wait-for-db.js"]
