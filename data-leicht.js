const parseLevel = (text) => text.trim().split("\n").map((line) => {
  const words = line.split(" ");
  const syllables = [];
  const sentence = words.map((word) => {
    const parts = word.split("-");
    syllables.push(...parts);
    return parts.join("");
  }).join(" ");
  return { sentence, syllables };
});

const DATA_LEICHT = parseLevel(`Die Kat-ze schläft auf dem So-fa.
Der Ha-se frisst ei-ne Möh-re.
Im Gar-ten blü-hen vie-le Blu-men.
Le-na malt ein bun-tes Bild.
Der klei-ne Hund spielt im Park.
Heu-te scheint die war-me Son-ne.
Wir le-sen zu-sam-men ein Buch.
Paul fährt mit sei-nem Fahr-rad.
Die Kin-der la-chen auf dem Spiel-platz.
Am A-bend leuch-ten die Ster-ne.
Ma-ma kocht ei-ne le-cke-re Sup-pe.
Der Vo-gel singt auf dem Baum.
Tom baut ei-nen ho-hen Turm.
Im Win-ter fällt wei-ßer Schnee.
Das Pferd läuft ü-ber die Wie-se.
Li-sa trägt ei-ne ro-te Müt-ze.
Der Frosch sitzt am klei-nen Teich.
Wir ma-chen heu-te ei-nen Aus-flug.
Das Ba-by lacht in sei-nem Bett.
Im Wald lebt ein scheu-es Reh.
Die Maus frisst ein Stück Kä-se.
Ben spielt mit sei-nem neu-en Ball.
Auf dem Tisch steht ei-ne Tas-se.
Der Bus fährt zur Schu-le.
Das Eis schmeckt süß und kalt.
Mei-ne Oma backt ei-nen Ku-chen.
Der Re-gen trom-melt an das Fens-ter.
Wir sam-meln bun-te Blät-ter.
Das Boot fährt auf dem See.
Die En-te schwimmt mit ih-ren Kü-ken.
Im Zoo se-hen wir ei-nen Lö-wen.
Der Mond steht hoch am Him-mel.
Sa-ra schreibt ei-nen kur-zen Brief.
Die Bie-ne fliegt von Blü-te zu Blü-te.
Der Ap-fel liegt im grü-nen Gras.
Wir sin-gen ein fröh-li-ches Lied.
Auf dem Hof kräht der Hahn.
Das Kind öff-net sei-ne Schul-tü-te.
Im Sand liegt ei-ne schö-ne Mu-schel.
Der Bä-cker backt fri-sche Bröt-chen.
Die Wol-ken zie-hen ü-ber das Haus.
Tim trinkt ein Glas Was-ser.
Der I-gel sucht ein Ver-steck.
Wir bas-teln ei-nen bun-ten Dra-chen.
Das Eich-hörn-chen sam-melt Nüs-se.
Auf der Bank sitzt ein al-ter Mann.
Die Son-ne wärmt mein Ge-sicht.
Der Zug hält am Bahn-hof.
Im Früh-ling wach-sen jun-ge Pflan-zen.
Das Mäd-chen füt-tert die klei-ne Kat-ze.`);