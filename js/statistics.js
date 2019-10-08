// console.log(dataSenate['results'][0]['members'])

// const republicans = dataSenate['results'][0]['members'].filter(el => el.party == 'R')
// const democrats = dataSenate['results'][0]['members'].filter(el => el.party == 'D')
// const independents = dataSenate['results'][0]['members'].filter(el => el.party == 'I')

// console.log(republicans)
// console.log(democrats)
// console.log(independents)

const statistics = {
    "Number of Democrats" : 0,//dataSenate['results'][0]['members'].filter(el => el.party == 'D').length,
    "Number of Repulicans" : 0,//dataSenate['results'][0]['members'].filter(el => el.party == 'R').length,
    "Number of Independents" : 0, //dataSenate['results'][0]['members'].filter(el => el.party == 'I').length
}

statistics["Number of Democrats"] = dataSenate['results'][0]['members'].filter(el => el.party == 'D').length;
statistics["Number of Republicans"] = dataSenate['results'][0]['members'].filter(el => el.party == 'R').length;
statistics["Number of Independents"] = dataSenate['results'][0]['members'].filter(el => el.party == 'I').length;


console.log(statistics["Number of Democrats"])

statistics["votes with the democrats"]