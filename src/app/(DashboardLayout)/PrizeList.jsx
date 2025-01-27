'use client'

const PrizeList = () => {
  const prizes = [
    { place: '1st place', amount: '$200', subtext: 'TOTAL AMOUNT' },
    { place: '2nd place', amount: '$80', subtext: 'TOTAL AMOUNT' },
    { place: '3rd place', amount: '$10', subtext: 'TOTAL AMOUNT' },
    { place: '4th-32nd', amount: '200', subtext: 'XP' },
  ];

  return (
    <div className="p-5  max-w-sm">
      {prizes.map((prize, index) => (
        <div key={index} className={`mb-0.5 relative ${index === prizes.length - 1 ? 'mb-0' : ''}`}>
          <div className={`bg-[#1f2937] py-3 pl-4 pr-6 text-white flex justify-between items-center 
            ${index === 0 ? 'first-item' : ''} 
            ${index === prizes.length - 1 ? 'last-item' : ''}`}>
            <div className="text-sm font-medium text-gray-300">{prize.place}</div>
            <div className="text-right">
              <div className="font-bold text-white ">{prize.amount}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-[-4px]">{prize.subtext}</div>
            </div>
          </div>
          <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-primary"></div>
        </div>
      ))}
      <style jsx>{`
        .first-item {
          border-top-left-radius: 0.5rem;
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%, 0 0);
        }
        .last-item {
          border-bottom-right-radius: 0.5rem;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px), 0 0);
        }
      `}</style>
    </div>
  );
};

export default PrizeList;