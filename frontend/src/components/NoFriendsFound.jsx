import React from 'react'

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-100 p-2 rounded-xl text-center space-y-3">
      <div className="text-4xl">🧑‍🤝‍🧑</div>
      <h3 className="text-lg font-semibold text-primary">No Friends Yet!</h3>
      <p className="text-sm text-base-content opacity-70 italic">
        You haven’t connected with anyone yet. Discover people with similar interests, languages, and location to start meaningful conversations.
      </p>
    </div>
  );
};



export default NoFriendsFound