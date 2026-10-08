// Columns: English, Spanish, Japanese, French, German, Portuguese, Korean, Italian.
// Shared by the static page generator and the browser editor.
const languages=['en','es','ja','fr','de','pt','ko','it'];
const rows=`
Home|Inicio|ホーム|Accueil|Startseite|Início|홈|Home
Studio|Estudio|スタジオ|Studio|Studio|Estúdio|스튜디오|Studio
About us|Sobre nosotros|私たちについて|À propos|Über uns|Sobre nós|소개|Chi siamo
Contact us|Contacto|お問い合わせ|Contact|Kontakt|Contato|문의|Contatti
Privacy policy|Política de privacidad|プライバシーポリシー|Politique de confidentialité|Datenschutzerklärung|Política de privacidade|개인정보 처리방침|Informativa sulla privacy
Terms & conditions|Términos y condiciones|利用規約|Conditions d’utilisation|Nutzungsbedingungen|Termos e condições|이용약관|Termini e condizioni
Light mode|Modo claro|ライトモード|Mode clair|Heller Modus|Modo claro|라이트 모드|Tema chiaro
Dark mode|Modo oscuro|ダークモード|Mode sombre|Dunkler Modus|Modo escuro|다크 모드|Tema scuro
Switch to light mode|Cambiar al modo claro|ライトモードに切り替える|Passer au mode clair|Zum hellen Modus wechseln|Mudar para o modo claro|라이트 모드로 전환|Passa al tema chiaro
Switch to dark mode|Cambiar al modo oscuro|ダークモードに切り替える|Passer au mode sombre|Zum dunklen Modus wechseln|Mudar para o modo escuro|다크 모드로 전환|Passa al tema scuro
Switch color theme|Cambiar tema|テーマを切り替える|Changer de thème|Farbschema wechseln|Mudar tema|테마 전환|Cambia tema
Main navigation|Navegación principal|メインナビゲーション|Navigation principale|Hauptnavigation|Navegação principal|주 메뉴|Navigazione principale
Footer navigation|Navegación del pie|フッターナビゲーション|Navigation de pied de page|Fußnavigation|Navegação do rodapé|하단 메뉴|Navigazione a piè di pagina
Back to studio|Volver al estudio|スタジオに戻る|Retour au studio|Zurück zum Studio|Voltar ao estúdio|스튜디오로 돌아가기|Torna allo studio
Back to home|Volver al inicio|ホームに戻る|Retour à l’accueil|Zur Startseite|Voltar ao início|홈으로 돌아가기|Torna alla home
How it works|Cómo funciona|使い方|Mode d’emploi|So funktioniert es|Como funciona|사용 방법|Come funziona
Single effect|Un solo efecto|単一エフェクト|Un seul effet|Einzelner Effekt|Um só efeito|단일 효과|Effetto singolo
One effect|Un efecto|エフェクトを1つ使う|Un effet|Ein Effekt|Um efeito|효과 하나|Un effetto
Combine effects|Combinar efectos|エフェクトを組み合わせる|Combiner les effets|Effekte kombinieren|Combinar efeitos|여러 효과 조합|Combina effetti
Reset session|Reiniciar sesión|セッションをリセット|Réinitialiser la session|Sitzung zurücksetzen|Reiniciar sessão|세션 초기화|Reimposta sessione
Source audio|Audio original|元の音声|Audio source|Ausgangsaudio|Áudio original|원본 오디오|Audio sorgente
Stays on your device|Permanece en tu dispositivo|デバイス内で処理|Reste sur votre appareil|Bleibt auf deinem Gerät|Fica no seu dispositivo|기기 안에서 처리|Rimane sul tuo dispositivo
Drop your audio here|Arrastra tu audio aquí|ここに音声をドロップ|Déposez votre audio ici|Audiodatei hier ablegen|Arraste seu áudio aqui|오디오를 여기에 놓으세요|Trascina qui il tuo audio
or|o|または|ou|oder|ou|또는|oppure
browse files|selecciona un archivo|ファイルを選択|parcourir les fichiers|Dateien auswählen|escolha um arquivo|파일 선택|sfoglia i file
to get started|para empezar|して始める|pour commencer|zum Starten|para começar|후 시작하세요|per iniziare
MP3, WAV, M4A, FLAC, OGG · Up to 50 MB / 10 minutes|MP3, WAV, M4A, FLAC, OGG · Hasta 50 MB / 10 minutos|MP3、WAV、M4A、FLAC、OGG · 最大50 MB / 10分|MP3, WAV, M4A, FLAC, OGG · 50 Mo / 10 minutes maximum|MP3, WAV, M4A, FLAC, OGG · Bis 50 MB / 10 Minuten|MP3, WAV, M4A, FLAC, OGG · Até 50 MB / 10 minutos|MP3, WAV, M4A, FLAC, OGG · 최대 50 MB / 10분|MP3, WAV, M4A, FLAC, OGG · Fino a 50 MB / 10 minuti
Replace|Cambiar archivo|ファイルを変更|Remplacer|Ersetzen|Substituir|파일 교체|Sostituisci
Just exploring?|¿Solo quieres probar?|まずは試してみますか？|Envie d’essayer ?|Erst einmal ausprobieren?|Só quer experimentar?|먼저 체험해 볼까요?|Vuoi solo provare?
Try a sample track|Probar una pista de ejemplo|サンプル音源を試す|Essayer un exemple|Beispiel anhören|Testar uma faixa de exemplo|샘플 음원 체험|Prova una traccia di esempio
Shape your sound|Dale forma a tu sonido|音を自由に調整|Façonnez votre son|Gestalte deinen Sound|Transforme seu som|원하는 소리 만들기|Dai forma al tuo suono
Select to include an effect|Selecciona para añadir un efecto|選択してエフェクトを追加|Sélectionnez un effet à ajouter|Effekt zum Hinzufügen auswählen|Selecione para adicionar um efeito|선택하여 효과 추가|Seleziona un effetto da aggiungere
Your audio canvas|Tu espacio de audio|音声ワークスペース|Votre espace audio|Dein Audiobereich|Seu espaço de áudio|오디오 작업 공간|Il tuo spazio audio
Upload a file or try the sample to listen|Sube un archivo o prueba el ejemplo|音声をアップロードするかサンプルを試してください|Importez un fichier ou essayez l’exemple|Datei laden oder Beispiel ausprobieren|Envie um arquivo ou teste o exemplo|파일을 불러오거나 샘플을 사용하세요|Carica un file o prova l’esempio
Original|Original|オリジナル|Original|Original|Original|원본|Originale
Result|Resultado|処理結果|Résultat|Ergebnis|Resultado|결과|Risultato
A little sound goes a long way.|Un pequeño cambio puede transformar tu sonido.|少しの変化で、音は大きく変わります。|Un petit changement peut transformer un son.|Eine kleine Änderung kann viel bewirken.|Uma pequena mudança transforma o som.|작은 변화로 소리가 달라집니다.|Un piccolo cambiamento trasforma il suono.
Ready when you are|Listo cuando quieras|準備ができたら始めましょう|À vous de jouer|Bereit, wenn du es bist|Pronto quando você quiser|준비되면 시작하세요|Quando vuoi, siamo pronti
Volume|Volumen|音量|Volume|Lautstärke|Volume|볼륨|Volume
Effect settings|Ajustes del efecto|エフェクト設定|Réglages de l’effet|Effekteinstellungen|Configurações do efeito|효과 설정|Impostazioni dell’effetto
YOUR EFFECT CHAIN|TU CADENA DE EFECTOS|エフェクトチェーン|VOTRE CHAÎNE D’EFFETS|DEINE EFFEKTKETTE|SUA CADEIA DE EFEITOS|효과 체인|LA TUA CATENA DI EFFETTI
Output format|Formato de salida|出力形式|Format de sortie|Ausgabeformat|Formato de saída|출력 형식|Formato di uscita
16-bit WAV · Decoded sample rate|WAV de 16 bits · Frecuencia de muestreo decodificada|16ビットWAV · デコード時のサンプルレート|WAV 16 bits · Fréquence d’échantillonnage décodée|16-Bit-WAV · Dekodierte Abtastrate|WAV de 16 bits · Taxa de amostragem decodificada|16비트 WAV · 디코딩된 샘플 레이트|WAV a 16 bit · Frequenza di campionamento decodificata
Apply effects|Aplicar efectos|エフェクトを適用|Appliquer les effets|Effekte anwenden|Aplicar efeitos|효과 적용|Applica effetti
Preparing audio|Preparando audio|音声を準備中|Préparation de l’audio|Audio wird vorbereitet|Preparando áudio|오디오 준비 중|Preparazione audio
Upload audio to get started.|Sube un audio para empezar.|音声を読み込んで始めましょう。|Importez un audio pour commencer.|Lade Audio hoch, um zu beginnen.|Envie um áudio para começar.|오디오를 불러와 시작하세요.|Carica un audio per iniziare.
↓ Download WAV|↓ Descargar WAV|↓ WAVをダウンロード|↓ Télécharger le WAV|↓ WAV herunterladen|↓ Baixar WAV|↓ WAV 다운로드|↓ Scarica WAV
Revise and apply as often as you like. Your original stays intact.|Ajusta y aplica tantas veces como quieras. El original permanece intacto.|何度でも調整して適用できます。元の音声はそのまま保持されます。|Modifiez et appliquez autant de fois que souhaité. L’original reste intact.|Passe Einstellungen beliebig oft an. Dein Original bleibt erhalten.|Ajuste e aplique quantas vezes quiser. O original permanece intacto.|원하는 만큼 수정하고 적용하세요. 원본은 그대로 유지됩니다.|Modifica e applica quante volte vuoi. L’originale rimane intatto.
WELCOME TO SONIC|BIENVENIDO A SONIC|SONICへようこそ|BIENVENUE SUR SONIC|WILLKOMMEN BEI SONIC|BEM-VINDO AO SONIC|SONIC에 오신 것을 환영합니다|BENVENUTO SU SONIC
Your sound, in three steps.|Tu sonido, en tres pasos.|3つのステップで音を編集。|Votre son, en trois étapes.|Dein Sound in drei Schritten.|Seu som em três passos.|세 단계로 완성하는 사운드.|Il tuo suono, in tre passi.
Bring your audio.|Sube tu audio.|音声を読み込む。|Importez votre audio.|Lade dein Audio.|Envie seu áudio.|오디오를 불러오세요.|Carica il tuo audio.
Upload a supported file, or listen to the built-in sample.|Sube un archivo compatible o escucha el ejemplo incluido.|対応ファイルを読み込むか、サンプル音源を試してください。|Importez un fichier compatible ou écoutez l’exemple inclus.|Lade eine unterstützte Datei oder höre das Beispiel an.|Envie um arquivo compatível ou ouça o exemplo incluído.|지원 파일을 불러오거나 내장 샘플을 들어보세요.|Carica un file compatibile o ascolta l’esempio incluso.
Explore your effects.|Explora los efectos.|エフェクトを選ぶ。|Explorez les effets.|Entdecke die Effekte.|Explore os efeitos.|효과를 살펴보세요.|Esplora gli effetti.
Selecting an effect includes it automatically. Adjust its settings or remove it from the chain.|Al seleccionar un efecto se añade automáticamente. Ajusta sus valores o elimínalo de la cadena.|選んだエフェクトは自動で追加されます。設定を調整したりチェーンから削除したりできます。|Un effet sélectionné est ajouté automatiquement. Réglez-le ou retirez-le de la chaîne.|Ein ausgewählter Effekt wird automatisch hinzugefügt. Passe ihn an oder entferne ihn aus der Kette.|O efeito selecionado é adicionado automaticamente. Ajuste-o ou remova-o da cadeia.|효과를 선택하면 자동으로 추가됩니다. 설정을 조절하거나 체인에서 제거하세요.|L’effetto selezionato viene aggiunto automaticamente. Regolalo o rimuovilo dalla catena.
Listen and experiment.|Escucha y experimenta.|聴いて調整する。|Écoutez et expérimentez.|Anhören und ausprobieren.|Ouça e experimente.|듣고 실험해 보세요.|Ascolta e sperimenta.
Click Apply effects, compare Original and Result, adjust and apply again, then download your WAV. Tempo preserves pitch; pitch shift preserves duration.|Pulsa Aplicar efectos, compara Original y Resultado, ajusta de nuevo y descarga el WAV. El tempo conserva el tono; el cambio de tono conserva la duración.|エフェクトを適用し、オリジナルと処理結果を比較してください。再調整してからWAVを保存できます。テンポ調整は音程を、ピッチ変更は長さを保ちます。|Appliquez les effets, comparez Original et Résultat, ajustez puis téléchargez le WAV. Le tempo conserve la hauteur ; la transposition conserve la durée.|Wende Effekte an, vergleiche Original und Ergebnis und lade dein WAV herunter. Tempo erhält die Tonhöhe; Tonhöhenänderung erhält die Dauer.|Aplique os efeitos, compare Original e Resultado, ajuste e baixe o WAV. O tempo preserva a altura; a mudança de tom preserva a duração.|효과 적용 후 원본과 결과를 비교하고 다시 조정한 뒤 WAV를 다운로드하세요. 템포는 음높이를, 피치 변경은 길이를 유지합니다.|Applica gli effetti, confronta Originale e Risultato, regola e scarica il WAV. Il tempo mantiene l’intonazione; la trasposizione mantiene la durata.
Got it|Entendido|わかりました|Compris|Verstanden|Entendi|확인|Capito
Your effects will appear here|Tus efectos aparecerán aquí|追加したエフェクトを表示|Vos effets apparaîtront ici|Hier erscheinen deine Effekte|Seus efeitos aparecerão aqui|추가한 효과가 여기에 표시됩니다|I tuoi effetti appariranno qui
Enable effect|Activar efecto|エフェクトを有効にする|Activer l’effet|Effekt aktivieren|Ativar efeito|효과 활성화|Attiva effetto
Remove this effect|Eliminar este efecto|このエフェクトを削除|Retirer cet effet|Diesen Effekt entfernen|Remover este efeito|이 효과 제거|Rimuovi questo effetto
+ Include this effect|+ Añadir este efecto|+ このエフェクトを追加|+ Ajouter cet effet|+ Diesen Effekt hinzufügen|+ Adicionar este efeito|+ 이 효과 추가|+ Aggiungi questo effetto
✓ Included|✓ Añadido|✓ 追加済み|✓ Ajouté|✓ Hinzugefügt|✓ Adicionado|✓ 추가됨|✓ Aggiunto
Preset|Preajuste|プリセット|Préréglage|Voreinstellung|Predefinição|프리셋|Preimpostazione
Custom settings|Ajustes personalizados|カスタム設定|Réglages personnalisés|Eigene Einstellungen|Configurações personalizadas|사용자 설정|Impostazioni personalizzate
Vocal|Voz|ボーカル|Voix|Gesang|Voz|보컬|Voce
Bathroom|Baño|バスルーム|Salle de bains|Badezimmer|Banheiro|욕실|Bagno
Small room|Sala pequeña|小さな部屋|Petite pièce|Kleiner Raum|Sala pequena|작은 방|Stanza piccola
Medium room|Sala mediana|中くらいの部屋|Pièce moyenne|Mittlerer Raum|Sala média|중간 크기 방|Stanza media
Large room|Sala grande|大きな部屋|Grande pièce|Großer Raum|Sala grande|큰 방|Stanza grande
Church hall|Iglesia|教会|Église|Kirchensaal|Igreja|교회 홀|Chiesa
Cathedral|Catedral|大聖堂|Cathédrale|Kathedrale|Catedral|대성당|Cattedrale
Very light|Muy suave|とても弱い|Très léger|Sehr leicht|Muito leve|매우 약함|Molto leggero
Light|Suave|弱い|Léger|Leicht|Leve|약함|Leggero
Moderate|Moderado|中程度|Modéré|Mittel|Moderado|보통|Moderato
Heavy|Fuerte|強い|Fort|Stark|Forte|강함|Forte
Extreme|Extremo|最大|Extrême|Extrem|Extremo|매우 강함|Estremo
Processing…|Procesando…|処理中…|Traitement…|Verarbeitung…|Processando…|처리 중…|Elaborazione…
Applying effects…|Aplicando efectos…|エフェクトを適用中…|Application des effets…|Effekte werden angewendet…|Aplicando efeitos…|효과 적용 중…|Applicazione effetti…
Balancing output|Ajustando la salida|出力を調整中|Équilibrage de la sortie|Ausgabe wird angepasst|Ajustando a saída|출력 조정 중|Bilanciamento uscita
Creating WAV|Creando WAV|WAVを作成中|Création du WAV|WAV wird erstellt|Criando WAV|WAV 생성 중|Creazione WAV
Processing audio|Procesando audio|音声を処理中|Traitement de l’audio|Audio wird verarbeitet|Processando áudio|오디오 처리 중|Elaborazione audio
Your audio is ready|Tu audio está listo|音声の準備ができました|Votre audio est prêt|Dein Audio ist bereit|Seu áudio está pronto|오디오가 준비되었습니다|Il tuo audio è pronto
Original audio|Audio original|元の音声|Audio original|Originalaudio|Áudio original|원본 오디오|Audio originale
Original audio · Local playback|Audio original · Reproducción local|元の音声 · ローカル再生|Audio original · Lecture locale|Originalaudio · Lokale Wiedergabe|Áudio original · Reprodução local|원본 오디오 · 로컬 재생|Audio originale · Riproduzione locale
Original audio · Unchanged|Audio original · Sin cambios|元の音声 · 未変更|Audio original · Inchangé|Originalaudio · Unverändert|Áudio original · Sem alterações|원본 오디오 · 변경 없음|Audio originale · Invariato
Opening your audio…|Abriendo tu audio…|音声を読み込み中…|Ouverture de votre audio…|Audio wird geöffnet…|Abrindo seu áudio…|오디오 불러오는 중…|Apertura audio…
Audio ready. Press play to listen.|Audio listo. Pulsa reproducir para escuchar.|音声の準備ができました。再生して確認してください。|Audio prêt. Lancez la lecture pour écouter.|Audio bereit. Drücke Wiedergabe zum Anhören.|Áudio pronto. Pressione reproduzir para ouvir.|오디오가 준비되었습니다. 재생 버튼을 누르세요.|Audio pronto. Premi riproduci per ascoltare.
Please choose an audio file smaller than 50 MB.|Elige un archivo de audio de menos de 50 MB.|50 MB未満の音声ファイルを選んでください。|Choisissez un fichier audio de moins de 50 Mo.|Wähle eine Audiodatei unter 50 MB.|Escolha um arquivo de áudio com menos de 50 MB.|50 MB 미만의 오디오 파일을 선택하세요.|Scegli un file audio inferiore a 50 MB.
Please use a clip under 10 minutes.|Usa un audio de menos de 10 minutos.|10分未満の音声を使用してください。|Utilisez un extrait de moins de 10 minutes.|Verwende einen Clip unter 10 Minuten.|Use um áudio com menos de 10 minutos.|10분 미만의 오디오를 사용하세요.|Usa un audio di meno di 10 minuti.
This file could not be decoded. Try a WAV or MP3 audio file.|No se pudo leer el archivo. Prueba con WAV o MP3.|このファイルをデコードできませんでした。WAVまたはMP3をお試しください。|Ce fichier n’a pas pu être décodé. Essayez un WAV ou MP3.|Die Datei konnte nicht dekodiert werden. Versuche WAV oder MP3.|Não foi possível decodificar o arquivo. Tente WAV ou MP3.|파일을 읽을 수 없습니다. WAV 또는 MP3를 사용해 보세요.|Impossibile decodificare il file. Prova un WAV o MP3.
Playback could not start. Please try another audio file.|No se pudo reproducir. Prueba otro archivo.|再生を開始できませんでした。別の音声をお試しください。|La lecture n’a pas démarré. Essayez un autre fichier.|Wiedergabe nicht möglich. Versuche eine andere Datei.|A reprodução não iniciou. Tente outro arquivo.|재생할 수 없습니다. 다른 파일을 사용하세요.|Riproduzione non avviata. Prova un altro file.
Audio playback is unavailable for this file.|Este archivo no se puede reproducir.|このファイルは再生できません。|Ce fichier ne peut pas être lu.|Diese Datei kann nicht wiedergegeben werden.|Este arquivo não pode ser reproduzido.|이 파일은 재생할 수 없습니다.|Questo file non può essere riprodotto.
Session reset.|Sesión reiniciada.|セッションをリセットしました。|Session réinitialisée.|Sitzung zurückgesetzt.|Sessão reiniciada.|세션이 초기화되었습니다.|Sessione reimpostata.
Play audio|Reproducir audio|音声を再生|Lire l’audio|Audio abspielen|Reproduzir áudio|오디오 재생|Riproduci audio
Pause audio|Pausar audio|音声を一時停止|Mettre l’audio en pause|Audio pausieren|Pausar áudio|오디오 일시 정지|Metti in pausa
Restart audio|Reiniciar audio|音声を最初から再生|Recommencer la lecture|Audio neu starten|Reiniciar áudio|처음부터 재생|Riavvia audio
Seek audio|Cambiar posición|再生位置を変更|Position de lecture|Wiedergabeposition|Posição de reprodução|재생 위치|Posizione audio
Playback volume|Volumen de reproducción|再生音量|Volume de lecture|Wiedergabelautstärke|Volume de reprodução|재생 볼륨|Volume di riproduzione
Audio waveform — click to seek|Forma de onda: haz clic para saltar|波形をクリックして移動|Forme d’onde : cliquez pour avancer|Audiowellenform – Klicken zum Springen|Forma de onda: clique para avançar|파형을 클릭하여 이동|Forma d’onda: clicca per spostarti
Click anywhere on the waveform to jump there|Haz clic en la forma de onda para ir a ese punto|波形をクリックすると、その位置へ移動します|Cliquez sur la forme d’onde pour rejoindre cet instant|Klicke auf die Wellenform, um dorthin zu springen|Clique na forma de onda para ir até esse ponto|파형의 원하는 지점을 클릭하세요|Clicca sulla forma d’onda per raggiungere quel punto
Close help|Cerrar ayuda|ヘルプを閉じる|Fermer l’aide|Hilfe schließen|Fechar ajuda|도움말 닫기|Chiudi guida
Effect processing|Procesamiento de efectos|エフェクト処理|Traitement des effets|Effektverarbeitung|Processamento de efeitos|효과 처리|Elaborazione effetti
Edit included effects|Editar efectos añadidos|追加済みエフェクトを編集|Modifier les effets ajoutés|Hinzugefügte Effekte bearbeiten|Editar efeitos adicionados|추가한 효과 편집|Modifica effetti aggiunti
Select at least one enabled effect first.|Selecciona al menos un efecto activo.|有効なエフェクトを1つ以上選択してください。|Sélectionnez au moins un effet actif.|Wähle zuerst mindestens einen aktiven Effekt.|Selecione pelo menos um efeito ativo.|활성화된 효과를 하나 이상 선택하세요.|Seleziona almeno un effetto attivo.
Your result is already up to date.|Tu resultado ya está actualizado.|処理結果は最新です。|Votre résultat est déjà à jour.|Dein Ergebnis ist bereits aktuell.|Seu resultado já está atualizado.|결과가 이미 최신 상태입니다.|Il risultato è già aggiornato.
Processing failed. Try a shorter audio clip.|No se pudo procesar. Prueba un audio más corto.|処理に失敗しました。短い音声をお試しください。|Échec du traitement. Essayez un extrait plus court.|Verarbeitung fehlgeschlagen. Versuche einen kürzeren Clip.|Falha no processamento. Tente um áudio mais curto.|처리에 실패했습니다. 더 짧은 오디오를 사용하세요.|Elaborazione fallita. Prova un audio più breve.
Settings changed? Apply again to update your result. Download keeps the last applied version.|¿Cambiaste los ajustes? Aplica de nuevo. La descarga conserva la última versión aplicada.|設定を変更したら再適用してください。ダウンロードは最後に適用した結果を保存します。|Réglages modifiés ? Appliquez à nouveau. Le téléchargement garde la dernière version appliquée.|Einstellungen geändert? Erneut anwenden. Der Download enthält die zuletzt angewendete Version.|Mudou os ajustes? Aplique novamente. O download mantém a última versão aplicada.|설정을 바꿨나요? 다시 적용하세요. 다운로드는 마지막 적용 결과를 저장합니다.|Impostazioni cambiate? Applica di nuovo. Il download conserva l’ultima versione applicata.
Apply to process new or changed effects. Completed effects are reused. Download keeps your last applied result.|Aplica para procesar efectos nuevos o modificados. Se reutilizan los ya completados. La descarga conserva el último resultado.|適用すると追加・変更したエフェクトを処理します。完了済みの処理は再利用され、最後の結果をダウンロードできます。|Appliquez pour traiter les effets nouveaux ou modifiés. Les étapes terminées sont réutilisées. Le téléchargement garde le dernier résultat.|Neue oder geänderte Effekte anwenden. Fertige Schritte werden wiederverwendet. Der Download behält das letzte Ergebnis.|Aplique para processar efeitos novos ou alterados. Etapas prontas são reutilizadas. O download mantém o último resultado.|새 효과나 변경한 효과를 적용하세요. 완료된 처리는 재사용합니다. 마지막 결과를 다운로드합니다.|Applica per elaborare effetti nuovi o modificati. I passaggi completati vengono riutilizzati. Il download conserva l’ultimo risultato.
Select an effect first. Download keeps your last applied result.|Selecciona un efecto. La descarga conserva el último resultado.|エフェクトを選択してください。最後に適用した結果はダウンロードできます。|Sélectionnez un effet. Le téléchargement garde le dernier résultat.|Wähle einen Effekt. Der Download behält das letzte Ergebnis.|Selecione um efeito. O download mantém o último resultado.|효과를 선택하세요. 마지막 결과는 다운로드할 수 있습니다.|Seleziona un effetto. Il download conserva l’ultimo risultato.
Choose an effect, adjust it, then apply. Choosing another effect replaces your selection. Revisions start from your original.|Elige un efecto, ajústalo y aplícalo. Otro efecto sustituye al seleccionado. Cada revisión parte del original.|エフェクトを選び、調整して適用します。別のエフェクトを選ぶと切り替わります。編集は元の音声から行われます。|Choisissez un effet, réglez-le puis appliquez. Un autre effet remplace la sélection. Les révisions repartent de l’original.|Wähle einen Effekt, passe ihn an und wende ihn an. Ein anderer Effekt ersetzt die Auswahl. Revisionen beginnen beim Original.|Escolha um efeito, ajuste e aplique. Outro efeito substitui a seleção. As revisões partem do original.|효과를 선택하고 조절한 뒤 적용하세요. 다른 효과를 선택하면 교체됩니다. 수정은 원본에서 시작합니다.|Scegli un effetto, regolalo e applicalo. Un altro effetto sostituisce la selezione. Le revisioni partono dall’originale.
Effects run in the order shown. Apply, then add another effect to build on your result. Completed effects are reused; changing an earlier effect updates it and the effects after it.|Los efectos siguen el orden mostrado. Aplica y añade otro sobre el resultado. Se reutilizan las etapas completadas; cambiar una anterior actualiza las posteriores.|表示順にエフェクトを適用します。処理結果に次のエフェクトを追加でき、完了済みの処理は再利用されます。前の設定を変えると、その後の処理も更新されます。|Les effets suivent l’ordre affiché. Appliquez puis ajoutez un effet au résultat. Les étapes terminées sont réutilisées ; modifier une étape actualise les suivantes.|Effekte laufen in der gezeigten Reihenfolge. Wende sie an und füge dem Ergebnis weitere hinzu. Fertige Schritte werden wiederverwendet; Änderungen aktualisieren nachfolgende Effekte.|Os efeitos seguem a ordem exibida. Aplique e adicione outro ao resultado. Etapas concluídas são reutilizadas; alterar uma anterior atualiza as seguintes.|표시된 순서대로 적용됩니다. 적용한 결과에 다음 효과를 추가하세요. 완료된 처리는 재사용하며 앞 효과를 바꾸면 이후 단계도 갱신합니다.|Gli effetti seguono l’ordine mostrato. Applica e aggiungi un altro effetto al risultato. I passaggi completati sono riutilizzati; una modifica aggiorna quelli successivi.
Name|Nombre|お名前|Nom|Name|Nome|이름|Nome
Your email|Tu correo electrónico|メールアドレス|Votre adresse e-mail|Deine E-Mail-Adresse|Seu e-mail|이메일|La tua e-mail
Topic|Asunto|件名|Sujet|Thema|Assunto|주제|Argomento
Your message|Tu mensaje|メッセージ|Votre message|Deine Nachricht|Sua mensagem|메시지|Il tuo messaggio
General question|Consulta general|一般的な質問|Question générale|Allgemeine Frage|Dúvida geral|일반 문의|Domanda generale
Report an issue|Informar de un problema|不具合の報告|Signaler un problème|Problem melden|Relatar um problema|문제 신고|Segnala un problema
Feature suggestion|Sugerir una función|機能の提案|Suggestion de fonctionnalité|Funktionsvorschlag|Sugestão de recurso|기능 제안|Suggerimento di funzione
Privacy or terms|Privacidad o condiciones|プライバシー・利用規約|Confidentialité ou conditions|Datenschutz oder Bedingungen|Privacidade ou termos|개인정보 또는 약관|Privacy o condizioni
Send message|Enviar mensaje|メッセージを送信|Envoyer le message|Nachricht senden|Enviar mensagem|메시지 보내기|Invia messaggio
Sending…|Enviando…|送信中…|Envoi…|Wird gesendet…|Enviando…|전송 중…|Invio…
Please enter a message.|Escribe un mensaje.|メッセージを入力してください。|Saisissez un message.|Bitte gib eine Nachricht ein.|Digite uma mensagem.|메시지를 입력하세요.|Inserisci un messaggio.
Your message has been submitted. Thank you for getting in touch.|Tu mensaje se ha enviado. Gracias por contactarnos.|メッセージを送信しました。お問い合わせありがとうございます。|Votre message a été envoyé. Merci de nous avoir contactés.|Deine Nachricht wurde gesendet. Danke für deine Kontaktaufnahme.|Sua mensagem foi enviada. Obrigado pelo contato.|메시지를 보냈습니다. 문의해 주셔서 감사합니다.|Messaggio inviato. Grazie per averci contattato.
Your message could not be sent. Please try again.|No se pudo enviar el mensaje. Inténtalo de nuevo.|送信できませんでした。もう一度お試しください。|Le message n’a pas pu être envoyé. Réessayez.|Nachricht konnte nicht gesendet werden. Versuche es erneut.|Não foi possível enviar. Tente novamente.|전송할 수 없습니다. 다시 시도하세요.|Invio non riuscito. Riprova.
Unable to connect. Check your connection and try again.|No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.|接続できません。ネットワークを確認してお試しください。|Connexion impossible. Vérifiez votre réseau et réessayez.|Keine Verbindung. Prüfe dein Netzwerk und versuche es erneut.|Sem conexão. Verifique sua rede e tente novamente.|연결할 수 없습니다. 네트워크를 확인하고 다시 시도하세요.|Connessione non riuscita. Controlla la rete e riprova.
Tell us what’s on your mind…|Cuéntanos qué tienes en mente…|ご意見やご質問をお聞かせください…|Dites-nous ce que vous avez en tête…|Teile uns dein Anliegen mit…|Conte o que você tem em mente…|의견이나 궁금한 점을 알려주세요…|Raccontaci cosa hai in mente…
Your Audio Studio.|Tu estudio de audio.|あなたのオーディオスタジオ。|Votre studio audio.|Dein Audio-Studio.|Seu estúdio de áudio.|나만의 오디오 스튜디오.|Il tuo studio audio.
Your twist.|Tu estilo.|あなたらしいアレンジ。|Votre touche.|Deine Ideen.|Seu estilo.|나만의 변화.|Il tuo stile.
Your sound.|Tu sonido.|あなたの音。|Votre son.|Dein Sound.|Seu som.|나만의 소리.|Il tuo suono.
Start creating|Empieza a crear|編集を始める|Commencer à créer|Jetzt gestalten|Comece a criar|편집 시작|Inizia a creare
Less setup.|Menos preparación.|準備はシンプルに。|Moins de préparation.|Weniger Einrichtung.|Menos preparação.|간단한 준비.|Meno preparativi.
More experimenting.|Más posibilidades.|もっと自由に試そう。|Plus d’expérimentation.|Mehr ausprobieren.|Mais experimentação.|더 자유로운 실험.|Più sperimentazione.
Bring your track|Sube tu pista|音源を読み込む|Importez votre piste|Lade deinen Track|Envie sua faixa|음원 불러오기|Carica la tua traccia
Make your changes|Haz tus ajustes|好みに調整する|Faites vos réglages|Passe den Sound an|Faça seus ajustes|원하는 대로 조절|Fai le tue modifiche
Listen. Refine. Keep it.|Escucha. Ajusta. Guarda.|聴く。調整する。保存する。|Écoutez. Affinez. Enregistrez.|Anhören. Verfeinern. Speichern.|Ouça. Ajuste. Salve.|듣고, 다듬고, 저장하세요.|Ascolta. Affina. Salva.
Upload audio from your device, or explore with a sample.|Sube audio de tu dispositivo o prueba un ejemplo.|デバイスの音声を読み込むか、サンプルをお試しください。|Importez un audio ou essayez un exemple.|Lade Audio vom Gerät oder teste das Beispiel.|Envie um áudio do dispositivo ou teste um exemplo.|기기의 오디오를 불러오거나 샘플로 체험하세요.|Carica un audio dal dispositivo o prova un esempio.
Focus on one effect or combine a few. Every setting is yours to adjust.|Usa un solo efecto o combina varios. Ajusta cada parámetro a tu gusto.|1つのエフェクトに集中することも、複数を組み合わせることもできます。|Utilisez un effet ou combinez-en plusieurs. Ajustez chaque paramètre.|Nutze einen Effekt oder kombiniere mehrere. Jeder Regler ist einstellbar.|Use um efeito ou combine vários. Ajuste cada parâmetro.|효과 하나에 집중하거나 여러 개를 조합하세요. 설정은 자유롭게 조절할 수 있습니다.|Usa un effetto o combinane diversi. Regola ogni parametro.
Compare your result, revise as often as you like, and download a WAV.|Compara, revisa sin límites y descarga un WAV.|比較しながら何度でも調整し、WAVで保存できます。|Comparez, révisez à volonté et téléchargez un WAV.|Vergleiche, überarbeite beliebig oft und lade WAV herunter.|Compare, revise à vontade e baixe um WAV.|비교하고 원하는 만큼 수정한 뒤 WAV로 다운로드하세요.|Confronta, modifica quanto vuoi e scarica un WAV.
17 ways to make it yours|17 maneras de hacerlo tuyo|17種類のエフェクト|17 façons de personnaliser votre son|17 Wege zu deinem Sound|17 formas de deixar com a sua cara|17가지 사운드 변환|17 modi per farlo tuo
How do you want to create?|¿Cómo quieres crear?|どのように編集しますか？|Comment voulez-vous créer ?|Wie möchtest du gestalten?|Como você quer criar?|어떻게 편집할까요?|Come vuoi creare?
Choose your starting point. You can switch modes in the studio.|Elige cómo empezar: un efecto o una combinación.|1つのエフェクトか、複数の組み合わせを選んでください。|Choisissez un effet ou une combinaison pour commencer.|Wähle einen Effekt oder eine Kombination zum Starten.|Escolha um efeito ou uma combinação para começar.|단일 효과 또는 여러 효과 조합을 선택하세요.|Scegli un effetto o una combinazione per iniziare.
LET’S MAKE SOMETHING YOURS|CREA TU PROPIO SONIDO|自分だけの音を作ろう|CRÉEZ VOTRE PROPRE SON|GESTALTE DEINEN SOUND|CRIE SEU PRÓPRIO SOM|나만의 소리 만들기|CREA IL TUO SUONO
01 / FOCUS|01 / ENFOQUE|01 / 単一|01 / PRÉCISION|01 / FOKUS|01 / FOCO|01 / 집중|01 / PRECISIONE
02 / EXPERIMENT|02 / EXPERIMENTA|02 / 組み合わせ|02 / EXPÉRIMENTATION|02 / EXPERIMENT|02 / EXPERIMENTE|02 / 실험|02 / SPERIMENTA
Choose any one of our 17 effects and dial in exactly the sound you want.|Elige uno de los 17 efectos y ajusta tu sonido.|17種類から1つを選んで、音を好みに調整できます。|Choisissez l’un des 17 effets et réglez votre son.|Wähle einen der 17 Effekte und passe deinen Sound an.|Escolha um dos 17 efeitos e ajuste seu som.|17가지 중 하나를 골라 원하는 소리로 조절하세요.|Scegli uno dei 17 effetti e regola il tuo suono.
Open single-effect studio|Elegir un efecto|エフェクトを選択|Choisir un effet|Einzelnen Effekt wählen|Escolher um efeito|단일 효과 선택|Scegli un effetto
Layer multiple effects on the same track, with separate settings for each.|Combina efectos en una pista, con ajustes independientes.|同じ音声に複数のエフェクトを重ね、個別に調整できます。|Superposez des effets sur une piste avec des réglages indépendants.|Kombiniere Effekte auf einem Track mit getrennten Einstellungen.|Combine efeitos na mesma faixa com ajustes independentes.|같은 음원에 여러 효과를 적용하고 개별 설정을 조절하세요.|Combina effetti sulla stessa traccia con impostazioni indipendenti.
Open combination studio|Abrir estudio de combinaciones|組み合わせスタジオを開く|Ouvrir le studio de combinaison|Kombinationsstudio öffnen|Abrir estúdio de combinações|효과 조합 스튜디오 열기|Apri studio combinazioni
What will you change?|¿Qué quieres cambiar?|どんな音に変えますか？|Que voulez-vous modifier ?|Was möchtest du verändern?|O que você quer mudar?|어떤 소리로 바꿀까요?|Cosa vuoi cambiare?
ONE EFFECT. ALL YOUR ATTENTION.|UN EFECTO. TODA TU ATENCIÓN.|1つのエフェクトをじっくり。|UN EFFET. TOUTE VOTRE ATTENTION.|EIN EFFEKT. DEIN GANZER FOKUS.|UM EFEITO. TODA SUA ATENÇÃO.|효과 하나에 집중하세요.|UN EFFETTO. TUTTA LA TUA ATTENZIONE.
Choose an effect to open its own studio. Explore what it does, adjust its parameters, and make it yours.|Elige un efecto para abrir su estudio. Descubre cómo funciona y ajusta sus parámetros.|エフェクトを選んで専用ページを開き、説明を読みながら設定できます。|Choisissez un effet pour ouvrir son studio, comprendre son fonctionnement et régler ses paramètres.|Wähle einen Effekt, öffne sein Studio und passe die Parameter an.|Escolha um efeito para abrir seu estúdio, entender como funciona e ajustar os parâmetros.|효과를 선택하면 전용 스튜디오에서 설명을 읽고 설정을 조절할 수 있습니다.|Scegli un effetto per aprire il suo studio, capirne il funzionamento e regolare i parametri.
Want to layer your sound?|¿Quieres combinar efectos?|エフェクトを重ねてみますか？|Envie de superposer des effets ?|Möchtest du Effekte kombinieren?|Quer combinar efeitos?|여러 효과를 조합할까요?|Vuoi combinare gli effetti?
Combine multiple effects with independent settings.|Combina varios efectos con ajustes independientes.|複数のエフェクトを個別に調整して組み合わせます。|Combinez plusieurs effets avec des réglages indépendants.|Kombiniere mehrere Effekte mit eigenen Einstellungen.|Combine vários efeitos com configurações independentes.|여러 효과를 독립적으로 조절하고 조합하세요.|Combina più effetti con impostazioni indipendenti.
Make it sound like you.|Dale tu propio sonido.|あなたらしい音に。|Donnez-lui votre signature.|Mach den Sound zu deinem.|Deixe o som com a sua cara.|나만의 소리로 만드세요.|Dagli il tuo suono.
Clean it up, slow it down, or give it a whole new atmosphere.|Ajusta, ralentiza o crea un ambiente nuevo.|音を調整したり、ゆっくりにしたり、新たな空気感を加えたり。|Ajustez-le, ralentissez-le ou créez une nouvelle ambiance.|Passe ihn an, verlangsame ihn oder schaffe eine neue Atmosphäre.|Ajuste, desacelere ou crie uma nova atmosfera.|소리를 다듬고 속도를 낮추거나 새로운 분위기를 더하세요.|Regolalo, rallentalo o crea una nuova atmosfera.
A little sound. A little more you.|Un poco de sonido. Un poco más de ti.|音に、あなたらしさを。|Un peu de son. Un peu plus de vous.|Ein bisschen Sound. Ein bisschen mehr du.|Um pouco de som. Um pouco mais de você.|소리에 나다움을 더하세요.|Un po’ di suono. Un po’ più di te.
ON THIS PAGE|EN ESTA PÁGINA|このページの内容|SUR CETTE PAGE|AUF DIESER SEITE|NESTA PÁGINA|이 페이지의 내용|IN QUESTA PAGINA
Pause card animation|Pausar animación|カードのアニメーションを停止|Suspendre l’animation|Animation pausieren|Pausar animação|카드 애니메이션 정지|Metti in pausa l’animazione
Resume card animation|Reanudar animación|カードのアニメーションを再開|Reprendre l’animation|Animation fortsetzen|Retomar animação|카드 애니메이션 재개|Riprendi l’animazione
Animated music player|Reproductor de música animado|アニメーション音楽プレーヤー|Lecteur de musique animé|Animierter Musikplayer|Player de música animado|움직이는 음악 플레이어|Lettore musicale animato
Available effects|Efectos disponibles|利用できるエフェクト|Effets disponibles|Verfügbare Effekte|Efeitos disponíveis|사용 가능한 효과|Effetti disponibili
Editing mode|Modo de edición|編集モード|Mode d’édition|Bearbeitungsmodus|Modo de edição|편집 모드|Modalità di modifica
Close|Cerrar|閉じる|Fermer|Schließen|Fechar|닫기|Chiudi
`.trim().split('\n').map(row=>row.split('|'));
const dictionaries=Object.fromEntries(languages.map((lang,index)=>[lang,Object.fromEntries(rows.map(row=>{if(row.length!==8)throw Error('Invalid translation: '+row[0]);return[row[0],row[index]]}))]));
module.exports={languages,dictionaries};
