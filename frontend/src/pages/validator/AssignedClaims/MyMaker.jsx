const MyMarker = ({ text, tooltip, lat, lng, ...res }) => {
  const handleClick = () => {
    console.log(`You clicked on ${tooltip}`);
  };

  return (
    <div className={"circle hover:bg-[#00f]"} onClick={handleClick} {...res}>
      <span className="circleText" title={tooltip}>
        {text}
      </span>
    </div>
  );
};

export default MyMarker;
