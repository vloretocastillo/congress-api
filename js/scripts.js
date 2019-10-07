// ********************************************************* CURRENT HTML PAGE

const currentPage = window.location.pathname.split('/').pop();

// ********************************************************* READ TOGGLE BUTTON - HOME PAGE

const changeText = (thisButton) => {
    const isTextVisible = !$("#toggleText").is(':visible');
    const readToggleButton = document.getElementById(thisButton.id);
    isTextVisible ? readToggleButton.innerHTML = 'Read Less' : readToggleButton.innerHTML = 'Read More'
}

// ********************************************************* ADD EVENT LISTENERS  

const checkboxesParties = document.getElementsByName('party') || null
if (checkboxesParties) {
    for (let i=0; i < checkboxesParties.length; i++) { checkboxesParties[i].addEventListener('change', () => filter() ) }
}

// ********************************************************* GENERATE MEMBER TABLES FUNCTIONS 

const createMemberObj = (member) => {
    const memberObject = {}
    memberObject.first_name = member.first_name
    memberObject.middle_name = member.middle_name
    memberObject.last_name = member.last_name
    memberObject.state = member.state
    memberObject.seniority = member.seniority
    memberObject.party = member.party
    memberObject.votes_with_party_pct = member.votes_with_party_pct + "%"
    return memberObject
}


const renderRow = (member) => {

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
    tr.setAttribute('data-party', member.party )

    party_votes = document.createElement('td')
    party_votes.innerHTML =  member.votes_with_party_pct
    tr.appendChild(party_votes)
    
    return tr
}

const renderTable = (members) => {
    const tableBody = document.getElementById('table-body')
    for (let i = 0; i < members.length; i++) { tableBody.appendChild( renderRow(members[i]) ) }
}


// ********************************************************* FILTER 

const filter = () => {
    let members = currentPage == "senate.html" ? dataSenate['results'][0]['members'] : currentPage == "representatives.html" ? dataHouse['results'][0]['members'] : null
    const checkboxesValuesParties = [...document.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value)
    members = members.filter(el => checkboxesValuesParties.indexOf(el.party) != -1)
    members = members.map(el => createMemberObj(el))
    document.getElementById('table-body').innerHTML = ''
    renderTable( members )
}

filter();