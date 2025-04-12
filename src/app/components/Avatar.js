const Avatar = ({ name }) => (
    <div className="w-6 h-6 bg-gray-300 rounded-full text-center text-xs font-bold flex items-center justify-center">
      {name[0]}
    </div>
  );
  
  export default Avatar;