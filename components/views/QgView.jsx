/* COMPONENTE DO MODAL DE QUEDA BLINDADO COM DIGITAÇÃO E O NOVO GATILHO */
function FallModalContent({ streakDays, onSave, onClose }) {
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [desabafo, setDesabafo] = useState('');

  const TRIGGERS = [
    { id: 'chat_mulheres', label: '💬 Conversas Imundas / Sexting' },
    { id: 'tedio', label: '🥱 Tédio e tempo ocioso' },
    { id: 'ansiedade', label: '⚡ Ansiedade / Estresse' },
    { id: 'reels', label: '📱 Redes sociais / Reels / TikTok' },
    { id: 'solidao', label: '🌙 Solidão / Madrugada no celular' },
    { id: 'cansaco', label: '🧠 Cansaço mental / Fuga' },
    { id: 'cama', label: '🛏️ Enrolando na cama ao acordar' },
    { id: 'álcool', label: '🍺 Álcool / Balada / Desinibição' },
  ];

  const toggleTrigger = (id) => {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="text-left relative z-50">
      <div className="text-center mb-3">
        <h3 className="font-display text-2xl tracking-wide text-danger flex items-center justify-center gap-2">
          <span>⚔️</span> QUEDA REGISTRADA
        </h3>
        <p className="text-xs text-muted">Pornografia + Masturbação + Ejaculação</p>
      </div>

      {/* Protocolo de Retomada */}
      <div className="p-3 rounded border border-gold/40 bg-surface/90 mb-3.5 text-xs text-ink space-y-1">
        <span className="font-mono text-gold font-bold uppercase block mb-1">
          PROTOCOLO DE RETOMADA IMEDIATA:
        </span>
        <p>1. Saia do ambiente do gatilho <b>AGORA</b>.</p>
        <p>2. Lave o rosto e pulsos com água gelada.</p>
        <p>3. Pague 20 flexões ou caminhe 10 minutos sem fones.</p>
        <p>4. Registre os gatilhos abaixo — este dossiê vai alimentar os seus Relatórios.</p>
        <p>5. <b>Uma queda não apaga sua honra. Amanhã você volta mais forte.</b></p>
      </div>

      {/* Seletor de Gatilhos com o novo gatilho incluído */}
      <div className="mb-3">
        <span className="text-[10.5px] font-mono text-danger font-bold uppercase block mb-1.5 text-center">
          GATILHOS DO MOMENTO (O QUE TE DERRUBOU?)
        </span>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {TRIGGERS.map((tg) => {
            const isSel = selectedTriggers.includes(tg.id);
            return (
              <button
                key={tg.id}
                type="button"
                onClick={() => toggleTrigger(tg.id)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                  isSel
                    ? 'border-danger bg-danger text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    : 'border-line bg-surface2 text-muted hover:border-danger/40 hover:text-ink'
                }`}
              >
                {tg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campo de Desabafo 100% FUNCIONAL PARA DIGITAÇÃO */}
      <div className="mb-4">
        <span className="lbl mb-1 block">DESABAFO (SEM VERGONHA. SÓ A VERDADE):</span>
        <textarea
          rows={4}
          value={desabafo}
          onChange={(e) => setDesabafo(e.target.value)}
          placeholder="Desabafe aqui, guerreiro. Qual foi o pensamento exato que te convenceu a ceder?..."
          className="field w-full text-xs sm:text-[13px] leading-relaxed resize-none bg-surface border-line focus:border-gold text-ink p-2.5 rounded"
          autoFocus
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            onSave({
              triggers: selectedTriggers,
              desabafo: desabafo.trim(),
              streakInterrupted: streakDays,
            });
          }}
          className="btn-gold py-2.5 text-xs font-bold font-mono shadow-sm flex items-center justify-center gap-2"
        >
          <span>💾 SALVAR NOS RELATÓRIOS & DIÁRIO</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="btn-dark py-2 text-xs font-bold text-muted hover:text-ink font-mono"
        >
          AGORA NÃO
        </button>
      </div>
    </div>
  );
}
