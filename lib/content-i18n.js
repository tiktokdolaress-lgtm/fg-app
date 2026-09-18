/* Conteúdo traduzido (en/es). cx(lang, cat, id) => objeto traduzido ou null (cai no pt). */
export const CONTENT = {
  /* ============ i18n ETAPA 1 — ONBOARDING (categorias: ob, metas, life) ============ */
  ob: {
    lbl1: { en: 'IDENTIFICATION', es: 'IDENTIFICACIÓN' },
    lbl2: { en: 'IDENTIFICATION', es: 'IDENTIFICACIÓN' },
    lbl3: { en: 'COMBAT STATUS', es: 'ESTADO DE COMBATE' },
    lbl4: { en: 'BASELINE', es: 'LÍNEA BASE' },
    lbl5: { en: 'BASELINE', es: 'LÍNEA BASE' },
    lbl6: { en: 'GROUND ZERO', es: 'MARCO CERO' },
    lbl7: { en: 'GOAL BY RANK', es: 'META POR RANGO' },
    lbl8: { en: 'INTELLIGENCE', es: 'INTELIGENCIA' },
    lbl9: { en: 'INTELLIGENCE', es: 'INTELIGENCIA' },
    lbl10: { en: 'THE WHY', es: 'EL PORQUÉ' },
    lbl11: { en: 'THE OATH', es: 'EL JURAMENTO' },
    q1: { en: 'How should we refer to you on the battlefield?', es: '¿Cómo debemos referirnos a ti en el campo de batalla?' },
    h1: { en: 'Your war name. This is how HQ will talk to you.', es: 'Tu nombre de guerra. Así te hablará el QG.' },
    phName: { en: 'Type your name...', es: 'Escribe tu nombre...' },
    q2: { en: 'What is your age?', es: '¿Cuál es tu edad?' },
    h2: { en: 'Used only locally to contextualize your protocol.', es: 'Se usa solo localmente para contextualizar tu protocolo.' },
    phAge: { en: 'E.g.: 24', es: 'Ej.: 24' },
    q3: { en: 'What is your combat status / lifestyle?', es: '¿Cuál es tu estado de combate / estilo de vida?' },
    h3: { en: 'Defines the pillars checked daily. Tap to select and advance.', es: 'Define los pilares exigidos a diario. Toca para seleccionar y avanzar.' },
    q4: { en: 'What was the last date you consumed pornographic content?', es: '¿Cuál fue la última fecha en que consumiste contenido pornográfico?' },
    h4: { en: 'Be honest. The combat map depends on real data.', es: 'Sé honesto. El mapa de combate depende de datos reales.' },
    q5: { en: 'What was the last date you masturbated?', es: '¿Cuál fue la última fecha en que te masturbaste?' },
    h5: { en: 'No shame. This only calibrates your counters.', es: 'Sin vergüenza. Esto solo calibra tus contadores.' },
    q6: { en: 'What was the date of your last ejaculation (start of Retention)?', es: '¿Cuál fue la fecha de tu última eyaculación (inicio de la Retención)?' },
    h6: { en: 'This is ground zero of your main day counter.', es: 'Este es el marco cero de tu contador principal de días.' },
    q7: { en: 'Choose the FLAG of your first achievement:', es: 'Elige la BANDERA de tu primera conquista:' },
    h7: { en: 'Your tier goal. Tap to choose — each rank has its own seal sound.', es: 'Tu meta de nivel. Toca para elegir — cada rango tiene su propio sonido de sello.' },
    daysWord: { en: 'DAYS', es: 'DÍAS' },
    q8: { en: 'What is your BIGGEST relapse trigger?', es: '¿Cuál es tu MAYOR gatillo de recaída?' },
    h8: { en: 'Knowing the enemy is half the victory.', es: 'Conocer al enemigo es la mitad de la victoria.' },
    q9: { en: 'On average, how many times per week did the addiction steal your energy?', es: 'En promedio, ¿cuántas veces por semana el vicio robaba tu energía?' },
    h9: { en: 'Used to estimate the time/energy you will save.', es: 'Se usa para estimar el tiempo/energía que vas a ahorrar.' },
    q10: { en: 'Write in a few words: Why did you DEMAND to free yourself from these filthy addictions TODAY?', es: 'Escribe en pocas palabras: ¿Por qué EXIGISTE librarte de esos vicios inmundos HOY?' },
    h10a: { en: 'This phrase will be engraved in your ', es: 'Esta frase quedará grabada en tu ' },
    h10b: { en: 'Warrior Code', es: 'Código del Guerrero' },
    h10c: { en: ' and displayed daily on the home screen.', es: ' y se mostrará a diario en la pantalla inicial.' },
    phWhy: { en: 'My non-negotiable reason...', es: 'Mi razón innegociable...' },
    oath1: { en: 'I, ', es: 'Yo, ' },
    oath2: { en: ', declare war today against weakness, the illusion of pornography and the waste of my vital energy. I acknowledge my wounds, but I refuse to remain a slave to cheap pleasure. From this second on, I take control of my mind, my body and my destiny.', es: ', declaro hoy la guerra contra la debilidad, la ilusión de la pornografía y el desperdicio de mi energía vital. Reconozco mis heridas, pero me niego a seguir esclavo del placer barato. Desde este segundo, asumo el control de mi mente, de mi cuerpo y de mi destino.' },
    warrior: { en: 'WARRIOR', es: 'GUERRERO' },
    stamped: { en: '⚔ SWORN', es: '⚔ JURAMENTADO' },
    sign: { en: 'SIGN THE OATH AND ENTER HQ', es: 'FIRMAR JURAMENTO Y ENTRAR AL QG' },
    wel1: { en: 'Welcome to HQ, ', es: 'Bienvenido al QG, ' },
    wel2: { en: '. The war has begun.', es: '. La guerra comenzó.' },
    errName: { en: '⚠ Enter your war name.', es: '⚠ Informa tu nombre de guerra.' },
    errAge: { en: '⚠ Invalid age (10–99).', es: '⚠ Edad inválida (10–99).' },
    errStatus: { en: '⚠ Choose your combat status.', es: '⚠ Elige tu estado de combate.' },
    errDate: { en: '⚠ Select the date.', es: '⚠ Selecciona la fecha.' },
    errDateZero: { en: '⚠ Select the ground-zero date.', es: '⚠ Selecciona la fecha del marco cero.' },
    errGoal: { en: '⚠ Choose the flag of your first achievement.', es: '⚠ Elige la bandera de tu primera conquista.' },
    errTrigger: { en: '⚠ Choose your biggest trigger.', es: '⚠ Elige tu mayor gatillo.' },
    errOpt: { en: '⚠ Choose an option.', es: '⚠ Elige una opción.' },
    errWhy: { en: '⚠ Write your why (min. 5 characters).', es: '⚠ Escribe tu porqué (mín. 5 caracteres).' },
    today: { en: 'TODAY', es: 'HOY' },
    todayNow: { en: 'TODAY — STARTING NOW', es: 'HOY — EMPIEZO AHORA' },
    back: { en: 'BACK', es: 'VOLVER' },
    next: { en: 'ADVANCE', es: 'AVANZAR' },
    stepWord: { en: 'STEP', es: 'PASO' },
    sound: { en: 'Sound', es: 'Sonido' },
    langLabel: { en: 'Language', es: 'Idioma' },
    seedProj: { en: 'Operation Armored Body', es: 'Operación Cuerpo Blindado' },
    seedT1: { en: '20 push-ups on waking', es: '20 flexiones al despertar' },
    seedT2: { en: 'Cold shower after training', es: 'Ducha fría post-entrenamiento' },
    seedNote: { en: 'Day 1: discipline begins where the excuse ends.', es: 'Día 1: la disciplina empieza cuando la excusa termina.' },
    trig0: { en: 'Boredom and idle time', es: 'Aburrimiento y tiempo ocioso' },
    trig1: { en: 'Anxiety / Stress', es: 'Ansiedad / Estrés' },
    trig2: { en: 'Social media / Reels', es: 'Redes sociales / Reels' },
    trig3: { en: 'Loneliness / Late-night phone', es: 'Soledad / Madrugada en el celular' },
    trig4: { en: 'Mental fatigue', es: 'Cansancio mental' },
    freq0: { en: 'Every day (1x or more)', es: 'Todos los días (1x o más)' },
    freq1: { en: '3 to 5 times per week', es: '3 a 5 veces por semana' },
    freq2: { en: '1 to 2 times per week', es: '1 a 2 veces por semana' },
    freq3: { en: 'Sporadically', es: 'Esporádicamente' },
  },
  metas: {
    7: { en: { n: 'RECRUIT', sub: 'Protocol Trial by Fire · Free Trial' }, es: { n: 'RECLUTA', sub: 'Prueba de Fuego del Protocolo · Prueba Gratuita' } },
    14: { en: { n: 'FRONTLINE WARRIOR', sub: 'Initial Stabilization' }, es: { n: 'GUERRERO DE PRIMERA LÍNEA', sub: 'Estabilización Inicial' } },
    21: { en: { n: 'CENTURION', sub: 'Detox and Habit Consolidation' }, es: { n: 'CENTURIÓN', sub: 'Desintoxicación y Consolidación del Hábito' } },
    45: { en: { n: 'SPARTAN', sub: 'Deep Dopaminergic Reorganization' }, es: { n: 'ESPARTANO', sub: 'Reorganización Dopaminérgica Profunda' } },
    90: { en: { n: 'LORD OF THE FORGE', sub: 'Complete Neurochemical Reset' }, es: { n: 'SEÑOR DE LA FORJA', sub: 'Reinicio Neuroquímico Completo' } },
  },
  life: {
    single: { en: { label: '🗡️ SINGLE', desc: 'Full triad: no pornography, no masturbation, with Seminal Retention.' }, es: { label: '🗡️ SOLTERO', desc: 'Tríada completa: sin pornografía, sin masturbación, con Retención Seminal.' } },
    committedA: { en: { label: '💍 COMMITTED · CONSCIOUS REAL SEX', desc: '2 pillars: no pornography, no masturbation. Ejaculation with your partner ALLOWED.' }, es: { label: '💍 COMPROMETIDO · SEXO REAL CONSCIENTE', desc: '2 pilares: sin pornografía, sin masturbación. Eyaculación con la pareja PERMITIDA.' } },
    committedB: { en: { label: '💍 COMMITTED · REAL SEX WITH RETENTION', desc: '3 pillars kept even inside the relationship.' }, es: { label: '💍 COMPROMETIDO · SEXO REAL CON RETENCIÓN', desc: '3 pilares mantenidos incluso dentro de la relación.' } },
    /* --- i18n ETAPA 2 — SETTINGSVIEW (expansão da categoria life) --- */
    sub_active: { en: '✅ ACTIVE', es: '✅ ACTIVA' },
    sub_trialing: { en: '🎁 FREE TRIAL IN PROGRESS', es: '🎁 PRUEBA GRATUITA EN CURSO' },
    sub_inactive: { en: '⛔ INACTIVE', es: '⛔ INACTIVA' },
    sub_canceled: { en: '🚫 CANCELED', es: '🚫 CANCELADA' },
    sub_past_due: { en: '⚠️ PAYMENT PENDING', es: '⚠️ PAGO PENDIENTE' },
    sub_local: { en: '💾 LOCAL MODE (no cloud)', es: '💾 MODO LOCAL (sin nube)' },
    err_notifDenied: { en: '⚠ Notification permission denied in the browser.', es: '⚠ Permiso de notificación denegado en el navegador.' },
    err_sessExpired: { en: 'Session expired — sign in again.', es: 'Sesión expirada — entra de nuevo.' },
    ok_notifOn: { en: '🔔 War notifications enabled on this device.', es: '🔔 Notificaciones de guerra activadas en este dispositivo.' },
    err_notifFail: { en: 'Failed to enable notifications.', es: 'Fallo al activar notificaciones.' },
    ok_notifOff: { en: '🔕 Notifications disabled on this device.', es: '🔕 Notificaciones desactivadas en este dispositivo.' },
    err_notifOffFail: { en: '⚠ Failed to disable.', es: '⚠ Fallo al desactivar.' },
    c_delTitle: { en: 'DELETE ACCOUNT AND DATA?', es: '¿ELIMINAR CUENTA Y DATOS?' },
    c_delBody: { en: 'This cancels the active subscription and PERMANENTLY deletes profile, logs, journal, notes and notifications (data protection right). This action is irreversible.', es: 'Esto cancela la suscripción activa y borra PERMANENTEMENTE perfil, registros, diario, notas y notificaciones (derecho LGPD/RGPD). Esta acción es irreversible.' },
    c_delOk: { en: 'YES, DELETE EVERYTHING', es: 'SÍ, ELIMINAR TODO' },
    err_delFail: { en: 'Failed to delete the account.', es: 'Fallo al eliminar la cuenta.' },
    ok_deleted: { en: '🕊 Account and data deleted. See you next time, warrior.', es: '🕊 Cuenta y datos eliminados. Hasta la próxima, guerrero.' },
    err_delConn: { en: '⚠ Connection error while deleting.', es: '⚠ Error de conexión al eliminar.' },
    c_stTitle: { en: 'CHANGE COMBAT STATUS?', es: '¿CAMBIAR ESTADO DE COMBATE?' },
    c_stBody2: { en: ' The pillars checked daily will change. Day history is NEVER erased.', es: ' Los pilares exigidos a diario cambiarán. El historial de días NUNCA se borra.' },
    c_stOk: { en: 'YES, CHANGE', es: 'SÍ, CAMBIAR' },
    ok_stUpdated: { en: '🛡 Status updated.', es: '🛡 Estado actualizado.' },
    err_pinCur: { en: '⚠ Current PIN incorrect.', es: '⚠ PIN actual incorrecto.' },
    err_pin4: { en: '⚠ Use exactly 4 digits.', es: '⚠ Usa exactamente 4 dígitos.' },
    ok_pinUpd: { en: '🛡 PIN updated.', es: '🛡 PIN actualizado.' },
    ok_pinRemoved: { en: '🔓 PIN lock removed.', es: '🔓 Bloqueo por PIN eliminado.' },
    ok_pinOn: { en: '🛡 PIN lock enabled.', es: '🛡 Bloqueo por PIN activado.' },
    ok_bkExp: { en: '💾 Backup exported.', es: '💾 Backup exportado.' },
    ok_bkImp: { en: '⬆ Backup imported successfully.', es: '⬆ Backup importado con éxito.' },
    err_bkInvalid: { en: '⚠ Invalid backup file.', es: '⚠ Archivo de backup inválido.' },
    err_noCloud: { en: '⚠ Supabase not configured: sync unavailable (local mode).', es: '⚠ Supabase no configurado: sincronización no disponible (modo local).' },
    sync_ing: { en: '🔄 Syncing with the cloud...', es: '🔄 Sincronizando con la nube...' },
    ok_syncDone: { en: '✅ Sync with the cloud completed.', es: '✅ Sincronización con la nube completada.' },
    ok_signOut: { en: '🚪 Session ended.', es: '🚪 Sesión cerrada.' },
    ok_subUpd: { en: '🔄 Subscription status updated.', es: '🔄 Estado de suscripción actualizado.' },
    sub_refresh: { en: '(refresh)', es: '(actualizar)' },
    k_lang: { en: 'LANGUAGE & APPEARANCE', es: 'IDIOMA Y APARIENCIA' },
    lang_title: { en: 'Language', es: 'Idioma' },
    lang_desc: { en: 'Main interface (PT / EN / ES)', es: 'Interfaz principal (PT / EN / ES)' },
    lang_toast: { en: '🌐 Language: ', es: '🌐 Idioma: ' },
    theme_title: { en: 'Dark Theme', es: 'Tema Oscuro' },
    theme_desc: { en: 'Onyx Mode (active) / Graphite', es: 'Modo Ónix (activo) / Grafito' },
    sound_title: { en: '🔊 Sound Effects', es: '🔊 Efectos de Sonido' },
    sound_desc: { en: 'Synthesized sounds via Web Audio API', es: 'Sonidos sintetizados vía Web Audio API' },
    k_life: { en: '💍 LIFE STATUS & PILLARS', es: '💍 ESTADO DE VIDA Y PILARES' },
    life_note: { en: 'Defines the pillars checked daily at HQ. Changing opens a confirmation; day history is NEVER erased.', es: 'Define los pilares exigidos a diario en el QG. Cambiar abre confirmación; el historial de días NUNCA se borra.' },
    k_notif: { en: 'WAR NOTIFICATIONS', es: 'NOTIFICACIONES DE GUERRA' },
    notif_intro: { en: 'Receive the nightly check-in reminder (even with the app closed) and the habit time alerts.', es: 'Recibe el recordatorio nocturno de check-in (incluso con la app cerrada) y las alertas de horario de los hábitos.' },
    notif_on: { en: 'ENABLE NOTIFICATIONS', es: 'ACTIVAR NOTIFICACIONES' },
    notif_daily_t: { en: 'Nightly check-in reminder', es: 'Recordatorio nocturno de check-in' },
    notif_daily_d: { en: 'Push at ~7pm (BRT) if you haven\'t logged the day yet', es: 'Push ~19h (BRT) si aún no registraste el día' },
    notif_hab_t: { en: 'Habit times', es: 'Horarios de los hábitos' },
    notif_hab_d: { en: 'Alert at the ⏰ time of each active habit (with the app open)', es: 'Alerta a la hora ⏰ de cada hábito activo (con la app abierta)' },
    notif_off: { en: 'DISABLE ON THIS DEVICE', es: 'DESACTIVAR EN ESTE DISPOSITIVO' },
    k_disc: { en: 'DISCREET MODE (PRIVACY)', es: 'MODO DISCRETO (PRIVACIDAD)' },
    disc_t: { en: 'Neutral look "FG Diário"', es: 'Apariencia neutra "FG Diário"' },
    disc_d: { en: 'Name, icon and title become a generic habit journal', es: 'Nombre, ícono y título se vuelven un diario de hábitos genérico' },
    disc_on_toast: { en: '🕵️ Discreet mode enabled.', es: '🕵️ Modo discreto activado.' },
    disc_off_toast: { en: '🛡️ Discreet mode disabled.', es: '🛡️ Modo discreto desactivado.' },
    disc_note: { en: 'Affects the app title and the PWA manifest. If you already installed the home-screen icon with the old name, remove and reinstall to change the shortcut icon/name.', es: 'Afecta el título de la app y el manifiesto del PWA. Si ya instalaste el ícono en la pantalla de inicio con el nombre antiguo, quítalo y reinstálalo para cambiar ícono/nombre del atajo.' },
    k_partner: { en: 'ACCOUNTABILITY PARTNER', es: 'PARTNER DE RESPONSABILIDAD' },
    partner_have: { en: 'Anyone with this link sees ONLY nickname, days, streak and tier — nothing else.', es: 'Cualquier persona con este link ve SOLAMENTE apodo, días, racha y nivel — nada más.' },
    c_plTitle: { en: 'DISABLE LINK?', es: '¿DESACTIVAR LINK?' },
    c_plBody: { en: 'Your partner will lose access to your accountability card.', es: 'Tu compañero perderá el acceso a tu tarjeta de responsabilidad.' },
    c_plOk: { en: 'YES, DISABLE', es: 'SÍ, DESACTIVAR' },
    partner_off: { en: 'DISABLE LINK', es: 'DESACTIVAR LINK' },
    partner_intro: { en: 'Safe accountability: generate a read-only link for a mentor or trusted friend to follow your war.', es: 'Accountability segura: genera un link de solo lectura para que un mentor o amigo de confianza acompañe tu guerra.' },
    partner_gen: { en: 'GENERATE MY LINK', es: 'GENERAR MI LINK' },
    ok_linkCopied: { en: '🔗 Link copied.', es: '🔗 Link copiado.' },
    ok_linkCreated: { en: '🤝 Accountability link created.', es: '🤝 Link de responsabilidad creado.' },
    k_hall: { en: 'ANONYMOUS HALL OF FAME', es: 'SALÓN DE LA FAMA ANÓNIMO' },
    hall_t: { en: 'Join the ranking', es: 'Participar del ranking' },
    hall_pseudo: { en: 'Nickname: ', es: 'Apodo: ' },
    hall_optin: { en: 'Opt-in: only those who enable it join', es: 'Opt-in: solo entra quien lo activa' },
    k_pin: { en: 'SECURITY — PIN LOCK', es: 'SEGURIDAD — BLOQUEO POR PIN' },
    pin_on: { en: '✓ PIN active. HQ opens only with the code.', es: '✓ PIN activo. El QG abre solo con el código.' },
    ph_pinCur: { en: 'Current PIN', es: 'PIN actual' },
    ph_pinNew1: { en: 'New PIN (empty = remove)', es: 'Nuevo PIN (vacío = eliminar)' },
    ph_pinNew2: { en: 'New PIN (4 digits)', es: 'Nuevo PIN (4 dígitos)' },
    pin_upd: { en: 'UPDATE PIN', es: 'ACTUALIZAR PIN' },
    pin_act: { en: 'ENABLE', es: 'ACTIVAR' },
    pin_intro: { en: 'Set a 4-digit PIN to shield access to HQ.', es: 'Define un PIN de 4 dígitos para blindar el acceso al QG.' },
    k_cloud: { en: 'YOUR ACCOUNT & CLOUD BACKUP', es: 'TU CUENTA Y BACKUP EN LA NUBE' },
    cloud_sync_lbl: { en: 'Sync status: ', es: 'Estado de sincronización: ' },
    cloud_on: { en: 'ACTIVE', es: 'ACTIVA' },
    cloud_off_lbl: { en: 'THIS DEVICE ONLY', es: 'SOLO EN ESTE DISPOSITIVO' },
    cloud_user: { en: 'Connected as: ', es: 'Conectado como: ' },
    cloud_sub: { en: 'Subscription: ', es: 'Suscripción: ' },
    cloud_note1: { en: 'Your progress is saved automatically to your account and follows you on any device.', es: 'Tu progreso se guarda automáticamente en tu cuenta y te acompaña en cualquier dispositivo.' },
    btn_sync: { en: 'SYNC NOW', es: 'SINCRONIZAR AHORA' },
    btn_signout: { en: 'SIGN OUT', es: 'CERRAR SESIÓN' },
    cloud_note2: { en: 'Without signing in, data is stored only on this device. Sign in to protect it.', es: 'Sin entrar en tu cuenta, los datos quedan solo en este dispositivo. Entra con tu cuenta para protegerlos.' },
    k_phrases: { en: ' WARRIOR CODE PHRASES', es: '📜 FRASES DEL CÓDIGO DEL GUERRERO' },
    phrases_intro: { en: 'Your oath phrase (the "why") is fixed. Add extra phrases for the 🔄 Swap Phrase button.', es: 'Tu frase del juramento (el "porqué") es fija. Añade frases extra para el botón 🔄 Cambiar Frase.' },
    ph_phrase: { en: 'New war phrase...', es: 'Nueva frase de guerra...' },
    ok_phraseAdd: { en: '📜 Phrase added to the Code.', es: '📜 Frase añadida al Código.' },
    c_phTitle: { en: 'DELETE PHRASE?', es: '¿ELIMINAR FRASE?' },
    c_phBody2: { en: ' will leave your Warrior Code.', es: ' saldrá de tu Código del Guerrero.' },
    phrases_empty: { en: 'No extra phrases. The 🔄 button uses your Why + classic phrases.', es: 'Sin frases extra. El botón 🔄 usa tu Porqué + frases clásicas.' },
    k_backup: { en: '💾 WAR BACKUP', es: '💾 BACKUP DE GUERRA' },
    btn_export: { en: 'EXPORT (.JSON)', es: 'EXPORTAR (.JSON)' },
    btn_import: { en: 'IMPORT', es: 'IMPORTAR' },
    backup_note: { en: 'Without a cloud account, your data lives only on this device. Export regularly.', es: 'Sin cuenta en la nube, tus datos viven solo en este dispositivo. Exporta regularmente.' },
    k_crisis: { en: '💚 CRISIS SUPPORT — YOU ARE NOT ALONE', es: '💚 APOYO EN CRISIS — NO ESTÁS SOLO' },
    crisis_a: { en: 'Forjando Guerreiros is a self-discipline tool and ', es: 'Forjando Guerreiros es una herramienta de autodisciplina y ' },
    crisis_b: { en: 'does not replace therapy, medical or psychological care', es: 'no sustituye terapia, acompañamiento médico o psicológico' },
    crisis_c: { en: '. If you are in intense suffering or thinking about hurting yourself, seek help now:', es: '. Si estás en sufrimiento intenso o pensando en hacerte daño, busca ayuda ahora:' },
    crisis_cvv: { en: 'CVV · 24h · free', es: 'CVV · 24h · gratis' },
    crisis_chat: { en: 'online chat', es: 'chat online' },
    crisis_samu: { en: 'SAMU · emergency', es: 'SAMU · emergencia' },
    k_danger: { en: '☠ DANGER ZONE', es: '☠ ZONA DE PELIGRO' },
    c_wipeTitle: { en: 'ERASE EVERYTHING?', es: '¿BORRAR TODO?' },
    c_wipeBody: { en: 'Onboarding, streaks, journal, habits, tasks and notes will be destroyed forever.', es: 'Onboarding, rachas, diario, hábitos, tareas y notas serán destruidos para siempre.' },
    c_wipeOk: { en: 'YES, BURN EVERYTHING AND RESTART', es: 'SÍ, QUEMAR TODO Y REEMPEZAR' },
    btn_wipe: { en: 'ERASE EVERYTHING AND RESTART THE WAR', es: 'BORRAR TODO Y REEMPEZAR LA GUERRA' },
    btn_delAcct: { en: 'DELETE MY ACCOUNT & DATA (LGPD)', es: 'ELIMINAR MI CUENTA Y DATOS (LGPD)' },
    danger_note: { en: 'Deletion cancels the active subscription and permanently erases your profile and records from the server.', es: 'La eliminación cancela la suscripción activa y borra permanentemente tu perfil y registros del servidor.' },
  },

  les: {
    1: { en: { t: 'The Enemy Lives Within', x: 'Porn is not pleasure: it is dopaminergic hijacking. You fight the pattern, not the screen. Naming the enemy is the first act of war.' }, es: { t: 'El Enemigo Vive Dentro', x: 'El porno no es placer: es secuestro dopaminérgico. Luchas contra el patrón, no la pantalla. Nombrar al enemigo es el primer acto de guerra.' } },
    2: { en: { t: 'Dopamine is Currency', x: 'Every supernormal stimulus spends the coin that buys real motivation. Retention protects your neurochemical capital.' }, es: { t: 'La Dopamina es Moneda', x: 'Cada estímulo supranormal gasta la moneda que compra motivación real. La retención protege tu capital neuroquímico.' } },
    3: { en: { t: 'The Trance and the Awakening', x: 'Relapse starts in trance: scrolling, late night, solitude. S.O.S breaks the trance before the decision — body first.' }, es: { t: 'El Trance y el Despertar', x: 'La recaída empieza en trance: scroll, madrugada, soledad. El S.O.S rompe el trance antes de la decisión — cuerpo primero.' } },
    4: { en: { t: 'Discomfort is Training', x: 'Cold shower, early rise, hard task first: each voluntary discomfort is a prefrontal rep. Train the small no to say the big no.' }, es: { t: 'La Incomodidad es Entrenamiento', x: 'Ducha fría, madrugar, tarea difícil: cada incomodidad voluntaria es una repetición prefrontal. Entrena el no pequeño para el no grande.' } },
    5: { en: { t: 'Solitude is Not Silence', x: 'Addiction flourishes in isolation. Journal, talk to your partner. Light changes the dark room, not the light.' }, es: { t: 'Soledad No es Silencio', x: 'El vicio florece aislado. Escribe, habla con tu pareja. La luz cambia el cuarto oscuro, no a la luz.' } },
    6: { en: { t: 'Energy Transmutes', x: 'Retained tension is raw material: training, creation, deep work. Without an easy exit, the body learns to build.' }, es: { t: 'La Energía Transmuta', x: 'La tensión retenida es materia prima: entrenamiento, creación, trabajo profundo. Sin salida fácil, el cuerpo aprende a construir.' } },
    7: { en: { t: 'The First Flag', x: 'Seven days prove you command. Celebrate the tier, never negotiate: the next flag is already raised.' }, es: { t: 'La Primera Bandera', x: 'Siete días prueban que mandas. Celebra el patamar, nunca negocies: la próxima bandera ya está izada.' } },
    8: { en: { t: 'Triggers Have an Address', x: 'Boredom, anxiety, late night: map where the enemy attacks. Defense with a map is strategy, without it is luck.' }, es: { t: 'Los Gatillos Tienen Dirección', x: 'Tedio, ansiedad, madrugada: mapea dónde ataca el enemigo. Defensa con mapa es estrategia; sin mapa, suerte.' } },
    10: { en: { t: 'The 3-Second Rule', x: 'Between trigger and action there is a gap. 4×4 breathing widens it until your choice fits inside.' }, es: { t: 'La Regla de 3 Segundos', x: 'Entre gatillo y acción hay una brecha. La respiración 4×4 la ensancha hasta que cabe tu elección.' } },
    12: { en: { t: 'The Body is the Crucible', x: 'Sleep, sun, strength, water: without physiological base, discipline is shallow willpower. Care the crucible before demanding gold.' }, es: { t: 'El Cuerpo es el Crisol', x: 'Sueño, sol, fuerza, agua: sin base fisiológica, la disciplina es voluntad rasa. Cuida el crisol antes de exigir oro.' } },
    14: { en: { t: 'A Fall is Data', x: 'If you fall: register, extract triggers, execute recovery. Shame hides data; honesty turns it into defense.' }, es: { t: 'Una Caída es Dato', x: 'Si caes: registra, extrae gatillos, ejecuta la retomada. La vergüenza esconde el dato; la honestidad lo vuelve defensa.' } },
    16: { en: { t: 'Environment Beats Intention', x: 'Phone out of bedroom, clean feeds: architect surroundings so your weak self never decides.' }, es: { t: 'El Ambiente Vence a la Intención', x: 'Celular fuera del cuarto, redes limpias: diseña el entorno para que tu yo débil no decida.' } },
    18: { en: { t: 'Boredom is a Gate', x: 'A detoxing brain complains. Cross it: creativity and real desire live beyond. Fleeing boredom returns you to the cage.' }, es: { t: 'El Tedio es una Puerta', x: 'Un cerebro en desintoxicación se queja. Crúzala: creatividad y deseo real viven más allá. Huir del tedio te devuelve a la jaula.' } },
    21: { en: { t: 'Habit Becomes Identity', x: 'At 21 days you are not trying: you ARE who does not watch. Identity protects more than motivation.' }, es: { t: 'El Hábito se Vuelve Identidad', x: 'A los 21 días no intentas: ERES quien no mira. La identidad protege más que la motivación.' } },
    25: { en: { t: 'The Plateau', x: 'After the honeymoon: days without applause or crisis. There constancy is forged — win the day without spectacle.' }, es: { t: 'La Meseta', x: 'Tras la luna de miel: días sin aplauso ni crisis. Ahí se forja la constancia — vence el día sin espectáculo.' } },
    30: { en: { t: 'The Right Mirror', x: 'Measure sleep, training, mood, presence — not only days. Retention is the root; life around it is the tree.' }, es: { t: 'El Espejo Correcto', x: 'Mide sueño, entrenamiento, humor, presencia — no solo días. La retención es la raíz; la vida alrededor, el árbol.' } },
    35: { en: { t: 'Real Intimacy', x: 'Retained energy is presence for who is beside you. Eye to eye, touch without screens.' }, es: { t: 'Intimidad Real', x: 'Energía retenida es presencia para quien está al lado. Ojo a ojo, tacto sin pantallas.' } },
    40: { en: { t: 'The Cost of the Shortcut', x: '"Just today" costs double: the act plus the proof your word fails. Choose the short pain of refusal.' }, es: { t: 'El Costo del Atajo', x: '"Solo hoy" cuesta doble: el acto más la prueba de que tu palabra falla. Elige el dolor corto de la negativa.' } },
    45: { en: { t: 'Deep Reorganization', x: 'Receptors reweight: small pleasures regain taste. Journal what became enjoyable again without screens.' }, es: { t: 'Reorganización Profunda', x: 'Los receptores se reponderan: lo pequeño vuelve a tener sabor. Escribe qué volvió a ser disfrutable sin pantallas.' } },
    60: { en: { t: 'Mentors Also Bleed', x: 'Helping another warrior reinforces your own trench. Teaching is the strongest rep of the new pattern.' }, es: { t: 'El Mentor También Sangra', x: 'Ayudar a otro guerrero refuerza tu trinchera. Enseñar es la repetición más fuerte del patrón nuevo.' } },
    90: { en: { t: 'Full Reset, Continuous War', x: 'Ninety days repair the baseline, not retire the sentinel. The veteran fights calm. Keep the forge.' }, es: { t: 'Reset Completo, Guerra Continua', x: 'Noventa días reparan la base, no jubilan al centinela. El veterano pelea sereno. Mantén la forja.' } },
  },
  read: {
    1: { en: { q: 'At dawn, when it costs you to wake, remember: I awake to work as a man.', r: 'What is your "man\'s work" today — the task the addiction would postpone?' }, es: { q: 'Al amanecer, cuando te cueste despertar, recuerda: despierto para trabajar como hombre.', r: '¿Cuál es tu "trabajo de hombre" hoy — la tarea que el vicio pospondría?' } },
    2: { en: { q: 'In every action ask: what do I have to fear from this act? Death will take me before the answer.', r: 'The urge passes; the question remains. What would you fear remembering tomorrow?' }, es: { q: 'En cada acción pregunta: ¿qué tengo que temer de este acto? La muerte me llevará antes de la respuesta.', r: 'El impulso pasa; la pregunta queda. ¿Qué temerías recordar mañana?' } },
    3: { en: { q: 'About all that afflicts you, remember: this is a trial, not misfortune; bear it well and you will leave stronger.', r: 'Which of today\'s desires is actually a trial disguised as training?' }, es: { q: 'Sobre todo lo que te aflige, recuerda: esto es prueba, no desgracia; sopórtala bien y saldrás más fuerte.', r: '¿Cuál de los deseos de hoy es en verdad una prueba disfrazada de entrenamiento?' } },
    4: { en: { q: 'It is a weak character\'s mark to busy oneself much with the body; the man of value busies himself with the soul.', r: 'Where did you invest today: body-mirror or body-instrument of the soul?' }, es: { q: 'Es marca de carácter débil ocuparse mucho del cuerpo; el hombre de valor se ocupa del alma.', r: '¿Dónde invertiste hoy: cuerpo-espejo o cuerpo-instrumento del alma?' } },
    5: { en: { q: 'It is not because things are hard that we do not dare; it is because we do not dare that they are hard.', r: 'Which conversation, cut or feed-purge have you not dared to do yet?' }, es: { q: 'No es porque las cosas sean difíciles que no osamos; es porque no osamos que son difíciles.', r: '¿Qué conversación, corte o limpieza de redes aún no has osado hacer?' } },
    6: { en: { q: 'The spirit that nothing combats grows heavy and suffocates within itself.', r: 'What voluntary discomfort can you schedule today so the spirit does not suffocate?' }, es: { q: 'El espíritu que nada combate se vuelve pesado y se sofoca en sí mismo.', r: '¿Qué incomodidad voluntaria puedes agendar hoy para que el espíritu no se sofoque?' } },
    7: { en: { q: 'Train yourself to bear cold, heat, thirst, hunger: thus reason becomes master of the impulses.', r: 'Which of the four did you train this week — and which did you avoid?' }, es: { q: 'Entrénate para soportar frío, calor, sed, hambre: así la razón se vuelve señora de los impulsos.', r: '¿Cuál de los cuatro entrenaste esta semana — y cuál evitaste?' } },
    8: { en: { q: 'Erase imagination, stop the impulse, extinguish desire: and the soul retreats to its citadel.', r: 'What is your 5-minute inner citadel when the siege tightens?' }, es: { q: 'Borra la imaginación, detén el impulso, extingue el deseo: y el alma se recoge en su ciudadela.', r: '¿Cuál es tu ciudadela interior de 5 minutos cuando el cerco aprieta?' } },
  },
  prog: {
    combate: { en: '⚔ Combat 4×4 (cuts the urge)', es: '⚔ Combate 4×4 (corta el impulso)' },
    sono: { en: '🌙 Descent 4-7-8 (before sleep)', es: '🌙 Descenso 4-7-8 (antes de dormir)' },
    foco: { en: '🎯 Coherence 5-5 (focus and calm)', es: '🎯 Coherencia 5-5 (foco y calma)' },
  },
  /* ============ i18n ETAPA 3 — OPSVIEW (categoria: ops) ============ */
  ops: {
    wd0: { en: 'Sun', es: 'Dom' },
    wd1: { en: 'Mon', es: 'Lun' },
    wd2: { en: 'Tue', es: 'Mar' },
    wd3: { en: 'Wed', es: 'Mié' },
    wd4: { en: 'Thu', es: 'Jue' },
    wd5: { en: 'Fri', es: 'Vie' },
    wd6: { en: 'Sat', es: 'Sáb' },
    rep_opt_unica: { en: '↺ One-time (does not repeat)', es: '↺ Única (no se repite)' },
    rep_opt_diaria: { en: '🔁 Daily', es: '🔁 Diaria' },
    rep_opt_semana: { en: '🔁 Mon to Fri', es: '🔁 Lun a Vie' },
    rep_opt_fds: { en: '🔁 Sat and Sun', es: '🔁 Sáb y Dom' },
    rep_opt_semanal: { en: '🗓️ Weekly (1 chosen weekday)', es: '🗓️ Semanal (1 día de la semana elegido)' },
    rep_opt_custom: { en: '🗓️ Custom (chosen weekdays)', es: '🗓️ Personalizada (días de la semana elegidos)' },
    rep_diaria: { en: '🔁 Daily', es: '🔁 Diaria' },
    rep_semana: { en: '🔁 Mon–Fri', es: '🔁 Lun–Vie' },
    rep_fds: { en: '🔁 Sat–Sun', es: '🔁 Sáb–Dom' },
    rep_semanal_prefix: { en: '🔁 Weekly · ', es: '🔁 Semanal · ' },
    rep_custom_prefix: { en: '🗓 ', es: '🗓 ' },
    pri_alta: { en: '🔴 High', es: '🔴 Alta' },
    pri_media: { en: '🟡 Medium', es: '🟡 Media' },
    pri_baixa: { en: '⚪ Low', es: '⚪ Baja' },
    cat0: { en: 'Body', es: 'Cuerpo' },
    cat1: { en: 'Mind', es: 'Mente' },
    cat2: { en: 'Financial', es: 'Finanzas' },
    cat3: { en: 'Career', es: 'Carrera' },
    cat4: { en: 'Spirit', es: 'Espíritu' },
    cat5: { en: 'Other', es: 'Otro' },
    m_tEdit: { en: '✏️ EDIT OPERATION', es: '✏️ EDITAR OPERACIÓN' },
    m_tNew: { en: '🎯 NEW OPERATION', es: '🎯 NUEVA OPERACIÓN' },
    m_desc: { en: 'Description', es: 'Descripción' },
    m_descPh: { en: 'E.g.: 20 push-ups on waking', es: 'Ej.: 20 flexiones al despertar' },
    m_pri: { en: 'Priority', es: 'Prioridad' },
    m_time: { en: 'Time', es: 'Horario' },
    m_rep: { en: 'Repeat', es: 'Repetición' },
    m_repDay: { en: 'Weekday (repeats every week)', es: 'Día de la semana (repite cada semana)' },
    m_repDays: { en: 'Weekdays it repeats on', es: 'Días de la semana en que repite' },
    m_proj: { en: 'Linked project', es: 'Proyecto vinculado' },
    m_noProj: { en: 'No project', es: 'Sin proyecto' },
    m_save: { en: '💾 SAVE', es: '💾 GUARDAR' },
    m_cancel: { en: 'Cancel', es: 'Cancelar' },
    m_errTxt: { en: '⚠ Describe the operation.', es: '⚠ Describe la operación.' },
    m_okTask: { en: '🎯 Operation registered.', es: '🎯 Operación registrada.' },
    p_tEdit: { en: '✏️ EDIT WAR PROJECT', es: '✏️ EDITAR PROYECTO DE GUERRA' },
    p_tNew: { en: '⚔️ NEW WAR PROJECT', es: '⚔️ NUEVO PROYECTO DE GUERRA' },
    p_name: { en: 'Project name', es: 'Nombre del proyecto' },
    p_cat: { en: 'Category', es: 'Categoría' },
    p_start: { en: 'Start date', es: 'Fecha de inicio' },
    p_days: { en: 'Duration (days)', es: 'Duración (días)' },
    p_daysPh: { en: 'E.g.: 30', es: 'Ej.: 30' },
    p_end: { en: 'End date', es: 'Encerramiento' },
    p_ws: { en: 'Daily window — start', es: 'Ventana diaria — inicio' },
    p_we: { en: 'Daily window — end', es: 'Ventana diaria — fin' },
    p_errName: { en: '⚠ Give the project a name.', es: '⚠ Dale un nombre al proyecto.' },
    p_okProj: { en: '⚔️ War project created.', es: '⚔️ Proyecto de guerra creado.' },
    btn_newProj: { en: '+ CREATE PROJECT', es: '+ CREAR PROYECTO' },
    btn_newTask: { en: '+ ADD OPERATION', es: '+ AÑADIR OPERACIÓN' },
    k_proj: { en: '🏰 ACTIVE WAR PROJECTS', es: '🏰 PROYECTOS DE GUERRA ACTIVOS' },
    t_react: { en: 'Reactivate project', es: 'Reactivar proyecto' },
    t_cancelProj: { en: 'Cancel project', es: 'Cancelar proyecto' },
    t_editProj: { en: 'Edit project', es: 'Editar proyecto' },
    t_del: { en: 'Delete', es: 'Excluir' },
    c_prTitle: { en: 'DELETE PROJECT?', es: '¿ELIMINAR PROYECTO?' },
    c_prBody2: { en: '" and its links will be removed.', es: '" y sus vínculos serán eliminados.' },
    chip_overdue: { en: ' · overdue', es: ' · vencido' },
    chip_days: { en: ' days', es: ' días' },
    chip_cancelled: { en: '🚫 CANCELLED', es: '🚫 CANCELADO' },
    line_tasks: { en: 'tasks today', es: 'tareas de hoy' },
    line_day: { en: ' · 📆 day ', es: ' · 📆 día ' },
    proj_linkHint: { en: 'Link tasks to this project ➜', es: 'Vincula tareas a este proyecto ➜' },
    empty_proj1: { en: 'No war projects.', es: 'Ningún proyecto de guerra.' },
    empty_click: { en: 'Click ', es: 'Clic en ' },
    empty_suffix: { en: ' above.', es: ' arriba.' },
    k_tasks: { en: '🎯 DAILY OPERATIONS (TASKS)', es: '🎯 OPERACIONES DIARIAS (TAREAS)' },
    aria_done: { en: 'complete', es: 'completar' },
    t_hist: { en: 'Last 7 days history', es: 'Historial de los últimos 7 días' },
    t_editTask: { en: 'Edit task', es: 'Editar tarea' },
    c_tkTitle: { en: 'DELETE OPERATION?', es: '¿ELIMINAR OPERACIÓN?' },
    c_tkBody2: { en: '" will be removed.', es: '" será eliminada.' },
    ws_done: { en: 'DONE', es: 'HECHO' },
    ws_single: { en: 'one-time (today only)', es: 'única (solo hoy)' },
    ws_pend: { en: 'pending', es: 'pendiente' },
    ws_hint: { en: 'Tap a day to toggle ✅ DONE / not done.', es: 'Toca un día para alternar ✅ HECHO / no hecho.' },
    empty_task1: { en: 'No operations registered.', es: 'Ninguna operación registrada.' },
    k_panel: { en: '📊 TACTICAL PANEL & PERFORMANCE', es: '📊 PANEL TÁCTICO Y DESEMPENHO' },
    kpi_active: { en: 'Active Projects', es: 'Proyectos Activos' },
    kpi_done: { en: 'Completed Projects', es: 'Proyectos Concluidos' },
    kpi_rate: { en: 'Operation Completion', es: 'Conclusión de Operaciones' },
    kpi_today: { en: 'Operations Today', es: 'Operaciones Hoy' },
    k2_status: { en: 'Project Status', es: 'Estado de los Proyectos' },
    lg_done: { en: '🟢 Done (', es: '🟢 Concluidos (' },
    lg_prog: { en: '🟡 In Progress (', es: '🟡 En Curso (' },
    lg_late: { en: '🔴 Late (', es: '🔴 Atrasados (' },
    lg_cancel: { en: '⚪ Cancelled (', es: '⚪ Cancelados (' },
    empty_analyze: { en: 'No projects to analyze.', es: 'Ningún proyecto para analizar.' },
    k2_volume: { en: 'Operation Volume (Today)', es: 'Volumen de Operaciones (Hoy)' },
    lg_tdone: { en: '✅ Completed (', es: '✅ Concluidas (' },
    lg_tpend: { en: '⏳ Pending (', es: '⏳ Pendientes (' },
    empty_due: { en: 'No operations due today.', es: 'Ninguna operación vencida hoy.' },
  },

  /* ============ i18n ETAPA 2 — LANDING PÚBLICA (categoria: land) ============ */
  land: {
    meta_title: { en: 'Forjando Guerreiros — Beat the addiction, reclaim your energy', es: 'Forjando Guerreiros — Vence el vicio, recupera tu energía' },
    meta_desc: { en: 'Retention, discipline and habit-forging platform: daily check-in of the 3 pillars, 5-minute S.O.S protocol, combat reports and cloud sync. 7 days free.', es: 'Plataforma de retención, disciplina y forja de hábitos: check-in diario de los 3 pilares, protocolo S.O.S de 5 minutos, reportes de combate y sincronización en la nube. 7 días gratis.' },
    og_title: { en: 'Forjando Guerreiros ⚔ Retention & Discipline', es: 'Forjando Guerreiros ⚔ Retención y Disciplina' },
    og_desc: { en: 'The HQ of those who declared war on addiction. 7 days free, cancel anytime.', es: 'El QG de quien declaró la guerra al vicio. 7 días gratis, cancela cuando quieras.' },
    nav_enter: { en: 'ENTER', es: 'ENTRAR' },
    kick: { en: 'RETENTION · DISCIPLINE · TRANSMUTATION', es: 'RETENCIÓN · DISCIPLINA · TRANSMUTACIÓN' },
    h1a: { en: 'BEAT THE ADDICTION.', es: 'VENCE EL VICIO.' },
    h1b: { en: 'RECLAIM YOUR ENERGY.', es: 'RECUPERA TU ENERGÍA.' },
    hero_sub: { en: 'The digital HQ of those who declared war on pornography and wasted vital energy: daily check-in of the 3 pillars, elite habits, an emergency protocol against the urge, and combat reports — all synced between phone and PC.', es: 'El QG digital de quien declaró la guerra a la pornografía y al desperdicio de energía vital: check-in diario de los 3 pilares, hábitos de élite, protocolo de emergencia contra el impulso y reportes de combate — todo sincronizado entre celular y PC.' },
    cta_start: { en: '⚔️ START MY 7 FREE DAYS', es: '⚔️ COMENZAR MIS 7 DÍAS GRATIS' },
    cta_back: { en: 'I\'m already a warrior →', es: 'Ya soy guerrero →' },
    note_after: { en: 'Then, only', es: 'Después, solo' },
    note_cancel: { en: 'Cancel anytime', es: 'Cancela cuando quieras' },
    note_data: { en: 'Your data belongs to you alone', es: 'Tus datos son solo tuyos' },
    pil_title: { en: 'THE 3 PILLARS OF THE TRIAD', es: 'LOS 3 PILARES DE LA TRÍADA' },
    pil1t: { en: 'NO PORNOGRAPHY', es: 'SIN PORNOGRAFÍA' },
    pil1d: { en: 'Close the addiction\'s front door: less stimulus, more sensitivity and presence in the real world.', es: 'Cierra la puerta de entrada del vicio: menos estímulo, más sensibilidad y presencia en el mundo real.' },
    pil2t: { en: 'NO COMPULSIVE MASTURBATION', es: 'SIN MASTURBACIÓN COMPULSIVA' },
    pil2d: { en: 'Break the cheap-dopamine cycle that trains your brain to run from discomfort.', es: 'Rompe el ciclo de dopamina barata que entrena al cerebro a huir del malestar.' },
    pil3t: { en: 'SEMINAL RETENTION', es: 'RETENCIÓN SEMINAL' },
    pil3d: { en: 'Preserve and transmute your vital energy: the main counter of your war.', es: 'Preserva y transmuta tu energía vital: el contador principal de tu guerra.' },
    rec_title: { en: 'A COMPLETE ARSENAL OF DISCIPLINE', es: 'UN ARSENAL COMPLETO DE DISCIPLINA' },
    rec_sub: { en: 'No generic habit app here: every module was forged for this specific war.', es: 'Nada de apps genéricos de hábitos: cada módulo fue forjado para esta guerra específica.' },
    rec1t: { en: 'Warrior HQ', es: 'QG del Guerrero' },
    rec1d: { en: 'Day counter, purity, ranks (Recruit → Legend) and a timeline of victories × falls.', es: 'Contador de días, pureza, rangos (Recluta → Leyenda) y línea de tiempo de victorias × caídas.' },
    rec2t: { en: 'The Forge', es: 'La Forja' },
    rec2d: { en: '20 elite habits + custom ones, with slots unlocked by rank and a 7-day history.', es: '20 hábitos de élite + personalizados, con slots liberados por rango e historial de 7 días.' },
    rec3t: { en: 'S.O.S Protocol', es: 'Protocolo S.O.S' },
    rec3d: { en: '5 guided minutes against the urge: thermal shock, 4×4 breathing with sound and physical exhaustion.', es: '5 minutos guiados contra el impulso: choque térmico, respiración 4×4 con sonido y agotamiento físico.' },
    rec4t: { en: 'War Journal', es: 'Diario de a Bordo' },
    rec4d: { en: 'Mood, victories, challenges, relapse venting and a notes pad with search and tags.', es: 'Humor, victorias, desafíos, desahogos de caída y cuaderno de notas con búsqueda y etiquetas.' },
    rec5t: { en: 'Combat Reports', es: 'Reportes de Combate' },
    rec5d: { en: 'Monthly heat map, Forge consistency, KPIs and a history of won interventions.', es: 'Mapa de calor mensual, consistencia de la Forja, KPIs e historial de intervenciones vencidas.' },
    rec6t: { en: 'Cloud sync', es: 'Sincronización en la nube' },
    rec6d: { en: 'Mark it on your phone, see it on your PC. Protected login and private data per user (RLS).', es: 'Marca en el celular, míralo en el PC. Login protegido y datos privados por usuario (RLS).' },
    how_title: { en: 'HOW IT WORKS', es: 'CÓMO FUNCIONA' },
    how1t: { en: 'CREATE YOUR ACCOUNT', es: 'CREA TU CUENTA' },
    how1d: { en: 'Protected login with email and password. A war onboarding calibrates your counters and your why.', es: 'Login protegido por correo y contraseña. Un onboarding de guerra calibra tus contadores y tu porqué.' },
    how2t: { en: 'WIN THE DAILY WAR', es: 'GANA LA GUERRA DIARIA' },
    how2d: { en: 'Check the pillars, forge habits and, if the urge hits hard, trigger the 5-minute S.O.S.', es: 'Marca los pilares, forja hábitos y, si el impulso aprieta, activa el S.O.S de 5 minutos.' },
    how3t: { en: 'RANK UP', es: 'SUBE DE RANGO' },
    how3d: { en: 'From Recruit to Legend: streaks, purity, reports and rewards measure your transformation.', es: 'De Recluta a Leyenda: rachas, pureza, reportes y recompensas miden tu transformación.' },
    voz_title: { en: 'VOICES FROM THE FORGE', es: 'VOCES DE LA FORJA' },
    voz1w: { en: 'G. · 34 years old · 96 days', es: 'G. · 34 años · 96 días' },
    voz1t: { en: 'The 5-minute S.O.S saved me at 2 a.m. Three times in the first week. Today it\'s automatic: urge hits, I act.', es: 'El S.O.S de 5 minutos me salvó a las 2 de la mañana. Tres veces la primera semana. Hoy es automático: aprieta, y actúo.' },
    voz2w: { en: 'R. · 27 years old · 210 days', es: 'R. · 27 años · 210 días' },
    voz2t: { en: 'Watching the heat map and my purity climb became my mirror. For the first time I don\'t feel hostage to my own mind.', es: 'Ver el mapa de calor y la pureza subiendo se volvió mi espejo. Por primera vez no me siento rehén de mi propia mente.' },
    voz3w: { en: 'M. · 41 years old · 45 days', es: 'M. · 41 años · 45 días' },
    voz3t: { en: 'I fell twice. The app didn\'t judge me: it logged it, showed me the trigger and lifted me up. That\'s what a man needs.', es: 'Caí dos veces. La app no me juzgó: registró, me mostró el gatillo y me levantó. Es lo que un hombre necesita.' },
    pr_title: { en: 'THE PRICE OF A COFFEE. A WHOLE WAR.', es: 'UN PRECIO DE CAFÉ. UNA GUERRA ENTERA.' },
    pr_k: { en: 'FULL ACCESS', es: 'ACCESO COMPLETO' },
    pr_days: { en: '7 days', es: '7 días' },
    pr_free: { en: 'free · then', es: 'gratis · después' },
    pr_f1: { en: 'All modules unlocked', es: 'Todos los módulos desbloqueados' },
    pr_f2: { en: 'Real-time phone + PC sync', es: 'Sincronización celular + PC en tiempo real' },
    pr_f3: { en: 'Unlimited S.O.S protocol', es: 'Protocolo S.O.S ilimitado' },
    pr_f4: { en: 'Complete reports and history', es: 'Reportes e historial completos' },
    pr_f5: { en: '1-click cancellation, no fees', es: 'Cancelamiento en 1 clic, sin multa' },
    pr_cta: { en: '⚔️ START MY FREE TRIAL', es: '⚔️ INICIAR MI PRUEBA GRATIS' },
    pr_pay: { en: 'Payment processed by Stripe. The app never sees your card.', es: 'Pago procesado por Stripe. La app nunca ve tu tarjeta.' },
    faq_title: { en: 'WAR QUESTIONS', es: 'PREGUNTAS DE GUERRA' },
    faq1q: { en: 'Is it anonymous? Will anyone see what I check?', es: '¿Es anónimo? ¿Alguien verá lo que marco?' },
    faq1a: { en: 'Yes, it\'s anonymous. Your records are private: encrypted in your account and protected by database security rules (RLS) — neither other users nor visitors can see them. Only you, on your login.', es: 'Sí, es anónimo. Tus registros son privados: cifrados en tu cuenta y protegidos por reglas de seguridad en la base de datos (RLS) — ni otros usuarios ni visitantes pueden verlos. Solo tú, en tu login.' },
    faq2q: { en: 'Do I need to enter a card to try it?', es: '¿Necesito poner tarjeta para probar?' },
    faq2a: { en: 'The 7-day trial asks for a card to prevent abuse (1 account = 1 trial), but today\'s charge is zero. If you cancel before day 7, you pay nothing.', es: 'La prueba de 7 días pide tarjeta para evitar abusos (1 cuenta = 1 prueba), pero el cargo de hoy es cero. Si cancelas antes del día 7, no pagas nada.' },
    faq3q: { en: 'How does cancellation work?', es: '¿Cómo funciona la cancelación?' },
    faq3a: { en: 'One click: through Stripe\'s own email or the app Settings ("Delete my account"). Your access continues until the end of the already paid/tested period. No fee, no calls, no guilt.', es: 'Un clic: por el propio correo de Stripe o por las Configuraciones de la app ("Eliminar mi cuenta"). Tu acceso continúa hasta el fin del período ya pago/probado. Sin multa, sin llamadas, sin culpa.' },
    faq4q: { en: 'Does this replace therapy or treatment?', es: '¿Esto reemplaza terapia o tratamiento?' },
    faq4a: { en: 'No. Forjando Guerreiros is a discipline, habits and personal journaling tool. If you face severe addiction, anxiety or depression, seek a health professional. The app complements — never replaces.', es: 'No. Forjando Guerreiros es una herramienta de disciplina, hábitos y registro personal. Si enfrentas dependencia severa, ansiedad o depresión, busca un profesional de salud. La app complementa — nunca reemplaza.' },
    faq5q: { en: 'Does it work on phone and computer?', es: '¿Funciona en celular y computadora?' },
    faq5a: { en: 'Yes. It\'s a PWA: runs in any device\'s browser and can be installed on your phone\'s home screen. With login, your data syncs in real time across all devices.', es: 'Sí. Es una PWA: funciona en el navegador de cualquier dispositivo y puede instalarse en la pantalla de inicio del celular. Con el login, tus datos sincronizan en tiempo real entre todos los aparatos.' },
    faq6q: { en: 'Is my data sold or shared?', es: '¿Mis datos se venden o comparten?' },
    faq6a: { en: 'Never. Usage data lives in the database (São Paulo region, Brazil) and payment is processed by Stripe — the app never sees or stores your card data. You can delete everything anytime in Settings.', es: 'Nunca. Los datos de uso viven en la base de datos (región São Paulo, Brasil) y el pago lo procesa Stripe — la app nunca ve ni guarda los datos de tu tarjeta. Puedes eliminar todo cuando quieras en Configuraciones.' },
    cta1: { en: 'THE URGE IS TEMPORARY.', es: 'EL IMPULSO ES PASAJERO.' },
    cta2: { en: 'HONOR IS PERMANENT.', es: 'EL HONOR ES PERMANENTE.' },
    cta_btn: { en: '⚔️ ENTER THE FORGE', es: '⚔️ ENTRA A LA FORJA' },
    cr_title: { en: '💚 THIS DOES NOT REPLACE THERAPY', es: '💚 ESTO NO REEMPLAZA TERAPIA' },
    cr_txt: { en: 'Forjando Guerreiros is a self-discipline and personal journaling tool. In intense suffering, self-harm ideation, or life-risking addiction, seek a health professional — and rely on your local crisis support network (in Brazil: CVV 188, 24h, free and confidential · chat at cvv.org.br · medical emergencies: SAMU 192).', es: 'Forjando Guerreiros es una herramienta de autodisciplina y registro personal. En sufrimiento intenso, ideación de autolesión o dependencia que pone tu vida en riesgo, busca un profesional de salud — y apóyate en tu red local de atención en crisis (en Brasil: CVV 188, 24h, gratuito y confidencial · chat en cvv.org.br · emergencias médicas: SAMU 192).' },
    ft_tag: { en: 'FORJANDO GUERREIROS ⚔ RETENTION & DISCIPLINE', es: 'FORJANDO GUERREIROS ⚔ RETENCIÓN Y DISCIPLINA' },
    ft_terms: { en: 'Terms of Use', es: 'Términos de Uso' },
    ft_priv: { en: 'Privacy Policy', es: 'Política de Privacidad' },
    ft_enter: { en: 'Log in', es: 'Entrar' },
    ft_note: { en: 'A self-discipline and personal journaling tool. It does not replace professional medical or psychological care.', es: 'Herramienta de autodisciplina y registro personal. No reemplaza el acompañamiento médico o psicológico profesional.' },
    per_month: { en: '/mo', es: '/mes' },
  },

  /* ============ i18n ETAPA 3a — TELAS DE ENTRADA (auth / pin / pay / ui) ============ */
  auth: {
    title: { en: 'FORJANDO GUERREIROS — HQ ACCESS', es: 'FORJANDO GUERREIROS — ACCESO AL QG' },
    title_disc: { en: 'FG DIARY — ACCESS', es: 'FG DIARIO — ACCESO' },
    sub_login: { en: 'Log in with email and password', es: 'Entrar con correo y contraseña' },
    sub_signup: { en: 'Create your warrior account', es: 'Crear cuenta de guerrero' },
    nocloud: { en: 'Cloud not configured. Local mode active.', es: 'Nube no configurada. Modo local activo.' },
    lbl_email: { en: 'Email', es: 'Correo' },
    ph_email: { en: 'warrior@example.com', es: 'guerrero@ejemplo.com' },
    lbl_pass: { en: 'Password', es: 'Contraseña' },
    lbl_pass2: { en: 'Confirm password', es: 'Confirmar contraseña' },
    btn_login: { en: 'ENTER HQ', es: 'ENTRAR AL QG' },
    btn_signup: { en: 'CREATE ACCOUNT', es: 'CREAR CUENTA' },
    link_signup: { en: 'Create account', es: 'Crear cuenta' },
    link_login: { en: 'I already have an account — log in', es: 'Ya tengo cuenta — entrar' },
    link_forgot: { en: 'Forgot my password', es: 'Olvidé mi contraseña' },
    wait: { en: '⏳ Please wait...', es: '⏳ Espera...' },
    err_email: { en: '⚠ Enter a valid email.', es: '⚠ Informa un correo válido.' },
    err_pass: { en: '⚠ Password must be at least 6 characters.', es: '⚠ La contraseña debe tener al menos 6 caracteres.' },
    err_match: { en: '⚠ Passwords do not match.', es: '⚠ Las contraseñas no coinciden.' },
    ok_signup: { en: '✅ Account created! Check your email to confirm and then log in.', es: '✅ ¡Cuenta creada! Revisa tu correo para confirmar y luego entra.' },
    err_local_exists: { en: 'This email already has a local account. Use "I already have an account".', es: 'Este correo ya tiene cuenta local. Usa "Ya tengo cuenta".' },
    err_local_bad: { en: 'Wrong email or password (local mode).', es: 'Correo o contraseña incorrectos (modo local).' },
    forgot_need_email: { en: '✍️ Type your email in the field above to reset your password.', es: '✍️ Escribe tu correo en el campo de arriba para redefinir la contraseña.' },
    forgot_nocloud: { en: '⚠ Local mode active: sending the reset email requires configuring Supabase.', es: '⚠ Modo local activo: enviar el correo de redefinición exige configurar Supabase.' },
    forgot_ok: { en: '📬 Reset email sent. Check your inbox.', es: '📬 Correo de redefinición enviado. Revisa tu bandeja.' },
    foot: { en: 'Your data is synced with encryption and visible only to you.', es: 'Tus datos se sincronizan con cifrado y son visibles solo para ti.' },
    e_invalid: { en: '⚠ Invalid credentials.', es: '⚠ Credenciales inválidas.' },
    e_notconf: { en: '⚠ Confirm your email before logging in.', es: '⚠ Confirma tu correo antes de entrar.' },
    e_exists: { en: '⚠ This email is already registered.', es: '⚠ Este correo ya está registrado.' },
    e_rate: { en: '⚠ Too many attempts. Wait a moment.', es: '⚠ Demasiados intentos. Espera un momento.' },
  },
  pin: {
    title: { en: 'WAR CODE', es: 'CÓDIGO DE GUERRA' },
    sub: { en: 'Enter your 4-digit PIN to open HQ', es: 'Digita tu PIN de 4 dígitos para entrar al QG' },
  },
  pay: {
    h1: { en: 'JOIN THE FORGE', es: 'ENTRA A LA FORJA' },
    start: { en: 'Your access starts with', es: 'Tu acceso comienza con' },
    free: { en: '7 free days', es: '7 días gratis' },
    then: { en: 'Then, only', es: 'Después, solo' },
    then_generic: { en: 'Then, just a small monthly fee in your currency.', es: 'Después, solo una pequeña mensualidad en tu moneda.' },
    cancel: { en: 'Cancel anytime.', es: 'Cancela cuando quieras.' },
    b1: { en: 'Full HQ: retention, purity and war ranks', es: 'QG completo: retención, pureza y rangos de guerra' },
    b2: { en: '5-minute S.O.S protocol with guided breathing', es: 'Protocolo S.O.S de 5 minutos con respiración guiada' },
    b3: { en: 'War Journal, field notes and unlimited reports', es: 'Diario de a Bordo, notas de campo y reportes ilimitados' },
    b4: { en: 'Combat map, Forge consistency and history', es: 'Mapa de combate, consistencia de la Forja e historial' },
    b5: { en: 'Cloud sync: PC, phone and tablet', es: 'Sincronización en la nube: PC, celular y tablet' },
    btn: { en: '🛡️ START MY 7 FREE DAYS', es: '🛡️ COMENZAR MIS 7 DÍAS GRATIS' },
    btn_check: { en: 'CONFIRMING PAYMENT...', es: 'CONFIRMANDO PAGO...' },
    err_session: { en: 'Session expired — log in again.', es: 'Sesión expirada — entra de nuevo.' },
    err_checkout: { en: 'Failed to start checkout.', es: 'Falla al iniciar el checkout.' },
    err_open: { en: 'Error opening checkout.', es: 'Error al abrir el checkout.' },
    foot1: { en: 'Payment securely processed by Stripe. No card data ever touches this app.', es: 'Pago procesado con seguridad por Stripe. Ningún dato de tarjeta toca esta aplicación.' },
    foot2: { en: 'Connected as:', es: 'Conectado como:' },
  },
  ui: {
    close: { en: 'Close', es: 'Cerrar' },
  },

  /* ============ i18n ETAPA 4 — CONTEÚDO: frases, hábitos, patamares, dossiê, S.O.S, respiração ============ */
  quotes: {
    en: [
      'Discipline is the bridge between goals and achievements.',
      'Temporary pain, eternal pride.',
      'He who conquers himself conquers any battle.',
      'Retained energy is accumulated power.',
      'The urge is fleeting. Honor is permanent.',
      'Do not negotiate with your weakness.',
      'Forge yourself in silence; the world will hear the steel.',
      'Every clean day is a brick in the fortress.'
    ],
    es: [
      'La disciplina es el puente entre metas y logros.',
      'Dolor temporal, orgullo eterno.',
      'Quien se vence a sí mismo vence cualquier batalla.',
      'La energía retenida es poder acumulado.',
      'El impulso es pasajero. El honor es permanente.',
      'No negocies con tu debilidad.',
      'Fórjate en silencio; el mundo oirá el acero.',
      'Cada día limpio es un ladrillo en la fortaleza.'
    ]
  },

  hab: {
    1: {
      en: {
        n: 'Cold Shower',
        b: 'Activates the sympathetic nervous system, spikes noradrenaline and trains your mind to obey commands even under discomfort.',
        p: 'Cuts the urge at its peak: adrenaline replaces the search for cheap dopamine and breaks the trigger trance.'
      },
      es: {
        n: 'Ducha Fría',
        b: 'Activa el sistema nervioso simpático, dispara la noradrenalina y entrena tu mente a obedecer incluso bajo incomodidad.',
        p: 'Corta el impulso en su pico: la adrenalina reemplaza la búsqueda de dopamina barata y rompe el trance del gatillo.'
      }
    },
    2: {
      en: {
        n: 'Strength Training',
        b: 'Naturally raises testosterone, improves dopamine sensitivity and drains the tension accumulated in the body.',
        p: 'Transmutes retained sexual energy into muscle fiber — the body stops "asking" for release and starts building.'
      },
      es: {
        n: 'Entrenamiento de Fuerza',
        b: 'Eleva la testosterona de forma natural, mejora la sensibilidad a la dopamina y drena la tensión acumulada del cuerpo.',
        p: 'Transmuta la energía sexual retenida en fibra muscular — el cuerpo deja de "pedir" liberación y empieza a construir.'
      }
    },
    3: {
      en: {
        n: 'Stoic Reading',
        b: 'Strengthens the prefrontal cortex, the seat of discipline, and rewires your relationship with desire.',
        p: 'Every page is a mental rep: "the urge is fleeting, honor is permanent".'
      },
      es: {
        n: 'Lectura Estoica',
        b: 'Fortalece la corteza prefrontal, sede de la disciplina, y reprograma tu relación con el deseo.',
        p: 'Cada página es una repetición mental: "el impulso es pasajero, el honor es permanente".'
      }
    },
    4: {
      en: {
        n: 'Wake Up 05:59',
        b: 'Anchors the circadian rhythm, activates healthy morning cortisol and eliminates the late-night risk window.',
        p: 'Kills the "late-night phone" trigger: the warrior rises before the addiction wakes up.'
      },
      es: {
        n: 'Despertar 05:59',
        b: 'Ancla el ritmo circadiano, activa el cortisol matutino saludable y elimina la ventana de riesgo de la madrugada.',
        p: 'Mata el gatillo "madrugada en el celular": el guerrero se levanta antes de que el vicio despierte.'
      }
    },
    5: {
      en: {
        n: 'Screen Blackout',
        b: 'Reduces dopaminergic overstimulation and restores receptor sensitivity.',
        p: 'Fewer screens = fewer open windows for filthy content to get in.'
      },
      es: {
        n: 'Apagón de Pantallas',
        b: 'Reduce la sobreestimulación dopaminérgica y devuelve sensibilidad a los receptores.',
        p: 'Menos pantallas = menos ventanas abiertas para que entre contenido inmundo.'
      }
    },
    6: {
      en: {
        n: 'Feed Cleanup',
        b: 'Removes profiles, groups and algorithms that serve as a gateway to the addiction.',
        p: 'Destroys the addiction supply route before the very first click.'
      },
      es: {
        n: 'Limpieza de Redes',
        b: 'Elimina perfiles, grupos y algoritmos que sirven de puerta de entrada al vicio.',
        p: 'Destruye la ruta de suministro del vicio antes incluso del primer clic.'
      }
    },
    7: {
      en: {
        n: 'Cut Sugar',
        b: 'Stabilizes blood glucose and reduces the anxiety spikes that trigger relapses.',
        p: 'Less emotional rollercoaster, fewer excuses to seek instant comfort.'
      },
      es: {
        n: 'Cortar el Azúcar',
        b: 'Estabiliza la glucemia y reduce los picos de ansiedad que disparan recaídas.',
        p: 'Menos montaña rusa emocional, menos excusas para buscar consuelo inmediato.'
      }
    },
    8: {
      en: {
        n: 'Walk Without Headphones',
        b: 'Trains presence, boredom tolerance and nervous-system regulation.',
        p: 'Teaches the brain to endure silence — the exact opposite of the pornographic escape.'
      },
      es: {
        n: 'Caminata Sin Audífonos',
        b: 'Entrena la presencia, la tolerancia al aburrimiento y la regulación del sistema nervioso.',
        p: 'Enseña al cerebro a soportar el silencio — lo opuesto exacto a la fuga pornográfica.'
      }
    },
    9: {
      en: {
        n: 'Meditation (10-15m)',
        b: 'Thickens the prefrontal cortex and reduces compulsive mind-wandering network activity.',
        p: 'Creates the 3-second gap between trigger and action — where choice is born.'
      },
      es: {
        n: 'Meditación (10-15m)',
        b: 'Engrosa la corteza prefrontal y reduce la actividad de la red de devaneo compulsivo.',
        p: 'Crea el intervalo de 3 segundos entre gatillo y acción — donde nace la elección.'
      }
    },
    10: {
      en: {
        n: 'Intermittent Fasting',
        b: 'Boosts autophagy, mental clarity and command over primal urges.',
        p: 'Whoever masters their own hunger masters any desire.'
      },
      es: {
        n: 'Ayuno Intermitente',
        b: 'Aumenta la autofagia, la claridad mental y el dominio sobre los impulsos primarios.',
        p: 'Quien domina su propio hambre domina cualquier deseo.'
      }
    },
    11: {
      en: {
        n: 'Make the Bed',
        b: 'The first victory of the day; programs the brain to finish what it starts.',
        p: 'Eliminates stagnant energy in the environment: outer order, inner order.'
      },
      es: {
        n: 'Tender la Cama',
        b: 'La primera victoria del día; programa el cerebro a completar lo que empieza.',
        p: 'Elimina el estancamiento energético del entorno: orden externo, orden interno.'
      }
    },
    12: {
      en: {
        n: 'Zero Alcohol/Drugs',
        b: 'Protects serotonin and preserves your ability to say NO.',
        p: 'Most relapses happen uninhibited — this habit keeps the guardian at the gate.'
      },
      es: {
        n: 'Cero Alcohol/Drogas',
        b: 'Protege la serotonina y preserva tu capacidad de decir NO.',
        p: 'La mayoría de las recaídas ocurren desinhibido — este hábito mantiene al guardián en la puerta.'
      }
    },
    13: {
      en: {
        n: '3L of Water',
        b: 'Optimizes blood flow, baseline energy and reduces brain fog.',
        p: 'A hydrated body has fewer irritability and anxiety spikes — weakened triggers.'
      },
      es: {
        n: '3L de Agua',
        b: 'Optimiza el flujo sanguíneo, la energía base y reduce la niebla mental.',
        p: 'Un cuerpo hidratado tiene menos picos de irritabilidad y ansiedad — gatillos debilitados.'
      }
    },
    14: {
      en: {
        n: 'Morning Sun',
        b: 'Regulates melatonin, serotonin and vitamin D synthesis.',
        p: 'Stable mood reduces the search for artificial dopamine in the dark.'
      },
      es: {
        n: 'Sol Matutino',
        b: 'Regula la melatonina, la serotonina y la síntesis de vitamina D.',
        p: 'El humor estable reduce la búsqueda de dopamina artificial en la oscuridad.'
      }
    },
    15: {
      en: {
        n: 'Ship Journal',
        b: 'Turns inner chaos into observable data and mappable patterns.',
        p: 'Naming the trigger strips its power: a mapped pattern is a neutralized pattern.'
      },
      es: {
        n: 'Diario de a Bordo',
        b: 'Convierte el caos interno en datos observables y patrones mapeables.',
        p: 'Nombrar el gatillo le quita el poder: patrón mapeado es patrón neutralizado.'
      }
    },
    16: {
      en: {
        n: '90m Deep Focus',
        b: 'Rebuilds the attention circuits destroyed by fast consumption.',
        p: 'A busy mind building the future has no time to plan relapses.'
      },
      es: {
        n: 'Enfoque Profundo 90m',
        b: 'Reconstruye los circuitos de atención destruidos por el consumo rápido.',
        p: 'Una mente ocupada construyendo el futuro no tiene tiempo de planear recaídas.'
      }
    },
    17: {
      en: {
        n: 'Phone Out of the Bedroom',
        b: 'Removes the most dangerous battlefield: bed + night + solitude.',
        p: 'Physical distance from the trigger — the oldest and most effective strategy of war.'
      },
      es: {
        n: 'Celular Fuera del Cuarto',
        b: 'Elimina el campo de batalla más peligroso: cama + noche + soledad.',
        p: 'Distancia física del gatillo — la estrategia más antigua y eficaz de la guerra.'
      }
    },
    18: {
      en: {
        n: 'Pelvic Mobility',
        b: 'Releases pelvic tension accumulated during retention and improves circulation.',
        p: 'Reduces the physical pressure the brain interprets as sexual urgency.'
      },
      es: {
        n: 'Movilidad Pélvica',
        b: 'Libera las tensiones pélvicas acumuladas en la retención y mejora la circulación.',
        p: 'Reduce la presión física que el cerebro interpreta como urgencia sexual.'
      }
    },
    19: {
      en: {
        n: 'Hardest Task First',
        b: 'Trains the brain to run TOWARD discomfort, not away from it.',
        p: 'Inverts the logic of addiction: instead of easy relief, conquest first.'
      },
      es: {
        n: 'La Tarea Más Difícil Primero',
        b: 'Entrena al cerebro a correr HACIA la incomodidad, no a huir de ella.',
        p: 'Invierte la lógica del vicio: en vez de alivio fácil, primero la conquista.'
      }
    },
    20: {
      en: {
        n: 'Silent Act of Value',
        b: 'Generates dopamine from real contribution, without an audience and without applause.',
        p: 'Replaces secret, dirty pleasure with silent value and honor.'
      },
      es: {
        n: 'Acción de Valor Silenciosa',
        b: 'Genera dopamina de contribución real, sin público y sin aplauso.',
        p: 'Reemplaza el placer secreto y sucio por valor silencioso y honor.'
      }
    }
  },

  tiers: {
    en: {
      0: { name: 'RECRUIT' },
      1: { name: 'WARRIOR' },
      2: { name: 'CENTURION' },
      3: { name: 'SPARTAN' },
      4: { name: 'MONK / LORD OF THE FORGE', reward: 'Golden Aura in HQ' },
      5: { name: 'ASTRAL TRANSMUTER', reward: 'Cosmic Onyx Theme + exclusive sound synthesis' },
      6: { name: 'UNSHAKABLE LEGEND', reward: 'Titanium Insignia + Legend status' }
    },
    es: {
      0: { name: 'RECLUTA' },
      1: { name: 'GUERRERO' },
      2: { name: 'CENTURIÓN' },
      3: { name: 'ESPARTANO' },
      4: { name: 'MONJE / SEÑOR DE LA FORJA', reward: 'Aura Dorada en el QG' },
      5: { name: 'TRANSMUTADOR ASTRAL', reward: 'Tema Ónix Cósmico + síntesis sonora exclusiva' },
      6: { name: 'LEYENDA INQUEBRANTABLE', reward: 'Insignia de Titanio + estatus Leyenda' }
    }
  },

  dos: {
    deip: {
      en: {
        t: 'Porn-Induced Erectile Dysfunction (PIED)',
        pts: [
          [
            'Explanation',
            'Loss of erection with a real partner, keeping an erectile response only in front of screens.'
          ],
          ['Mechanism', 'Habituation and stimulus escalation (needing increasingly exotic and fast content).'],
          [
            'Scientific Evidence',
            'Studies indicate the rate of erectile dysfunction in men who prefer masturbating with pornography reaches 78%, versus 22% of those who prefer real sex.',
            'Ref: Begovic, 2019; Park et al., 2016'
          ]
        ]
      },
      es: {
        t: 'Disfunción Eréctil Inducida por Pornografía (DEIP)',
        pts: [
          [
            'Explicación',
            'Pérdida de erección con una pareja real, manteniendo la respuesta eréctil solo frente a pantallas.'
          ],
          [
            'Mecanismo',
            'Habituación y escalada del estímulo (necesidad de contenidos cada vez más exóticos y rápidos).'
          ],
          [
            'Evidencia Científica',
            'Un estudio señala que la tasa de disfunción eréctil en hombres que prefieren masturbarse con pornografía llega al 78%, frente al 22% de los que prefieren el sexo real.',
            'Ref: Begovic, 2019; Park et al., 2016'
          ]
        ]
      }
    },
    brain: {
      en: {
        t: 'Frontostriatal Remodeling (Brain Damage)',
        pts: [
          [
            'Brain Atrophy',
            'Neuroimaging studies from the Max Planck Institute reveal decreased gray matter in the right striatum (caudate nucleus).',
            'Ref: Kühn & Gallinat, 2014'
          ],
          [
            'Dopamine Desensitization',
            'Lower reactivity in the putamen, creating neurochemical tolerance and anhedonia (loss of pleasure in daily life).'
          ],
          [
            'Loss of Self-Control',
            'Weakening of the connection with the prefrontal cortex, destroying impulse control and willpower.'
          ]
        ]
      },
      es: {
        t: 'Remodelación Frontoestriatal (Daño Cerebral)',
        pts: [
          [
            'Atrofia Cerebral',
            'Estudios de neuroimagen del Instituto Max Planck revelan disminución de masa gris en el estriado derecho (núcleo caudado).',
            'Ref: Kühn & Gallinat, 2014'
          ],
          [
            'Dessensibilización de Dopamina',
            'Menor reactividad en el putamen, generando tolerancia neuroquímica y anhedonia (pérdida del placer cotidiano).'
          ],
          [
            'Pérdida del Autocontrol',
            'Debilitamiento de la conexión con la corteza prefrontal, destruyendo el control de impulsos y la fuerza de voluntad.'
          ]
        ]
      }
    },
    grip: {
      en: {
        t: 'Peripheral Sensitivity & Death Grip Syndrome',
        pts: [
          [
            'What it is',
            'Injury and desensitization caused by excessive mechanical force, high speed or friction without proper lubrication.'
          ],
          [
            'Consequence',
            'Raised sensitivity threshold of the penile receptors, resulting in delayed ejaculation, anorgasmia with a partner or paresthesia (genital numbness).',
            'Ref: ISSM — International Society for Sexual Medicine'
          ]
        ]
      },
      es: {
        t: 'Sensibilidad Periférica y Síndrome del Death Grip',
        pts: [
          [
            'Qué es',
            'Lesión y dessensibilización causadas por fuerza mecánica excesiva, alta velocidad o fricción sin lubricación adecuada.'
          ],
          [
            'Consecuencia',
            'Elevación del umbral de sensibilidad de los receptores peneanos, resultando en eyaculación retardada, anorgasmia con la pareja o parestesia (sensación de adormecimiento genital).',
            'Ref: ISSM — International Society for Sexual Medicine'
          ]
        ]
      }
    },
    pelvic: {
      en: {
        t: 'Pelvic Hypertonia from Compulsive Masturbation',
        pts: [
          [
            'Cause',
            'Prolonged masturbation under pornography stimulus, keeping the pelvic floor muscles under continuous anxious tension and contraction for hours.'
          ],
          [
            '⚠ SEMINAL RETENTION NOTE',
            'This condition does NOT apply to Conscious Seminal Retention. In the practice of Seminal Retention and Transmutation, the man learns to relax the pelvic muscles and channel his energy in a healthy way. The muscle damage occurs only in the anxious tension state generated by compulsive pornography consumption.',
            true
          ],
          [
            'Consequences',
            'Pelvic floor spasms, perineal pain, weak urinary stream and "Rigid Flaccid Syndrome" (Hard Flaccid), caused by the involuntary, prolonged contraction during the visual addiction.',
            'Ref: Cleveland Clinic, 2022'
          ]
        ]
      },
      es: {
        t: 'Hipertonía Pélvica por Masturbación Compulsiva',
        pts: [
          [
            'Causa',
            'Práctica de masturbación prolongada bajo estímulo de pornografía, donde el individuo mantiene la musculatura del suelo pélvico bajo tensión y contracción ansiosa continua por horas.'
          ],
          [
            '⚠ NOTA DE RETENCIÓN SEMINAL',
            'Esta condición NO aplica a la Retención Seminal Consciente. En la práctica de la Retención Seminal y Transmutación, el hombre aprende a relajar la musculatura pélvica y canalizar su energía de forma saludable. El daño muscular ocurre solo en el estado de tensión ansiosa generado por el consumo compulsivo de pornografía.',
            true
          ],
          [
            'Consecuencias',
            'Espasmos en el suelo pélvico, dolores perineales, chorro urinario débil y el "Síndrome del Flácido Rígido" (Hard Flaccid), provocados por la contracción involuntaria y prolongada durante el vicio visual.',
            'Ref: Cleveland Clinic, 2022'
          ]
        ]
      }
    },
    escalation: {
      en: {
        t: 'The Escalation to Extreme Content and Deviations',
        pts: [
          [
            'Habituation Mechanism',
            'As the brain gets used to conventional content, neurochemical tolerance sets in. The individual starts needing increasingly shocking, exotic, taboo or extreme stimuli to get the same dopamine charge once obtained easily.'
          ],
          [
            'Loss of the Inhibitory Brake',
            'The weakening of the prefrontal cortex degrades the moral inhibitory brake, paving the way for deviations once considered unacceptable.'
          ]
        ]
      },
      es: {
        t: 'La Escalada hacia Contenidos y Desviaciones Extremas',
        pts: [
          [
            'Mecanismo de Habituación',
            'A medida que el cerebro se acostumbra al consumo de contenidos convencionales, ocurre la tolerancia neuroquímica. El individuo pasa a necesitar estímulos cada vez más impactantes, exóticos, tabúes o extremos para obtener la misma carga de dopamina que antes conseguía fácilmente.'
          ],
          [
            'Pérdida del Freno Inhibitorio',
            'El debilitamiento de la corteza prefrontal degrada el freno inhibitorio moral, abriendo camino a desviaciones antes consideradas inaceptables.'
          ]
        ]
      }
    },
    social: {
      en: {
        t: 'Social, Moral and Marital Erosion',
        pts: [
          [
            'Moral Dissonance',
            'Chronic guilt, secret shame and social anxiety erode self-image and presence in the real world.'
          ],
          [
            'Intimacy Avoidance',
            'Marital withdrawal, isolation and replacement of the real bond with solitary screen stimulation.'
          ]
        ]
      },
      es: {
        t: 'Erosión Social, Moral y Conyugal',
        pts: [
          [
            'Disonancia Moral',
            'Culpa crónica, vergüenza secreta y ansiedad social corroen la autoimagen y la presencia en el mundo real.'
          ],
          [
            'Esquiva de la Intimidad',
            'Alejamiento conyugal, aislamiento y sustitución del vínculo real por el estímulo solitario de pantalla.'
          ]
        ]
      }
    }
  },

  table: {
    en: [
      ['Erectile Function', 'PIED', 'Failure with a real partner / Erection only on screen'],
      ['Brain', 'Frontostriatal Remodeling', 'Anhedonia, lack of focus and caudate nucleus atrophy'],
      ['Sensitivity', 'Death Grip', 'Genital numbness and delayed ejaculation'],
      ['Pelvic Muscle', 'Hard Flaccid / Hypertonia', 'Perineal pain and retracted/cold penis at rest'],
      ['Mental Health', 'Moral Dissonance', 'Chronic guilt, shame and social anxiety'],
      ['Relationships', 'Intimacy Avoidance', 'Marital withdrawal and social isolation']
    ],
    es: [
      ['Función Eréctil', 'DEIP', 'Fallo con pareja real / Erección solo con pantallas'],
      [
        'Cerebro',
        'Remodelación Frontoestriatal',
        'Anhedonia, falta de foco y atrofia en el núcleo caudado'
      ],
      ['Sensibilidad', 'Death Grip', 'Adormecimiento genital y eyaculación retardada'],
      ['Músculo Pélvico', 'Hard Flaccid / Hipertonía', 'Dolor perineal y pene retraído/frío en reposo'],
      ['Salud Mental', 'Disonancia Moral', 'Culpa crónica, vergüenza y ansiedad social'],
      ['Relaciones', 'Esquiva de la Intimidad', 'Alejamiento conyugal y aislamiento social']
    ]
  },

  sos: {
    en: {
      phrases: [
        'DON\'T TRADE YOUR EMPIRE FOR 5 SECONDS OF PLEASURE!',
        'YOU ARE THE COMMANDER OF THIS MIND. RESIST!',
        'THE PAIN OF DISCIPLINE IS LESS THAN THE PAIN OF REGRET!',
        'BREAK THE TRANCE NOW, YOU ARE STRONGER THAN THIS!',
        'THE URGE IS FLEETING. HONOR IS PERMANENT!',
        'DO NOT NEGOTIATE WITH YOUR WEAKNESS. RISE AND FIGHT!'
      ],
      phases: [
        { t: 'PHASE 1 — COLD SHOCK', w: 'MINUTE 0–1', d: 'Ice-cold water on face and wrists immediately.' },
        { t: 'PHASE 2 — TACTICAL 4×4 BREATHING', w: 'MINUTES 1–3', d: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.' },
        {
          t: 'PHASE 3 — FULL PHYSICAL EXHAUSTION',
          w: 'MINUTES 3–5',
          d: '2 uninterrupted minutes of intense exercise until physical pain and elevated heart rate.'
        }
      ],
      ex: ['💪 Push-ups', '⭐ Jumping jacks', '🦵 Squats', '🏃 Sprint / running in place']
    },
    es: {
      phrases: [
        '¡NO CAMBIES TU IMPERIO POR 5 SEGUNDOS DE PLACER!',
        '¡ERES EL COMANDANTE DE ESTA MENTE. RESISTE!',
        '¡EL DOLOR DE LA DISCIPLINA ES MENOR QUE EL DOLOR DEL ARREPENTIMIENTO!',
        '¡SAL DEL TRANCE AHORA, ERES MÁS FUERTE QUE ESTO!',
        '¡EL IMPULSO ES PASAJERO. EL HONOR ES PERMANENTE!',
        '¡NO NEGOCIES CON TU DEBILIDAD. LEVÁNTATE Y LUCHA!'
      ],
      phases: [
        { t: 'FASE 1 — CHOQUE TÉRMICO', w: 'MINUTO 0–1', d: 'Agua helada en la cara y las muñecas de inmediato.' },
        { t: 'FASE 2 — RESPIRACIÓN TÁCTICA 4×4', w: 'MINUTOS 1–3', d: 'Inhala 4s, retén 4s, exhala 4s, retén 4s.' },
        {
          t: 'FASE 3 — AGOTAMIENTO FÍSICO TOTAL',
          w: 'MINUTOS 3–5',
          d: '2 minutos ininterrumpidos de ejercicio intenso hasta el dolor físico y las pulsaciones elevadas.'
        }
      ],
      ex: ['💪 Flexiones', '⭐ Saltos de tijera', '🦵 Sentadillas', '🏃 Carrera rápida / en el sitio']
    }
  },

  breath: {
    en: {
      PRONTO: 'READY',
      INALE: 'BREATHE IN',
      SEGURE: 'HOLD',
      EXALE: 'BREATHE OUT',
      'SEGURE (VAZIO)': 'HOLD (EMPTY)',
      'EXALE LENTO': 'BREATHE OUT SLOWLY'
    },
    es: {
      PRONTO: 'LISTO',
      INALE: 'INHALA',
      SEGURE: 'RETÉN',
      EXALE: 'EXHALA',
      'SEGURE (VAZIO)': 'RETÉN (VACÍO)',
      'EXALE LENTO': 'EXHALA LENTO'
    }
  },

  /* ============ i18n ETAPA 4 — TELAS: stats, forge, S.O.S, inimigo, parceiro, legais ============ */
  stats: {
    kpi_clean: { en: 'Clean sequence', es: 'Secuencia limpia' },
    kpi_streak: { en: 'Current streak', es: 'Racha actual' },
    kpi_best: { en: 'Best streak', es: 'Mejor racha' },
    kpi_purity: { en: 'Purity score', es: 'Puntuación de pureza' },
    kpi_okdays: { en: 'Full-pillar days', es: 'Días de pilares completos' },
    kpi_forge: { en: 'Habits forged', es: 'Hábitos forjados' },
    kpi_sos: { en: 'S.O.S triggered', es: 'S.O.S activados' },
    kpi_sosw: { en: 'S.O.S wins', es: 'S.O.S vencidas' },
    map_k: { en: 'MAP — ', es: 'MAPA — ' },
    locale: { en: 'en-US', es: 'es-ES' },
    wd0: { en: 'S', es: 'D' },
    wd1: { en: 'M', es: 'L' },
    wd2: { en: 'T', es: 'M' },
    wd3: { en: 'W', es: 'X' },
    wd4: { en: 'T', es: 'J' },
    wd5: { en: 'F', es: 'V' },
    wd6: { en: 'S', es: 'S' },
    lg1: { en: '1 pillar', es: '1 pilar' },
    lg2: { en: '2 pillars', es: '2 pilares' },
    lg3: { en: 'complete', es: 'completo' },
    lgf: { en: 'fall', es: 'caída' },
    lgn: { en: 'no log', es: 'sin registro' },
    cons_k: { en: '🔨 FORGE CONSISTENCY — CURRENT MONTH', es: '🔨 CONSISTENCIA DE LA FORJA — MES ACTUAL' },
    cons_empty: { en: 'Activate habits in the Forge to measure consistency.', es: 'Activa hábitos en la Forja para medir la consistencia.' },
    wk_k: { en: '📜 WEEKLY WAR REPORT (LAST 7 DAYS)', es: '📜 INFORME SEMANAL DE GUERRA (ÚLTIMOS 7 DÍAS)' },
    wk_share: { en: 'SHARE IMAGE', es: 'COMPARTIR IMAGEN' },
    wk_wins: { en: 'Wins', es: 'Victorias' },
    wk_falls: { en: 'Falls', es: 'Caídas' },
    wk_cons: { en: 'Forge Consistency', es: 'Consistencia Forja' },
    wk_sos: { en: 'S.O.S wins', es: 'S.O.S vencidas' },
    wk_part: { en: 'Partials: ', es: 'Parciales: ' },
    wk_none: { en: 'No log: ', es: 'Sin registro: ' },
    wk_pur: { en: 'Current purity: ', es: 'Pureza actual: ' },
    wk_st: { en: 'Streak: ', es: 'Racha: ' },
    wk_hab: { en: 'Habits completed: ', es: 'Hábitos completados: ' },
    wk_push: { en: ' Every Sunday you get a push telling you the report is ready.', es: ' Cada domingo recibes un push avisando que el informe está listo.' },
    cv2: { en: 'WEEKLY WAR REPORT', es: 'INFORME SEMANAL DE GUERRA' },
    cv_to: { en: ' to ', es: ' a ' },
    cv_days: { en: ' DAYS', es: ' DÍAS' },
    cv_wins: { en: ' wins', es: ' victorias' },
    cv_falls: { en: ' falls', es: ' caídas' },
    cv_streak: { en: 'streak', es: 'racha' },
    cv_purity: { en: 'purity', es: 'pureza' },
    cv_cons: { en: 'consistency', es: 'consistencia' },
    cv_motto: { en: 'The urge is fleeting. Honor is permanent.', es: 'El impulso es pasajero. El honor es permanente.' },
    cv_foot: { en: 'forjandoguerreiros · anonymous report', es: 'forjandoguerreiros · reporte anónimo' },
    cv_file: { en: 'forjando-guerreiros-war-report.png', es: 'informe-de-guerra-forjando-guerreiros.png' },
    cv_sharetitle: { en: 'Weekly War Report', es: 'Informe Semanal de Guerra' },
    risk_k: { en: 'RISK MAP BY HOUR', es: 'MAPA DE RIESGO POR HORARIO' },
    risk_reg: { en: ' log(s)', es: ' registro(s)' },
    risk_win: { en: '🎯 Your risk window: ', es: '🎯 Tu ventana de riesgo: ' },
    risk_note: { en: ' urge(s) logged in the S.O.S. Reinforce your defenses (habits, environment, phone out of the bedroom) in this window.', es: ' impulso(s) registrado(s) en el S.O.S. Refuerza tus defensas (hábitos, entorno, celular fuera del cuarto) en esa ventana.' },
    risk_e1: { en: 'Trigger the S.O.S and log the urge intensity (1–10).', es: 'Activa el S.O.S y registra la intensidad del impulso (1–10).' },
    risk_e2: { en: 'With a few logs, your risk map by hour appears here.', es: 'Con algunos registros, tu mapa de riesgo por horario aparece aquí.' },
    hall_k: { en: 'ANONYMOUS HALL OF FAME', es: 'SALÓN DE LA FAMA ANÓNIMO' },
    loading: { en: 'Loading...', es: 'Cargando...' },
    you: { en: '(you)', es: '(tú)' },
    ord: { en: '', es: 'º' },
    hall_e1: { en: 'No warrior has joined the Hall yet.', es: 'Ningún guerrero ha entrado al Salón aún.' },
    hall_e2: { en: 'Enable it in Settings to join the anonymous ranking.', es: 'Actívalo en Ajustes para entrar al ranking anónimo.' },
    hall_note: { en: 'Optional ranking with pseudonyms — no names, no emails, no photos. Just days and tier.', es: 'Ranking opcional con seudónimos — sin nombres, sin correos, sin fotos. Solo días y patamar.' },
    sos_k: { en: 'HISTORY OF S.O.S INTERVENTIONS WON', es: 'HISTORIAL DE INTERVENCIONES S.O.S VENCIDAS' },
    sos_item: { en: '🛡️ S.O.S Intervention Won', es: '🛡️ Intervención S.O.S Vencida' },
    sos_e1: { en: 'No S.O.S intervention won yet.', es: 'Ninguna intervención S.O.S vencida aún.' },
    sos_e2: { en: 'When you complete an emergency protocol, the log appears here with date and time.', es: 'Cuando completes un protocolo de emergencia, el registro aparece aquí con fecha y hora.' },
  },

  forge: {
    t_removed: { en: 'Habit removed from the protocol.', es: 'Hábito eliminado del protocolo.' },
    t_limit1: { en: '🔒 Slot limit reached (', es: '🔒 Límite de slots alcanzado (' },
    t_limit2: { en: '). Advance through the tiers to unlock more.', es: '). Avanza en los patamares para desbloquear más.' },
    t_act: { en: '🔨 Habit activated in the Forge.', es: '🔨 Hábito activado en la Forja.' },
    m_edit: { en: '✏️ EDIT CUSTOM HABIT', es: '✏️ EDITAR HÁBITO PERSONALIZADO' },
    m_new: { en: '🛠 FORGE NEW HABIT', es: '🛠 FORJAR NUEVO HÁBITO' },
    m_icon: { en: 'Habit icon — pick one or type another', es: 'Ícono del hábito — elige uno o escribe otro' },
    m_iconph: { en: 'Or type an emoji...', es: 'O escribe un emoji...' },
    m_name: { en: 'Habit name *', es: 'Nombre del hábito *' },
    m_nameph: { en: 'E.g.: Cold Shower 5min', es: 'Ej.: Ducha Fría 5min' },
    m_imp: { en: 'Physiological / mental impact', es: 'Impacto fisiológico / mental' },
    m_impph: { en: 'What this habit does for your body and mind...', es: 'Lo que este hábito hace por tu cuerpo y mente...' },
    m_prot: { en: 'How it protects the 3 pillars', es: 'Cómo protege los 3 pilares' },
    m_protph: { en: 'How it kills the urge / shields retention...', es: 'Cómo mata el impulso / blinda la retención...' },
    m_errname: { en: '⚠ Give the habit a name.', es: '⚠ Dale un nombre al hábito.' },
    m_ok: { en: '🛠 Habit forged.', es: '🛠 Hábito forjado.' },
    m_save: { en: 'SAVE', es: 'GUARDAR' },
    m_forge: { en: 'FORGE HABIT', es: 'FORJAR HÁBITO' },
    m_cancel: { en: 'Cancel', es: 'Cancelar' },
    m_note: { en: 'Custom habits follow the same slot-release rule of your tier.', es: 'Los hábitos personalizados siguen la misma regla de liberación de slots de tu patamar.' },
    c_custom: { en: '★ CUSTOM', es: '★ PERSONALIZADO' },
    c_proto: { en: '· IN PROTOCOL', es: '· EN PROTOCOLO' },
    c_res: { en: '· RESERVE', es: '· RESERVA' },
    c_edit: { en: 'Edit habit', es: 'Editar hábito' },
    c_del: { en: 'Delete habit', es: 'Excluir hábito' },
    c_delq: { en: 'DELETE HABIT?', es: '¿ELIMINAR HÁBITO?' },
    c_delm: { en: '" will be removed from the Forge.', es: '" será eliminado de la Forja.' },
    c_done: { en: 'Completed today', es: 'Completado hoy' },
    c_time: { en: 'Time (empty = free)', es: 'Horario (vacío = libre)' },
    c_failtoast: { en: '❌ Habit failure logged. Tomorrow there is a rematch.', es: '❌ Fallo registrado en el hábito. Mañana hay revancha.' },
    c_undone: { en: 'Failure unmarked. There is still time today.', es: 'Fallo desmarcado. Aún hay tiempo hoy.' },
    c_failed: { en: 'FAILED TODAY', es: 'FALLÓ HOY' },
    c_fail: { en: 'I FAILED', es: 'FALLÉ' },
    missw: { en: ' day(s) without doing it', es: ' día(s) sin hacerlo' },
    c_hist: { en: 'Last 7 days history', es: 'Historial de los últimos 7 días' },
    ws_done: { en: 'DONE', es: 'HECHO' },
    ws_fail: { en: 'FAILED', es: 'FALLÓ' },
    ws_none: { en: 'no log', es: 'sin registro' },
    ws_hint: { en: 'Tap a day: no log → ✅ DONE → ❌ FAILED → no log.', es: 'Toca un día: sin registro → ✅ HECHO → ❌ FALLÓ → sin registro.' },
    c_ben: { en: 'See Benefits & Protection', es: 'Ver Beneficios y Protección' },
    c_imp: { en: 'Impact:', es: 'Impacto:' },
    c_pro: { en: '🛡 Protection:', es: '🛡 Protección:' },
    rule_k: { en: 'UNLOCK RULE BY TIER', es: 'REGLA DE DESBLOQUEO POR PATAMAR' },
    hab_w: { en: ' habits', es: ' hábitos' },
    create: { en: 'CREATE HABIT', es: 'CREAR HÁBITO' },
    warn_k: { en: '⚠ NEGLIGENCE ALERT — THE FORGE IS COOLING', es: '⚠ ALERTA DE NEGLIGENCIA — LA FORJA SE ENFRÍA' },
    warn_note: { en: 'A warrior who vanishes from training becomes a statistic. Get back TODAY.', es: 'El guerrero que desaparece del entrenamiento se vuelve estadística. Retoma HOY.' },
    act_k: { en: '⚡ ACTIVE IN PROTOCOL — ', es: '⚡ ACTIVOS EN PROTOCOLO — ' },
    res_k: { en: '🗃 FORGE RESERVE — ', es: '🗃 RESERVA DE LA FORJA — ' },
  },

  sosui: {
    title: { en: 'EMERGENCY INTERVENTION PROTOCOL', es: 'PROTOCOLO DE INTERVENCIÓN DE EMERGENCIA' },
    desc: { en: 'Compact 5-minute sequential protocol: one phase at a time, continuous flow without pause. The timer advances on its own — or skip ahead whenever you want.', es: 'Protocolo secuencial compacto de 5 minutos: una fase a la vez, flujo continuo sin pausa. El cronómetro avanza solo — o adelanta la fase cuando quieras.' },
    relieved: { en: 'I ALREADY RELIEVED THE TENSION', es: 'YA ALIVIÉ LA TENSIÓN' },
    cool: { en: 'DOPAMINERGIC COOLDOWN', es: 'ENFRIAMIENTO DOPAMINÉRGICO' },
    ready_lbl: { en: 'READY · 3 SEQUENTIAL PHASES · 5 MIN', es: 'LISTO · 3 FASES SECUENCIALES · 5 MIN' },
    done_lbl: { en: '⚔ PROTOCOL COMPLETE — HONOR VALIDATION', es: '⚔ PROTOCOLO CONCLUIDO — VALIDACIÓN DE HONOR' },
    phase_lbl: { en: 'PHASE ', es: 'FASE ' },
    phase_of: { en: ' OF 3 · ', es: ' DE 3 · ' },
    toast_done: { en: '🛡️ Protocol complete. Validate your victory honestly.', es: '🛡️ Protocolo concluido. Valida tu victoria con sinceridad.' },
    toast_win: { en: '🛡️ VICTORY SAVED! Log recorded with date and time.', es: '🛡️ ¡VICTORIA GUARDADA! Registro grabado con fecha y hora.' },
    honor: { en: '🛡️ HONOR VALIDATION', es: '🛡️ VALIDACIÓN DE HONOR' },
    hon_q1: { en: 'Did you really manage to relieve yourself? ', es: '¿De verdad lograste aliviarte? ' },
    hon_q2: { en: 'Be honest with yourself.', es: 'Sé sincero contigo mismo.' },
    hon_no1: { en: 'If you did ', es: 'Si ' },
    hon_no2: { en: 'NOT', es: 'NO' },
    hon_no3: { en: ' manage to, leave that room ', es: ' lograste, sal de esa habitación ' },
    hon_no4: { en: 'NOW', es: 'AHORA' },
    hon_no5: { en: ' and go outside for some air.', es: ' y sal a la calle a tomar aire.' },
    hon_yes1: { en: 'If you ', es: 'Si ' },
    hon_yes2: { en: 'DID', es: 'LO LOGRASTE' },
    hon_yes3: { en: ', congratulations! You won today\'s battle. ', es: ', ¡felicidades! Ganaste la batalla de hoy. ' },
    hon_yes4: { en: 'Protocol Completed Successfully!', es: '¡Protocolo Completado con Éxito!' },
    save_win: { en: 'SAVE AND CONFIRM VICTORY', es: 'GUARDAR Y CONFIRMAR VICTORIA' },
    f1_p1: { en: 'The cold triggers noradrenaline and cuts the urge trance instantly. ', es: 'El frío dispara la noradrenalina y corta el trance del impulso al instante. ' },
    f1_p2: { en: 'Ice-cold water on face and wrists immediately.', es: 'Agua helada en la cara y las muñecas de inmediato.' },
    f1_l1a: { en: 'Get up and go to the sink or shower ', es: 'Levántate y ve al lavabo o a la ducha ' },
    f1_l1b: { en: 'now', es: 'ahora' },
    f1_l1c: { en: ' — don\'t think, just move your body.', es: ' — no pienses, solo mueve el cuerpo.' },
    f1_l2a: { en: 'Ice-cold water on face and wrists for ', es: 'Agua helada en la cara y las muñecas durante ' },
    f1_l2b: { en: '30 seconds', es: '30 segundos' },
    f1_l2c: { en: '; if possible, a 100% cold 1-min shower.', es: '; si es posible, ducha 100% fría de 1 min.' },
    f1_l3a: { en: 'Breathe deep and declare out loud: ', es: 'Respira hondo y declara en voz alta: ' },
    f1_l3b: { en: '"I command this body."', es: '"Yo comando este cuerpo."' },
    f2_note1: { en: 'Automatic cycle with sound: inhale 4s · hold 4s · exhale 4s · hold 4s.', es: 'Ciclo automático con sonido: inhala 4s · retén 4s · exhala 4s · retén 4s.' },
    f2_note2: { en: 'Just follow the orb until the end of the phase.', es: 'Solo sigue el orbe hasta el final de la fase.' },
    f3_p1: { en: '2 uninterrupted minutes', es: '2 minutos ininterrumpidos' },
    f3_p2: { en: ' of intense exercise of your choice — until physical pain and elevated heart rate. Blood leaves the mind and goes to the muscle.', es: ' de ejercicio intenso a tu elección — hasta causar dolor físico y elevar las pulsaciones. La sangre sale de la mente y va al músculo.' },
    f3_ex: { en: 'Phase 3 exercise: ', es: 'Ejercicio de la Fase 3: ' },
    f3_choose: { en: 'pick above', es: 'elige arriba' },
    f3_reps: { en: 'ACCUMULATED REPS', es: 'REPETICIONES ACUMULADAS' },
    f3_btn: { en: '+1 REP — COUNT THE EFFORT', es: '+1 REP — CONTAR ESFUERZO' },
    f0_k: { en: 'URGE INTENSITY NOW (1–10)', es: 'INTENSIDAD DEL IMPULSO AHORA (1–10)' },
    f0_note: { en: 'This log feeds your Risk Map by hour in Reports.', es: 'Este registro alimenta tu Mapa de Riesgo por horario en Informes.' },
    start_btn: { en: 'START PROTOCOL (5 MIN)', es: 'INICIAR PROTOCOLO (5 MIN)' },
    adv_btn: { en: 'FINISH PHASE AND ADVANCE', es: 'CONCLUIR FASE Y AVANZAR' },
    crisis1: { en: '💚 In emotional crisis? This tool does not replace therapy. In Brazil call ', es: '💚 ¿En crisis emocional? Esta herramienta no sustituye terapia. En Brasil llama al ' },
    crisis2: { en: ' (CVV, 24h, free) or visit cvv.org.br. Medical emergency: SAMU 192. Outside Brazil, contact your local crisis line.', es: ' (CVV, 24h, gratis) o visita cvv.org.br. Emergencia médica: SAMU 192. Fuera de Brasil, contacta tu línea local de crisis.' },
  },

  enemy: {
    title: { en: '🕳️ THE ENEMY REVEALED: SCIENTIFIC DOSSIER', es: '🕳️ EL ENEMIGO REVELADO: DOSIER CIENTÍFICO' },
    sub: { en: 'The real impact of pornography and compulsive masturbation on body and mind.', es: 'El impacto real de la pornografía y la masturbación compulsiva en el cuerpo y la mente.' },
    tbl_k: { en: '📊 SUMMARY TABLE — 6 AFFECTED AREAS', es: '📊 TABLA RESUMEN — 6 ÁREAS AFECTADAS' },
    th1: { en: 'Area', es: 'Área' },
    th2: { en: 'Condition', es: 'Condición' },
    th3: { en: 'Main Symptom', es: 'Síntoma Principal' },
    note: { en: 'Knowing the enemy is half the victory. The other half is the Forge.', es: 'Conocer al enemigo es la mitad de la victoria. La otra mitad es la Forja.' },
  },

  partner: {
    err_t: { en: 'INVALID OR DISABLED LINK', es: 'ENLACE INVÁLIDO O DESACTIVADO' },
    err_d: { en: 'This accountability card no longer exists.', es: 'Esta tarjeta de responsabilidad ya no existe.' },
    loading: { en: 'LOADING...', es: 'CARGANDO...' },
    k: { en: 'ACCOUNTABILITY CARD', es: 'TARJETA DE RESPONSABILIDAD' },
    days: { en: 'Days of war', es: 'Días de guerra' },
    streak: { en: 'Current streak', es: 'Racha actual' },
    best: { en: 'Best record', es: 'Mejor marca' },
    sos: { en: 'S.O.S wins', es: 'S.O.S vencidas' },
    note: { en: 'Shared voluntarily by the warrior. Nothing beyond these numbers is visible here.', es: 'Compartido voluntariamente por el guerrero. Nada más allá de estos números es visible aquí.' },
    warrior: { en: 'Warrior', es: 'Guerrero' },
  },

  termos: {
    meta: { en: 'Terms of Use — Forjando Guerreiros', es: 'Términos de Uso — Forjando Guerreiros' },
    back: { en: '← Back to start', es: '← Volver al inicio' },
    title: { en: 'TERMS OF USE', es: 'TÉRMINOS DE USO' },
    upd: { en: 'Last updated: September 2026. By creating an account and using the Forjando Guerreiros platform, you agree to these terms.', es: 'Última actualización: septiembre de 2026. Al crear una cuenta y usar la plataforma Forjando Guerreiros, aceptas estos términos.' },
    h1: { en: '1. What the platform is', es: '1. Qué es la plataforma' },
    p1: { en: 'A digital tool for self-discipline, personal logging and habit building (check-ins, habits, journal, reports and the S.O.S emergency protocol). It is not a health service, makes no diagnosis and does not replace therapy or medical/psychological counseling.', es: 'Herramienta digital de autodisciplina, registro personal y formación de hábitos (check-ins, hábitos, diario, informes y protocolo de emergencia S.O.S). No es un servicio de salud, no realiza diagnósticos y no sustituye terapia ni consejo médico o psicológico.' },
    h2: { en: '2. Account and subscription', es: '2. Cuenta y suscripción' },
    p2: { en: 'Access requires an individual account with email and password. New subscribers go through a 7-day trial, after which the current monthly fee shown at checkout is charged (in your local currency). Payment is processed by Stripe; you may cancel at any time and access remains until the end of the period already paid.', es: 'El acceso requiere una cuenta individual con correo y contraseña. Los nuevos suscriptores pasan por un período de prueba de 7 días, tras el cual se cobra la mensualidad vigente mostrada en el checkout (en tu moneda local). El pago lo procesa Stripe; puedes cancelar en cualquier momento y el acceso permanece hasta el final del período ya pagado.' },
    h3: { en: '3. User conduct', es: '3. Conducta del usuario' },
    p3: { en: 'You are responsible for the accuracy of the records you enter and for keeping your password confidential. Reselling access, sharing the account with third parties, using automations to bypass limits or attempting to access other users\' data is prohibited.', es: 'Eres responsable de la veracidad de los registros que ingresas y de mantener la confidencialidad de tu contraseña. Está prohibido revender el acceso, compartir la cuenta con terceros, usar automatizaciones para burlar límites o intentar acceder a datos de otros usuarios.' },
    h4: { en: '4. Content and intellectual property', es: '4. Contenido y propiedad intelectual' },
    p4: { en: 'Texts, names, protocols, visuals and code of the platform are the property of Forjando Guerreiros. Your personal records (journal, check-ins, notes) belong to you and can be exported or deleted by you at any time.', es: 'Los textos, nombres, protocolos, imagen y códigos de la plataforma son propiedad de Forjando Guerreiros. Tus registros personales (diario, check-ins, notas) son de tu propiedad y puedes exportarlos o eliminarlos cuando quieras.' },
    h5: { en: '5. Availability', es: '5. Disponibilidad' },
    p5: { en: 'We make efforts to keep the platform available, but we do not guarantee uninterrupted operation. Maintenance and provider failures (hosting, database, payments) may cause temporary unavailability.', es: 'Hacemos esfuerzos por mantener la plataforma disponible, pero no garantizamos un funcionamiento ininterrumpido. Mantenimientos y fallos de proveedores (alojamiento, base de datos, pagos) pueden causar indisponibilidad temporal.' },
    h6: { en: '6. Limitation of liability', es: '6. Limitación de responsabilidad' },
    p6: { en: 'The platform is not liable for personal decisions made based on the records, nor for relapses, emotional or indirect damages. In a mental-health crisis, seek emergency services or a qualified professional.', es: 'La plataforma no se responsabiliza por decisiones personales tomadas con base en los registros, ni por recaídas, daños emocionales o indirectos. Ante una crisis de salud mental, busca servicios de emergencia o un profesional calificado.' },
    h7: { en: '7. Termination', es: '7. Cierre' },
    p7: { en: 'You can delete your account and all your data in Settings ("Delete my account and data") — which cancels the active subscription and erases profile, records and notification subscriptions. We may suspend accounts that violate these terms.', es: 'Puedes eliminar tu cuenta y todos tus datos desde Ajustes ("Eliminar mi cuenta y datos") — lo que cancela la suscripción activa y borra perfil, registros e inscripciones de notificación. Podemos suspender cuentas que violen estos términos.' },
    h8: { en: '8. Changes to these terms', es: '8. Cambios de estos términos' },
    p8: { en: 'Relevant changes will be announced in the platform or by email at least 15 days in advance. Continued use after that period implies agreement.', es: 'Los cambios relevantes se comunicarán mediante aviso en la plataforma o por correo con al menos 15 días de antelación. El uso continuado después del plazo implica conformidad.' },
    h9: { en: '9. Contact', es: '9. Contacto' },
    p9: { en: 'Questions about these terms: replace this text with your official support email (e.g.: support@yourdomain.com).', es: 'Dudas sobre estos términos: sustituye este texto por tu correo oficial de soporte (ej.: soporte@tudominio.com).' },
  },

  priv: {
    meta: { en: 'Privacy Policy — Forjando Guerreiros', es: 'Política de Privacidad — Forjando Guerreiros' },
    back: { en: '← Back to start', es: '← Volver al inicio' },
    title: { en: 'PRIVACY POLICY', es: 'POLÍTICA DE PRIVACIDAD' },
    upd: { en: 'Last updated: September 2026. This policy explains what data we process, why, and your rights under the Brazilian LGPD (Law 13.709/2018) and, where applicable, equivalent data-protection laws of your country (e.g. GDPR/CCPA).', es: 'Última actualización: septiembre de 2026. Esta política explica qué datos tratamos, por qué y tus derechos según la LGPD brasileña (Ley 13.709/2018) y, cuando aplique, las leyes de protección de datos equivalentes de tu país (p. ej. RGPD/CCPA).' },
    h1: { en: '1. Data we collect', es: '1. Datos que recopilamos' },
    p1: { en: '(a) Registration: email and password (hashed by the authentication provider). (b) Usage data provided by you: pillar check-ins, habits, tasks, journal, notes, S.O.S protocol logs and settings. (c) Technical: session identifiers and, if you enable notifications, a browser push token. (d) Billing: managed exclusively by Stripe (the app never receives or stores card numbers).', es: '(a) Registrales: correo y contraseña (cifrada por el proveedor de autenticación). (b) De uso, proporcionados por ti: check-ins de los pilares, hábitos, tareas, diario, notas, registros del protocolo S.O.S y ajustes. (c) Técnicos: identificadores de sesión y, si activas notificaciones, un token push del navegador. (d) De cobro: gestionados exclusivamente por Stripe (la aplicación nunca recibe ni almacena números de tarjeta).' },
    h2: { en: '2. Purposes and legal basis', es: '2. Finalidades y base legal' },
    p2: { en: 'Performance of the contract (providing the platform), regular exercise of rights and, where applicable, your consent (e.g. push notifications, which can be disabled at any time). We do not use your data for third-party advertising nor sell it.', es: 'Ejecución del contrato (prestar la plataforma), ejercicio regular de derechos y, cuando aplique, tu consentimiento (p. ej. notificaciones push, que puedes desactivar cuando quieras). No usamos tus datos para publicidad de terceros ni los vendemos.' },
    h3: { en: '3. Where the data is stored', es: '3. Dónde se alojan los datos' },
    p3: { en: 'Supabase database hosted in the São Paulo region (Brazil), encrypted in transit and at rest, with row-level security (RLS): each user sees only their own data. Payments: Stripe infrastructure (PCI-DSS level 1).', es: 'Base de datos Supabase alojada en la región de São Paulo (Brasil), con cifrado en tránsito y en reposo y control de acceso por fila (RLS): cada usuario ve solo sus propios datos. Pagos: infraestructura Stripe (PCI-DSS nivel 1).' },
    h4: { en: '4. Sharing', es: '4. Compartición' },
    p4: { en: 'Only with essential operators: Supabase (database/auth), Vercel (hosting/functions), Stripe (payments) and the transactional email provider, if enabled. No other sharing except legal obligation.', es: 'Solo con operadores esenciales: Supabase (base de datos/autenticación), Vercel (alojamiento/funciones), Stripe (pagos) y el proveedor de correo transaccional, si está habilitado. Ningún otro intercambio, salvo obligación legal.' },
    h5: { en: '5. Retention and deletion', es: '5. Retención y eliminación' },
    p5: { en: 'Your records remain while the account exists. You can (a) export everything as JSON in Settings and (b) permanently delete the account and data with the "Delete my account and data" button, which cancels the subscription and erases profile, records and push tokens. Security backups are rotated within 30 days.', es: 'Tus registros permanecen mientras exista la cuenta. Puedes (a) exportar todo en JSON desde Ajustes y (b) eliminar definitivamente la cuenta y los datos con el botón "Eliminar mi cuenta y datos", que cancela la suscripción y borra perfil, registros y tokens push. Las copias de seguridad se rotan en hasta 30 días.' },
    h6: { en: '6. Notifications', es: '6. Notificaciones' },
    p6: { en: 'Only with your explicit browser permission. You can disable them in Settings or through your operating system/browser options.', es: 'Solo con tu permiso explícito del navegador. Puedes desactivarlas en Ajustes o desde las opciones del propio sistema operativo/navegador.' },
    h7: { en: '7. Your rights (LGPD art. 18 / GDPR equivalents)', es: '7. Tus derechos (LGPD art. 18 / equivalentes RGPD)' },
    p7: { en: 'Confirmation of processing, access, correction, anonymization, portability (JSON export), deletion, information about sharing and revocation of consent — exercised through Settings or the contact channel below.', es: 'Confirmación del tratamiento, acceso, corrección, anonimización, portabilidad (exportación JSON), supresión, información sobre el intercambio y revocación del consentimiento — ejercidos desde Ajustes o por el canal de contacto de abajo.' },
    h8: { en: '8. Security', es: '8. Seguridad' },
    p8: { en: 'Passwords hashed at the authentication provider; secret keys only on the server; HTTPS communications; row-level access policies in the database. No system is 100% immune: in a relevant incident we will notify you and the national authority (ANPD).', es: 'Contraseñas con hash en el proveedor de autenticación; claves secretas solo en el servidor; comunicaciones HTTPS; políticas de acceso por fila en la base de datos. Ningún sistema es 100% inmune: ante un incidente relevante te avisaremos a ti y a la autoridad nacional (ANPD).' },
    h9: { en: '9. Minors', es: '9. Menores de edad' },
    p9: { en: 'The platform is intended for people over 18. We do not knowingly collect data from minors; if identified, it will be deleted.', es: 'La plataforma está destinada a mayores de 18 años. No recopilamos deliberadamente datos de menores; si se identifican, serán eliminados.' },
    h10: { en: '10. Data protection officer contact (DPO)', es: '10. Contacto del responsable (DPO)' },
    p10: { en: 'Replace this text with the official privacy email (e.g.: privacidade@seudominio.com). We will respond within 15 days, per LGPD.', es: 'Sustituye este texto por el correo oficial de privacidad (ej.: privacidade@seudominio.com). Responderemos en hasta 15 días, conforme a la LGPD.' },
  },

};

export const cx = (lang, cat, id) =>
  (lang && lang !== 'pt' && CONTENT[cat] && CONTENT[cat][id] && CONTENT[cat][id][lang]) || null;

/* ============ HELPERS cx* (Etapas 4-hotfix): traduzem com fallback PT seguro ============ */
export const cxHab = (lang, h) =>
  (lang && lang !== 'pt' && CONTENT.hab && CONTENT.hab[h && h.id] && CONTENT.hab[h.id][lang]) || h;
export const cxHabits = (lang, list) =>
  (Array.isArray(list) ? list : []).map((h) => cxHab(lang, h));
export const cxTiers = (lang, tiers) => {
  const tr = lang && lang !== 'pt' && CONTENT.tiers && CONTENT.tiers[lang];
  if (!tr) return tiers;
  return (tiers || []).map((x, i) => (tr[i] ? { ...x, ...tr[i] } : x));
};
export const cxDossier = (lang, list) =>
  (Array.isArray(list) ? list : []).map((d) => {
    const tr = lang && lang !== 'pt' && CONTENT.dos && CONTENT.dos[d && d.id] && CONTENT.dos[d.id][lang];
    return tr ? { ...d, ...tr } : d;
  });
export const cxTable = (lang, rows) =>
  (lang && lang !== 'pt' && CONTENT.table && CONTENT.table[lang]) || rows;
export const cxSos = (lang, o) => {
  const tr = lang && lang !== 'pt' && CONTENT.sos && CONTENT.sos[lang];
  if (!tr) return o;
  return {
    phrases: tr.phrases || o.phrases,
    phases: (o.phases || []).map((p, i) => (tr.phases && tr.phases[i] ? { ...p, ...tr.phases[i] } : p)),
    ex: tr.ex || o.ex,
  };
};
export const cxQuotes = (lang, quotes) =>
  (lang && lang !== 'pt' && CONTENT.quotes && CONTENT.quotes[lang]) || quotes;
export const cxBreath = (lang, label) =>
  (lang && lang !== 'pt' && CONTENT.breath && CONTENT.breath[lang] && CONTENT.breath[lang][label]) || label;
