import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInput from 'src/frontend/components/form_input';
import FormSelect, { FormSelectState } from 'src/frontend/components/form_select';
import http from 'src/frontend/services/http';

export default class HomePage extends Component {
  state = {
    loading: false,
    newOfficialModalVisible: false,
    address: '',
    politicians: [],
    error: '',
    // noteDocs: [],
  }

  componentDidMount() {
    http.get('/politicians').then(res => {
      this.setState({ politicians: res.politicians, error: '' });
    }).catch(err => {
      this.setState({ error: 'error' });
    });
  }

  addNoteDoc = ({ docName }) => {
    this.hideNewNoteDocumentModal();
    this.props.addNotesDocument({ name: docName });
  }

  showNewOfficialModal = () => {
    this.setState({ newOfficialModalVisible: true });
  }

  hideNewOfficialModal = () => {
    this.setState({ newOfficialModalVisible: false });
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

  searchAddress = () => {
    const { address } = this.state;
    if (!address) return;

    http.get('/address?address=' + address).then((res) => {
      console.log('RESPONSE', res);
      if (res.status === 'err') this.setState({ data: res.message });
      else this.setState({ data: res.data });
    });
  }

  updateAddress = (name, address) => {
    this.setState({ address });
  }

  render() {
    const { address, data, newOfficialModalVisible } = this.state;

    return (
      <div className='home-page'>
        {
          newOfficialModalVisible && (
            <NewOfficialModal
              hideModal={this.hideNewOfficialModal}
            />
          )
        }
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.showNewOfficialModal}>
              <i className='fas fa-plus' /> New Official
            </button>
          </div>
        </header>
        <section className='home-page__content'>
          <div className='content'>
            {
              this.state.error ?
                <div>Error loading data</div>
                : renderPoliticians(this.state.politicians)
            }
          </div>
        </section>
      </div>
    );
  }
}

function renderPoliticians(politicians) {
  if (politicians.length < 1) return (<div>Loading data</div>);
  return politicians.map(p => {
    return (
      <div key={p.id} className='card'>
        <div className='name'>
          <span>
            { p.firstName }
          </span> <span>
            { p.middleName }
          </span> <span>
            { p.lastName }
          </span> <span>
            { p.suffix }
          </span>
        </div>
        <div>
          <span>
            { p.levelOfResponsibility }
          </span> <span>
            { p.areaOfResponsibility },
          </span> <span>
            { p.titlePrimary } -
          </span> <span>
            { p.party }
          </span>
        </div>
        <div className='contact-info'>
          { renderContactInfo(p) }
        </div>
      </div>
    )
  });
}

// <div className='form-box'>
//   <FormInput labelText='address' value={address} onChange={this.updateAddress} />
//   <button className='address-search-button' onClick={this.searchAddress}>
//     search
//   </button>
// </div>
// { renderData(data) }

function renderContactInfo(p) {
  const contactInfoKeys = [
    'email',
    'phone',
    'streetAddress',
    'city',
    'state',
    'zipCode',
  ];
  return Object.keys(p).map((key, i) => {
    if (!contactInfoKeys.includes(key)) return;
    return (
      <div key={p.id + key}>
        <span className='key'>{key}</span>
        <span>{p[key]}</span>
      </div>
    );
  });
}

function renderData(data) {
  if (!data) return;
  if (!data.result) return;
  if (!data.result.address_components) return;

  return (
    <div className='address-results'>
      {
        data.result.address_components.map((obj, i) => (
          <div key={obj + i} className='address-results__group'>
            {
              Object.values(obj).map((val, i) => (
                <div key={val + i}>
                  { val }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

function newOfficialModalInitialState() {
  return {
    formMessage: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    party: '',
    titlePrimary: '',
    titleSecondary: '',
    levelOfResponsibility: '',
    areaOfResponsibility: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    firstNameMessage: '',
    middleNameMessage: '',
    lastNameMessage: '',
    suffixMessage: '',
    emailMessage: '',
    partyMessage: '',
    titlePrimaryMessage: '',
    titleSecondaryMessage: '',
    levelOfResponsibilityMessage: '',
    areaOfResponsibilityMessage: '',
    streetAddressMessage: '',
    cityMessage: '',
    stateMessage: '',
    zipCodeMessage: '',
    phoneMessage: '',
  };
}

class NewOfficialModal extends PureComponent {
  state = newOfficialModalInitialState();

  onSubmit = (e) => {
    console.log(this.state);
    e.preventDefault();
    this.setState({ formMessage: '' });
    try {
      this.validateInputs();
      http.post('/politicians', {
        firstName: this.state.firstName,
        middleName: this.state.middleName,
        lastName: this.state.lastName,
        suffix: this.state.suffix,
        email: this.state.email,
        party: this.state.party,
        titlePrimary: this.state.titlePrimary,
        titleSecondary: this.state.titleSecondary,
        levelOfResponsibility: this.state.levelOfResponsibility,
        areaOfResponsibility: this.state.areaOfResponsibility,
        streetAddress: this.state.streetAddress,
        city: this.state.city,
        state: this.state.state,
        zipCode: this.state.zipCode,
        phone: this.state.phone,
      }).then(res => {
        this.setState({
          ...newOfficialModalInitialState(),
          formMessage: 'Successfully created new official',
        });
        console.log(res);
      }).catch(err => {
        const errorMessage = err.message || 'There was an error';
        this.setState({ formMessage: errorMessage });
        console.warn(err);
      });
    } catch (errors) {
      this.setState({ ...errors });
    }
  }

  validateInputs() {
    let formValid = true;
    const errors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'titlePrimary',
      'levelOfResponsibility',
      'areaOfResponsibility',
      'city',
      'state',
    ];

    requiredFields.forEach((field) => {
      const value = this.state[field];
      if (!value) {
        formValid = false;
        errors[field + 'Message'] = 'This field is required';
      } else {
        errors[field + 'Message'] = '';
      }
    });

    const { titlePrimary, levelOfResponsibility } = this.state;
    if (titlePrimary === 'alder' && levelOfResponsibility !== 'district') {
      errors.formMessage = "An Alder's 'Level of Responsibility' should be 'District'";
      formValid = false;
    } else if (titlePrimary === 'mayor' && levelOfResponsibility !== 'city') {
      errors.formMessage = "A Mayor's 'Level of Responsibility' should be 'City'";
      formValid = false;
    }

    if (!formValid) throw errors;
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const { hideModal } = this.props;

    return (
      <div>
        <div className='black-overlay' onClick={hideModal} />
        <div className='new-official-modal'>
          <form onSubmit={this.onSubmit}>
            <div className='form-title'>
              Create a New Official
            </div>
            <div className='form-columns'>
              <div className='form-column'>
                <div className='form-column__title'>
                  Personal
                </div>
                <FormInput
                  labelText='First Name*'
                  onChange={this.onChange}
                  name='firstName'
                  value={this.state.firstName}
                  message={this.state.firstNameMessage}
                />
                <FormInput
                  labelText='Middle Name'
                  onChange={this.onChange}
                  name='middleName'
                  value={this.state.middleName}
                  message={this.state.middleNameMessage}
                />
                <FormInput
                  labelText='Last Name*'
                  onChange={this.onChange}
                  name='lastName'
                  value={this.state.lastName}
                  message={this.state.lastNameMessage}
                />
                <FormInput
                  labelText='Suffix'
                  onChange={this.onChange}
                  name='suffix'
                  value={this.state.suffix}
                  message={this.state.suffixMessage}
                />
                <FormInput
                  labelText='Email'
                  onChange={this.onChange}
                  name='email'
                  value={this.state.email}
                  message={this.state.emailMessage}
                />
              </div>
              <div className='form-column'>
                <div className='form-column__title'>
                  Political
                </div>
                <FormSelect
                  placeholder='Party'
                  name='party'
                  onChange={this.onChange}
                  message={this.state.partyMessage}
                  options={[
                    { value: '', label: 'Party', isDisabled: true },
                    { value: 'democratic', label: 'Democratic' },
                    { value: 'republican', label: 'Republican' },
                  ]}
                />
                <FormSelect
                  placeholder='Primary Title*'
                  name='titlePrimary'
                  onChange={this.onChange}
                  message={this.state.titlePrimaryMessage}
                  options={[
                    { value: '', label: 'Primary Title', isDisabled: true },
                    { value: 'alder', label: 'Alder' },
                    { value: 'mayor', label: 'Mayor' },
                  ]}
                />
                <FormInput
                  labelText='Secondary Title'
                  onChange={this.onChange}
                  name='titleSecondary'
                  value={this.state.titleSecondary}
                  message={this.state.titleSecondaryMessage}
                />
                <FormSelect
                  placeholder='Level of Responsibility*'
                  name='levelOfResponsibility'
                  onChange={this.onChange}
                  message={this.state.levelOfResponsibilityMessage}
                  options={[
                    { value: '', label: 'Level of Responsibility', isDisabled: true },
                    { value: 'district', label: 'District' },
                    { value: 'city', label: 'City' },
                    { value: 'state', label: 'State' },
                  ]}
                />
                <FormSelect
                  placeholder='Area of Responsibility*'
                  name='areaOfResponsibility'
                  onChange={this.onChange}
                  message={this.state.areaOfResponsibilityMessage}
                  options={[
                    { value: '', label: 'Area of Responsibility', isDisabled: true },
                    { value: 'new haven', label: 'New Haven' },
                    { value: 'connecticut', label: 'Connecticut' },
                  ]}
                />
              </div>
              <div className='form-column'>
                <div className='form-column__title'>
                  Contact
                </div>
                <FormInput
                  labelText='Phone Number'
                  onChange={this.onChange}
                  name='phone'
                  value={this.state.phone}
                  message={this.state.phoneMessage}
                />
                <FormInput
                  labelText='Address'
                  onChange={this.onChange}
                  name='streetAddress'
                  value={this.state.address}
                  message={this.state.streetAddressMessage}
                />
                <FormSelect
                  placeholder='City*'
                  name='city'
                  onChange={this.onChange}
                  message={this.state.cityMessage}
                  options={[
                    { value: '', label: 'City', isDisabled: true },
                    { value: 'new haven', label: 'New Haven' },
                  ]}
                />
                <FormSelectState
                  isRequired
                  name='state'
                  onChange={this.onChange}
                  message={this.state.stateMessage}
                />
                <FormInput
                  labelText='Zip Code'
                  onChange={this.onChange}
                  name='zipCode'
                  value={this.state.zipCode}
                  message={this.state.zipCodeMessage}
                />
              </div>
            </div>
            <div className='form-messages'>
              { this.state.formMessage }
            </div>
            <div className='form-buttons'>
              <button type='button' className='button' onClick={hideModal}>
                Cancel
              </button>
              <button className='green-button'>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )
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

function buildMapRequest() {
  `
  https://nhgis.newhavenct.gov/server/rest/services/Web_Services/New_Haven_Wards/MapServer/0/
  query?
  f=json
  &
  returnGeometry=true
  &
  spatialRel=esriSpatialRelIntersects
  &
  geometry=
    %7B%22
    xmin%22%3A-8115016.539807044%2C%22
    ymin%22%3A5052278.334613052%2C%22
    xmax%22%3A-8115012.956821344%2C%22
    ymax%22%3A5052281.917598751%2C%22
    spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D
  &
  geometryType=esriGeometryEnvelope
  &
  inSR=102100
  &
  outFields=OBJECTID
    %2CWARDS
    %2CWarrds_txt
    %2CWards_desc
    %2CAlder
    %2CLCI_Ward_Group
    %2CORIG_FID
    %2CAlder_addr
    %2CAlder_City
    %2CAlder_Zip
    %2CAlder_img
    %2CAlder_Bio
    %2CAlder_email
    %2CAlder_phone
  &
  outSR=102100
  `
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
