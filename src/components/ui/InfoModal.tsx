import Dialog from "./Dialog";
export default function InfoModal({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <Dialog
      className="info-modal"
      titleId="info-title"
      closeLabel="Fechar informações"
      onClose={onClose}
    >
      <h2 id="info-title">{title}</h2>
      <p>
        Este conteúdo está indisponível no momento. Continue navegando para
        conhecer os produtos disponíveis.
      </p>
      <button className="primary-button" onClick={onClose}>
        Continuar navegando
      </button>
    </Dialog>
  );
}
