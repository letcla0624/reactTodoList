export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="d-flex justify-content-center align-items-center mt-2">
      <small className="text-secondary">&copy; {year} 威爾</small>
    </div>
  );
}
