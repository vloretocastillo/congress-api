
// const states = [
//     { name: 'ALABAMA', abbreviation: 'AL'},
//     { name: 'ALASKA', abbreviation: 'AK'},
//     { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
//     { name: 'ARIZONA', abbreviation: 'AZ'},
//     { name: 'ARKANSAS', abbreviation: 'AR'},
//     { name: 'CALIFORNIA', abbreviation: 'CA'},
//     { name: 'COLORADO', abbreviation: 'CO'},
//     { name: 'CONNECTICUT', abbreviation: 'CT'},
//     { name: 'DELAWARE', abbreviation: 'DE'},
//     { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
//     { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
//     { name: 'FLORIDA', abbreviation: 'FL'},
//     { name: 'GEORGIA', abbreviation: 'GA'},
//     { name: 'GUAM', abbreviation: 'GU'},
//     { name: 'HAWAII', abbreviation: 'HI'},
//     { name: 'IDAHO', abbreviation: 'ID'},
//     { name: 'ILLINOIS', abbreviation: 'IL'},
//     { name: 'INDIANA', abbreviation: 'IN'},
//     { name: 'IOWA', abbreviation: 'IA'},
//     { name: 'KANSAS', abbreviation: 'KS'},
//     { name: 'KENTUCKY', abbreviation: 'KY'},
//     { name: 'LOUISIANA', abbreviation: 'LA'},
//     { name: 'MAINE', abbreviation: 'ME'},
//     { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
//     { name: 'MARYLAND', abbreviation: 'MD'},
//     { name: 'MASSACHUSETTS', abbreviation: 'MA'},
//     { name: 'MICHIGAN', abbreviation: 'MI'},
//     { name: 'MINNESOTA', abbreviation: 'MN'},
//     { name: 'MISSISSIPPI', abbreviation: 'MS'},
//     { name: 'MISSOURI', abbreviation: 'MO'},
//     { name: 'MONTANA', abbreviation: 'MT'},
//     { name: 'NEBRASKA', abbreviation: 'NE'},
//     { name: 'NEVADA', abbreviation: 'NV'},
//     { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
//     { name: 'NEW JERSEY', abbreviation: 'NJ'},
//     { name: 'NEW MEXICO', abbreviation: 'NM'},
//     { name: 'NEW YORK', abbreviation: 'NY'},
//     { name: 'NORTH CAROLINA', abbreviation: 'NC'},
//     { name: 'NORTH DAKOTA', abbreviation: 'ND'},
//     { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
//     { name: 'OHIO', abbreviation: 'OH'},
//     { name: 'OKLAHOMA', abbreviation: 'OK'},
//     { name: 'OREGON', abbreviation: 'OR'},
//     { name: 'PALAU', abbreviation: 'PW'},
//     { name: 'PENNSYLVANIA', abbreviation: 'PA'},
//     { name: 'PUERTO RICO', abbreviation: 'PR'},
//     { name: 'RHODE ISLAND', abbreviation: 'RI'},
//     { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
//     { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
//     { name: 'TENNESSEE', abbreviation: 'TN'},
//     { name: 'TEXAS', abbreviation: 'TX'},
//     { name: 'UTAH', abbreviation: 'UT'},
//     { name: 'VERMONT', abbreviation: 'VT'},
//     { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
//     { name: 'VIRGINIA', abbreviation: 'VA'},
//     { name: 'WASHINGTON', abbreviation: 'WA'},
//     { name: 'WEST VIRGINIA', abbreviation: 'WV'},
//     { name: 'WISCONSIN', abbreviation: 'WI'},
//     { name: 'WYOMING', abbreviation: 'WY' }
// ];

let app = new Vue({
    el: '#root',
    data : {
        currentPage: '',
        chamber: 'senate',
        statistic: 'attendance',
        loader : true,
        states : [],
        menuOffSetTop : 0,
        members: [],
        democrats: [],
        republicans : [],
        independents: [],
        percentageVotedDemocrats: 0,
        percentageVotedRepublicans: 0,
        percentageVotedIndependents: 0,
        totalPercentage: 0,
        engagement : {
            membersEngagementArray: [],
            leastEngaged: [],
            mostEngaged: []
        },
        loyalty : {
            membersLoyalytArray : [],
            leastLoyal : [],
            mostLoyal : []
        }
    },

    methods : {

        getData : async function (chamber) {
            const response = await fetch(`https://api.propublica.org/congress/v1/113/${chamber}/members.json`, {
                method: 'GET',
                headers: {
                    'X-API-Key': 'VW1RX1TgbPr1hp9uHtgJW2Nr01QcNzQAm8CqrDGl',
                }
                });
            const json = await response.json();
            const members = await json['results'][0]['members']
            return members
        },

        createLoyaltyArray : function (members) {
            return members.map( (el) => {
                let votesWithParty = Math.floor(el.total_votes * el.votes_with_party_pct / 100)
                return [el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, votesWithParty, el.votes_with_party_pct]
            }).sort(function(a, b){return a[2]-b[2]})
        },
        
        calculatePercentageVotedByParty : function (party) {
            if (party.length == 0 ) return '0 %'
            const total = party.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (total / party.length ).toFixed(2) + ' %'
        },

        toggleLoader : function (status) { 
            // console.log(status)
            status == 'reveal' ? this.loader = true : status == 'hide' ? this.loader = false  : false
        },

        revealText : function (event) {
            const isTextVisible = window.getComputedStyle( document.querySelector( '#toggleText' ) ).display;
            const readToggleButton = document.getElementById(event.target.id);
            isTextVisible == 'block' ? readToggleButton.innerHTML = 'Read More' : readToggleButton.innerHTML = 'Read Less'
        },

        makeMenuStickyOnScroll : function () {
            window.scrollY >= this.menuOffSetTop ? document.getElementById('menu').classList.add("sticky") : document.getElementById('menu').classList.remove("sticky") 
        },

        updateCurrentPage : function() { this.currentPage = window.location.pathname.split('/').pop() },

        createMemberObj : function (member) {
            const memberObject = {}
            memberObject.first_name = member.first_name || ''
            memberObject.middle_name = member.middle_name || ''
            memberObject.last_name = member.last_name || ''
            memberObject.state = member.state || ''
            memberObject.seniority = member.seniority || ''
            memberObject.party = member.party || ''
            memberObject.votes_with_party_pct = member.votes_with_party_pct + "%" || ''
            return memberObject
        },

        populateWithStates : function () {
            this.states = states
            let stateSelect = document.getElementById('state');
            for(let i = 0; i < this.states.length; i++) {
                let option = document.createElement('option');
                option.innerHTML = this.states[i].name;
                option.value = this.states[i].abbreviation;
                stateSelect.appendChild(option);
            }
        },

        onScrollAddEventListener : function () {
            window.addEventListener('scroll', () => ( this.makeMenuStickyOnScroll() ) );
            this.menuOffSetTop = document.getElementById('menu').offsetTop
        },

        

        updateDataChamber : function(event) {
            this.toggleLoader('reveal')
            this.currentPage == 'senate.html' ? this.chamber = 'senate' : this.chamber = 'house'
            const parties = [...document.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value)
            const selectedState  = [...document.getElementById('state')].filter(el => el.selected)[0].value 
            this.getData(this.chamber)
                .then( members => {
                    members = members.filter(el => parties.indexOf(el.party) != -1)
                    if (selectedState != "all") { members = members.filter(el => el.state == selectedState) }
                    this.members = members.map(el => this.createMemberObj(el))
                }).then(()=> {
                    this.toggleLoader('hide')
                    const tableBodyRows = document.getElementById('tablebody').children.length
                    tableBodyRows == 0 ? document.getElementById('zero-results-box').classList.remove('hide-me') : document.getElementById('zero-results-box').classList.add('hide-me')                    
                }).catch(err => console.log(err))
        },

        updateDataStatistics : function(event) {
            this.toggleLoader('reveal')
            if (event) {
                if (event.target.name == 'chamber') this.chamber = event.target.value 
                if (event.target.name == 'statistic') this.statistic = event.target.value
            }
            this.getData(this.chamber)
                .then( members => {
                    this.members = members
                    this.democrats = members.filter(el => el.party == 'D')
                    this.republicans = members.filter(el => el.party == 'R')
                    this.independents = members.filter(el => el.party == 'I')
                    this.percentageVotedDemocrats = this.calculatePercentageVotedByParty(this.democrats)
                    this.percentageVotedRepublicans = this.calculatePercentageVotedByParty(this.republicans)
                    this.percentageVotedIndependents = this.calculatePercentageVotedByParty(this.independents)
                    this.totalPercentage = this.calculatePercentageVotedByParty(this.members)
                    const tenPercent = (10 * this.members.length) / 100 
                    if (this.statistic == 'attendance') {
                        this.engagement.membersEngagementArray = this.members.map((el) => [el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, el.missed_votes, el.missed_votes_pct]).sort(function(a, b){return b[2]-a[2]})
                        this.engagement.mostEngaged = this.engagement.membersEngagementArray.slice(this.engagement.membersEngagementArray.length - tenPercent) 
                        this.engagement.leastEngaged = this.engagement.membersEngagementArray.slice(0, tenPercent) 
                    } else {
                        this.loyalty.membersLoyaltyArray = this.createLoyaltyArray(this.members)
                        this.loyalty.mostLoyal = this.loyalty.membersLoyaltyArray.slice(this.loyalty.membersLoyaltyArray.length - tenPercent) 
                        this.loyalty.leastLoyal = this.loyalty.membersLoyaltyArray.slice(0, tenPercent) 
                    }
                }).then(()=> {
                    this.toggleLoader('hide')
                }).catch(err => console.log(err))
        },

    },

    created : function () {
        // window.addEventListener('scroll', () => ( this.makeMenuStickyOnScroll() ) );
        // this.menuOffSetTop = document.getElementById('menu').offsetTop
        this.onScrollAddEventListener()
        this.updateCurrentPage()
        if ( this.currentPage == 'statistics.html') this.updateDataStatistics()
        if ( this.currentPage == 'senate.html' || this.currentPage == 'representatives.html') {
            this.populateWithStates()
            this.updateDataChamber()
        }
    }

})




















