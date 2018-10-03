const SEASON_DATES = {
  FALL_2018: new Date("September 15, 2018 00:01:00"),
  WINTER_2019: new Date("December 26, 2018 00:01:00")
};

class Season {
  constructor(seasons) {
    this.seasons = seasons;
  }

  getCurrentSeason() {
    const currentDate = new Date();
    let dateDifference;
    let currentSeason;

    for (const season of Object.keys(this.seasons)) {
      const date = this.seasons[season];

      if (
        !dateDifference ||
        !currentSeason ||
        (currentDate - date > 0 && currentDate - date < dateDifference)
      ) {
        dateDifference = currentDate - date;
        currentSeason = season;
      }
    }

    return currentSeason;
  }
}

const SeasonInstance = new Season(SEASON_DATES);

module.exports = SeasonInstance;
