const SEASON_DATES = {
  'FALL_2018': new Date('September 15, 2018 00:01:00'),
  'WINTER_2019': new Date('December 26, 2018 00:01:00')
}

class Season {
  constructor(seasons) {
    this.seasons = seasons;
  }

  getCurrentSeason() {
    const currentDate = new Date();
    let dateDifference;
    let currentSeason;

    Object.keys(this.seasons).forEach(function(season) {
      const date = this.seasons[season];

      if (!dateDifference || !currentSeason ||
         currentDate-date > 0 || currentDate-date < dateDifference) 
      {
        dateDifference = currentDate-date;
        currentSeason = season;
      }
    });

    return currentSeason;
  }
}

const Season = new Season(SEASON_DATES);

module.exports = Season;