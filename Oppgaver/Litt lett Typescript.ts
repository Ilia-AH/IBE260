// Oppgave 1
// Skriv et program som skriver ut en hilsen til skjermen (konsollet, eller terminalen, om du vil.)
console.log("Oppgave 1: \n Heisann, dette er en hilsen til skjermen!");

// Oppgave 2
/* Gjør en endring slik at programmet skriver dette til et browservindu 
(forutsetter vel litt enkel Javascript/html-kunnskap).*/
console.log("\nOppgave 2: \n Se filen \"hilsen.js\" og LLTS HTML filen");

// Oppgave 3
// Gjør en endring slik at programmet skriver dette til en «alert»-dialogboks. Bruk ekspress (jfr læreboka).
console.log("\nOppgave 3: \n Se server-LLTS.js \n");

// Oppgave 4
// Skriv et program som ber brukeren om navnet sitt og hilser dem med navnet sitt.
// Denne er skrevet for å virke alene uten nettleser i Node.js miljø. Derfor importeres prompt-sync.
import promptSync = require('prompt-sync');
const prompt = promptSync();
let navn: string | null = prompt("Hva heter du?: ") || "anonynomous";
console.log(`\nOppgave 4: \n Hei ${navn}! \n`);

// Oppgave 5
/* Endre det forrige programmet slik at bare brukerne som har en lovlig epostadresse med @himolde 
blir møtt med navnene sine, de andre kan du f.eks. be om å registrere seg på studiekontoret e.l. 
(pensumboka inneholder det du trenger i «MailBag»-caset).*/
let epost: string | null = prompt("Hva er eposten din?: ") || "Ingen epost registrert.";
const gyldigMail = /^[a-z0-9]([a-z0-9.]*[a-z0-9])?@himolde\.[a-z]{2,}$/i;

if (epost && gyldigMail.test(epost)) {
    console.log(`\nOppgave 5: \n Hei ${navn}!`);
} else {
    console.log(`\nOppgave 5: \n Vennligst registrer deg på studiekontoret.`);
}
