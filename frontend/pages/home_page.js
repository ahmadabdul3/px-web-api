import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInput from 'src/frontend/components/form_input';
import http from 'src/frontend/services/http';

export default class HomePage extends Component {
  state = {
    loading: false,
    newNoteDocumentModalVisible: false,
    // noteDocs: [],
  }

  addNoteDoc = ({ docName }) => {
    this.hideNewNoteDocumentModal();
    this.props.addNotesDocument({ name: docName });
  }

  showNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: true });
  }

  hideNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: false });
  }

  loadAldersIntoDb = () => {
    const alders = aldersJson();
    http.post('/alders/bulk-create', alders).then(res => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    // http.post('/alders', alders[0]).then(res => {
    //   console.log(res);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

  render() {
    return (
      <div className='home-page'>
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.showNewNoteDocumentModal}>
              <i className='fas fa-plus' /> New Item
            </button>
          </div>
        </header>
        <section className='home-page__docs'>
          <button className='green-button' onClick={this.loadAldersIntoDb}>
            load alders into db
          </button>
        </section>
      </div>
    );
  }
}

function Table({ children, headers, loadMore, loading }) {
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            {
              headers.map((header, index) => <th key={index}>{header}</th>)
            }
          </tr>
        </thead>
        <tbody>
          { children }
        </tbody>
      </table>
      <div className='table-load-more'>
        {
          loading ? <img src='https://media.giphy.com/media/fHgQPwQdKVMAg/giphy.gif' /> :
          <span onClick={loadMore}>Load More</span>
        }
      </div>
    </div>
  );
}

function TableRow({ transactionData }) {
  const { id, name, amount, transactionType } = transactionData;

  return (
    <tr>
      <td>
        { id }
      </td>
      <td>
        { name }
      </td>
      <td>
        { amount }
      </td>
      <td>
        { transactionType }
      </td>
    </tr>
  );
}

function aldersJson() {
  return [
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "1",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Hacibey",
     "middleName": "",
     "lastName": "Catalbasoglu",
     "suffix": "",
     "email": "Ward1@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "206 Elm Street",
     "zipCode": "06520-9251",
     "phone": "203-212-7686"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "2",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Frank",
     "middleName": "E.",
     "lastName": "Douglass",
     "suffix": "Jr.",
     "email": "Ward2@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "570 Elm Street",
     "zipCode": "06511-4137",
     "phone": "203-535-8979"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "3",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Ron",
     "middleName": "C.",
     "lastName": "Hurt",
     "suffix": "",
     "email": "Ward3@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "574 Congress Avenue",
     "zipCode": "06519-1315",
     "phone": "203-675-5467"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "4",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Evelyn",
     "middleName": "",
     "lastName": "Rodriguez",
     "suffix": "",
     "email": "Ward4@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "79 Arch Street",
     "zipCode": "06519-1510",
     "phone": "203-494-1462"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "5",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "Deputy Majority Leader",
     "firstName": "Dave",
     "middleName": "",
     "lastName": "Reyes",
     "suffix": "Jr.",
     "email": "Ward5@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "21 Edgar Street",
     "zipCode": "06519-2318",
     "phone": "203-823-3868"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "6",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Dolores",
     "middleName": "",
     "lastName": "Colón",
     "suffix": "",
     "email": "Ward6@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "34 Salem Street",
     "zipCode": "06519-2235",
     "phone": "203-507-7679"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "7",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Abigail",
     "middleName": "",
     "lastName": "Roth",
     "suffix": "",
     "email": "Ward7@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "42 Lincoln Street",
     "zipCode": "06511-3806",
     "phone": "203-535-5338"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "8",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Aaron",
     "middleName": "",
     "lastName": "Greenberg",
     "suffix": "",
     "email": "Ward8@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "119 Olive Street #3",
     "zipCode": "06511-4938",
     "phone": "203-903-1352"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "9",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Charles",
     "middleName": "",
     "lastName": "Decker",
     "suffix": "",
     "email": "Ward9@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "48 Linden Street #1",
     "zipCode": "06511-2527",
     "phone": "203-514-2439"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "10",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Anna",
     "middleName": "M.",
     "lastName": "Festa",
     "suffix": "",
     "email": "Ward10@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "117 Canner Street",
     "zipCode": "06511-2201",
     "phone": "203-776-8602"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "11",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Renee",
     "middleName": "",
     "lastName": "Haywood",
     "suffix": "",
     "email": "Ward11@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "315 Eastern St Bld. D #1803",
     "zipCode": "06513-2522",
     "phone": "203-535-1597"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "12",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Gerald",
     "middleName": "M.",
     "lastName": "Antunes",
     "suffix": "",
     "email": "Ward12@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "195 Weybossett Street",
     "zipCode": "06513-1024",
     "phone": "203-772-1988"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "13",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Rosa",
     "middleName": "Ferraro",
     "lastName": "Santana",
     "suffix": "",
     "email": "ward13@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "39 Clifton Street",
     "zipCode": "06513-3315",
     "phone": "203-469-5700"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "14",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Kenneth",
     "middleName": "",
     "lastName": "Reveiz",
     "suffix": "",
     "email": "Ward14@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "122 Grafton Street # 3",
     "zipCode": "06513-3947",
     "phone": "203-999-0205"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "15",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Ernie",
     "middleName": "G.",
     "lastName": "Santiago",
     "suffix": "",
     "email": "Ward15@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "455 Lombard Street",
     "zipCode": "06513-2908",
     "phone": "203-868-8143"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "16",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Jose",
     "middleName": "",
     "lastName": "Crespo",
     "suffix": "",
     "email": "Ward16@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "114 Blatchley Avenue",
     "zipCode": "06513-4205",
     "phone": "203-668-4613"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "17",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Jody",
     "middleName": "",
     "lastName": "Ortiz",
     "suffix": "",
     "email": "Ward17@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "60 Soundview Terrace",
     "zipCode": "06512-4741",
     "phone": "203-676-0452"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "18",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Salvatore",
     "middleName": "E.",
     "lastName": "DeCola",
     "suffix": "",
     "email": "Ward18@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "120 Townsend Avenue",
     "zipCode": "06512-4045",
     "phone": "203-641-1857"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "19",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Kimberly",
     "middleName": "R.",
     "lastName": "Edwards",
     "suffix": "",
     "email": "Ward19@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "122 Sheffield Avenue",
     "zipCode": "06511-1929",
     "phone": "203-668-7895"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "20",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Delphine",
     "middleName": "",
     "lastName": "Clyburn",
     "suffix": "",
     "email": "Ward20@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "175 Newhall Street",
     "zipCode": "06511-1949",
     "phone": "203-435-2081"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "21",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Steven",
     "middleName": "",
     "lastName": "Winter",
     "suffix": "",
     "email": "Ward21@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "426 Prospect Street Apt. 1",
     "zipCode": "06511-2122",
     "phone": "203-903-4342"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "22",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Jeanette",
     "middleName": "L.",
     "lastName": "Morrison",
     "suffix": "",
     "email": "Ward22@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "130 Winchester Avenue #23",
     "zipCode": "06511-3590",
     "phone": "203-687-3120"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "23",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Tyisha",
     "middleName": "",
     "lastName": "Walker-Myers",
     "suffix": "",
     "email": "Ward23@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "225 Winthrop Avenue 2nd Fl",
     "zipCode": "06511-5154",
     "phone": "203-901-3436"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "24",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Evette",
     "middleName": "",
     "lastName": "Hamilton",
     "suffix": "",
     "email": "Ward24@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "327 Edgewood Avenue",
     "zipCode": "06511-4150",
     "phone": "203-508-5426"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "25",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Adam",
     "middleName": "J.",
     "lastName": "Marchand",
     "suffix": "",
     "email": "Ward25@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "101 West Elm Street",
     "zipCode": "06515-2119",
     "phone": "203-389-1074"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "26",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Darryl",
     "middleName": "",
     "lastName": "Brackeen",
     "suffix": "Jr.",
     "email": "ward26@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "Office: 157 Church St 19th Floor",
     "zipCode": "6510",
     "phone": "475-655-3064"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "27",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "Majority Leader",
     "firstName": "Richard",
     "middleName": "",
     "lastName": "Furlow",
     "suffix": "",
     "email": "Ward27@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "62 Fairfield Street",
     "zipCode": "06515-2812",
     "phone": "203-507-5796"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "28",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Jill",
     "middleName": "L.",
     "lastName": "Marks",
     "suffix": "",
     "email": "Ward28@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "550 Ellsworth Avenue",
     "zipCode": "06511-1632",
     "phone": "203-891-5232"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "29",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Brian",
     "middleName": "",
     "lastName": "Wingate",
     "suffix": "",
     "email": "Ward29@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "1500 Ella T. Grasso Blvd.",
     "zipCode": "06511-2920",
     "phone": "203-401-9457"
    },
    {
     "levelOfResponsibility": "district",
     "areaOfResponsibility": "30",
     "party": "Democrat",
     "titlePrimary": "Alder",
     "titleSecondary": "",
     "firstName": "Michelle",
     "middleName": "",
     "lastName": "Edmonds-Sepulveda",
     "suffix": "",
     "email": "Ward30@newhavenct.gov",
     "city": "New Haven",
     "state": "Connecticut",
     "streetAddress": "4 Rock Creek Road",
     "zipCode": "06515-1208",
     "phone": "203-843-1290"
    }
  ];
}
