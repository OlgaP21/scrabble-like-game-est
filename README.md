Scrabble kujul veebipõhine mäng eesti keeles.

Programmi käivitamiseks peab olema arvutis paigaldatud Node.js ja kohalikku veebiserverit luua võimaldav tarkvara (näiteks Python).

Programmi käivitamiseks on vaja:
- laadida repositoorium alla;
- käivitada serveri kood;
- käivitada kliendi kood.

Serveri käivitamiseks on vaja:
- avada käsurida kaustas 'scrabble-like-game-est-main':
  - käivitada käsk 'npm install';
  - käivitada käsk 'node server.js'.

Mängu käivitamiseks on vaja:
- avada käsurida kaustas 'scrabble-like-game-est-main/public':
  - käivitada käsk 'python -m http.server 8081';
  - avada veebileht aadressil http://localhost:8081/ .

See avab veebilehitsejas Scrabble mängu.

Mängida saab ka veebiaadressil https://play-scrabblest.web.app/ .
