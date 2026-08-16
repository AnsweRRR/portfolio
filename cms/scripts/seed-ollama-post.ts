// One-off seed script for the first real blog post (Ollama on Raspberry Pi 4),
// written from a supplied .md source and translated into all 3 site locales.
// Mirrors migrate.ts's shape: dotenv/config + Payload's Local API, not the CLI.
// Safe to re-run — both the category and the post are looked up by slug first.
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config';

type Locale = 'en' | 'hu' | 'de';
const LOCALES: Locale[] = ['en', 'hu', 'de'];

// --- Minimal Lexical node builders -----------------------------------------
// payload.config.ts uses lexicalEditor({}) with only the default feature set
// (paragraph, heading, lists, blockquote, link, text formatting, inline-code —
// confirmed via the generated importMap.js). There is no block-level code
// feature and no table feature registered, so:
//   - command-line snippets become paragraphs using the inline-code format bit
//   - the hardware spec table becomes a bullet list of "Key: value" lines

const INLINE_CODE_FORMAT = 16; // lexical TextFormatType bit for inline code

function textNode(text: string, code = false) {
  return {
    type: 'text',
    detail: 0,
    format: code ? INLINE_CODE_FORMAT : 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  };
}

function paragraph(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [textNode(text)],
  };
}

function heading(text: string) {
  return {
    type: 'heading',
    tag: 'h2',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [textNode(text)],
  };
}

function bulletList(items: string[]) {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((item, i) => ({
      type: 'listitem',
      value: i + 1,
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [textNode(item)],
    })),
  };
}

function codeLines(lines: string[]) {
  return lines
    .filter((line) => line.length > 0)
    .map((line) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [textNode(line, true)],
    }));
}

function lexicalState(nodes: unknown[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: nodes,
    },
  };
}

// --- Article content, per locale --------------------------------------------

type Block = ['p', string] | ['h2', string] | ['ul', string[]] | ['code', string[]];

const UPDATE_CMD = ['sudo apt update', 'sudo apt upgrade -y'];
const CHECK_ARCH_CMD = ['uname -m'];
const CHECK_ARCH_RESULT = ['aarch64'];
const INSTALL_OLLAMA_CMD = ['curl -fsSL https://ollama.com/install.sh | sh'];
const OLLAMA_VERSION_CMD = ['ollama --version'];
const OLLAMA_STATUS_CMD = ['systemctl status ollama'];
const PULL_MODEL_CMD = ['ollama pull qwen2.5:3b'];
const RUN_MODEL_CMD = ['ollama run qwen2.5:3b'];
const TEMP_CMD = ['vcgencmd measure_temp'];
const MINIMAL_SETUP_CMD = [
  'sudo apt update',
  'sudo apt upgrade -y',
  '',
  'curl -fsSL https://ollama.com/install.sh | sh',
  '',
  'ollama pull qwen2.5:3b',
  'ollama run qwen2.5:3b',
];

const SECTIONS: Record<Locale, Block[]> = {
  hu: [
    ['p', 'A lokális, self-hosted Large Language Modellek (LLM-ek) futtatása az elmúlt években egyre egyszerűbbé vált. Ehhez már nem feltétlenül szükséges egy nagy teljesítményű szerver vagy dedikált AI hardver: kisebb, kvantált modellek megfelelő beállítások mellett akár egy Raspberry Pi-on is futtathatók.'],
    ['p', 'Ebben a cikkben egy Raspberry Pi 4 Model B 4 GB RAM-mal konfigurációt mutatok be, amelyen Raspberry Pi OS Lite 64-bit és Ollama fut. A modellek tárolására egy 500 GB-os HDD szolgál.'],
    ['p', 'A cél egy egyszerű, alacsony fogyasztású, lokálisan működő LLM-környezet kialakítása.'],

    ['h2', 'Hardver és szoftver'],
    ['p', 'A tesztkörnyezet a következő:'],
    ['ul', [
      'Raspberry Pi: Raspberry Pi 4 Model B',
      'RAM: 4 GB',
      'Operációs rendszer: Raspberry Pi OS Lite 64-bit',
      'LLM runtime: Ollama',
      'Tárhely: 500 GB HDD',
      'Modell: Qwen2.5 3B',
    ]],
    ['p', 'A 4 GB RAM miatt nem érdemes nagy modellekkel tervezni. A több milliárd paraméteres modellek közül is inkább a kisebb, kvantált változatok használata célszerű.'],
    ['p', 'A cikkben a Qwen2.5 3B modellt használjuk példaként. A 3B kategória jó kompromisszum lehet a Raspberry Pi 4 korlátozott memóriája és a modell képességei között.'],

    ['h2', 'Raspberry Pi OS telepítése'],
    ['p', 'Első lépésként egy 64 bites Raspberry Pi OS Lite rendszert érdemes használni.'],
    ['p', 'A Lite kiadás nem tartalmaz grafikus asztali környezetet, ami ebben az esetben előny. Az LLM futtatásához nincs szükség GUI-ra, ezért a rendelkezésre álló erőforrások nagyobb része maradhat a tényleges feladatokra.'],
    ['p', 'A telepítés után érdemes frissíteni a rendszert:'],
    ['code', UPDATE_CMD],
    ['p', 'Ezután ellenőrizhető, hogy a rendszer valóban 64 bites:'],
    ['code', CHECK_ARCH_CMD],
    ['p', 'A megfelelő telepítés esetén jellemzően az alábbi értéket kapjuk:'],
    ['code', CHECK_ARCH_RESULT],

    ['h2', 'Az Ollama telepítése'],
    ['p', 'Az Ollama telepítését a hivatalos telepítő script segítségével lehet elvégezni:'],
    ['code', INSTALL_OLLAMA_CMD],
    ['p', 'A telepítés után ellenőrizzük a verziót:'],
    ['code', OLLAMA_VERSION_CMD],
    ['p', 'Az Ollama szolgáltatás állapota systemd alatt is ellenőrizhető:'],
    ['code', OLLAMA_STATUS_CMD],
    ['p', 'Ha a szolgáltatás fut, az Ollama készen áll a modellek használatára.'],

    ['h2', 'LLM letöltése'],
    ['p', 'A Raspberry Pi 4 4 GB RAM-mal nem alkalmas nagyobb, több tízmilliárd paraméteres modellek kényelmes futtatására. Érdemes ezért kisebb modellt választani.'],
    ['code', PULL_MODEL_CMD],
    ['p', 'A modell elindítása:'],
    ['code', RUN_MODEL_CMD],
    ['p', 'Ezzel egy interaktív terminál jelenik meg, ahol közvetlenül lehet kérdéseket küldeni a modellnek.'],

    ['h2', 'Hogyan működik az Ollama?'],
    ['p', 'Az Ollama egy olyan runtime és kezelőréteg, amely leegyszerűsíti a lokális LLM-ek futtatását. A felhasználónak nem kell manuálisan kezelnie a modellfájlokat és az inference környezet minden részletét — az Ollama a modellek letöltését, tárolását és futtatását is kezeli.'],
    ['p', 'A legfontosabb parancsok:'],
    ['ul', [
      'ollama list — a telepített modellek listázása',
      'ollama pull <modell> — egy modell letöltése',
      'ollama run <modell> — egy modell interaktív futtatása',
      'ollama rm <modell> — egy modell törlése',
      'ollama ps — az aktuálisan betöltött modellek megjelenítése',
    ]],

    ['h2', 'A Raspberry Pi 4 korlátai'],
    ['p', 'A Raspberry Pi 4 egyik legfontosabb korlátja a memória. A 4 GB RAM egy kisebb LLM futtatásához elegendő lehet, azonban a teljes rendelkezésre álló memória nem használható kizárólag a modell számára — az operációs rendszer és a háttérben futó szolgáltatások is fogyasztanak memóriát.'],
    ['p', 'A másik jelentős korlátozás a GPU-s gyorsítás hiánya. Egy Raspberry Pi 4 nem rendelkezik AI célú GPU-val, ezért az inference sebessége jelentősen alacsonyabb lehet egy dedikált GPU-val rendelkező rendszernél.'],
    ['p', 'A Raspberry Pi ebben a konfigurációban elsősorban a következőkre lehet megfelelő:'],
    ['ul', ['kísérletezés', 'lokális AI szolgáltatások', 'egyszerű chatbotok', 'automatizálási feladatok', 'kisebb szöveggenerálási feladatok']],
    ['p', 'Nagyobb modellek gyors futtatására nem ez a megfelelő hardver.'],

    ['h2', 'A HDD használata'],
    ['p', 'Az 500 GB-os HDD elsősorban a modellek és egyéb adatok tárolására használható. Több LLM telepítése esetén a tárhelyigény gyorsan növekedhet, ezért egy nagyobb háttértár praktikus.'],
    ['p', 'Teljesítmény szempontjából azonban fontos különbséget tenni a tárhelykapacitás és a tárhely sebessége között. Egy HDD nagyobb kapacitást biztosít, de egy SSD általában gyorsabb — ha a cél a lehető legjobb válaszidő, egy USB 3-as SSD jobb választás lehet a Raspberry Pi 4 mellett.'],
    ['p', 'A HDD használata ettől függetlenül megfelelő lehet olyan esetekben, amikor a nagy tárhely fontosabb, mint a maximális I/O teljesítmény.'],

    ['h2', 'Hőmérséklet és throttling'],
    ['p', 'Az LLM futtatása hosszabb időn keresztül magas CPU-terhelést okozhat, ezért a hűtés fontos szempont. A Raspberry Pi hőmérséklete például az alábbi paranccsal ellenőrizhető:'],
    ['code', TEMP_CMD],
    ['p', 'Tartós LLM-futtatás esetén érdemes aktív hűtést használni. Ha a CPU túlmelegszik, a Raspberry Pi teljesítménycsökkentést alkalmazhat (thermal throttling), amely közvetlenül befolyásolhatja az inference sebességét.'],
    ['p', 'Egy megfelelően szellőző ház és aktív hűtés ezért nem csak a hardver élettartama miatt hasznos, hanem a stabil teljesítmény fenntartásához is.'],

    ['h2', 'Az Ollama API használata'],
    ['p', 'Az Ollama nem kizárólag terminálból használható: háttérben API-t is biztosít, így más alkalmazásokból is lehet LLM-kéréseket küldeni. Ez teszi igazán érdekessé self-hosted környezetben — egy saját alkalmazás például az Ollama szolgáltatásán keresztül küldhet promptokat a modellnek, majd feldolgozhatja a választ.'],
    ['code', ['Saját alkalmazás', '     |', '     v', '  Ollama API', '     |', '     v', '     LLM', '     |', '     v', 'Generált válasz']],

    ['h2', 'Self-hosted AI szerverré alakítás'],
    ['p', 'Az Ollama API miatt a rendszer könnyen továbbépíthető: a Raspberry Pi lehet egy belső hálózaton elérhető AI backend, ahol maga az LLM a Pi-n fut, míg a kliens lehet egy laptop, mobiltelefon, saját webalkalmazás vagy automatizálási rendszer.'],
    ['code', ['Laptop / PC', '     |', '     v', 'Raspberry Pi 4', '  Ollama', '  Qwen2.5 3B']],
    ['p', 'A hálózati kitettségre azonban figyelni kell — egy lokális AI API-t nem érdemes megfelelő védelem nélkül közvetlenül az internetre publikálni.'],

    ['h2', 'Mit érdemes még hozzáadni?'],
    ['p', 'Az Ollama önmagában egy egyszerű CLI-alapú megoldás, de többféle frontend is használható hozzá. Az egyik népszerű lehetőség az Open WebUI, amely webes felületet biztosít az Ollama modellekhez — egy ilyen frontenddel már sokkal inkább egy saját ChatGPT-szerű rendszer alakítható ki.'],
    ['p', 'A Raspberry Pi 4 hardverkorlátai miatt azonban itt is érdemes figyelni arra, hogy a webes frontend további memóriát és CPU-erőforrást használ. Ha a cél kifejezetten egy minimalista AI szerver, az Ollama önmagában is elegendő lehet.'],

    ['h2', 'Mit érdemes várni teljesítmény szempontjából?'],
    ['p', 'A Raspberry Pi 4 + 4 GB RAM nem teljesítményorientált LLM platform. A kisebb modellek futtatása működőképes, de a generálási sebesség jelentősen elmarad egy modern, GPU-val felszerelt számítógépétől.'],
    ['p', 'Ezért a Raspberry Pi-t érdemes inkább olyan feladatokra használni, ahol:'],
    ['ul', ['nem kritikus a válaszidő', 'kisebb modell is elegendő', 'fontos a folyamatos üzem', 'fontos a lokális adatfeldolgozás', 'alacsony fogyasztású hardverre van szükség']],
    ['p', 'Ha viszont nagyobb modelleket szeretnénk gyorsan futtatni, érdemes erősebb CPU-val és főleg dedikált GPU-val rendelkező rendszert használni.'],

    ['h2', 'Összegzés'],
    ['p', 'Egy Raspberry Pi 4 Model B 4 GB RAM-mal nem helyettesít egy modern AI workstationt, de megfelelően megválasztott, kisebb modellekkel alkalmas lehet lokális LLM futtatására.'],
    ['p', 'A Raspberry Pi OS Lite 64-bit + Ollama + kisebb LLM kombináció előnye, hogy egyszerűen telepíthető és kevés komponensből áll. A minimális setup:'],
    ['code', MINIMAL_SETUP_CMD],
    ['p', 'Ezzel egy teljesen lokális LLM-környezet hozható létre, amely később API-n keresztül más alkalmazásokkal is integrálható.'],
    ['p', 'A Raspberry Pi 4 legnagyobb korlátja a rendelkezésre álló memória és a számítási teljesítmény, ezért a modellválasztás kulcsfontosságú. A kisebb modellek használatával azonban már egy jól használható alap építhető egy saját, self-hosted AI rendszerhez.'],
  ],

  en: [
    ['p', 'Running local, self-hosted Large Language Models (LLMs) has gotten a lot easier over the past few years. You no longer necessarily need a high-performance server or dedicated AI hardware — with the right setup, smaller quantized models can run even on a Raspberry Pi.'],
    ['p', 'This article walks through a Raspberry Pi 4 Model B with 4 GB of RAM, running Raspberry Pi OS Lite 64-bit and Ollama. A 500 GB HDD is used to store the models.'],
    ['p', 'The goal is a simple, low-power, fully local LLM environment.'],

    ['h2', 'Hardware and software'],
    ['p', 'The test setup is as follows:'],
    ['ul', [
      'Raspberry Pi: Raspberry Pi 4 Model B',
      'RAM: 4 GB',
      'Operating system: Raspberry Pi OS Lite 64-bit',
      'LLM runtime: Ollama',
      'Storage: 500 GB HDD',
      'Model: Qwen2.5 3B',
    ]],
    ['p', 'With only 4 GB of RAM, large models are out of the question. Among the many-billion-parameter models, smaller quantized variants are the practical choice.'],
    ['p', "This article uses Qwen2.5 3B as the example model. The 3B class is a reasonable compromise between the Raspberry Pi 4's limited memory and the model's capabilities."],

    ['h2', 'Installing Raspberry Pi OS'],
    ['p', 'Start with a 64-bit Raspberry Pi OS Lite install.'],
    ['p', "The Lite edition skips the graphical desktop, which is actually an advantage here — running an LLM doesn't need a GUI, so more of the available resources stay free for the actual workload."],
    ['p', 'After installation, update the system:'],
    ['code', UPDATE_CMD],
    ['p', "Then confirm the system is really 64-bit:"],
    ['code', CHECK_ARCH_CMD],
    ['p', 'A correct installation typically reports:'],
    ['code', CHECK_ARCH_RESULT],

    ['h2', 'Installing Ollama'],
    ['p', 'Ollama can be installed using the official install script:'],
    ['code', INSTALL_OLLAMA_CMD],
    ['p', 'After installation, check the version:'],
    ['code', OLLAMA_VERSION_CMD],
    ['p', "The Ollama service's status can also be checked via systemd:"],
    ['code', OLLAMA_STATUS_CMD],
    ['p', 'If the service is running, Ollama is ready to serve models.'],

    ['h2', 'Downloading a model'],
    ['p', "A Raspberry Pi 4 with 4 GB of RAM isn't suited for comfortably running larger, tens-of-billions-of-parameters models, so it's worth picking a smaller one."],
    ['code', PULL_MODEL_CMD],
    ['p', 'Start the model:'],
    ['code', RUN_MODEL_CMD],
    ['p', 'This opens an interactive terminal session where you can send prompts directly to the model.'],

    ['h2', 'How Ollama works'],
    ['p', "Ollama is a runtime and management layer that simplifies running local LLMs. You don't have to manage model files or the details of the inference environment by hand — Ollama handles downloading, storing, and running the models."],
    ['p', 'The most important commands:'],
    ['ul', [
      'ollama list — list installed models',
      'ollama pull <model> — download a model',
      'ollama run <model> — run a model interactively',
      'ollama rm <model> — remove a model',
      'ollama ps — show currently loaded models',
    ]],

    ['h2', 'Limitations of the Raspberry Pi 4'],
    ["p", "The Raspberry Pi 4's biggest constraint is memory. 4 GB of RAM can be enough for a smaller LLM, but the full amount isn't available to the model alone — the OS and background services also consume memory."],
    ['p', 'The other major limitation is the lack of GPU acceleration. A Raspberry Pi 4 has no AI-grade GPU, so inference speed is significantly lower than on a system with a dedicated GPU.'],
    ['p', 'In this configuration, the Raspberry Pi is mainly suited for:'],
    ['ul', ['experimentation', 'local AI services', 'simple chatbots', 'automation tasks', 'small text-generation tasks']],
    ["p", "It's not the right hardware for running larger models quickly."],

    ['h2', 'Using the HDD'],
    ['p', 'The 500 GB HDD is mainly used to store models and other data. Installing multiple LLMs can quickly grow the storage footprint, so a larger drive is practical.'],
    ["p", "For performance, though, it's important to distinguish storage capacity from storage speed. An HDD offers more capacity, but an SSD is generally faster — if the goal is the best possible response time, a USB 3 SSD is a better choice alongside the Raspberry Pi 4."],
    ['p', 'That said, an HDD is still a fine choice when large capacity matters more than maximum I/O throughput.'],

    ['h2', 'Temperature and throttling'],
    ["p", "Running an LLM for extended periods can cause high CPU load, which makes cooling an important consideration. The Raspberry Pi's temperature can be checked with:"],
    ['code', TEMP_CMD],
    ['p', 'For sustained LLM use, active cooling is worth it. If the CPU overheats, the Raspberry Pi may apply thermal throttling, which directly affects inference speed.'],
    ["p", "A well-ventilated case and active cooling aren't just good for hardware longevity — they also help maintain stable performance."],

    ['h2', 'Using the Ollama API'],
    ["p", "Ollama isn't limited to the terminal — it also exposes an API in the background, so other applications can send LLM requests too. This is what makes it genuinely useful in a self-hosted setup: your own application can send prompts to the model through the Ollama service and process the response."],
    ['code', ['Your application', '     |', '     v', '  Ollama API', '     |', '     v', '     LLM', '     |', '     v', 'Generated response']],

    ['h2', 'Turning it into a self-hosted AI server'],
    ['p', 'Thanks to the Ollama API, the setup is easy to extend: the Raspberry Pi can act as an AI backend reachable on the local network, with the LLM itself running on the Pi while the client is a laptop, phone, a custom web app, or an automation system.'],
    ['code', ['Laptop / PC', '     |', '     v', 'Raspberry Pi 4', '  Ollama', '  Qwen2.5 3B']],
    ["p", "Network exposure does need care, though — a local AI API shouldn't be published directly to the internet without proper protection."],

    ['h2', 'What else is worth adding?'],
    ['p', 'Ollama by itself is a simple CLI-based tool, but several frontends can sit on top of it. One popular option is Open WebUI, which provides a web interface for Ollama models — with a frontend like that, you get something much closer to your own ChatGPT-style system.'],
    ["p", "Given the Raspberry Pi 4's hardware limits, keep in mind that a web frontend uses additional memory and CPU. If the goal is specifically a minimalist AI server, Ollama on its own is enough."],

    ['h2', 'What to expect performance-wise'],
    ['p', 'A Raspberry Pi 4 with 4 GB of RAM is not a performance-oriented LLM platform. Running smaller models works, but generation speed lags well behind a modern, GPU-equipped machine.'],
    ["p", "So it's best to reserve the Raspberry Pi for tasks where:"],
    ['ul', ["response time isn't critical", 'a smaller model is good enough', 'always-on operation matters', 'local data processing matters', 'low power draw is a requirement']],
    ['p', 'If you want to run larger models quickly, use a system with a stronger CPU and, especially, a dedicated GPU.'],

    ['h2', 'Summary'],
    ["p", "A Raspberry Pi 4 Model B with 4 GB of RAM won't replace a modern AI workstation, but with the right, smaller models it's a workable option for running a local LLM."],
    ["p", "The advantage of the Raspberry Pi OS Lite 64-bit + Ollama + small-LLM combination is that it's simple to set up and has few moving parts. The minimal setup:"],
    ['code', MINIMAL_SETUP_CMD],
    ['p', 'This gives you a fully local LLM environment that can later be integrated with other applications via its API.'],
    ["p", "The Raspberry Pi 4's biggest constraints are available memory and compute, so choosing the right model matters most. Even so, smaller models are enough to build a genuinely usable foundation for your own self-hosted AI system."],
  ],

  de: [
    ['p', 'Der Betrieb lokaler, selbst gehosteter Large Language Models (LLMs) ist in den letzten Jahren deutlich einfacher geworden. Dafür braucht man nicht zwingend einen leistungsstarken Server oder dedizierte KI-Hardware — mit der richtigen Konfiguration laufen kleinere, quantisierte Modelle sogar auf einem Raspberry Pi.'],
    ['p', 'In diesem Artikel wird ein Raspberry Pi 4 Model B mit 4 GB RAM vorgestellt, auf dem Raspberry Pi OS Lite 64-Bit und Ollama laufen. Zur Speicherung der Modelle dient eine 500-GB-HDD.'],
    ['p', 'Ziel ist eine einfache, stromsparende, vollständig lokale LLM-Umgebung.'],

    ['h2', 'Hardware und Software'],
    ['p', 'Die Testumgebung sieht wie folgt aus:'],
    ['ul', [
      'Raspberry Pi: Raspberry Pi 4 Model B',
      'RAM: 4 GB',
      'Betriebssystem: Raspberry Pi OS Lite 64-Bit',
      'LLM-Runtime: Ollama',
      'Speicher: 500 GB HDD',
      'Modell: Qwen2.5 3B',
    ]],
    ['p', 'Mit nur 4 GB RAM sind große Modelle keine Option. Unter den Modellen mit mehreren Milliarden Parametern sind kleinere, quantisierte Varianten die praktikable Wahl.'],
    ['p', 'Dieser Artikel verwendet Qwen2.5 3B als Beispielmodell. Die 3B-Klasse ist ein vernünftiger Kompromiss zwischen dem begrenzten Speicher des Raspberry Pi 4 und den Fähigkeiten des Modells.'],

    ['h2', 'Raspberry Pi OS installieren'],
    ['p', 'Als Erstes empfiehlt sich eine 64-Bit-Installation von Raspberry Pi OS Lite.'],
    ['p', 'Die Lite-Edition verzichtet auf eine grafische Desktop-Umgebung, was hier von Vorteil ist — für den Betrieb eines LLM wird keine GUI benötigt, sodass mehr der verfügbaren Ressourcen für die eigentliche Aufgabe übrig bleiben.'],
    ['p', 'Nach der Installation sollte das System aktualisiert werden:'],
    ['code', UPDATE_CMD],
    ['p', 'Danach lässt sich prüfen, ob das System wirklich 64-Bit ist:'],
    ['code', CHECK_ARCH_CMD],
    ['p', 'Bei korrekter Installation liefert das typischerweise:'],
    ['code', CHECK_ARCH_RESULT],

    ['h2', 'Ollama installieren'],
    ['p', 'Ollama lässt sich über das offizielle Installationsskript installieren:'],
    ['code', INSTALL_OLLAMA_CMD],
    ['p', 'Nach der Installation die Version prüfen:'],
    ['code', OLLAMA_VERSION_CMD],
    ['p', 'Der Status des Ollama-Dienstes lässt sich auch über systemd prüfen:'],
    ['code', OLLAMA_STATUS_CMD],
    ['p', 'Läuft der Dienst, ist Ollama bereit, Modelle bereitzustellen.'],

    ['h2', 'Ein Modell herunterladen'],
    ['p', 'Ein Raspberry Pi 4 mit 4 GB RAM eignet sich nicht dafür, größere Modelle mit mehreren Dutzend Milliarden Parametern komfortabel auszuführen — daher lohnt sich die Wahl eines kleineren Modells.'],
    ['code', PULL_MODEL_CMD],
    ['p', 'Das Modell starten:'],
    ['code', RUN_MODEL_CMD],
    ['p', 'Damit öffnet sich ein interaktives Terminal, über das sich Anfragen direkt an das Modell senden lassen.'],

    ['h2', 'Wie Ollama funktioniert'],
    ['p', 'Ollama ist eine Runtime- und Verwaltungsschicht, die den Betrieb lokaler LLMs vereinfacht. Modelldateien und die Details der Inferenzumgebung müssen nicht manuell verwaltet werden — Ollama übernimmt Download, Speicherung und Ausführung der Modelle.'],
    ['p', 'Die wichtigsten Befehle:'],
    ['ul', [
      'ollama list — installierte Modelle auflisten',
      'ollama pull <modell> — ein Modell herunterladen',
      'ollama run <modell> — ein Modell interaktiv ausführen',
      'ollama rm <modell> — ein Modell löschen',
      'ollama ps — aktuell geladene Modelle anzeigen',
    ]],

    ['h2', 'Grenzen des Raspberry Pi 4'],
    ['p', 'Die größte Einschränkung des Raspberry Pi 4 ist der Arbeitsspeicher. 4 GB RAM können für ein kleineres LLM ausreichen, aber der gesamte verfügbare Speicher steht nicht allein dem Modell zur Verfügung — auch das Betriebssystem und Hintergrunddienste verbrauchen Speicher.'],
    ['p', 'Die andere wesentliche Einschränkung ist das Fehlen von GPU-Beschleunigung. Ein Raspberry Pi 4 verfügt über keine KI-taugliche GPU, weshalb die Inferenzgeschwindigkeit deutlich niedriger ausfällt als bei einem System mit dedizierter GPU.'],
    ['p', 'In dieser Konfiguration eignet sich der Raspberry Pi vor allem für:'],
    ['ul', ['Experimente', 'lokale KI-Dienste', 'einfache Chatbots', 'Automatisierungsaufgaben', 'kleinere Textgenerierungsaufgaben']],
    ['p', 'Für das schnelle Ausführen größerer Modelle ist dies nicht die passende Hardware.'],

    ['h2', 'Die HDD nutzen'],
    ['p', 'Die 500-GB-HDD dient vor allem der Speicherung von Modellen und anderen Daten. Bei mehreren installierten LLMs kann der Speicherbedarf schnell wachsen, weshalb ein größeres Speichermedium praktisch ist.'],
    ['p', 'Leistungsseitig ist es jedoch wichtig, zwischen Speicherkapazität und Speichergeschwindigkeit zu unterscheiden. Eine HDD bietet mehr Kapazität, eine SSD ist aber in der Regel schneller — geht es um die bestmögliche Antwortzeit, ist eine USB-3-SSD neben dem Raspberry Pi 4 die bessere Wahl.'],
    ['p', 'Unabhängig davon ist eine HDD durchaus geeignet, wenn großer Speicherplatz wichtiger ist als maximaler I/O-Durchsatz.'],

    ['h2', 'Temperatur und Throttling'],
    ['p', 'Der Betrieb eines LLM über längere Zeit kann hohe CPU-Last verursachen, weshalb die Kühlung ein wichtiger Aspekt ist. Die Temperatur des Raspberry Pi lässt sich zum Beispiel mit folgendem Befehl prüfen:'],
    ['code', TEMP_CMD],
    ['p', 'Bei dauerhaftem LLM-Betrieb lohnt sich aktive Kühlung. Überhitzt die CPU, kann der Raspberry Pi thermisches Throttling anwenden, was die Inferenzgeschwindigkeit direkt beeinträchtigt.'],
    ['p', 'Ein gut belüftetes Gehäuse und aktive Kühlung sind daher nicht nur für die Lebensdauer der Hardware nützlich, sondern auch für eine stabile Leistung.'],

    ['h2', 'Die Ollama-API nutzen'],
    ['p', 'Ollama lässt sich nicht nur über das Terminal nutzen — im Hintergrund stellt es auch eine API bereit, sodass auch andere Anwendungen LLM-Anfragen senden können. Das macht es in einer selbst gehosteten Umgebung besonders interessant: Eine eigene Anwendung kann über den Ollama-Dienst Prompts an das Modell senden und die Antwort weiterverarbeiten.'],
    ['code', ['Eigene Anwendung', '     |', '     v', '  Ollama API', '     |', '     v', '     LLM', '     |', '     v', 'Generierte Antwort']],

    ['h2', 'Zum selbst gehosteten KI-Server ausbauen'],
    ['p', 'Dank der Ollama-API lässt sich das System leicht erweitern: Der Raspberry Pi kann als im lokalen Netzwerk erreichbares KI-Backend fungieren, wobei das LLM selbst auf dem Pi läuft, während der Client ein Laptop, ein Smartphone, eine eigene Webanwendung oder ein Automatisierungssystem sein kann.'],
    ['code', ['Laptop / PC', '     |', '     v', 'Raspberry Pi 4', '  Ollama', '  Qwen2.5 3B']],
    ['p', 'Bei der Netzwerkexposition ist jedoch Vorsicht geboten — eine lokale KI-API sollte nicht ohne angemessenen Schutz direkt ins Internet veröffentlicht werden.'],

    ['h2', 'Was lohnt sich noch hinzuzufügen?'],
    ['p', 'Ollama allein ist eine einfache, CLI-basierte Lösung, aber es lassen sich mehrere Frontends darauf aufsetzen. Eine beliebte Option ist Open WebUI, das eine Weboberfläche für Ollama-Modelle bereitstellt — mit einem solchen Frontend entsteht etwas, das deutlich näher an einem eigenen ChatGPT-artigen System liegt.'],
    ['p', 'Wegen der Hardwaregrenzen des Raspberry Pi 4 sollte man aber bedenken, dass ein Web-Frontend zusätzlichen Speicher und zusätzliche CPU-Ressourcen benötigt. Geht es speziell um einen minimalistischen KI-Server, reicht Ollama allein aus.'],

    ['h2', 'Was ist leistungsmäßig zu erwarten?'],
    ['p', 'Ein Raspberry Pi 4 mit 4 GB RAM ist keine leistungsorientierte LLM-Plattform. Kleinere Modelle laufen zwar, die Generierungsgeschwindigkeit bleibt aber deutlich hinter einem modernen, GPU-ausgestatteten Rechner zurück.'],
    ['p', 'Der Raspberry Pi eignet sich daher besonders für Aufgaben, bei denen:'],
    ['ul', ['die Antwortzeit nicht kritisch ist', 'ein kleineres Modell ausreicht', 'Dauerbetrieb wichtig ist', 'lokale Datenverarbeitung wichtig ist', 'stromsparende Hardware benötigt wird']],
    ['p', 'Sollen größere Modelle schnell laufen, empfiehlt sich ein System mit stärkerer CPU und vor allem einer dedizierten GPU.'],

    ['h2', 'Zusammenfassung'],
    ['p', 'Ein Raspberry Pi 4 Model B mit 4 GB RAM ersetzt keine moderne KI-Workstation, ist aber mit passend gewählten, kleineren Modellen eine brauchbare Option für den Betrieb eines lokalen LLM.'],
    ['p', 'Der Vorteil der Kombination Raspberry Pi OS Lite 64-Bit + Ollama + kleines LLM liegt in der einfachen Einrichtung mit wenigen Komponenten. Das minimale Setup:'],
    ['code', MINIMAL_SETUP_CMD],
    ['p', 'Damit lässt sich eine vollständig lokale LLM-Umgebung aufbauen, die sich später über die API auch mit anderen Anwendungen integrieren lässt.'],
    ['p', 'Die größten Einschränkungen des Raspberry Pi 4 sind der verfügbare Speicher und die Rechenleistung, weshalb die Modellwahl entscheidend ist. Mit kleineren Modellen lässt sich dennoch bereits eine gut nutzbare Grundlage für ein eigenes, selbst gehostetes KI-System aufbauen.'],
  ],
};

function buildContent(locale: Locale) {
  const nodes: unknown[] = [];
  for (const [kind, value] of SECTIONS[locale]) {
    if (kind === 'p') nodes.push(paragraph(value as string));
    else if (kind === 'h2') nodes.push(heading(value as string));
    else if (kind === 'ul') nodes.push(bulletList(value as string[]));
    else nodes.push(...codeLines(value as string[]));
  }
  return lexicalState(nodes);
}

const TITLE: Record<Locale, string> = {
  en: 'Running a Self-Hosted LLM on a Raspberry Pi 4 with Ollama',
  hu: 'Self-hosted LLM futtatása Raspberry Pi 4-en Ollamával',
  de: 'Ein selbst gehostetes LLM auf dem Raspberry Pi 4 mit Ollama betreiben',
};

const EXCERPT: Record<Locale, string> = {
  en: 'How to run a quantized language model on a Raspberry Pi 4 using Ollama — from hardware choices to the real-world limits.',
  hu: 'Hogyan futtass egy kvantált nyelvi modellt egy Raspberry Pi 4-en Ollama segítségével — hardverválasztástól a korlátokig.',
  de: 'Wie man ein quantisiertes Sprachmodell mit Ollama auf einem Raspberry Pi 4 betreibt — von der Hardwarewahl bis zu den realen Grenzen.',
};

// Identical slug across locales — Payload's uniqueness check on a localized
// field is per-locale-column, so this doesn't collide (see Posts.ts).
const SLUG = 'self-hosted-llm-raspberry-pi-ollama';

const CATEGORY_SLUG = 'self-hosting';
const CATEGORY_NAME: Record<Locale, string> = { en: 'Self-Hosting', hu: 'Self-Hosting', de: 'Self-Hosting' };

async function findOrCreateCategory(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({
    collection: 'categories',
    where: { slug: { equals: CATEGORY_SLUG } },
    limit: 1,
  });
  if (existing.docs[0]) {
    console.log(`Category "${CATEGORY_SLUG}" already exists, reusing it.`);
    return existing.docs[0];
  }

  const created = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: { slug: CATEGORY_SLUG, name: CATEGORY_NAME.en },
  });
  for (const locale of LOCALES) {
    if (locale === 'en') continue;
    await payload.update({
      collection: 'categories',
      id: created.id,
      locale,
      data: { name: CATEGORY_NAME[locale] },
    });
  }
  console.log(`Created category "${CATEGORY_SLUG}".`);
  return created;
}

const run = async () => {
  const payload = await getPayload({ config });

  const existingPost = await payload.find({
    collection: 'posts',
    where: { slug: { equals: SLUG } },
    limit: 1,
    draft: true,
  });
  if (existingPost.docs[0]) {
    console.log(`Post "${SLUG}" already exists (id ${existingPost.docs[0].id}), skipping.`);
    process.exit(0);
  }

  const category = await findOrCreateCategory(payload);

  const post = await payload.create({
    collection: 'posts',
    locale: 'en',
    data: {
      title: TITLE.en,
      slug: SLUG,
      excerpt: EXCERPT.en,
      content: buildContent('en'),
      categories: [category.id],
      publishedDate: '2026-08-16',
      _status: 'draft',
    },
  });

  for (const locale of LOCALES) {
    if (locale === 'en') continue;
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale,
      data: {
        title: TITLE[locale],
        slug: SLUG,
        excerpt: EXCERPT[locale],
        content: buildContent(locale),
      },
    });
  }

  console.log(`Created draft post "${SLUG}" (id ${post.id}) in en/hu/de.`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
