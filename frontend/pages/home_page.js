import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
import http from 'src/frontend/services/http';
import PoliticianSummaryCard from 'src/frontend/components/politician_summary_card';

import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';
import FormSelect from 'src/frontend/components/form_select';

export default class HomePage extends Component {
  state = {
    loading: false,
    newOfficialModalOpen: false,
    committeeManagementModalOpen: false,
    address: '',
    politicians: [],
    error: '',
    politicianForCommitteeManagement: undefined,
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

  openNewOfficialModal = () => {
    this.setState({ newOfficialModalOpen: true });
  }

  closeNewOfficialModal = () => {
    this.setState({ newOfficialModalOpen: false });
  }

  openCommitteeManagementModal = (politicianForCommitteeManagement) => {
    this.setState({
      politicianForCommitteeManagement,
      committeeManagementModalOpen: true,
    });
  }

  closeCommitteeManagementModal = () => {
    this.setState({
      politicianForCommitteeManagement: undefined,
      committeeManagementModalOpen: false,
    });
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

  renderPoliticians() {
    const { politicians } = this.state;
    if (politicians.length < 1) return (<div>No Data</div>);
    return politicians.map(p => (
      <PoliticianSummaryCard
        politician={p}
        key={p.id}
        manageCommittees={this.openCommitteeManagementModal}
      />
    ));
  }

  render() {
    const {
      address,
      data,
      newOfficialModalOpen,
      committeeManagementModalOpen,
      politicianForCommitteeManagement
    } = this.state;

    return (
      <div className='home-page'>
        {
          newOfficialModalOpen && (
            <NewOfficialModal hideModal={this.closeNewOfficialModal} />
          )
        }
        {
          committeeManagementModalOpen && (
            <CommitteeManagementModal
              hideModal={this.closeCommitteeManagementModal}
              politician={politicianForCommitteeManagement}
            />
          )
        }
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.openNewOfficialModal}>
              <i className='fas fa-plus' /> New Official
            </button>
          </div>
        </header>
        <section className='home-page__content'>
          <div className='content'>
            {
              this.state.error ?
                <div>Error loading data</div>
                : this.renderPoliticians()
            }
          </div>
        </section>
      </div>
    );
  }
}

class CommitteeManagementModal extends PureComponent {
  state = {
    newCommitteeTermFormOpen: false,
  };

  openNewCommitteeTermForm = () => {
    this.setState({ newCommitteeTermFormOpen: true });
  };

  closeNewCommitteeTermForm = () => {
    this.setState({ newCommitteeTermFormOpen: false });
  };

  render() {
    const { newCommitteeTermFormOpen } = this.state;
    const { hideModal, politician } = this.props;
    const {
      committees,
      firstName,
      middleName,
      lastName,
      titlePrimary,
      levelOfResponsibility,
      areaOfResponsibility
    } = politician;
    const politicianFullName = firstName + ' ' + middleName + ' ' + lastName;
    const politicianTitle = titlePrimary + ', ' + levelOfResponsibility + ' ' + areaOfResponsibility;

    return (
      <div>
        <div className='black-overlay' onClick={hideModal} />
        <div className='committee-management-modal'>
          <div className='modal__form'>
            <div className='form-title'>
              Manage Committees
            </div>
            <div className='form-subtitle'>
                { politicianFullName } - { politicianTitle }
            </div>
            <div className='committee-list'>
              {
                committees ? (
                  committees.map((c, i) => <Committee key={i} committee={c} />)
                ) : (
                  <div>
                    { politicianFullName } is not part of any committee
                  </div>
                )
              }
            </div>
            {
              newCommitteeTermFormOpen ? (
                <NewCommitteeTermForm
                  closeNewCommitteeTermForm={this.closeNewCommitteeTermForm}
                  officeHolderTermId={politician.officeHolderTermId}
                />
              ) : null
            }
            {
              newCommitteeTermFormOpen ?
              null
              : (
                <div className='form-buttons'>
                  <button
                    className='button'
                    onClick={this.openNewCommitteeTermForm}
                  >
                    add committee
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

function committeeTermModel(values={}) {
  return {
    committeeId: values.committeeId || '',
    officeHolderTermId: values.officeHolderTermId || '',
    title: values.title || '',
  };
}

function newCommitteeTermFormState() {
  const committeeTerm = committeeTermModel();
  const formValidationState = generateValidationStateForForm({ formFields: committeeTerm });

  return {
    ...committeeTerm,
    ...formValidationState,
  };
}

class NewCommitteeTermForm extends PureComponent {
  // - the officeHolderTermId is a required field but the user doesn't
  //   provide it, it's automatically injected by the code, so no need
  //   to validate it because there's no user-error
  static requiredFields = ['committeeId'];
  state = newCommitteeTermFormState();

  onSubmit = (e) => {
    // console.log(this.state);
    const { officeHolderTermId } = this.props;
    e.preventDefault();
    this.setState({ formMessage: '' });
    try {
      this.validateInputs();
      const values = committeeTermModel({ ...this.state, officeHolderTermId });
      console.log('values on submit', values);
    } catch (errors) {
      console.error(errors);
      this.setState({ ...errors });
    }
  }

  validateInputs() {
    const { requiredFields } = NewCommitteeTermForm;
    const { state } = this;

    const requiredFieldsResult = validateRequiredFields({ requiredFields, state });
    if (!requiredFieldsResult.isValid) throw requiredFieldsResult.errors;
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const { closeNewCommitteeTermForm } = this.props;
    console.log(this.props);
    return (
      <form className='new-committee-term-form' onSubmit={this.onSubmit}>
        <FormSelect
          labelText='Committee*'
          name='committeeId'
          value={this.state.committeeId}
          onChange={this.onChange}
          message={this.state.committeeIdMessage}
          options={committeeOptions()}
        />
        <FormSelect
          labelText='Title'
          name='title'
          value={this.state.title}
          onChange={this.onChange}
          message={this.state.titleMessage}
          options={[
            { value: 'Chair', label: 'Chair' },
            { value: 'Vice-Chair', label: 'Vice-Chair' },
          ]}
        />

        <div className='form-buttons'>
          <button
            className='button'
            type='button'
            onClick={closeNewCommitteeTermForm}
          >
            Cancel
          </button>
          <button className='green-button'>
            Save
          </button>
        </div>
      </form>
    );
  }
}

function committeeOptions() {
  return [
    { value: 1, label: 'Tax Abatement' },
    { value: 2, label: 'Education' },
    { value: 3, label: 'Human Services' },
    { value: 4, label: 'Finance' },
    { value: 5, label: 'Public Safety' },
    { value: 6, label: 'Legislation' },
    { value: 7, label: 'Youth Services' },
    { value: 8, label: 'Community Development' },
    { value: 9, label: 'Aldermanic Affairs' },
    { value: 10, label: 'City Services and Environmental Policy' },
  ];
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
