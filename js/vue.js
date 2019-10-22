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
        updateCurrentPage : function() { this.currentPage = window.location.pathname.split('/').pop() },
        toggleLoader : function (status) { 
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

        onScrollAddEventListener : function () {
            window.addEventListener('scroll', () => { this.makeMenuStickyOnScroll() } )
            this.menuOffSetTop = document.getElementById('menu').offsetTop
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

        // ***********************************************************************************************************************

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

        createEngagementArray : function (members)  {
            return members.map((el) => { 
                let obj = { 
                    fullName : el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, 
                    missedVotes: el.missed_votes, 
                    missedVotesPercentage : el.missed_votes_pct
                }
                return obj
            }).sort(function(a, b){return b.missedVotesPercentage-a.missedVotesPercentage})
        },
        createLoyaltyArray : function (members) {
            return members.map( (el) => {
                const votesWithParty = Math.floor(el.total_votes * el.votes_with_party_pct / 100)
                let obj = { 
                    fullName : el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, 
                    votesWithParty: votesWithParty, 
                    votesWithPartyPercentage : el.votes_with_party_pct
                }
                return obj
            }).sort(function(a, b){return b.votesWithPartyPercentage-a.votesWithPartyPercentage})
        },
        

        calculatePercentageVotedByParty : function (party) {
            if (party.length == 0 ) return '0 %'
            const total = party.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (total / party.length ).toFixed(2) + ' %'
        },

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

        
        percentageOfMembersLoyalty : function (members, preference, percentage) {
            const limit = Math.floor( (percentage * this.members.length) / 100 )
            if (preference == 'least') members = [...members].reverse()
            let arr = []
            let counter = 0
            for (let i=0; i < members.length; i++) {
                if ( counter > limit ) break
                if (arr.length > 0) {
                    if ( ! (arr[arr.length -1].votesWithPartyPercentage == members[i].votesWithPartyPercentage)) counter += 1
                } 
                arr.push(members[i])
            }
            return arr
        },

        percentageOfMembersEngagement : function (members, preference, percentage) {
            const limit = Math.floor( (percentage * this.members.length) / 100 )
            if (preference == 'most') members = [...members].reverse()
            let arr = []
            let counter = 0
            for (let i=0; i < members.length; i++) {
                if ( counter > limit ) break
                if ( arr.length > 0 && !(arr[arr.length -1].missedVotesPercentage == members[i].missedVotesPercentage)) counter += 1  
                arr.push(members[i])
            }
            return arr
        },

        // ************************************************************************************************************

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
                    if (this.statistic == 'attendance') {
                        this.engagement.membersEngagementArray = this.createEngagementArray(this.members)
                        this.engagement.mostEngaged = this.percentageOfMembersEngagement(this.engagement.membersEngagementArray, 'most', 10)//this.engagement.membersEngagementArray.slice(this.engagement.membersEngagementArray.length - tenPercent) 
                        this.engagement.leastEngaged = this.percentageOfMembersEngagement(this.engagement.membersEngagementArray, 'least', 10)//this.engagement.membersEngagementArray.slice(0, tenPercent) 
                    } else {
                        this.loyalty.membersLoyaltyArray = this.createLoyaltyArray(this.members)
                        this.loyalty.leastLoyal = this.percentageOfMembersLoyalty(this.loyalty.membersLoyaltyArray, 'least', 10) //this.loyalty.membersLoyaltyArray.slice(0, tenPercent) 
                        this.loyalty.mostLoyal = this.percentageOfMembersLoyalty(this.loyalty.membersLoyaltyArray, 'most', 10) //this.loyalty.membersLoyaltyArray.slice(this.loyalty.membersLoyaltyArray.length - tenPercent) 
                    }
                }).then(()=> this.toggleLoader('hide')).catch(err => console.log(err))
        },

    },

    created : function () {
        this.onScrollAddEventListener()
        this.updateCurrentPage()
        if ( this.currentPage == 'statistics.html') this.updateDataStatistics()
        if ( this.currentPage == 'senate.html' || this.currentPage == 'representatives.html') {
            this.populateWithStates()
            this.updateDataChamber()
        }
    }

})