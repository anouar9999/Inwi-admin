
const AvatarGroup = ({ count = 56 }) => {
  // Array of colors for the avatars
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  return (
    <>
    <div className="flex -space-x-2">
    {['https://iconape.com/wp-content/png_logo_vector/avatar-11.png', 'https://iconape.com/wp-content/png_logo_vector/avatar-4.png', 'https://iconape.com/wp-content/png_logo_vector/avatar-9.png', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGwhtNErM_i8vS1NJ6njslqU91qgqAjAlbQbPEZusv5zGrz99oV8vloKM-aaKOkK8fwrI&usqp=CAU'].map((img, index) => (
      <img
        key={index}
        className={`w-8 h-8 rounded-full  border-2 border-gray-900`}
        src={img}
      />
    ))}
  </div>
  <div className="flex flex-col	">
  <span className="text-sm text-gray-400">+{count}</span>
  <span className="text-sm text-gray-400">Joined</span>
  </div>
  </>
  );
};

export default AvatarGroup;