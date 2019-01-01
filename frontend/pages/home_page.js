import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
import http from 'src/frontend/services/http';
import PoliticianSummaryCard from 'src/frontend/components/politician_summary_card';

export default class HomePage extends Component {
  state = {
    loading: false,
    newOfficialModalVisible: false,
    address: '',
    politicians: [],
    error: '',
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
  if (politicians.length < 1) return (<div>No Data</div>);
  return politicians.map(p => <PoliticianSummaryCard politician={p} key={p.id} />);
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
