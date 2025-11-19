import type { IconType } from "react-icons/lib";
import { MdErrorOutline, MdOutlineWarningAmber } from "react-icons/md";

interface ErrorCardProps {
  title?: string;
  message: string;
  severity?: "CRITICAL" | "ERROR" | "WARNING";
}

export const ErrorCard = ({
  title,
  message,
  severity = "ERROR",
}: ErrorCardProps) => {
  const severityIconMap: Record<string, IconType> = {
    CRITICAL: MdErrorOutline,
    ERROR: MdErrorOutline,
    WARNING: MdOutlineWarningAmber,
  };

  const Icon = severityIconMap[severity] ?? MdErrorOutline;

  return (
    <div className="p-4 border rounded-xl shadow flex items-center gap-4 bg-red-100 text-red-900 border-red-500/20">
      <Icon className="w-8 h-8" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <p>{message}</p>
      </div>
    </div>
  );
};
