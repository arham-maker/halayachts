import Link from 'next/link';

const STYLES = {
  container: "min-h-screen flex items-center justify-center bg-black",
  content: "text-center flex flex-col gap-3",
  heading: "text-3xl font-bold text-white",
  message: "text-gray-400 text-white",
  button: "bg-text-primary text-base text-white p-3 w-2xs md:text-base font-medium rounded cursor-pointer hover:bg-opacity-90 transition duration-300"
};

const CONTENT = {
  heading: "Yacht Not Found", 
  buttonText: "Back to All Yachts"
};

export default function YachtError({ slug }) {
  return (
    <div className={STYLES.container}>
      <div className={STYLES.content}>
        <h1 className={STYLES.heading}>{CONTENT.heading}</h1>
        <p className={STYLES.message}>The yacht "{slug}" doesn't exist.</p>
        <Link href="/charter" className={STYLES.button}>
          {CONTENT.buttonText}
        </Link>
      </div>
    </div>
  );
}