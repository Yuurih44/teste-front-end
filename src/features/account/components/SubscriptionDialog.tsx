import { useState, type FormEvent } from "react";
import Dialog from "../../../components/ui/Dialog";
import Icon from "../../../components/ui/Icon";
import {
  readProfile,
  readSubscription,
  saveSubscription,
  type Subscription,
} from "../model/preferences";

export default function SubscriptionDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [subscription, setSubscription] = useState(readSubscription);
  const [editing, setEditing] = useState(!subscription);
  const [email, setEmail] = useState(
    subscription?.email || readProfile()?.email || "",
  );
  const [frequency, setFrequency] = useState<Subscription["frequency"]>(
    subscription?.frequency || "semanal",
  );
  const [feedback, setFeedback] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = { email: email.trim(), frequency };
    if (!saveSubscription(value)) {
      setFeedback(
        "O navegador bloqueou o armazenamento da sessão. Libere-o e tente novamente.",
      );
      return;
    }
    setSubscription(value);
    setEditing(false);
    setFeedback(
      "Assinatura demonstrativa ativada. Nenhum e-mail foi enviado e não há cobrança.",
    );
  }
  return (
    <Dialog
      className="shopping-dialog account-dialog"
      titleId="subscription-title"
      closeLabel="Fechar assinatura"
      onClose={onClose}
    >
      <div className="shopping-dialog__heading">
        <Icon name="crown" size={32} />
        <div>
          <h2 id="subscription-title">Assinatura</h2>
          <p>Escolha como acompanhar as novidades.</p>
        </div>
      </div>
      <p className="account-notice">
        Demonstração gratuita, sem cobrança ou envio de e-mails. Suas
        preferências ficam apenas nesta sessão do navegador.
      </p>
      {editing ? (
        <form className="account-form" onSubmit={submit}>
          <label>
            E-mail da assinatura
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              pattern={"[^\\s@]+@[^\\s@]+\\.[^\\s@]+"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <div className="account-field">
            <label htmlFor="subscription-frequency">Frequência</label>
            <select
              id="subscription-frequency"
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value as Subscription["frequency"])
              }
            >
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
          <label className="account-consent">
            <input type="checkbox" required />
            Concordo em guardar estas preferências nesta sessão para a
            demonstração.
          </label>
          <button className="primary-button" type="submit">
            Ativar assinatura demonstrativa
          </button>
          {subscription && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setEmail(subscription.email);
                setFrequency(subscription.frequency);
                setEditing(false);
                setFeedback("");
              }}
            >
              Cancelar alterações
            </button>
          )}
        </form>
      ) : (
        subscription && (
          <div className="account-profile">
            <h3>Assinatura demonstrativa ativa</h3>
            <p>{subscription.email}</p>
            <p>Frequência: {subscription.frequency}</p>
            <button
              className="primary-button"
              onClick={() => {
                setEditing(true);
                setFeedback("");
              }}
            >
              Alterar preferências
            </button>
            <button
              className="text-button"
              onClick={() => {
                if (!saveSubscription(null)) {
                  setFeedback("Não foi possível cancelar. Tente novamente.");
                  return;
                }
                setSubscription(null);
                setEditing(true);
                setFeedback("Assinatura demonstrativa cancelada.");
              }}
            >
              Cancelar assinatura
            </button>
          </div>
        )
      )}
      <p className="account-feedback" role="status">
        {feedback}
      </p>
    </Dialog>
  );
}
