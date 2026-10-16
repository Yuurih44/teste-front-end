export default function Logo() {
  return (
    <img
      className="logo"
      src={`${import.meta.env.BASE_URL}images/logo.png`}
      alt="Econverse"
      width="139"
      height="41"
    />
  );
}
