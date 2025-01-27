const TeamDisplay = ({ team }) => (
    <div className="flex items-center px-4 py-2">
      {team ? (
        <>
          <span className="text-gray-500 mr-2 text-sm">{team.id}</span>
          <span className="text-gray-200">{team.name}</span>
        </>
      ) : (
        <span className="text-gray-500">TBD</span>
      )}
    </div>
  );