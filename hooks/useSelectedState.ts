import { useState } from "react";

export const useSelectedState = () => {
  const [selectedStateId, setSelectedStateId] = useState<string>("");

  return { selectedStateId, setSelectedStateId };
};
