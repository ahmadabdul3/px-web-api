import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
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
            <NewOfficialModal hideModal={this.hideNewOfficialModal} />
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


// this stuff below here is for when I had that google address finder thing
//
// <div className='form-box'>
//   <FormInput labelText='address' value={address} onChange={this.updateAddress} />
//   <button className='address-search-button' onClick={this.searchAddress}>
//     search
//   </button>
// </div>
// { renderData(data) }
//
// function renderData(data) {
//   if (!data) return;
//   if (!data.result) return;
//   if (!data.result.address_components) return;
//
//   return (
//     <div className='address-results'>
//       {
//         data.result.address_components.map((obj, i) => (
//           <div key={obj + i} className='address-results__group'>
//             {
//               Object.values(obj).map((val, i) => (
//                 <div key={val + i}>
//                   { val }
//                 </div>
//               ))
//             }
//           </div>
//         ))
//       }
//     </div>
//   )
// }
