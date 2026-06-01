// src/components/supergame/SuperClickBear.jsx

export default function SuperClickBear({ onClick }) {
  return (
    <div className="min-w-[9rem] w-[66vw] max-w-[12.75rem] xss:w-[75vw] xss:max-w-[18rem] sm:w-[38vw] sm:max-w-[25rem] sm:min-w-[14.875rem] lg:max-w-[26vh] cursor-pointer transition-transform active:scale-95" onClick={onClick}>
      <img 
        src="/images/webp/level-bears/level-super.webp" 
        alt="Super Game" 
        className="w-full h-full object-cover mx-auto"
        // max-w-[14.875rem] sm:max-w-[14.875rem]
        draggable="false"
      />
    </div>
  );
}