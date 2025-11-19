export type Station = {
  name: string;
  id: string;
  status: "OK" | "WARN" | "DELAY";
  message: string;
};
