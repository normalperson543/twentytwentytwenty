export default function TimerBar({
  progressBarBgColor,
  barBgColor,
  progressPercentage,
  children,
}: {
  progressBarBgColor: string;
  barBgColor: string;
  progressPercentage: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(to right,${progressBarBgColor} ${String(
          progressPercentage
        )}%, ${barBgColor} ${progressPercentage}%)`,
      }}
      className="
            w-full p-8 rounded-sm text-center font-bold text-5xl"
    >
      {children}
    </div>
  );
}
