// Previous imports and data remain the same...

const demoMatch: Match = {
  // Previous data remains the same...
  lineups: {
    home: {
      formation: "4-3-3",
      coach: {
        name: "Erik ten Hag",
        nationality: "Netherlands"
      },
      startingXI: [
        { id: "1", name: "De Gea", number: 1, position: "GK" },
        { id: "2", name: "Wan-Bissaka", number: 29, position: "RB" },
        { id: "3", name: "Varane", number: 19, position: "CB" },
        { id: "4", name: "Martinez", number: 6, position: "CB" },
        { id: "5", name: "Shaw", number: 23, position: "LB" },
        { id: "6", name: "Casemiro", number: 18, position: "DM" },
        { id: "7", name: "Fernandes", number: 8, position: "CM", isCaptain: true },
        { id: "8", name: "Eriksen", number: 14, position: "CM" },
        { id: "9", name: "Antony", number: 21, position: "RW" },
        { id: "10", name: "Rashford", number: 10, position: "ST" },
        { id: "11", name: "Sancho", number: 25, position: "LW" }
      ],
      substitutes: [
        { id: "12", name: "Butland", number: 31, position: "GK" },
        { id: "13", name: "Maguire", number: 5, position: "CB" },
        { id: "14", name: "Fred", number: 17, position: "CM" }
      ]
    },
    away: {
      formation: "4-2-3-1",
      coach: {
        name: "Mikel Arteta",
        nationality: "Spain"
      },
      startingXI: [
        { id: "21", name: "Ramsdale", number: 1, position: "GK" },
        { id: "22", name: "White", number: 4, position: "RB" },
        { id: "23", name: "Saliba", number: 12, position: "CB" },
        { id: "24", name: "Gabriel", number: 6, position: "CB" },
        { id: "25", name: "Zinchenko", number: 35, position: "LB" },
        { id: "26", name: "Partey", number: 5, position: "DM" },
        { id: "27", name: "Xhaka", number: 34, position: "CM" },
        { id: "28", name: "Saka", number: 7, position: "RW" },
        { id: "29", name: "Odegaard", number: 8, position: "CAM", isCaptain: true },
        { id: "30", name: "Martinelli", number: 11, position: "LW" },
        { id: "31", name: "Jesus", number: 9, position: "ST" }
      ],
      substitutes: [
        { id: "32", name: "Turner", number: 30, position: "GK" },
        { id: "33", name: "Holding", number: 16, position: "CB" },
        { id: "34", name: "Nketiah", number: 14, position: "ST" }
      ]
    }
  },
  commentary: [
    {
      id: "1",
      minute: 23,
      type: "goal",
      message: "Manchester United take the lead!",
      timestamp: new Date(Date.now() - 40 * 60000),
      relatedPlayers: {
        scorer: { id: "10", name: "Rashford", number: 10, position: "ST" },
        assist: { id: "7", name: "Fernandes", number: 8, position: "CM" }
      }
    },
    {
      id: "2",
      minute: 35,
      type: "goal",
      message: "Arsenal equalize!",
      timestamp: new Date(Date.now() - 25 * 60000),
      relatedPlayers: {
        scorer: { id: "31", name: "Jesus", number: 9, position: "ST" }
      }
    },
    {
      id: "3",
      minute: 52,
      type: "goal",
      message: "United back in front!",
      timestamp: new Date(Date.now() - 8 * 60000),
      relatedPlayers: {
        scorer: { id: "9", name: "Antony", number: 21, position: "RW" }
      }
    }
  ]
}