import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html className="text-xl w-20 text-black" center>
      {progress} %
    </Html>
  );
};

export default Loader;
