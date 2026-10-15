import { useState, type FormEvent } from "react";
import Dialog from "../../../components/ui/Dialog";
import Icon from "../../../components/ui/Icon";
import { readProfile, saveProfile } from "../model/preferences";

export default function AccountDialog({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState(readProfile);
  const [editing, setEditing] = useState(!profile);
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [feedback, setFeedback] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setFeedback("Informe um nome com pelo menos dois caracteres.");
      return;
    }
    const value = { name: name.trim(), email: email.trim() };
    if (!saveProfile(value)) {
      setFeedback(
        "O navegador bloqueou o armazenamento. Libere o armazenamento da sessão e tente novamente.",
      );
      return;
    }
    setProfile(value);
    setEditing(false);
    setFeedback("Perfil demonstrativo salvo nesta sessão.");
  }
  return (
    <Dialog
      className="shopping-dialog account-dialog"
      titleId="account-title"
      closeLabel="Fechar minha conta"
      onClose={onClose}
    >
      <div className="shopping-dialog__heading">
        <Icon name="user" size={32} />
        <div>
          <h2 id="account-title">Minha conta</h2>
          <p>Seu perfil para explorar a loja.</p>
        </div>
      </div>
      <p className="account-notice">
        Conta demonstrativa, sem autenticação real ou senha. Os dados ficam
        somente nesta sessão do navegador e não são enviados.
      </p>
      {editing ? (
        <form className="account-form" onSubmit={submit}>
          <label>
            Nome
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            E-mail
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
          <button className="primary-button" type="submit">
            Salvar perfil
          </button>
          {profile && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setName(profile.name);
                setEmail(profile.email);
                setEditing(false);
                setFeedback("");
              }}
            >
              Cancelar edição
            </button>
          )}
        </form>
      ) : (
        profile && (
          <div className="account-profile">
            <h3>Olá, {profile.name}!</h3>
            <p>{profile.email}</p>
            <button
              className="primary-button"
              onClick={() => {
                setEditing(true);
                setFeedback("");
              }}
            >
              Editar perfil
            </button>
            <button
              className="text-button"
              onClick={() => {
                if (!saveProfile(null)) {
                  setFeedback(
                    "Não foi possível encerrar o perfil nesta sessão. Tente novamente.",
                  );
                  return;
                }
                setProfile(null);
                setName("");
                setEmail("");
                setEditing(true);
                setFeedback(
                  "Perfil removido desta sessão. Carrinho e favoritos foram mantidos.",
                );
              }}
            >
              Sair do perfil
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
