const getSongsPlayedDuringActivity = (songHistory, startTime, endTime) => {
  // songHistory is array of play history objects
  // startTime and endTime are Unix timestamps in milliseconds
  const filterByTime = song => {
    const playedAt = Date.parse(song.played_at);
    return (playedAt >= startTime) && (playedAt <= endTime);
  };

  const duringActivity = songHistory.filter(filterByTime);
  return duringActivity;
};

module.exports = getSongsPlayedDuringActivity;
