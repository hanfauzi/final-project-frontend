import { useEffect, useState } from "react";

export default function Countdown({ estimatedDoneAt }: { estimatedDoneAt: string | Date }) {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const end = new Date(estimatedDoneAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now; 
      setRemaining(diff > 0 ? diff : 0);
    }, 1000); 

    return () => clearInterval(interval);
  }, [estimatedDoneAt]);

  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <span>
      {hours}h {minutes}m {seconds}s
    </span>
  );
}
