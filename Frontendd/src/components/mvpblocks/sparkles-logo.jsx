import { SparklesCore } from "../ui/sparkles";
import aws from "../../assets/logos/aws.png";
import codingblocks from "../../assets/logos/codingblocks.png";
import codingninja from "../../assets/logos/codingninja.png";
import d4 from "../../assets/logos/d4.jpg";
import encrypted from "../../assets/logos/encrypted.jpg";
import gdg from "../../assets/logos/gdg.jpg";
export default function Page() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div className="mx-auto mt-30 w-screen max-w-2xl">
        <div className="text-center text-3xl text-black">
          <span className="text-rose-600">Trusted by experts.</span>
          <br />
          <span>Used by the leaders.</span>
          <br />
          <br />
        </div>

        <div className="mt-14 grid grid-cols-3 gap-8 md:grid-cols-6 items-center opacity-100">
          <img src={aws} alt="AWS" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
          <img src={codingblocks} alt="Coding Blocks" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
          <img src={codingninja} alt="Coding Ninja" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
          <img src={d4} alt="D4" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
          <img src={encrypted} alt="Encrypted" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
          <img src={gdg} alt="GDG" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>

      <div className="relative -mt-32 h-96 w-screen overflow-hidden [mask-image:radial-gradient(circle,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom,#e60a64,transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#c5769066] after:bg-white">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          particleDensity={300}
          particleColor="#000"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(circle,white,transparent_85%)]"
        />
      </div>
    </div>
  );
}