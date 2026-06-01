// src/components/home/InstallAppButton.jsx

export default function InstallAppButton({ onInstall }) {
  return (
    <button
      onClick={onInstall}
      className="
        flex items-center flex-col sm:flex-row 
        bg-[linear-gradient(147deg,#ffd901_0%,#ff8801_100%)] 
        text-[#0f0f0f] font-bold 
        rounded-[1rem] pl-4 pr-4 sm:pr-6 py-2 gap-0.5 sm:gap-3 max-h-[3.5625rem] overflow-hidden
        transition-all duration-300 ease-out
        hover:scale-[102%] active:scale-95
        shadow-[0_0_0.875rem_0_rgba(226,132,41,0.6)]
        hover:shadow-[0_0_1.375rem_0.375rem_rgba(226,132,41,0.9)]
      "
    >
      <img
        className="w-5 h-5 sm:w-6 sm:h-6"
        src="./images/webp/icons-png/play-market.webp"
        alt="Play Market"
      />
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <span className="text-[0.5rem] sm:text-[0.75rem] leading-tight uppercase font-normal">установить</span>
        <span className="text-[0.625rem] sm:text-[1rem] font-extrabold leading-tight uppercase">приложение</span>
      </div>
    </button>
  );
}