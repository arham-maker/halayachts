const STYLES = {
  container: "min-h-screen flex items-center justify-center",
  content: "text-center",
  spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto",
  text: "mt-4 text-gray-600"
};

const CONTENT = {
  loadingText: "Loading yacht details..."
};

export default function LoadingSpinner() {
  return (
    <div className={STYLES.container}>
      <div className={STYLES.content}>
        <div className={STYLES.spinner} />
        <p className={STYLES.text}>{CONTENT.loadingText}</p>
      </div>
    </div>
  );
}