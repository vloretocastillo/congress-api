const currentPage = window.location.pathname.split('/').pop()

// ********************************************************* READ TOGGLE BUTTON

const changeText = (thisButton) => {
    const isTextVisible = !$("#toggleText").is(':visible')
    const readToggleButton = document.getElementById(thisButton.id)
    isTextVisible ? readToggleButton.innerHTML = 'Read Less' : readToggleButton.innerHTML = 'Read More'
}


// ********************************************************* FILTER BY PARTY FUNCTION

const filter = (event) => {
    const valuesParties = [...document.getElementsByName('party')].reduce((obj, item) => {
        obj[item.value] = item.checked
        return obj
      }, {})

    const tableRows = document.getElementsByTagName('tr')

    for (let i=1; i < tableRows.length; i++) {
        valuesParties[tableRows[i].getAttribute('data-party')] ? tableRows[i].classList.remove('hide-me') : tableRows[i].classList.add('hide-me')
    }
}


// ********************************************************* ASSIGN FILTER TO CHECKBOXES

const checkboxesParties = document.getElementsByName('party') || null
if (checkboxesParties) {
    for (let i=0; i < checkboxesParties.length; i++) { checkboxesParties[i].addEventListener('click', () => filter(event) ) }
}

// ********************************************************* GENERATE MEMBER TABLES FUNCTIONS 


const createMemberObj = (member) => {
    let memberObject = {}
    memberObject.first_name = member.first_name
    memberObject.middle_name = member.middle_name
    memberObject.last_name = member.last_name
    memberObject.state = member.state
    memberObject.seniority = member.seniority
    memberObject.party = member.party
    memberObject.votes_with_party_pct = member.votes_with_party_pct + "%"
    return memberObject
}

const createMembersArray = (members) => {
    const objectsArray = []
    for (let i = 0; i < members.length; i++) {  objectsArray.push(createMemberObj(members[i])) }
    return objectsArray
}

const generateTableRow = (member) => {

    const tr = document.createElement('tr')
    let full_name, party_votes, seniority, state, party
    
    full_name = document.createElement('td') 
    full_name.innerHTML = `${ member.first_name} ${member.middle_name || ""} ${member.last_name}`
    tr.appendChild(full_name)
    
    state = document.createElement('td')
    state.innerHTML = member.state 
    tr.appendChild(state)
    
    seniority = document.createElement('td')
    seniority.innerHTML =  member.seniority 
    tr.appendChild(seniority)
    
    party = document.createElement('td')  
    party.innerHTML = member.party 
    tr.appendChild(party)
    tr.setAttribute('data-party', member.party)

    
    party_votes = document.createElement('td')
    party_votes.innerHTML =  member.votes_with_party_pct
    tr.appendChild(party_votes)
    
    return tr
}


// ********************************************************* SENATE TABLE

if (currentPage == "senate.html") {

    const members = dataSenate['results'][0]['members'] 
    
    const tableGenerator = (rowGenerator, membersObjectsArray) => {
        const table = document.getElementById("senate-data")
        for (let i = 0; i < membersObjectsArray.length; i++) { table.appendChild( rowGenerator(membersObjectsArray[i]) ) }
    }
    
    const senateMembers = createMembersArray(members)
    tableGenerator(generateTableRow, senateMembers)

}

// ********************************************************* HOUSE TABLE

else if (currentPage == "representatives.html") {

    const members = dataHouse['results'][0]['members'] 

    const tableGenerator = (rowGenerator, membersObjectsArray) => {
        const table = document.getElementById("representatives-data")
        for (let i = 0; i < membersObjectsArray.length; i++) { table.appendChild( rowGenerator(membersObjectsArray[i]) ) }
    }

    const houseMembers = createMembersArray(members)
    tableGenerator(generateTableRow, houseMembers)

}