export const capitalizeFLetter = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const isContains = (obj: any, filter: string) => {
  if (obj.weather?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.fullname?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.status?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.city?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.validator?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.weatherEventID?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.ID?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.fake?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj._id?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.customer_name?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.address?.line1?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.address?.city?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.url?.toLowerCase().includes(filter.toLowerCase())) return true;
  if (obj.client_name?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.client_address?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.client_name?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.client_address?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.client_name?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  if (obj.client_address?.toLowerCase().includes(filter.toLowerCase()))
    return true;
  return false;
};

export const Filter = (data: any[], filter: string) => {
  return data.filter((item) => isContains(item, filter));
};
