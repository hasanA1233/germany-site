---
seoTitle: "Sparplanrechner – Endkapital Ihres Sparplans schätzen"
description: "Sparplanrechner: Schätzen Sie Einzahlungen, Endkapital und Erträge Ihres monatlichen Sparplans – mit Anfangskapital, Dynamik, Diagramm und Jahrestabelle."
h1: "Sparplanrechner"
intro: "Mit dem Sparplanrechner schätzen Sie, wie sich regelmäßiges Sparen über viele Jahre entwickeln kann. Geben Sie Sparrate, Anfangskapital, eine angenommene Rendite und die Laufzeit ein – das Ergebnis ist eine Modellrechnung, keine Prognose."
updated: 2026-11-22
faq:
  - q: "Welche Rendite sollte ich im Sparplanrechner annehmen?"
    a: "Das hängt von der Anlageform ab. Für Sparkonten können Sie den aktuellen Zinssatz verwenden. Bei Wertpapieren ist jede Renditeannahme unsicher: Vergangene Entwicklungen sind keine Garantie für die Zukunft. Rechnen Sie deshalb mehrere Szenarien durch, zum Beispiel ein vorsichtiges, ein mittleres und ein optimistisches."
  - q: "Ist das Ergebnis garantiert?"
    a: "Nein. Der Rechner nimmt eine gleichbleibende Rendite pro Jahr an. Tatsächliche Wertentwicklungen schwanken, können über Jahre negativ sein und am Ende deutlich vom Ergebnis abweichen. Das Ergebnis ist eine Schätzung zur Orientierung und keine Anlageberatung."
  - q: "Was bedeutet Dynamik beim Sparplan?"
    a: "Bei einem dynamischen Sparplan erhöhen Sie die Sparrate jedes Jahr um einen festen Prozentsatz, etwa um Gehaltserhöhungen oder die Inflation auszugleichen. Bei 2 % Dynamik wird aus 200 € im zweiten Jahr 204 €, im dritten Jahr 208,08 € und so weiter."
  - q: "Werden Kosten und Steuern berücksichtigt?"
    a: "Nein. Depot- und Fondskosten, Ausgabeaufschläge sowie Steuern auf Erträge sind nicht berücksichtigt. Sie können laufende Kosten näherungsweise einbeziehen, indem Sie die angenommene Rendite um die jährlichen Kosten verringern."
  - q: "Was ist der Unterschied zum Zinseszinsrechner?"
    a: "Der Zinseszinsrechner geht von einem festen, garantierten Zinssatz aus, etwa bei Tagesgeld oder Festgeld. Der Sparplanrechner ist für regelmäßige Einzahlungen in Anlagen mit schwankender Rendite gedacht und rechnet mit Einzahlungen zu Monatsbeginn und einem konstanten Durchschnittswert als Annahme."
sources:
  - label: "EStG § 20 – Einkünfte aus Kapitalvermögen"
    url: "https://www.gesetze-im-internet.de/estg/__20.html"
  - label: "Investmentsteuergesetz (InvStG) § 20 – Teilfreistellung"
    url: "https://www.gesetze-im-internet.de/invstg_2018/__20.html"
---

## So funktioniert ein Sparplan

Bei einem Sparplan zahlen Sie regelmäßig – meist monatlich – einen festen Betrag ein. Das kann ein Banksparplan mit festem Zins sein oder ein Wertpapiersparplan, zum Beispiel auf Fonds oder ETFs. Der Vorteil: Sie bauen Vermögen schrittweise auf, ohne einen großen Betrag auf einmal investieren zu müssen. Erträge, die im Sparplan verbleiben, werden wieder angelegt und tragen selbst Erträge – der gleiche Effekt wie beim [Zinseszins](/zinseszins-rechner/).

## Die Eingaben im Sparplanrechner

- **Monatliche Sparrate:** der Betrag, den Sie jeden Monat einzahlen.
- **Anfangskapital (optional):** ein Betrag, den Sie zu Beginn einmalig einzahlen.
- **Angenommene Rendite pro Jahr:** die durchschnittliche jährliche Wertentwicklung, mit der gerechnet wird. Das ist **eine Annahme, keine Vorhersage**.
- **Laufzeit:** wie viele Jahre Sie sparen möchten.
- **Dynamik (optional):** um wie viel Prozent sich die Sparrate jedes Jahr erhöht.

## Die Berechnung im Detail

Der Rechner simuliert jeden Monat einzeln. Damit eine jährliche Rendite von zum Beispiel 5 % auch tatsächlich 5 % pro Jahr ergibt, wird sie in einen gleichwertigen Monatswert umgerechnet:

```
Monatsrendite = (1 + Jahresrendite)^(1/12) − 1
```

Bei 5 % pro Jahr sind das rund 0,407 % pro Monat. Anschließend gilt für jeden Monat:

```
Depotwert neu = (Depotwert alt + Sparrate) × (1 + Monatsrendite)
```

Die Sparrate wird also **zu Monatsbeginn** eingezahlt und im selben Monat bereits mitverzinst. Mit Dynamik steigt die Sparrate zu Beginn jedes neuen Jahres um den angegebenen Prozentsatz.

Das Ergebnis besteht aus drei Werten:

- **Eigene Einzahlungen:** Anfangskapital plus Summe aller Sparraten.
- **Geschätzte Erträge:** der Zuwachs über Ihre Einzahlungen hinaus.
- **Geschätztes Endkapital:** Einzahlungen plus Erträge.

## Rechenbeispiel: 200 € im Monat über 20 Jahre

Sie sparen **20 Jahre lang 200 € pro Monat**, ohne Anfangskapital. Insgesamt zahlen Sie damit **48.000 €** ein. Wie viel am Ende herauskommt, hängt stark von der angenommenen Rendite ab:

| Angenommene Rendite p. a. | Geschätztes Endkapital | Davon Erträge |
| --- | --- | --- |
| 3 % | ca. 65.532 € | ca. 17.532 € |
| 5 % | ca. 81.492 € | ca. 33.492 € |
| 7 % | ca. 102.081 € | ca. 54.081 € |

Die Tabelle zeigt, wie empfindlich das Ergebnis auf die Renditeannahme reagiert: Zwischen 3 % und 7 % liegen über 36.000 €. Rechnen Sie deshalb nicht nur mit einem einzigen, optimistischen Wert.

Auch die **Laufzeit** wirkt stark: Bei 5 % Rendite ergeben 200 € monatlich nach 10 Jahren rund 30.998 € (Einzahlungen: 24.000 €), nach 30 Jahren dagegen rund 163.740 € (Einzahlungen: 72.000 €). Die Erträge übersteigen nach 30 Jahren also die eigenen Einzahlungen.

### Mit Dynamik

Erhöhen Sie die Sparrate im gleichen Beispiel (5 %, 20 Jahre) jedes Jahr um **2 %**, steigt sie bis zum letzten Jahr auf rund 291 € pro Monat. Sie zahlen dann insgesamt etwa 58.314 € ein, das geschätzte Endkapital liegt bei rund 95.898 €.

## Warum das Ergebnis nur eine Schätzung ist

Wertpapiere haben keine feste Rendite. Kurse schwanken, Märkte können über mehrere Jahre fallen, und es kann zu Verlusten kommen. Die Berechnung mit einer konstanten Durchschnittsrendite blendet diese Schwankungen aus. Selbst wenn die durchschnittliche Rendite am Ende stimmen sollte, hängt das tatsächliche Endkapital auch davon ab, **wann** gute und schlechte Jahre auftreten – besonders kurz vor dem Ende der Laufzeit.

Zusätzlich sind im Ergebnis nicht enthalten:

- **Kosten** wie laufende Fondskosten, Depotgebühren oder Ausgabeaufschläge,
- **Steuern** auf Erträge (Abgeltungsteuer, ggf. mit Teilfreistellung bei Aktienfonds),
- **Inflation**, die die Kaufkraft des Endkapitals verringert.

Laufende Kosten können Sie näherungsweise berücksichtigen, indem Sie die angenommene Rendite um die jährlichen Kosten in Prozent reduzieren.

## Wofür der Sparplanrechner hilfreich ist

- **Sparziele planen:** Wie hoch muss die Sparrate sein, um in einer bestimmten Zeit ein Ziel zu erreichen?
- **Szenarien vergleichen:** Wie unterscheidet sich das Ergebnis bei vorsichtigen und optimistischen Annahmen?
- **Altersvorsorge verstehen:** Wie stark wirkt ein früher Start im Vergleich zu einem späteren Beginn?
- **Eigenkapital aufbauen:** etwa als Vorbereitung auf eine Baufinanzierung – die Sie anschließend mit dem [Tilgungsrechner](/tilgungsrechner/) planen können.

Wie sich eine einzelne Investition im Nachhinein rentiert hat, berechnen Sie mit dem [ROI-Rechner](/roi-rechner/).

> **Hinweis:** Diese Berechnung stellt keine Anlageberatung dar. Für eine Anlageentscheidung sollten Sie Ihre persönliche Situation, Ihre Risikobereitschaft und die konkreten Produktbedingungen prüfen.
