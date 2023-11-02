import { InfoWindow, Marker } from "@react-google-maps/api";
import { useState } from "react";

interface Props {
  client: any;
}

const MyMaker: React.FC<Props> = ({ client }) => {
  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(!open);
  return (
    <Marker
      position={{
        lat: client.address.latitude,
        lng: client.address.longitude,
      }}
      title={client.fullname}
      onClick={onToggle}
    >
      {open && (
        <InfoWindow onCloseClick={onToggle}>
          <div className="text-[#000]">
            <p>{client.fullname}</p>
            <p>{client.address.line1}</p>
            <p>{client.address.line2}</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default MyMaker;
