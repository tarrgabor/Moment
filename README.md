# Moment - Egyszerű Közösségi Média
Üdvözlünk! Az alábbiakban részletes útmutatót talál a fejlesztői környezet beállításához és az alkalmazás elindításához.

A feladatok kiosztását itt tekintheti meg: [Jira](https://id.atlassian.com/login?continue=https%3A%2F%2Fid.atlassian.com%2Fjoin%2Fuser-access%3Fresource%3Dari%253Acloud%253Ajira%253A%253Asite%252F5060a185-a4b8-4487-96be-0f84756219ee%26continue%3Dhttps%253A%252F%252Fprojectmoment.atlassian.net%252Fjira%252Fsoftware%252Fprojects%252FMOME%252Fboards%252F2&application=jira)

## Használt nyelvek és package-ek
- Frontend: Angular, TypeScript
- Backend: Node.js, Express
- Adatbázis és Backend közötti kapcsolat: Sequelize
- Adatbázis: MySQL

## Telepítés

Győződjön meg róla, hogy a következők telepítve vannak a gépén:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Angular CLI](https://angular.dev/installation)

A telepítést követően ellenőrizheti, hogy a Node.js, npm és az Angular CLI megfelelően telepítve van, a következő parancsokkal:

```bash
node -v
npm -v
ng --version
```

## Klónozza le a repot
```bash
git clone https://github.com/tarrgabor/Moment.git
```

## Telepítse a függőségeket és indítsa el a szervereket
A klónozás után nyissa meg a projektet és nyisson meg 2 terminált.

Az 1. terminálba írja:
```bash
cd API
npm i
```

Várja meg amíg települnek a package-ek, majd írja be a következőt:
```bash
npm run dev
```
Ehhez ne felejtse el elindítani az adatbázist (XAMPP) - (Apache és MySQL modult) és beszúrni az SQL fájlt (ezen az oldalon http://localhost/phpmyadmin/) , amit a fájlok között megtalál!

A 2. terminálba írja:
```bash
cd Frontend
npm i
```

Várja meg amíg települnek a package-ek, majd írja be a következőt:
```bash
ng serve
```

Miután elindította a Frontendet, ezen a linken érheti el: http://localhost:4200/
Megkezdheti az oldalunk használatát!
