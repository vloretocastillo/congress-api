// console.log(dataSenate['results'][0]['members'])

// const republicans = dataSenate['results'][0]['members'].filter(el => el.party == 'R')
// const democrats = dataSenate['results'][0]['members'].filter(el => el.party == 'D')
// const independents = dataSenate['results'][0]['members'].filter(el => el.party == 'I')

// console.log(republicans)
// console.log(democrats)
// console.log(independents)

const statistics = {
    "Number of Democrats" : dataSenate['results'][0]['members'].filter(el => el.party == 'D').length,
    "Number of Repulicans" : dataSenate['results'][0]['members'].filter(el => el.party == 'R').length,
    "Number of Independents" : dataSenate['results'][0]['members'].filter(el => el.party == 'I').length
}
