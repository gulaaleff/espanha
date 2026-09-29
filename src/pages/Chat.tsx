export function Chat() {
  return (
    <section className="card chat-box" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h3>O chat chega na fase 5</h3>
      <p className="small" style={{ maxWidth: 480 }}>
        Ele vai responder com base nas fontes oficiais cadastradas e nos dados de vocês (documentos, linha do tempo, perfis),
        sempre citando a fonte. A chave da API do Claude fica só no servidor.
      </p>
    </section>
  );
}
