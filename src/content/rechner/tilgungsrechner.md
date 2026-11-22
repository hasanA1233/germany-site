---
seoTitle: "Tilgungsrechner – Tilgungsplan & Restschuld berechnen"
description: "Tilgungsrechner für Baufinanzierung und Annuitätendarlehen: Monatsrate, Laufzeit, Zinskosten und Restschuld nach Zinsbindung berechnen – mit Tilgungsplan."
h1: "Tilgungsrechner mit Tilgungsplan"
intro: "Mit dem Tilgungsrechner planen Sie ein Annuitätendarlehen, wie es bei Baufinanzierungen üblich ist. Sie sehen Ihre Monatsrate, die Restschuld am Ende der Zinsbindung, die gesamte Laufzeit und einen Tilgungsplan Jahr für Jahr."
updated: 2026-11-22
faq:
  - q: "Was bedeutet anfängliche Tilgung?"
    a: "Die anfängliche Tilgung gibt an, welcher Prozentsatz des Darlehens im ersten Jahr zurückgezahlt wird. Zusammen mit dem Sollzins bestimmt sie die Rate: Jahresrate = Darlehen × (Sollzins + anfängliche Tilgung). Weil die Zinsen mit der Zeit sinken, steigt der Tilgungsanteil in den Folgejahren automatisch."
  - q: "Wie hoch sollte die Tilgung sein?"
    a: "Das hängt von Ihrem Budget und dem Zinsniveau ab. Eine höhere Tilgung erhöht die Rate, verkürzt aber die Laufzeit und senkt die Zinskosten deutlich. Im Beispiel auf dieser Seite sinkt die Laufzeit von 29 auf gut 22 Jahre, wenn die Tilgung von 2 % auf 3 % steigt. Wichtig ist, dass die Rate auch bei unerwarteten Ausgaben tragbar bleibt."
  - q: "Was ist die Restschuld nach Zinsbindung?"
    a: "Während der Zinsbindung ist der Sollzins fest vereinbart. Danach brauchen Sie für die verbleibende Restschuld eine Anschlussfinanzierung zu dann geltenden Konditionen. Die Restschuld nach Zinsbindung zeigt, welcher Betrag dann noch offen ist – und wie stark Sie von späteren Zinsänderungen betroffen sein können."
  - q: "Rechnet der Tilgungsrechner nach der Zinsbindung mit einem neuen Zins?"
    a: "Nein. Für die Gesamtlaufzeit wird vereinfachend angenommen, dass der Zinssatz gleich bleibt. Der tatsächliche Zins für die Anschlussfinanzierung ist heute nicht bekannt. Die Werte für die Zeit nach der Zinsbindung sind deshalb nur eine Orientierung."
  - q: "Kann ich statt der Tilgung auch eine Monatsrate vorgeben?"
    a: "Ja. Wählen Sie „Monatsrate“ und tragen Sie die gewünschte Rate ein. Der Rechner ermittelt dann die anfängliche Tilgung und die Laufzeit. Die Rate muss höher sein als die Zinsen des ersten Monats, sonst würde die Schuld nie kleiner."
sources:
  - label: "BGB § 489 – Ordentliches Kündigungsrecht des Darlehensnehmers"
    url: "https://www.gesetze-im-internet.de/bgb/__489.html"
  - label: "BGB § 502 – Vorfälligkeitsentschädigung"
    url: "https://www.gesetze-im-internet.de/bgb/__502.html"
---

## Wie ein Annuitätendarlehen getilgt wird

Bei einem Annuitätendarlehen zahlen Sie über die gesamte Zinsbindung eine **gleichbleibende Monatsrate**. Diese Rate setzt sich aus Zinsen und Tilgung zusammen. Die Zinsen berechnet die Bank immer auf die aktuelle Restschuld. Weil die Restschuld mit jeder Rate sinkt, wird der Zinsanteil kleiner – und der Tilgungsanteil entsprechend größer.

Dieser Effekt ist der Grund, warum Baufinanzierungen am Anfang so langsam „vorankommen“: In den ersten Jahren fließt ein großer Teil jeder Rate in die Zinsen. Je weiter die Laufzeit fortschreitet, desto schneller sinkt die Restschuld.

## Die Eingaben im Überblick

- **Darlehensbetrag:** die Summe, die Sie bei der Bank aufnehmen – also Kaufpreis plus Nebenkosten abzüglich Eigenkapital.
- **Sollzins:** der fest vereinbarte Zinssatz pro Jahr.
- **Anfängliche Tilgung oder Monatsrate:** Sie legen entweder fest, wie viel Prozent des Darlehens im ersten Jahr getilgt werden, oder geben die gewünschte Monatsrate direkt vor.
- **Jährliche Sondertilgung (optional):** eine zusätzliche Zahlung am Ende jedes Jahres.
- **Zinsbindung (optional):** die Anzahl der Jahre, für die der Zins fest vereinbart ist. Der Rechner zeigt Ihnen dann die Restschuld zu diesem Zeitpunkt.

## Die Formeln hinter dem Tilgungsrechner

Bei Vorgabe der anfänglichen Tilgung ergibt sich die Rate aus der Summe von Sollzins und Tilgungssatz:

```
Monatsrate = Darlehen × (Sollzins + anfängliche Tilgung) ÷ 12
```

Anschließend wird jeder Monat einzeln berechnet:

```
Zinsen im Monat   = Restschuld × Sollzins ÷ 12
Tilgung im Monat  = Monatsrate − Zinsen im Monat
Neue Restschuld   = Restschuld − Tilgung im Monat
```

Das wiederholt sich, bis die Restschuld vollständig getilgt ist. Die letzte Rate fällt in der Regel kleiner aus, weil nur noch der Rest der Schuld beglichen wird. Sondertilgungen werden am Ende jedes Jahres direkt von der Restschuld abgezogen.

## Rechenbeispiel: 300.000 € Baufinanzierung

Sie finanzieren **300.000 €** zu einem Sollzins von **3,5 %** mit einer anfänglichen Tilgung von **2 %** und einer Zinsbindung von **10 Jahren**.

- **Monatsrate:** 300.000 € × (3,5 % + 2 %) ÷ 12 = **1.375,00 €**
- Im ersten Monat entfallen davon **875,00 € auf Zinsen** und **500,00 € auf die Tilgung**.
- Nach dem ersten Jahr sind rund **6.097 €** getilgt, die Restschuld beträgt etwa **293.903 €**.
- **Restschuld nach 10 Jahren:** rund **228.284 €**. In dieser Zeit zahlen Sie etwa **93.284 € Zinsen**.
- Bei gleichbleibendem Zins wäre das Darlehen nach **29 Jahren** abbezahlt; die Zinsen summieren sich dann auf rund **177.593 €**.

### Was eine höhere Tilgung bewirkt

| Anfängliche Tilgung | Monatsrate | Restschuld nach 10 Jahren | Laufzeit gesamt | Zinsen gesamt |
| --- | --- | --- | --- | --- |
| 1 % | 1.125,00 € | ca. 264.142 € | ca. 43 Jahre | ca. 280.990 € |
| 2 % | 1.375,00 € | ca. 228.284 € | 29 Jahre | ca. 177.593 € |
| 3 % | 1.625,00 € | ca. 192.426 € | ca. 22 Jahre | ca. 131.406 € |

*Annahme: Sollzins 3,5 % über die gesamte Laufzeit.*

Schon ein Prozentpunkt mehr Tilgung verkürzt die Laufzeit um viele Jahre und spart zehntausende Euro Zinsen. Eine sehr niedrige Tilgung hält die Rate zwar klein, hinterlässt aber eine hohe Restschuld und ein größeres Zinsänderungsrisiko bei der Anschlussfinanzierung.

Auch **Sondertilgungen** wirken stark: Zahlen Sie im Beispiel jedes Jahr zusätzlich 5.000 €, sinkt die Restschuld nach 10 Jahren auf etwa 169.473 €, und das Darlehen wäre schon nach knapp 20 Jahren getilgt.

## Typische Anwendungsfälle

- **Baufinanzierung planen:** Finden Sie eine Kombination aus Tilgung und Rate, die zu Ihrem Haushaltsbudget passt.
- **Anschlussfinanzierung vorbereiten:** Wissen Sie, welche Restschuld nach der Zinsbindung bleibt, können Sie frühzeitig Angebote einholen.
- **Sondertilgungen bewerten:** Vergleichen Sie, ob sich zusätzliche Zahlungen in das Darlehen lohnen.
- **Angebote vergleichen:** Tragen Sie die Konditionen mehrerer Banken ein und vergleichen Sie Restschuld und Zinskosten.

## Wichtige Hinweise und Annahmen

Der Rechner verwendet die in Deutschland übliche Methode „Sollzins ÷ 12“ für den Monatszins und geht von Zahlungen am Monatsende aus. Einzelne Banken rechnen leicht abweichend, etwa mit anderen Zinsmethoden oder Bereitstellungszinsen. Kosten wie Notar, Grundbuch oder Grunderwerbsteuer sind nicht Teil der Berechnung – sie gehören in Ihren Finanzierungsbedarf.

Gut zu wissen: Bei Darlehen mit einer Zinsbindung von mehr als zehn Jahren haben Darlehensnehmer nach § 489 BGB unter bestimmten Voraussetzungen ein Kündigungsrecht nach Ablauf von zehn Jahren. Die Details hängen vom Vertrag ab – lassen Sie sich im Zweifel beraten.

Für kleinere Ratenkredite mit fester Laufzeit nutzen Sie den [Kreditrechner](/kreditrate-berechnen/). Wenn Sie parallel Eigenkapital aufbauen möchten, hilft Ihnen der [Sparplanrechner](/sparplan-rechner/) bei der Planung.
