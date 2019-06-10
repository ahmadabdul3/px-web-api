import express from 'express';
const router = express.Router();

router.get('/', getRaceDetails);

export default router;

function getRaceDetails(req, res) {
  console.log('hitting this');
  console.log('all data', allData());
  res.json({ data: allData() });
}

function allData() {
  return {
    articles: getArticlesData(),
    allData: getAllData(),
  };
}

function getArticlesData() {
  const data = [
    {
        "articleTitle": "Mayoral Forum Focus: Slumlords",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Tom/Deb1_720_743_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/cand_forum_2/",
        "author": "Thomas Breen",
        "date": "2019-05-22T04:00:00.000Z",
        "summary": "Out-of-town slumlords didn’t win any votes at the latest Democratic mayoral candidate forum.",
        "source": "New Haven Independent",
        "tags": "#mayoralrace"
    },
    {
        "articleTitle": "Contractors Scaffold Harp Reelection",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Chris/Giordano_-_5_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/cicontractors_harp_reelection_fundraiser/",
        "author": "Christopher Peak",
        "date": "2019-05-22T04:00:00.000Z",
        "summary": "After receiving contracts for building new schools and renovating public housing, Giordano Construction repaid the favor by hosting a top-dollar fundraiser for Mayor Toni Harp’s reelection campaign.",
        "source": "New Haven Independent",
        "tags": "#Harp #mayoralrace"
    },
    {
        "articleTitle": "Elicker Calls For New Priorities In City Schools",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/Tom/JEE7_720_458_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_education_platform/",
        "author": "Christopher Peak",
        "date": "2019-05-20T04:00:00.000Z",
        "summary": "More early childhood education spots. More art classes. More vocational apprenticeships. More professionals on the school board. Less standardized testing. Less top-dollar consulting.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Poole Seeks Younger Voices, Older Rookies",
        "image": "https://www.newhavenindependent.org/archives/upload/2018/08/Markeshia/PROPERTY5.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/seth_poole_policng/",
        "author": "Paul Bass",
        "date": "2019-05-17T04:00:00.000Z",
        "summary": "Mayor Seth Poole would work to give teens the right to vote on the Board of Education — and only people over 25 the chance to be cops.",
        "source": "New Haven Independent",
        "tags": "#Poole #mayoralrace"
    },
    {
        "articleTitle": "Debate Theme: Stay Course? Or Change?",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Bass/debate_urn_walk_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/mayoral_debate2/",
        "author": "Paul Bass",
        "date": "2019-05-15T04:00:00.000Z",
        "summary": "The gloves came off at the tail end of the first debate of this year’s mayoral campaign, as candidates established a central theme: Either New Haven has made great progress and should build on it by staying the course. ",
        "source": "New Haven Independent",
        "tags": "#mayoralrace"
    },
    {
        "articleTitle": "Elicker Pushes Blue New Deal",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2017/11/Markeshia/BusStudy1_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_pushes_blue_new_deal/",
        "author": "Thomas Breen & Paul Bass",
        "date": "2019-05-13T04:00:00.000Z",
        "summary": "Yale should scrap its daytime shuttle service and buy public bus passes for its students and employees.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Harp Flyer Links Elicker With Trump",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Tom/Comic_Strip__Final-1_720_556_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/campaign_flyer/",
        "author": "Thomas Breen",
        "date": "2019-05-10T04:00:00.000Z",
        "summary": "The Harp 2019 mayoral campaign released a new flyer that compares mayoral challenger Justin Elicker and President Donald Trump.",
        "source": "New Haven Independent",
        "tags": "#Harp #Elicker #mayoralrace"
    },
    {
        "articleTitle": "New App Makes Local Politics Xentral",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Markeshia/PoliXentral_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/new_xentral/",
        "author": "Markeshia Ricks",
        "date": "2019-05-10T04:00:00.000Z",
        "summary": "Finding out information about your local political representatives could get a lot easier thanks to a new phone app created by two homegrown developers.",
        "source": "New Haven Independent",
        "tags": "#newhavenpolitics #technology"
    },
    {
        "articleTitle": "5th Candidate Joins Mayoral Race",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/Tom/Seth_720_462_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/seth_poole/",
        "author": "Thomas Breen",
        "date": "2019-05-08T04:00:00.000Z",
        "summary": "The latest candidate to enter New Haven’s mayoral race pledges to crack down on out-of-town slumlords if elected as the city’s first non-Democratic chief executive in 66 years.",
        "source": "New Haven Independent",
        "tags": "#Poole #mayoralrace"
    },
    {
        "articleTitle": "Elicker Expands The Tent",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/05/Bass/elicker_valerie_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_expands_the_tent/",
        "author": "Paul Bass",
        "date": "2019-05-06T04:00:00.000Z",
        "summary": "Justin Elicker attracted a crowd of supporters who look like New Haven to the opening of his mayoral campaign headquarters, in part by embracing the causes of some of his opponent’s most public critics.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Elicker’s 1st Public-Financing Payday OK’d",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/allan/0-AA-April29-2019-je-01_720_481_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_democracy_fund_payday/",
        "author": "Allen Appel",
        "date": "2019-04-30T04:00:00.000Z",
        "summary": "Justin Elicker, who plans to challenge Mayor Toni Harp in a Sept. 10 Democratic primary, is about to hire a field director to accelerate getting the word out. He is also about to open a campaign headquarters on Whalley Avenue this Sunday.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Pendragon: Bypass State’s Attorney",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2018/10/Tom/Urn_720_498_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/urn_pendragon_wnhh/",
        "author": "Paul Bass",
        "date": "2019-04-25T04:00:00.000Z",
        "summary": "New Haven mayoral candidate Urn Pendragon took a third path from two of her opponents on the question of who should conduct the investigation into the shooting by Hamden and Yale cops of an unarmed couple inside a Honda Civic in Newhallville.",
        "source": "New Haven Independent",
        "tags": "#pendragon #mayoralrace"
    },
    {
        "articleTitle": "Jobs & Schools Top Elicker’s Dixwell Pitch",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/Tom/Elicker2_720_457_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/jobs_schools_top_elickers_dixwell_pitch/",
        "author": "Thomas Breen",
        "date": "2019-04-15T04:00:00.000Z",
        "summary": "Mayoral candidate Justin Elicker secured at least four votes on Saturday morning as he canvassed up and down Orchard Street talking jobs, schools, housing, and clean government with working class black voters.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Harp Urges Supporters To Stay Course",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/Markeshia/Harp14_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/harp_tells_supporters_to_stay_the_course/",
        "author": "Markeshia Ricks",
        "date": "2019-04-13T04:00:00.000Z",
        "summary": "Toni Harp kicked off her campaign for a fourth term as mayor by urging nearly 300 supporters to stick with an administration that has brought progress in economic development, education and reduced crime.",
        "source": "New Haven Independent",
        "tags": "#Harp #mayoralrace"
    },
    {
        "articleTitle": "Elicker On Education: Look Local",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/Tom/JEE7_720_458_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/justin_elicker_education/",
        "author": "Thomas Breen",
        "date": "2019-04-12T04:00:00.000Z",
        "summary": "Over slices from Modern and locally brewed lagers, Justin Elicker promised a roomful of public school teachers that he’ll bring a homegrown corrective plan to the school system if elected mayor.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Who Gave Harp $26K, Elicker $117K",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/04/Tom/Elicker_collage_720_640_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/campaign_finance_mayor/",
        "author": "Thomas Breen",
        "date": "2019-04-10T04:00:00.000Z",
        "summary": "More Yale professors gave money to the Elicker campaign. More city government department heads donated to the Harp camp. Donors came from all over town, with concentrations in both campaigns found Downtown and in Westville.",
        "source": "New Haven Independent",
        "tags": "#Harp #Elicker #mayoralrace"
    },
    {
        "articleTitle": "Elicker Pulls In $117K",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/allan/0-AA-March31-2019-je-01_720_481_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_pulls_in_117k/",
        "author": "Paul Bass",
        "date": "2019-04-09T04:00:00.000Z",
        "summary": "Justin Elicker raised over $117,000 from individual donors in the first three months of 2019 for his quest to unseat Mayor Toni Harp in this year’s elections, his campaign reported Monday.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Mayor Chews, Chills With City Youth",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2018/03/Markeshia/Harp9_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/mayor_whalley_pizza/",
        "author": "Markeshia Ricks",
        "date": "2019-04-01T04:00:00.000Z",
        "summary": "Mayor Toni Harp joined a group of more than 30 students from all over the city for a “chew and chill” to check in with constituents who she said will one day run New Haven.",
        "source": "New Haven Independent",
        "tags": "#Harp #mayoralrace"
    },
    {
        "articleTitle": "Round 1 Ends With A Slice",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/allan/0-AA-March31-2019-je-01_720_481_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker1/",
        "author": "Allen Appel",
        "date": "2019-04-01T04:00:00.000Z",
        "summary": "Mayoral candidate Justin Elicker raced to the end of the campaign’s first financial-reporting period with five events in one day, capped with an open “BAR” for 60 volunteers, donors and friends.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Outsider Candidate Seizes Bullied Pulpit",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/Tom/ERC6_720_426_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/urn_erc/",
        "author": "Thomas Breen",
        "date": "2019-03-29T04:00:00.000Z",
        "summary": "Mayoral candidate Urn Pendragon has personal experience getting bullied: as a nerdy student, as a transgender woman, as someone who has struggled through homelessness and unemployment.",
        "source": "New Haven Independent",
        "tags": "#pendragon #mayoralrace"
    },
    {
        "articleTitle": "Elicker Outlines Road To Mayor’s Office",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/Markeshia/Elicker6_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_fundraiser/",
        "author": "Markeshia Ricks",
        "date": "2019-03-27T04:00:00.000Z",
        "summary": "Justin Elicker lost by 1,800 votes the last time he faced Toni Harp in an election. And back then, she wasn’t even the incumbent. Now, she’s a three-term mayor with access to a powerful GOTV apparatus and deeper campaign pockets.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Campaign $ Probe, $1,000-Ticket Event Set",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/02/Bass/diptych_720_278_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/harp_reelection_fundriaser_donors/",
        "author": "Christopher Peak & Paul Bass",
        "date": "2019-03-20T04:00:00.000Z",
        "summary": "City contractors, longtime political allies, and charter-school machers are hosting a $250-$1,000-a-ticket fundraiser for Mayor Toni Harp’s reelection quest in Avon Thursday evening, a day after a state agency voted to launch an investigation into her campaign’s paperwork lapses.",
        "source": "New Haven Independent",
        "tags": "#Harp #Elicker #mayoralrace"
    },
    {
        "articleTitle": "Elicker Hits Harp On Campaign Filings",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_harp_campaign_filings/",
        "author": "Paul Bass",
        "date": "2019-03-08T05:00:00.000Z",
        "summary": "Democratic mayoral candidate Justin Elicker Thursday filed a complaint against incumbent Mayor Toni Harp Thursday over her 2017 campaign filings.",
        "source": "New Haven Independent",
        "tags": "#Harp #Elicker #mayoralrace"
    },
    {
        "articleTitle": "Housing, LGBT Activist Files Mayor Run",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/03/Tom/Urn_720_496_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/urn_pendragon_wnhh/",
        "author": "Thomas Breen",
        "date": "2019-03-04T05:00:00.000Z",
        "summary": "The latest candidate to enter New Haven’s mayoral race offers these qualifications for serving the marginalized",
        "source": "New Haven Independent",
        "tags": "#pendragon #mayoralrace"
    },
    {
        "articleTitle": "Harp Makes It Official: She’s Running",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/01/Markeshia/State1_720_480_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_harp_campaign_filings/",
        "author": "Staff",
        "date": "2019-02-15T05:00:00.000Z",
        "summary": "New Haven Mayor Toni Harp filed papers Thursday at the city clerk’s office to run for a fourth two-year term, and issued Valentine’s Day message to fellow Democrats with a nod to the Rev. Al Green..",
        "source": "New Haven Independent",
        "tags": "#Harp #mayoralrace"
    },
    {
        "articleTitle": "Elicker En-Gages Campaign Manager",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_campaign_manager/",
        "author": "Paul Bass",
        "date": "2019-01-01T05:00:00.000Z",
        "summary": "Justin Elicker has drawn a millennial from Bridgeport to guide his challenge to New Haven Mayor Toni Harp.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Elicker Pressed On Cops, Budget",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_wnhh/",
        "author": "Paul Bass",
        "date": "2019-02-05T05:00:00.000Z",
        "summary": "Justin Elicker was ready to talk about changing the way New Haven government runs. He asked for “more time” to provide fully formed positions to some of the most controversial specific choices he might face.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Hamilton Files For Mayor",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2017/08/Bass/Wendy_Hamilton_-_1_720_540_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/hamilton_files_for_mayor/",
        "author": "Paul Bass",
        "date": "2019-01-18T05:00:00.000Z",
        "summary": "Local activist and philanthropist Wendy Hamilton files a registration form in the City Clerk’s office Thursday to run for mayor.",
        "source": "New Haven Independent",
        "tags": "#Hamilton #mayoralrace"
    },
    {
        "articleTitle": "Rematch On: Elicker Files For Mayor Run; Targets Lead Paint, Seeks Public Financing",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2019/01/Bass/Elicker_paperwork_720_405_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/elicker_announces_mayoral_run/",
        "author": "Paul Bass",
        "date": "2019-01-16T05:00:00.000Z",
        "summary": "Surrounded by his wife and two young daughters, Justin Elicker filed papers Wednesday to challenge incumbent Toni Harp for mayor — and opened with a focus on cleaning up lead paint in children’s homes and money fueling election campaigns.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    },
    {
        "articleTitle": "Elicker, Brennan Eye Mayoral Runs",
        "image": "https://www.newhavenindependent.org/images/made/archives/upload/2018/12/Misc/brennan_elicker_720_385_88_sha-100.jpg",
        "link": "https://www.newhavenindependent.org/index.php/archives/entry/mayoral_runs/",
        "author": "Paul Bass",
        "date": "2018-12-19T05:00:00.000Z",
        "summary": "Two 40-something New Haveners —a former alder who runs the Land Trust and an ex-federal prosecutor who targeted government corruption — are “seriously considering” challenging incumbent Toni Harp for mayor in 2019.",
        "source": "New Haven Independent",
        "tags": "#elicker #mayoralrace"
    }
  ];

  return data;
}

function getPoliceData() {
  const data = getOverviewData();
  data[0].stances = [
    `Our police department is in a great place. We have one of the most diverse police forces in the country!`,
  ];
  data[1].stances = [
    `New Haven Police Officers have told me: "I haven't had a contract in 3 years, treat us like human." We need to treat our officers with respect, compensation and support.`,
  ];
  data[2].stances = [
    `Our police outflow is a problem, but what we need is a stronger force that is properly trained and focused in policing our communities for a better future.`,
  ];
  data[3].stances = [
    `The police outflow is a good thing! We should keep the best cops and pay them better! Then we should concentrate their efforts on high crime issues!`,
  ];
  data[4].stances = [
    `No Information`,
  ];
  return data;
}

function getSchoolData() {
  const data = getOverviewData();
  data[0].stances = [
    `To fix our school deficity, we need to first hire a CFO and improve our Education Cost Sharing terms.`,
  ];
  data[1].stances = [
    `We need to stop gambling on our youth! We need parents part of the decision in choosing superintendents, invest in arts curriculum and grow the BOE with leaders with experience.`,
  ];
  data[2].stances = [
    `To improve the public school deficit, we need to desegregate districts, restructure our education system and hire new talent!`,
  ];
  data[3].stances = [
    `Our school system has problems. We need to fire the Board of Education, hire new superintendents and more personnel. We have too many Principals.`,
  ];
  data[4].stances = [
    `No Information`,
  ];
  return data;
}

function getSlumlordData() {
  const data = getOverviewData();
  data[0].stances = [
    `A huge initiative that we are working on is bad landlords having Municity; a single record for all properties to capitalize on all city officials to report potential issues with a given property.`,
  ];
  data[1].stances = [
    `Our efforts have not been effective, and this is life or death. We need to support LCI to do their work effectively.`,
  ];
  data[2].stances = [
    `We need to hold landlords accountable for their property upkeep and the conditions of their tenants. By increasing inspectors (by 35%) and fining absent owners, our city will improve.`,
  ];
  data[3].stances = [
    `My plan is to go after the biggest offenders in the city of New Haven. We should not accept how these large companies and corporations take advantage of our city! Enough is enough!`,
  ];
  data[4].stances = [
    `The city needs to stop neglecting how property ownership is changing hands and how properties are being managed, especially with absent landlords.`,
  ];
  return data;
}

function getHomeOwnershipData() {
  const data = getOverviewData();
  data[0].stances = [
    `Helping homeowners in New Haven is rooted into fixing our budget while holding off tax increases, which I have done as Mayor! One example of fixing the budget is we stopped refinancing our pensions to avoid a very vicious cycle.`,
  ];
  data[1].stances = [
    `New Haven city taxes has increased by 11%, this has to stop.`,
  ];
  data[2].stances = [
    `No Information`,
  ];
  data[3].stances = [
    `Helping homeowners is connected to our budget issues. We need to live within our means. Retain or lower taxes where possible!`,
  ];
  data[4].stances = [
    `No Information`,
  ];
  return data;
}

function getJobsData() {
  const data = getOverviewData();
  data[0].stances = [
    `New Haven has incredible resources for jobs! We have the Hillhouse Apprenticeship, Eli Whitney, and the Evergreen project which is a huge step in the right direction!`,
  ];
  data[1].stances = [
    `As the most critical challenge, we need to invest in vocational jobs and invest in our residents!`,
  ];
  data[2].stances = [
    `Unlike all the other Mayoral candidates, I understand what it is like to look for a job in New Haven. It is an uphill battle, not matter how qualified you are. I will fight to make this right for the underrepresented.`,
  ];
  data[3].stances = [
    `There are no jobs! We need to work on adding blue collar jobs and my plan to improve New Haven's infrastructure will do exactly that!`,
  ];
  data[4].stances = [
    `No Information`,
  ];
  return data;
}

function getOverviewData() {
  return [
    {
      name: 'Toni Harp',
      party: 'Democrat',
      missionStatement: `New Haven is a wonderful city with many things to be appreciated here! We have come a long way and still have a long way to go. I hope you support my bid as Mayor so that we continue this great progress!`,
      imageUrl: 'https://res.cloudinary.com/politixentral/image/upload/v1555284242/hds7hj578agq9fiidnhz.jpg',
      WhatIStandFor: [
        `Lower Income Support`,
        `Public Safety`,
        `Improve Education`,
        `Improve Job Opportunities`,
      ],
      incumbent: true,
    },
    {
      name: 'Justin Elicker',
      party: 'Democrat',
      missionStatement: `I’m running for Mayor because I want my daughters to grow up in a city that provides everyone the education and opportunities they need to be successful in life. We can and we must do better.`,
      imageUrl: 'https://res.cloudinary.com/politixentral/image/upload/v1549073233/Mayor_Justin_Elicker_City_New%20Haven.jpg',
      WhatIStandFor: [
        `Neighborhood Development`,
        `Inclusive Growth`,
        `Effective Government`,
      ],
    },
    {
      name: 'Urn Pendragon',
      party: 'Democrat',
      missionStatement: `I'm running for Mayor to stop the city from hemmoraging money and to ultimately advocate for the underrepsented!`,
      imageUrl: 'https://res.cloudinary.com/politixentral/image/upload/v1558813777/Screen_Shot_2019-05-25_at_3.48.39_PM.png',
      WhatIStandFor: [
        `No Information`,
      ],
    },
    {
      name: 'Wendy Hamilton',
      party: 'Democrat',
      missionStatement: `My plans for New Haven include reasonable budget cuts and serious restructuring so that we can get more done sooner!`,
      imageUrl: 'https://res.cloudinary.com/politixentral/image/upload/v1558814021/Screen_Shot_2019-05-25_at_3.53.19_PM.png',
      WhatIStandFor: [
        `Improve Tax Structure`,
        `Cut the Red Tape`,
        `Improve City Infrastructure`,
      ],
    },
    {
      name: 'Seth Poole',
      party: 'Unaffiliated',
      missionStatement: `As person that was raised and educated in New Haven, I, above all others have a better understanding of New Haven as a city and home.`,
      imageUrl: 'https://res.cloudinary.com/politixentral/image/upload/v1558814238/Screen_Shot_2019-05-25_at_3.56.59_PM.png',
      WhatIStandFor: [
        `No Information`,
      ],
    },
  ];
}

// - this is gross, but were on a time crunch and we need to get
//   an investment :)
function getAllData() {
  const allData = [];
  const overview = getOverviewData();
  const jobsData = getJobsData();
  const homeData = getHomeOwnershipData();
  const slumData = getSlumlordData();
  const schoolData = getSchoolData();
  const policeData = getPoliceData();
  for (let i = 0; i < 5; i++) {
    allData.push({
      ...overview[i],
      jobs: jobsData[i].stances,
      homes: homeData[i].stances,
      slums: slumData[i].stances,
      schools: schoolData[i].stances,
      police: policeData[i].stances,
    });
  }
  const allDataObject = allData.reduce((all, item) => {
    all[item.name] = item;
    return all;
  }, {});
  return {
    ar: allData,
    ob: allDataObject,
  };
}
