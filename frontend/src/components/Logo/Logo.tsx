interface Props {
  className: string | null;
}

const Logo: React.FC<Props> = ({ className }) => {
  return (
    <>
      <div className={"w-32 h-32 flex flex-col justify-center items-center uppercase" + className}>
        <img src="/images/logo.png" alt="logo" className="w-20 h-20" />
        <p className="text-[#bb2] font-bold py-0.5">WeatherChain</p>
        <p className="text-xs">Insurance</p>
      </div>
    </>
  );
};

export default Logo;
