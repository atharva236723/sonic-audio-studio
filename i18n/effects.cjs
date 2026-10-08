const {dictionaries,languages}=require('./ui.cjs');
const names={
spatial:['3D stereo','Estéreo 3D','3Dステレオ','Stéréo 3D','3D-Stereo','Estéreo 3D','3D 스테레오','Stereo 3D'],
pan:['Stereo panner','Panorama estéreo','ステレオパン','Panoramique stéréo','Stereo-Panorama','Panorama estéreo','스테레오 패닝','Panoramica stereo'],
trim:['Trimmer / cutter','Recortar audio','音声カット','Découpage audio','Audio schneiden','Cortar áudio','오디오 자르기','Taglia audio'],
tuning:['432 Hz tuning','Afinación a 432 Hz','432 Hzチューニング','Accordage à 432 Hz','432-Hz-Stimmung','Afinação em 432 Hz','432 Hz 튜닝','Accordatura a 432 Hz'],
eightd:['8D audio','Audio 8D','8Dオーディオ','Audio 8D','8D-Audio','Áudio 8D','8D 오디오','Audio 8D'],
equalizer:['Equalizer','Ecualizador','イコライザー','Égaliseur','Equalizer','Equalizador','이퀄라이저','Equalizzatore'],
reverb:['Reverb','Reverberación','リバーブ','Réverbération','Hall','Reverberação','리버브','Riverbero'],
slowed:['Slowed + reverb','Audio lento + reverberación','スロー＋リバーブ','Ralenti + réverbération','Slowed + Hall','Áudio lento + reverberação','슬로우 + 리버브','Rallentato + riverbero'],
bass:['Bass boost','Refuerzo de graves','低音ブースト','Renforcement des basses','Bassverstärkung','Reforço de graves','베이스 부스트','Potenziamento bassi'],
loudness:['Loudness','Ajustar volumen','音量調整','Volume sonore','Lautheit','Ajustar volume','음량 조절','Volume audio'],
treble:['Treble','Agudos','高音調整','Aigus','Höhen','Agudos','고음 조절','Alti'],
reverse:['Reverse audio','Invertir audio','逆再生','Audio inversé','Audio umkehren','Inverter áudio','오디오 역재생','Audio al contrario'],
radio:['Telephone / radio','Teléfono / radio','電話／ラジオ','Téléphone / radio','Telefon / Radio','Telefone / rádio','전화 / 라디오','Telefono / radio'],
distortion:['Distortion','Distorsión','ディストーション','Distorsion','Verzerrung','Distorção','디스토션','Distorsione'],
sped:['Sped up','Audio acelerado','スピードアップ','Audio accéléré','Sped up','Áudio acelerado','스피드 업','Audio accelerato'],
tempo:['Tempo control','Control de tempo','テンポ調整','Contrôle du tempo','Temporegelung','Controle de tempo','템포 조절','Controllo del tempo'],
pitch:['Pitch shift','Cambio de tono','ピッチ変更','Transposition','Tonhöhe ändern','Mudança de tom','피치 변경','Trasposizione']
};
const details={
spatial:[
'Expand the difference between the left and right channels.',
'Amplía la diferencia entre los canales izquierdo y derecho. El 100% conserva la anchura original; el 0% mezcla ambos en mono. Una grabación mono no adquiere movimiento: prueba Audio 8D para eso.',
'左右のチャンネルの差を広げます。100%では元の広がりを保ち、0%ではモノラルになります。モノラル音源に動きは加わりません。動かしたい場合は8Dをお試しください。',
'Élargit la différence entre les canaux gauche et droit. À 100 %, la largeur d’origine est conservée ; à 0 %, le signal devient mono. Pour déplacer une source mono, essayez l’audio 8D.',
'Vergrößert den Unterschied zwischen linkem und rechtem Kanal. 100 % erhält die ursprüngliche Breite, 0 % mischt zu Mono. Monoaufnahmen erhalten dadurch keine Bewegung; dafür eignet sich 8D-Audio.',
'Amplia a diferença entre os canais esquerdo e direito. 100% preserva a largura original; 0% mistura em mono. Uma gravação mono não ganha movimento: use Áudio 8D para isso.',
'좌우 채널의 차이를 넓힙니다. 100%는 원래 폭을 유지하고 0%는 모노로 합칩니다. 모노 음원에 이동 효과를 만들지는 않습니다. 움직임이 필요하면 8D 오디오를 사용하세요.',
'Amplia la differenza tra canale sinistro e destro. Il 100% mantiene la larghezza originale; lo 0% unisce in mono. Per dare movimento a una sorgente mono, prova Audio 8D.'
],
pan:[
'Set a fixed position in the stereo field.',
'Coloca el sonido en una posición fija del campo estéreo. Los valores negativos lo llevan a la izquierda y los positivos a la derecha; el 0% queda centrado. El resultado se exporta en estéreo.',
'音を左右の固定位置に配置します。負の値は左、正の値は右、0%は中央です。結果はステレオで出力されます。',
'Place le son à une position fixe dans le champ stéréo. Les valeurs négatives vont à gauche, les positives à droite et 0 % au centre. La sortie est stéréo.',
'Platziert den Klang fest im Stereofeld. Negative Werte bewegen ihn nach links, positive nach rechts; 0 % ist mittig. Das Ergebnis wird in Stereo ausgegeben.',
'Posiciona o som em um ponto fixo do campo estéreo. Valores negativos movem para a esquerda, positivos para a direita e 0% centraliza. A saída é estéreo.',
'소리를 스테레오 공간의 고정 위치에 배치합니다. 음수는 왼쪽, 양수는 오른쪽이며 0%는 중앙입니다. 결과는 스테레오로 내보냅니다.',
'Posiziona il suono in un punto fisso del campo stereo. I valori negativi spostano a sinistra, i positivi a destra e lo 0% al centro. L’uscita è stereo.'
],
trim:[
'Choose the start and end as percentages of the audio at this point in the chain.',
'Conserva solo el fragmento comprendido entre Inicio y Final, medidos como porcentajes del audio que recibe este paso. Inicio debe ser menor que Final. De 0% a 100% conserva la pista entera.',
'開始位置と終了位置の間だけを残します。値は、この処理に渡される音声の長さに対する割合です。開始位置は終了位置より前に設定してください。0～100%なら全体を残します。',
'Conserve uniquement la partie entre Début et Fin, exprimés en pourcentage de l’audio reçu à cette étape. Le début doit précéder la fin. De 0 à 100 %, toute la piste est conservée.',
'Behält nur den Abschnitt zwischen Anfang und Ende, gemessen in Prozent des Audios an dieser Stelle der Kette. Der Anfang muss vor dem Ende liegen. 0–100 % erhält die gesamte Aufnahme.',
'Mantém apenas o trecho entre Início e Fim, em porcentagens do áudio recebido nesta etapa. O início deve ser menor que o fim. De 0% a 100% mantém toda a faixa.',
'이 단계에 전달되는 오디오에서 시작과 끝 사이만 남깁니다. 위치는 전체 길이의 백분율입니다. 시작은 끝보다 작아야 합니다. 0~100%는 전체 음원을 유지합니다.',
'Conserva solo la parte tra Inizio e Fine, espressi come percentuali dell’audio ricevuto in questo passaggio. L’inizio deve precedere la fine. Da 0% a 100% conserva l’intera traccia.'
],
tuning:[
'Shift a recording tuned to A=440 Hz down to A=432 Hz, keeping its duration.',
'Baja una grabación afinada con La=440 Hz a La=432 Hz sin cambiar su duración. Es un desplazamiento sutil de aproximadamente −0,318 semitonos. No detecta la afinación original ni ofrece beneficios de salud demostrados.',
'A=440 Hzで調律された録音を、長さを保ちながらA=432 Hzへ下げます。約−0.318半音の小さな変更です。元の調律を検出する機能ではなく、健康効果を示すものでもありません。',
'Abaisse une source accordée à La=440 Hz vers La=432 Hz en conservant sa durée. Le décalage est d’environ −0,318 demi-ton. L’outil ne détecte pas l’accordage initial et ne promet aucun bénéfice de santé.',
'Verschiebt eine auf A=440 Hz gestimmte Aufnahme auf A=432 Hz bei gleicher Dauer. Die Änderung beträgt etwa −0,318 Halbtöne. Die Ausgangsstimmung wird nicht erkannt; Gesundheitsvorteile werden nicht versprochen.',
'Baixa uma gravação afinada em Lá=440 Hz para Lá=432 Hz, mantendo a duração. A mudança é sutil, cerca de −0,318 semitom. Não detecta a afinação original nem promete benefícios à saúde.',
'A=440 Hz로 조율된 녹음을 길이 변화 없이 A=432 Hz로 낮춥니다. 약 −0.318반음의 미세한 변화입니다. 원래 조율을 감지하지 않으며 건강 효과를 의미하지 않습니다.',
'Abbassa una registrazione accordata a La=440 Hz verso La=432 Hz mantenendo la durata. Lo spostamento è di circa −0,318 semitoni. Non rileva l’accordatura iniziale né promette benefici per la salute.'
],
eightd:[
'Sweep the audio smoothly between your left and right ears.',
'Mueve el sonido suavemente entre izquierda y derecha. El tiempo de rotación controla lo rápido que se mueve; Movimiento controla la amplitud del recorrido. Usa auriculares estéreo. Es un efecto de panorama, no sonido envolvente multicanal real.',
'音を左右の耳の間で滑らかに動かします。回転時間で動きの速さ、移動幅で左右への広がりを調整します。ステレオヘッドホンで確認してください。実際の多チャンネルサラウンドではありません。',
'Déplace le son entre la gauche et la droite. Le temps de rotation règle la vitesse, et le mouvement règle l’amplitude du trajet. Écoutez au casque stéréo. Il s’agit d’un panoramique, pas d’un véritable son multicanal.',
'Bewegt den Klang sanft zwischen links und rechts. Die Rotationszeit regelt die Geschwindigkeit, die Bewegung die Breite. Höre mit Stereo-Kopfhörern. Dies ist ein Panoramaeffekt, kein echtes Mehrkanal-Surround.',
'Move o som suavemente entre esquerda e direita. O tempo de rotação define a velocidade; Movimento define a amplitude. Ouça com fones estéreo. É um efeito de panorama, não surround multicanal real.',
'소리를 좌우로 부드럽게 이동시킵니다. 회전 시간은 움직이는 속도를, 이동 폭은 좌우 범위를 조절합니다. 스테레오 헤드폰으로 확인하세요. 실제 다채널 서라운드는 아닙니다.',
'Muove il suono dolcemente tra sinistra e destra. Il tempo di rotazione regola la velocità, il movimento l’ampiezza del percorso. Usa cuffie stereo. È un effetto panoramico, non vero surround multicanale.'
],
equalizer:[
'Fine-tune the lows, mids and highs independently.',
'Ajusta ocho bandas entre 60 Hz y 16 kHz. Los valores negativos reducen esas frecuencias y los positivos las realzan. Todas empiezan en 0 dB. Prueba cambios pequeños y escucha si voces, graves y percusión mantienen el equilibrio.',
'60 Hz～16 kHzの8バンドを個別に調整します。負の値で抑え、正の値で強調します。初期設定はすべて0 dBです。少しずつ変え、声・低音・打楽器のバランスを確認しましょう。',
'Règle huit bandes de 60 Hz à 16 kHz. Les valeurs négatives atténuent les fréquences, les positives les renforcent. Chaque bande démarre à 0 dB. Faites de petits changements et écoutez l’équilibre des voix, basses et percussions.',
'Regelt acht Bänder von 60 Hz bis 16 kHz. Negative Werte senken Frequenzen ab, positive heben sie an. Alle Bänder starten bei 0 dB. Verändere sie schrittweise und prüfe das Gleichgewicht von Stimme, Bass und Schlagzeug.',
'Ajusta oito bandas de 60 Hz a 16 kHz. Valores negativos reduzem as frequências e positivos reforçam. Todas começam em 0 dB. Faça pequenas mudanças e confira o equilíbrio entre voz, graves e percussão.',
'60 Hz~16 kHz의 8개 대역을 조절합니다. 음수는 해당 주파수를 줄이고 양수는 강조합니다. 초기값은 모두 0 dB입니다. 조금씩 바꾸며 보컬, 저음, 타악기의 균형을 확인하세요.',
'Regola otto bande da 60 Hz a 16 kHz. I valori negativi attenuano le frequenze, i positivi le aumentano. Tutte partono da 0 dB. Fai piccoli cambiamenti e controlla l’equilibrio di voce, bassi e percussioni.'
],
reverb:[
'Add clear early reflections and a dense, spacious decay.',
'Añade reflexiones y una cola que decae como en una sala. Tamaño de sala controla una respuesta de aproximadamente 0,4–5,9 segundos; Mezcla combina señal seca y reverberada. El valor inicial es 95% / 51%. La descarga incluye la cola: demasiada mezcla puede restar claridad.',
'部屋の響きのような反射と余韻を加えます。ルームサイズは約0.4～5.9秒の応答を、リバーブ量は元音と残響のバランスを調整します。初期値は95%／51%です。余韻も保存されますが、強すぎると明瞭さが失われます。',
'Ajoute des réflexions et une décroissance de salle. La taille règle une réponse d’environ 0,4 à 5,9 secondes ; le mélange dose le signal sec et réverbéré. Valeurs initiales : 95 % / 51 %. La fin de réverbération est incluse ; un mélange élevé peut réduire la clarté.',
'Fügt Reflexionen und eine ausklingende Hallfahne hinzu. Die Raumgröße steuert eine Impulsantwort von etwa 0,4–5,9 Sekunden; der Hallanteil mischt Original und Hall. Startwerte: 95 % / 51 %. Die Hallfahne wird exportiert. Zu viel Hall kann die Verständlichkeit mindern.',
'Adiciona reflexões e uma cauda de reverberação. Tamanho da sala controla uma resposta de cerca de 0,4–5,9 segundos; a mistura equilibra som seco e reverberado. Padrão: 95% / 51%. A cauda é exportada. Mistura excessiva pode reduzir a clareza.',
'공간 반사와 서서히 사라지는 잔향을 더합니다. 방 크기는 약 0.4~5.9초의 응답을, 리버브 믹스는 원음과 잔향의 비율을 조절합니다. 기본값은 95% / 51%입니다. 잔향 꼬리도 저장됩니다. 너무 많이 섞으면 명료도가 줄어듭니다.',
'Aggiunge riflessioni e una coda di riverbero. La dimensione regola una risposta di circa 0,4–5,9 secondi; il mix bilancia suono asciutto e riverberato. Valori iniziali: 95% / 51%. La coda viene esportata. Un mix elevato può ridurre la chiarezza.'
],
slowed:[
'Slow the recording and lower its pitch, with spacious reverb.',
'Combina reproducción más lenta y reverberación. Empieza al 80% de velocidad y 35% de mezcla. Al bajar la velocidad también baja el tono y aumenta la duración. Si quieres mantener el tono original, usa Control de tempo.',
'再生速度を下げて音程を低くし、リバーブを加えます。初期値は速度80%、リバーブ量35%です。遅くすると長さも伸びます。音程を保って速度だけ変える場合はテンポ調整を使ってください。',
'Combine lecture ralentie et réverbération. Réglages initiaux : vitesse à 80 %, mélange à 35 %. Ralentir abaisse aussi la hauteur et allonge la durée. Pour conserver la hauteur, utilisez le contrôle du tempo.',
'Kombiniert langsamere Wiedergabe mit Hall. Startwerte: 80 % Geschwindigkeit und 35 % Hallanteil. Langsamere Wiedergabe senkt die Tonhöhe und verlängert die Aufnahme. Zum Erhalten der Tonhöhe nutze die Temporegelung.',
'Combina reprodução lenta com reverberação. Começa em 80% de velocidade e 35% de mistura. Desacelerar também baixa o tom e aumenta a duração. Para preservar o tom original, use Controle de tempo.',
'느린 재생과 리버브를 결합합니다. 기본값은 속도 80%, 믹스 35%입니다. 속도를 낮추면 음높이도 낮아지고 길이는 늘어납니다. 음높이를 유지하려면 템포 조절을 사용하세요.',
'Combina riproduzione rallentata e riverbero. Parte da velocità 80% e mix 35%. Rallentare abbassa anche l’intonazione e aumenta la durata. Per mantenere l’intonazione usa Controllo del tempo.'
],
bass:[
'Add a powerful boost to bass and low-end warmth.',
'Realza los graves con un filtro de estantería. Ganancia controla cuánto aumentan y Frecuencia dónde empieza la transición. El valor inicial de 27 dB a 140 Hz es fuerte. La protección de picos puede reducir el nivel general para evitar recortes.',
'ローシェルフフィルターで低音を強調します。ゲインで強さ、周波数で変化する帯域の境界を調整します。初期値27 dB／140 Hzは強めの設定です。クリッピングを防ぐため全体の音量が下がる場合があります。',
'Renforce les graves avec un filtre en plateau. Le gain règle l’intensité, la fréquence situe la transition. Le réglage initial de 27 dB à 140 Hz est fort. La protection des crêtes peut réduire le niveau général pour éviter l’écrêtage.',
'Verstärkt tiefe Frequenzen mit einem Kuhschwanzfilter. Gain regelt die Stärke, Frequenz den Übergang. 27 dB bei 140 Hz ist eine starke Voreinstellung. Der Spitzenschutz kann den Gesamtpegel senken, um Clipping zu verhindern.',
'Reforça os graves com um filtro de prateleira. Ganho define a intensidade; Frequência define a transição. O padrão de 27 dB em 140 Hz é forte. A proteção de picos pode baixar o nível geral para evitar cortes.',
'로우 셸프 필터로 저음을 강조합니다. 게인은 강도를, 주파수는 변화가 시작되는 대역을 조절합니다. 기본값 27 dB, 140 Hz는 강한 설정입니다. 클리핑 방지를 위해 전체 레벨이 낮아질 수 있습니다.',
'Rinforza i bassi con un filtro a scaffale. Il guadagno regola l’intensità, la frequenza la transizione. Il valore iniziale di 27 dB a 140 Hz è forte. La protezione dei picchi può ridurre il livello generale per evitare clipping.'
],
loudness:[
'Change the loudness of the exported audio.',
'Cambia el nivel del archivo exportado. 0 dB conserva el nivel; los valores negativos lo reducen y los positivos lo aumentan. Un limitador suave controla los picos. En modo combinado se aplica en la posición mostrada, por lo que el orden importa.',
'保存する音声の音量を変えます。0 dBはそのまま、負の値は小さく、正の値は大きくします。ソフトリミッターでピークを抑えます。組み合わせモードでは表示順に適用されるため、順序で結果が変わります。',
'Change le niveau du fichier exporté. 0 dB conserve le niveau ; les valeurs négatives le réduisent, les positives l’augmentent. Un limiteur doux contrôle les crêtes. En combinaison, l’effet suit sa position dans la chaîne : l’ordre compte.',
'Ändert den Pegel der exportierten Datei. 0 dB bleibt unverändert; negative Werte senken, positive erhöhen ihn. Ein weicher Limiter begrenzt Spitzen. Im Kombinationsmodus gilt die angezeigte Reihenfolge, daher ist die Position wichtig.',
'Muda o nível do arquivo exportado. 0 dB mantém o nível; valores negativos reduzem e positivos aumentam. Um limitador suave controla os picos. No modo combinado segue a posição exibida: a ordem importa.',
'내보낼 파일의 레벨을 바꿉니다. 0 dB는 유지, 음수는 감소, 양수는 증가입니다. 소프트 리미터가 피크를 제어합니다. 조합 모드에서는 표시된 체인 위치에 적용되므로 순서가 중요합니다.',
'Cambia il livello del file esportato. 0 dB lo mantiene, i valori negativi lo riducono e i positivi lo aumentano. Un limitatore morbido controlla i picchi. Nelle combinazioni segue la posizione nella catena: l’ordine conta.'
],
treble:[
'Cut or boost the high frequencies, from a mellow sound to bright treble.',
'Reduce o realza las frecuencias altas. Por defecto corta −18 dB a 1 kHz para un sonido más suave. Usa ganancia positiva para dar brillo. Frecuencia determina dónde comienza la transición; compara las voces y los platillos antes de exportar.',
'高い周波数を抑えたり強調したりします。初期値は1 kHzから−18 dBのカットで、柔らかい音になります。明るくするにはゲインを正にしてください。周波数で境界を変え、声やシンバルを確認しましょう。',
'Atténue ou renforce les hautes fréquences. Par défaut, −18 dB à 1 kHz adoucit le son. Utilisez un gain positif pour plus de brillance. La fréquence règle la transition ; comparez voix et cymbales avant l’export.',
'Senkt oder verstärkt hohe Frequenzen. Die Voreinstellung −18 dB bei 1 kHz macht den Klang weicher. Positive Verstärkung sorgt für mehr Brillanz. Die Frequenz bestimmt den Übergang. Prüfe Stimmen und Becken vor dem Export.',
'Reduz ou reforça as frequências altas. O padrão de −18 dB em 1 kHz suaviza o som. Use ganho positivo para dar brilho. Frequência define a transição. Compare vozes e pratos antes de exportar.',
'고주파를 줄이거나 강조합니다. 기본값은 1 kHz에서 −18 dB를 줄여 부드러운 소리를 만듭니다. 밝게 하려면 게인을 양수로 올리세요. 주파수는 경계를 정합니다. 저장 전 보컬과 심벌을 확인하세요.',
'Riduce o aumenta le frequenze alte. Il valore iniziale −18 dB a 1 kHz ammorbidisce il suono. Usa un guadagno positivo per più brillantezza. La frequenza regola la transizione; confronta voci e piatti prima di esportare.'
],
reverse:[
'Play the whole recording backward.',
'Reproduce todos los canales al revés, incluidas voces, notas y transitorios. No necesita parámetros. En este estudio individual, volver a aplicar parte del original, por lo que no alterna automáticamente entre normal e invertido.',
'声・音符・立ち上がりを含む全チャンネルを逆向きに再生します。設定項目はありません。単一エフェクトのページでは毎回元音から処理するので、再適用だけでは通常再生に戻りません。',
'Lit tous les canaux à l’envers, y compris les voix, notes et attaques. Aucun paramètre n’est nécessaire. Dans le studio individuel, chaque application repart de l’original : elle n’alterne pas automatiquement entre lecture normale et inversée.',
'Spielt alle Kanäle rückwärts ab, einschließlich Stimmen, Noten und Anschlägen. Keine Parameter erforderlich. Im Einzelstudio beginnt jede Anwendung beim Original; erneutes Anwenden schaltet nicht automatisch zur normalen Richtung zurück.',
'Reproduz todos os canais ao contrário, incluindo vozes, notas e ataques. Não há parâmetros. No estúdio individual cada aplicação parte do original, portanto reaplicar não alterna automaticamente para a direção normal.',
'음성, 음표, 어택을 포함한 모든 채널을 거꾸로 재생합니다. 별도 설정은 없습니다. 단일 효과 스튜디오는 매번 원본에서 처리하므로 다시 적용해도 정방향으로 자동 전환되지 않습니다.',
'Riproduce tutti i canali al contrario, comprese voci, note e attacchi. Non richiede parametri. Nello studio singolo ogni applicazione parte dall’originale, quindi riapplicare non ripristina automaticamente la direzione normale.'
],
radio:[
'Remove deep bass and high treble for a narrow telephone or radio sound.',
'Filtra los graves profundos y los agudos para un sonido de teléfono o radio. Prueba 400–2800 Hz para teléfono y 150–5000 Hz para una radio más amplia. El corte inferior debe quedar por debajo del superior.',
'低音と高音を削り、電話やラジオ風の狭い帯域にします。電話には400～2800 Hz、広めのラジオ風には150～5000 Hzをお試しください。下限は上限より低く設定してください。',
'Filtre les graves profonds et les aigus pour un son de téléphone ou radio. Essayez 400–2800 Hz pour le téléphone, 150–5000 Hz pour une radio plus large. La coupure basse doit rester sous la coupure haute.',
'Filtert tiefe Bässe und hohe Frequenzen für Telefon- oder Radiosound. Teste 400–2800 Hz für Telefon, 150–5000 Hz für einen breiteren Radioklang. Die untere Grenze muss unter der oberen liegen.',
'Filtra graves profundos e agudos para um som de telefone ou rádio. Tente 400–2800 Hz para telefone e 150–5000 Hz para rádio mais amplo. O corte inferior deve ficar abaixo do superior.',
'깊은 저음과 고음을 걸러 전화나 라디오 느낌을 만듭니다. 전화는 400~2800 Hz, 넓은 라디오 음색은 150~5000 Hz를 시도하세요. 하한은 상한보다 낮아야 합니다.',
'Filtra bassi profondi e alti per un suono di telefono o radio. Prova 400–2800 Hz per il telefono e 150–5000 Hz per una radio più ampia. Il taglio inferiore deve restare sotto quello superiore.'
],
distortion:[
'Drive the waveform into smooth saturation.',
'Añade armónicos y comprime los picos mediante saturación. Intensidad controla la distorsión y Mezcla la proporción de señal procesada. Baja la mezcla para conservar parte del sonido limpio. Escucha a volumen moderado.',
'波形を飽和させて倍音を加え、ピークを圧縮します。ドライブで歪みの強さ、ミックスで処理音の割合を調整します。元の音を残すにはミックスを下げてください。適切な音量で確認しましょう。',
'Ajoute des harmoniques et compresse les crêtes par saturation. L’intensité règle la distorsion, le mélange la part de signal traité. Réduisez le mélange pour garder du son propre. Écoutez à volume modéré.',
'Fügt durch Sättigung Obertöne hinzu und komprimiert Spitzen. Drive regelt die Verzerrung, Mix den Anteil des bearbeiteten Signals. Senke den Mix, um sauberen Klang zu erhalten. Höre bei moderater Lautstärke.',
'Adiciona harmônicos e comprime picos com saturação. Intensidade controla a distorção; Mistura define a parcela processada. Reduza a mistura para manter parte do som limpo. Ouça em volume moderado.',
'포화로 배음을 더하고 피크를 압축합니다. 드라이브는 왜곡 강도를, 믹스는 처리음 비율을 조절합니다. 원음 일부를 유지하려면 믹스를 낮추세요. 적당한 볼륨으로 확인하세요.',
'Aggiunge armoniche e comprime i picchi tramite saturazione. L’intensità regola la distorsione, il mix la quota elaborata. Riduci il mix per mantenere parte del suono pulito. Ascolta a volume moderato.'
],
sped:[
'Speed up the song and raise its pitch together for a sped-up edit.',
'Acelera la reproducción y sube el tono a la vez, como en muchas versiones sped up. Empieza al 125% (1,25×). La pista queda más corta y aguda. Para cambiar solo la velocidad conservando el tono, usa Control de tempo.',
'再生速度と音程を同時に上げ、よくあるsped up版のようにします。初期値は125%（1.25倍）です。音声は短く高い音になります。音程を保って速くする場合はテンポ調整を使ってください。',
'Accélère la lecture et élève la hauteur, comme dans les versions sped up. Le réglage initial est 125 % (1,25×). La piste devient plus courte et plus aiguë. Pour changer seulement la vitesse, utilisez le contrôle du tempo.',
'Erhöht Wiedergabegeschwindigkeit und Tonhöhe zusammen, wie bei Sped-up-Versionen. Startwert: 125 % (1,25×). Der Track wird kürzer und höher. Für eine Geschwindigkeitsänderung ohne Tonhöhenänderung nutze die Temporegelung.',
'Acelera a reprodução e eleva o tom ao mesmo tempo, como nas versões sped up. Começa em 125% (1,25×). A faixa fica mais curta e aguda. Para mudar só a velocidade, use Controle de tempo.',
'흔히 듣는 sped up 버전처럼 재생 속도와 음높이를 함께 올립니다. 기본값은 125%(1.25배)입니다. 음원이 더 짧고 높아집니다. 음높이를 유지하려면 템포 조절을 사용하세요.',
'Accelera la riproduzione e alza l’intonazione insieme, come nelle versioni sped up. Parte da 125% (1,25×). La traccia diventa più corta e acuta. Per cambiare solo la velocità usa Controllo del tempo.'
],
tempo:[
'Time-stretch the recording while preserving its pitch.',
'Cambia la duración intentando conservar el tono mediante estiramiento temporal. 100% mantiene la velocidad; valores menores ralentizan y mayores aceleran. Los ajustes extremos pueden generar artefactos, especialmente en batería y otros ataques rápidos.',
'タイムストレッチで音程を保ちながら長さを変えます。100%は元の速度、低い値は遅く、高い値は速くします。極端な設定では、特にドラムなどの立ち上がりに処理の跡が聞こえる場合があります。',
'Change la durée en préservant autant que possible la hauteur par étirement temporel. 100 % garde la vitesse ; plus bas ralentit, plus haut accélère. Les réglages extrêmes peuvent produire des artefacts, surtout sur la batterie.',
'Ändert die Dauer durch Zeitdehnung bei möglichst erhaltener Tonhöhe. 100 % bleibt unverändert; niedrigere Werte verlangsamen, höhere beschleunigen. Extreme Einstellungen können Artefakte erzeugen, besonders bei Schlagzeug.',
'Muda a duração por estiramento temporal buscando preservar o tom. 100% mantém a velocidade; valores menores desaceleram e maiores aceleram. Ajustes extremos podem gerar artefatos, especialmente em bateria.',
'타임 스트레칭으로 음높이를 최대한 유지하며 길이를 바꿉니다. 100%는 원래 속도이고 낮으면 느려지며 높으면 빨라집니다. 극단적인 설정은 특히 드럼 같은 빠른 어택에 처리 흔적을 만들 수 있습니다.',
'Cambia la durata con time stretching cercando di mantenere l’intonazione. Il 100% mantiene la velocità, valori inferiori rallentano e superiori accelerano. Regolazioni estreme possono produrre artefatti, soprattutto sulla batteria.'
],
pitch:[
'Shift musical pitch while keeping the original duration.',
'Sube o baja el tono sin cambiar la duración. Cada paso representa un semitono y 12 semitonos equivalen a una octava. 0 mantiene el tono original. Los cambios grandes pueden sonar artificiales; los formantes vocales no se conservan.',
'長さを保ちながら音程を上げ下げします。1目盛りは1半音、12半音で1オクターブです。0は元の音程です。大きな変更では質感が変わり、声のフォルマントは保持されません。',
'Monte ou baisse la hauteur sans changer la durée. Chaque pas vaut un demi-ton ; 12 demi-tons font une octave. 0 conserve la hauteur. Les grands écarts peuvent sembler artificiels ; les formants vocaux ne sont pas préservés.',
'Erhöht oder senkt die Tonhöhe bei gleicher Dauer. Jeder Schritt entspricht einem Halbton, zwölf Halbtöne einer Oktave. 0 erhält die Tonhöhe. Große Änderungen können künstlich klingen; Stimmformanten werden nicht erhalten.',
'Sobe ou baixa o tom sem mudar a duração. Cada passo vale um semitom; 12 semitons formam uma oitava. 0 mantém o tom original. Mudanças grandes podem soar artificiais; os formantes vocais não são preservados.',
'길이를 유지하면서 음높이를 올리거나 내립니다. 한 단계는 반음이며 12반음은 한 옥타브입니다. 0은 원래 음높이입니다. 큰 변화는 인위적으로 들릴 수 있으며 보컬 포먼트는 유지하지 않습니다.',
'Alza o abbassa l’intonazione mantenendo la durata. Ogni passo vale un semitono; 12 semitoni fanno un’ottava. 0 mantiene l’intonazione. Grandi cambiamenti possono suonare artificiali; i formanti vocali non sono preservati.'
]};
const controls=`
Width|Anchura|ステレオ幅|Largeur|Breite|Largura|스테레오 폭|Larghezza
Position|Posición|位置|Position|Position|Posição|위치|Posizione
Start|Inicio|開始位置|Début|Anfang|Início|시작|Inizio
End|Final|終了位置|Fin|Ende|Fim|끝|Fine
Rotation time|Tiempo de rotación|回転時間|Temps de rotation|Rotationszeit|Tempo de rotação|회전 시간|Tempo di rotazione
Movement|Movimiento|移動幅|Mouvement|Bewegung|Movimento|이동 폭|Movimento
Room size|Tamaño de sala|ルームサイズ|Taille de la pièce|Raumgröße|Tamanho da sala|방 크기|Dimensione della stanza
Reverb mix|Mezcla de reverberación|リバーブ量|Mélange de réverbération|Hallanteil|Mistura de reverberação|리버브 믹스|Mix di riverbero
Speed|Velocidad|速度|Vitesse|Geschwindigkeit|Velocidade|속도|Velocità
Bass gain|Ganancia de graves|低音ゲイン|Gain des basses|Bassverstärkung|Ganho de graves|저음 게인|Guadagno bassi
Frequency|Frecuencia|周波数|Fréquence|Frequenz|Frequência|주파수|Frequenza
Gain|Ganancia|ゲイン|Gain|Verstärkung|Ganho|게인|Guadagno
Treble gain|Ganancia de agudos|高音ゲイン|Gain des aigus|Höhenverstärkung|Ganho de agudos|고음 게인|Guadagno alti
Low cutoff|Corte inferior|下限周波数|Coupure basse|Untere Grenzfrequenz|Corte inferior|하한 주파수|Taglio inferiore
High cutoff|Corte superior|上限周波数|Coupure haute|Obere Grenzfrequenz|Corte superior|상한 주파수|Taglio superiore
Drive|Intensidad|ドライブ|Intensité|Drive|Intensidade|드라이브|Intensità
Mix|Mezcla|ミックス|Mélange|Mix|Mistura|믹스|Mix
Tempo|Tempo|テンポ|Tempo|Tempo|Tempo|템포|Tempo
Pitch|Tono|ピッチ|Hauteur|Tonhöhe|Tom|피치|Intonazione
Mono|Mono|モノラル|Mono|Mono|Mono|모노|Mono
Extra wide|Muy amplio|とても広い|Très large|Sehr breit|Muito amplo|매우 넓게|Molto ampio
Left|Izquierda|左|Gauche|Links|Esquerda|왼쪽|Sinistra
Right|Derecha|右|Droite|Rechts|Direita|오른쪽|Destra
Beginning|Principio|先頭|Début|Anfang|Começo|처음|Inizio
Fast|Rápido|速い|Rapide|Schnell|Rápido|빠르게|Veloce
Slow|Lento|遅い|Lent|Langsam|Lento|느리게|Lento
Center|Centro|中央|Centre|Mitte|Centro|중앙|Centro
Wide|Amplio|広い|Large|Breit|Amplo|넓게|Ampio
Cut|Reducir|カット|Atténuer|Absenken|Reduzir|줄이기|Riduci
Boost|Realzar|ブースト|Renforcer|Anheben|Reforçar|강조|Aumenta
Large hall|Sala grande|大きなホール|Grande salle|Großer Saal|Salão grande|큰 홀|Grande sala
Dry|Seco|原音のみ|Sec|Trocken|Seco|원음|Asciutto
Wet|Reverberado|残響のみ|Réverbéré|Hall|Reverberado|잔향|Riverberato
Neutral|Neutro|そのまま|Neutre|Neutral|Neutro|기본|Neutro
Deep|Profundo|深い|Profond|Tief|Profundo|깊게|Profondo
Quieter|Más bajo|小さく|Plus faible|Leiser|Mais baixo|작게|Più basso
Louder|Más alto|大きく|Plus fort|Lauter|Mais alto|크게|Più alto
Softer|Más suave|柔らかく|Plus doux|Weicher|Mais suave|부드럽게|Più morbido
Brighter|Más brillante|明るく|Plus brillant|Brillanter|Mais brilhante|밝게|Più brillante
Radio|Radio|ラジオ|Radio|Radio|Rádio|라디오|Radio
Telephone|Teléfono|電話|Téléphone|Telefon|Telefone|전화|Telefono
Narrow|Estrecho|狭い|Étroit|Schmal|Estreito|좁게|Stretto
Clean|Limpio|クリーン|Clair|Sauber|Limpo|깨끗하게|Pulito
Distorted|Distorsionado|歪み|Déformé|Verzerrt|Distorcido|왜곡|Distorto
2× speed|Velocidad 2×|2倍速|Vitesse 2×|2× Geschwindigkeit|Velocidade 2×|2배 속도|Velocità 2×
Half speed|Media velocidad|半分の速度|Demi-vitesse|Halbe Geschwindigkeit|Metade da velocidade|절반 속도|Metà velocità
Double speed|Doble velocidad|2倍の速度|Double vitesse|Doppelte Geschwindigkeit|Dobro da velocidade|두 배 속도|Doppia velocità
Octave down|Una octava abajo|1オクターブ下|Une octave plus bas|Eine Oktave tiefer|Uma oitava abaixo|한 옥타브 아래|Un’ottava sotto
Octave up|Una octava arriba|1オクターブ上|Une octave plus haut|Eine Oktave höher|Uma oitava acima|한 옥타브 위|Un’ottava sopra
`.trim().split('\n').map(r=>r.split('|'));
for(const row of controls)for(let i=0;i<8;i++)dictionaries[languages[i]][row[0]]=row[i];
module.exports={names,details};
